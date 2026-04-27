# MediLog App Store Prep

## Status

- Bundle ID: `com.medilog.care`
- App Store Connect App ID: `6764149636`
- App Store Name: `MediLog - care` (`MediLog` war bereits vergeben)
- Bundle ID Resource ID: `WQ8YKQ347M`
- Version: `1.0 (1)`
- Kategorie-Vorschlag: Medical oder Health & Fitness nach juristischer Pruefung
- Preislogik: Premium-first, Free nur als stark begrenzter Testmodus
- StoreKit-Produkt-IDs:
  - Jaehrlich: `com.medilog.care.premium.yearly` / ASC Subscription ID `6764150575` / Group Level `1`
  - Monatlich: `com.medilog.care.premium.monthly` / ASC Subscription ID `6764150096` / Group Level `2`
- ASC Subscription Group: `MediLog Premium` / ID `22056207`
- ASC Subscription Group Localization: `de-DE` / ID `c5be85ca-3690-4036-a470-c69a8cfe5762`
- ASC Review-Screenshots:
  - Monatlich: `08a3e396-70c9-4e26-b733-23fbaa114c10`
  - Jaehrlich: `b014fec3-728b-4737-a79d-906add98f876`
- Lokaler Review-Screenshot: `AppStoreAssets/subscription-review-premium.png` (`1170x2532`)
- Lokale Xcode-StoreKit-Testdatei: `MediLogNative/MediLog.storekit`
- Shared Scheme `MediLogNative` verwendet diese StoreKit-Datei beim Debug-Launch
- App Paywall holt auf iOS StoreKit-Produkte dynamisch und kauft den ausgewaehlten Tarif
- ASC App-Version-Metadaten `de-DE`: Beschreibung, Keywords und Promotional Text sind gesetzt
- Launch-Seiten fuer GitHub Pages vorbereitet:
  - Marketing: `https://meloxkgz-ship-it.github.io/medilog-care/landing.html`
  - Support: `https://meloxkgz-ship-it.github.io/medilog-care/support.html`
  - Datenschutz: `https://meloxkgz-ship-it.github.io/medilog-care/privacy.html`
  - Impressum: `https://meloxkgz-ship-it.github.io/medilog-care/impressum.html`
- Lokales Metadata-Paket: `AppStoreMetadata/de-DE.json`
- App Store iPhone-6.5-Screenshot-Set hochgeladen: `240d6303-3855-4607-904e-796e030dbf16`
  - `01-home.png`: `675a9d5f-a6af-46c6-b5fc-8234057ece15`
  - `02-plaene.png`: `945c7bdc-33c7-481a-a7af-c8cde24a6a46`
  - `03-medis.png`: `e92c8413-6099-478b-bd1f-d5c6247b8b31`
  - `04-verlauf.png`: `9598b71f-de2d-4713-b309-076c11b42959`
  - `05-premium.png`: `a732d43b-5f8a-4a8c-ab69-2ccb1f39b83e`
- Offener ASC-Status: Subscriptions zeigen noch `MISSING_METADATA`, bis die restlichen App-Review-Pflichtfelder erledigt sind

## App Review Hinweise

MediLog ist ein privater Tracker fuer Dokumentation, Erinnerung, Vorrat, Wasser und Export. Die App stellt keine Diagnose, gibt keine Therapie-, Absetz- oder Dosierungsempfehlung und fuehrt keine automatische Wechselwirkungsbewertung durch.

## Datenschutz-Angaben fuer App Store Connect

Wahrscheinliche Datenkategorien, sofern die App unveraendert bleibt:

- Health & Fitness: Medikamente, Einnahmeprotokoll, Wassertracking, Notizen
- Contact Info: nur falls spaeter Konten, Support oder Cloud hinzukommen
- Identifiers: keine in dieser lokalen Version
- Usage Data: keine Analytics in dieser lokalen Version

Aktuelle Architektur:

- Keine Cloud-Synchronisierung
- Keine Werbung
- Kein Tracking
- Lokaler iOS-Speicher ist AES-GCM verschluesselt
- Der Schluessel liegt in der iOS Keychain dieses Geraets
- QR-Scan bleibt lokal und wird als private Notiz gespeichert
- Export erfolgt nur manuell durch den Nutzer

## Noch vor TestFlight

- GitHub Pages Deployment pruefen
- Support-URL und Marketing-URL in App Store Connect eintragen
- Datenschutzerklaerung in App Store Connect hinterlegen
- Impressum mit echten Anbieterangaben fuellen und veroeffentlichen
- App-Kategorie, Altersfreigabe und Export-Compliance in App Store Connect finalisieren
- iPad-Screenshots bei Bedarf erzeugen und hochladen
- TestFlight-Build hochladen und mit den StoreKit-Produkten testen
- Medizinische Claims final juristisch pruefen
- DSGVO-Dokumente finalisieren, inklusive Einwilligung, Loeschung, Auskunft und Risikoanalyse
