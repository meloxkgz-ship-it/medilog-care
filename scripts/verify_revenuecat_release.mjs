#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const project = path.join(root, "ios/MediLogNative/MediLogNative.xcodeproj");
const infoPlist = path.join(root, "ios/MediLogNative/MediLogNative/Info.plist");
const localConfig = path.join(root, "ios/MediLogNative/Config/RevenueCat.local.xcconfig");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readPlistValue(key) {
  return execFileSync("/usr/libexec/PlistBuddy", ["-c", `Print :${key}`, infoPlist], {
    encoding: "utf8",
  }).trim();
}

const nativeBridge = fs.readFileSync(
  path.join(root, "ios/MediLogNative/MediLogNative/NativeBridge.swift"),
  "utf8",
);
const pbxproj = fs.readFileSync(path.join(project, "project.pbxproj"), "utf8");

if (!nativeBridge.includes("import RevenueCat")) {
  fail("RevenueCat SDK is not imported in NativeBridge.swift.");
}

if (!nativeBridge.includes("Purchases.configure(withAPIKey: apiKey)")) {
  fail("RevenueCat is not configured with the build-time API key.");
}

if (!nativeBridge.includes('revenueCatEntitlementIds = ["premium", "plus"]')) {
  fail('Expected RevenueCat entitlement fallback list ["premium", "plus"].');
}

if (!pbxproj.includes("purchases-ios-spm")) {
  fail("RevenueCat Swift Package dependency is missing from the Xcode project.");
}

const plistKey = readPlistValue("RevenueCatAPIKey");
if (plistKey !== "$(REVENUECAT_API_KEY)") {
  fail(`Info.plist RevenueCatAPIKey should be $(REVENUECAT_API_KEY), got ${plistKey}.`);
}

if (process.argv.includes("--require-key")) {
  if (!fs.existsSync(localConfig)) {
    fail(`Missing ${localConfig}. Run scripts/install_revenuecat_key.sh appl_... first.`);
  }

  const local = fs.readFileSync(localConfig, "utf8");
  const match = local.match(/^\s*REVENUECAT_API_KEY\s*=\s*(\S+)/m);
  if (!match || !match[1].startsWith("appl_") || match[1].includes("REPLACE")) {
    fail("RevenueCat.local.xcconfig must contain a real iOS Public SDK Key starting with appl_.");
  }
}

console.log("RevenueCat release integration verified.");
