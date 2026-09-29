// The winner's trophy at full time, on a phone-sized screen: the approved timeline, the real winner pill,
// the hand-over into the final table, tap to skip, reduced motion, and nothing left running afterwards.
import { serve, launch, until, visible } from "./lib.mjs";
import { test, assert, eq, report } from "./harness.mjs";
import { mkdirSync } from "node:fs";

const srv = await serve(5178);
const browser = await launch();
const OUT = new URL("./output/", import.meta.url).pathname; mkdirSync(OUT, { recursive: true });

async function phone(name, reduced = false){
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: reduced ? "reduce" : "no-preference" });
  await ctx.route("https://fonts.googleapis.com/**", r => r.fulfill({ body: "", contentType: "text/css" }));
  await ctx.addInitScript(() => { window.TENABALL_SERVER_URL = ""; }); // offline: the trophy doesn't need the server
  const p = await ctx.newPage(); p.errors = [];
  p.on("pageerror", e => p.errors.push(e.message));
  p.on("console", m => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) p.errors.push(m.text()); });
  await p.goto(srv.url); await p.waitForFunction(() => document.readyState === "complete");
  p.ctx = ctx; p.label = name; return p;
}
// start a real game from the home screen, then finish its last round with these scores and press "See final scores"
async function toFullTime(p, players){
  await p.click(`#countSeg button[data-v="${players.length}"]`);
  const boxes = await p.$$("#nameFields input");
  for (let i = 0; i < players.length; i++) await boxes[i].fill(players[i][0]);
  await p.click('#roundSeg button[data-v="3"]'); await p.click('#clockSeg button[data-v="0"]');
  await p.click("#startBtn"); await until(() => visible(p, "#intro"), { what: "first round" });
  await p.click("#introBtn"); await until(() => p.evaluate(() => !document.getElementById("guessArea").classList.contains("hidden") && !document.getElementById("guessInput").disabled), { what: "first turn" });
  await p.evaluate(sc => { G.round = cfg.rounds; G.players.forEach((x, i) => x.score = sc[i]); endRound(); }, players.map(x => x[1]));
  eq(await p.textContent("#nextBtn"), "See final scores");
  await p.evaluate(() => { window.__conf = { back: 0, front: 0 };
    [["wtConfBack", "back"], ["wtConfFront", "front"]].forEach(([id, k]) => new MutationObserver(ms => ms.forEach(m => window.__conf[k] += m.addedNodes.length)).observe(document.getElementById(id), { childList: true })); });
  await p.click("#nextBtn");
  await until(() => visible(p, "#winTrophy"), { what: "the trophy overlay" });
}
// read an animation's value at an exact point on its own timeline
const at = (p, sel, ms, prop) => p.evaluate(([sel, ms, prop]) => {
  const el = document.querySelector(sel), a = el.getAnimations().find(x => !(x instanceof CSSAnimation));
  const was = a.currentTime; a.pause(); a.currentTime = ms - (a.effect.getTiming().delay || 0) + (a.effect.getTiming().delay || 0);
  const v = getComputedStyle(el)[prop]; a.currentTime = was; a.play(); return v;
}, [sel, ms, prop]);
const scaleOf = m => { const x = /matrix\(([^)]+)\)/.exec(m); if (!x) return 1; const [a, b] = x[1].split(",").map(Number); return Math.hypot(a, b); };
async function nothingLeft(p){
  const r = await p.evaluate(() => {
    const ov = document.getElementById("winTrophy");
    return { hidden: ov.classList.contains("hidden"), idle: ov.classList.contains("idle"),
      running: ov.getAnimations({ subtree: true }).filter(a => a.playState === "running").length,
      ribbonsPaused: [...ov.querySelectorAll(".rib svg")].every(s => s.animationsPaused()),
      leftovers: ["wtConfBack", "wtConfFront", "wtFx", "wtInward"].map(id => document.getElementById(id).children.length).reduce((a, b) => a + b, 0) };
  });
  eq(r, { hidden: true, idle: false, running: 0, ribbonsPaused: true, leftovers: 0 }, "overlay fully stopped");
  // and the idle charge along the bolts no longer fires
  const sweeps = await p.evaluate(async () => { let n = 0; const orig = window.boltSweep; window.boltSweep = (...a) => { n++; return orig(...a); }; await new Promise(r => setTimeout(r, 3800)); window.boltSweep = orig; return n; });
  eq(sweeps, 0, "no idle bolt sweeps after closing");
}
async function handOver(p, winnerText, top){
  const target = await p.evaluate(() => { const r = document.querySelector("#podium .pod").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; });
  await p.click("#winTrophy");
  // mid-flight: trophy lifting and fading, pill heading for the first row
  const mid = await until(() => p.evaluate(() => { const z = document.getElementById("wtTzone"), o = +getComputedStyle(z).opacity, m = getComputedStyle(z).transform;
    return o < .9 && o > 0 ? { o, m } : null; }), { what: "the trophy to lift away", every: 20, timeout: 1500 });
  const [a, b, c, d, e, f] = /matrix\(([^)]+)\)/.exec(mid.m)[1].split(",").map(Number);
  assert(f < 0 && Math.hypot(a, b) < 1, `trophy rises and shrinks as it fades (translateY ${f.toFixed(0)}, scale ${Math.hypot(a, b).toFixed(2)})`);
  // just before the overlay closes the pill sits exactly on the first-place row
  const land = await until(() => p.evaluate(() => {
    const pill = document.getElementById("pill"), glide = pill.getAnimations().find(x => !(x instanceof CSSAnimation) && x.playState === "running" && x.effect.getTiming().duration === 800);
    if (!glide) return null;
    glide.pause(); glide.currentTime = 799.9; // its last frame
    const r = pill.getBoundingClientRect(); glide.play();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
  }), { what: "the pill to glide", every: 10, timeout: 3000 });
  { assert(Math.abs(land.x - target.x) < 4 && Math.abs(land.y - target.y) < 4, `pill lands on the row: ${JSON.stringify(land)} vs ${JSON.stringify(target)}`); }
  await until(() => p.evaluate(() => document.getElementById("winTrophy").classList.contains("hidden")), { what: "the overlay to close" });
  const row = await p.evaluate(() => { const d = document.querySelector("#podium .pod"); return { show: d.classList.contains("show"), place: d.querySelector(".place").textContent, name: d.querySelector(".nm").textContent, sc: d.querySelector(".sc") ? d.querySelector(".sc").textContent : null }; });
  eq([row.show, row.place], [true, "1st"], "the first row is in place");
  assert(winnerText.startsWith(row.name) || winnerText.includes(row.name), `first row ${row.name} belongs to the winner ${winnerText}`);
}

