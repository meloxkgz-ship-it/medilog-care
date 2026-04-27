import SwiftUI

@main
struct MediLogNativeApp: App {
    @State private var webAppLoaded = false
    @State private var showLaunchScreen = true
    private let launchStartedAt = Date()

    var body: some Scene {
        WindowGroup {
            ZStack {
                WebAppView(isLoaded: $webAppLoaded)
                    .ignoresSafeArea()

                if showLaunchScreen {
                    LaunchScreenView()
                        .transition(.opacity)
                }
            }
            .background(Color(red: 0.97, green: 0.98, blue: 0.95))
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
            Color(red: 0.97, green: 0.98, blue: 0.95)
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
                        .foregroundStyle(Color(red: 0.08, green: 0.11, blue: 0.10))

                    Text("Lokal. Verschluesselt. Privat.")
                        .font(.system(size: 14, weight: .semibold, design: .rounded))
                        .foregroundStyle(Color(red: 0.36, green: 0.42, blue: 0.38))
                }

                ProgressView()
                    .tint(Color(red: 0.36, green: 0.72, blue: 0.42))
                    .padding(.top, 6)
            }
        }
    }
}
