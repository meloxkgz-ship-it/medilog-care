import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { chromium } = require(path.join(root, ".asc/test-runner/node_modules/playwright"));

const metadataDir = path.join(root, "ios/MediLogNative/AppStoreMetadata");
const outputRoot = path.join(root, ".asc/screenshots/marketing-localized/iphone-65");
const rawRoot = path.join(root, ".asc/screenshots/raw-localized/iphone-65");
const viewport = { width: 428, height: 926 };
const deviceScaleFactor = 3;

const shots = [
  { file: "01-home.png", route: "home", key: "home" },
  { file: "02-plaene.png", route: "plaene", key: "plans" },
  { file: "03-medis.png", route: "bibliothek", key: "meds" },
  { file: "04-verlauf.png", route: "verlauf", key: "history" },
  { file: "05-premium.png", route: "premium", key: "premium" },
];

const copy = {
  de: {
    home: ["Medikamente ruhig im Blick", "Einnahmen, Wasser und Vorrat lokal dokumentieren."],
    plans: ["Erinnerungen ohne Cloud", "Lokale Regeln für Alltag, Pflege und Sicherheit."],
    meds: ["Vorrat rechtzeitig sehen", "Nachkauf, Bestand und eigene Angaben sauber getrennt."],
    history: ["Berichte für Arzt und Apotheke", "Private Protokolle manuell exportieren."],
    premium: ["Premium für echte Routine", "Familie, Export, Vault und Vorrat ohne künstliche Reibung."],
  },
  en: {
    home: ["Medication without noise", "Track doses, water and stock locally."],
    plans: ["Local reminders you control", "Rules for routine, care and privacy."],
    meds: ["Know what needs refill", "Stock, refill and medication details in one place."],
    history: ["Reports for doctor or pharmacy", "Export private logs when you need them."],
    premium: ["Premium for real routines", "Family, export, vault and stock without friction."],
  },
  es: {
    home: ["Medicamentos bajo control", "Registra tomas, agua e inventario en local."],
    plans: ["Recordatorios locales", "Reglas para rutina, cuidado y privacidad."],
    meds: ["Revisa el inventario a tiempo", "Stock, reposición y datos separados con claridad."],
    history: ["Informes para médico o farmacia", "Exporta registros privados cuando los necesites."],
    premium: ["Premium para rutinas reales", "Familia, exportación, bóveda e inventario sin fricción."],
  },
  fr: {
    home: ["Traitements sous contrôle", "Suivez prises, eau et stock localement."],
    plans: ["Rappels locaux maîtrisés", "Des règles pour la routine, l’aide et la confidentialité."],
    meds: ["Voir le stock à temps", "Stock, renouvellement et détails au même endroit."],
    history: ["Rapports médecin ou pharmacie", "Exportez vos journaux privés au bon moment."],
    premium: ["Premium pour une vraie routine", "Famille, export, coffre et stock sans friction."],
  },
  it: {
    home: ["Farmaci sotto controllo", "Registra assunzioni, acqua e scorte in locale."],
    plans: ["Promemoria locali", "Regole per routine, cura e privacy."],
    meds: ["Scorte visibili per tempo", "Dettagli, stock e rifornimenti in un solo posto."],
    history: ["Report per medico o farmacia", "Esporta registri privati quando servono."],
    premium: ["Premium per routine reali", "Famiglia, export, vault e scorte senza attrito."],
  },
  pt: {
    home: ["Medicamentos em ordem", "Registre doses, água e estoque localmente."],
    plans: ["Lembretes locais", "Regras para rotina, cuidado e privacidade."],
    meds: ["Veja o estoque a tempo", "Estoque, reposição e detalhes no mesmo lugar."],
    history: ["Relatórios para médico ou farmácia", "Exporte registros privados quando precisar."],
    premium: ["Premium para rotina real", "Família, exportação, cofre e estoque sem atrito."],
  },
  nl: {
    home: ["Medicatie rustig op orde", "Leg innames, water en voorraad lokaal vast."],
    plans: ["Lokale herinneringen", "Regels voor routine, zorg en privacy."],
    meds: ["Voorraad op tijd zien", "Stock, aanvulling en details samen."],
    history: ["Rapporten voor arts of apotheek", "Exporteer privélogs wanneer nodig."],
    premium: ["Premium voor echte routine", "Familie, export, kluis en voorraad zonder gedoe."],
  },
  pl: {
    home: ["Leki pod kontrolą", "Zapisuj dawki, wodę i zapasy lokalnie."],
    plans: ["Lokalne przypomnienia", "Reguły dla rutyny, opieki i prywatności."],
    meds: ["Zobacz zapasy na czas", "Stan, uzupełnianie i szczegóły w jednym miejscu."],
    history: ["Raporty dla lekarza lub apteki", "Eksportuj prywatne dzienniki wtedy, gdy trzeba."],
    premium: ["Premium dla prawdziwej rutyny", "Rodzina, eksport, sejf i zapasy bez tarcia."],
  },
  tr: {
    home: ["İlaçlar sade şekilde takipte", "Dozları, suyu ve stoğu yerel kaydet."],
    plans: ["Yerel hatırlatıcılar", "Rutin, bakım ve gizlilik için kurallar."],
    meds: ["Stoğu zamanında gör", "Stok, yenileme ve detaylar tek yerde."],
    history: ["Doktor veya eczane raporu", "Özel kayıtları gerektiğinde dışa aktar."],
    premium: ["Gerçek rutin için Premium", "Aile, dışa aktarma, kasa ve stok."],
  },
  ar: {
    home: ["أدويتك بهدوء وتنظيم", "سجّل الجرعات والماء والمخزون محلياً."],
    plans: ["تذكيرات محلية تحت سيطرتك", "قواعد للروتين والرعاية والخصوصية."],
    meds: ["اعرف المخزون قبل نفاده", "المخزون والتجديد والتفاصيل في مكان واحد."],
    history: ["تقارير للطبيب أو الصيدلية", "صدّر السجلات الخاصة عند الحاجة."],
    premium: ["Premium لروتين حقيقي", "العائلة والتصدير والخزنة والمخزون بدون تعقيد."],
  },
  he: {
    home: ["תרופות במעקב רגוע", "תעדו נטילות, מים ומלאי באופן מקומי."],
    plans: ["תזכורות מקומיות", "כללים לשגרה, טיפול ופרטיות."],
    meds: ["לראות מלאי בזמן", "מלאי, חידוש ופרטים במקום אחד."],
    history: ["דוחות לרופא או לבית מרקחת", "ייצאו יומנים פרטיים כשצריך."],
    premium: ["Premium לשגרה אמיתית", "משפחה, ייצוא, כספת ומלאי בלי חיכוך."],
  },
  ja: {
    home: ["服薬を静かに管理", "服薬・水分・在庫を端末内で記録。"],
    plans: ["ローカル通知を自分で管理", "毎日の習慣、ケア、プライバシーのために。"],
    meds: ["在庫切れを早めに確認", "在庫、補充、薬の詳細を一か所に。"],
    history: ["医師・薬局向けレポート", "必要なときにプライベート記録を出力。"],
    premium: ["本当の習慣のためのPremium", "家族、出力、Vault、在庫管理を快適に。"],
  },
  ko: {
    home: ["복약을 차분하게 관리", "복약, 물, 재고를 기기 안에 기록."],
    plans: ["내가 제어하는 로컬 알림", "루틴, 돌봄, 개인정보를 위한 규칙."],
    meds: ["재고를 미리 확인", "재고, 보충, 약 정보를 한곳에."],
    history: ["의사·약국용 보고서", "필요할 때 개인 기록을 내보내기."],
    premium: ["진짜 루틴을 위한 Premium", "가족, 내보내기, Vault, 재고 관리."],
  },
  zh: {
    home: ["安静管理用药", "在本机记录服药、饮水和库存。"],
    plans: ["你可控的本地提醒", "为日常、照护与隐私设置规则。"],
    meds: ["及时查看库存", "库存、补货和药品详情集中管理。"],
    history: ["给医生或药房的报告", "需要时导出私人记录。"],
    premium: ["为真实日常准备的 Premium", "家庭、导出、保险库和库存管理。"],
  },
};

