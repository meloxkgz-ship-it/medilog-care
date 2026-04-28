import AVFoundation
import CryptoKit
import Foundation
import LocalAuthentication
import Security
import StoreKit
import SwiftUI
import UIKit
import UserNotifications
import WebKit

final class NativeBridge: NSObject, WKScriptMessageHandler {
    weak var webView: WKWebView?

    private let secureStore = SecureStateStore()
    private let entitlementStore = PremiumEntitlementStore()
    private let notificationCenter = UNUserNotificationCenter.current()
    private let notificationIdsKey = "medilog.notification.ids"

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard
            let body = message.body as? [String: Any],
            let id = body["id"] as? String,
            let action = body["action"] as? String
        else { return }

        let payload = body["payload"] as? [String: Any] ?? [:]

        Task {
            do {
                let result = try await handle(action: action, payload: payload)
                await MainActor.run {
                    self.reply(id: id, result: result, error: nil)
                }
            } catch {
                await MainActor.run {
                    self.reply(id: id, result: NSNull(), error: error.localizedDescription)
                }
            }
        }
    }

    private func handle(action: String, payload: [String: Any]) async throws -> Any {
        switch action {
        case "environment":
            return [
                "platform": "ios",
                "secureStorage": true,
                "notifications": "native",
                "cameraScan": UIImagePickerController.isSourceTypeAvailable(.camera),
                "biometrics": canEvaluateBiometrics(),
            ]

        case "loadSecureState":
            return try secureStore.loadStateEnvelope()

        case "saveSecureState":
            guard let state = payload["state"] else { throw NativeBridgeError.invalidPayload }
            return try secureStore.save(state: state)

        case "resetSecureState":
            try secureStore.reset()
            await cancelScheduledReminders()
            return ["reset": true]

        case "requestNotifications":
            let granted = try await requestNotificationAuthorization()
            return ["granted": granted]

        case "scheduleReminders":
            return try await scheduleReminders(payload: payload)

        case "cancelReminders":
            await cancelScheduledReminders()
            return ["cancelled": true]

        case "biometricUnlock":
            let unlocked = try await authenticateWithBiometrics()
            return ["unlocked": unlocked]

        case "premiumStatus":
            return await entitlementStore.status()

        case "premiumProducts":
            return try await entitlementStore.productsEnvelope()

        case "purchasePremium":
            let presenter = await MainActor.run { presentingViewController() }
            return try await entitlementStore.purchase(productId: payload["productId"] as? String, presenting: presenter)

        case "restorePurchases":
            return try await entitlementStore.restore()

        case "startPlanScan":
            return try await startPlanScan()

        default:
            throw NativeBridgeError.unknownAction
        }
    }

    @MainActor
    private func presentingViewController() -> UIViewController? {
        topViewController()
    }

    @MainActor
    private func reply(id: String, result: Any, error: String?) {
        let idJson = jsonString(id)
        let resultJson = jsonObject(result)
        let errorJson = error.map(jsonString) ?? "null"
        webView?.evaluateJavaScript("window.__medilogNativeResolve(\(idJson), \(resultJson), \(errorJson));")
    }

    private func requestNotificationAuthorization() async throws -> Bool {
        try await withCheckedThrowingContinuation { continuation in
            notificationCenter.requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
                if let error {
                    continuation.resume(throwing: error)
                } else {
                    continuation.resume(returning: granted)
                }
            }
        }
    }

    private func scheduleReminders(payload: [String: Any]) async throws -> [String: Any] {
        let granted = try await requestNotificationAuthorization()
        guard granted else { return ["granted": false, "scheduled": 0] }

        await cancelScheduledReminders()

        let delayMinutes = max(1, payload["delayMinutes"] as? Int ?? 15)
        let daysAhead = min(max(payload["daysAhead"] as? Int ?? 14, 1), 14)
        let profileName = payload["profileName"] as? String ?? "Profil"
        let rawMedicines = payload["medicines"] as? [[String: Any]] ?? []
        let completedByDate = completedMedicineIdsByDate(from: payload)
        let calendar = Calendar.autoupdatingCurrent
        let now = Date()
        let today = calendar.startOfDay(for: now)
        let maxPendingNotifications = 60
        var identifiers: [String] = []

        for medicine in rawMedicines {
            guard
                let id = medicine["id"] as? String,
                let name = medicine["name"] as? String,
                let dose = medicine["dose"] as? String,
                let time = medicine["time"] as? String,
                let minutes = minutesSinceMidnight(time)
            else { continue }

            for offset in 0..<daysAhead {
                guard identifiers.count < maxPendingNotifications else { break }
                guard let day = calendar.date(byAdding: .day, value: offset, to: today) else { continue }
                let dateKey = dateKey(for: day)
                if completedByDate[dateKey]?.contains(id) == true { continue }
                guard let firstDate = date(on: day, minutesSinceMidnight: minutes) else { continue }

                let firstId = "medilog-dose-\(id)-\(dateKey)"
                if firstDate > now {
                    scheduleNotification(
                        id: firstId,
                        title: "MediLog Erinnerung",
                        body: "\(name) \(dose) ist fuer \(profileName) geplant. Bitte nur laut eigenem Plan handeln.",
                        date: firstDate
                    )
                    identifiers.append(firstId)
                }

                guard identifiers.count < maxPendingNotifications else { break }
                let followUpDate = calendar.date(byAdding: .minute, value: delayMinutes, to: firstDate) ?? firstDate
                let followUpId = "medilog-dose-\(id)-\(dateKey)-followup"
                if followUpDate > now {
                    scheduleNotification(
                        id: followUpId,
                        title: "MediLog Nachfassen",
                        body: "\(name) ist noch offen dokumentiert. Wenn bereits erledigt, bitte abhaken.",
                        date: followUpDate
                    )
                    identifiers.append(followUpId)
                }
            }
        }

        UserDefaults.standard.set(identifiers, forKey: notificationIdsKey)
        return ["granted": true, "scheduled": identifiers.count]
    }

    private func scheduleNotification(id: String, title: String, body: String, date: Date) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        content.userInfo = ["source": "medilog", "id": id]

        let components = Calendar.autoupdatingCurrent.dateComponents([.year, .month, .day, .hour, .minute], from: date)
        let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
        notificationCenter.add(UNNotificationRequest(identifier: id, content: content, trigger: trigger))
    }

    private func cancelScheduledReminders() async {
        let ids = UserDefaults.standard.stringArray(forKey: notificationIdsKey) ?? []
        notificationCenter.removePendingNotificationRequests(withIdentifiers: ids)
        notificationCenter.removeDeliveredNotifications(withIdentifiers: ids)
        UserDefaults.standard.removeObject(forKey: notificationIdsKey)
    }

    private func minutesSinceMidnight(_ value: String) -> Int? {
        let parts = value.split(separator: ":").compactMap { Int($0) }
        guard parts.count == 2, parts[0] >= 0, parts[0] <= 23, parts[1] >= 0, parts[1] <= 59 else {
            return nil
        }
        return parts[0] * 60 + parts[1]
    }

    private func date(on day: Date, minutesSinceMidnight minutes: Int) -> Date? {
        let calendar = Calendar.autoupdatingCurrent
        var components = calendar.dateComponents([.year, .month, .day], from: day)
        components.hour = minutes / 60
        components.minute = minutes % 60
        components.second = 0
        return calendar.date(from: components)
    }

    private func dateKey(for date: Date) -> String {
        let components = Calendar.autoupdatingCurrent.dateComponents([.year, .month, .day], from: date)
        return String(
            format: "%04d-%02d-%02d",
            components.year ?? 0,
            components.month ?? 0,
            components.day ?? 0
        )
    }

    private func completedMedicineIdsByDate(from payload: [String: Any]) -> [String: Set<String>] {
        guard let rawCompleted = payload["completed"] as? [String: Any] else { return [:] }

        return rawCompleted.reduce(into: [String: Set<String>]()) { result, item in
            guard let medicines = item.value as? [String: Any] else { return }
            let completedIds = medicines.compactMap { medicineId, value -> String? in
                if let isDone = value as? Bool, isDone { return medicineId }
                if let number = value as? NSNumber, number.boolValue { return medicineId }
                return nil
            }
            if !completedIds.isEmpty {
                result[item.key] = Set(completedIds)
            }
        }
    }

    private func canEvaluateBiometrics() -> Bool {
        let context = LAContext()
        var error: NSError?
        return context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error)
    }

    private func authenticateWithBiometrics() async throws -> Bool {
        let context = LAContext()
        var error: NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
            return false
        }

        return try await context.evaluatePolicy(
            .deviceOwnerAuthenticationWithBiometrics,
            localizedReason: "MediLog Vault entsperren"
        )
    }

    @MainActor
    private func startPlanScan() async throws -> [String: Any] {
        guard UIImagePickerController.isSourceTypeAvailable(.camera) else {
            throw NativeBridgeError.cameraUnavailable
        }

        let authorized = try await requestCameraAccess()
        guard authorized else { throw NativeBridgeError.cameraDenied }

        guard let presenter = topViewController() else { throw NativeBridgeError.presentationUnavailable }

        return try await withCheckedThrowingContinuation { continuation in
            let scanner = QRScannerViewController { result in
                switch result {
                case .success(let code):
                    continuation.resume(returning: ["value": code])
                case .failure(let error):
                    continuation.resume(throwing: error)
                }
            }
            presenter.present(scanner, animated: true)
        }
    }

    private func requestCameraAccess() async throws -> Bool {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            return true
        case .notDetermined:
            return await AVCaptureDevice.requestAccess(for: .video)
        case .denied, .restricted:
            return false
        @unknown default:
            return false
        }
    }

    @MainActor
    private func topViewController() -> UIViewController? {
        let scenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
        let root = scenes.flatMap { $0.windows }.first { $0.isKeyWindow }?.rootViewController
        var current = root
        while let presented = current?.presentedViewController {
            current = presented
        }
        return current
    }
}

