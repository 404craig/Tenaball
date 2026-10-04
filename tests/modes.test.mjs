// The home screen's three doors, who goes first, TenaBot, the two new modes (First touch and Beat the clock) on one phone,
// and the Stats tab.
import { serve, launch, phone as makePhone, until, visible } from "./lib.mjs";
import { test, assert, eq, report } from "./harness.mjs";

const site = await serve(5191);
const browser = await launch();
// pace: how much faster TenaBot thinks (0.0001 keeps it quiet so a test can make its moves for it)
async function phone(name, pace = 1){
  const p = await makePhone(browser, name);
  await p.ctx.addInitScript(v => { window.TENABALL_BOT_PACE = v; }, pace);
  await p.goto(site.url); await until(() => visible(p, "#setup"));
  return p;
}
const done = async p => { assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close(); };
// solo against TenaBot in a mode, one round from the Premier League
async function vsBot(p, mode, { qid = "pl-top-1992/93", level = 1 } = {}){
  await p.click('[data-door="solo"]'); await p.click('#oppSeg button[data-v="bot"]'); await p.click(`#botSeg button[data-v="${level}"]`);
  await p.click(`#modePick button[data-v="${mode}"]`); await p.click('#roundSeg button[data-v="1"]');
  if (mode === "turns") await p.click('#clockSeg button[data-v="0"]'); else await p.click('#timeSeg button[data-v="30"]');
  await p.evaluate(id => { window.pickQuestion = () => findQ(id); }, qid);
  await p.click("#startBtn"); await until(() => visible(p, "#intro"), { what: "the intro", timeout: 15000 }); await p.click("#introBtn");
}
const slotName = (p, i) => p.evaluate(i => { const s = G.q.slots[i]; return s.alts ? s.alts[0] : s.club; }, i);

await test("home: three doors, each opening its own settings, with Stats, Share and Account in a tab bar", async () => {
  const p = await phone("doors");
  eq(await p.$$eval("#doors .door b", b => b.map(x => x.textContent)), ["Play solo", "H2H on this phone", "H2H online"]);
  eq(await p.$$eval("#doors .door .dd", b => b.map(x => x.textContent)), ["Beat your best score and complete more boards.", "2 to 4 players. Pass and play.", "Play on separate phones. 3 game modes."]);
  assert(!(await visible(p, "#onlineBtn")), "no online door without a server");
  assert(await visible(p, "#tabBar"), "tab bar on the doors");
  await p.click('[data-door="solo"]');
  assert(await visible(p, "#oppField") && !(await visible(p, "#countField")) && !(await visible(p, "#modeField")), "solo: an opponent choice, no player count, no modes on your own");
  assert(!(await visible(p, "#tabBar")), "no tab bar inside a door");
  await p.click('#oppSeg button[data-v="bot"]');
  assert(await visible(p, "#modeField") && await visible(p, "#botField"), "TenaBot brings the modes and its level");
  eq(await p.$$eval("#modePick button", b => b.map(x => x.childNodes[1].textContent)), ["Take turns", "First touch", "Beat the clock"]);
  await p.click('#modePick button[data-v="clock"]'); await p.click('#timeSeg button[data-v="30"]');
  assert(await visible(p, "#timeField") && !(await visible(p, "#clockField")) && !(await visible(p, "#repeatField")), "a time limit replaces the shot clock");
  await p.click("#doorSet .backbtn"); await p.click('[data-door="h2h"]');
  assert(!(await visible(p, "#modeField")), "pass and play takes turns");
  await p.click('#countSeg button[data-v="3"]');
  eq(await p.$$eval("#nameFields .namerow", r => r.length), 3);
  await p.click("#nameFields .botbtn");
  eq(await p.textContent("#nameFields .botseat"), "TenaBot· Medium", "seat 2 is TenaBot"); assert(await visible(p, "#botField"), "bot level shown");
  await p.click("#doorSet .backbtn"); await p.click('[data-view="share"]');
  assert((await p.textContent("#siteLink")).startsWith("127.0.0.1:5191"), "the game's link");
  await p.click("#copyLink"); await until(async () => (await p.textContent("#linkMsg")).includes("copied"), { what: "copied" });
  await p.reload(); await until(() => visible(p, "#setup"));
  eq(await p.evaluate(() => [cfg.mode, cfg.opp, cfg.time]), ["clock", "bot", 30], "the phone remembers the mode, opponent and time limit");
  await done(p);
});

