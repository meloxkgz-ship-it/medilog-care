# MediLogNative

Minimaler iOS-Wrapper fuer MediLog mit SwiftUI und `WKWebView`.

## Oeffnen

```bash
open ios/MediLogNative/MediLogNative.xcodeproj
```

## Hinweise

- Die Web-App liegt gebuendelt unter `MediLogNative/WebApp`.
- `WKWebView` laedt `WebApp/index.html` lokal aus dem App-Bundle.
- Service Worker laufen bei lokalen `file://`-URLs nicht; die PWA bleibt fuer Browser-Installationen relevant.
- Native Local Notifications, iOS-Keychain/AES-GCM-Speicher, Premium-Entitlement-Bridge und Kamera-/QR-Flow sind vorbereitet.
- Fuer App-Store-Launch braucht es noch App-Store-Connect-StoreKit-Produkte, Datenschutz-URL, Support-URL, finale Screenshots und juristische Datenschutzpruefung.
- Die App-Store-Checkliste liegt in `APP_STORE_PREP.md`.
