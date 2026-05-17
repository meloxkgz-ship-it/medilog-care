import SwiftUI

@main
struct MediLogNativeApp: App {
    @State private var webAppLoaded = false
    @State private var showLaunchScreen = true
    private let launchStartedAt = Date()
    private let appBackground = Color(red: 0.03, green: 0.04, blue: 0.035)

    var body: some Scene {
        WindowGroup {
            ZStack {
                appBackground
                    .ignoresSafeArea(.all)

                WebAppView(isLoaded: $webAppLoaded)
                    .ignoresSafeArea(.all)

                if showLaunchScreen {
                    LaunchScreenView()
                        .transition(.opacity)
                        .ignoresSafeArea(.all)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(appBackground.ignoresSafeArea(.all))
            .preferredColorScheme(.dark)
            .statusBarHidden(false)
            .onChange(of: webAppLoaded) { _, loaded in
                guard loaded else {
                    showLaunchScreen = true
                    return
                }

                let elapsed = Date().timeIntervalSince(launchStartedAt)
                let remaining = max(0.8, 1.8 - elapsed)
                DispatchQueue.main.asyncAfter(deadline: .now() + remaining) {
                    withAnimation(.easeOut(duration: 0.25)) {
                        showLaunchScreen = false
                    }
                }
            }
        }
    }
}

struct LaunchScreenView: View {
    var body: some View {
        ZStack {
            Color(red: 0.03, green: 0.04, blue: 0.035)
                .ignoresSafeArea()

            VStack(spacing: 18) {
                ZStack {
                    RoundedRectangle(cornerRadius: 32, style: .continuous)
                        .fill(
                            LinearGradient(
                                colors: [
                                    Color(red: 0.08, green: 0.12, blue: 0.10),
                                    Color(red: 0.22, green: 0.30, blue: 0.23),
                                ],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .shadow(color: Color.black.opacity(0.18), radius: 24, x: 0, y: 16)

                    Text("M")
                        .font(.system(size: 58, weight: .black, design: .rounded))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [
                                    Color(red: 0.79, green: 0.95, blue: 0.48),
                                    Color(red: 0.36, green: 0.72, blue: 0.42),
                                ],
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                }
                .frame(width: 104, height: 104)

                VStack(spacing: 6) {
                    Text("MediLog")
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                        .foregroundStyle(Color(red: 0.96, green: 0.98, blue: 0.95))

                    Text("Lokal. Verschluesselt. Privat.")
                        .font(.system(size: 14, weight: .semibold, design: .rounded))
                        .foregroundStyle(Color(red: 0.68, green: 0.76, blue: 0.70))
                }

                ProgressView()
                    .tint(Color(red: 0.36, green: 0.72, blue: 0.42))
                    .padding(.top, 6)
            }
        }
    }
}
