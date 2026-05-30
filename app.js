const STORAGE_KEY = "medilog-state-v1";
const VAULT_KEY = "medilog-vault-v1";
const FREE_MEDICINE_LIMIT = 2;
const YEARLY_PREMIUM_PRODUCT_ID = "com.medilog.care.premium.yearly";
const MONTHLY_PREMIUM_PRODUCT_ID = "com.medilog.care.premium.monthly";
const DEFAULT_PREMIUM_PRODUCTS = [
  {
    id: YEARLY_PREMIUM_PRODUCT_ID,
    displayName: "Jährlich",
    storeTitle: "MediLog Premium Jährlich",
    description: "Ein Jahr Premium für Alltag, Pflege, Export, Scan, Vault und Vorrat.",
    displayPrice: "29,99 €",
    period: "pro Jahr",
    featured: true,
    badge: "Spart ca. 37%",
    conversionNote: "Beste Wahl für feste Routinen",
    cta: "Jährlich Premium starten",
  },
  {
    id: MONTHLY_PREMIUM_PRODUCT_ID,
    displayName: "Monatlich",
    storeTitle: "MediLog Premium Monatlich",
    description: "Premium monatlich flexibel nutzen.",
    displayPrice: "3,99 €",
    period: "pro Monat",
    featured: false,
    badge: "Flexibel",
    conversionNote: "Flexibel testen",
    cta: "Monatlich starten",
  },
];

const SUPPORTED_LOCALES = [
  { code: "de-DE", short: "DE", label: "Deutsch", dir: "ltr" },
  { code: "en-US", short: "EN", label: "English", dir: "ltr" },
  { code: "en-GB", short: "GB", label: "English (UK)", dir: "ltr" },
  { code: "en-AU", short: "AU", label: "English (Australia)", dir: "ltr" },
  { code: "en-CA", short: "CA", label: "English (Canada)", dir: "ltr" },
  { code: "es-ES", short: "ES", label: "Español", dir: "ltr" },
  { code: "es-MX", short: "MX", label: "Español (Mexico)", dir: "ltr" },
  { code: "fr-FR", short: "FR", label: "Français", dir: "ltr" },
  { code: "fr-CA", short: "QC", label: "Français (Canada)", dir: "ltr" },
  { code: "it-IT", short: "IT", label: "Italiano", dir: "ltr" },
  { code: "pt-BR", short: "PT", label: "Português (Brasil)", dir: "ltr" },
  { code: "pt-PT", short: "PT", label: "Português", dir: "ltr" },
  { code: "nl-NL", short: "NL", label: "Nederlands", dir: "ltr" },
  { code: "pl-PL", short: "PL", label: "Polski", dir: "ltr" },
  { code: "tr-TR", short: "TR", label: "Türkçe", dir: "ltr" },
  { code: "ca", short: "CA", label: "Català", dir: "ltr" },
  { code: "hr", short: "HR", label: "Hrvatski", dir: "ltr" },
  { code: "hu", short: "HU", label: "Magyar", dir: "ltr" },
  { code: "ro", short: "RO", label: "Română", dir: "ltr" },
  { code: "sk", short: "SK", label: "Slovenčina", dir: "ltr" },
  { code: "sl", short: "SL", label: "Slovenščina", dir: "ltr" },
  { code: "bg", short: "BG", label: "Български", dir: "ltr" },
  { code: "sr", short: "SR", label: "Srpski", dir: "ltr" },
  { code: "da", short: "DA", label: "Dansk", dir: "ltr" },
  { code: "sv", short: "SV", label: "Svenska", dir: "ltr" },
  { code: "no", short: "NO", label: "Norsk", dir: "ltr" },
  { code: "fi", short: "FI", label: "Suomi", dir: "ltr" },
  { code: "cs", short: "CS", label: "Čeština", dir: "ltr" },
  { code: "el", short: "EL", label: "Ελληνικά", dir: "ltr" },
  { code: "ru", short: "RU", label: "Русский", dir: "ltr" },
  { code: "uk", short: "UK", label: "Українська", dir: "ltr" },
  { code: "hi", short: "HI", label: "हिन्दी", dir: "ltr" },
  { code: "id", short: "ID", label: "Bahasa Indonesia", dir: "ltr" },
  { code: "ms", short: "MS", label: "Bahasa Melayu", dir: "ltr" },
  { code: "th", short: "TH", label: "ไทย", dir: "ltr" },
  { code: "vi", short: "VI", label: "Tiếng Việt", dir: "ltr" },
  { code: "he", short: "HE", label: "עברית", dir: "rtl" },
  { code: "ar-SA", short: "AR", label: "العربية", dir: "rtl" },
  { code: "ja-JP", short: "JA", label: "日本語", dir: "ltr" },
  { code: "ko-KR", short: "KO", label: "한국어", dir: "ltr" },
  { code: "zh-Hans", short: "ZH", label: "简体中文", dir: "ltr" },
  { code: "zh-Hant", short: "TW", label: "繁體中文", dir: "ltr" },
];

const I18N = {
  "en-US": {
    "Heute": "Today",
    "Für dich": "For You",
    "Pläne": "Plans",
    "Bibliothek": "Meds",
    "Verlauf": "History",
    "Einstellungen": "Settings",
    "Suchen": "Search",
    "Einstellungen und Schutz": "Settings and protection",
    "Medikament, Angabe oder Uhrzeit suchen": "Search medication, dose or time",
    "z. B. morgens, Ramipril, Vorrat": "e.g. morning, Ramipril, stock",
    "Offen": "Open",
    "Vorrat niedrig": "Low stock",
    "Aktueller Plan": "Current Plan",
    "Herz & Blutdruck": "Heart & Blood Pressure",
    "Privates Einnahmeprotokoll mit lokalen Erinnerungen. Keine Dosierungsberatung.": "Private medication log with local reminders. No dosage advice.",
    "Aktiv": "Active",
    "Plan ansehen": "View Plan",
    "Erste Schritte": "First Steps",
    "In 2 Minuten startklar": "Ready in 2 Minutes",
    "Guide": "Guide",
    "1. Medikament erfassen": "1. Add Medication",
    "Name, Angabe laut Plan, Uhrzeit und Vorrat.": "Name, planned dose, time and stock.",
    "2. Erinnerung prüfen": "2. Check Reminder",
    "Lokale Reminder aktivieren und Abstand setzen.": "Enable local reminders and set delay.",
    "3. Bericht vorbereiten": "3. Prepare Report",
    "Export für Arzt oder Apotheke testen.": "Test export for doctor or pharmacy.",
    "Tagescheck": "Daily Check",
    "Heute sinnvoll weitermachen": "Continue Today",
    "Nächster sinnvoller Schritt": "Next useful step",
    "Einnahmen prüfen": "Check doses",
    "Offene Einnahmen abhaken oder Details ansehen.": "Mark open doses or review details.",
    "Vorrat sichern": "Secure stock",
    "Niedrige Bestände früh nachkaufen.": "Refill low stock early.",
    "Bericht aktuell halten": "Keep report current",
    "Protokoll für Arzt oder Apotheke vorbereiten.": "Prepare a log for doctor or pharmacy.",
    "Schutz prüfen": "Check protection",
    "Einwilligung, Vault und lokale Speicherung kontrollieren.": "Review consent, vault and local storage.",
    "Öffnen": "Open",
    "Pflege-Cockpit": "Care Cockpit",
    "Alle im Blick": "Everything in View",
    "Profile": "Profiles",
    "Einnahmen": "Doses",
    "Eintragen": "Log",
    "Keine Einnahmen für diesen Filter": "No doses for this filter",
    "Neue Medikamente oder Zeiten kannst du über den Plus-Button erfassen.": "Use the plus button to add medications or times.",
    "Medikament Erfassen": "Add Medication",
    "Nächste": "Next",
    "Keine offene Einnahme": "No open dose",
    "Vorrat": "Stock",
    "niedrige Bestände": "low items",
    "Wasser": "Water",
    "Trinken heute": "Water today",
    "von 2,0 L Tagesziel": "of 2.0 L daily goal",
    "Erinnerungen": "Reminders",
    "Kontrollzentrum": "Control Center",
    "Aktivieren": "Enable",
    "Status": "Status",
    "Eskaliert nach": "Delay after",
    "Heute offen": "Open today",
    "Therapieplan": "Treatment Plan",
    "Privat dokumentiert": "Privately documented",
    "Alle Angaben beruhen auf deinem eigenen Plan. Die App verändert keine Dosis und bewertet keine Therapie.": "All entries are based on your own plan. The app does not change doses or evaluate therapy.",
    "Regeln für Erinnerungen": "Reminder Rules",
    "Prüfen": "Check",
    "Erinnerungen sind lokal und können jederzeit deaktiviert werden.": "Reminders are local and can be disabled anytime.",
    "Exportdaten enthalten Gesundheitsdaten und sollten geschützt geteilt werden.": "Exports contain health data and should be shared carefully.",
    "Medizinische Entscheidungen bleiben bei Arzt, Apotheke oder Notdienst.": "Medical decisions stay with your doctor, pharmacy or emergency services.",
    "Familien-/Pflege-Modus": "Family/Care Mode",
    "Profil": "Profile",
    "Medikationsplan": "Medication Plan",
    "QR-Import vorbereitet": "QR Import Ready",
    "Scan": "Scan",
    "Für den bundeseinheitlichen Medikationsplan ist ein Premium-Workflow angelegt. In iOS kann ein QR-Code per Kamera gelesen werden, in der Web-Vorschau per Text oder QR-Bild. Es erfolgt keine automatische Dosierungsbewertung.": "A Premium workflow is prepared for medication-plan QR import. On iOS, a QR code can be scanned with the camera; in web preview, use text or a QR image. No automatic dosage evaluation is performed.",
    "Eigene Liste": "Own List",
    "Medikamente": "Medications",
    "Erfassen": "Add",
    "Noch keine Medikamente": "No medications yet",
    "Erfasse zuerst dein eigenes Medikament und die Einnahmezeit.": "Add your medication and dose time first.",
    "Vorrat & Nachkauf": "Stock & Refill",
    "Einkaufsliste": "Shopping List",
    "Kopieren": "Copy",
    "7-Tage-Übersicht": "7-Day Overview",
    "Dokumentierte Einnahmetreue": "Documented adherence",
    "Protokoll": "Log",
    "Bericht": "Report",
    "Einstellungen, Premium und Schutz.": "Settings, Premium and Protection.",
    "MediLog ist als lokaler Tracker konzipiert. Keine Diagnose, keine Therapieempfehlung, keine automatische Wechselwirkungsprüfung.": "MediLog is designed as a local tracker. No diagnosis, no treatment recommendation, no automatic interaction check.",
    "Zugang": "Access",
    "Premium für echte Routine.": "Premium for real routines.",
    "Free bleibt bewusst klein. Premium ist für Alltag, Pflege, Export und Vorrat ohne künstliche Reibung.": "Free stays intentionally small. Premium is for everyday use, care, export and stock without artificial friction.",
    "Alles, was für regelmäßige Dokumentation zählt: unbegrenzt, privat, exportierbar.": "Everything that matters for regular documentation: unlimited, private, exportable.",
    "Unbegrenzt": "Unlimited",
    "Lokal": "Local",
    "Keine Cloud": "No Cloud",
    "Premium Tarif": "Premium Plan",
    "MediLog Premium Jährlich": "MediLog Premium Yearly",
    "MediLog Premium Monatlich": "MediLog Premium Monthly",
    "Jährlich": "Yearly",
    "Monatlich": "Monthly",
    "pro Jahr": "per year",
    "pro Monat": "per month",
    "Bester Wert": "Best value",
    "Flexibel": "Flexible",
    "Empfohlen für feste Routinen": "Recommended for fixed routines",
    "Monatlich kündbar": "Cancel monthly",
    "Jährlich starten": "Start yearly",
    "Monatlich starten": "Start monthly",
    "Free und Premium Vergleich": "Free and Premium comparison",
    "1 Profil, 2 Medikamente, Wasser, Tagescheck": "1 profile, 2 medications, water, daily check",
    "Familie, Vorrat, Export, Scan, Vault, Reminder-Regeln": "Family, stock, export, scan, vault, reminder rules",
    "Zuverlaessige lokale Erinnerungen": "Reliable local reminders",
    "Familien-/Pflege-Modus": "Family/Care Mode",
    "Arzt-/Apothekenbericht": "Doctor/pharmacy report",
    "Vault, QR, Vorrat und Nachkauf": "Vault, QR, stock and refill",
    "Premium freischalten": "Unlock Premium",
    "Kauf wiederherstellen": "Restore Purchase",
    "Abo-Bedingungen": "Subscription terms",
    "Auto-verlängerbares Abo. Preis und Laufzeit werden vor dem Kauf von Apple angezeigt. Kündigung jederzeit in den App Store Account-Einstellungen.": "Auto-renewable subscription. Apple shows price and duration before purchase. Cancel anytime in App Store account settings.",
    "Ausgewählter Tarif: MediLog Premium.": "Selected plan: MediLog Premium.",
    "Datenschutz": "Privacy",
    "Nutzungsbedingungen (EULA)": "Terms of Use (EULA)",
    "Free: Basis aktiv": "Free: Basic active",
    "Web/PWA: Browser-Funktionen": "Web/PWA: Browser features",
    "Alltag": "Daily Life",
    "Tracking-Einstellungen": "Tracking Settings",
    "lokal": "local",
    "Wasserziel": "Water goal",
    "Tagesziel in Millilitern": "Daily goal in milliliters",
    "Sprache": "Language",
    "App-Sprache und regionale Formate": "App language and regional formats",
    "Reminder-Abstand": "Reminder delay",
    "Warnung nach geplanter Zeit": "Warning after scheduled time",
    "Zuverlaessige Erinnerungen": "Reliable reminders",
    "iOS nutzt lokale Notifications, Web nutzt Browser-Erlaubnis": "iOS uses local notifications, web uses browser permission",
    "Einfach-Modus": "Simple Mode",
    "Größere Schrift und Touch-Ziele": "Larger text and touch targets",
    "Nachkaufgrenzen": "Refill thresholds",
    "Medis": "Meds",
    "Gesundheitsdaten bleiben lokal auf diesem Gerät.": "Health data stays local on this device.",
    "iOS speichert verschlüsselt mit Keychain/AES-GCM, Web optional mit PIN-Vault.": "iOS stores encrypted with Keychain/AES-GCM; web optionally uses PIN vault.",
    "Export nur manuell durch dich.": "Export only manually by you.",
    "DSGVO": "GDPR",
    "Daten & Rechte": "Data & Rights",
    "offen": "open",
    "Datenkategorien": "Data categories",
    "Profile, Medikamente, Einnahmen, Wasser, Notizen, Einstellungen.": "Profiles, medications, doses, water, notes, settings.",
    "Zweckbindung": "Purpose limitation",
    "Nur Tracking, Erinnerung, Pflegeübersicht und Export. Keine Werbung, kein Verkauf.": "Only tracking, reminders, care overview and export. No ads, no sale.",
    "Speicherort": "Storage location",
    "Lokal im Browser dieses Geräts. Keine Cloud-Synchronisierung in dieser Version.": "Local in this device browser. No cloud sync in this version.",
    "DSGVO-Export": "GDPR Export",
    "Einwilligung bestätigen": "Confirm consent",
    "Lokaler Vault": "Local Vault",
    "PIN-Schutz": "PIN Protection",
    "aus": "off",
    "PIN festlegen oder entsperren": "Set or unlock PIN",
    "Schutz aktivieren": "Enable Protection",
    "Face ID prüfen": "Check Face ID",
    "Akute Beschwerden?": "Acute symptoms?",
    "Ärztlicher Bereitschaftsdienst": "Medical on-call service",
    "App-Gefühl": "App Feel",
    "Installierbar": "Installable",
    "MediLog kann über den Browser zum Home-Bildschirm hinzugefügt werden und lädt nach dem ersten Besuch auch offline.": "MediLog can be added to the Home Screen and loads offline after the first visit.",
    "Lokale Demo-Daten zurücksetzen": "Reset local demo data",
    "Hauptnavigation": "Main navigation",
    "Schnell erfassen": "Quick Add",
    "Willkommen bei MediLog": "Welcome to MediLog",
    "Dein privater Medikationsalltag, ruhig organisiert.": "Your private medication routine, calmly organized.",
    "Richte die App in einer Minute mit echten Basisdaten ein. MediLog dokumentiert, erinnert und exportiert, gibt aber keine medizinische Empfehlung.": "Set up the app in one minute with real basics. MediLog documents, reminds and exports, but gives no medical advice.",
    "Wichtige Hinweise": "Important notes",
    "So nutzt du MediLog": "How to use MediLog",
    "Einmal einrichten, dann taeglich nur abhaken.": "Set it up once, then just check off daily.",
    "Medikamente": "Medications",
    "Zeiten und Vorrat nach deinem Plan erfassen.": "Enter times and stock from your plan.",
    "Reminder": "Reminders",
    "Lokale Erinnerungen aktivieren.": "Enable local reminders.",
    "Export": "Export",
    "Bei Bedarf Bericht für Arzt oder Apotheke erstellen.": "Create a report for doctor or pharmacy when needed.",
    "Lokal auf diesem Gerät": "Local on this device",
    "Keine Cloud, kein Tracking": "No cloud, no tracking",
    "Free: 1 Profil, 2 Medis": "Free: 1 profile, 2 meds",
    "Für mich selbst": "For myself",
    "Für Angehörige": "For relatives",
    "Profilname": "Profile name",
    "Erstes Medikament": "First medication",
    "Angabe laut Plan": "Planned dose",
    "Uhrzeit": "Time",
    "Ich verstehe, dass ich besondere Gesundheitsdaten lokal auf diesem Gerät speichere und MediLog keine medizinische Beratung ersetzt.": "I understand that I store sensitive health data locally on this device and that MediLog does not replace medical advice.",
    "Demo mit Beispielen": "Demo with examples",
    "App einrichten": "Set up app",
    "Arzt-/Apothekenbericht": "Doctor/pharmacy report",
    "Bericht vorbereiten": "Prepare report",
    "Bericht schließen": "Close report",
    "Zeitraum": "Period",
    "7 Tage": "7 days",
    "30 Tage": "30 days",
    "HTML speichern": "Save HTML",
    "PDF/Druck": "PDF/Print",
    "Einnahme als erledigt markieren": "Mark dose as done",
    "Wasser 250 ml eintragen": "Log 250 ml water",
    "Eigenes Medikament erfassen": "Add own medication",
    "Notiz im Verlauf speichern": "Save note in history",
    "Medikament erfassen": "Add Medication",
    "Bitte nur Angaben übernehmen, die ärztlich oder pharmazeutisch für dich vorgesehen sind.": "Only enter information intended for you by a doctor or pharmacist.",
    "Abbrechen": "Cancel",
    "Speichern": "Save",
    "Medikament": "Medication",
    "Einnahme Heute Markieren": "Mark Today's Dose",
    "Vorrat +14": "Stock +14",
    "Notiz Speichern": "Save Note",
    "Profil erfassen": "Add Profile",
    "Rolle": "Role",
    "Medikationsplan importieren": "Import medication plan",
    "Kamera-Scan starten": "Start camera scan",
    "QR-/Planinhalt": "QR/plan content",
    "QR-Bild optional": "QR image optional",
    "Importieren": "Import",
    "Notiz speichern": "Save note",
    "Notiz": "Note"
  },
};

