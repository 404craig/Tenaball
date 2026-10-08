// Copies the code the game shares with the server into index.html: server/src/stats.js (between the "stats.js" markers),
// so the game and the server fold games into stats the same way, and server/src/leagues.js (between the "leagues.js"
// markers), so both work out a league's table the same way.
// Run from the repo root after changing either file: node scripts/embed-stats.mjs
import { readFileSync, writeFileSync } from "node:fs";
let html = readFileSync("index.html", "utf8");
for (const name of ["stats.js", "leagues.js"]){
  const src = readFileSync("server/src/" + name, "utf8").replace(/^export /gm, "").trim();
  const A = `/* ${name}: start */`, B = `/* ${name}: end */`, a = html.indexOf(A), b = html.indexOf(B);
  if (a < 0 || b < a) throw new Error(`index.html has no ${name} markers`);
  html = html.slice(0, a + A.length) + "\n" + src + "\n" + html.slice(b);
  console.log(name + " embedded in index.html");
}
writeFileSync("index.html", html);