final class QRScannerViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate {
    private let session = AVCaptureSession()
    private var previewLayer: AVCaptureVideoPreviewLayer?
    private let completion: (Result<String, Error>) -> Void
    private var completed = false

    init(completion: @escaping (Result<String, Error>) -> Void) {
        self.completion = completion
        super.init(nibName: nil, bundle: nil)
        modalPresentationStyle = .fullScreen
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        configureScanner()
        configureOverlay()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        previewLayer?.frame = view.bounds
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        session.stopRunning()
    }

    private func configureScanner() {
        guard let device = AVCaptureDevice.default(for: .video) else {
            finish(.failure(NativeBridgeError.cameraUnavailable))
            return
        }

        do {
            let input = try AVCaptureDeviceInput(device: device)
            let output = AVCaptureMetadataOutput()

            guard session.canAddInput(input), session.canAddOutput(output) else {
                finish(.failure(NativeBridgeError.cameraUnavailable))
                return
            }

            session.addInput(input)
            session.addOutput(output)
            output.setMetadataObjectsDelegate(self, queue: .main)
            output.metadataObjectTypes = [.qr]

            let previewLayer = AVCaptureVideoPreviewLayer(session: session)
            previewLayer.videoGravity = .resizeAspectFill
            view.layer.insertSublayer(previewLayer, at: 0)
            self.previewLayer = previewLayer

            DispatchQueue.global(qos: .userInitiated).async { [session] in
                session.startRunning()
            }
        } catch {
            finish(.failure(error))
        }
    }