const LOCALE_FALLBACKS = {
  "en-GB": "en-US",
  "en-AU": "en-US",
  "en-CA": "en-US",
  "es-ES": "en-US",
  "es-MX": "es-ES",
  "fr-FR": "en-US",
  "fr-CA": "fr-FR",
  "it-IT": "en-US",
  "pt-BR": "en-US",
  "pt-PT": "pt-BR",
  "nl-NL": "en-US",
  "pl-PL": "en-US",
  "tr-TR": "en-US",
  "ca": "en-US",
  "hr": "en-US",
  "hu": "en-US",
  "ro": "en-US",
  "sk": "en-US",
  "sl": "en-US",
  "bg": "en-US",
  "sr": "en-US",
  "da": "en-US",
  "sv": "en-US",
  "no": "en-US",
  "fi": "en-US",
  "cs": "en-US",
  "el": "en-US",
  "ru": "en-US",
  "uk": "en-US",
  "hi": "en-US",
  "id": "en-US",
  "ms": "id",
  "th": "en-US",
  "vi": "en-US",
  "he": "en-US",
  "ar-SA": "en-US",
  "ja-JP": "en-US",
  "ko-KR": "en-US",
  "zh-Hans": "en-US",
  "zh-Hant": "zh-Hans",
};

const LOCALE_OVERRIDES = {
  "en-GB": {
    "Datenschutz": "Privacy", "Nutzungsbedingungen (EULA)": "Terms of Use (EULA)", "Vorrat": "Stock", "Nachkaufgrenzen": "Refill thresholds", "Bericht": "Report", "Premium freischalten": "Unlock Premium"
  },
  "en-AU": {
    "Datenschutz": "Privacy", "Nutzungsbedingungen (EULA)": "Terms of Use (EULA)", "Vorrat": "Stock", "Nachkaufgrenzen": "Refill thresholds", "Bericht": "Report", "Premium freischalten": "Unlock Premium"
  },
  "en-CA": {
    "Datenschutz": "Privacy", "Nutzungsbedingungen (EULA)": "Terms of Use (EULA)", "Vorrat": "Stock", "Nachkaufgrenzen": "Refill thresholds", "Bericht": "Report", "Premium freischalten": "Unlock Premium"
  },
  "es-ES": {
    "Heute": "Hoy", "Für dich": "Para ti", "Pläne": "Planes", "Bibliothek": "Medicamentos", "Verlauf": "Historial", "Einstellungen": "Ajustes", "Sprache": "Idioma", "Premium freischalten": "Activar Premium", "Schnell erfassen": "Registro rapido", "Medikament erfassen": "Anadir medicamento", "Wasser": "Agua", "Datenschutz": "Privacidad", "Speichern": "Guardar", "Abbrechen": "Cancelar", "Tagescheck": "Revision diaria", "Heute sinnvoll weitermachen": "Continuar hoy", "Einnahmen prüfen": "Revisar tomas", "Vorrat sichern": "Asegurar inventario", "Bericht aktuell halten": "Mantener informe actualizado", "Öffnen": "Abrir"
  },
  "es-MX": {
    "Heute": "Hoy", "Für dich": "Para ti", "Pläne": "Planes", "Bibliothek": "Medicamentos", "Verlauf": "Historial", "Einstellungen": "Configuracion", "Sprache": "Idioma", "Premium freischalten": "Activar Premium", "Schnell erfassen": "Registro rapido", "Medikament erfassen": "Agregar medicamento", "Wasser": "Agua", "Datenschutz": "Privacidad", "Speichern": "Guardar", "Abbrechen": "Cancelar", "Tagescheck": "Revision diaria", "Heute sinnvoll weitermachen": "Continuar hoy", "Einnahmen prüfen": "Revisar tomas", "Vorrat sichern": "Asegurar inventario", "Bericht aktuell halten": "Mantener informe actualizado", "Öffnen": "Abrir"
  },
  "fr-FR": {
    "Heute": "Aujourd'hui", "Für dich": "Pour vous", "Pläne": "Plans", "Bibliothek": "Medicaments", "Verlauf": "Historique", "Einstellungen": "Reglages", "Sprache": "Langue", "Premium freischalten": "Activer Premium", "Schnell erfassen": "Ajout rapide", "Medikament erfassen": "Ajouter un medicament", "Wasser": "Eau", "Datenschutz": "Confidentialite", "Speichern": "Enregistrer", "Abbrechen": "Annuler", "Tagescheck": "Bilan du jour", "Heute sinnvoll weitermachen": "Continuer aujourd'hui", "Einnahmen prüfen": "Verifier les prises", "Vorrat sichern": "Securiser le stock", "Bericht aktuell halten": "Tenir le rapport a jour", "Öffnen": "Ouvrir"
  },
  "fr-CA": {
    "Heute": "Aujourd'hui", "Für dich": "Pour vous", "Pläne": "Plans", "Bibliothek": "Medicaments", "Verlauf": "Historique", "Einstellungen": "Reglages", "Sprache": "Langue", "Premium freischalten": "Activer Premium", "Schnell erfassen": "Ajout rapide", "Medikament erfassen": "Ajouter un medicament", "Wasser": "Eau", "Datenschutz": "Confidentialite", "Speichern": "Enregistrer", "Abbrechen": "Annuler", "Tagescheck": "Bilan du jour", "Heute sinnvoll weitermachen": "Continuer aujourd'hui", "Einnahmen prüfen": "Verifier les prises", "Vorrat sichern": "Securiser le stock", "Bericht aktuell halten": "Tenir le rapport a jour", "Öffnen": "Ouvrir"
  },
  "it-IT": {
    "Heute": "Oggi", "Für dich": "Per te", "Pläne": "Piani", "Bibliothek": "Farmaci", "Verlauf": "Storico", "Einstellungen": "Impostazioni", "Sprache": "Lingua", "Premium freischalten": "Attiva Premium", "Schnell erfassen": "Aggiunta rapida", "Medikament erfassen": "Aggiungi farmaco", "Wasser": "Acqua", "Datenschutz": "Privacy", "Speichern": "Salva", "Abbrechen": "Annulla"
  },
  "pt-BR": {
    "Heute": "Hoje", "Für dich": "Para voce", "Pläne": "Planos", "Bibliothek": "Medicamentos", "Verlauf": "Historico", "Einstellungen": "Ajustes", "Sprache": "Idioma", "Premium freischalten": "Ativar Premium", "Schnell erfassen": "Adicionar rapido", "Medikament erfassen": "Adicionar medicamento", "Wasser": "Agua", "Datenschutz": "Privacidade", "Speichern": "Salvar", "Abbrechen": "Cancelar", "Tagescheck": "Check diario", "Heute sinnvoll weitermachen": "Continuar hoje", "Einnahmen prüfen": "Revisar doses", "Vorrat sichern": "Garantir estoque", "Bericht aktuell halten": "Manter relatorio atualizado", "Öffnen": "Abrir"
  },
  "pt-PT": {
    "Heute": "Hoje", "Für dich": "Para si", "Pläne": "Planos", "Bibliothek": "Medicamentos", "Verlauf": "Historico", "Einstellungen": "Definicoes", "Sprache": "Idioma", "Premium freischalten": "Ativar Premium", "Schnell erfassen": "Adicionar rapido", "Medikament erfassen": "Adicionar medicamento", "Wasser": "Agua", "Datenschutz": "Privacidade", "Speichern": "Guardar", "Abbrechen": "Cancelar", "Tagescheck": "Check diario", "Heute sinnvoll weitermachen": "Continuar hoje", "Einnahmen prüfen": "Rever tomas", "Vorrat sichern": "Garantir stock", "Bericht aktuell halten": "Manter relatorio atualizado", "Öffnen": "Abrir"
  },
  "nl-NL": {
    "Heute": "Vandaag", "Für dich": "Voor jou", "Pläne": "Plannen", "Bibliothek": "Medicijnen", "Verlauf": "Geschiedenis", "Einstellungen": "Instellingen", "Sprache": "Taal", "Premium freischalten": "Premium activeren", "Schnell erfassen": "Snel toevoegen", "Medikament erfassen": "Medicijn toevoegen", "Wasser": "Water", "Datenschutz": "Privacy", "Speichern": "Opslaan", "Abbrechen": "Annuleren"
  },
  "pl-PL": {
    "Heute": "Dzisiaj", "Für dich": "Dla Ciebie", "Pläne": "Plany", "Bibliothek": "Leki", "Verlauf": "Historia", "Einstellungen": "Ustawienia", "Sprache": "Jezyk", "Premium freischalten": "Aktywuj Premium", "Schnell erfassen": "Szybki wpis", "Medikament erfassen": "Dodaj lek", "Wasser": "Woda", "Datenschutz": "Prywatnosc", "Speichern": "Zapisz", "Abbrechen": "Anuluj"
  },
  "tr-TR": {
    "Heute": "Bugun", "Für dich": "Senin icin", "Pläne": "Planlar", "Bibliothek": "Ilaclar", "Verlauf": "Gecmis", "Einstellungen": "Ayarlar", "Sprache": "Dil", "Premium freischalten": "Premium'u ac", "Schnell erfassen": "Hizli ekle", "Medikament erfassen": "Ilac ekle", "Wasser": "Su", "Datenschutz": "Gizlilik", "Speichern": "Kaydet", "Abbrechen": "Iptal"
  },
  "ca": {
    "Heute": "Avui", "Für dich": "Per a tu", "Pläne": "Plans", "Bibliothek": "Medicaments", "Verlauf": "Historial", "Einstellungen": "Configuracio", "Sprache": "Idioma", "Premium freischalten": "Activar Premium", "Schnell erfassen": "Afegir rapid", "Medikament erfassen": "Afegir medicament", "Wasser": "Aigua", "Datenschutz": "Privadesa", "Speichern": "Desar", "Abbrechen": "Cancel-lar", "Tagescheck": "Revisio diaria", "Einnahmen prüfen": "Revisar preses", "Öffnen": "Obrir", "Sprache gespeichert": "Idioma desat"
  },
  "hr": {
    "Heute": "Danas", "Für dich": "Za tebe", "Pläne": "Planovi", "Bibliothek": "Lijekovi", "Verlauf": "Povijest", "Einstellungen": "Postavke", "Sprache": "Jezik", "Premium freischalten": "Aktiviraj Premium", "Schnell erfassen": "Brzi unos", "Medikament erfassen": "Dodaj lijek", "Wasser": "Voda", "Datenschutz": "Privatnost", "Speichern": "Spremi", "Abbrechen": "Odustani", "Tagescheck": "Dnevna provjera", "Einnahmen prüfen": "Provjeri doze", "Öffnen": "Otvori", "Sprache gespeichert": "Jezik spremljen"
  },
  "hu": {
    "Heute": "Ma", "Für dich": "Neked", "Pläne": "Tervek", "Bibliothek": "Gyogyszerek", "Verlauf": "Elozmenyek", "Einstellungen": "Beallitasok", "Sprache": "Nyelv", "Premium freischalten": "Premium bekapcsolasa", "Schnell erfassen": "Gyors hozzaadas", "Medikament erfassen": "Gyogyszer hozzaadasa", "Wasser": "Viz", "Datenschutz": "Adatvedelem", "Speichern": "Mentes", "Abbrechen": "Megse", "Tagescheck": "Napi ellenorzes", "Einnahmen prüfen": "Adagok ellenorzese", "Öffnen": "Megnyitas", "Sprache gespeichert": "Nyelv mentve"
  },
  "ro": {
    "Heute": "Astazi", "Für dich": "Pentru tine", "Pläne": "Planuri", "Bibliothek": "Medicamente", "Verlauf": "Istoric", "Einstellungen": "Setari", "Sprache": "Limba", "Premium freischalten": "Activeaza Premium", "Schnell erfassen": "Adaugare rapida", "Medikament erfassen": "Adauga medicament", "Wasser": "Apa", "Datenschutz": "Confidentialitate", "Speichern": "Salveaza", "Abbrechen": "Anuleaza", "Tagescheck": "Verificare zilnica", "Einnahmen prüfen": "Verifica dozele", "Öffnen": "Deschide", "Sprache gespeichert": "Limba salvata"
  },
  "sk": {
    "Heute": "Dnes", "Für dich": "Pre vas", "Pläne": "Plany", "Bibliothek": "Lieky", "Verlauf": "Historia", "Einstellungen": "Nastavenia", "Sprache": "Jazyk", "Premium freischalten": "Aktivovat Premium", "Schnell erfassen": "Rychle pridat", "Medikament erfassen": "Pridat liek", "Wasser": "Voda", "Datenschutz": "Sukromie", "Speichern": "Ulozit", "Abbrechen": "Zrusit", "Tagescheck": "Denna kontrola", "Einnahmen prüfen": "Skontrolovat davky", "Öffnen": "Otvorit", "Sprache gespeichert": "Jazyk ulozeny"
  },
  "sl": {
    "Heute": "Danes", "Für dich": "Za vas", "Pläne": "Nacrti", "Bibliothek": "Zdravila", "Verlauf": "Zgodovina", "Einstellungen": "Nastavitve", "Sprache": "Jezik", "Premium freischalten": "Aktiviraj Premium", "Schnell erfassen": "Hitro dodaj", "Medikament erfassen": "Dodaj zdravilo", "Wasser": "Voda", "Datenschutz": "Zasebnost", "Speichern": "Shrani", "Abbrechen": "Preklici", "Tagescheck": "Dnevni pregled", "Einnahmen prüfen": "Preveri odmerke", "Öffnen": "Odpri", "Sprache gespeichert": "Jezik shranjen"
  },
  "bg": {
    "Heute": "Днес", "Für dich": "За вас", "Pläne": "Планове", "Bibliothek": "Лекарства", "Verlauf": "История", "Einstellungen": "Настройки", "Sprache": "Език", "Premium freischalten": "Активирай Premium", "Schnell erfassen": "Бързо добавяне", "Medikament erfassen": "Добави лекарство", "Wasser": "Вода", "Datenschutz": "Поверителност", "Speichern": "Запази", "Abbrechen": "Отказ", "Tagescheck": "Дневна проверка", "Einnahmen prüfen": "Провери приемите", "Öffnen": "Отвори", "Sprache gespeichert": "Езикът е запазен"
  },
  "sr": {
    "Heute": "Danas", "Für dich": "Za vas", "Pläne": "Planovi", "Bibliothek": "Lekovi", "Verlauf": "Istorija", "Einstellungen": "Podesavanja", "Sprache": "Jezik", "Premium freischalten": "Aktiviraj Premium", "Schnell erfassen": "Brzo dodaj", "Medikament erfassen": "Dodaj lek", "Wasser": "Voda", "Datenschutz": "Privatnost", "Speichern": "Sacuvaj", "Abbrechen": "Otkazi", "Tagescheck": "Dnevna provera", "Einnahmen prüfen": "Proveri doze", "Öffnen": "Otvori", "Sprache gespeichert": "Jezik sacuvan"
  },
  "da": {
    "Heute": "I dag", "Für dich": "Til dig", "Pläne": "Planer", "Bibliothek": "Medicin", "Verlauf": "Historik", "Einstellungen": "Indstillinger", "Sprache": "Sprog", "Premium freischalten": "Aktiver Premium", "Schnell erfassen": "Hurtig tilfoejelse", "Medikament erfassen": "Tilfoej medicin", "Wasser": "Vand", "Datenschutz": "Privatliv", "Speichern": "Gem", "Abbrechen": "Annuller", "Tagescheck": "Dagens tjek", "Einnahmen prüfen": "Tjek doser", "Öffnen": "Aabn"
  },
  "sv": {
    "Heute": "I dag", "Für dich": "For dig", "Pläne": "Planer", "Bibliothek": "Lakemedel", "Verlauf": "Historik", "Einstellungen": "Installningar", "Sprache": "Sprak", "Premium freischalten": "Aktivera Premium", "Schnell erfassen": "Snabb tillaggning", "Medikament erfassen": "Lagg till lakemedel", "Wasser": "Vatten", "Datenschutz": "Integritet", "Speichern": "Spara", "Abbrechen": "Avbryt", "Tagescheck": "Dagens koll", "Einnahmen prüfen": "Kontrollera doser", "Öffnen": "Oppna"
  },
  "no": {
    "Heute": "I dag", "Für dich": "For deg", "Pläne": "Planer", "Bibliothek": "Medisiner", "Verlauf": "Historikk", "Einstellungen": "Innstillinger", "Sprache": "Sprak", "Premium freischalten": "Aktiver Premium", "Schnell erfassen": "Hurtig registrering", "Medikament erfassen": "Legg til medisin", "Wasser": "Vann", "Datenschutz": "Personvern", "Speichern": "Lagre", "Abbrechen": "Avbryt", "Tagescheck": "Dagens sjekk", "Einnahmen prüfen": "Sjekk doser", "Öffnen": "Apne"
  },
  "fi": {
    "Heute": "Tanaan", "Für dich": "Sinulle", "Pläne": "Suunnitelmat", "Bibliothek": "Laakkeet", "Verlauf": "Historia", "Einstellungen": "Asetukset", "Sprache": "Kieli", "Premium freischalten": "Avaa Premium", "Schnell erfassen": "Pikalisays", "Medikament erfassen": "Lisaa laake", "Wasser": "Vesi", "Datenschutz": "Tietosuoja", "Speichern": "Tallenna", "Abbrechen": "Peruuta", "Tagescheck": "Paivan tarkistus", "Einnahmen prüfen": "Tarkista annokset", "Öffnen": "Avaa"
  },
  "cs": {
    "Heute": "Dnes", "Für dich": "Pro vas", "Pläne": "Plany", "Bibliothek": "Leciva", "Verlauf": "Historie", "Einstellungen": "Nastaveni", "Sprache": "Jazyk", "Premium freischalten": "Aktivovat Premium", "Schnell erfassen": "Rychle pridat", "Medikament erfassen": "Pridat lek", "Wasser": "Voda", "Datenschutz": "Soukromi", "Speichern": "Ulozit", "Abbrechen": "Zrusit", "Tagescheck": "Denni kontrola", "Einnahmen prüfen": "Zkontrolovat davky", "Öffnen": "Otevrit"
  },
  "el": {
    "Heute": "Σήμερα", "Für dich": "Για εσάς", "Pläne": "Πλάνα", "Bibliothek": "Φάρμακα", "Verlauf": "Ιστορικό", "Einstellungen": "Ρυθμίσεις", "Sprache": "Γλώσσα", "Premium freischalten": "Ενεργοποίηση Premium", "Schnell erfassen": "Γρήγορη προσθήκη", "Medikament erfassen": "Προσθήκη φαρμάκου", "Wasser": "Νερό", "Datenschutz": "Απόρρητο", "Speichern": "Αποθήκευση", "Abbrechen": "Άκυρο", "Tagescheck": "Ημερήσιος έλεγχος", "Einnahmen prüfen": "Έλεγχος λήψεων", "Öffnen": "Άνοιγμα"
  },
  "ru": {
    "Heute": "Сегодня", "Für dich": "Для вас", "Pläne": "Планы", "Bibliothek": "Лекарства", "Verlauf": "История", "Einstellungen": "Настройки", "Sprache": "Язык", "Premium freischalten": "Открыть Premium", "Schnell erfassen": "Быстро добавить", "Medikament erfassen": "Добавить лекарство", "Wasser": "Вода", "Datenschutz": "Конфиденциальность", "Speichern": "Сохранить", "Abbrechen": "Отмена", "Tagescheck": "Проверка дня", "Einnahmen prüfen": "Проверить приемы", "Öffnen": "Открыть"
  },
  "uk": {
    "Heute": "Сьогодні", "Für dich": "Для вас", "Pläne": "Плани", "Bibliothek": "Ліки", "Verlauf": "Історія", "Einstellungen": "Налаштування", "Sprache": "Мова", "Premium freischalten": "Відкрити Premium", "Schnell erfassen": "Швидко додати", "Medikament erfassen": "Додати ліки", "Wasser": "Вода", "Datenschutz": "Конфіденційність", "Speichern": "Зберегти", "Abbrechen": "Скасувати", "Tagescheck": "Перевірка дня", "Einnahmen prüfen": "Перевірити прийоми", "Öffnen": "Відкрити"
  },
  "hi": {
    "Heute": "आज", "Für dich": "आपके लिए", "Pläne": "योजनाएं", "Bibliothek": "दवाएं", "Verlauf": "इतिहास", "Einstellungen": "सेटिंग्स", "Sprache": "भाषा", "Premium freischalten": "Premium खोलें", "Schnell erfassen": "त्वरित जोड़ें", "Medikament erfassen": "दवा जोड़ें", "Wasser": "पानी", "Datenschutz": "गोपनीयता", "Speichern": "सहेजें", "Abbrechen": "रद्द करें", "Tagescheck": "दैनिक जांच", "Einnahmen prüfen": "खुराक जांचें", "Öffnen": "खोलें"
  },
  "id": {
    "Heute": "Hari ini", "Für dich": "Untuk Anda", "Pläne": "Rencana", "Bibliothek": "Obat", "Verlauf": "Riwayat", "Einstellungen": "Pengaturan", "Sprache": "Bahasa", "Premium freischalten": "Aktifkan Premium", "Schnell erfassen": "Tambah cepat", "Medikament erfassen": "Tambah obat", "Wasser": "Air", "Datenschutz": "Privasi", "Speichern": "Simpan", "Abbrechen": "Batal", "Tagescheck": "Cek harian", "Einnahmen prüfen": "Periksa dosis", "Öffnen": "Buka"
  },
  "ms": {
    "Heute": "Hari ini", "Für dich": "Untuk anda", "Pläne": "Pelan", "Bibliothek": "Ubat", "Verlauf": "Sejarah", "Einstellungen": "Tetapan", "Sprache": "Bahasa", "Premium freischalten": "Aktifkan Premium", "Schnell erfassen": "Tambah cepat", "Medikament erfassen": "Tambah ubat", "Wasser": "Air", "Datenschutz": "Privasi", "Speichern": "Simpan", "Abbrechen": "Batal", "Tagescheck": "Semakan harian", "Einnahmen prüfen": "Semak dos", "Öffnen": "Buka", "Sprache gespeichert": "Bahasa disimpan"
  },
  "th": {
    "Heute": "วันนี้", "Für dich": "สำหรับคุณ", "Pläne": "แผน", "Bibliothek": "ยา", "Verlauf": "ประวัติ", "Einstellungen": "การตั้งค่า", "Sprache": "ภาษา", "Premium freischalten": "เปิดใช้ Premium", "Schnell erfassen": "เพิ่มด่วน", "Medikament erfassen": "เพิ่มยา", "Wasser": "น้ำ", "Datenschutz": "ความเป็นส่วนตัว", "Speichern": "บันทึก", "Abbrechen": "ยกเลิก", "Tagescheck": "ตรวจประจำวัน", "Einnahmen prüfen": "ตรวจการใช้ยา", "Öffnen": "เปิด", "Sprache gespeichert": "บันทึกภาษาแล้ว"
  },
  "vi": {
    "Heute": "Hom nay", "Für dich": "Cho ban", "Pläne": "Ke hoach", "Bibliothek": "Thuoc", "Verlauf": "Lich su", "Einstellungen": "Cai dat", "Sprache": "Ngon ngu", "Premium freischalten": "Mo Premium", "Schnell erfassen": "Them nhanh", "Medikament erfassen": "Them thuoc", "Wasser": "Nuoc", "Datenschutz": "Quyen rieng tu", "Speichern": "Luu", "Abbrechen": "Huy", "Tagescheck": "Kiem tra ngay", "Einnahmen prüfen": "Kiem tra lieu", "Öffnen": "Mo"
  },
  "he": {
    "Heute": "היום", "Für dich": "בשבילך", "Pläne": "תכניות", "Bibliothek": "תרופות", "Verlauf": "היסטוריה", "Einstellungen": "הגדרות", "Sprache": "שפה", "Premium freischalten": "הפעלת Premium", "Schnell erfassen": "הוספה מהירה", "Medikament erfassen": "הוספת תרופה", "Wasser": "מים", "Datenschutz": "פרטיות", "Speichern": "שמירה", "Abbrechen": "ביטול", "Tagescheck": "בדיקה יומית", "Einnahmen prüfen": "בדיקת נטילות", "Öffnen": "פתיחה"
  },
  "ar-SA": {
    "Heute": "اليوم", "Für dich": "لك", "Pläne": "الخطط", "Bibliothek": "الأدوية", "Verlauf": "السجل", "Einstellungen": "الإعدادات", "Sprache": "اللغة", "Premium freischalten": "تفعيل Premium", "Schnell erfassen": "إضافة سريعة", "Medikament erfassen": "إضافة دواء", "Wasser": "الماء", "Datenschutz": "الخصوصية", "Speichern": "حفظ", "Abbrechen": "إلغاء"
  },
  "ja-JP": {
    "Heute": "今日", "Für dich": "おすすめ", "Pläne": "プラン", "Bibliothek": "薬", "Verlauf": "履歴", "Einstellungen": "設定", "Sprache": "言語", "Premium freischalten": "Premiumを有効化", "Schnell erfassen": "クイック追加", "Medikament erfassen": "薬を追加", "Wasser": "水分", "Datenschutz": "プライバシー", "Speichern": "保存", "Abbrechen": "キャンセル"
  },
  "ko-KR": {
    "Heute": "오늘", "Für dich": "추천", "Pläne": "계획", "Bibliothek": "약", "Verlauf": "기록", "Einstellungen": "설정", "Sprache": "언어", "Premium freischalten": "Premium 활성화", "Schnell erfassen": "빠른 추가", "Medikament erfassen": "약 추가", "Wasser": "물", "Datenschutz": "개인정보", "Speichern": "저장", "Abbrechen": "취소"
  },
  "zh-Hans": {
    "Heute": "今天", "Für dich": "为你推荐", "Home": "首页", "Pläne": "计划", "Medis": "药品", "Bibliothek": "药品", "Verlauf": "记录", "Einstellungen": "设置", "Einstellungen, Premium und Schutz.": "设置、Premium 与保护。", "MediLog ist als lokaler Tracker konzipiert. Keine Diagnose, keine Therapieempfehlung, keine automatische Wechselwirkungsprüfung.": "MediLog 是本地记录工具。不诊断、不提供治疗建议，也不自动检查相互作用。", "Zugang": "权限", "Premium für echte Routine.": "适合真实日常的 Premium。", "Free bleibt bewusst klein. Premium ist für Alltag, Pflege, Export und Vorrat ohne künstliche Reibung.": "Free 保持精简。Premium 适合日常、护理、导出和库存管理。", "Alles, was für regelmäßige Dokumentation zählt: unbegrenzt, privat, exportierbar.": "长期记录需要的能力：无限、私密、可导出。", "MediLog Premium Jährlich": "MediLog Premium 年度", "MediLog Premium Monatlich": "MediLog Premium 月度", "Empfohlen für feste Routinen": "适合固定日常", "Monatlich kündbar": "可按月取消", "pro Jahr": "每年", "pro Monat": "每月", "1 Profil": "1 个资料", "Unbegrenzt": "无限", "Lokal": "本地", "Keine Cloud": "无云端", "Sprache": "语言", "Premium freischalten": "开启 Premium", "Schnell erfassen": "快速添加", "Medikament erfassen": "添加药品", "Wasser": "饮水", "Datenschutz": "隐私", "Speichern": "保存", "Abbrechen": "取消", "Sprache gespeichert": "语言已保存"
  },
  "zh-Hant": {
    "Heute": "今天", "Für dich": "為你推薦", "Home": "首頁", "Pläne": "計劃", "Medis": "藥品", "Bibliothek": "藥品", "Verlauf": "紀錄", "Einstellungen": "設定", "Einstellungen, Premium und Schutz.": "設定、Premium 與保護。", "MediLog ist als lokaler Tracker konzipiert. Keine Diagnose, keine Therapieempfehlung, keine automatische Wechselwirkungsprüfung.": "MediLog 是本機記錄工具。不診斷、不提供治療建議，也不自動檢查交互作用。", "Zugang": "權限", "Premium für echte Routine.": "適合真實日常的 Premium。", "Free bleibt bewusst klein. Premium ist für Alltag, Pflege, Export und Vorrat ohne künstliche Reibung.": "Free 維持精簡。Premium 適合日常、照護、匯出與庫存管理。", "Alles, was für regelmäßige Dokumentation zählt: unbegrenzt, privat, exportierbar.": "長期記錄需要的能力：無限制、私密、可匯出。", "MediLog Premium Jährlich": "MediLog Premium 年度", "MediLog Premium Monatlich": "MediLog Premium 月度", "Empfohlen für feste Routinen": "適合固定日常", "Monatlich kündbar": "可按月取消", "pro Jahr": "每年", "pro Monat": "每月", "1 Profil": "1 個資料", "Unbegrenzt": "無限制", "Lokal": "本機", "Keine Cloud": "無雲端", "Sprache": "語言", "Premium freischalten": "啟用 Premium", "Schnell erfassen": "快速新增", "Medikament erfassen": "新增藥品", "Wasser": "飲水", "Datenschutz": "隱私", "Speichern": "儲存", "Abbrechen": "取消", "Tagescheck": "每日檢查", "Einnahmen prüfen": "檢查用藥", "Öffnen": "開啟", "Sprache gespeichert": "語言已儲存"
  },
};

