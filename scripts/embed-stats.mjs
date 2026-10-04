// Copies server/src/stats.js into index.html (between the "stats.js" markers) so the game and the server fold games into stats the same way.
// Run from the repo root after changing server/src/stats.js: node scripts/embed-stats.mjs
import { readFileSync, writeFileSync } from "node:fs";
const src = readFileSync("server/src/stats.js", "utf8").replace(/^export /gm, "").trim();
const html = readFileSync("index.html", "utf8"), A = "/* stats.js: start */", B = "/* stats.js: end */";
const a = html.indexOf(A), b = html.indexOf(B);
if (a < 0 || b < a) throw new Error("index.html has no stats.js markers");
writeFileSync("index.html", html.slice(0, a + A.length) + "\n" + src + "\n" + html.slice(b));
console.log("stats.js embedded in index.html");
