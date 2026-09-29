// Runs every suite in order.
import { spawnSync } from "node:child_process";
const suites = ["server.test.mjs", "account.test.mjs", "online.test.mjs", "trophy.test.mjs"];
let failed = 0;
for (const s of suites){
  console.log(`\n▶ ${s}`);
  const r = spawnSync(process.execPath, [s], { stdio: "inherit", cwd: new URL(".", import.meta.url).pathname });
  if (r.status !== 0) failed++;
}
console.log(failed ? `\n${failed} suite(s) failed` : "\nAll suites passed");
process.exit(failed ? 1 : 0);