for (const [locale, overrides] of Object.entries(LOCALE_OVERRIDES)) {
  I18N[locale] = { ...I18N[LOCALE_FALLBACKS[locale]], ...overrides };
}

const textNodeOriginals = new WeakMap();

const medilogNative = (() => {
  const callbacks = new Map();
  let sequence = 0;

  window.__medilogNativeResolve = (id, result, error) => {
    const callback = callbacks.get(id);
    if (!callback) return;
    callbacks.delete(id);
    if (error) callback.reject(new Error(error));
    else callback.resolve(result);
  };

  return {
    get available() {
      return Boolean(window.webkit?.messageHandlers?.medilogNative);
    },
    call(action, payload = {}) {
      if (!this.available) return Promise.reject(new Error("Native Bridge nicht verfügbar"));

      return new Promise((resolve, reject) => {
        const id = `native-${Date.now()}-${sequence++}`;
        callbacks.set(id, { resolve, reject });
        window.webkit.messageHandlers.medilogNative.postMessage({ id, action, payload });
        window.setTimeout(() => {
          if (!callbacks.has(id)) return;
          callbacks.delete(id);
          reject(new Error("Native Antwort hat zu lange gedauert"));
        }, 12000);
      });
    },
  };
})();

let nativeCapabilities = {
  platform: "web",
  secureStorage: false,
  notifications: "web",
  cameraScan: false,
  biometrics: false,
  revenueCat: false,
};
let nativeSecureStorageReady = false;
let nativeSaveTimer = null;