const footerCopy = {
  de: "Lokal. Privat. Keine Cloud.",
  en: "Local. Private. No cloud.",
  es: "Local. Privado. Sin nube.",
  fr: "Local. Privé. Sans cloud.",
  it: "Locale. Privato. Nessun cloud.",
  pt: "Local. Privado. Sem nuvem.",
  nl: "Lokaal. Privé. Geen cloud.",
  pl: "Lokalnie. Prywatnie. Bez chmury.",
  tr: "Yerel. Özel. Bulut yok.",
  ar: "محلي. خاص. بلا سحابة.",
  he: "מקומי. פרטי. בלי ענן.",
  ja: "ローカル。プライベート。クラウドなし。",
  ko: "로컬. 비공개. 클라우드 없음.",
  zh: "本机。私密。无云端。",
};

const mime = new Map([
  [".html", "text/html;charset=utf-8"],
  [".js", "text/javascript;charset=utf-8"],
  [".css", "text/css;charset=utf-8"],
  [".json", "application/json;charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webmanifest", "application/manifest+json"],
]);

function languageOf(locale) {
  if (locale.startsWith("zh")) return "zh";
  return locale.split("-")[0];
}

function stringsFor(locale, key) {
  const lang = languageOf(locale);
  return (copy[lang] || copy.en)[key] || copy.en[key];
}