    private func configureOverlay() {
        let title = UILabel()
        title.translatesAutoresizingMaskIntoConstraints = false
        title.text = "Medikationsplan scannen"
        title.textColor = .white
        title.font = .systemFont(ofSize: 22, weight: .bold)

        let helper = UILabel()
        helper.translatesAutoresizingMaskIntoConstraints = false
        helper.text = "QR-Code in den Rahmen halten. Es wird nichts automatisch bewertet."
        helper.textColor = UIColor.white.withAlphaComponent(0.74)
        helper.font = .systemFont(ofSize: 15, weight: .semibold)
        helper.numberOfLines = 2

        let frame = UIView()
        frame.translatesAutoresizingMaskIntoConstraints = false
        frame.layer.borderWidth = 3
        frame.layer.borderColor = UIColor(red: 0.57, green: 0.91, blue: 0.63, alpha: 1).cgColor
        frame.layer.cornerRadius = 26
        frame.backgroundColor = UIColor.clear

        let close = UIButton(type: .system)
        close.translatesAutoresizingMaskIntoConstraints = false
        close.setTitle("Abbrechen", for: .normal)
        close.setTitleColor(.white, for: .normal)
        close.titleLabel?.font = .systemFont(ofSize: 16, weight: .bold)
        close.backgroundColor = UIColor.black.withAlphaComponent(0.48)
        close.layer.cornerRadius = 22
        close.addTarget(self, action: #selector(cancel), for: .touchUpInside)

        [title, helper, frame, close].forEach(view.addSubview)

        NSLayoutConstraint.activate([
            title.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: 24),
            title.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -24),
            title.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 28),
            helper.leadingAnchor.constraint(equalTo: title.leadingAnchor),
            helper.trailingAnchor.constraint(equalTo: title.trailingAnchor),
            helper.topAnchor.constraint(equalTo: title.bottomAnchor, constant: 10),
            frame.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            frame.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            frame.widthAnchor.constraint(equalTo: view.widthAnchor, multiplier: 0.72),
            frame.heightAnchor.constraint(equalTo: frame.widthAnchor),
            close.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: 24),
            close.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -24),
            close.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -28),
            close.heightAnchor.constraint(equalToConstant: 52),
        ])
    }

    @objc private func cancel() {
        finish(.failure(NativeBridgeError.scanCancelled))
    }

    func metadataOutput(
        _ output: AVCaptureMetadataOutput,
        didOutput metadataObjects: [AVMetadataObject],
        from connection: AVCaptureConnection
    ) {
        guard
            let readable = metadataObjects.first as? AVMetadataMachineReadableCodeObject,
            let value = readable.stringValue
        else { return }

        finish(.success(value))
    }

    private func finish(_ result: Result<String, Error>) {
        guard !completed else { return }
        completed = true
        session.stopRunning()
        dismiss(animated: true) { [completion] in
            completion(result)
        }
    }
}