const seedState = {
  activeFilter: "all",
  activeProfileId: "profile-self",
  settings: {
    onboarded: false,
    remindersEnabled: false,
    reminderDelayMinutes: 15,
    vaultEnabled: false,
    seniorMode: false,
    waterGoal: 2000,
    premiumActive: false,
    premiumPreview: false,
    premiumSource: "none",
    premiumUntil: null,
    privacyConsentAt: null,
    locale: detectPreferredLocale(),
  },
  profiles: [
    { id: "profile-self", name: "Ich", role: "Selbst" },
    { id: "profile-care", name: "Mama", role: "Pflege" },
  ],
  medicines: [
    { id: "med-ramipril", profileId: "profile-self", name: "Ramipril", dose: "5 mg", time: "08:00", stock: 6, refillAt: 7 },
    { id: "med-vitamin-d", profileId: "profile-self", name: "Vitamin D", dose: "1000 IE", time: "09:00", stock: 31, refillAt: 10 },
    { id: "med-abend", profileId: "profile-care", name: "Abendmedikation", dose: "laut eigenem Plan", time: "21:30", stock: 18, refillAt: 7 },
  ],
  completedToday: {},
  hydration: {},
  history: [
    { type: "done", title: "Vitamin D dokumentiert", detail: "09:04", date: new Date().toISOString() },
    { type: "done", title: "Ramipril dokumentiert", detail: "08:06", date: new Date().toISOString() },
    {
      type: "note",
      title: "Hinweis",
      detail: "Nur eigene Angaben, keine automatische medizinische Bewertung.",
      date: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
};

let state = loadState();
let activeVaultPin = null;
let premiumProducts = DEFAULT_PREMIUM_PRODUCTS.map((product) => ({ ...product }));
let selectedPremiumProductId = YEARLY_PREMIUM_PRODUCT_ID;
let premiumPurchasePending = false;
let premiumInlineMessage = "";
let premiumInlineMessageTone = "info";
let selectedMedicineId = null;

function createFreshState() {
  const nextState = structuredClone(seedState);
  nextState.activeFilter = "all";
  nextState.activeProfileId = "profile-self";
  nextState.profiles = [];
  nextState.medicines = [];
  nextState.completedToday = {};
  nextState.hydration = {};
  nextState.history = [];
  nextState.settings = {
    ...seedState.settings,
    onboarded: true,
    privacyConsentAt: new Date().toISOString(),
  };
  return nextState;
}

const elements = {
  title: document.querySelector("#view-title"),
  date: document.querySelector("#current-date"),
  searchButton: document.querySelector("#search-button"),
  searchPanel: document.querySelector("#search-panel"),
  searchInput: document.querySelector("#search-input"),
  doseList: document.querySelector("#dose-list"),
  doseEmpty: document.querySelector("#dose-empty"),
  completionText: document.querySelector("#completion-text"),
  completionBar: document.querySelector("#completion-bar"),
  adherencePill: document.querySelector("#adherence-pill"),
  nextDose: document.querySelector("#next-dose"),
  nextDoseName: document.querySelector("#next-dose-name"),
  lowStockCount: document.querySelector("#low-stock-count"),
  medicineGrid: document.querySelector("#medicine-grid"),
  medicineEmpty: document.querySelector("#medicine-empty"),
  historyScore: document.querySelector("#history-score"),
  historyBars: document.querySelector("#history-bars"),
  historyList: document.querySelector("#history-list"),
  calendarStrip: document.querySelector("#calendar-strip"),
  routineFocusList: document.querySelector("#routine-focus-list"),
  careDashboard: document.querySelector("#care-dashboard"),
  profileList: document.querySelector("#profile-list"),
  stockList: document.querySelector("#stock-list"),
  reminderStatus: document.querySelector("#reminder-status"),
  reminderDelay: document.querySelector("#reminder-delay"),
  openDoseCount: document.querySelector("#open-dose-count"),
  settingWaterGoal: document.querySelector("#setting-water-goal"),
  settingReminderDelay: document.querySelector("#setting-reminder-delay"),
  settingRemindersEnabled: document.querySelector("#setting-reminders-enabled"),
  settingSeniorMode: document.querySelector("#setting-senior-mode"),
  refillSettingsList: document.querySelector("#refill-settings-list"),
  premiumStatus: document.querySelector("#premium-status"),
  premiumPlans: document.querySelector("#premium-plans"),
  premiumValueRow: document.querySelector("#premium-value-row"),
  premiumButton: document.querySelector("#premium-button"),
  premiumButtonLabel: document.querySelector("#premium-button-label"),
  premiumMessage: document.querySelector("#premium-message"),
  premiumLegalSelected: document.querySelector("#premium-legal-selected"),
  privacyConsentStatus: document.querySelector("#privacy-consent-status"),
  settingLanguage: document.querySelector("#setting-language"),
  languageGrid: document.querySelector("#language-grid"),
  waterFill: document.querySelector("#water-fill"),
  waterTotal: document.querySelector("#water-total"),
  waterGoal: document.querySelector("#water-goal"),
  waterDots: document.querySelector("#water-dots"),
  vaultStatus: document.querySelector("#vault-status"),
  vaultPin: document.querySelector("#vault-pin"),
  quickSheet: document.querySelector("#quick-sheet"),
  onboardingSheet: document.querySelector("#onboarding-sheet"),
  reportSheet: document.querySelector("#report-sheet"),
  reportPreview: document.querySelector("#report-preview"),
  reportRange: document.querySelector("#report-range"),
  medicineSheet: document.querySelector("#medicine-sheet"),
  medicineDetailSheet: document.querySelector("#medicine-detail-sheet"),
  medicineDetailContent: document.querySelector("#medicine-detail-content"),
  noteSheet: document.querySelector("#note-sheet"),
  profileSheet: document.querySelector("#profile-sheet"),
  scanSheet: document.querySelector("#scan-sheet"),
  medicineForm: document.querySelector("#medicine-form"),
  noteForm: document.querySelector("#note-form"),
  profileForm: document.querySelector("#profile-form"),
  scanForm: document.querySelector("#scan-form"),
  onboardingForm: document.querySelector("#onboarding-form"),
  toast: document.querySelector("#toast"),
};

function loadState() {
  if (localStorage.getItem(VAULT_KEY)) {
    return { ...structuredClone(seedState), medicines: [], history: [] };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return structuredClone(seedState);

  try {
    return hydrateState(JSON.parse(stored));
  } catch {
    return structuredClone(seedState);
  }
}

function saveState() {
  if (nativeSecureStorageReady) {
    localStorage.removeItem(STORAGE_KEY);
    scheduleNativeStateSave();
    return;
  }

  if (!state.settings?.vaultEnabled) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (state.settings?.vaultEnabled && activeVaultPin) {
    void encryptVault(activeVaultPin).catch(() => showToast("Vault konnte nicht aktualisiert werden"));
  }
}

function hydrateState(incoming) {
  const merged = { ...structuredClone(seedState), ...incoming };
  merged.settings = { ...seedState.settings, ...incoming.settings };
  merged.settings.locale = normalizeLocale(incoming.settings?.locale || merged.settings.locale);
  merged.settings.premiumActive = Boolean(incoming.settings?.premiumActive || incoming.settings?.premiumPreview);
  merged.settings.premiumSource = incoming.settings?.premiumSource || (merged.settings.premiumActive ? "legacy" : "none");
  merged.settings.premiumUntil = incoming.settings?.premiumUntil || null;
  merged.profiles = incoming.profiles?.length ? incoming.profiles : seedState.profiles;
  merged.medicines = (incoming.medicines || seedState.medicines).map((medicine) => ({
    refillAt: 7,
    profileId: merged.activeProfileId || "profile-self",
    ...medicine,
  }));
  return merged;
}

function normalizeLocale(value) {
  const supported = new Set(SUPPORTED_LOCALES.map((locale) => locale.code));
  if (supported.has(value)) return value;
  const language = String(value || "").split("-")[0];
  return SUPPORTED_LOCALES.find((locale) => locale.code.split("-")[0] === language)?.code || "de-DE";
}

function detectPreferredLocale() {
  return normalizeLocale(navigator.languages?.[0] || navigator.language || "de-DE");
}

function getLocaleConfig() {
  return SUPPORTED_LOCALES.find((locale) => locale.code === normalizeLocale(state?.settings?.locale)) || SUPPORTED_LOCALES[0];
}

function t(value, replacements = {}) {
  const original = String(value ?? "");
  const locale = normalizeLocale(state?.settings?.locale || "de-DE");
  const normalized = original.replace(/\s+/g, " ").trim();
  const translated = I18N[locale]?.[original] || I18N[locale]?.[normalized] || original;
  return Object.entries(replacements).reduce((text, [key, replacement]) => text.replaceAll(`{${key}}`, replacement), translated);
}

function formatNumber(value, options = {}) {
  return new Intl.NumberFormat(getLocaleConfig().code, options).format(value);
}

function applyLocale() {
  const locale = getLocaleConfig();
  document.documentElement.lang = locale.code;
  document.documentElement.dir = locale.dir;
  document.querySelector(".badge-button span").textContent = locale.short;
  document.title = "MediLog";
  translateDocument();
  if (elements.settingLanguage) elements.settingLanguage.value = locale.code;
}

function translateDocument(root = document.body) {
  const locale = normalizeLocale(state?.settings?.locale || "de-DE");
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "TEXTAREA", "OPTION"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    if (!textNodeOriginals.has(node)) textNodeOriginals.set(node, node.nodeValue);
    const original = textNodeOriginals.get(node);
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    const key = original.trim();
    node.nodeValue = `${leading}${locale === "de-DE" ? key : t(key)}${trailing}`;
  });

  root.querySelectorAll("[aria-label], [placeholder]").forEach((element) => {
    ["aria-label", "placeholder"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const dataKey = `i18n${attribute.replace(/(^|-)([a-z])/g, (_, __, letter) => letter.toUpperCase())}`;
      if (!element.dataset[dataKey]) element.dataset[dataKey] = element.getAttribute(attribute);
      const original = element.dataset[dataKey];
      element.setAttribute(attribute, locale === "de-DE" ? original : t(original));
    });
  });
}

function scheduleNativeStateSave() {
  if (!medilogNative.available || !nativeSecureStorageReady) return;
  window.clearTimeout(nativeSaveTimer);
  nativeSaveTimer = window.setTimeout(() => {
    medilogNative.call("saveSecureState", { state }).catch(() => {
      nativeSecureStorageReady = false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    });
  }, 80);
}

async function bootstrapNative() {
  if (!medilogNative.available) return;

  try {
    nativeCapabilities = { ...nativeCapabilities, ...(await medilogNative.call("environment")) };
    nativeSecureStorageReady = Boolean(nativeCapabilities.secureStorage);

    const [stored, entitlement, productsEnvelope] = await Promise.all([
      medilogNative.call("loadSecureState"),
      medilogNative.call("premiumStatus"),
      medilogNative.call("premiumProducts").catch(() => null),
    ]);

    if (stored?.exists && stored.state) {
      state = hydrateState(stored.state);
      localStorage.removeItem(STORAGE_KEY);
    }

    applyPremiumEntitlement(entitlement, { silent: true });
    setPremiumProducts(productsEnvelope?.products);

    if (nativeSecureStorageReady) {
      localStorage.removeItem(STORAGE_KEY);
      scheduleNativeStateSave();
    }

    await syncNativeReminders({ silent: true });
    render();
  } catch {
    showToast("Native iOS-Funktionen nicht voll verfügbar");
  }
}

function applyPremiumEntitlement(entitlement, options = {}) {
  if (entitlement?.pending) {
    if (!options.silent) showToast("Kauf wartet auf Bestätigung");
    return false;
  }
  if (!entitlement?.active) return false;
  state.settings.premiumActive = true;
  state.settings.premiumPreview = false;
  state.settings.premiumSource = entitlement.source || "ios";
  state.settings.premiumUntil = entitlement.expiresAt || null;
  if (!options.silent) showToast("Premium ist aktiv");
  return true;
}

function isPremium() {
  return Boolean(state.settings.premiumActive);
}

