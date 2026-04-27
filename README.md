# MediLog

Premium-Prototyp fuer eine lokale Medikamenten-Tracking-App.

## Funktionen

- Premium-Landingpage mit App-Store-Screenshot-Sektion
- Tagesansicht mit Einnahmen, Fortschritt und naechster offener Einnahme
- Medikamente mit Uhrzeit, Angabe laut eigenem Plan und Vorrat erfassen
- Suche und Filter fuer offene Einnahmen oder niedrigen Vorrat
- In-App-Erinnerungen mit optionaler Browser-Benachrichtigung und nativer iOS-Notification-Bridge
- Wasser-Tracker mit Tagesziel und Schnelllog
- Vorrats- und Nachkauf-Management mit Einkaufsliste
- Familien-/Pflege-Profile fuer mehrere Personen
- Medikationsplan-Import per Text, QR-Bild und iOS-Kamera-Scan
- Verlauf mit dokumentierten Einnahmen und privaten Notizen
- Arzt-/Apothekenexport als Textdatei
- Premium-Arzt-/Apothekenbericht mit Vorschau, HTML-Export und PDF/Druck-Flow
- PIN-Vault mit lokaler Web-Crypto-Verschluesselung und iOS-Keychain/AES-GCM-Speicher
- Einfach-Modus mit groesseren Touch-Zielen und besserer Lesbarkeit
- PWA-Manifest, Premium-App-Icon und Offline-Service-Worker
- Stark begrenzter Free-Testmodus mit Premium-Gates fuer Pflege, Bericht, Vault, QR, Vorrat und zuverlaessige Erinnerungen
- DSGVO-orientierte Controls fuer Einwilligung, Datenkategorien, Zweckbindung, lokalen Export und Loeschung
- Xcode/iOS-Wrapper mit SwiftUI und WKWebView unter `ios/MediLogNative`

## Medizinische Grenze

MediLog ist als privates Protokoll gedacht. Die App stellt keine Diagnose, gibt keine Therapie-, Absetz- oder Dosierungsempfehlungen und ersetzt keine aerztliche oder pharmazeutische Beratung.

## Start

Die App ist statisch. `index.html` kann direkt im Browser geoeffnet werden.

Die Landingpage liegt in `landing.html`.

Oeffentliche Launch-Seiten sind fuer GitHub Pages vorbereitet:

- Marketing: `https://meloxkgz-ship-it.github.io/medilog-care/landing.html`
- Support: `https://meloxkgz-ship-it.github.io/medilog-care/support.html`
- Datenschutz: `https://meloxkgz-ship-it.github.io/medilog-care/privacy.html`

Fuer PWA/Offline-Funktionen lokal ausliefern:

```bash
python3 -m http.server 4173
```

Dann im Browser `http://127.0.0.1:4173/` oeffnen.

## Xcode

```bash
open ios/MediLogNative/MediLogNative.xcodeproj
```

Der native Wrapper laedt die gebuendelte Web-App aus `MediLogNative/WebApp`.

## App Store

Die iOS-Vorbereitung liegt unter `ios/MediLogNative/APP_STORE_PREP.md`.
StoreKit ist als Premium-Flow vorbereitet; im Simulator laeuft die lokale StoreKit-Testdatei, im Release werden App-Store-Connect-Produkte genutzt. Fuer eine echte Veroeffentlichung muessen noch Pflichtfelder, TestFlight und rechtliche Angaben final geprueft werden.