final class SecureStateStore {
    private let service = "com.medilog.care.secure-state"
    private let account = "state-key"
    private let fileName = "medilog-secure-state.bin"
    private let fallbackKeyFileName = "medilog-secure-state.key"

    func save(state: Any) throws -> [String: Any] {
        let plain = try JSONSerialization.data(withJSONObject: state, options: [])
        let sealed = try AES.GCM.seal(plain, using: try loadOrCreateKey())
        guard let combined = sealed.combined else { throw NativeBridgeError.encryptionFailed }

        try FileManager.default.createDirectory(at: storageDirectory, withIntermediateDirectories: true)
        try combined.write(to: storageURL, options: [.atomic, .completeFileProtection])

        return [
            "saved": true,
            "encrypted": true,
            "updatedAt": ISO8601DateFormatter().string(from: Date()),
        ]
    }

    func loadStateEnvelope() throws -> [String: Any] {
        let url = try storageURL
        guard FileManager.default.fileExists(atPath: url.path) else {
            return ["exists": false, "encrypted": true]
        }

        let data = try Data(contentsOf: url)
        let box = try AES.GCM.SealedBox(combined: data)
        let plain = try AES.GCM.open(box, using: try loadOrCreateKey())
        let state = try JSONSerialization.jsonObject(with: plain, options: [])

        return ["exists": true, "encrypted": true, "state": state]
    }

