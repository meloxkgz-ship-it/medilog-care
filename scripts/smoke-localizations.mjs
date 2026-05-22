import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const require = createRequire(import.meta.url);
const { chromium } = require(path.join(root, ".asc/test-runner/node_modules/playwright"));

const locales = [
  ["de-DE", "DE", "ltr"],
  ["en-US", "EN", "ltr"],
  ["es-ES", "ES", "ltr"],
  ["fr-FR", "FR", "ltr"],
  ["it-IT", "IT", "ltr"],
  ["pt-BR", "PT", "ltr"],
  ["nl-NL", "NL", "ltr"],
  ["pl-PL", "PL", "ltr"],
  ["tr-TR", "TR", "ltr"],
  ["ar-SA", "AR", "rtl"],
  ["ja-JP", "JA", "ltr"],
  ["ko-KR", "KO", "ltr"],
  ["zh-Hans", "ZH", "ltr"],
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

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(root, safePath === "/" ? "index.html" : safePath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404).end("Not found");
      return;
    }
    res.writeHead(200, { "content-type": mime.get(path.extname(filePath)) || "application/octet-stream" });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const url = `http://127.0.0.1:${port}/index.html`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true });
const issues = [];
page.on("pageerror", (error) => issues.push(`pageerror: ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") issues.push(`console: ${message.text()}`);
});

try {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator("#skip-onboarding").click();
  await page.locator('.badge-button[data-view="schutz"]').click();
  await page.locator("#privacy-consent").click();
  await page.locator("#premium-button").click();
  await page.locator('.tab[data-view="home"]').click();
  await page.locator("#add-water").click();
  const water = await page.locator("#water-total").textContent();
  if (!water || water.includes("0,0") || water.includes("0.0")) throw new Error(`Water tracker did not update: ${water}`);

  await page.locator("#quick-add").click();
  await page.locator('#quick-sheet button[value="note"]').click();
  await page.locator('#note-form textarea[name="note"]').fill("Smoke test note");
  await page.locator('#note-form button[type="submit"]').click();

  await page.locator('.tab[data-view="bibliothek"]').click();
  await page.locator('#bibliothek-view.active [data-action="open-medicine-form"]').first().click();
  await page.locator('#medicine-form input[name="name"]').fill("Smoke Med");
  await page.locator('#medicine-form input[name="dose"]').fill("1 mg");
  await page.locator('#medicine-form input[name="time"]').fill("12:30");
  await page.locator('#medicine-form input[name="stock"]').fill("5");
  await page.locator('#medicine-form button[type="submit"]').click();
  await page.locator('[data-medicine-id]').first().click();
  await page.locator('#medicine-detail-sheet button[value="done"]').click();

  await page.locator('.tab[data-view="plaene"]').click();
  await page.locator('[data-action="open-profile-form"]').first().click();
  await page.locator('#profile-form input[name="name"]').fill("Care Smoke");
  await page.locator('#profile-form input[name="role"]').fill("Care");
  await page.locator('#profile-form button[type="submit"]').click();
  await page.locator('[data-action="open-scan-sheet"]').first().click();
  await page.locator('#scan-form textarea[name="plan"]').fill("Smoke private medication plan note");
  await page.locator('#scan-form button[type="submit"]').click();

  await page.locator('.tab[data-view="verlauf"]').click();
  await page.locator("#export-button").click();
  if (!(await page.locator("#report-sheet[open]").count())) throw new Error("Report sheet did not open");
  await page.locator('[data-close="report-sheet"]').click();

  await page.locator('.badge-button[data-view="schutz"]').click();
  for (const [locale, short, dir] of locales) {
    await page.locator("#setting-language").selectOption(locale);
    await page.waitForTimeout(60);
    const state = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      badge: document.querySelector(".badge-button span")?.textContent?.trim(),
      title: document.querySelector("#view-title")?.textContent?.trim(),
      languageValue: document.querySelector("#setting-language")?.value,
      visibleText: document.body.innerText,
    }));
    if (state.lang !== locale) throw new Error(`${locale}: html lang is ${state.lang}`);
    if (state.dir !== dir) throw new Error(`${locale}: direction is ${state.dir}`);
    if (state.badge !== short) throw new Error(`${locale}: badge is ${state.badge}`);
    if (state.languageValue !== locale) throw new Error(`${locale}: select value is ${state.languageValue}`);
    if (!state.title) throw new Error(`${locale}: empty title`);
    if (!state.visibleText.includes("MediLog") && !state.visibleText.includes("Premium")) {
      throw new Error(`${locale}: unexpected empty translated UI`);
    }
    if (locale === "ar-SA" && state.dir !== "rtl") throw new Error("Arabic did not switch to RTL");
  }

  fs.mkdirSync(path.join(root, ".asc/audit"), { recursive: true });
  await page.screenshot({ path: path.join(root, ".asc/audit/localization-smoke-final.png"), fullPage: true });
} finally {
  await browser.close();
  server.close();
}

if (issues.length) throw new Error(issues.join("\n"));
console.log(`Smoke-tested ${locales.length} languages and core flows at ${url}`);
