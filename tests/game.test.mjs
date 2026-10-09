// Game rules on one phone: passing costs a life, with a yellow card (red on the last life).
import { serve, launch, phone, until, visible } from "./lib.mjs";
import { test, assert, eq, report } from "./harness.mjs";

const site = await serve(5190);
const browser = await launch();
async function twoPlayerGame(){
  const p = await phone(browser, "game"); await p.goto(site.url);
  await until(() => visible(p, "#setup"));
  await p.click('[data-door="h2h"]'); await p.click('#countSeg button[data-v="2"]'); await p.evaluate(() => { cfg.clock = 0; }); /* no shot clock in tests (Off is Solo play only) */
  const boxes = await p.$$("#nameFields input"); await boxes[0].fill("Craig"); await boxes[1].fill("Aiden");
  await p.click("#startBtn"); await until(() => visible(p, "#intro")); await p.click("#introBtn");
  return p;
}
const ready = p => until(() => p.evaluate(() => !G.busy && !document.getElementById("guessArea").classList.contains("hidden") && !document.getElementById("guessInput").disabled), { what: "a turn", timeout: 10000 });
const who = p => p.evaluate(() => G.players[G.turn].name);
const lives = p => p.evaluate(() => [...G.players].sort((a, b) => a.ci - b.ci).map(x => x.lives)); // in seat order, whatever the order of play
// press Pass and read the card that comes up
async function pass(p){
  await ready(p); const name = await who(p);
  await p.click("#passBtn");
  await until(() => visible(p, "#outOverlay"), { what: "the card" });
  const card = await p.evaluate(() => ({ who: document.getElementById("outWho").textContent, lbl: document.getElementById("outLbl").textContent, yellow: document.getElementById("outOverlay").classList.contains("yel") }));
  await p.click("#outOverlay");
  await until(async () => !(await visible(p, "#outOverlay")), { what: "the card to close" });
  return { name, ...card };
}

