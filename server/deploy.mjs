// A fallback way to deploy the server. Normally PIN_SECRET and ADMIN_PASSWORD live in the worker's own Variables and
// Secrets and a plain `npx wrangler deploy` keeps them. If Cloudflare's GitHub builds ever drop them, put them in the
// build's variables instead and use `npm run deploy`: this reads them there and uploads them with each new version
// (see docs/SERVER_SETUP.md). They're written to a short-lived file and removed. Secrets it isn't given are left alone.
import { writeFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";

const NAMES = ["PIN_SECRET", "ADMIN_PASSWORD"];
const FILE = ".deploy-secrets.json";
const found = Object.fromEntries(NAMES.filter(n => process.env[n]).map(n => [n, process.env[n]]));
const args = ["wrangler", "deploy", ...process.argv.slice(2)];
if (Object.keys(found).length){
  writeFileSync(FILE, JSON.stringify(found), { mode: 0o600 });
  args.push("--secrets-file", FILE);
  console.log(`Deploying with ${Object.keys(found).join(" and ")} from the build settings.`);
}
const missing = NAMES.filter(n => !found[n]);
if (missing.length) console.log(`Not in the build settings: ${missing.join(", ")}. Any already on the worker are kept.`);
const r = spawnSync("npx", args, { stdio: "inherit" });
rmSync(FILE, { force: true });
process.exit(r.status ?? 1);