    func reset() throws {
        let url = try storageURL
        if FileManager.default.fileExists(atPath: url.path) {
            try FileManager.default.removeItem(at: url)
        }
        let fallbackURL = try fallbackKeyURL
        if FileManager.default.fileExists(atPath: fallbackURL.path) {
            try FileManager.default.removeItem(at: fallbackURL)
        }

        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
        ]
        SecItemDelete(query as CFDictionary)
    }

    private var storageDirectory: URL {
        get throws {
            try FileManager.default
                .url(for: .applicationSupportDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
                .appendingPathComponent("MediLog", isDirectory: true)
        }
    }

    private var storageURL: URL {
        get throws {
            try storageDirectory.appendingPathComponent(fileName)
        }
    }

    private var fallbackKeyURL: URL {
        get throws {
            try storageDirectory.appendingPathComponent(fallbackKeyFileName)
        }
    }

    private func loadOrCreateKey() throws -> SymmetricKey {
        if let stored = try? readKeyData() {
            return SymmetricKey(data: stored)
        }

        if let fallback = try? Data(contentsOf: fallbackKeyURL), fallback.count == 32 {
            return SymmetricKey(data: fallback)
        }

        var keyData = Data(count: 32)
        let result = keyData.withUnsafeMutableBytes { buffer in
            SecRandomCopyBytes(kSecRandomDefault, 32, buffer.baseAddress!)
        }
        guard result == errSecSuccess else { throw NativeBridgeError.encryptionFailed }

        do {
            try storeKeyData(keyData)
        } catch {
            try FileManager.default.createDirectory(at: storageDirectory, withIntermediateDirectories: true)
            try keyData.write(to: fallbackKeyURL, options: [.atomic, .completeFileProtection])
        }

        return SymmetricKey(data: keyData)
    }

    private func readKeyData() throws -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        if status == errSecItemNotFound { return nil }
        guard status == errSecSuccess else { throw NativeBridgeError.encryptionFailed }
        return item as? Data
    }

    private func storeKeyData(_ data: Data) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly,
            kSecValueData as String: data,
        ]

        SecItemDelete(query as CFDictionary)
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else { throw NativeBridgeError.encryptionFailed }
    }
}

final class PremiumEntitlementStore: NSObject, UIAdaptivePresentationControllerDelegate {
    private let productIds = [
        "com.medilog.care.premium.monthly",
        "com.medilog.care.premium.yearly",
    ]
    private let activeKey = "medilog.premium.active"
    private let sourceKey = "medilog.premium.source"
    private let expiresKey = "medilog.premium.expiresAt"
    private var storeContinuation: CheckedContinuation<[String: Any], Error>?
    private weak var storeController: UIViewController?

    func status() async -> [String: Any] {
        await refreshFromCurrentEntitlements()
        return cachedStatus()
    }

    func productsEnvelope() async throws -> [String: Any] {
        let products = try await Product.products(for: productIds)
        if products.isEmpty {
            #if DEBUG
            return ["products": fallbackProducts()]
            #else
            throw NativeBridgeError.storeKitProductsUnavailable
            #endif
        }

        return ["products": products.sorted(by: productSort).map(productPayload)]
    }

    func purchase(productId: String?, presenting presenter: UIViewController?) async throws -> [String: Any] {
        if let presenter {
            return try await presentNativeSubscriptionStore(productId: productId, presenter: presenter)
        }

        return try await purchaseDirectly(productId: productId)
    }