function footerFor(locale) {
  const lang = languageOf(locale);
  return footerCopy[lang] || footerCopy.en;
}

function isRtl(locale) {
  return locale === "ar-SA" || locale === "he";
}

function createScreenshotState(locale) {
  const now = new Date().toISOString();
  return {
    activeFilter: "all",
    activeProfileId: "profile-self",
    settings: {
      onboarded: true,
      remindersEnabled: true,
      reminderDelayMinutes: 15,
      vaultEnabled: false,
      seniorMode: false,
      waterGoal: 2000,
      premiumActive: false,
      premiumPreview: false,
      premiumSource: "none",
      premiumUntil: null,
      privacyConsentAt: now,
      locale,
    },
    profiles: [
      { id: "profile-self", name: locale === "de-DE" ? "Ich" : "Me", role: locale === "de-DE" ? "Selbst" : "Self" },
      { id: "profile-care", name: "Mama", role: locale === "de-DE" ? "Pflege" : "Care" },
    ],
    medicines: [
      { id: "med-ramipril", profileId: "profile-self", name: "Ramipril", dose: "5 mg", time: "08:00", stock: 6, refillAt: 7 },
      { id: "med-vitamin-d", profileId: "profile-self", name: "Vitamin D", dose: "1000 IE", time: "09:00", stock: 31, refillAt: 10 },
    ],
    completedToday: {},
    hydration: {
      [new Date().toISOString().slice(0, 10)]: {
        "profile-self": { amount: 750, goal: 2000 },
      },
    },
    history: [
      { type: "done", title: "Vitamin D", detail: "09:04", profileId: "profile-self", date: now },
      { type: "done", title: "Ramipril", detail: "08:06", profileId: "profile-self", date: now },
    ],
  };
}

function createServer() {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(root, safePath === "/" ? "index.html" : safePath);
    if (!filePath.startsWith(root)) {
      response.writeHead(403).end();
      return;
    }
    fs.readFile(filePath, (error, data) => {
      if (error) {
        response.writeHead(404).end("Not found");
        return;
      }
      response.writeHead(200, { "content-type": mime.get(path.extname(filePath)) || "application/octet-stream" });
      response.end(data);
    });
  });
  return new Promise((resolveServer) => server.listen(0, "127.0.0.1", () => resolveServer(server)));
}

function locales() {
  return fs
    .readdirSync(metadataDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.basename(file, ".json"))
    .sort((a, b) => a.localeCompare(b));
}

async function prepareAppPage(page, baseUrl, locale) {
  await page.goto(`${baseUrl}/index.html?shot=marketing`, { waitUntil: "networkidle" });
  await page.evaluate((state) => {
    localStorage.setItem("medilog-state-v1", JSON.stringify(state));
    localStorage.removeItem("medilog-vault-v1");
    document.documentElement.classList.add("native-ios");
  }, createScreenshotState(locale));
  await page.reload({ waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.classList.add("native-ios");
    document.querySelector("#onboarding-sheet")?.close();
  });
}

async function openRoute(page, route) {
  await page.evaluate((targetRoute) => {
    const button =
      targetRoute === "premium"
        ? document.querySelector('[data-view="schutz"]')
        : document.querySelector(`.tabbar [data-view="${targetRoute}"], [data-view="${targetRoute}"]`);
    button?.click();
  }, route);
  await page.waitForTimeout(300);
  await page.evaluate((targetRoute) => {
    if (targetRoute === "premium") {
      document.querySelector(".premium-card")?.scrollIntoView({ block: "start" });
      return;
    }
    window.scrollTo(0, 0);
  }, route);
  await page.waitForTimeout(180);
}