for (const [label, players, pillName] of [
  ["solo", [["Craig", 27]], "Craig"],
  ["two players", [["Craig", 14], ["Aiden", 9]], "Craig"],
  ["a drawn game", [["Aiden", 12], ["Craig", 12]], "Aiden & Craig"],
]){
  await test(`trophy: ${label}: the approved sequence plays with the real winner, then hands over into the final table`, async () => {
    const p = await phone(label); try {
    const top = Math.max(...players.map(x => x[1]));
    await toFullTime(p, players);
    // anticipation, then the explosion and the trophy fired out: 60% at 0.3s, 108% at the overshoot, settled at 100% by 0.85s
    await until(() => p.evaluate(() => document.getElementById("wtTrophy").getAnimations().length > 0), { what: "trophy animation" });
    const t = await p.evaluate(() => { const a = document.getElementById("wtTrophy").getAnimations().find(x => !(x instanceof CSSAnimation)).effect; return { delay: a.getTiming().delay, dur: a.getTiming().duration }; });
    eq([t.delay, t.dur], [300, 550], "trophy timing (starts at 0.3s, settles at 0.85s)");
    const s0 = scaleOf(await at(p, "#wtTrophy", 300, "transform")), sPeak = scaleOf(await at(p, "#wtTrophy", 300 + 0.6 * 550, "transform")), sEnd = scaleOf(await at(p, "#wtTrophy", 850, "transform"));
    assert(Math.abs(s0 - .6) < .01 && Math.abs(sPeak - 1.08) < .01 && Math.abs(sEnd - 1) < .001, `trophy scale 60% → 108% → 100%: ${[s0, sPeak, sEnd].map(x => x.toFixed(3))}`);
    await p.waitForTimeout(420);
    await p.screenshot({ path: `${OUT}trophy-${label.replace(/ /g, "-")}-explosion.png` });
    const conf = await p.evaluate(() => window.__conf);
    eq(conf, { back: 34, front: 56 }, "three confetti layers (34 back, 46 mid and 10 front)");
    const rib = await p.evaluate(() => [...document.querySelectorAll("#winTrophy .rib .react")].map(r => r.getAnimations().find(x => !(x instanceof CSSAnimation))).map(a => a && a.effect.getTiming().duration));
    eq(rib, [1600, 1650], "ribbon whip settles about 1.9s in");
    // the pill: real name, 1st, points counting up
    await until(() => p.evaluate(() => +getComputedStyle(document.getElementById("pill")).opacity > .5), { what: "the winner pill", timeout: 5000 });
    eq(await p.textContent("#pill .place"), "1st"); eq(await p.textContent("#pillName"), pillName);
    const counts = [];
    for (let i = 0; i < 12; i++){ counts.push(+(await p.textContent("#pillSc"))); await p.waitForTimeout(90); }
    if (top > 3) assert(counts.some(c => c > 0 && c < top), `points should count up: ${counts.join(",")}`);
    assert(counts.every((c, i) => i === 0 || c >= counts[i - 1]), "points only go up");
    await until(async () => +(await p.textContent("#pillSc")) === top, { what: "the full score" });
    assert(await p.evaluate(() => document.getElementById("winTrophy").classList.contains("idle")), "the idle loop is running");
    assert(await visible(p, "#wtTap"), "tap hint shown");
    await p.screenshot({ path: `${OUT}trophy-${label.replace(/ /g, "-")}-idle.png` });
    await handOver(p, pillName, top);
    await p.waitForTimeout(250 * players.length + 300);
    eq(await p.$$eval("#podium .pod.show", e => e.length), players.length, "every row of the final table is showing");
    await p.screenshot({ path: `${OUT}trophy-${label.replace(/ /g, "-")}-table.png` });
    await nothingLeft(p);
    assert(!p.errors.length, p.errors.join("\n"));
    } finally { await p.ctx.close(); }
  });
}

