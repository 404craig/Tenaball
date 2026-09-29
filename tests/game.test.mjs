// Game rules on one phone: passing costs a life, with a yellow card (red on the last life).
import { serve, launch, phone, until, visible } from "./lib.mjs";
import { test, assert, eq, report } from "./harness.mjs";

const site = await serve(5190);
const browser = await launch();
async function twoPlayerGame(){
  const p = await phone(browser, "game"); await p.goto(site.url);
  await until(() => visible(p, "#setup"));
  await p.click('#countSeg button[data-v="2"]'); await p.click('#clockSeg button[data-v="0"]');
  const boxes = await p.$$("#nameFields input"); await boxes[0].fill("Craig"); await boxes[1].fill("Aiden");
  await p.click("#startBtn"); await until(() => visible(p, "#intro")); await p.click("#introBtn");
  return p;
}
const ready = p => until(() => p.evaluate(() => !G.busy && !document.getElementById("guessArea").classList.contains("hidden") && !document.getElementById("guessInput").disabled), { what: "a turn", timeout: 10000 });
const who = p => p.evaluate(() => G.players[G.turn].name);
const lives = p => p.evaluate(() => G.players.map(x => x.lives));
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
await test("game: solo, the button still says Give up and ends the round without a card", async () => {
  const p = await phone(browser, "solo"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.click('#countSeg button[data-v="1"]'); await p.click('#clockSeg button[data-v="0"]');
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
  await p.click('#countSeg button[data-v="1"]'); await p.click('#roundSeg button[data-v="3"]'); await p.click('#clockSeg button[data-v="0"]');
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
  const gaps = await p.evaluate(() => { const r = s => document.querySelector(s).getBoundingClientRect(), n = r("#zeroNote"); return [Math.round(n.top - r("#podium .pod").bottom), Math.round(r("#end .row").top - n.bottom)]; });
  eq(gaps[1], gaps[0] * 2, "the gap under the line is twice the gap above it");
  const line = await p.textContent("#zeroNote");
  assert(await visible(p, "#zeroNote"), "the line shows under the table");
  assert(await p.evaluate(l => ZERO_LINES.includes(l), line), "one of the three lines: " + line);
  const share = await p.evaluate(() => SHARE.text);
  assert(share.includes("scored 0 points.") && /\n- /.test(share), "the share message has no medal or place: " + share);
  assert(!share.includes("wins with"), "the share message doesn't call it a win");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});
await test("game: solo with points still gets the trophy, and no cheeky line", async () => {
  const p = await phone(browser, "some"); await p.goto(site.url); await until(() => visible(p, "#setup"));
  await p.click('#countSeg button[data-v="1"]'); await p.click('#roundSeg button[data-v="3"]'); await p.click('#clockSeg button[data-v="0"]');
  await p.click("#startBtn"); await until(() => visible(p, "#intro")); await p.click("#introBtn"); await ready(p);
  await p.evaluate(() => { G.round = cfg.rounds; G.players[0].score = 4; endRound(); });
  await p.click("#nextBtn");
  await until(() => visible(p, "#winTrophy"), { what: "the trophy" });
  assert(!(await visible(p, "#zeroNote")), "no cheeky line");
  assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close();
});

await browser.close(); await site.close();
report();
