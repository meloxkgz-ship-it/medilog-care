import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const infoPlist = fs.readFileSync(path.join(root, "ios", "MediLogNative", "MediLogNative", "Info.plist"), "utf8");
const versionMatch = infoPlist.match(/<key>CFBundleShortVersionString<\/key>\s*<string>([^<]+)<\/string>/);
const currentMarketingVersion = versionMatch?.[1]?.trim();
if (!currentMarketingVersion) throw new Error("Could not resolve MARKETING_VERSION");
const expectedAppLocales = [
  "de-DE",
  "en-US",
  "en-GB",
  "en-AU",
  "en-CA",
  "es-ES",
  "es-MX",
  "fr-FR",
  "fr-CA",
  "it-IT",
  "pt-BR",
  "pt-PT",
  "nl-NL",
  "pl-PL",
  "tr-TR",
  "ca",
  "hr",
  "hu",
  "ro",
  "sk",
  "sl",
  "bg",
  "sr",
  "da",
  "sv",
  "no",
  "fi",
  "cs",
  "el",
  "ru",
  "uk",
  "hi",
  "id",
  "ms",
  "th",
  "vi",
  "he",
  "ar-SA",
  "ja-JP",
  "ko-KR",
  "zh-Hans",
  "zh-Hant",
];

const expectedMetadataLocales = expectedAppLocales.filter((locale) => !["ca", "hr", "hu", "ro", "sk", "sl", "bg", "sr", "ms", "th"].includes(locale));

const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

const appLocales = [...appJs.matchAll(/code:\s*"([^"]+)"/g)].map((match) => match[1]);
const missingAppLocales = expectedAppLocales.filter((locale) => !appLocales.includes(locale));
if (missingAppLocales.length) throw new Error(`Missing app locales: ${missingAppLocales.join(", ")}`);

if (!html.includes('id="setting-language"')) throw new Error("Language selector is missing in settings");
if (!css.includes('html[dir="rtl"]')) throw new Error("RTL CSS support is missing");
if (!appJs.includes("document.documentElement.dir")) throw new Error("Runtime direction handling is missing");

const metadataDir = path.join(root, "ios", "MediLogNative", "AppStoreMetadata");
for (const locale of expectedMetadataLocales) {
  const file = path.join(metadataDir, `${locale}.json`);
  if (!fs.existsSync(file)) throw new Error(`Missing metadata file for ${locale}`);

  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const field of ["name", "subtitle", "description", "keywords", "promotionalText", "whatsNew", "supportUrl", "privacyPolicyUrl", "marketingUrl", "termsOfUseUrl"]) {
    if (!data[field] || typeof data[field] !== "string") throw new Error(`${locale}: missing ${field}`);
  }
  if ([...data.name].length > 30) throw new Error(`${locale}: name too long`);
  if ([...data.subtitle].length > 30) throw new Error(`${locale}: subtitle too long`);
  if ([...data.keywords].length > 100) throw new Error(`${locale}: keywords too long`);
  if (!data.whatsNew.includes(currentMarketingVersion)) {
    throw new Error(`${locale}: release notes do not mention ${currentMarketingVersion}`);
  }
  for (const urlField of ["supportUrl", "privacyPolicyUrl", "marketingUrl", "termsOfUseUrl"]) {
    if (!data[urlField].startsWith("https://")) throw new Error(`${locale}: ${urlField} is not https`);
  }
}

console.log(`Verified ${expectedAppLocales.length} app locales and ${expectedMetadataLocales.length} App Store localizations.`);
