// Shared helpers: a static server for the game, browser "phones" wired to the Firebase emulators, and emulator resets.
import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
export const PROJECT = "demo-tenaball";
const SDK_DIR = join(here, "node_modules", "firebase");
const TYPES = { ".html":"text/html", ".js":"text/javascript", ".mjs":"text/javascript", ".jpg":"image/jpeg", ".png":"image/png", ".json":"application/json" };

export function serve(port = 5173){
  const server = http.createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = join(root, path === "/" ? "index.html" : path);
    if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()){ res.writeHead(404); return res.end("not found"); }
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(readFileSync(file));
  });
  return new Promise(r => server.listen(port, "127.0.0.1", () => r({ url: `http://127.0.0.1:${port}/`, close: () => new Promise(c => server.close(c)) })));
}

export const FIREBASE = { config: { apiKey: "demo-key", authDomain: `${PROJECT}.firebaseapp.com`, projectId: PROJECT, appId: "1:1:web:tenaball" }, emulator: true };

export async function launch(){
  const opts = { headless: true };
  // use a pre-installed Chromium when there is one (set CHROMIUM_PATH to choose another)
  const exe = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium";
  if (existsSync(exe)) opts.executablePath = exe;
  return chromium.launch(opts);
}

// a phone: its own browser profile (own storage and sign-in), pointed at the emulators
export async function phone(browser, name, { firebase = true, clock = true } = {}){
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", permissions: ["clipboard-read", "clipboard-write"] });
  // the page loads the Firebase SDK from gstatic; serve the same version from node_modules instead
  await ctx.route("https://www.gstatic.com/firebasejs/**", route => {
    const f = join(SDK_DIR, new URL(route.request().url()).pathname.split("/").pop());
    existsSync(f) ? route.fulfill({ body: readFileSync(f), contentType: "text/javascript", headers: { "access-control-allow-origin": "*" } }) : route.abort();
  });
  await ctx.route("https://fonts.googleapis.com/**", route => route.fulfill({ body: "", contentType: "text/css" }));
  await ctx.route("https://fonts.gstatic.com/**", route => route.abort());
  if (firebase) await ctx.addInitScript(cfg => { window.TENABALL_FIREBASE = cfg; }, FIREBASE);
  const page = await ctx.newPage();
  page.errors = [];
  page.on("pageerror", e => page.errors.push(`${name}: ${e.message}`));
  page.on("console", m => { if (m.type() === "error" && !/Failed to load resource|ERR_|favicon/.test(m.text())) page.errors.push(`${name} console: ${m.text()}`); });
  page.on("dialog", d => d.accept());
  page.label = name; page.ctx = ctx;
  return page;
}

export async function resetEmulators(){
  await fetch(`http://127.0.0.1:8080/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });
  await fetch(`http://127.0.0.1:9099/emulator/v1/projects/${PROJECT}/accounts`, { method: "DELETE" });
}

// read a document straight from the emulator, bypassing security rules
export async function adminGet(path){
  const r = await fetch(`http://127.0.0.1:8080/v1/projects/${PROJECT}/databases/(default)/documents/${path}`, { headers: { Authorization: "Bearer owner" } });
  if (r.status === 404) return null;
  return fromFs((await r.json()).fields || {});
}
function fromFs(fields){
  const v = x => "integerValue" in x ? Number(x.integerValue) : "doubleValue" in x ? x.doubleValue : "stringValue" in x ? x.stringValue : "booleanValue" in x ? x.booleanValue
    : "mapValue" in x ? fromFs(x.mapValue.fields || {}) : "arrayValue" in x ? (x.arrayValue.values || []).map(v) : "nullValue" in x ? null : "timestampValue" in x ? x.timestampValue : x;
  return Object.fromEntries(Object.entries(fields).map(([k, x]) => [k, v(x)]));
}

export async function until(fn, { timeout = 15000, every = 100, what = "condition" } = {}){
  const t0 = Date.now(); let last;
  while (Date.now() - t0 < timeout){ try { last = await fn(); if (last) return last; } catch(e){ last = e; } await new Promise(r => setTimeout(r, every)); }
  throw new Error(`Timed out waiting for ${what}${last instanceof Error ? ": " + last.message : ""}`);
}
export const visible = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); return !!e && !e.closest(".hidden") && e.getClientRects().length > 0; }, sel);