function setPremiumProducts(products) {
  if (!Array.isArray(products) || products.length === 0) return;

  const defaultsById = new Map(DEFAULT_PREMIUM_PRODUCTS.map((product) => [product.id, product]));
  premiumProducts = products
    .filter((product) => product?.id && defaultsById.has(product.id))
    .map((product) => {
      const fallback = defaultsById.get(product.id);
      return {
        ...fallback,
        ...product,
        displayName: fallback.displayName,
        storeDisplayName: product.displayName || fallback.storeTitle || fallback.displayName,
        storeTitle: product.displayName || fallback.storeTitle || fallback.displayName,
      };
    })
    .sort((a, b) => productRank(a.id) - productRank(b.id));

  if (!premiumProducts.some((product) => product.id === selectedPremiumProductId)) {
    selectedPremiumProductId = premiumProducts[0]?.id || YEARLY_PREMIUM_PRODUCT_ID;
  }
}

function getSelectedPremiumProduct() {
  return premiumProducts.find((product) => product.id === selectedPremiumProductId) || premiumProducts[0] || DEFAULT_PREMIUM_PRODUCTS[0];
}

function productRank(productId) {
  if (productId === YEARLY_PREMIUM_PRODUCT_ID) return 0;
  if (productId === MONTHLY_PREMIUM_PRODUCT_ID) return 1;
  return 9;
}

function selectedPremiumLegalText(product = getSelectedPremiumProduct()) {
  const title = t(product.storeTitle || product.storeDisplayName || product.displayName || "MediLog Premium");
  const price = product.displayPrice || "Preis laut App Store";
  const period = t(product.period || "Abo-Laufzeit laut App Store");
  if (getLocaleConfig().code === "de-DE") {
    return `Ausgewählter Tarif: ${title}, ${price} ${period}. Das Abo verlängert sich automatisch, sofern es nicht mindestens 24 Stunden vor Ablauf gekündigt wird.`;
  }
  return `Selected plan: ${title}, ${price} ${period}. The subscription renews automatically unless cancelled at least 24 hours before the end of the current period.`;
}

function setPremiumInlineMessage(message = "", tone = "info") {
  premiumInlineMessage = message;
  premiumInlineMessageTone = tone;
}

function isAppStoreShotMode() {
  return new URLSearchParams(window.location.search).has("shot");
}

function requirePremium(feature) {
  if (isPremium()) return true;
  showToast(`Premium erforderlich: ${feature}`);
  switchView("schutz");
  return false;
}

