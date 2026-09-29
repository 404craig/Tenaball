// Shared helpers: a static server for the game, a browser, and small waiting helpers.
import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
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


export async function launch(){
  const opts = { headless: true };
  // use a pre-installed Chromium when there is one (set CHROMIUM_PATH to choose another)
  const exe = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium";
  if (existsSync(exe)) opts.executablePath = exe;
  return chromium.launch(opts);
}

export async function until(fn, { timeout = 15000, every = 100, what = "condition" } = {}){
  const t0 = Date.now(); let last;
  while (Date.now() - t0 < timeout){ try { last = await fn(); if (last) return last; } catch(e){ last = e; } await new Promise(r => setTimeout(r, every)); }
  throw new Error(`Timed out waiting for ${what}${last instanceof Error ? ": " + last.message : ""}`);
}
export const visible = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); return !!e && !e.closest(".hidden") && e.getClientRects().length > 0; }, sel);

// the Tenaball server, running locally with Cloudflare's own runtime and a fresh, empty database
export const TEST_SECRETS = { PIN_SECRET: "test-pin-secret-0123456789", ADMIN_PASSWORD: "test-admin-password" };
export async function startServer({ port = 8787, origins = [], vars = {} } = {}){
  const dir = mkdtempSync(join(tmpdir(), "tenaball-server-"));
  const all = { ...TEST_SECRETS, ALLOWED_ORIGINS: origins.join(","), ...vars };
  const args = ["wrangler", "dev", "--ip", "127.0.0.1", "--port", String(port), "--persist-to", dir, "--log-level", "warn",
    ...Object.entries(all).flatMap(([k, v]) => ["--var", `${k}:${v}`])];
  const proc = spawn("npx", args, { cwd: join(root, "server"), env: { ...process.env, WRANGLER_SEND_METRICS: "false" }, stdio: ["ignore", "pipe", "pipe"], detached: true });
  let log = ""; proc.stdout.on("data", d => log += d); proc.stderr.on("data", d => log += d);
  const url = `http://127.0.0.1:${port}`;
  const stop = async () => { try { process.kill(-proc.pid, "SIGTERM"); } catch(e){} await new Promise(r => setTimeout(r, 600)); rmSync(dir, { recursive: true, force: true }); };
  await until(async () => (await fetch(url + "/")).ok, { timeout: 60000, every: 300, what: "the local server to start" }).catch(async e => { await stop(); throw new Error(e.message + "\n" + log); });
  return { url, log: () => log, stop };
}