    private func purchaseDirectly(productId: String?) async throws -> [String: Any] {
        let products = try await Product.products(for: productIds)
        let product = product(from: products, matching: productId) ?? preferredProduct(from: products)
        guard let product else {
            #if DEBUG
            return grantSimulatorEntitlement()
            #else
            throw NativeBridgeError.storeKitProductsUnavailable
            #endif
        }

        let result = try await product.purchase()
        switch result {
        case .success(let verification):
            let transaction = try verified(verification)
            saveEntitlement(productId: transaction.productID, expirationDate: transaction.expirationDate)
            await transaction.finish()
            return cachedStatus()

        case .pending:
            return pendingStatus()

        case .userCancelled:
            throw NativeBridgeError.purchaseCancelled

        @unknown default:
            throw NativeBridgeError.storeKitVerificationFailed
        }
    }

    @MainActor
    private func presentNativeSubscriptionStore(productId: String?, presenter: UIViewController) async throws -> [String: Any] {
        guard storeContinuation == nil else { throw NativeBridgeError.purchaseAlreadyInProgress }

        return try await withCheckedThrowingContinuation { continuation in
            storeContinuation = continuation

            let storeView = NativePremiumStoreView(
                productIds: productIds,
                selectedProductId: productId,
                onPurchaseCompletion: { [weak self] product, result in
                    await self?.completeNativeStorePurchase(product: product, result: result)
                },
                onClose: { [weak self] in
                    await self?.completeNativeStoreDismissal()
                }
            )

            let controller = UIHostingController(rootView: storeView)
            controller.modalPresentationStyle = .formSheet
            controller.presentationController?.delegate = self
            storeController = controller
            presenter.present(controller, animated: true)
        }
    }

    @MainActor
    private func completeNativeStorePurchase(product: Product, result: Result<Product.PurchaseResult, Error>) async {
        guard let continuation = storeContinuation else { return }
        storeContinuation = nil

        storeController?.dismiss(animated: true)
        storeController = nil

        do {
            switch result {
            case .success(.success(let verification)):
                let transaction = try verified(verification)
                saveEntitlement(productId: transaction.productID, expirationDate: transaction.expirationDate)
                await transaction.finish()
                continuation.resume(returning: cachedStatus())

            case .success(.pending):
                continuation.resume(returning: pendingStatus())

            case .success(.userCancelled):
                continuation.resume(throwing: NativeBridgeError.purchaseCancelled)

            case .failure(let error):
                continuation.resume(throwing: error)

            @unknown default:
                continuation.resume(throwing: NativeBridgeError.storeKitVerificationFailed)
            }
        } catch {
            continuation.resume(throwing: error)
        }
    }

    @MainActor
    private func completeNativeStoreDismissal() async {
        guard let continuation = storeContinuation else { return }
        storeContinuation = nil
        storeController = nil
        await refreshFromCurrentEntitlements()
        continuation.resume(returning: cachedStatus())
    }