function routeToHash(hashValue = location.hash.slice(1)) {
  const route = hashValue || "home";
  const views = new Set(["home", "plaene", "bibliothek", "verlauf", "schutz"]);

  if (views.has(route)) {
    switchView(route, { updateHash: false });
    return;
  }

  if (route === "premium") {
    switchView("schutz", { updateHash: false });
    document.querySelector(".premium-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (route === "water") {
    switchView("home", { updateHash: false });
    document.querySelector(".hydration-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (route === "dose") {
    switchView("home", { updateHash: false });
    window.setTimeout(() => elements.quickSheet.showModal(), 180);
  }
}

function requirePrivacyConsent(feature) {
  if (state.settings.privacyConsentAt) return true;
  showToast(`Bitte Datenschutz bestätigen: ${feature}`);
  switchView("schutz");
  return false;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isDone(medicineId) {
  return Boolean(state.completedToday[todayKey()]?.[medicineId]);
}

function setDone(medicineId, done) {
  const key = todayKey();
  state.completedToday[key] = state.completedToday[key] || {};
  state.completedToday[key][medicineId] = done;
}

function getVisibleMedicines() {
  const query = elements.searchInput.value.trim().toLowerCase();
  return getProfileMedicines().filter((medicine) => {
    const matchesQuery = [medicine.name, medicine.dose, medicine.time].some((value) =>
      value.toLowerCase().includes(query),
    );
    const matchesFilter =
      state.activeFilter === "all" ||
      (state.activeFilter === "open" && !isDone(medicine.id)) ||
      (state.activeFilter === "low" && Number(medicine.stock) <= Number(medicine.refillAt || 7));

    return matchesQuery && matchesFilter;
  });
}

function getProfileMedicines() {
  return state.medicines.filter((medicine) => medicine.profileId === state.activeProfileId);
}

function render() {
  renderLanguageOptions();
  renderDate();
  renderDoses();
  renderMedicines();
  renderHistory();
  renderCalendar();
  renderProfiles();
  renderCareDashboard();
  renderStock();
  renderSettings();
  renderHydration();
  updateMetrics();
  renderRoutineFocus();
  document.body.classList.toggle("senior", Boolean(state.settings.seniorMode));
  applyLocale();
  refreshIcons();
}

function renderLanguageOptions() {
  const activeLocale = getLocaleConfig().code;
  if (elements.settingLanguage && elements.settingLanguage.options.length !== SUPPORTED_LOCALES.length) {
    elements.settingLanguage.innerHTML = SUPPORTED_LOCALES
      .map((locale) => `<option value="${locale.code}">${locale.short} - ${locale.label}</option>`)
      .join("");
  }

  if (elements.languageGrid) {
    elements.languageGrid.innerHTML = SUPPORTED_LOCALES
      .map((locale) => `
        <button class="language-chip ${locale.code === activeLocale ? "active" : ""}" type="button" data-locale="${locale.code}" dir="${locale.dir}">
          <span>${escapeHtml(locale.short)}</span>
          <strong>${escapeHtml(locale.label)}</strong>
        </button>
      `)
      .join("");
  }
}

function renderCareDashboard() {
  const profiles = isPremium() ? state.profiles : state.profiles.filter((profile) => profile.id === state.activeProfileId).slice(0, 1);
  elements.careDashboard.innerHTML = profiles
    .map((profile) => {
      const medicines = state.medicines.filter((medicine) => medicine.profileId === profile.id);
      const open = medicines.filter((medicine) => !isDone(medicine.id)).length;
      const low = medicines.filter((medicine) => Number(medicine.stock) <= Number(medicine.refillAt || 7)).length;
      const done = medicines.length > 0 && open === 0;
      return `
        <button class="care-card ${profile.id === state.activeProfileId ? "active" : ""}" type="button" data-profile-id="${profile.id}">
          <span class="care-avatar">${escapeHtml(profile.name.slice(0, 1))}</span>
          <span>
            <strong>${escapeHtml(profile.name)}</strong>
            <small>${done ? "alles erledigt" : `${open} offen`} · ${low} Vorrat niedrig</small>
          </span>
          <i data-lucide="${done ? "circle-check" : "clock-3"}"></i>
        </button>
      `;
    })
    .join("");

  if (!isPremium()) {
    elements.careDashboard.innerHTML += `<button class="care-card locked" type="button" data-premium-feature="Pflege-Cockpit">
      <span class="care-avatar"><i data-lucide="lock"></i></span>
      <span><strong>Pflege-Cockpit</strong><small>Mehrere Personen nur mit Premium</small></span>
      <i data-lucide="sparkles"></i>
    </button>`;
  }
}

function renderDate() {
  elements.date.textContent = new Intl.DateTimeFormat(getLocaleConfig().code, {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());
}

function renderDoses() {
  const medicines = getVisibleMedicines().sort((a, b) => a.time.localeCompare(b.time));
  elements.doseEmpty.classList.toggle("hidden", medicines.length > 0);
  elements.doseList.innerHTML = medicines
    .map((medicine, index) => {
      const done = isDone(medicine.id);
      return `
        <button class="dose-item ${done ? "done" : ""}" type="button" data-dose-id="${medicine.id}" style="animation-delay:${index * 45}ms">
          <span class="dose-check" aria-hidden="true">${done ? '<i data-lucide="check"></i>' : ""}</span>
          <span class="dose-main">
            <strong>${escapeHtml(medicine.name)}</strong>
            <span>${escapeHtml(medicine.dose)}</span>
          </span>
          <span class="dose-meta">${medicine.time}</span>
          <i class="dose-chevron" data-lucide="chevron-right"></i>
        </button>
      `;
    })
    .join("");
}

function renderMedicines() {
  const medicines = getProfileMedicines();
  elements.medicineEmpty.classList.toggle("hidden", medicines.length > 0);
  elements.medicineGrid.innerHTML = medicines
    .map((medicine) => {
      const low = Number(medicine.stock) <= Number(medicine.refillAt || 7);
      return `
        <button class="med-card" type="button" data-medicine-id="${medicine.id}" aria-label="${escapeHtml(medicine.name)} anzeigen">
          <div class="med-visual" aria-hidden="true"></div>
          <div>
            <h3>${escapeHtml(medicine.name)}</h3>
            <p>${escapeHtml(medicine.dose)} · ${medicine.time}</p>
          </div>
          <span class="stock-pill ${low ? "low" : ""}">${medicine.stock} Einheiten</span>
        </button>
      `;
    })
    .join("");
}

function renderProfiles() {
  const profiles = isPremium() ? state.profiles : state.profiles.filter((profile) => profile.id === state.activeProfileId).slice(0, 1);
  elements.profileList.innerHTML = profiles
    .map(
      (profile) => `
        <button class="profile-card ${profile.id === state.activeProfileId ? "active" : ""}" type="button" data-profile-id="${profile.id}">
          <i data-lucide="${profile.id === "profile-self" ? "user-round" : "heart-handshake"}"></i>
          <span><strong>${escapeHtml(profile.name)}</strong><small>${escapeHtml(profile.role)}</small></span>
        </button>
      `,
    )
    .join("");

  if (!isPremium()) {
    elements.profileList.innerHTML += `<button class="profile-card locked" type="button" data-premium-feature="Pflegeprofile">
      <i data-lucide="lock"></i>
      <span><strong>Weitere Profile</strong><small>Nur mit Premium</small></span>
    </button>`;
  }
}

function renderStock() {
  if (!isPremium()) {
    elements.stockList.innerHTML = `<button class="stock-row locked" type="button" data-premium-feature="Vorratsmanagement"><i data-lucide="lock"></i><span><strong>Vorratsmanagement</strong><small>Nachkauf, Grenzen und Liste sind Premium.</small></span></button>`;
    return;
  }

  const low = getProfileMedicines().filter((medicine) => Number(medicine.stock) <= Number(medicine.refillAt || 7));
  elements.stockList.innerHTML =
    low.length > 0
      ? low
          .map(
            (medicine) => `
              <div class="stock-row">
                <i data-lucide="shopping-bag"></i>
                <span><strong>${escapeHtml(medicine.name)}</strong><small>${medicine.stock} uebrig · Schwelle ${medicine.refillAt}</small></span>
                <button type="button" data-restock-id="${medicine.id}">+14</button>
              </div>
            `,
          )
          .join("")
      : `<div class="stock-row calm"><i data-lucide="circle-check"></i><span><strong>Alles im grünen Bereich</strong><small>Keine Nachkauf-Erinnerung für dieses Profil.</small></span></div>`;
}

function openMedicineDetail(medicineId) {
  const medicine = state.medicines.find((item) => item.id === medicineId);
  if (!medicine) return;
  selectedMedicineId = medicineId;
  const low = Number(medicine.stock) <= Number(medicine.refillAt || 7);
  elements.medicineDetailContent.innerHTML = `
    <div class="detail-hero">
      <div class="med-visual" aria-hidden="true"></div>
      <div>
        <p class="kicker">Eigene Angabe</p>
        <h3>${escapeHtml(medicine.name)}</h3>
        <span>${escapeHtml(medicine.dose)} · ${medicine.time}</span>
      </div>
    </div>
    <div class="detail-grid">
      <div><span>Status</span><strong>${isDone(medicine.id) ? "Heute erledigt" : "Heute offen"}</strong></div>
      <div><span>Vorrat</span><strong>${medicine.stock} Einheiten</strong></div>
      <div><span>Nachkauf ab</span><strong>${medicine.refillAt || 7}</strong></div>
      <div><span>Hinweis</span><strong>${low ? "Vorrat niedrig" : "ausreichend"}</strong></div>
    </div>
  `;
  elements.medicineDetailSheet.showModal();
  refreshIcons();
}

function renderPremiumPlans() {
  const selected = getSelectedPremiumProduct();
  elements.premiumPlans.innerHTML = premiumProducts
    .map((product) => {
      const active = product.id === selected.id;
      const title = t(product.storeTitle || product.storeDisplayName || product.displayName);
      const note = t(product.conversionNote || product.badge || product.description || "");
      const period = t(product.period || "");
      const badge = t(product.badge || "");
      const price = product.displayPrice || t("Preis laut App Store");
      const ariaLabel = `${title}, ${price} ${period}${note ? `, ${note}` : ""}${active ? ", ausgewählt" : ""}`;
      return `
        <button class="plan-option ${active ? "active" : ""} ${product.featured ? "featured" : ""}" type="button" role="radio" aria-checked="${active}" aria-label="${escapeHtml(ariaLabel)}" data-premium-product-id="${escapeHtml(product.id)}">
          <span class="plan-check" aria-hidden="true"><i data-lucide="${active ? "check" : "circle"}"></i></span>
          <span>
            <strong>${escapeHtml(title)}${badge ? `<em class="plan-badge">${escapeHtml(badge)}</em>` : ""}</strong>
            <small>${escapeHtml(note)}</small>
          </span>
          <span class="plan-price">
            <b>${escapeHtml(price)}</b>
            <em>${escapeHtml(period)}</em>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderSettings() {
  renderPremiumPlans();
  const selectedProduct = getSelectedPremiumProduct();
  const selectedPrice = selectedProduct.displayPrice || t("Preis laut App Store");
  const selectedPeriod = t(selectedProduct.period || "");
  const selectedTitle = t(selectedProduct.storeTitle || selectedProduct.storeDisplayName || selectedProduct.displayName);
  const usesApplePurchaseFlow = nativeCapabilities.platform === "ios" || isAppStoreShotMode();
  elements.settingWaterGoal.value = Number(state.settings.waterGoal || 2000);
  elements.settingReminderDelay.value = String(state.settings.reminderDelayMinutes || 15);
  if (elements.settingLanguage) elements.settingLanguage.value = getLocaleConfig().code;
  elements.settingRemindersEnabled.checked = Boolean(state.settings.remindersEnabled);
  elements.settingSeniorMode.checked = Boolean(state.settings.seniorMode);
  elements.premiumStatus.textContent = isPremium()
    ? `Premium aktiv${state.settings.premiumSource && state.settings.premiumSource !== "none" ? ` · ${state.settings.premiumSource}` : ""}`
    : `Free: Mini-Modus (${FREE_MEDICINE_LIMIT} Medis)`;
  elements.premiumButtonLabel.textContent = isPremium()
    ? "Premium aktiv"
    : usesApplePurchaseFlow
    ? `${t(selectedProduct.cta || `${selectedProduct.displayName} kaufen`)} · ${selectedPrice}`
    : `${t(selectedProduct.displayName)} Webvorschau`;
  elements.premiumButton.disabled = premiumPurchasePending || isPremium();
  elements.premiumButton.setAttribute("aria-busy", String(premiumPurchasePending));
  elements.premiumValueRow.innerHTML = `
    <span><strong>${escapeHtml(selectedPrice)}</strong><small>${escapeHtml(selectedPeriod || selectedTitle)}</small></span>
    <span><strong>${escapeHtml(t(selectedProduct.conversionNote || "Premium"))}</strong><small>${escapeHtml(t("für Pflege, Export und Vorrat"))}</small></span>
  `;
  elements.premiumMessage.textContent = t(premiumInlineMessage || "");
  elements.premiumMessage.className = `premium-message ${premiumInlineMessage ? "show" : ""} ${premiumInlineMessageTone === "error" ? "error" : premiumInlineMessageTone === "success" ? "success" : ""}`;
  elements.premiumLegalSelected.textContent = selectedPremiumLegalText();
  elements.privacyConsentStatus.textContent = state.settings.privacyConsentAt ? "bestätigt" : "offen";
  document.querySelector("#native-status").textContent =
    usesApplePurchaseFlow
      ? nativeCapabilities.revenueCat
        ? "iOS: RevenueCat, Keychain, lokale Notifications, QR-Scan"
        : "iOS: StoreKit-Fallback, Keychain, lokale Notifications, QR-Scan"
      : "Web/PWA: Browser-Funktionen";
  document.querySelector("#privacy-storage-status").textContent = nativeSecureStorageReady
    ? "Verschlüsselter iOS-Speicher. Schlüssel liegt in der Keychain dieses Geräts."
    : "Lokaler Browser-Speicher. Optionaler PIN-Vault nutzt Web Crypto.";

  const medicines = getProfileMedicines();
  elements.refillSettingsList.innerHTML =
    !isPremium()
      ? `<div class="stock-row locked" data-premium-feature="Nachkaufgrenzen"><i data-lucide="lock"></i><span><strong>Nachkaufgrenzen</strong><small>Vorratsmanagement ist Premium.</small></span></div>`
      : medicines.length > 0
      ? medicines
          .map(
            (medicine) => `
              <label class="refill-row">
                <span><strong>${escapeHtml(medicine.name)}</strong><small>Aktuell ${medicine.stock} Einheiten</small></span>
                <input type="number" min="0" max="99" step="1" value="${medicine.refillAt || 7}" data-refill-setting-id="${medicine.id}" />
              </label>
            `,
          )
          .join("")
      : `<div class="stock-row calm"><i data-lucide="pill"></i><span><strong>Noch keine Medikamente</strong><small>Erfasse Medikamente, um Nachkaufgrenzen zu setzen.</small></span></div>`;
}

function renderRoutineFocus() {
  if (!elements.routineFocusList) return;

  const medicines = getProfileMedicines();
  const open = medicines.filter((medicine) => !isDone(medicine.id)).length;
  const low = medicines.filter((medicine) => Number(medicine.stock) <= Number(medicine.refillAt || 7)).length;
  const adherence = getAdherence();
  const checks = [
    {
      action: "dose",
      icon: "check-circle-2",
      title: "Einnahmen prüfen",
      detail: open > 0 ? `${open} offen · ${adherence}% diese Woche` : "Heute ist alles dokumentiert",
      tone: open > 0 ? "active" : "done",
    },
    {
      action: "stock",
      icon: "shopping-bag",
      title: "Vorrat sichern",
      detail: low > 0 ? `${low} niedrige Bestände` : "Nachkauf aktuell unkritisch",
      tone: low > 0 ? "warning" : "done",
    },
    {
      action: "report",
      icon: "file-text",
      title: "Bericht aktuell halten",
      detail: isPremium() ? "Export für Arzt oder Apotheke bereit" : "Premium: Arzt-/Apothekenbericht",
      tone: isPremium() ? "active" : "locked",
    },
    {
      action: "privacy",
      icon: "shield-check",
      title: "Schutz prüfen",
      detail: state.settings.privacyConsentAt ? "Lokal, privat und bestätigt" : "Einwilligung noch offen",
      tone: state.settings.privacyConsentAt ? "done" : "warning",
    },
  ];

  elements.routineFocusList.innerHTML = checks
    .map(
      (check) => `
        <button class="routine-card ${check.tone}" type="button" data-routine-action="${check.action}">
          <i data-lucide="${check.icon}"></i>
          <span>
            <strong>${escapeHtml(check.title)}</strong>
            <small>${escapeHtml(check.detail)}</small>
          </span>
          <em>${t("Öffnen")}</em>
        </button>
      `,
    )
    .join("");
}

function renderHydration() {
  const entry = getHydrationEntry();
  const percent = Math.min(100, Math.round((entry.amount / entry.goal) * 100));
  elements.waterFill.style.height = `${percent}%`;
  elements.waterTotal.textContent = `${formatNumber(entry.amount / 1000, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} L`;
  const goalLiters = formatNumber(entry.goal / 1000, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  elements.waterGoal.textContent = state.settings.locale === "de-DE" ? `von ${goalLiters} L Tagesziel` : `${goalLiters} L daily goal`;
  const glasses = Math.round(entry.goal / 250);
  const done = Math.min(glasses, Math.floor(entry.amount / 250));
  elements.waterDots.innerHTML = Array.from({ length: glasses }, (_, index) => `<span class="${index < done ? "done" : ""}"></span>`).join("");
}

function addWater(amount = 250) {
  if (!requirePrivacyConsent("Wasser dokumentieren")) return;
  const entry = getHydrationEntry();
  entry.amount = Math.min(4000, Number(entry.amount) + amount);
  addHistory("water", "Wasser getrunken", `${amount} ml dokumentiert`);
  saveState();
  render();
  showToast("Wasser dokumentiert");
}

function getHydrationEntry() {
  const key = todayKey();
  state.hydration[key] = state.hydration[key] || {};
  if (state.hydration[key].amount !== undefined) {
    state.hydration[key] = { [state.activeProfileId]: state.hydration[key] };
  }
  state.hydration[key][state.activeProfileId] = state.hydration[key][state.activeProfileId] || {
    amount: 0,
    goal: Number(state.settings.waterGoal || 2000),
  };
  state.hydration[key][state.activeProfileId].goal = Number(state.settings.waterGoal || state.hydration[key][state.activeProfileId].goal || 2000);
  return state.hydration[key][state.activeProfileId];
}

function renderHistory() {
  const adherence = getAdherence();
  elements.historyScore.textContent = `${adherence}%`;
  elements.historyBars.innerHTML = getSevenDayStats()
    .map((value) => `<span class="bar" style="height:${Math.max(12, value)}%"></span>`)
    .join("");

  elements.historyList.innerHTML = state.history
    .slice(0, 10)
    .map((entry) => {
      const icon = entry.type === "note" ? "notebook-pen" : "check";
      const time = new Intl.DateTimeFormat(getLocaleConfig().code, {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(entry.date));
      return `
        <div class="history-row">
          <i data-lucide="${icon}"></i>
          <div>
            <strong>${escapeHtml(entry.title)}</strong>
            <span>${escapeHtml(entry.detail)}</span>
          </div>
          <time>${time}</time>
        </div>
      `;
    })
    .join("");
}

function renderCalendar() {
  const formatter = new Intl.DateTimeFormat(getLocaleConfig().code, { weekday: "short" });
  const now = new Date();
  elements.calendarStrip.innerHTML = Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(now);
    day.setDate(now.getDate() - 3 + offset);
    const key = day.toISOString().slice(0, 10);
    const profileMedicineIds = new Set(getProfileMedicines().map((medicine) => medicine.id));
    const doneCount = Object.entries(state.completedToday[key] || {}).filter(
      ([medicineId, done]) => profileMedicineIds.has(medicineId) && done,
    ).length;
    const total = Math.max(1, getProfileMedicines().length);
    return `
      <button class="day-pill ${doneCount > 0 ? "done" : ""}" type="button" data-day-key="${key}" aria-label="${doneCount} von ${total} Einnahmen am ${day.toLocaleDateString(getLocaleConfig().code)} erledigt">
        <span>${formatter.format(day)}</span>
        <strong>${String(day.getDate()).padStart(2, "0")}</strong>
      </button>
    `;
  }).join("");
}

function updateMetrics() {
  const medicines = getProfileMedicines();
  const total = medicines.length;
  const done = medicines.filter((medicine) => isDone(medicine.id)).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  elements.completionText.textContent = `${done} von ${total} erledigt`;
  elements.completionBar.style.width = `${percent}%`;
  elements.adherencePill.textContent = `${getAdherence()}% diese Woche`;

  const next = medicines
    .filter((medicine) => !isDone(medicine.id))
    .sort((a, b) => a.time.localeCompare(b.time))[0];
  elements.nextDose.textContent = next?.time || "--:--";
  elements.nextDoseName.textContent = next?.name || "Keine offene Einnahme";

  const open = medicines.filter((medicine) => !isDone(medicine.id)).length;
  elements.lowStockCount.textContent = medicines.filter((medicine) => Number(medicine.stock) <= Number(medicine.refillAt || 7)).length;
  elements.openDoseCount.textContent = open;
  elements.reminderStatus.textContent = getReminderStatus();
  elements.reminderDelay.textContent = `${state.settings.reminderDelayMinutes} min`;
  elements.vaultStatus.textContent = nativeSecureStorageReady
    ? state.settings.vaultEnabled
      ? "iOS + PIN"
      : "iOS verschlüsselt"
    : state.settings.vaultEnabled
    ? "aktiv"
    : localStorage.getItem(VAULT_KEY)
    ? "gesperrt"
    : "aus";
}

function getAdherence() {
  const stats = getSevenDayStats();
  return Math.round(stats.reduce((sum, value) => sum + value, 0) / stats.length);
}

function getSevenDayStats() {
  const now = new Date();
  const profileMedicineIds = new Set(getProfileMedicines().map((medicine) => medicine.id));
  return Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(now);
    day.setDate(now.getDate() - 6 + offset);
    const key = day.toISOString().slice(0, 10);
    const entries = state.completedToday[key] || {};
    const total = getProfileMedicines().length || 1;
    const done = Object.entries(entries).filter(([medicineId, value]) => profileMedicineIds.has(medicineId) && value).length;
    return Math.round((done / total) * 100);
  });
}

function getDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getRangeKeys(days) {
  const now = new Date();
  return Array.from({ length: days }, (_, offset) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (days - 1 - offset));
    return getDateKey(day);
  });
}

function getHydrationForKey(key, profileId = state.activeProfileId) {
  const entry = state.hydration[key];
  if (!entry) return { amount: 0, goal: Number(state.settings.waterGoal || 2000) };
  if (entry.amount !== undefined) return entry;
  return entry[profileId] || { amount: 0, goal: Number(state.settings.waterGoal || 2000) };
}

function getReportData(days = 7) {
  const profile = state.profiles.find((item) => item.id === state.activeProfileId);
  const medicines = getProfileMedicines();
  const keys = getRangeKeys(days);
  const totalPossible = medicines.length * keys.length;
  const doneTotal = keys.reduce((sum, key) => {
    const entries = state.completedToday[key] || {};
    return sum + medicines.filter((medicine) => entries[medicine.id]).length;
  }, 0);
  const adherence = totalPossible ? Math.round((doneTotal / totalPossible) * 100) : 0;
  const waterTotal = keys.reduce((sum, key) => sum + Number(getHydrationForKey(key).amount || 0), 0);
  const since = new Date();
  since.setDate(since.getDate() - days);
  const events = state.history
    .filter((entry) => new Date(entry.date) >= since)
    .filter((entry) => !entry.profileId || entry.profileId === state.activeProfileId)
    .slice(0, 14);

  return {
    days,
    profile,
    medicines,
    adherence,
    doneTotal,
    totalPossible,
    waterTotal,
    events,
    lowStock: medicines.filter((medicine) => Number(medicine.stock) <= Number(medicine.refillAt || 7)),
    createdAt: new Date(),
  };
}

function renderReport() {
  const data = getReportData(Number(elements.reportRange.value || 7));
  elements.reportPreview.innerHTML = buildReportHtml(data);
  refreshIcons();
}

function buildReportHtml(data) {
  const locale = getLocaleConfig().code;
  const reportText =
    locale === "de-DE"
      ? {
          title: "Arzt- und Apothekenbericht",
          intro: "Privates Protokoll für {days} Tage · erstellt am {created}",
          warning: "Dieser Bericht ist eine private Dokumentation. Er ersetzt keine ärztliche, pharmazeutische oder notfallmedizinische Einschätzung.",
          profile: "Profil",
          adherence: "Einnahmetreue",
          water: "Wasser",
          stock: "Vorrat",
          low: "niedrig",
          period: "im Zeitraum",
          medicines: "Medikamente laut eigener Dokumentation",
          name: "Name",
          dose: "Angabe",
          time: "Zeit",
          today: "Heute",
          documented: "dokumentiert",
          open: "offen",
          noMedicines: "Keine Medikamente für dieses Profil erfasst.",
          events: "Protokollauszug",
          noEvents: "Keine Protokolleinträge im ausgewählten Zeitraum.",
          footer: "Lokal erstellt mit MediLog. Keine automatische Wechselwirkungs-, Diagnose- oder Dosierungsbewertung.",
        }
      : {
          title: "Doctor and pharmacy report",
          intro: "Private log for {days} days · created on {created}",
          warning: "This report is private documentation. It does not replace medical, pharmaceutical or emergency assessment.",
          profile: "Profile",
          adherence: "Adherence",
          water: "Water",
          stock: "Stock",
          low: "low",
          period: "in period",
          medicines: "Medications from your own documentation",
          name: "Name",
          dose: "Dose",
          time: "Time",
          today: "Today",
          documented: "documented",
          open: "open",
          noMedicines: "No medications recorded for this profile.",
          events: "Log excerpt",
          noEvents: "No log entries in the selected period.",
          footer: "Created locally with MediLog. No automatic interaction, diagnosis or dosage assessment.",
        };
  const created = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(data.createdAt);
  const profileName = data.profile?.name || "Unbekannt";
  const profileRole = data.profile?.role || "-";
  const waterLiters = (data.waterTotal / 1000).toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const todayEntries = state.completedToday[todayKey()] || {};

  return `
    <header class="report-doc-header">
      <div>
        <span>MediLog</span>
        <h1>${reportText.title}</h1>
        <p>${reportText.intro.replace("{days}", data.days).replace("{created}", created)}</p>
      </div>
      <strong>${escapeHtml(profileName.slice(0, 1))}</strong>
    </header>

    <section class="report-warning">
      ${reportText.warning}
    </section>

    <section class="report-grid">
      <div><span>${reportText.profile}</span><strong>${escapeHtml(profileName)}</strong><small>${escapeHtml(profileRole)}</small></div>
      <div><span>${reportText.adherence}</span><strong>${data.adherence}%</strong><small>${data.doneTotal} / ${data.totalPossible || 0}</small></div>
      <div><span>${reportText.water}</span><strong>${waterLiters} L</strong><small>${reportText.period}</small></div>
      <div><span>${reportText.stock}</span><strong>${data.lowStock.length}</strong><small>${reportText.low}</small></div>
    </section>

    <section class="report-section">
      <h2>${reportText.medicines}</h2>
      <table>
        <thead><tr><th>${reportText.name}</th><th>${reportText.dose}</th><th>${reportText.time}</th><th>${reportText.today}</th><th>${reportText.stock}</th></tr></thead>
        <tbody>
          ${
            data.medicines.length
              ? data.medicines
                  .map((medicine) => {
                    const low = Number(medicine.stock) <= Number(medicine.refillAt || 7);
                    return `<tr>
                      <td>${escapeHtml(medicine.name)}</td>
                      <td>${escapeHtml(medicine.dose)}</td>
                      <td>${medicine.time}</td>
                      <td>${todayEntries[medicine.id] ? reportText.documented : reportText.open}</td>
                      <td>${medicine.stock} ${low ? `· ${reportText.low}` : ""}</td>
                    </tr>`;
                  })
                  .join("")
              : `<tr><td colspan="5">${reportText.noMedicines}</td></tr>`
          }
        </tbody>
      </table>
    </section>

    <section class="report-section">
      <h2>${reportText.events}</h2>
      <div class="report-events">
        ${
          data.events.length
            ? data.events
                .map(
                  (entry) => `<div>
                    <time>${new Date(entry.date).toLocaleString(locale)}</time>
                    <strong>${escapeHtml(entry.title)}</strong>
                    <span>${escapeHtml(entry.detail)}</span>
                  </div>`,
                )
                .join("")
            : `<p>${reportText.noEvents}</p>`
        }
      </div>
    </section>

    <footer class="report-footer">
      ${reportText.footer}
    </footer>
  `;
}

function getReportDocumentHtml() {
  const locale = getLocaleConfig().code;
  return `<!doctype html>
    <html lang="${locale}">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>MediLog Bericht</title>
        <style>${getReportPrintCss()}</style>
      </head>
      <body>
        <main class="report-document print">${elements.reportPreview.innerHTML}</main>
      </body>
    </html>`;
}

function getReportPrintCss() {
  return `
    body { margin: 0; background: #f4f6f2; color: #101312; font-family: Arial, sans-serif; }
    .report-document { max-width: 860px; margin: 24px auto; padding: 34px; background: #fff; border-radius: 24px; box-shadow: 0 18px 50px rgba(20, 30, 24, .12); }
    .report-doc-header { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; border-bottom: 1px solid #dfe6df; padding-bottom: 22px; }
    .report-doc-header span { color: #347044; font-weight: 800; text-transform: uppercase; font-size: 12px; }
    .report-doc-header h1 { margin: 6px 0 8px; font-size: 30px; line-height: 1.05; }
    .report-doc-header p, .report-footer, .report-events span, .report-grid small { color: #66716b; }
    .report-doc-header strong { width: 52px; height: 52px; display: grid; place-items: center; border-radius: 18px; background: #050706; color: #fff; font-size: 22px; }
    .report-warning { margin: 22px 0; padding: 14px 16px; border-radius: 16px; background: #fff8ef; color: #715039; font-weight: 700; line-height: 1.4; }
    .report-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 22px; }
    .report-grid div { padding: 14px; border-radius: 16px; background: #f4f7f2; }
    .report-grid span { display: block; color: #66716b; font-size: 12px; font-weight: 800; text-transform: uppercase; }
    .report-grid strong { display: block; margin-top: 8px; font-size: 22px; }
    .report-grid small { display: block; margin-top: 3px; font-weight: 700; }
    .report-section { margin-top: 24px; }
    .report-section h2 { font-size: 17px; margin: 0 0 10px; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th, td { padding: 11px 9px; border-bottom: 1px solid #e5ebe5; text-align: left; }
    th { color: #66716b; font-size: 12px; text-transform: uppercase; }
    .report-events { display: grid; gap: 9px; }
    .report-events div { padding: 12px; border-radius: 14px; background: #f8faf7; }
    .report-events time { display: block; color: #66716b; font-size: 12px; font-weight: 700; }
    .report-events strong, .report-events span { display: block; margin-top: 3px; }
    .report-footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #dfe6df; font-size: 12px; }
    @media print {
      body { background: #fff; }
      .report-document { margin: 0; box-shadow: none; border-radius: 0; }
    }
  `;
}

function addHistory(type, title, detail) {
  state.history.unshift({ type, title, detail, profileId: state.activeProfileId, date: new Date().toISOString() });
}

function showToast(message) {
  elements.toast.textContent = t(message);
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("show"), 2400);
}

function scrollAppToTop(behavior = "auto") {
  if (document.documentElement.classList.contains("native-ios")) {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  document.querySelector(".screen")?.scrollTo({ top: 0, behavior });
}

function switchView(viewName, options = {}) {
  const targetView = document.getElementById(`${viewName}-view`);
  if (!targetView) return;

  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view === targetView);
    if (view === targetView) elements.title.textContent = view.dataset.title;
  });
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === viewName);
  });
  if (options.updateHash !== false && location.hash.slice(1) !== viewName) {
    history.replaceState(null, "", `#${viewName}`);
  }
  scrollAppToTop();
  applyLocale();
}

function openMedicineForm() {
  elements.medicineForm.reset();
  elements.medicineForm.elements.time.value = "08:00";
  elements.medicineSheet.showModal();
}

function createId() {
  return globalThis.crypto?.randomUUID?.() || `med-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getReminderStatus() {
  if (!state.settings.remindersEnabled) return "In-App";
  if (nativeCapabilities.notifications === "native") return "iOS aktiv";
  if (!("Notification" in window)) return "Nur In-App";
  return Notification.permission === "granted" ? "Push aktiv" : "Bereit";
}

async function syncNativeReminders(options = {}) {
  if (!medilogNative.available || nativeCapabilities.notifications !== "native") return;

  try {
    if (!state.settings.remindersEnabled) {
      await medilogNative.call("cancelReminders");
      return;
    }

    const profile = state.profiles.find((item) => item.id === state.activeProfileId);
    const result = await medilogNative.call("scheduleReminders", {
      delayMinutes: Number(state.settings.reminderDelayMinutes || 15),
      daysAhead: 14,
      profileName: profile?.name || "Profil",
      completed: state.completedToday,
      medicines: getProfileMedicines().map((medicine) => ({
        id: medicine.id,
        name: medicine.name,
        dose: medicine.dose,
        time: medicine.time,
      })),
    });

    if (!result?.granted) {
      state.settings.remindersEnabled = false;
      saveState();
      if (!options.silent) showToast("iOS-Erinnerungen wurden nicht erlaubt");
      return;
    }

    if (!options.silent) showToast(`${result.scheduled || 0} iOS-Erinnerungen geplant`);
  } catch (error) {
    if (!options.silent) showToast(error.message || "iOS-Erinnerungen nicht verfügbar");
  }
}

function minutesSinceMidnight(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function checkReminders() {
  if (!state.settings.remindersEnabled) return;

  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  getProfileMedicines().forEach((medicine) => {
    const overdue = current - minutesSinceMidnight(medicine.time);
    if (overdue < state.settings.reminderDelayMinutes || isDone(medicine.id)) return;
    const reminderKey = `${todayKey()}-${medicine.id}`;
    if (sessionStorage.getItem(reminderKey)) return;
    sessionStorage.setItem(reminderKey, "sent");
    showToast(`${medicine.name}: Einnahme noch offen`);
    if (state.settings.remindersEnabled && Notification.permission === "granted") {
      new Notification("MediLog Erinnerung", { body: `${medicine.name} ist noch offen. Bitte nur laut eigenem Plan handeln.` });
    }
  });
}

async function deriveKey(pin, salt) {
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptVault(pin) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pin, salt);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(state)));
  localStorage.setItem(
    VAULT_KEY,
    JSON.stringify({
      salt: btoa(String.fromCharCode(...salt)),
      iv: btoa(String.fromCharCode(...iv)),
      data: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    }),
  );
  localStorage.removeItem(STORAGE_KEY);
}

async function decryptVault(pin) {
  const vault = JSON.parse(localStorage.getItem(VAULT_KEY));
  const salt = Uint8Array.from(atob(vault.salt), (char) => char.charCodeAt(0));
  const iv = Uint8Array.from(atob(vault.iv), (char) => char.charCodeAt(0));
  const data = Uint8Array.from(atob(vault.data), (char) => char.charCodeAt(0));
  const key = await deriveKey(pin, salt);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return hydrateState(JSON.parse(new TextDecoder().decode(decrypted)));
}

function refreshIcons() {
  if (!globalThis.lucide?.createIcons) return;
  lucide.createIcons();
  document.querySelectorAll("svg.lucide").forEach((icon) => {
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("click", (event) => {
  const premiumFeature = event.target.closest("[data-premium-feature]");
  if (premiumFeature) {
    requirePremium(premiumFeature.dataset.premiumFeature);
    return;
  }

  const premiumPlan = event.target.closest("[data-premium-product-id]");
  if (premiumPlan) {
    selectedPremiumProductId = premiumPlan.dataset.premiumProductId;
    setPremiumInlineMessage("");
    renderSettings();
    refreshIcons();
    return;
  }

  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    switchView(viewButton.dataset.view);
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (actionButton?.dataset.action === "open-medicine-form") {
    if (!isPremium() && getProfileMedicines().length >= FREE_MEDICINE_LIMIT) {
      requirePremium(`mehr als ${FREE_MEDICINE_LIMIT} Medikamente`);
    } else {
      openMedicineForm();
    }
  }
  if (actionButton?.dataset.action === "open-dose-form") elements.quickSheet.showModal();
  if (actionButton?.dataset.action === "open-reminder-settings") {
    switchView("schutz");
    document.querySelector(".settings-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
    showToast("Reminder findest du in den Tracking-Einstellungen");
  }
  if (actionButton?.dataset.action === "open-report") {
    if (!requirePremium("Arzt-/Apothekenbericht")) return;
    renderReport();
    elements.reportSheet.showModal();
  }
  if (actionButton?.dataset.action === "open-profile-form" && requirePremium("mehrere Pflegeprofile")) elements.profileSheet.showModal();
  if (actionButton?.dataset.action === "open-scan-sheet" && requirePremium("Medikationsplan-QR-Import")) elements.scanSheet.showModal();

  const routineButton = event.target.closest("[data-routine-action]");
  if (routineButton) {
    const action = routineButton.dataset.routineAction;
    if (action === "dose") {
      document.querySelector(".today-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      const open = getProfileMedicines().filter((medicine) => !isDone(medicine.id)).length;
      showToast(open > 0 ? `${open} Einnahmen offen` : "Heute ist alles dokumentiert");
      return;
    }
    if (action === "stock") {
      switchView("bibliothek");
      document.querySelector(".stock-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (action === "report") {
      if (!requirePremium("Arzt-/Apothekenbericht")) return;
      renderReport();
      elements.reportSheet.showModal();
      return;
    }
    if (action === "privacy") {
      switchView("schutz");
      document.querySelector(".privacy-rights")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  }

  const medicineCard = event.target.closest("[data-medicine-id]");
  if (medicineCard) {
    openMedicineDetail(medicineCard.dataset.medicineId);
    return;
  }

  const doseButton = event.target.closest("[data-dose-id]");
  if (doseButton) {
    if (!requirePrivacyConsent("Einnahme dokumentieren")) return;
    const medicine = state.medicines.find((item) => item.id === doseButton.dataset.doseId);
    const nextState = !isDone(medicine.id);
    setDone(medicine.id, nextState);
    medicine.stock = Math.max(0, Number(medicine.stock) + (nextState ? -1 : 1));
    addHistory(nextState ? "done" : "note", medicine.name, nextState ? `${medicine.time} dokumentiert` : "Markierung entfernt");
    saveState();
    void syncNativeReminders({ silent: true });
    render();
    showToast(nextState ? "Einnahme dokumentiert" : "Einnahme wieder offen");
  }

  const profileButton = event.target.closest("[data-profile-id]");
  if (profileButton) {
    if (profileButton.dataset.profileId !== state.activeProfileId && !requirePremium("mehrere Profile")) return;
    state.activeProfileId = profileButton.dataset.profileId;
    saveState();
    void syncNativeReminders({ silent: true });
    render();
    showToast("Profil gewechselt");
  }

  const restockButton = event.target.closest("[data-restock-id]");
  if (restockButton) {
    if (!requirePremium("Vorratsmanagement")) return;
    if (!requirePrivacyConsent("Vorrat aktualisieren")) return;
    const medicine = state.medicines.find((item) => item.id === restockButton.dataset.restockId);
    medicine.stock = Number(medicine.stock) + 14;
    addHistory("note", `${medicine.name} Vorrat aktualisiert`, `${medicine.stock} Einheiten`);
    saveState();
    render();
    showToast("Vorrat aktualisiert");
  }

  const dayButton = event.target.closest("[data-day-key]");
  if (dayButton) {
    const entries = state.completedToday[dayButton.dataset.dayKey] || {};
    const ids = new Set(getProfileMedicines().map((medicine) => medicine.id));
    const done = Object.entries(entries).filter(([medicineId, value]) => ids.has(medicineId) && value).length;
    showToast(`${done} Einnahmen an diesem Tag dokumentiert`);
    return;
  }

  const closeButton = event.target.closest("[data-close]");
  if (closeButton) document.querySelector(`#${closeButton.dataset.close}`).close();
});

document.querySelector("#quick-add").addEventListener("click", () => {
  elements.quickSheet.showModal();
});

document.querySelector("#add-water").addEventListener("click", () => addWater());

elements.searchButton.addEventListener("click", () => {
  elements.searchPanel.classList.toggle("hidden");
  if (!elements.searchPanel.classList.contains("hidden")) elements.searchInput.focus();
});

elements.searchInput.addEventListener("input", render);

document.querySelector("#enable-reminders").addEventListener("click", async () => {
  if (!requirePremium("erweiterte Erinnerungen")) return;
  if (!requirePrivacyConsent("Erinnerungen aktivieren")) return;
  state.settings.remindersEnabled = true;
  if (nativeCapabilities.notifications === "native") {
    await syncNativeReminders();
  } else if ("Notification" in window && Notification.permission === "default") {
    await Notification.requestPermission();
  }
  saveState();
  render();
  checkReminders();
  showToast(getReminderStatus() === "iOS aktiv" ? "iOS-Erinnerungen aktiv" : getReminderStatus() === "Push aktiv" ? "Push-Erinnerungen aktiv" : "In-App-Erinnerungen aktiv");
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    state.activeFilter = chip.dataset.filter;
    document.querySelectorAll(".chip").forEach((item) => item.classList.toggle("active", item === chip));
    render();
  });
});

document.querySelector("#quick-sheet form").addEventListener("submit", (event) => {
  const action = event.submitter?.value;
  if (action === "medicine") {
    if (!isPremium() && getProfileMedicines().length >= FREE_MEDICINE_LIMIT) {
      requirePremium(`mehr als ${FREE_MEDICINE_LIMIT} Medikamente`);
      return;
    }
    window.setTimeout(openMedicineForm, 80);
    return;
  }

  if (action === "note") {
    if (!requirePrivacyConsent("Notiz erfassen")) return;
    window.setTimeout(() => elements.noteSheet.showModal(), 80);
    return;
  }

  if (action === "water") {
    addWater();
    return;
  }

  if (!requirePrivacyConsent("Einnahme dokumentieren")) return;
  const next = getProfileMedicines()
    .filter((medicine) => !isDone(medicine.id))
    .sort((a, b) => a.time.localeCompare(b.time))[0];
  if (!next) {
    showToast("Heute ist bereits alles dokumentiert");
    return;
  }

  setDone(next.id, true);
  next.stock = Math.max(0, Number(next.stock) - 1);
  addHistory("done", next.name, `${next.time} dokumentiert`);
  saveState();
  void syncNativeReminders({ silent: true });
  render();
  showToast("Nächste offene Einnahme dokumentiert");
});

document.querySelector("#medicine-detail-sheet form").addEventListener("submit", (event) => {
  const medicine = state.medicines.find((item) => item.id === selectedMedicineId);
  if (!medicine) return;
  const action = event.submitter?.value;

  if (action === "done") {
    if (!requirePrivacyConsent("Einnahme dokumentieren")) return;
    const nextState = !isDone(medicine.id);
    setDone(medicine.id, nextState);
    medicine.stock = Math.max(0, Number(medicine.stock) + (nextState ? -1 : 1));
    addHistory(nextState ? "done" : "note", medicine.name, nextState ? `${medicine.time} dokumentiert` : "Markierung entfernt");
    saveState();
    void syncNativeReminders({ silent: true });
    render();
    showToast(nextState ? "Einnahme dokumentiert" : "Einnahme wieder offen");
  }

  if (action === "restock") {
    if (!requirePremium("Vorratsmanagement")) return;
    if (!requirePrivacyConsent("Vorrat aktualisieren")) return;
    medicine.stock = Number(medicine.stock) + 14;
    addHistory("note", `${medicine.name} Vorrat aktualisiert`, `${medicine.stock} Einheiten`);
    saveState();
    render();
    showToast("Vorrat aktualisiert");
  }

  if (action === "note") {
    if (!requirePrivacyConsent("Notiz erfassen")) return;
    window.setTimeout(() => elements.noteSheet.showModal(), 80);
  }
});

elements.medicineForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requirePrivacyConsent("Medikament speichern")) {
    elements.medicineSheet.close();
    return;
  }
  if (!isPremium() && getProfileMedicines().length >= FREE_MEDICINE_LIMIT) {
    elements.medicineSheet.close();
    requirePremium(`mehr als ${FREE_MEDICINE_LIMIT} Medikamente`);
    return;
  }
  const data = new FormData(elements.medicineForm);
  const medicine = {
    id: createId(),
    name: data.get("name").trim(),
    dose: data.get("dose").trim(),
    time: data.get("time"),
    stock: Number(data.get("stock")),
    refillAt: 7,
    profileId: state.activeProfileId,
  };

  state.medicines.push(medicine);
  addHistory("note", `${medicine.name} erfasst`, "Eigene Angabe gespeichert");
  saveState();
  void syncNativeReminders({ silent: true });
  elements.medicineSheet.close();
  render();
  showToast("Medikament lokal gespeichert");
});

elements.onboardingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(elements.onboardingForm);
  if (!data.get("privacyConsent")) {
    showToast("Bitte Datenschutz-Bestätigung setzen");
    return;
  }
  const mode = data.get("mode");
  const profileName = data.get("profileName").trim();
  const profileId = mode === "care" ? "profile-care-primary" : "profile-self";
  const premiumSnapshot = {
    premiumActive: Boolean(state.settings.premiumActive),
    premiumPreview: Boolean(state.settings.premiumPreview),
    premiumSource: state.settings.premiumSource || "none",
    premiumUntil: state.settings.premiumUntil || null,
  };
  state = createFreshState();
  Object.assign(state.settings, premiumSnapshot);
  state.profiles.push({ id: profileId, name: profileName, role: mode === "care" ? "Pflege" : "Selbst" });
  state.activeProfileId = profileId;
  state.settings.waterGoal = Number(data.get("waterGoal")) || 2000;

  const medicineName = data.get("medicineName").trim();
  if (medicineName) {
    state.medicines.push({
      id: createId(),
      profileId,
      name: medicineName,
      dose: data.get("medicineDose").trim() || "laut eigenem Plan",
      time: data.get("medicineTime") || "08:00",
      stock: Number(data.get("medicineStock")) || 14,
      refillAt: 7,
    });
  }

  addHistory("note", "Onboarding abgeschlossen", mode === "care" ? "Pflege-Modus eingerichtet" : "Eigenes Profil eingerichtet");
  saveState();
  void syncNativeReminders({ silent: true });
  elements.onboardingSheet.close();
  render();
  showToast("MediLog ist eingerichtet");
});

document.querySelector("#skip-onboarding").addEventListener("click", () => {
  state.settings.onboarded = true;
  saveState();
  elements.onboardingSheet.close();
  render();
  showToast("Demo gestartet");
});

elements.onboardingForm.elements.mode.forEach((input) => {
  input.addEventListener("change", () => {
    elements.onboardingForm.elements.profileName.value = input.value === "care" ? "Mama" : "Ich";
  });
});

elements.profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requirePrivacyConsent("Profil speichern")) {
    elements.profileSheet.close();
    return;
  }
  const data = new FormData(elements.profileForm);
  const profile = {
    id: createId(),
    name: data.get("name").trim(),
    role: data.get("role").trim(),
  };
  state.profiles.push(profile);
  state.activeProfileId = profile.id;
  addHistory("note", `${profile.name} Profil angelegt`, profile.role);
  saveState();
  void syncNativeReminders({ silent: true });
  elements.profileSheet.close();
  elements.profileForm.reset();
  render();
  showToast("Profil lokal gespeichert");
});

elements.scanForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requirePremium("Medikationsplan-Import")) return;
  if (!requirePrivacyConsent("Medikationsplan speichern")) {
    elements.scanSheet.close();
    return;
  }
  const plan = new FormData(elements.scanForm).get("plan").trim();
  addHistory("note", "Medikationsplan importiert", plan.slice(0, 120));
  saveState();
  elements.scanSheet.close();
  elements.scanForm.reset();
  render();
  showToast("Planinhalt als private Notiz gespeichert");
});

document.querySelector("#native-scan-button").addEventListener("click", async () => {
  if (!requirePremium("nativer Medikationsplan-Scan")) return;
  if (!requirePrivacyConsent("Medikationsplan scannen")) return;
  if (!medilogNative.available) {
    showToast("Kamera-Scan ist in der Web-Vorschau nicht verfügbar");
    return;
  }

  try {
    const result = await medilogNative.call("startPlanScan");
    if (!result?.value) {
      showToast("Kein QR-Inhalt erkannt");
      return;
    }
    elements.scanForm.elements.plan.value = result.value;
    showToast("QR-Inhalt erkannt");
  } catch (error) {
    showToast(error.message || "Kamera-Scan nicht verfügbar");
  }
});

document.querySelector("#qr-file").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!requirePrivacyConsent("Medikationsplan einlesen")) return;
  if (!("BarcodeDetector" in window)) {
    showToast("Dieser Browser kann QR-Bilder nicht direkt lesen");
    return;
  }

  try {
    const detector = new BarcodeDetector({ formats: ["qr_code"] });
    const bitmap = await createImageBitmap(file);
    const codes = await detector.detect(bitmap);
    const value = codes[0]?.rawValue;
    if (!value) {
      showToast("Kein QR-Code erkannt");
      return;
    }
    elements.scanForm.elements.plan.value = value;
    showToast("QR-Inhalt erkannt");
  } catch {
    showToast("QR-Erkennung nicht verfügbar");
  }
});

elements.noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requirePrivacyConsent("Notiz speichern")) {
    elements.noteSheet.close();
    return;
  }
  const note = new FormData(elements.noteForm).get("note").trim();
  addHistory("note", "Private Notiz", note);
  saveState();
  elements.noteSheet.close();
  elements.noteForm.reset();
  render();
  showToast("Notiz lokal gespeichert");
});