await test("game: passing costs a life and shows a yellow card, then the turn moves on", async () => {
  const p = await twoPlayerGame();
  const first = await who(p);
  const c = await pass(p);
  eq([c.who, c.yellow, c.lbl], [first, true, "Passed. Booked, 2 lives left."]);
  eq(await lives(p), first === "Craig" ? [2, 3] : [3, 2], "one life gone");
  assert((await p.textContent("#feedback")).includes(`${first} passes. ${first} loses a life.`), "the message says so");
  await ready(p); assert((await who(p)) !== first, "the other player's turn");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("game: a pass on the last life is a red card, and the round ends when everyone is out", async () => {
  const p = await twoPlayerGame();
  const cards = []; for (let i = 0; i < 5; i++) cards.push(await pass(p));
  eq(cards.map(c => c.yellow), [true, true, true, true, false], "yellow, yellow, yellow, yellow, then red");
  eq(cards[4].lbl, "is sent off. One player left standing.");
  const last = await pass(p); // the last player standing passes on their final life
  eq(last.yellow, false);
  await until(() => visible(p, "#roundEnd"), { what: "the round to end" });
  eq(await lives(p), [0, 0]);
  assert((await p.textContent("#feedback")).includes("Everyone is out."), "round over message");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("end: each player's row opens this game's stats, with a small link to their all-time stats", async () => {
  const p = await phone(browser, "gamestats"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.click('[data-door="h2h"]'); await p.click('#countSeg button[data-v="2"]'); await p.click('#roundSeg button[data-v="3"]'); await p.evaluate(() => { cfg.clock = 0; }); /* no shot clock in tests (Off is Solo play only) */
  const boxes = await p.$$("#nameFields input"); await boxes[0].fill("Craig"); await boxes[1].fill("Aiden");
  await p.click("#startBtn"); await until(() => visible(p, "#intro"));
  await p.evaluate(() => { applyRefresh(findQ("pl-at-mgr-wins")); G.players.sort((a, b) => a.ci - b.ci); G.turn = 0; }); await p.click("#introBtn"); // Craig first, whatever the shuffle drew
  const card = async () => { await until(() => visible(p, "#outOverlay"), { what: "the card" }); await p.click("#outOverlay"); };
  await ready(p); await p.evaluate(() => applyGuess("Alex Ferguson"));      // Craig: right
  await ready(p); p.evaluate(() => applyGuess("Kevin Keegan")); await card(); // Aiden: wrong, a yellow
  await ready(p); await p.click("#passBtn"); await card();                   // Craig: passes, a yellow
  await ready(p); await p.evaluate(() => applyGuess("Arsene Wenger"));      // Aiden: right
  await p.evaluate(() => endRound()); await p.click("#nextBtn");
  for (const r of [2, 3]){ await until(() => visible(p, "#intro"), { what: `round ${r}` }); await p.click("#introBtn"); await ready(p); await p.evaluate(() => endRound()); await p.click("#nextBtn"); }
  await until(() => visible(p, "#end"), { what: "full time" });
  const panel = await p.evaluate(() => [...document.querySelectorAll("#podium .podwrap")].map(w => ({
    name: w.querySelector(".nm").textContent, grid: [...w.querySelectorAll(".pgame .statgrid b")].map(b => b.textContent),
    extra: w.querySelector(".pgame .statextra").textContent, rounds: w.querySelector(".pgame .statnote").textContent,
    allHidden: w.querySelector(".pall").classList.contains("hidden") })));
  const craig = panel.find(x => x.name === "Craig"), aiden = panel.find(x => x.name === "Aiden");
  eq(craig.grid, ["1", "0", "100%", "1"], "Craig: 1 right, 0 wrong, 100% correct, best round 1");
  eq(aiden.grid, ["1", "1", "50%", "1"], "Aiden: 1 right, 1 wrong, 50% correct");
  assert(craig.extra.includes("Yellow cards 1") && craig.extra.includes("Passes 1") && !craig.extra.includes("Time-outs"), "Craig's cards and pass: " + craig.extra);
  assert(aiden.extra.includes("Yellow cards 1") && aiden.extra.includes("Red cards 0") && !aiden.extra.includes("Passes"), "Aiden's card: " + aiden.extra);
  eq(craig.rounds, "Round by round: 1, 0, 0");
  assert(craig.allHidden, "all-time stats wait behind the link");
  const flip = await p.evaluate(() => { const w = document.querySelector("#podium .podwrap"); w.querySelector(".pgame .statlink").click();
    const a = [w.querySelector(".pgame").classList.contains("hidden"), w.querySelector(".pall").classList.contains("hidden"), w.querySelector(".pall").textContent.includes("Games")];
    w.querySelector(".pall .statlink").click(); return [...a, w.querySelector(".pgame").classList.contains("hidden")]; });
  eq(flip, [true, false, true, false], "the link swaps to all-time stats and back");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("game: solo, the button still says Give up and ends the round without a card", async () => {
  const p = await phone(browser, "solo"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.click('[data-door="solo"]'); await p.click('#clockSeg button[data-v="0"]');
  await p.click("#startBtn"); await until(() => visible(p, "#intro")); await p.click("#introBtn"); await ready(p);
  eq(await p.textContent("#passBtn"), "Give up");
  await p.click("#passBtn");
  await until(() => visible(p, "#roundEnd"), { what: "the round to end" });
  assert(!(await visible(p, "#outOverlay")), "no card");
  eq(await p.textContent("#feedback").then(t => t.startsWith("You gave up this round.")), true);
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});

await test("game: solo with 0 points, the table shows - rather than 1st, no trophy, and a cheeky line", async () => {
  const p = await phone(browser, "zero"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.click('[data-door="solo"]'); await p.click('#roundSeg button[data-v="3"]'); await p.click('#clockSeg button[data-v="0"]');
  await p.click("#startBtn");
  for (let r = 1; r <= 3; r++){
    await until(() => visible(p, "#intro"), { what: `round ${r}` }); await p.click("#introBtn"); await ready(p);
    await p.click("#passBtn"); await until(() => visible(p, "#roundEnd"), { what: `round ${r} to end` });
    await p.click("#nextBtn");
  }
  await until(() => visible(p, "#end"), { what: "full time" });
  await p.waitForTimeout(1200);
  assert(await p.evaluate(() => document.getElementById("winTrophy").classList.contains("hidden")), "no trophy celebration");
  eq(await p.textContent("#podium .pod .place"), "-");
  eq(await p.evaluate(() => [document.querySelector("#podium .pod").classList.contains("show"), document.querySelector("#podium .pod").classList.contains("first")]), [true, false], "the row shows, not styled as a winner");
  eq(await p.textContent("#winnerLabel"), "You scored 0 points.");
  const gaps = await p.evaluate(() => { const r = s => document.querySelector(s).getBoundingClientRect(), n = r("#banter"); return [Math.round(n.top - r("#podium .pod").bottom), Math.round(r("#end .row").top - n.bottom)]; });
  eq(gaps[1], gaps[0] * 2, "the gap under the line is twice the gap above it");
  const line = await p.textContent("#banter");
  assert(await visible(p, "#banter"), "the line shows under the table");
  assert(await p.evaluate(l => BANTER.soloZero.includes(l), line), "one of the zero-score lines: " + line);
  const share = await p.evaluate(() => SHARE.text);
  assert(share.includes("scored 0 points.") && /\n- /.test(share), "the share message has no medal or place: " + share);
  assert(!share.includes("wins with"), "the share message doesn't call it a win");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("game: solo with points still gets the trophy, then a line for the score under the table", async () => {
  const p = await phone(browser, "some"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.click('[data-door="solo"]'); await p.click('#roundSeg button[data-v="3"]'); await p.click('#clockSeg button[data-v="0"]');
  await p.click("#startBtn"); await until(() => visible(p, "#intro")); await p.click("#introBtn"); await ready(p);
  await p.evaluate(() => { G.round = cfg.rounds; G.players[0].score = 4; endRound(); });
  await p.click("#nextBtn");
  await until(() => visible(p, "#winTrophy"), { what: "the trophy" });
  assert(!(await visible(p, "#banter")), "the line waits until the table is in");
  await p.click("#winTrophy"); await until(() => visible(p, "#banter"), { what: "the banter line" });
  const line = await p.textContent("#banter");
  assert(await p.evaluate(l => BANTER.soloPoor.some(x => x.replace("{pts}", "4 points") === l), line), "4 of 30 is a poor score: " + line);
  assert(await p.evaluate(l => SHARE.text.includes("_" + l + "_"), line), "the share message carries the line");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});

await test("banter: the line reacts to what happened in the table", async () => {
  const p = await phone(browser, "banter"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const r = await p.evaluate(() => {
    const k = (scores, rounds = 1) => banterKind(scores, rounds * 10);
    return {
      solo: [k([0]), k([2]), k([5]), k([7]), k([9]), k([10]), k([21], 3), k([26], 3)],
      multi: [k([0, 0]), k([4, 4, 1]), k([2, 1]), k([9, 1]), k([7, 2]), k([5, 3, 0]), k([5, 4]), k([4, 2, 2]), k([7, 5]), k([16, 14], 3)],
      names: banterLine([{ name: "Craig", score: 3 }, { name: "Aiden", score: 3 }], 10).text,
      every: Object.entries(BANTER).every(([kind, a]) => a.length >= 5 && a.every(l => !/\u2014/.test(l) && (l.match(/\{(\w+)\}/g) || []).every(t => ["{name}","{winner}","{winners}","{second}","{bottom}","{top}","{secondScore}","{bottomScore}","{lead}","{pts}","{topPts}"].includes(t))))
    };
  });
  eq(r.solo, ["soloZero", "soloPoor", "soloMid", "soloGood", "soloGreat", "soloPerfect", "soloGood", "soloGreat"], "solo goes by the share of the game's slots");
  eq(r.multi, ["allZero", "tie", "leastBad", "chasm", "runaway", "bottomZero", "close", "winMid", "winHigh", "close"], "multiplayer follows the table");
  assert(!/\{/.test(r.names), "placeholders are filled: " + r.names);
  assert(r.every, "every list has at least five lines, no em dashes and only known placeholders");
  // the same result on two phones gives the same line
  const two = await p.evaluate(() => { const g = [{ name: "Craig", score: 6 }, { name: "Aiden", score: 2 }]; localStorage.removeItem("tenaball-banter"); const a = banterLine(g, 10).text; localStorage.removeItem("tenaball-banter"); const b = banterLine(g, 10).text; const c = banterLine(g, 10).text; return [a === b, b !== c]; });
  eq(two, [true, true], "same result, same line on a fresh phone; a phone doesn't repeat itself straight away");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("questions: the October 2026 Premier League boards are all playable, and every answer is recognised", async () => {
  const p = await phone(browser, "q4"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const r = await p.evaluate(() => {
    const ids = EXTRA_Q4.map(q => q.id), live = ids.filter(id => findQ(id));
    const bad = [];
    for (const id of live){
      const q = findQ(id);
      if (q.slots.length !== 10 || !q.period || ![0,1,2].includes(q.level)) bad.push(id + ": shape");
      const names = new Set(q.slots.flatMap(s => s.alts ? s.alts : [s.club]));
      const D = { person: PALIAS, club: ALIAS, nation: NALIAS }[q.type];
      for (const n of names){ const m = D[norm(n)] || D[norm(n.split(" ").pop())]; if (!m || !(m instanceof Set ? m.has(n) : m === n)) bad.push(id + ": " + n + " not recognised"); }
    }
    return { n: ids.length, live: live.length, bad, fam: [...new Set(live.map(id => family(findQ(id))))].sort() };
  });
  eq([r.n, r.live], [250, 250], "all 250 boards survive the final pass");
  eq(r.bad, [], "every board has ten slots, a period and a level, and every answer is a known name");
  eq(r.fam, ["appearances", "assists", "keepers", "managers", "records", "scorers", "transfers", "trophies"], "the boards spread across families");
  // play one with a tie pool: any of the tied names fills the shared place, a near miss gets its note
  await p.click('[data-door="solo"]'); await p.click('#clockSeg button[data-v="0"]');
  await p.evaluate(() => { window.pickQuestion = () => findQ("pl-at-hattricks"); });
  await p.click("#startBtn"); await until(() => visible(p, "#intro")); await p.click("#introBtn"); await ready(p);
  await p.fill("#guessInput", "Raheem Sterling"); await p.click("#lockBtn"); await ready(p);
  const f = await p.evaluate(() => [Object.keys(G.foundBy).length, G.slotName[9]]);
  eq(f, [1, "Raheem Sterling"], "a player tied on 5 fills 10th");
  await p.fill("#guessInput", "Mohamed Salah"); await p.click("#lockBtn"); await ready(p);
  assert(/one short/.test(await p.textContent("#feedback")), "a near miss explains itself: " + await p.textContent("#feedback"));
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("letter boards: any Premier League player with the right surname letter counts, filling from 10th up", async () => {
  const p = await phone(browser, "letters"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const info = await p.evaluate(() => { const t0 = performance.now(); for (const q of ["ka","smi","arnautvic","de bruy"]) { matches(norm(q)); fuzzy(norm(q)); } const ms = performance.now() - t0;
    const letterQ = Q.filter(q => q.open && /^pl-letter-[a-z]+$/.test(q.id));
    return { players: PLP.size, boards: letterQ.map(q => q.id), counts: letterQ.map(q => q.open.count),
      kdb: PLP.get("Kevin De Bruyne").letters, son: PLP.has("Heung-min Son") && !PLP.has("Son Heung-min"), known: [...PLP.keys()].every(n => PEOPLE[n]), ms }; });
  assert(info.players > 5000, "every player is loaded: " + info.players);
  eq(info.boards.length, 22, "22 letter boards"); assert(info.boards.includes("pl-letter-iqu") && info.boards.includes("pl-letter-xyz"), "rare letters share boards");
  assert(Math.min(...info.counts) >= 70, "every board has plenty of answers: " + info.counts);
  eq([info.kdb, info.son, info.known], ["BD", true, true], "De Bruyne counts for B and D, Son keeps the game's spelling, every player is a known name");
  assert(info.ms < 1500, "suggestions stay quick with every player loaded: " + Math.round(info.ms) + "ms");
  // club open boards: a surname letter at one club, or players who played for two clubs (the same player, not just the same name)
  const club = await p.evaluate(() => { const s = findQ("pl-letter-lfc-s"), b = findQ("pl-both-eve-mu"), q = Q.filter(x => x.open && x.cat==="pl");
    return { n: q.length, fam: [...new Set(q.map(family))], salah: s.open.fits("Mohamed Salah"), rooney: s.open.fits("Wayne Rooney"), rooneyNote: s.note("Wayne Rooney"),
      sterling: s.open.fits("Raheem Sterling"), sNote: s.note("Steven Gerrard"), both: b.open.fits("Wayne Rooney"), bothNo: b.open.fits("Steven Gerrard"), bNote: b.note("Steven Gerrard"),
      smith: PLP.get("Alan Smith").clubs.length > 1, ex: s.open.examples.every(n => s.open.fits(n)) && b.open.examples.every(n => b.open.fits(n)) }; });
  eq([club.n, club.fam], [96, ["letters"]], "22 letter boards plus 74 club open boards, all in the letters family");
  eq([club.salah, club.rooney, club.sterling, club.both, club.bothNo, club.smith, club.ex], [true, false, true, true, false, true, true], "club boards check the club, the letter and, for two clubs, the same player");
  // boards with their own list of answers: the 100-goal club and a club's forwards
  const listed = await p.evaluate(() => { const g = findQ("pl-open-100-goals"), f = findQ("pl-open-lfc-fwd");
    return [g.open.fits("Alan Shearer"), g.open.fits("Gary Neville"), /100 Premier League goals/.test(g.note("Gary Neville")),
      f.open.fits("Mohamed Salah"), f.open.fits("Steven Gerrard"), /forwards/.test(f.note("Steven Gerrard")), /didn't play for Liverpool/.test(f.note("Wayne Rooney"))]; });
  eq(listed, [true, false, true, true, false, true, true], "list boards take only their own names and explain a miss");
  assert(/didn't play for Liverpool/.test(club.rooneyNote) && /doesn't begin with S/.test(club.sNote) && /both Everton and Man Utd/.test(club.bNote), "wrong answers explain why: " + [club.rooneyNote, club.sNote, club.bNote]);
  await p.click('[data-door="solo"]'); await p.click('#clockSeg button[data-v="0"]');
  await p.evaluate(() => { window.pickQuestion = () => findQ("pl-letter-a"); });
  await p.click("#startBtn"); await until(() => visible(p, "#intro")); await p.click("#introBtn"); await ready(p);
  const guess = async (t) => { await p.fill("#guessInput", t); await p.click("#lockBtn"); await ready(p); return p.textContent("#feedback"); };
  assert(/goes in 10th/.test(await guess("Arnautovic")), "a surname alone works and goes in 10th");
  assert(/goes in 9th/.test(await guess("Shola Ameobi")), "the next goes in 9th");
  assert(/already/.test(await guess("Marko Arnautovic")), "the same player can't go in twice");
  assert(/doesn't begin with A/.test(await guess("Wayne Rooney")), "a Premier League player with the wrong letter is wrong");
  const slots = await p.evaluate(() => [G.slotName[9], G.slotName[8], Object.keys(G.foundBy).length, G.players[0].lives]);
  eq(slots, ["Marko Arnautovic", "Shola Ameobi", 2, 2], "answers sit in 10th and 9th, one life lost");
  assert(/never played in the Premier League/.test(await guess("Lionel Messi")), "a famous name who never played in the Premier League is wrong");
  await p.click("#passBtn"); await until(() => visible(p, "#roundEnd"), { what: "the round to end" });
  const end = await p.evaluate(() => [...document.querySelectorAll("#tower .slot")].map(s => s.querySelector(".nm") && s.querySelector(".nm").textContent));
  assert(end.every(Boolean) && end[9] === "Marko Arnautovic" && new Set(end).size === 10, "empty places show different example players: " + end);
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("sounds: the crowd joins the bleeps, cards get one whistle blast, and three blasts are kept for full time", async () => {
  const p = await phone(browser, "sounds"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.evaluate(() => { window.__snd = []; const c = window.crowdPlay; window.crowdPlay = (k, ...r) => { __snd.push("crowd:" + k); return c(k, ...r); };
    const w = window.whistle; window.whistle = pat => { __snd.push("whistle:" + pat.length); return w(pat); };
    window.__sizes = Object.fromEntries(Object.entries(CROWD_MP3).map(([k, v]) => [k, v.length])); });
  eq(await p.evaluate(() => __sizes), { applause:3, bigcheer:3, boos:4, cheer:4, groan:5, roar:3 }, "all 22 takes are in");
  await p.click('[data-door="h2h"]'); await p.click('#countSeg button[data-v="2"]'); await p.click('#roundSeg button[data-v="1"]'); await p.evaluate(() => { cfg.clock = 0; }); /* no shot clock in tests (Off is Solo play only) */
  await p.evaluate(() => { window.pickQuestion = () => findQ("pl-top-2023/24"); });
  await p.click("#startBtn"); await until(() => visible(p, "#intro")); await p.click("#introBtn"); await ready(p);
  await p.evaluate(() => __snd.length = 0);
  await p.fill("#guessInput", "Man Utd"); await p.click("#lockBtn"); await ready(p);
  eq(await p.evaluate(() => __snd), ["crowd:cheer"], "a right answer gets a cheer");
  await p.evaluate(() => __snd.length = 0);
  await p.fill("#guessInput", "Burnley"); await p.click("#lockBtn"); await ready(p);
  eq(await p.evaluate(() => __snd), ["crowd:groan", "whistle:1", "crowd:boos"], "a wrong answer gets a groan, then one whistle blast and boos for the yellow card");
  await p.fill("#guessInput", "Man City"); await p.click("#lockBtn"); await ready(p);
  await p.evaluate(() => __snd.length = 0);
  await p.evaluate(() => { G.round = cfg.rounds; endRound(); }); await p.click("#nextBtn");
  await until(() => p.evaluate(() => __snd.includes("crowd:applause")), { what: "applause" });
  eq(await p.evaluate(() => __snd.slice(0, 2)), ["whistle:3", "crowd:applause"], "full time: three blasts, then applause");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("home: the difficulty ball slides anywhere along the bar and snaps to the nearest level when let go", async () => {
  const p = await phone(browser, "slider"); await p.goto(site.url); await until(() => visible(p, "#setup")); await p.click('[data-door="h2h"]');
  await p.click("#allLevels"); // All levels starts on; the slider works with it off
  await p.evaluate(() => document.getElementById("diff").scrollIntoView({ block: "center" }));
  const box = await (await p.$("#diff")).boundingBox(), y = box.y + box.height/2, at = f => box.x + 16 + (box.width - 32) * f;
  const read = () => p.evaluate(() => [Number(document.getElementById("diff").value), cfg.level, document.getElementById("diffName").textContent]);
  await p.mouse.move(at(.5), y); await p.mouse.down();
  await p.mouse.move(at(.7), y, { steps: 5 });
  const mid = await read();
  assert(mid[0] > 120 && mid[0] < 160, "the ball sits between the stops while dragging: " + mid[0]);
  eq(mid.slice(1), [1, "Medium"], "the closest level shows while dragging");
  await p.mouse.move(at(.8), y, { steps: 3 });
  eq((await read()).slice(1), [2, "Hard"], "past the halfway point it reads Hard");
  await p.mouse.up();
  await until(async () => (await read())[0] === 200, { what: "the snap to Hard" });
  await p.mouse.move(at(.8), y); await p.mouse.down(); await p.mouse.move(at(.3), y, { steps: 5 }); await p.mouse.up();
  await until(async () => (await read())[0] === 100, { what: "the snap back to Medium" });
  eq(await read(), [100, 1, "Medium"]);
  await p.focus("#diff"); await p.keyboard.press("ArrowLeft");
  await until(async () => (await read())[0] === 0, { what: "the arrow key to move a whole level" });
  eq((await read()).slice(1), [0, "Easy"]);
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});

await test("questions: club record scorers draw a fresh ten clubs, with the right mix for each level", async () => {
  const p = await phone(browser, "rec"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const r = await p.evaluate(() => {
    const out = {};
    [0, 1, 2].forEach(lv => {
      const tpl = Q.find(x => x.id === `pl-club-rec-${lv}`), seen = new Set(), bad = [];
      for (let i = 0; i < 60; i++){
        const b = drawClubRec(tpl), clubs = b.slots.map(s => s.label), tier0 = clubs.filter(c => CLUB_REC.find(x => x[0] === c)[3] === 0).length;
        seen.add(b.id);
        if (clubs.length !== 10 || new Set(clubs).size !== 10 || tier0 !== CLUB_REC_MIX[lv][0]) bad.push(b.id);
        const again = findQ(b.id);
        if (!again || JSON.stringify(again.slots) !== JSON.stringify(b.slots) || again.period !== tpl.period || again.level !== lv) bad.push("rebuild " + b.id);
        const goals = b.slots.map(s => parseInt(s.val)); if (goals.some((g, k) => k && g > goals[k-1])) bad.push("order " + b.id);
      }
      out[lv] = { level: tpl.level, distinct: seen.size, bad, period: tpl.period };
    });
    out.junk = [findQ("pl-club-rec-1:1.2.3"), findQ("pl-club-rec-1:0.0.1.2.3.4.5.6.7.8"), findQ("pl-club-rec-1:0.1.2.3.4.5.6.7.8.99")].map(x => x === null);
    return out;
  });
  for (const lv of [0, 1, 2]){ eq([r[lv].level, r[lv].bad], [lv, []], `level ${lv}`); assert(r[lv].distinct > 20, `level ${lv} boards vary: ${r[lv].distinct}`); eq(r[lv].period, "Premier League era, 1992/93 to 2025/26"); }
  eq(r.junk, [true, true, true], "a made-up id isn't a board");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("questions: most titles as a manager takes any six of the nine one-title managers, and the top two board has all ten clubs", async () => {
  const p = await phone(browser, "mgr"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const info = await p.evaluate(() => { const m = findQ("pl-at-mgr-titles"), t = findQ("pl-at-top2"); return { m: m && [m.slots.length, m.level, m.period, m.slots.filter(s => s.pool).length, m.slots[5].alts.length], t: t && [t.slots.map(s => s.club), t.level, t.period] }; });
  eq(info.m, [10, 1, "Premier League era, 1992/93 to 2025/26", 6, 9]);
  eq(info.t, [["Man Utd","Arsenal","Man City","Chelsea","Liverpool","Blackburn","Newcastle","Aston Villa","Leicester","Spurs"], 0, "Premier League era, 1992/93 to 2025/26"]);
  // play the managers board solo: six one-title managers fill the pool, the seventh is turned away
  await p.click('[data-door="solo"]'); await p.click('#clockSeg button[data-v="0"]');
  await p.evaluate(() => { window.pickQuestion = () => findQ("pl-at-mgr-titles"); });
  await p.click("#startBtn"); await until(() => visible(p, "#intro")); await p.click("#introBtn");
  const one = ["Carlo Ancelotti","Mikel Arteta","Antonio Conte","Kenny Dalglish","Jurgen Klopp","Roberto Mancini","Manuel Pellegrini"];
  for (const n of one){ await ready(p); await p.fill("#guessInput", n); await p.click("#lockBtn"); await p.waitForTimeout(50); }
  await until(() => p.evaluate(() => !G.busy), { what: "the last guess" });
  eq(await p.evaluate(() => [G.players[0].score, Object.keys(G.foundBy).length]), [6, 6], "six count");
  assert((await p.textContent("#feedback")).includes("tied on that total"), "the seventh is told the places are filled");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});

await test("home: competitions tick in a slide-up panel, the box sums them up, and the phone remembers them", async () => {
  const p = await phone(browser, "comps"); await p.goto(site.url); await until(() => visible(p, "#setup")); await p.click('[data-door="h2h"]');
  eq(await p.textContent("#compSum"), "All competitions");
  await p.click("#compBtn"); await until(() => visible(p, "#compSheet"));
  const rows = await p.$$eval("#compList .crow", rs => rs.map(r => [r.querySelector(".nm").textContent, r.getAttribute("aria-checked"), r.classList.contains("soon")]));
  eq(rows.map(r => r[0]), ["Premier League","La Liga","Bundesliga","Serie A","Ligue 1","Scottish Premiership","Top 5 Leagues","Champions League","Europa League","World Cup","Euros","Internationals"]);
  eq(rows.filter(r => r[2]).map(r => r[0]), [], "nothing is shown as coming later now the Europa League is on");
  eq(await p.$$eval("#compList .cgrp", g => g.map(x => x.textContent)), ["Leagues","Europe","International"]);
  eq(await p.$$eval("#compList .crow .ic img, #compList .crow .ic svg", s => s.length), 12, "every row has a circle flag, logo or badge");
  eq(await p.$$eval("#compList .crow .ic img", s => s.length), 9, "the leagues, Euros, Champions League and Europa League use the pack's images");
  await p.click('#compQuick [data-q="Leagues"]');
  eq(await p.textContent("#compCount"), "7 of 12 on");
  await p.click('#compList [data-c="top5"]'); await p.click('#compList [data-c="spfl"]');
  await p.click("#compDone"); await until(async () => !(await visible(p, "#compSheet")), { what: "the panel to close" });
  eq(await p.textContent("#compSum"), "5 competitions");
  // none ticked: Done waits
  await p.click("#compBtn"); for (const c of ["pl","laliga","bund","seriea","ligue1"]) await p.click(`#compList [data-c="${c}"]`);
  eq([await p.textContent("#compCount"), await p.$eval("#compDone", b => b.disabled)], ["Turn at least one on", true]);
  await p.click('#compList [data-c="wc"]'); await p.click('#compList [data-c="euro"]'); await p.click('#compList [data-c="intl"]');
  await p.mouse.click(195, 30); // a tap above the panel closes it too
  await until(async () => !(await visible(p, "#compSheet")), { what: "the panel to close" });
  eq(await p.textContent("#compSum"), "International only");
  eq(await p.$$eval("#compFlags .ic img, #compFlags .ic svg", s => s.length), 3);
  await p.reload(); await until(() => visible(p, "#setup")); await p.click('[data-door="h2h"]');
  eq(await p.evaluate(() => [cfg.cats, document.getElementById("compSum").textContent]), [["wc","euro","intl"], "International only"], "remembered after a reload");
  // a phone that saved every competition before the Europa League and Internationals arrived gets them ticked too
  await p.evaluate(() => localStorage.setItem("tenaball-setup", JSON.stringify({ v: 2, cats: ["pl","laliga","bund","seriea","ligue1","spfl","top5","ucl","wc","euro"], allLevels: true })));
  await p.reload(); await until(() => visible(p, "#setup"));
  eq(await p.evaluate(() => cfg.cats.includes("uel") && cfg.cats.includes("intl") && cfg.cats.length), 12, "the Europa League and Internationals are ticked for a phone that had everything on");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("game: one question change for every round, used in any round", async () => {
  const p = await phone(browser, "refresh"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const r = await p.evaluate(async () => { cfg.rounds = 5; cfg.count = 1; await startGame(); const a = G.refreshLeft; for (let i = 0; i < 5; i++) applyRefresh(refreshPick()); return [a, G.refreshLeft, $("refreshBtn").disabled]; });
  eq(r, [5, 0, true], "5 rounds give 5 changes, all usable in the first round");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("game: rounds come only from ticked competitions, never the same one twice running", async () => {
  const p = await phone(browser, "ticked"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.evaluate(() => { cfg.cats = ["wc","euro","ucl"]; renderCompBtn(); });
  const seq = await p.evaluate(() => { G = { picked: new Set(), lastCat: null }; return Array.from({ length: 12 }, () => nextCat()); });
  assert(seq.every(c => ["wc","euro","ucl"].includes(c)), seq.join(","));
  assert(seq.every((c, i) => !i || c !== seq[i-1]), "no repeats in a row: " + seq.join(","));
  eq(await p.evaluate(() => { cfg.cats = ["pl"]; return [nextCat(), nextCat()]; }), ["pl","pl"]);
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("Ballon d'Or boards sit under Top 5 Leagues, and each Champions League finalist since 2017 has a starting-line-up board", async () => {
  const p = await phone(browser, "bdo"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const r = await p.evaluate(() => {
    const bdo = Q.filter(q => /bdo/.test(q.id)), xi = Q.filter(q => /^ucl-xi-/.test(q.id)), intl = Q.filter(q => /^(wc|euro)-xi-/.test(q.id));
    const eng24 = findQ("euro-xi-2024-eng");
    const lfc19 = findQ("ucl-xi-2019-lfc");
    return { bdo: [bdo.length, bdo.every(q => q.cat==="top5" && q.look==="bdo"), !!WATERMARK.bdo, lookName(bdo[0])], xi: [xi.length, xi.every(q => q.cat==="ucl" && q.slots.length===10 && q.period && new Set(q.slots.map(s => s.club)).size===10), [...new Set(xi.map(family))]],
      intl: [intl.filter(q => q.cat==="wc").length, intl.filter(q => q.cat==="euro").length, intl.every(q => q.slots.length===10 && family(q)==="lineups")],
      eng24: [eng24.title, eng24.brief, eng24.slots.map(s => s.club).join(", ")],
      lfc19: [lfc19.title, lfc19.period, lfc19.slots.map(s => s.club).join(", ")], known: xi.every(q => q.slots.every(s => s.club in PEOPLE)) };
  });
  eq(r.bdo, [7, true, true, "Ballon d'Or"], "seven Ballon d'Or boards, drawn under Top 5 but dressed in gold with the trophy watermark");
  eq(r.xi, [20, true, ["lineups"]], "twenty line-up boards of ten different players, in their own family");
  eq(r.lfc19, ["Liverpool's starters, 2019 final", "2018/19 Champions League final, 1 June 2019",
    "Trent Alexander-Arnold, Joel Matip, Virgil van Dijk, Andy Robertson, Jordan Henderson, Fabinho, Georginio Wijnaldum, Mohamed Salah, Roberto Firmino, Sadio Mane"]);
  eq(r.intl, [8, 8, true], "eight World Cup and eight Euros final line-ups");
  eq(r.eng24, ["England's starters, Euro 2024 final", "Name the ten outfield players England started with in the Euro 2024 final against Spain (they lost 2-1).",
    "Kyle Walker, John Stones, Marc Guehi, Bukayo Saka, Kobbie Mainoo, Declan Rice, Luke Shaw, Phil Foden, Jude Bellingham, Harry Kane"]);
  assert(r.known, "every starter is a recognised name");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("every answer on every board locks in when typed in full", async () => {
  const p = await phone(browser, "names"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.click('[data-door="solo"]'); await p.click('#clockSeg button[data-v="0"]'); await p.click("#startBtn"); await until(() => visible(p, "#intro"));
  const r = await p.evaluate(() => { const out = [], inp = document.getElementById("guessInput"); let n = 0;
    for (const q of Q){ if (q.open || q.dyn) continue; G.q = q;
      for (const name of new Set(q.slots.flatMap(s => [s.club, ...(s.alts || [])]))){ n++; inp.value = name; G.pick = null; const got = resolve(); if (got !== name) out.push(`${q.id}: "${name}" -> ${got}`); } }
    return { n, out, has: ["pl-derby-nld-goals", "ucl-xi-2022-lfc", "bdo-vote-2025"].every(id => Q.some(q => q.id === id)) }; });
  assert(r.has && r.n > 5000, "checked the records, line-up and Ballon d'Or boards too: " + r.n);
  eq(r.out, [], "typing an answer exactly (Thiago, Heung-min Son and the rest) picks that player");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("home: All levels greys the slider and each board's level is picked at random; a note shows when a competition has none at a level", async () => {
  const p = await phone(browser, "levels"); await p.goto(site.url); await until(() => visible(p, "#setup")); await p.click('[data-door="h2h"]');
  eq(await p.evaluate(() => [cfg.allLevels, document.getElementById("diffName").textContent, document.getElementById("diffWrap").classList.contains("dimmed")]), [true, "All levels", true], "All levels is on by default");
  await p.click("#allLevels"); eq(await p.evaluate(() => cfg.allLevels), false, "and can be switched off");
  await p.evaluate(() => { for (let i = Q.length-1; i >= 0; i--) if (Q[i].cat==="laliga" && Q[i].level===0) Q.splice(i, 1); cfg.cats = ["laliga"]; renderCompBtn(); }); // every league has easy boards now, so take La Liga's away to see the note
  await p.evaluate(() => document.getElementById("diff").scrollIntoView({ block: "center" }));
  await p.focus("#diff"); await p.keyboard.press("ArrowLeft");
  await until(async () => (await p.textContent("#diffName")) === "Easy", { what: "Easy" });
  assert(await visible(p, "#compNote"), "a note for La Liga on Easy");
  eq(await p.textContent("#compNote"), "No Easy questions for La Liga yet, so that round will use the nearest level.");
  await p.click("#allLevels");
  eq(await p.evaluate(() => [document.getElementById("diffName").textContent, document.getElementById("diffWrap").classList.contains("dimmed"), document.getElementById("allLevels").getAttribute("aria-checked"), cfg.allLevels]), ["All levels", true, "true", true]);
  assert(!(await visible(p, "#compNote")), "no note with All levels");
  const lv = await p.evaluate(() => { G = { picked: new Set(), lastCat: null }; const c = [0,0,0]; for (let i = 0; i < 90; i++){ G.picked = new Set(); c[pickQuestion("pl").level]++; } return c; });
  assert(lv.every(n => n >= 12), "every level comes up: " + lv.join(","));
  eq(await p.evaluate(() => shareSummary([{ name: "Craig", score: 3 }]).meta.slice(1)), ["All levels", "La Liga"]);
  await p.reload(); await until(() => visible(p, "#setup")); await p.click('[data-door="h2h"]');
  eq(await p.evaluate(() => cfg.allLevels), true, "remembered after a reload");
  // a phone that turned it off keeps it off; one that saved its setup before All levels became the default gets it switched on once
  await p.click("#allLevels"); await p.reload(); await until(() => visible(p, "#setup")); await p.click('[data-door="h2h"]');
  eq(await p.evaluate(() => cfg.allLevels), false, "switched off stays off after a reload");
  await p.evaluate(() => localStorage.setItem("tenaball-setup", JSON.stringify({ cats: ["pl"], allLevels: false }))); await p.reload(); await until(() => visible(p, "#setup")); await p.click('[data-door="h2h"]');
  eq(await p.evaluate(() => [cfg.allLevels, cfg.cats]), [true, ["pl"]], "an older saved setup gets All levels switched on, and keeps its competitions");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});

await test("home: each section's i opens a slide-up panel explaining it, and How to play opens the rules", async () => {
  const p = await phone(browser, "info"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const seen = [];
  for (const k of ["rounds","comps","clock","repeat","diff","how"]){
    const b = k === "how" ? "#infoBtn" : `#setup .finfo[data-info="${k}"]`;
    if (k === "how") await p.click("#doorSet .backbtn"); else if (k === "rounds") await p.click('[data-door="h2h"]');
    await p.evaluate(sel => document.querySelector(sel).scrollIntoView({ block: "center" }), b);
    await p.click(b); await until(() => visible(p, "#infoSheet"), { what: `the ${k} panel` });
    seen.push([await p.textContent("#infoTitle"), (await p.textContent("#infoBody")).length > 80]);
    if (k === "how") await p.mouse.click(195, 30); else await p.click("#infoDone");
    await until(async () => !(await visible(p, "#infoSheet")), { what: "the panel to close" });
  }
  eq(seen, [["Rounds",true],["Competitions",true],["Shot clock per answer",true],["Duplicate answers",true],["Difficulty",true],["How to play",true]]);
  eq(await p.evaluate(() => cfg.allLevels), true, "the i next to Difficulty doesn't flip the switch (it starts on)");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("game: a 1-round game goes straight to full time after its round", async () => {
  const p = await phone(browser, "one"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  eq(await p.$$eval("#roundSeg button", b => b.map(x => x.textContent)), ["1","3","5","7"]);
  await p.click('[data-door="solo"]'); await p.click('#roundSeg button[data-v="1"]'); await p.click('#clockSeg button[data-v="0"]');
  await p.click("#startBtn"); await until(() => visible(p, "#intro"));
  eq(await p.textContent("#introRound"), "Round 1 of 1");
  await p.click("#introBtn"); await ready(p); await p.click("#passBtn");
  await until(() => visible(p, "#roundEnd")); eq(await p.textContent("#nextBtn"), "See final scores");
  await p.click("#nextBtn"); await until(() => visible(p, "#end"), { what: "full time" });
  eq(await p.evaluate(() => shareSummary(G.players).meta[0]), "1 Round");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});

await test("share: if the trophy fails to load onto the results card, the card is drawn again with it", async () => {
  const p = await phone(browser, "card"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const r = await p.evaluate(async () => {
    const real = cardImg; let calls = 0;
    window.cardImg = async el => { if (++calls === 1) throw new Error("busy"); return real(el); };
    prepareShare([{ name: "Craig", score: 8, color: "var(--p1)" }]);
    const first = await new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { if (SHARE.file || Date.now()-t0 > 4000){ clearInterval(iv); res(!!SHARE.file); } }, 50); });
    const firstFile = SHARE.file;
    await new Promise(res => setTimeout(res, 4500));
    return [first, calls, SHARE.file !== firstFile && !!SHARE.file];
  });
  eq(r, [true, 2, true], "a card straight away, then a second try that swaps in the card with the trophy");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});

await test("badges: every game club but four gets a crest by its game name, and the four keep the circle", async () => {
  const p = await phone(browser, "crest"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const r = await p.evaluate(() => {
    const names = Object.keys(COLOURS), none = names.filter(n => !crestKey(n));
    const two = [crestKey("RB Salzburg"), crestKey("Red Bull Salzburg")];
    const h = n => badge(n);
    return { total: names.length, none, two, aliased: [crestKey("Tottenham Hotspur"), crestKey("spurs"), crestKey("SPURS")], imgs: Object.keys(BADGE_IMG).length,
      every: names.filter(n => crestKey(n) && !h(n).includes("<img")).length, circle: ["Arles","Lleida","Merida","Salamanca"].map(n => h(n).includes('class="badge"') && !h(n).includes("<img")),
      valid: Object.values(BADGE_FILE).every(k => BADGE_IMG[k]) };
  });
  eq(r.none, ["Arles", "Lleida", "Merida", "Salamanca"], "only these four have no badge");
  eq(r.total - r.none.length, 326, "326 game names have a badge");
  assert(r.two[0] && r.two[0] === r.two[1], "both names on a two-name row find the same badge");
  assert(r.aliased[1] && r.aliased[1] === r.aliased[2], "lookup ignores case");
  eq(r.circle, [true, true, true, true], "no badge keeps the two-colour circle");
  eq([r.every, r.valid], [0, true], "every name that has a badge draws an image, and every badge has its picture");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("badges: crests are 32px on the board and 26px in suggestions, plain with no backing, and centred with the pill text", async () => {
  const p = await phone(browser, "bk"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.click('[data-door="solo"]'); await p.click('#clockSeg button[data-v="0"]');
  await p.evaluate(() => { window.pickQuestion = () => findQ("pl-top-1992/93"); });
  await p.click("#startBtn"); await until(() => visible(p, "#intro")); await p.click("#introBtn"); await ready(p);
  await p.fill("#guessInput", "sp"); await until(() => p.evaluate(() => document.querySelectorAll("#sugg button").length > 0), { what: "suggestions" });
  const sg = await p.evaluate(() => [...document.querySelectorAll("#sugg button")].map(b => { const i = b.querySelector(".bcell.crest img"); if (!i) return null; const s = getComputedStyle(i), ib = i.getBoundingClientRect(), bb = b.getBoundingClientRect();
    return [b.textContent, s.width, s.height, s.backgroundImage, Math.abs((ib.top + ib.bottom) / 2 - (bb.top + bb.bottom) / 2) <= 1]; }));
  assert(sg.some(Boolean), "suggestions show crests: " + JSON.stringify(sg));
  for (const x of sg.filter(Boolean)) eq(x.slice(1), ["26px", "26px", "none", true], "suggestion crest for " + x[0] + ": 26px, no backing, centred in the pill");
  await p.fill("#guessInput", "Man Utd"); await p.click("#lockBtn");
  await until(() => p.evaluate(() => document.querySelectorAll("#tower .slot.found").length > 0), { what: "a found answer" });
  const f = await p.evaluate(() => { const c = getComputedStyle(document.querySelector("#tower .slot.found .bcell.crest img")); return [c.width, c.height, c.backgroundImage]; });
  eq(f, ["32px", "32px", "none"], "a found crest is 32px and plain");
  await ready(p); await p.click("#passBtn"); await until(() => visible(p, "#roundEnd"), { what: "the round to end" });
  const m = await p.evaluate(() => [...document.querySelectorAll("#tower .slot.missed")].map(s => { const c = s.querySelector(".bcell.crest"), i = c && c.querySelector("img"); if (!i) return [s.textContent.trim(), null]; const st = getComputedStyle(i);
    return [s.textContent.trim(), st.width, st.backgroundImage, getComputedStyle(c).opacity, i.naturalWidth > 0]; }));
  assert(m.length >= 8, "missed answers are shown: " + m.length);
  for (const x of m) eq(x.slice(1), ["32px", "none", "1", true], "missed crest for " + x[0] + ": 32px, no backing, not faded");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("badges: every crest is drawn at the same visual size", async () => {
  const p = await phone(browser, "size"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const r = await p.evaluate(async () => {
    const c = document.createElement("canvas"); c.width = c.height = 72; const x = c.getContext("2d", { willReadFrequently: true }), out = {};
    for (const [k, b64] of Object.entries(BADGE_IMG)){
      const i = new Image(); i.src = "data:image/png;base64," + b64; await i.decode(); x.clearRect(0, 0, 72, 72); x.drawImage(i, 0, 0);
      const d = x.getImageData(0, 0, 72, 72).data; let x0 = 72, y0 = 72, x1 = -1, y1 = -1;
      for (let y = 0; y < 72; y++) for (let X = 0; X < 72; X++) if (d[(y * 72 + X) * 4 + 3] > 40){ x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      const w = x1 - x0 + 1, h = y1 - y0 + 1; out[k] = { size: Math.sqrt(w * h), long: Math.max(w, h), cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
    }
    return out;
  });
  const bad = Object.entries(r).filter(([k, v]) => v.long < 70 && !["az-alkmaar", "molde"].includes(k) && Math.abs(v.size - 56.25) > 2.5);
  eq(bad.map(x => x[0]), [], "every crest that is not capped by its long side has the same size: " + JSON.stringify(bad.slice(0, 5)));
  const off = Object.entries(r).filter(([k, v]) => Math.abs(v.cx - 35.5) > 1.5 || Math.abs(v.cy - 35.5) > 1.5);
  eq(off.map(x => x[0]), [], "every crest is centred");
  const sz = n => r[n].size; assert(Math.abs(sz("man-city") - sz("man-utd")) < 2.5, "Man City and Man Utd look the same size: " + sz("man-city") + " " + sz("man-utd"));
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("Premier League season tables show each club's final points", async () => {
  const p = await phone(browser, "pts"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.click('[data-door="solo"]'); await p.click('#clockSeg button[data-v="0"]');
  const r = await p.evaluate(() => ({ top: findQ("pl-top-2023/24").slots.map(s => s.val), bot: findQ("pl-bot-2023/24").slots.slice(-2).map(s => s.val),
    seasons: PL_SEASONS.every(k => PL_PTS[k].length === PL[k].length), first: findQ("pl-top-1992/93").slots[0].val, pompey: PL_PTS["2009/10"][19], c100: PL_PTS["2017/18"][0] }));
  eq(r.top, ["91 pts","89 pts","82 pts","68 pts","66 pts","63 pts","60 pts","60 pts","52 pts","49 pts"], "2023/24 top ten");
  eq([r.bot, r.seasons, r.first, r.pompey, r.c100], [["24 pts","16 pts"], true, "84 pts", 19, 100], "points for every season, after deductions");
  await p.evaluate(() => { window.pickQuestion = () => findQ("pl-top-2023/24"); });
  await p.click("#startBtn"); await until(() => visible(p, "#intro")); await p.click("#introBtn"); await ready(p);
  await p.fill("#guessInput", "Man Utd"); await p.click("#lockBtn");
  await until(() => p.evaluate(() => document.querySelectorAll("#tower .slot.found").length > 0), { what: "a found answer" });
  const f = await p.evaluate(() => [document.getElementById("feedback").textContent, document.querySelector("#tower .slot.found .who").textContent]);
  eq(f, ["Tenable! Man Utd finished 8th with 60 pts. +1.", "60 pts"], "the message and the row show the points");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("each competition has a faint watermark at the top right of the game screen, kept within the screen", async () => {
  const p = await phone(browser, "wmk"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.click('[data-door="solo"]'); await p.click('#clockSeg button[data-v="0"]');
  await p.evaluate(() => { window.pickQuestion = () => Q.find(q => q.cat === "ucl"); });
  await p.click("#startBtn"); await until(() => visible(p, "#intro")); await p.click("#introBtn"); await ready(p);
  const r = await p.evaluate(async () => {
    const out = {};
    for (const c of ALL_CATS){ theme(c); const i = document.getElementById("wmkImg"); await i.decode(); const b = i.parentNode.getBoundingClientRect(), s = getComputedStyle(i);
      out[c] = [i.naturalWidth, s.opacity, b.right <= innerWidth + 0.5, getComputedStyle(i.parentNode).display]; }
    theme("ucl");
    const title = document.getElementById("titleLabel"), t = document.elementFromPoint(title.getBoundingClientRect().right - 4, title.getBoundingClientRect().top + 8);
    return { out, cats: ALL_CATS, uel: !!WATERMARK.uel, scroll: document.documentElement.scrollWidth <= innerWidth, onTop: !t.closest(".wmk") };
  });
  for (const c of r.cats) eq([r.out[c][0], r.out[c][2], r.out[c][3]], [256, true, "block"], "watermark for " + c);
  eq([r.out.pl[1], r.out.laliga[1], r.uel, r.scroll, r.onTop], ["0.13", "0.2", true, true, true], "white marks are fainter, the Europa League one is ready, no sideways scroll, text sits above it");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("badges: a found row on the Champions League board has no coloured bar across the top", async () => {
  const p = await phone(browser, "ucl"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const r = await p.evaluate(() => { document.body.dataset.cat = "ucl"; const h = document.createElement("div"); h.innerHTML = '<div class="slot found"><span class="club">x</span></div>'; document.body.appendChild(h);
    const c = getComputedStyle(h.firstChild, "::before").content; h.remove(); return c; });
  eq(r, "none", "no ::before bar");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("badges: country boards use circle flags, and the three countries that no longer exist get a drawn circle flag", async () => {
  const p = await phone(browser, "flags"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const r = await p.evaluate(async () => {
    const all = Object.keys(FLAGS), none = all.filter(n => !(NATION_FLAG[n] && FLAG_IMG[NATION_FLAG[n]]));
    const host = document.createElement("div"); host.style.cssText = "position:fixed;left:0;top:0;width:360px;z-index:99";
    host.innerHTML = `<div class="slot found"><span class="club">${badgeN("Brazil")}Brazil</span></div><div class="sugg"><button type="button">${badgeN("England")}England</button><button type="button">${badgeN("Soviet Union")}Soviet Union</button></div>`;
    document.body.appendChild(host); await Promise.all([...host.querySelectorAll("img")].map(i => i.decode()));
    const b = host.querySelector(".slot .bcell.fl img"), e = host.querySelector(".sugg .bcell.fl img"), cs = getComputedStyle(b), es = getComputedStyle(e);
    const former = ["Czechoslovakia", "Soviet Union", "Yugoslavia"].map(n => { const h = document.createElement("div"); h.innerHTML = badgeN(n); const v = h.querySelector(".bcell.fl svg"); document.body.appendChild(h); const ok = !!v && v.getBoundingClientRect().width === 24 && getComputedStyle(v).borderRadius === "50%"; h.remove(); return ok; });
    const out = { total: all.length, none, board: [cs.width, cs.borderRadius, b.naturalWidth > 0], pill: [es.width, es.borderRadius], emoji: host.querySelectorAll(".badge.flag").length, former, ni: NATION_FLAG["Northern Ireland"], wales: NATION_FLAG.Wales };
    host.remove(); return out;
  });
  eq(r.none.sort(), ["Czechoslovakia", "Soviet Union", "Yugoslavia"], "only the three former states have no flag in the pack");
  eq(r.board, ["24px", "50%", true], "a flag on the board is a 24px circle");
  eq(r.pill, ["19px", "50%"], "a flag in a suggestion is a 19px circle");
  eq([r.emoji, r.former], [0, [true, true, true]], "no emoji flags are left: the former states are drawn circles");
  eq([r.ni, r.wales], ["gb-nir", "gb-wls"]);
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});

await test("badges: missed rows fade the name more than the crest, and year boards get a narrow label column so names fit", async () => {
  const p = await phone(browser, "fade"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.click('[data-door="solo"]'); await p.click('#clockSeg button[data-v="0"]');
  await p.evaluate(() => { window.pickQuestion = () => findQ("wc-ru-1930"); });
  await p.click("#startBtn"); await until(() => visible(p, "#intro")); await p.click("#introBtn"); await ready(p);
  const mid = await p.evaluate(() => { const l = document.querySelector("#tower .slot .lab"); return [document.getElementById("tower").classList.contains("shortlab"), Math.round(l.getBoundingClientRect().width)]; });
  eq(mid, [true, 54], "a board labelled by year has the narrow label column");
  await p.click("#passBtn"); await until(() => visible(p, "#roundEnd"), { what: "the round to end" });
  const r = await p.evaluate(() => { const s = document.querySelector("#tower .slot.missed"), nm = s.querySelector(".nm"), f = s.querySelector(".bcell.fl"), c = getComputedStyle(nm);
    return { club: getComputedStyle(s.querySelector(".club")).opacity, nm: c.opacity, ellipsis: c.textOverflow, nowrap: c.whiteSpace, flag: f ? getComputedStyle(f.querySelector("img")).width : null }; });
  eq([r.club, r.nm, r.ellipsis, r.nowrap, r.flag], ["1", "0.65", "ellipsis", "nowrap", "24px"], "the name is faded to 65 percent and kept on one line");
  await p.evaluate(() => { window.pickQuestion = () => findQ("pl-top-1992/93"); });
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("questions: every board's answers match its type (clubs on club boards, players on player boards), so the box, suggestions and TenaBot ask for the right thing", async () => {
  const p = await phone(browser, "types"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const bad = await p.evaluate(() => {
    const isClub = n => { const v = ALIAS[norm(n)]; return v === n || (v instanceof Set && v.has(n)); };
    const isNation = n => { const v = NALIAS[norm(n)]; return v === n || (v instanceof Set && v.has(n)); };
    return Q.filter(q => !q.open && q.slots).map(q => {
      const t = q.type || "club", names = [...new Set(q.slots.flatMap(s => s.alts || [s.club]))].filter(Boolean);
      const wrong = t === "person" ? names.filter(n => (isClub(n) || isNation(n)) && !PLP.has(n)) : t === "club" ? names.filter(n => !isClub(n)) : t === "nation" ? names.filter(n => !isNation(n)) : [];
      return wrong.length ? `${q.id} (${t}): ${wrong.slice(0, 3).join(", ")}` : null;
    }).filter(Boolean);
  });
  eq(bad, [], "boards whose answers don't match their type");
  const q = await p.evaluate(() => { const q = findQ("pl-promoted-best-2006/07"); G = { q, pick: null, guessed: new Set() }; setPlaceholder(q); return [q.type, input.placeholder, matches(norm("Brighton"))[0]]; });
  eq(q, ["club", "Type a club", "Brighton"], "the promoted clubs board asks for clubs");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("scottish boards: open boards take any name on their list, filling from 10th up, and every board has ten answers", async () => {
  const p = await phone(browser, "spfl"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const r = await p.evaluate(() => {
    const m = findQ("spfl-letter-cel-m"), c = findQ("spfl-open-captains");
    G = { q: m, slotName: {}, foundBy: {}, poolUsed: {} };
    const hit = guessHits("Callum McGregor", G, false).hits, miss = guessHits("Scott Brown", G, false).hits;
    const spfl = [...EXTRA_Q5, ...SPFL_OPEN].map(b => findQ(b.id)).filter(Boolean);
    return { hit, miss, cap: [c.open.fits("Scott Brown"), c.open.fits("Kris Boyd")], note: c.note("Kris Boyd"), n: spfl.length, ten: spfl.every(q => q.slots.length === 10), ex: m.open.examples.every(n => m.open.fits(n)) };
  });
  eq([r.hit, r.miss, r.cap, r.ten, r.ex], [[9], [], [true, false], true, true], "McGregor fills 10th on the Celtic M board, Brown doesn't count, captains board knows its captains");
  eq(r.n, 57, "all 49 Scottish boards and 8 open boards are in the game");
  assert(/Kris Boyd/.test(r.note), r.note);
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("penalties: players level on top at full time go to a shootout; the winner gets a point and it shows in the table and the message", async () => {
  const p = await phone(browser, "pens"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.evaluate(() => { cfg.count = 3; G = { players: [newPlayer("Craig", 0), newPlayer("Aiden", 1), newPlayer("Phil", 2)], round: 3, picked: new Set(), refreshLeft: 3 };
    G.players[0].score = 12; G.players[1].score = 12; G.players[2].score = 7; endGame(); });
  await until(() => visible(p, "#shootout"), { what: "the shootout" });
  eq(await p.evaluate(() => [...document.querySelectorAll("#soTally .nm")].map(e => e.textContent).sort()), ["Aiden", "Craig"], "only the two level on top take kicks");
  await until(() => visible(p, "#end"), { what: "full time after the shootout", timeout: 30000 });
  const r = await p.evaluate(() => ({ pens: G.pens, scores: Object.fromEntries(G.players.map(x => [x.name, x.score])), goals: G.players.map(x => x.pens), label: $("winnerLabel").textContent, share: shareText([...G.players].sort((a, b) => b.score - a.score)) }));
  const w = r.pens.winner, l = w === "Craig" ? "Aiden" : "Craig";
  eq([r.scores[w], r.scores[l], r.scores.Phil], [13, 12, 7], "the shootout winner gets a point");
  const [gw, gl] = r.pens.score.split("–").map(Number); assert(gw > gl, "the winner scored more kicks: " + r.pens.score);
  eq(r.label, `${w} wins on penalties, ${r.pens.score}.`);
  assert(r.share.includes(`⚽ ${w} won the penalty shootout ${r.pens.score}`), r.share);
  assert(!(await visible(p, "#shootout")), "the shootout has closed");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("penalties: a solo game and a clear winner never go to a shootout", async () => {
  const p = await phone(browser, "nopens"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.evaluate(() => { cfg.count = 2; G = { players: [newPlayer("Craig", 0), newPlayer("Aiden", 1)], round: 3, picked: new Set(), refreshLeft: 3 }; G.players[0].score = 9; G.players[1].score = 8; endGame(); });
  await until(() => visible(p, "#end"), { what: "full time" });
  eq(await p.evaluate(() => [!!G.pens, G.players.map(x => x.score)]), [false, [9, 8]]);
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("penalties: every shootout question has two different values, a date line and a known unit", async () => {
  const p = await phone(browser, "penq"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  const bad = await p.evaluate(() => PEN_DATA.r.filter(([h, a, b, va, vb, u, g]) => !PEN_DATA.h[h] || !PEN_DATA.h[h][1] || a === b || va === vb || !(va > 0 && vb > 0) || !u || ![1, 2, 3].includes(g) || /\u2014/.test(PEN_DATA.h[h].join(" "))));
  eq(bad, [], "no broken pairs");
  assert(await p.evaluate(() => PENS.count) > 500, "a full pool of questions");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("updates: a newer version.txt reloads the home screen once, with no loop", async () => {
  const p = await phone(browser, "update");
  await p.ctx.route("**/version.txt*", r => r.fulfill({ body: "999", contentType: "text/plain" }));
  let loads = 0; p.on("load", () => loads++);
  await p.goto(site.url); await until(() => visible(p, "#setup"));
  await until(() => p.evaluate(() => sessionStorage.getItem("tenaball-tried") === "999"), { what: "the reload to the new version" });
  await until(() => loads >= 2, { what: "a second load" });
  await p.waitForTimeout(2500);
  eq(loads, 2, "it reloads once, not again and again");
  assert(!/v=/.test(p.url()), "the address is tidied: " + p.url());
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await browser.close(); await site.close();
report();