    @MainActor
    func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
        Task { @MainActor in
            await completeNativeStoreDismissal()
        }
    }

    func restore() async throws -> [String: Any] {
        try await AppStore.sync()
        await refreshFromCurrentEntitlements()
        return cachedStatus()
    }

    private func preferredProduct(from products: [Product]) -> Product? {
        products.first { $0.id == "com.medilog.care.premium.yearly" } ?? products.first
    }

    private func product(from products: [Product], matching productId: String?) -> Product? {
        guard let productId, productIds.contains(productId) else { return nil }
        return products.first { $0.id == productId }
    }

    private func productSort(_ lhs: Product, _ rhs: Product) -> Bool {
        productRank(lhs.id) < productRank(rhs.id)
    }

    private func productRank(_ productId: String) -> Int {
        switch productId {
        case "com.medilog.care.premium.yearly": return 0
        case "com.medilog.care.premium.monthly": return 1
        default: return 9
        }
    }

    private func productPayload(_ product: Product) -> [String: Any] {
        [
            "id": product.id,
            "displayName": product.displayName,
            "description": product.description,
            "displayPrice": product.displayPrice,
            "period": periodLabel(for: product.subscription?.subscriptionPeriod),
            "level": productRank(product.id) + 1,
            "featured": product.id == "com.medilog.care.premium.yearly",
        ]
    }

    private func periodLabel(for period: Product.SubscriptionPeriod?) -> String {
        guard let period else { return "" }
        if period.value == 1 {
            switch period.unit {
            case .day: return "pro Tag"
            case .week: return "pro Woche"
            case .month: return "pro Monat"
            case .year: return "pro Jahr"
            @unknown default: return "pro Zeitraum"
            }
        }

        switch period.unit {
        case .day: return "alle \(period.value) Tage"
        case .week: return "alle \(period.value) Wochen"
        case .month: return "alle \(period.value) Monate"
        case .year: return "alle \(period.value) Jahre"
        @unknown default: return "alle \(period.value) Zeitraeume"
        }
    }

    private func refreshFromCurrentEntitlements() async {
        var latestProductId: String?
        var latestExpirationDate: Date?

        for await result in Transaction.currentEntitlements {
            guard
                let transaction = try? verified(result),
                productIds.contains(transaction.productID),
                transaction.revocationDate == nil
            else { continue }

            if let expirationDate = transaction.expirationDate, expirationDate < Date() {
                continue
            }

            if latestExpirationDate == nil || (transaction.expirationDate ?? .distantFuture) > (latestExpirationDate ?? .distantPast) {
                latestProductId = transaction.productID
                latestExpirationDate = transaction.expirationDate
            }
        }

        if let latestProductId {
            saveEntitlement(productId: latestProductId, expirationDate: latestExpirationDate)
        } else if UserDefaults.standard.string(forKey: sourceKey)?.hasPrefix("com.medilog.care.premium.") == true {
            clearEntitlement()
        }
    }

    private func verified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .verified(let value):
            return value
        case .unverified:
            throw NativeBridgeError.storeKitVerificationFailed
        }
    }

    private func saveEntitlement(productId: String, expirationDate: Date?) {
        UserDefaults.standard.set(true, forKey: activeKey)
        UserDefaults.standard.set(productId, forKey: sourceKey)
        if let expirationDate {
            UserDefaults.standard.set(ISO8601DateFormatter().string(from: expirationDate), forKey: expiresKey)
        } else {
            UserDefaults.standard.removeObject(forKey: expiresKey)
        }
    }

    private func clearEntitlement() {
        UserDefaults.standard.set(false, forKey: activeKey)
        UserDefaults.standard.set("none", forKey: sourceKey)
        UserDefaults.standard.removeObject(forKey: expiresKey)
    }

    private func cachedStatus() -> [String: Any] {
        var status: [String: Any] = [
            "active": UserDefaults.standard.bool(forKey: activeKey),
            "source": UserDefaults.standard.string(forKey: sourceKey) ?? "none",
        ]

        if let expiresAt = UserDefaults.standard.string(forKey: expiresKey) {
            status["expiresAt"] = expiresAt
        } else {
            status["expiresAt"] = NSNull()
        }

        return status
    }

    private func pendingStatus() -> [String: Any] {
        [
            "active": false,
            "source": "storekit-pending",
            "expiresAt": NSNull(),
            "pending": true,
        ]
    }

    #if DEBUG
    private func fallbackProducts() -> [[String: Any]] {
        [
            [
                "id": "com.medilog.care.premium.yearly",
                "displayName": "MediLog Premium Jaehrlich",
                "description": "Familie, Vorrat, Export, Vault, QR und zuverlaessige Erinnerungen.",
                "displayPrice": "29,99 €",
                "period": "pro Jahr",
                "level": 1,
                "featured": true,
            ],
            [
                "id": "com.medilog.care.premium.monthly",
                "displayName": "MediLog Premium Monatlich",
                "description": "Premium monatlich flexibel nutzen.",
                "displayPrice": "3,99 €",
                "period": "pro Monat",
                "level": 2,
                "featured": false,
            ],
        ]
    }

    private func grantSimulatorEntitlement() -> [String: Any] {
        let expiresAt = Calendar.current.date(byAdding: .year, value: 1, to: Date()) ?? Date()
        UserDefaults.standard.set(true, forKey: activeKey)
        UserDefaults.standard.set("simulator-entitlement", forKey: sourceKey)
        UserDefaults.standard.set(ISO8601DateFormatter().string(from: expiresAt), forKey: expiresKey)
        return cachedStatus()
    }
    #endif
}