document.querySelector("#export-button").addEventListener("click", () => {
  if (!requirePremium("Arzt-/Apothekenbericht")) return;
  renderReport();
  elements.reportSheet.showModal();
});

elements.reportRange.addEventListener("change", renderReport);

document.querySelector("#download-report").addEventListener("click", () => {
  if (!requirePremium("Bericht exportieren")) return;
  renderReport();
  const blob = new Blob([getReportDocumentHtml()], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const profile = state.profiles.find((item) => item.id === state.activeProfileId);
  link.href = url;
  link.download = `medilog-bericht-${profile?.name || "profil"}-${todayKey()}.html`.replaceAll(" ", "-").toLowerCase();
  link.click();
  URL.revokeObjectURL(url);
  showToast("Bericht gespeichert");
});

document.querySelector("#print-report").addEventListener("click", () => {
  if (!requirePremium("PDF-/Druckbericht")) return;
  renderReport();
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    showToast("Druckfenster wurde blockiert");
    return;
  }
  printWindow.document.write(getReportDocumentHtml());
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
});

document.querySelector("#reset-button").addEventListener("click", async () => {
  const confirmed = window.confirm("Lokale Demo-Daten wirklich löschen? Diese Aktion entfernt gespeicherte Gesundheitsdaten aus diesem Browser.");
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(VAULT_KEY);
  if (medilogNative.available) {
    await medilogNative.call("resetSecureState").catch(() => {});
  }
  state = structuredClone(seedState);
  render();
  showToast("Demo-Daten zurückgesetzt");
});

