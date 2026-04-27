import SwiftUI
import WebKit

struct WebAppView: UIViewRepresentable {
    @Binding var isLoaded: Bool

    func makeCoordinator() -> Coordinator {
        Coordinator(isLoaded: $isLoaded)
    }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        configuration.websiteDataStore = .default()
        configuration.userContentController.add(context.coordinator.nativeBridge, name: "medilogNative")

        let webView = WKWebView(frame: .zero, configuration: configuration)
        context.coordinator.nativeBridge.webView = webView
        webView.navigationDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = true
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.backgroundColor = .clear
        webView.scrollView.delegate = context.coordinator
        webView.scrollView.minimumZoomScale = 1
        webView.scrollView.maximumZoomScale = 1
        webView.scrollView.bouncesZoom = false

        if let webRoot = Bundle.main.url(forResource: "WebApp", withExtension: nil),
           let indexURL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "WebApp") {
            webView.loadFileURL(indexURL, allowingReadAccessTo: webRoot)
        }

        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    final class Coordinator: NSObject, UIScrollViewDelegate, WKNavigationDelegate {
        let nativeBridge = NativeBridge()
        private var isLoaded: Binding<Bool>

        init(isLoaded: Binding<Bool>) {
            self.isLoaded = isLoaded
        }

        func viewForZooming(in scrollView: UIScrollView) -> UIView? {
            nil
        }

        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            setLoaded(false)
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            setLoaded(true)
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            setLoaded(true)
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            setLoaded(true)
        }

        private func setLoaded(_ value: Bool) {
            DispatchQueue.main.async {
                self.isLoaded.wrappedValue = value
            }
        }
    }
}