private struct NativePremiumStoreView: View {
    let productIds: [Product.ID]
    let selectedProductId: Product.ID?
    let onPurchaseCompletion: (Product, Result<Product.PurchaseResult, Error>) async -> Void
    let onClose: () async -> Void

    private let privacyURL = URL(string: "https://meloxkgz-ship-it.github.io/medilog-care/privacy.html")!
    private let termsURL = URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!

    var body: some View {
        NavigationStack {
            SubscriptionStoreView(productIDs: orderedProductIds) {
                VStack(alignment: .leading, spacing: 12) {
                    Text("MediLog Premium")
                        .font(.largeTitle.bold())
                    Text("Familienmodus, Vorrat, Export, Vault, QR-Scan und zuverlaessige Erinnerungen.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    Label("Lokal, verschluesselt, keine Cloud", systemImage: "lock.shield")
                        .font(.footnote.weight(.semibold))
                        .foregroundStyle(.green)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.bottom, 8)
            }
            .subscriptionStoreButtonLabel(.multiline)
            .storeButton(.visible, for: .restorePurchases, .policies)
            .subscriptionStorePolicyDestination(url: privacyURL, for: .privacyPolicy)
            .subscriptionStorePolicyDestination(url: termsURL, for: .termsOfService)
            .onInAppPurchaseCompletion { product, result in
                await onPurchaseCompletion(product, result)
            }
            .navigationTitle("Premium")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Schliessen") {
                        Task { await onClose() }
                    }
                }
            }
        }
    }

    private var orderedProductIds: [Product.ID] {
        guard let selectedProductId,
              productIds.contains(selectedProductId)
        else { return productIds }

        return [selectedProductId] + productIds.filter { $0 != selectedProductId }
    }
}

enum NativeBridgeError: LocalizedError {
    case invalidPayload
    case unknownAction
    case encryptionFailed
    case cameraUnavailable
    case cameraDenied
    case presentationUnavailable
    case scanCancelled
    case storeKitProductsUnavailable
    case storeKitVerificationFailed
    case purchaseCancelled
    case purchaseAlreadyInProgress

    var errorDescription: String? {
        switch self {
        case .invalidPayload:
            return "Ungueltige native Daten."
        case .unknownAction:
            return "Unbekannte native Aktion."
        case .encryptionFailed:
            return "Lokale Verschluesselung ist fehlgeschlagen."
        case .cameraUnavailable:
            return "Kamera ist auf diesem Geraet nicht verfuegbar."
        case .cameraDenied:
            return "Kamera-Zugriff wurde nicht erlaubt."
        case .presentationUnavailable:
            return "Scanner konnte nicht angezeigt werden."
        case .scanCancelled:
            return "Scan abgebrochen."
        case .storeKitProductsUnavailable:
            return "Premium-Produkte sind noch nicht in App Store Connect verfuegbar."
        case .storeKitVerificationFailed:
            return "Premium-Kauf konnte nicht verifiziert werden."
        case .purchaseCancelled:
            return "Kauf abgebrochen."
        case .purchaseAlreadyInProgress:
            return "Ein Kauf ist bereits geoeffnet."
        }
    }
}

private func jsonObject(_ value: Any) -> String {
    guard JSONSerialization.isValidJSONObject(value),
          let data = try? JSONSerialization.data(withJSONObject: value, options: []),
          let string = String(data: data, encoding: .utf8)
    else {
        return "null"
    }
    return string
}

private func jsonString(_ value: String) -> String {
    guard let data = try? JSONEncoder().encode(value),
          let string = String(data: data, encoding: .utf8)
    else {
        return "\"\""
    }
    return string
}