document.querySelector("#privacy-export").addEventListener("click", () => {
  const payload = JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      purpose: "DSGVO-Auskunft / lokale Datenkopie",
      storage: nativeSecureStorageReady
        ? "iOS Application Support, AES-GCM verschlüsselt; Schlüssel in iOS Keychain"
        : "Browser localStorage / optional verschlüsselter Web-Crypto-Vault",
      categories: ["profile", "medicines", "dose log", "hydration", "notes", "settings"],
      state,
    },
    null,
    2,
  );
  const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `medilog-dsgvo-export-${todayKey()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("DSGVO-Export erstellt");
});

document.querySelector("#privacy-consent").addEventListener("click", () => {
  state.settings.privacyConsentAt = new Date().toISOString();
  saveState();
  render();
  showToast("Einwilligung lokal dokumentiert");
});

document.querySelector("#copy-shopping-list").addEventListener("click", async () => {
  if (!requirePremium("Nachkaufliste")) return;
  const low = getProfileMedicines().filter((medicine) => Number(medicine.stock) <= Number(medicine.refillAt || 7));
  const list = low.length ? low.map((medicine) => `${medicine.name} (${medicine.dose})`).join("\n") : "Keine Nachkäufe offen";
  try {
    await navigator.clipboard?.writeText(list);
    showToast("Nachkaufliste kopiert");
  } catch {
    showToast(list);
  }
});

document.querySelector("#senior-mode")?.addEventListener("click", () => {
  state.settings.seniorMode = !state.settings.seniorMode;
  saveState();
  render();
  showToast(state.settings.seniorMode ? "Einfach-Modus aktiv" : "Einfach-Modus aus");
});

elements.settingWaterGoal.addEventListener("change", () => {
  state.settings.waterGoal = Number(elements.settingWaterGoal.value) || 2000;
  getHydrationEntry().goal = state.settings.waterGoal;
  saveState();
  render();
  showToast("Wasserziel gespeichert");
});

elements.settingLanguage?.addEventListener("change", () => {
  state.settings.locale = normalizeLocale(elements.settingLanguage.value);
  saveState();
  render();
  showToast("Sprache gespeichert");
});

elements.languageGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-locale]");
  if (!button) return;
  state.settings.locale = normalizeLocale(button.dataset.locale);
  saveState();
  render();
  showToast("Sprache gespeichert");
});

elements.settingReminderDelay.addEventListener("change", () => {
  state.settings.reminderDelayMinutes = Number(elements.settingReminderDelay.value) || 15;
  saveState();
  void syncNativeReminders({ silent: true });
  render();
  showToast("Reminder-Abstand gespeichert");
});

elements.settingRemindersEnabled.addEventListener("change", async () => {
  if (elements.settingRemindersEnabled.checked && !requirePremium("zuverlaessige Erinnerungen")) {
    elements.settingRemindersEnabled.checked = false;
    return;
  }
  if (elements.settingRemindersEnabled.checked && !requirePrivacyConsent("Erinnerungen aktivieren")) {
    elements.settingRemindersEnabled.checked = false;
    return;
  }
  state.settings.remindersEnabled = elements.settingRemindersEnabled.checked;
  if (nativeCapabilities.notifications === "native") {
    await syncNativeReminders();
  } else if (state.settings.remindersEnabled && "Notification" in window && Notification.permission === "default") {
    await Notification.requestPermission();
  }
  saveState();
  render();
  showToast(state.settings.remindersEnabled ? "Erinnerungen aktiv" : "Erinnerungen aus");
});

elements.settingSeniorMode.addEventListener("change", () => {
  state.settings.seniorMode = elements.settingSeniorMode.checked;
  saveState();
  render();
  showToast(state.settings.seniorMode ? "Einfach-Modus aktiv" : "Einfach-Modus aus");
});

elements.refillSettingsList.addEventListener("change", (event) => {
  const input = event.target.closest("[data-refill-setting-id]");
  if (!input) return;
  if (!requirePremium("Nachkaufgrenzen")) return;

  const medicine = state.medicines.find((item) => item.id === input.dataset.refillSettingId);
  medicine.refillAt = Number(input.value) || 0;
  saveState();
  render();
  showToast("Nachkaufgrenze gespeichert");
});

elements.premiumButton.addEventListener("click", async () => {
  if (isPremium()) {
    showToast("Premium ist bereits aktiv");
    return;
  }

  premiumPurchasePending = true;
  setPremiumInlineMessage(
    medilogNative.available ? "Apple Kaufdialog wird geöffnet..." : "Webvorschau wird lokal aktiviert.",
    "info",
  );
  renderSettings();
  refreshIcons();

  try {
    if (medilogNative.available) {
      const entitlement = await medilogNative.call("purchasePremium", { productId: getSelectedPremiumProduct().id });
      if (!applyPremiumEntitlement(entitlement)) return;
    } else {
      state.settings.premiumActive = true;
      state.settings.premiumPreview = false;
      state.settings.premiumSource = `web-preview:${getSelectedPremiumProduct().id}`;
      showToast("Premium-Webvorschau aktiv");
    }
    setPremiumInlineMessage("Premium ist aktiv.", "success");
  } catch (error) {
    const message = error.message || "Premium konnte nicht aktiviert werden";
    setPremiumInlineMessage(message, "error");
    showToast(message);
    return;
  } finally {
    premiumPurchasePending = false;
    renderSettings();
    refreshIcons();
  }

  saveState();
  render();
});

document.querySelector("#premium-restore").addEventListener("click", async () => {
  if (!medilogNative.available) {
    const message = "Wiederherstellung ist nur in der iOS-App verfügbar";
    setPremiumInlineMessage(message, "error");
    renderSettings();
    showToast(message);
    return;
  }

  premiumPurchasePending = true;
  setPremiumInlineMessage("Käufe werden bei Apple geprüft...", "info");
  renderSettings();
  refreshIcons();

  try {
    const entitlement = await medilogNative.call("restorePurchases");
    if (!applyPremiumEntitlement(entitlement)) {
      setPremiumInlineMessage("Kein aktiver Premium-Kauf gefunden.", "error");
      showToast("Kein Premium-Kauf gefunden");
      return;
    }
    setPremiumInlineMessage("Premium wurde wiederhergestellt.", "success");
    saveState();
    render();
  } catch (error) {
    const message = error.message || "Kauf konnte nicht wiederhergestellt werden";
    setPremiumInlineMessage(message, "error");
    showToast(message);
  } finally {
    premiumPurchasePending = false;
    renderSettings();
    refreshIcons();
  }
});

document.querySelector("#vault-button").addEventListener("click", async () => {
  if (!requirePremium("PIN-Vault")) return;
  const pin = elements.vaultPin.value.trim();
  if (pin.length < 4) {
    showToast("Bitte mindestens 4 Ziffern oder Zeichen verwenden");
    return;
  }

  try {
    if (nativeSecureStorageReady) {
      state.settings.vaultEnabled = true;
      activeVaultPin = pin;
      await medilogNative.call("saveSecureState", { state });
      elements.vaultPin.value = "";
      render();
      showToast("iOS-Keychain-Vault aktiv");
      return;
    }

    if (localStorage.getItem(VAULT_KEY) && !state.settings.vaultEnabled) {
      state = await decryptVault(pin);
      state.settings.vaultEnabled = true;
      activeVaultPin = pin;
      showToast("Vault entsperrt");
    } else {
      state.settings.vaultEnabled = true;
      activeVaultPin = pin;
      await encryptVault(pin);
      showToast("Lokaler Vault verschlüsselt");
    }
    elements.vaultPin.value = "";
    render();
  } catch {
    showToast("PIN konnte den Vault nicht entsperren");
  }
});

document.querySelector("#vault-biometric-button").addEventListener("click", async () => {
  if (!requirePremium("Face ID / Touch ID")) return;
  if (!medilogNative.available) {
    showToast("Biometrie ist nur in der iOS-App verfügbar");
    return;
  }

  try {
    const result = await medilogNative.call("biometricUnlock");
    showToast(result?.unlocked ? "Biometrie bestätigt" : "Biometrie ist auf diesem Simulator nicht verfügbar");
  } catch (error) {
    showToast(error.message || "Biometrie konnte nicht verwendet werden");
  }
});

render();
void bootstrapNative();
if (location.hash.slice(1)) routeToHash();
window.addEventListener("hashchange", () => routeToHash());
checkReminders();
window.setInterval(checkReminders, 60000);

window.setTimeout(() => {
  if (!state.settings.onboarded && !localStorage.getItem(VAULT_KEY)) {
    elements.onboardingSheet.showModal();
    refreshIcons();
  }
}, 750);

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      showToast("Offline-Modus konnte nicht aktiviert werden");
    });
  });
}
