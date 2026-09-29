// Deploys the server with its two secrets. Cloudflare's GitHub builds can drop secrets added in the dashboard,
// so the build brings them itself: PIN_SECRET and ADMIN_PASSWORD are read from the build's own variables and
// uploaded with each new version (see docs/SERVER_SETUP.md). They're written to a short-lived file and removed.
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
if (missing.length) console.log(`Not in the build settings: ${missing.join(", ")}. Add them under Settings, Build, Variables and secrets.`);
const r = spawnSync("npx", args, { stdio: "inherit" });
rmSync(FILE, { force: true });
process.exit(r.status ?? 1);