function marketingHtml({ locale, shot, imageBase64 }) {
  const [headline, subtitle] = stringsFor(locale, shot.key);
  const dir = isRtl(locale) ? "rtl" : "ltr";
  return `<!doctype html>
  <html lang="${locale}" dir="${dir}">
    <head>
      <meta charset="UTF-8" />
      <style>
        * { box-sizing: border-box; }
        body {
          width: 1284px;
          height: 2778px;
          margin: 0;
          overflow: hidden;
          background:
            radial-gradient(circle at 78% 10%, rgba(134, 215, 154, 0.22), transparent 30%),
            radial-gradient(circle at 8% 94%, rgba(98, 154, 113, 0.18), transparent 34%),
            linear-gradient(180deg, #07100c 0%, #0c1711 48%, #050807 100%);
          color: #f7fbf5;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
        }
        .canvas {
          width: 100%;
          height: 100%;
          padding: 132px 92px 88px;
          display: grid;
          grid-template-rows: auto 1fr auto;
          gap: 58px;
        }
        .label {
          color: #b8efc0;
          font-size: 35px;
          font-weight: 900;
          letter-spacing: 8px;
          text-transform: uppercase;
        }
        h1 {
          width: 980px;
          margin: 28px 0 22px;
          font-size: 86px;
          line-height: 0.96;
          letter-spacing: -1px;
        }
        p {
          width: 860px;
          margin: 0;
          color: #c9d7ce;
          font-size: 40px;
          font-weight: 700;
          line-height: 1.22;
        }
        html[dir="rtl"] h1,
        html[dir="rtl"] p {
          margin-left: 0;
          margin-right: auto;
        }
        .phone-wrap {
          align-self: end;
          justify-self: center;
          width: 858px;
          height: 1852px;
          padding: 22px;
          border-radius: 92px;
          background: #030504;
          box-shadow:
            0 72px 160px rgba(0, 0, 0, 0.42),
            0 0 0 2px rgba(255, 255, 255, 0.08),
            inset 0 0 0 8px #0b0d0c;
        }
        .phone {
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 70px;
          object-fit: cover;
          object-position: top center;
        }
        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #b8c7be;
          font-size: 28px;
          font-weight: 800;
        }
        .mark {
          color: #f7fbf5;
          font-size: 38px;
          font-weight: 950;
        }
      </style>
    </head>
    <body>
      <main class="canvas">
        <header>
          <div class="label">MediLog</div>
          <h1>${escapeHtml(headline)}</h1>
          <p>${escapeHtml(subtitle)}</p>
        </header>
        <section class="phone-wrap">
          <img class="phone" src="data:image/png;base64,${imageBase64}" alt="" />
        </section>
        <footer class="footer">
          <span class="mark">MediLog</span>
          <span>${escapeHtml(footerFor(locale))}</span>
        </footer>
      </main>
    </body>
  </html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function main() {
  fs.mkdirSync(outputRoot, { recursive: true });
  fs.mkdirSync(rawRoot, { recursive: true });
  const server = await createServer();
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch();
  const appPage = await browser.newPage({
    viewport: { width: 428, height: 926 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const marketingPage = await browser.newPage({
    viewport: { width: 1284, height: 2778 },
    deviceScaleFactor: 1,
  });

  try {
    for (const locale of locales()) {
      const localeOutput = path.join(outputRoot, locale);
      const localeRaw = path.join(rawRoot, locale);
      fs.mkdirSync(localeOutput, { recursive: true });
      fs.mkdirSync(localeRaw, { recursive: true });
      await prepareAppPage(appPage, baseUrl, locale);

      for (const shot of shots) {
        await openRoute(appPage, shot.route);
        const rawBuffer = await appPage.screenshot({ fullPage: false });
        const rawPath = path.join(localeRaw, shot.file);
        fs.writeFileSync(rawPath, rawBuffer);

        await marketingPage.setContent(
          marketingHtml({
            locale,
            shot,
            imageBase64: rawBuffer.toString("base64"),
          }),
          { waitUntil: "load" },
        );
        const outputPath = path.join(localeOutput, shot.file);
        await marketingPage.screenshot({ path: outputPath, fullPage: false });
        console.log(outputPath);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
}

await main();
