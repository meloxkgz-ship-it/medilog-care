import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { chromium } = require(path.join(root, ".asc/test-runner/node_modules/playwright"));

const outputDir = resolve(root, "ios/MediLogNative/AppStoreAssets/iphone-65");
const viewport = { width: 428, height: 926 };
const deviceScaleFactor = 3;

const shots = [
  ["01-home", "home"],
  ["02-plaene", "plaene"],
  ["03-medis", "bibliothek"],
  ["04-verlauf", "verlauf"],
  ["05-premium", "premium"],
];

const mime = new Map([
  [".html", "text/html;charset=utf-8"],
  [".js", "text/javascript;charset=utf-8"],
  [".css", "text/css;charset=utf-8"],
  [".json", "application/json;charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webmanifest", "application/manifest+json"],
]);

function createScreenshotState(locale = "de-DE") {
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
      { type: "done", title: "Vitamin D dokumentiert", detail: "09:04", profileId: "profile-self", date: now },
      { type: "done", title: "Ramipril dokumentiert", detail: "08:06", profileId: "profile-self", date: now },
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

  return new Promise((resolveServer) => {
    server.listen(0, "127.0.0.1", () => resolveServer(server));
  });
}

async function preparePage(page, baseUrl, locale) {
  await page.goto(`${baseUrl}/index.html?shot=appstore`, { waitUntil: "networkidle" });
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
  await page.waitForTimeout(350);
}

async function openRoute(page, route) {
  await page.evaluate((targetRoute) => {
    const button =
      targetRoute === "premium"
        ? document.querySelector('[data-view="schutz"]')
        : document.querySelector(`.tabbar [data-view="${targetRoute}"], [data-view="${targetRoute}"]`);
    button?.click();
  }, route);
  await page.waitForTimeout(350);

  await page.evaluate((targetRoute) => {
    if (targetRoute === "premium") {
      document.querySelector(".premium-card")?.scrollIntoView({ block: "start" });
      return;
    }
    window.scrollTo(0, 0);
  }, route);
  await page.waitForTimeout(200);
}

async function captureScreenshots(locale = "de-DE", targetDir = outputDir) {
  fs.mkdirSync(targetDir, { recursive: true });
  const server = await createServer();
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
    locale,
  });

  try {
    await preparePage(page, baseUrl, locale);
    for (const [name, route] of shots) {
      await openRoute(page, route);
      const outputPath = path.join(targetDir, `${name}.png`);
      await page.screenshot({ path: outputPath, fullPage: false });
      console.log(outputPath);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

await captureScreenshots(process.env.MEDILOG_SCREENSHOT_LOCALE || "de-DE", outputDir);