await test("who goes first: H2H shuffles the order once, and each round starts one place further down", async () => {
  const p = await phone("order");
  await p.click('[data-door="h2h"]'); await p.click('#countSeg button[data-v="3"]'); await p.click('#clockSeg button[data-v="0"]'); await p.click('#roundSeg button[data-v="3"]');
  const boxes = await p.$$("#nameFields input"); await boxes[0].fill("Craig"); await boxes[1].fill("Aiden"); await boxes[2].fill("Emma");
  await p.click("#startBtn"); await until(() => visible(p, "#orderOv"), { what: "the shuffle" });
  await until(async () => (await p.textContent("#orderNote")).endsWith("goes first"), { what: "the result" });
  const order = await p.evaluate(() => G.players.map(x => x.name));
  eq([...order].sort(), ["Aiden", "Craig", "Emma"], "everyone is in the order");
  eq(await p.textContent("#orderNote"), `${order[0]} goes first`);
  eq(await p.$$eval("#orderBox .opill.first .nm", e => e.map(x => x.textContent)), [order[0]], "the top pill glows");
  eq(await p.evaluate(() => G.players.map(x => x.color)), await p.evaluate(() => G.players.map(x => `var(--p${x.ci+1})`)), "colours stay with each player");
  await until(() => visible(p, "#intro"), { what: "the first round" }); await p.click("#introBtn");
  await until(() => p.evaluate(() => G.phase === "turn" && G.turnReady), { what: "a turn" });
  eq(await p.evaluate(() => G.players[G.turn].name), order[0], "round 1 starts with the first in the order");
  await p.evaluate(() => { endRound(); applyNext(); });
  await until(() => visible(p, "#intro")); await p.click("#introBtn");
  await until(() => p.evaluate(() => G.phase === "turn" && G.turnReady), { what: "round 2" });
  eq(await p.evaluate(() => G.players[G.turn].name), order[1], "round 2 starts one place down");
  await done(p);
});

await test("TenaBot: takes its own turns against you, gets carded for wrong answers, keeps no stats, and counts in your win rate", async () => {
  const p = await phone("bot turns", 20);
  await vsBot(p, "turns", { level: 2 });
  await until(async () => {
    if (await visible(p, "#roundEnd")) return true;
    const mine = await p.evaluate(() => G.phase === "turn" && !G.busy && G.turnReady && !G.over && !G.players[G.turn].bot);
    if (mine) await p.click("#passBtn"); // you pass every turn: TenaBot carries on alone
    if (await visible(p, "#outOverlay")) await p.click("#outOverlay").catch(() => {});
    return false;
  }, { timeout: 60000, every: 200, what: "the round to end" });
  const r = await p.evaluate(() => ({ bot: G.players.find(x => x.bot), me: G.players.find(x => !x.bot) }));
  eq(r.me.lives, 0, "you passed your lives away");
  assert(r.bot.g.right + r.bot.g.wrong > 0, "TenaBot answered");
  eq(r.bot.g.right + r.bot.g.wrong, r.bot.g.right + (3 - r.bot.lives), "every wrong answer cost TenaBot a life");
  await p.click("#nextBtn"); await until(() => visible(p, "#end"), { what: "full time" });
  await p.click("#winTrophy").catch(() => {});
  eq(await p.evaluate(() => Object.keys(loadStats())), ["player 1"], "only the person's stats are kept");
  eq(await p.evaluate(() => { const s = loadStats()["player 1"]; return [s.played, s.multi, s.x.b.bot.games, !!s.x.b.solo]; }), [1, 1, 1, false], "a game with an opponent, in the vs TenaBot filter");
  await done(p);
});

