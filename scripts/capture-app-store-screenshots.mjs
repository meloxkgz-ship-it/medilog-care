import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const chromePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const outputDir = resolve(root, "ios/MediLogNative/AppStoreAssets/iphone-65");
const appUrl = pathToFileURL(resolve(root, "index.html")).href;

const shots = [
  ["01-home", "home"],
  ["02-plaene", "plaene"],
  ["03-medis", "bibliothek"],
  ["04-verlauf", "verlauf"],
  ["05-premium", "premium"],
];

function wait(ms) {
  return new Promise((resolveWait) => setTimeout(resolveWait, ms));
}

function launchChrome() {
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--disable-background-networking",
    "--disable-component-update",
    "--remote-debugging-port=0",
    `--user-data-dir=/tmp/medilog-appstore-${Date.now()}`,
    "about:blank",
  ];

  return spawn(chromePath, args, { stdio: ["ignore", "ignore", "pipe"] });
}

async function connectToPage(child) {
  const endpoint = await new Promise((resolveEndpoint, rejectEndpoint) => {
    let stderr = "";
    const timer = setTimeout(() => rejectEndpoint(new Error("Chrome DevTools endpoint timed out")), 10000);
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (!match) return;
      clearTimeout(timer);
      resolveEndpoint(match[1]);
    });
  });

  const base = `http://${endpoint.match(/ws:\/\/([^/]+)/)[1]}`;
  await wait(400);
  const pages = await (await fetch(`${base}/json`)).json();
  const page = pages.find((item) => item.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let sequence = 0;
  const pending = new Map();

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (!pending.has(message.id)) return;
    pending.get(message.id)(message);
    pending.delete(message.id);
  };

  await new Promise((resolveOpen) => {
    ws.onopen = resolveOpen;
  });

  const send = (method, params = {}) =>
    new Promise((resolveSend) => {
      const id = ++sequence;
      pending.set(id, resolveSend);
      ws.send(JSON.stringify({ id, method, params }));
    });

  return { send };
}

async function capture() {
  mkdirSync(outputDir, { recursive: true });
  const child = launchChrome();

  try {
    const page = await connectToPage(child);
    await page.send("Page.enable");
    await page.send("Runtime.enable");
    await page.send("Emulation.setDeviceMetricsOverride", {
      width: 428,
      height: 926,
      deviceScaleFactor: 3,
      mobile: true,
    });
    await page.send("Emulation.setUserAgentOverride", {
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    });

    for (const [name, route] of shots) {
      await page.send("Page.navigate", { url: `${appUrl}?shot=${name}#${route}` });
      await wait(1500);
      await page.send("Runtime.evaluate", {
        expression: `
          document.querySelector('#onboarding-sheet')?.close();
          const screen = document.querySelector('.screen');
          const premium = document.querySelector('.premium-card');
          if (screen && '${route}' === 'premium' && premium) {
            const target = premium.getBoundingClientRect().top - screen.getBoundingClientRect().top + screen.scrollTop - 16;
            screen.scrollTo(0, Math.max(0, target));
          } else {
            screen?.scrollTo(0, 0);
          }
        `,
      });
      await wait(250);
      const screenshot = await page.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
        fromSurface: true,
      });
      const outputPath = resolve(outputDir, `${name}.png`);
      writeFileSync(outputPath, Buffer.from(screenshot.result.data, "base64"));
      console.log(outputPath);
    }
  } finally {
    child.kill("SIGTERM");
  }
}

capture().catch((error) => {
  console.error(error);
  process.exit(1);
});