await test("trophy: tapping straight away skips the build-up and still hands over cleanly", async () => {
  const p = await phone("skip");
  await toFullTime(p, [["Craig", 14], ["Aiden", 9]]);
  await p.waitForTimeout(150); await p.click("#winTrophy");
  await until(() => p.evaluate(() => document.getElementById("winTrophy").classList.contains("hidden")), { what: "the overlay to close", timeout: 6000 });
  eq(await p.evaluate(() => document.querySelector("#podium .pod").classList.contains("show")), true, "first row in place");
  await p.waitForTimeout(800); await nothingLeft(p);
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});

await test("trophy: with reduced motion the trophy appears without the build-up, and tap still hands over", async () => {
  const p = await phone("reduced", true);
  await toFullTime(p, [["Aiden", 12], ["Craig", 12]]);
  await p.waitForTimeout(250);
  const r = await p.evaluate(() => ({ trophy: getComputedStyle(document.getElementById("wtTrophy")).opacity, conf: document.getElementById("wtConfFront").children.length, name: document.getElementById("pillName").textContent }));
  eq(r, { trophy: "1", conf: 0, name: "Aiden & Craig" }, "reduced motion: trophy shown, no confetti burst");
  await p.click("#winTrophy");
  await until(() => p.evaluate(() => document.getElementById("winTrophy").classList.contains("hidden")), { what: "the overlay to close", timeout: 3000 });
  await p.waitForTimeout(800); await nothingLeft(p);
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});

await test("trophy: playing again runs the whole sequence a second time from a clean start", async () => {
  const p = await phone("again");
  await toFullTime(p, [["Craig", 14], ["Aiden", 9]]);
  await p.click("#winTrophy"); await p.waitForTimeout(200); await p.click("#winTrophy").catch(() => {});
  await until(() => p.evaluate(() => document.getElementById("winTrophy").classList.contains("hidden")), { what: "first close", timeout: 6000 });
  await p.waitForTimeout(1200);
  await p.click("#againBtn"); await until(() => visible(p, "#intro"), { what: "a new game" });
  await p.click("#introBtn"); await until(() => p.evaluate(() => !document.getElementById("guessArea").classList.contains("hidden") && !document.getElementById("guessInput").disabled));
  await p.evaluate(() => { window.__conf = { back: 0, front: 0 }; G.round = cfg.rounds; G.players[0].score = 3; G.players[1].score = 8; endRound(); }); await p.click("#nextBtn");
  await until(() => visible(p, "#winTrophy"));
  await until(async () => (await p.textContent("#pillName")) === "Aiden", { what: "the new winner" });
  await until(() => p.evaluate(() => window.__conf.front === 56 && window.__conf.back === 34), { what: "a fresh confetti burst", timeout: 3000 });
  eq(await p.evaluate(() => [...document.querySelectorAll("#winTrophy .rib svg")].every(s => !s.animationsPaused())), true, "ribbons moving again");
  await until(async () => (await p.textContent("#pillSc")) === "8", { what: "the count-up" });
  await p.click("#winTrophy");
  await until(() => p.evaluate(() => document.getElementById("winTrophy").classList.contains("hidden")), { what: "second close" });
  await p.waitForTimeout(800); await nothingLeft(p);
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});

await browser.close(); await srv.close();
report();