await test("First touch: the first right answer claims the slot in the player's colour; too slow costs nothing; a bonus for the most", async () => {
  const p = await phone("first", 0.0001);
  await vsBot(p, "first");
  await until(() => p.evaluate(() => G.phase === "live"), { what: "the round to start" });
  assert(await visible(p, "#clock"), "the round's clock"); assert(!(await visible(p, "#passBtn")), "no passing");
  const [a, b, c] = [await slotName(p, 0), await slotName(p, 1), await slotName(p, 2)];
  await p.evaluate(n => { input.value = n; G.pick = n; }, a); await p.click("#lockBtn");
  await until(() => p.evaluate(() => G.foundBy[0] === 0), { what: "your claim" });
  assert(await p.evaluate(() => document.querySelector("#tower .slot").classList.contains("pc1")), "your colour");
  await p.evaluate(([b, c]) => { applyLiveGuess(1, b); applyLiveGuess(1, c); }, [b, c]); // TenaBot claims two
  assert(await p.evaluate(() => document.querySelectorAll("#tower .slot")[1].classList.contains("pc2")), "TenaBot's colour");
  await p.evaluate(n => { input.value = n; G.pick = n; }, b); await p.click("#lockBtn");
  eq(await p.textContent("#feedback"), `Right answer, but too slow: TenaBot got ${b} first (2nd). No card.`);
  eq(await p.evaluate(() => G.players[0].lives), 3, "no card for being beaten to it");
  await p.evaluate(() => applyLiveGuess(0, "Barnet"));
  eq(await p.evaluate(() => [G.players[0].lives, G.players[0].g.yellow]), [2, 1], "a wrong answer is a yellow card");
  await p.evaluate(() => applyTimeUp());
  eq(await p.evaluate(() => G.players.map(x => x.score)), [1, 3], "a point a slot, plus a bonus for the most");
  await until(() => p.evaluate(() => document.getElementById("roundSheet").classList.contains("up")), { what: "the points sheet" });
  eq(await p.$$eval("#roundSheet .rrow .nm span", e => e.map(x => x.textContent)), ["TenaBot", "Player 1"], "best first");
  eq(await p.$$eval("#roundSheet .rrow svg", e => e.length), 1, "a crown for the round's winner");
  eq(await p.textContent("#sheetNext"), "Final scores");
  assert(!(await visible(p, "#roundEnd")), "nothing under the sheet while it's up");
  await p.click("#roundSheet .xbtn");
  assert(!(await p.evaluate(() => document.getElementById("roundSheet").classList.contains("up"))), "the ✕ slides it away");
  assert(await visible(p, "#nextBtn"), "Final scores shows in the page"); eq(await p.textContent("#nextBtn"), "Final scores");
  await p.click("#mini .sheetbar"); assert(await p.evaluate(() => document.getElementById("roundSheet").classList.contains("up")), "the points bar brings it back");
  await p.click("#sheetNext"); await until(() => visible(p, "#end"), { what: "full time" });
  const msg = await p.evaluate(() => SHARE.text);
  assert(msg.startsWith("🏆 *TENABALL | FIRST TOUCH*\n\n*TenaBot wins with 3 points!*"), msg);
  assert(!/🟦|🟨|🥇/.test(msg), "no coloured squares or medals");
  await done(p);
});

await test("Beat the clock: your own board, others' finds as name pills, then one results grid with 2 points for a lone find", async () => {
  const p = await phone("clock", 0.0001);
  await vsBot(p, "clock");
  await until(() => p.evaluate(() => G.phase === "live"), { what: "the round to start" });
  const [a, b] = [await slotName(p, 0), await slotName(p, 1)];
  await p.evaluate(([a, b]) => { applyLiveGuess(1, a); applyLiveGuess(1, b); }, [a, b]);
  const first = await p.evaluate(() => { const s = document.querySelector("#tower .slot"); return [s.classList.contains("found"), s.querySelector(".upill") && s.querySelector(".upill").textContent, !!s.querySelector(".who"), s.querySelector(".club").textContent.includes("Manchester")]; });
  eq(first, [false, "TenaBot", true, false], "TenaBot's name and the stat, not the answer");
  await p.evaluate(n => { input.value = n; G.pick = n; }, a); await p.click("#lockBtn");
  await until(() => p.evaluate(() => G.players[0].B.foundBy[0] === 0), { what: "your find" });
  assert(await p.evaluate(() => { const s = document.querySelector("#tower .slot"); return s.classList.contains("pc1") && !s.querySelector(".upill"); }), "your full pill, without anyone else's name");
  eq(await p.evaluate(() => G.foundBy[0]), undefined, "the shared board isn't touched");
  await p.evaluate(() => applyTimeUp());
  eq(await p.evaluate(() => G.players.map(x => x.score)), [1, 3], "1 each for the shared find, 2 for TenaBot's lone one");
  eq(await p.$$eval("#tower .res .hd span", e => e.map(x => x.textContent).slice(2)), ["You", "Bot"]);
  eq(await p.$$eval("#tower .res .rw:not(.tot)", r => r.slice(0, 2).map(x => [...x.querySelectorAll(".tk")].map(t => t.textContent))), [["✓", "✓"], ["", "★"]]);
  eq(await p.textContent("#tower .res .keyline"), "✓ 1 point · ★ only one player found it: 2 points");
  assert(!(await visible(p, "#players")), "the found counts are hidden on the results");
  await done(p);
});

await test("Beat the clock never draws a letter board (everyone needs the same answers in the same places)", async () => {
  const p = await phone("noletters", 0.0001);
  const ids = await p.evaluate(() => { G = { picked: new Set(), lastCat: null, mode: "clock" }; return Array.from({ length: 120 }, () => pickQuestion("pl").id); });
  assert(!(await p.evaluate(ids => ids.some(id => findQ(id).open), ids)), "a letter board was drawn");
  await done(p);
});

await test("stats: filters by how you played, boards completed by competition, and a reset that asks first", async () => {
  const p = await phone("stats", 0.0001);
  await p.evaluate(() => {
    const S = {}, r = (o = {}) => ({ cat: "pl", lv: 1, pts: 6, f: 6, o: 2, z: 2, r: 6, w: 1, done: false, ...o });
    S["player 1"] = bumpStats(null, { door: "h2h", mode: "turns", people: 1, score: 12, result: "w", rounds: [r(), r({ cat: "ucl", f: 10, o: 0, z: 0, done: true, pts: 12 })], opp: [{ name: "Aiden", score: 7 }] });
    S["player 1"] = bumpStats(S["player 1"], { door: "solo", mode: "clock", bots: true, score: 9, result: "l", rounds: [r({ f: 9 })], opp: [{ name: "TenaBot", bot: true, score: 11 }] });
    S.aiden = bumpStats(null, { door: "h2h", people: 1, score: 7, result: "l", rounds: [r()], opp: [{ name: "Player 1", score: 12 }] });
    S.aiden.name = "Aiden"; saveStats(S);
  });
  await p.click('[data-view="stats"]');
  eq(await p.$$eval("#statsBody .tiles span", e => e.map(x => x.textContent)), ["Games", "Wins", "Win rate", "Points"]);
  eq(await p.$$eval("#statsBody .tiles b", e => e.map(x => x.textContent)), ["2", "1", "50%", "21"], "the loss to TenaBot counts in the win rate");
  assert((await p.textContent("#statsBody")).includes("v Aiden1–0"), "head to head");
  const how = await p.$$eval("#statsBody .homegrp", g => g.find(x => x.querySelector(".gh").textContent === "How you've played").querySelector(".kv").textContent);
  eq(how, "On your own0 gamesAgainst friends1 · won 1 (100%)Against TenaBot1 · won 0 (0%)", "the record split by who you played");
  eq(await p.evaluate(() => { const s = loadStats()["player 1"]; s.played += 5; s.multi += 2; s.wins += 1; return splitOf(s); }),
    { games: 7, solo: 3, people: { games: 3, wins: 2 }, bot: { games: 1, wins: 0 } }, "games from before the detail fold into solo and friends");
  eq(await p.$$eval("#statsBody .badges div:not(.locked) b", e => e.map(x => x.textContent)), ["Tenable!"]);
  await p.click('[data-sf="bot"]');
  eq(await p.$$eval("#statsBody .tiles b", e => e.map(x => x.textContent)), ["1", "0", "0%", "9"], "vs TenaBot");
  await p.click('[data-sf="clock"]');
  assert((await p.textContent("#statsBody")).includes("Most slots in a round9"), "Beat the clock's own bests");
  await p.click('[data-st="cmp"]'); await p.click('[data-with="local:aiden"]');
  assert((await p.textContent("#statsBody")).includes("You v Aiden"), "compare with someone on this phone");
  await p.click('[data-st="cmp"]');
  await p.click('[data-st="ask"]'); assert(await visible(p, "#statsBody .confirm"), "asks first");
  await p.click('[data-st="keep"]'); eq(await p.evaluate(() => loadStats()["player 1"].played), 2, "Keep them keeps them");
  await p.click('[data-st="ask"]'); await p.click('[data-st="reset"]');
  eq(await p.evaluate(() => "player 1" in loadStats()), false, "reset");
  assert((await p.textContent("#statsBody")).includes("No games yet"), "an empty state");
  eq(await p.evaluate(() => "aiden" in loadStats()), true, "only your own stats");
  await done(p);
});

await browser.close(); await site.close();
report();
