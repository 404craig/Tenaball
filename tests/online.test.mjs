// Online games across several phones: invite links, live lobby updates, turns, sync, reconnects and the host's controls.
import { serve, launch, phone, startServer, until, visible, TEST_SECRETS } from "./lib.mjs";
import { test, assert, eq, report } from "./harness.mjs";

const srv = await serve(5185);
const server = await startServer({ port: 8792, origins: [srv.url.replace(/\/$/, "")] });
const browser = await launch();
const open = async (name, path = "") => { const p = await phone(browser, name, { server: server.url }); await p.goto(srv.url + path); return p; };
const serverUser = async email => {
  const r = await fetch(server.url + "/api/admin/find", { method: "POST", headers: { "content-type": "application/json", Origin: server.url }, body: JSON.stringify({ password: TEST_SECRETS.ADMIN_PASSWORD, q: email }) });
  return (await r.json()).users[0];
};
const shown = (p, id, timeout) => until(() => visible(p, "#" + id), { what: `${p.label} to show #${id}`, timeout });
const closeAll = async (...ps) => { const errs = ps.flatMap(p => p.errors); for (const p of ps) await p.ctx.close(); assert(!errs.length, errs.join("\n")); };
const lobbyNames = p => p.$$eval("#lobbyList .lobbyrow:not(.empty) .nm", els => els.map(e => e.textContent));

async function guestTo(p){ await shown(p, "login"); await p.click("#guestBtn"); }
async function signUp(p, name, email){
  await shown(p, "login"); await p.click("#tabUp");
  await p.fill("#signName", name); await p.fill("#signEmail", email); await p.fill("#signPin", "2468"); await p.fill("#signPin2", "2468"); await p.click("#authBtn");
  await shown(p, "setup");
}
// tick exactly these competitions in the slide-up panel
async function pickComps(p, cats){
  await p.click("#compBtn"); await shown(p, "compSheet");
  const rows = await p.$$eval("#compList button.crow", rs => rs.map(r => [r.dataset.c, r.getAttribute("aria-checked") === "true"]));
  for (const [c, on] of rows) if (on !== cats.includes(c)) await p.click(`#compList [data-c="${c}"]`); // the list redraws after each tap
  await p.click("#compDone");
}
// host: pick settings on the home screen, then create an online game
async function hostGame(p, { rounds = 3, clock = 0, cat = "pl", mode = "turns", time = 60 } = {}){
  await p.click("#onlineBtn"); await shown(p, "onlineGo");
  await p.click(`#modePick button[data-v="${mode}"]`);
  await p.click(`#roundSeg button[data-v="${rounds}"]`); await p.click(mode === "turns" ? `#clockSeg button[data-v="${clock}"]` : `#timeSeg button[data-v="${time}"]`); await pickComps(p, [].concat(cat));
  if (!(await p.inputValue("#onlineName"))) await p.fill("#onlineName", p.label);
  await p.click("#createBtn"); await shown(p, "lobbyRoom");
  return p.textContent("#lobbyCode");
}
async function joinByLink(p, code, name){
  await p.goto(`${srv.url}?room=${code}`);
  if (await until(async () => (await visible(p, "#login")) || (await visible(p, "#onlineGo")) || (await visible(p, "#lobbyRoom")), { what: "join screen" }) && await visible(p, "#login")){
    eq(await p.textContent("#loginSub"), "Sign in, or play as a guest, to join the game");
    await p.click("#guestBtn");
  }
  await until(async () => (await visible(p, "#onlineGo")) || (await visible(p, "#lobbyRoom")), { what: `${p.label} lobby` });
  if (await visible(p, "#onlineGo")){ await p.fill("#onlineName", name); await p.click("#joinBtn"); }
  await shown(p, "lobbyRoom");
}
async function everyoneSees(pages, names){
  for (const p of pages) await until(async () => JSON.stringify(await lobbyNames(p)) === JSON.stringify(names), { what: `${p.label} to list ${names.join(", ")}`, timeout: 8000 });
}

// a snapshot of the game that must match on every phone
const state = p => p.evaluate(() => G && G.q ? JSON.stringify({ q: G.q.id, round: G.round, turn: G.turn, phase: G.phase, over: !!G.over,
  scores: G.players.map(x => x.score), lives: G.players.map(x => x.lives), out: G.players.map(x => !!x.out), found: G.foundBy, refresh: G.refreshLeft,
  order: G.players.map(x => x.uid), boards: G.players.map(x => x.B ? x.B.foundBy : null) }) : null);
const settled = p => p.evaluate(() => !!(ONLINE && !ONLINE.running && !ONLINE.pending.size && !FAST && G && (G.phase !== "turn" || G.over || (!G.busy && G.turnReady))));
// waits until every phone has applied the move log past \`after\` (the log position before the move being checked)
const seqOf = p => p.evaluate(() => ONLINE ? ONLINE.next : 0);
async function inSync(pages, what, after = 0){
  await until(async () => { for (const p of pages) if (!(await settled(p))) return false;
    const seqs = await Promise.all(pages.map(seqOf)); return seqs.every(s => s === seqs[0] && s > after); }, { what: `phones to settle (${what})`, timeout: 20000 });
  await until(async () => { const s = await Promise.all(pages.map(state)); return s.every(x => x === s[0]) ? s[0] : false; }, { what: `boards to match (${what})`, timeout: 8000 });
}
const myTurn = p => p.evaluate(() => onlineMyTurn());
async function step(pages, actor, fn, what){ const at = await seqOf(actor); await fn(); await inSync(pages, what, at); }
// answers for the current board, from the page's own data
const answer = (p, kind) => p.evaluate(kind => {
  if (G.q.open){ // a letter board: any player with (or, for a wrong answer, without) the right surname letter
    const fits = n => G.q.open.fits(n);
    return [...PLP.keys()].find(n => fits(n) === (kind !== "wrong") && !G.guessed.has(n) && !Object.values(G.slotName).includes(n));
  }
  if (kind === "wrong"){ const on = new Set(G.q.slots.flatMap(s => [s.club, ...(s.alts || [])])); return Object.keys(DICT()).map(a => { const v = DICT()[a]; return v instanceof Set ? [...v][0] : v; }).find(x => !on.has(x) && !G.guessed.has(x)); }
  const open = G.q.slots.map((s, i) => [s, i]).filter(([s, i]) => G.foundBy[i] === undefined);
  const [s] = open[0]; return s.pool ? s.alts.find(a => !(G.poolUsed[s.pool] || []).includes(a) && !G.guessed.has(a)) : s.club;
}, kind);

// plays the whole game through each phone's own buttons, checking the boards match after every move
async function playThrough(pages, host, { plan = ["right", "wrong", "right", "pass"], onMove } = {}){
  let moves = 0, checks = 0;
  for (let guard = 0; guard < 400; guard++){
    if (await visible(host, "#end")) break;
    if (await visible(host, "#intro") && await visible(host, "#introBtn")){
      for (const p of pages) if (p !== host){ assert(!(await visible(p, "#introBtn")), `${p.label} shouldn't get the reveal button`); assert(await visible(p, "#introWait"), `${p.label} should see the waiting note`); }
      const at = await seqOf(host); await host.click("#introBtn"); await inSync(pages, "reveal", at); checks++; continue;
    }
    if (await visible(host, "#roundEnd") && await visible(host, "#nextBtn")){
      for (const p of pages) if (p !== host) await until(() => visible(p, "#roundWait"), { what: `${p.label} round-end note` });
      const at = await seqOf(host); await host.click("#nextBtn");
      await until(async () => (await visible(host, "#end")) || (await visible(host, "#intro")), { what: "next round or full time" });
      if (await visible(host, "#end")) break;
      await inSync(pages, "next round", at); checks++; continue;
    }
    let mover = null;
    for (const p of pages) if (await myTurn(p)){ mover = p; break; }
    if (!mover){ await new Promise(r => setTimeout(r, 150)); continue; }
    for (const p of pages) if (p !== mover){
      assert(await p.evaluate(() => document.getElementById("guessArea").classList.contains("watching")), `${p.label} should be watching`);
      assert(!(await myTurn(p)), `only one phone can have the turn`);
    }
    const kind = plan[moves % plan.length]; moves++;
    if (onMove) await onMove(mover, moves);
    const at = await seqOf(mover);
    if (kind === "pass") await mover.click("#passBtn");
    else { const a = await answer(mover, kind); await mover.fill("#guessInput", a); await mover.click("#lockBtn"); }
    await inSync(pages, `move ${moves}`, at); checks++;
  }
  for (const p of pages) await shown(p, "end", 30000);
  return { moves, checks };
}
const skipTrophies = async pages => { for (const p of pages) await p.click("#winTrophy").catch(() => {}); };

await test("online: invite link and code joins update every phone's lobby live, up to 4 players", async () => {
  const craig = await open("Craig"); await signUp(craig, "Craig", "craig1@example.com");
  const code = await hostGame(craig);
  assert(/^[A-Z2-9]{5}$/.test(code), `game code ${code}`);
  await everyoneSees([craig], ["Craig"]);
  assert(await craig.isDisabled("#lobbyStart"), "can't start alone");
  eq(await craig.textContent("#lobbyStart"), "Waiting for players to join");
  eq(await craig.$$eval("#lobbyList .lobbyrow.empty", e => e.length), 3, "three open places");

  const aiden = await open("Aiden"); await joinByLink(aiden, code, "Aiden");
  await everyoneSees([craig, aiden], ["Craig", "Aiden"]);
  eq(await craig.textContent("#lobbyStart"), "Start game with 2 players");
  assert(!(await visible(aiden, "#lobbyStart")), "only the host gets the start button");
  eq(await aiden.textContent("#lobbyWait"), "Waiting for Craig to start the game…");

  const emma = await open("Emma"); await guestTo(emma); await shown(emma, "setup");
  await emma.click("#onlineBtn"); await shown(emma, "onlineGo");
  await emma.fill("#onlineName", "Emma"); await emma.fill("#joinCode", code.toLowerCase()); await emma.click("#joinBtn");
  await shown(emma, "lobbyRoom");
  await everyoneSees([craig, aiden, emma], ["Craig", "Aiden", "Emma"]);

  const dup = await open("Aiden two"); await joinByLink(dup, code, "Aiden");
  await everyoneSees([craig, aiden, emma, dup], ["Craig", "Aiden", "Emma", "Aiden 2"]);
  eq(await craig.textContent("#lobbyStart"), "Start game with 4 players");

  const late = await open("Late"); await guestTo(late); await shown(late, "setup");
  await late.click("#onlineBtn"); await late.fill("#onlineName", "Late"); await late.fill("#joinCode", code); await late.click("#joinBtn");
  await until(async () => (await late.textContent("#lobbyMsg")) === "That game is full (4 players).", { what: "full message" });

  await late.fill("#joinCode", "ZZZZZ"); await late.click("#joinBtn");
  await until(async () => (await late.textContent("#lobbyMsg")).startsWith("There's no game with that code"), { what: "no such game message" });

  // host removes a player; a player leaves
  await craig.click('#lobbyList .kick[aria-label="Remove Aiden 2"]');
  await until(async () => (await dup.textContent("#lobbyMsg")) === "You're no longer in that game.", { what: "removed player's message" });
  await everyoneSees([craig, aiden, emma], ["Craig", "Aiden", "Emma"]);
  await emma.click("#lobbyLeave"); await shown(emma, "onlineGo");
  await everyoneSees([craig, aiden], ["Craig", "Aiden"]);
  await closeAll(craig, aiden, emma, dup, late);
});

await test("online: a 3-player game plays through on every phone with matching boards after every move", async () => {
  const craig = await open("Craig"); await signUp(craig, "Craig", "craig2@example.com");
  const code = await hostGame(craig, { rounds: 3, cat: "pl" });
  const aiden = await open("Aiden"); await joinByLink(aiden, code, "Aiden");
  const emma = await open("Emma"); await joinByLink(emma, code, "Emma");
  const all = [craig, aiden, emma];
  await everyoneSees(all, ["Craig", "Aiden", "Emma"]);
  await craig.click("#lobbyStart");
  for (const p of all) await shown(p, "intro");
  await inSync(all, "start");
  eq(await aiden.evaluate(() => [cfg.rounds, cfg.cats, cfg.count]), [3, ["pl"], 3], "joiners use the host's settings");
  // the host can change the question; everyone gets the new one
  const before = JSON.parse(await state(aiden)).q;
  await step(all, craig, () => craig.click("#refreshBtn"), "question change");
  const after = JSON.parse(await state(aiden));
  assert(after.q !== before && after.refresh === 2, "everyone should get the replacement question");
  const { moves, checks } = await playThrough(all, craig);
  assert(moves >= 6, `expected a real game, got ${moves} moves`);
  const labels = await Promise.all(all.map(p => p.textContent("#winnerLabel")));
  assert(labels.every(l => l === labels[0]), `every phone should agree on the result: ${labels.join(" | ")}`);
  const finals = await Promise.all(all.map(p => p.evaluate(() => G.players.map(x => x.score))));
  assert(finals.every(f => JSON.stringify(f) === JSON.stringify(finals[0])), "final scores match");
  // stats: the signed-in host's go to their account; guests keep their own on their phone
  await until(async () => (await serverUser("craig2@example.com")).played === 1, { what: "host's account stats" });
  const craigScore = await craig.evaluate(() => G.players.find(p => p.uid === ONLINE.me).score);
  eq(await craig.evaluate(() => NET.stats.points), craigScore, "account points match Craig's score");
  const aidenLocal = await aiden.evaluate(() => Object.keys(loadStats()));
  eq(aidenLocal, ["aiden"], "a guest's phone records only its own player");
  await skipTrophies(all);
  assert(!(await visible(aiden, "#againBtn")), "only the host can start another game");
  eq(await aiden.textContent("#setupBtn"), "Leave game");
  console.log(`    (${moves} moves, ${checks} sync checks)`);
  await closeAll(...all);
});

await test("online: a club record scorers board drawn at random on the host is the same board on every phone", async () => {
  const craig = await open("Craig"); await guestTo(craig); await shown(craig, "setup");
  const code = await hostGame(craig, { rounds: 3, cat: "pl" });
  const aiden = await open("Aiden"); await joinByLink(aiden, code, "Aiden");
  const all = [craig, aiden];
  await everyoneSees(all, ["Craig", "Aiden"]);
  await craig.evaluate(() => { window.pickQuestion = () => drawClubRec(Q.find(x => x.id === "pl-club-rec-1")); });
  await craig.click("#lobbyStart");
  for (const p of all) await shown(p, "intro");
  await inSync(all, "start");
  const boards = await Promise.all(all.map(p => p.evaluate(() => [G.q.id, G.q.slots.map(s => s.label + ":" + s.club)])));
  assert(/^pl-club-rec-1:[\d.]+$/.test(boards[0][0]), "a drawn board: " + boards[0][0]);
  eq(boards[1], boards[0], "both phones built the same ten clubs");
  const { moves } = await playThrough(all, craig);
  assert(moves >= 4, `expected a real game, got ${moves} moves`);
  await skipTrophies(all);
  await closeAll(...all);
});

await test("online: the host's ticked competitions and All levels apply on every phone", async () => {
  const craig = await open("Craig"); await guestTo(craig); await shown(craig, "setup");
  eq(await craig.evaluate(() => cfg.allLevels), true, "All levels is on by default");
  const code = await hostGame(craig, { rounds: 3, cat: ["wc", "euro"] });
  const aiden = await open("Aiden");
  await aiden.evaluate(() => localStorage.setItem("tenaball-setup", JSON.stringify({ v: 2, cats: ["pl"], allLevels: false }))); // Aiden's own phone has it off
  await joinByLink(aiden, code, "Aiden");
  const all = [craig, aiden];
  await everyoneSees(all, ["Craig", "Aiden"]);
  const set = await aiden.textContent("#lobbySet");
  assert(set.includes("International only") && set.includes("All levels"), "the lobby shows the host's settings: " + set);
  await craig.click("#lobbyStart");
  for (const p of all) await shown(p, "intro");
  await inSync(all, "start");
  eq(await aiden.evaluate(() => [cfg.cats, cfg.allLevels]), [["wc", "euro"], true]);
  const cats = new Set();
  await playThrough(all, craig, { onMove: async p => { cats.add(await p.evaluate(() => G.q.cat)); } });
  assert([...cats].every(c => c === "wc" || c === "euro"), "only ticked competitions: " + [...cats].join(", "));
  await skipTrophies(all);
  await closeAll(...all);
});

await test("online: moves sent out of turn are ignored by every phone", async () => {
  const craig = await open("Craig"); await guestTo(craig); await shown(craig, "setup");
  const code = await hostGame(craig);
  const aiden = await open("Aiden"); await joinByLink(aiden, code, "Aiden");
  await everyoneSees([craig, aiden], ["Craig", "Aiden"]);
  await craig.click("#lobbyStart"); await shown(craig, "intro"); await inSync([craig, aiden], "start");
  await step([craig, aiden], craig, () => craig.click("#introBtn"), "reveal");
  const who = await craig.evaluate(() => G.players[G.turn].name);
  const cheat = who === "Craig" ? aiden : craig;
  const before = await state(craig);
  const right = await answer(cheat, "right");
  await cheat.evaluate(a => onlineSend("guess", { name: a }), right); // bypasses the turn check in the UI
  await inSync([craig, aiden], "after stray move", 3);
  eq(await state(craig), before, "the board is unchanged");
  await closeAll(craig, aiden);
});

await test("online: a player who reloads mid-game catches up to the same board", async () => {
  const craig = await open("Craig"); await guestTo(craig); await shown(craig, "setup");
  const code = await hostGame(craig, { rounds: 3 });
  const aiden = await open("Aiden"); await joinByLink(aiden, code, "Aiden");
  const emma = await open("Emma"); await joinByLink(emma, code, "Emma");
  const all = [craig, aiden, emma];
  await everyoneSees(all, ["Craig", "Aiden", "Emma"]);
  await craig.click("#lobbyStart"); await shown(craig, "intro"); await inSync(all, "start");
  let reloaded = false;
  await playThrough(all, craig, { onMove: async (mover, n) => {
    if (n === 5 && !reloaded){
      reloaded = true;
      await inSync(all, "before reload");
      const want = await state(craig);
      await emma.reload();
      await shown(emma, "game", 20000);
      await inSync(all, "after reload");
      eq(await state(emma), want, "Emma's board after reloading");
    }
  } });
  assert(reloaded, "the reload happened");
  await closeAll(...all);
});

await test("online: when the shot clock runs out, that player loses a life on every phone", async () => {
  const craig = await open("Craig"); await guestTo(craig); await shown(craig, "setup");
  const code = await hostGame(craig, { clock: 15 });
  const aiden = await open("Aiden"); await joinByLink(aiden, code, "Aiden");
  await everyoneSees([craig, aiden], ["Craig", "Aiden"]);
  await craig.click("#lobbyStart"); await shown(craig, "intro"); await inSync([craig, aiden], "start");
  await step([craig, aiden], craig, () => craig.click("#introBtn"), "reveal");
  const t = await craig.evaluate(() => G.turn);
  await until(async () => (await craig.evaluate(t => G.players[t].lives, t)) === 2, { what: "the clock to run out", timeout: 30000 });
  await inSync([craig, aiden], "after timeout");
  eq(await aiden.evaluate(t => G.players[t].lives, t), 2, "the other phone agrees");
  assert((await craig.evaluate(() => G.turn)) !== t, "the turn moved on");
  await closeAll(craig, aiden);
});

await test("online: the host can skip a player who has gone quiet without costing a life, but a pass costs one", async () => {
  const craig = await open("Craig"); await guestTo(craig); await shown(craig, "setup");
  const code = await hostGame(craig);
  const aiden = await open("Aiden"); await joinByLink(aiden, code, "Aiden");
  await everyoneSees([craig, aiden], ["Craig", "Aiden"]);
  await craig.click("#lobbyStart"); await shown(craig, "intro"); await inSync([craig, aiden], "start");
  await step([craig, aiden], craig, () => craig.click("#introBtn"), "reveal");
  if (await myTurn(craig)) await step([craig, aiden], craig, async () => { await craig.fill("#guessInput", await answer(craig, "right")); await craig.click("#lockBtn"); }, "host scores");
  assert(await myTurn(aiden), "it's Aiden's turn");
  assert(await visible(craig, "#skipBtn"), "the host sees Skip turn");
  assert(!(await visible(aiden, "#skipBtn")), "other players don't");
  await step([craig, aiden], craig, () => craig.click("#skipBtn"), "skip");
  eq(await aiden.evaluate(() => [G.players[1].lives, G.players[G.turn].name]), [3, "Craig"], "no life lost, back to Craig");
  // a pass is different: it costs a life, on every phone
  await step([craig, aiden], craig, () => craig.click("#passBtn"), "Craig passes");
  eq(await aiden.evaluate(() => [G.players[0].lives, G.players[G.turn].name]), [2, "Aiden"], "Craig loses a life and Aiden is up");
  eq(await craig.evaluate(() => G.players[0].lives), 2, "same on Craig's phone");
  await closeAll(craig, aiden);
});

await test("online: Play again takes everyone back to the lobby and a second game starts cleanly", async () => {
  const craig = await open("Craig"); await guestTo(craig); await shown(craig, "setup");
  const code = await hostGame(craig, { rounds: 3 });
  const aiden = await open("Aiden"); await joinByLink(aiden, code, "Aiden");
  await everyoneSees([craig, aiden], ["Craig", "Aiden"]);
  await craig.click("#lobbyStart"); await shown(craig, "intro"); await inSync([craig, aiden], "start");
  await playThrough([craig, aiden], craig, { plan: ["right"] });
  await skipTrophies([craig, aiden]); await craig.waitForTimeout(1500);
  await craig.click("#againBtn");
  for (const p of [craig, aiden]) await shown(p, "lobbyRoom");
  await everyoneSees([craig, aiden], ["Craig", "Aiden"]);
  await craig.click("#lobbyStart"); await shown(aiden, "intro"); await inSync([craig, aiden], "second game");
  eq(await aiden.evaluate(() => [ONLINE.game, G.round, G.players.map(x => x.score)]), [2, 1, [0, 0]], "a fresh game 2");
  await step([craig, aiden], craig, () => craig.click("#introBtn"), "second game reveal");
  await closeAll(craig, aiden);
});

await test("online: when the host ends the game, everyone else is told", async () => {
  const craig = await open("Craig"); await guestTo(craig); await shown(craig, "setup");
  const code = await hostGame(craig);
  const aiden = await open("Aiden"); await joinByLink(aiden, code, "Aiden");
  await everyoneSees([craig, aiden], ["Craig", "Aiden"]);
  await craig.click("#lobbyStart"); await shown(aiden, "intro"); await inSync([craig, aiden], "start");
  await step([craig, aiden], craig, () => craig.click("#introBtn"), "reveal");
  await craig.click("#exitBtn"); await shown(craig, "setup");
  await until(async () => (await aiden.textContent("#lobbyMsg")) === "The host ended the game.", { what: "Aiden's message" });
  assert(await visible(aiden, "#onlineGo"), "Aiden is back at the online menu");
  await closeAll(craig, aiden);
});

await test("online: a phone with a different question set can't join", async () => {
  const r = await fetch(server.url + "/api/rooms", { method: "POST", headers: { "content-type": "application/json", Origin: srv.url.replace(/\/$/, "") },
    body: JSON.stringify({ settings: { rounds: 3 }, ver: "an-older-version", guest: "ab".repeat(16), name: "Old" }) });
  const { code } = await r.json();
  const aiden = await open("Aiden"); await guestTo(aiden); await shown(aiden, "setup");
  await aiden.click("#onlineBtn"); await aiden.fill("#onlineName", "Aiden"); await aiden.fill("#joinCode", code); await aiden.click("#joinBtn");
  await until(async () => (await aiden.textContent("#lobbyMsg")).startsWith("That game is on a different version"), { what: "version message" });
  await closeAll(aiden);
});

await test("online: a phone whose connection drops mid-game reconnects and catches up with the moves it missed", async () => {
  const craig = await open("Craig"); await guestTo(craig); await shown(craig, "setup");
  const code = await hostGame(craig, { rounds: 3 });
  const aiden = await open("Aiden"); await joinByLink(aiden, code, "Aiden");
  await everyoneSees([craig, aiden], ["Craig", "Aiden"]);
  await craig.click("#lobbyStart"); await shown(craig, "intro"); await inSync([craig, aiden], "start");
  await step([craig, aiden], craig, () => craig.click("#introBtn"), "reveal");
  // Aiden's signal drops; while he's away the host gets a move in
  await aiden.evaluate(() => ROOM.ws.close());
  if (!(await myTurn(craig))) await step([craig], craig, () => craig.click("#skipBtn"), "host skips Aiden");
  const at = await seqOf(craig);
  await craig.fill("#guessInput", await answer(craig, "right")); await craig.click("#lockBtn");
  await until(async () => (await seqOf(craig)) > at && await settled(craig), { what: "Craig's move" });
  await inSync([craig, aiden], "Aiden back", at);
  eq(await state(aiden), await state(craig), "same board after reconnecting");
  await closeAll(craig, aiden);
});

// type an answer on a phone in First touch or Beat the clock
const say = async (p, name) => { await p.waitForFunction(() => !G.held || !G.held.length); await p.evaluate(n => { input.value = n; G.pick = n; lockIn(); }, name); }; // after your last answer's scan
const slotAnswer = (p, i) => p.evaluate(i => { const s = G.q.slots[i]; return s.alts ? s.alts[0] : s.club; }, i);
async function liveGame(mode){
  const craig = await open("Craig"); await guestTo(craig); await shown(craig, "setup");
  const code = await hostGame(craig, { rounds: 1, mode, time: 90 });
  const aiden = await open("Aiden"); await joinByLink(aiden, code, "Aiden");
  await everyoneSees([craig, aiden], ["Craig", "Aiden"]);
  await craig.evaluate(() => { window.pickQuestion = () => findQ("pl-top-1992/93"); });
  await craig.click("#lobbyStart"); await shown(craig, "intro"); await inSync([craig, aiden], "start");
  eq(await aiden.evaluate(() => G.mode), mode, "the guest plays the host's mode");
  await step([craig, aiden], craig, () => craig.click("#introBtn"), "reveal");
  await until(() => aiden.evaluate(() => G.phase === "live" && !document.getElementById("guessInput").disabled), { what: "Aiden can answer" });
  return [craig, aiden];
}
await test("online: First touch has both phones answering at once; the room's order decides each claim and the host's time-up ends the round", async () => {
  const [craig, aiden] = await liveGame("first"), all = [craig, aiden];
  const [a, b] = [await slotAnswer(craig, 0), await slotAnswer(craig, 1)];
  const at = await seqOf(craig);
  await Promise.all([say(craig, a), say(aiden, a)]); // the same answer at the same moment: one claims it, the other is too slow
  await inSync(all, "a race for one slot", at + 1);
  const owner = await craig.evaluate(() => G.foundBy[0]);
  assert(owner === 0 || owner === 1, "someone claimed it");
  eq(await craig.evaluate(() => G.players.map(x => x.lives)), [3, 3], "no card for being beaten to it");
  await step(all, aiden, () => say(aiden, b), "Aiden claims another");
  await step(all, craig, () => say(craig, "Barnet"), "a wrong answer");
  eq(await aiden.evaluate(() => G.players.find(x => x.name === "Craig").lives), 2, "Craig's yellow card on Aiden's phone too");
  await step(all, craig, () => craig.evaluate(() => liveTimeUp()), "time up");
  for (const p of all) await until(() => p.evaluate(() => document.getElementById("roundSheet").classList.contains("up")), { what: `${p.label}'s points sheet` });
  eq(await aiden.textContent("#roundSheet .waitpill"), "Waiting for Craig to show the final scores…");
  await craig.click("#sheetNext");
  for (const p of all) await shown(p, "end");
  const finals = await Promise.all(all.map(p => p.evaluate(() => G.players.map(x => x.score))));
  eq(finals[0], finals[1], "final scores match");
  await closeAll(...all);
});
await test("online: Beat the clock keeps everyone's own board, shows others' finds as name pills, and agrees on the results", async () => {
  const [craig, aiden] = await liveGame("clock"), all = [craig, aiden];
  const [a, b] = [await slotAnswer(craig, 0), await slotAnswer(craig, 1)];
  await step(all, aiden, () => say(aiden, a), "Aiden finds one");
  eq(await craig.evaluate(() => document.querySelector("#tower .slot .upill").textContent), "Aiden", "Craig sees Aiden's name pill, not the answer");
  await step(all, craig, () => say(craig, a), "Craig finds the same one");
  await step(all, craig, () => say(craig, b), "and one on his own");
  await step(all, craig, () => craig.evaluate(() => liveTimeUp()), "time up");
  eq(await aiden.evaluate(() => G.players.map(x => x.score)), [3, 1], "1 for the shared find, 2 for the lone one");
  eq(await aiden.$$eval("#tower .res .hd span", e => e.map(x => x.textContent).slice(2)), ["Cr", "You"]);
  await closeAll(...all);
});
await test("online: the host can change the mode in the lobby, and taking turns starts with the same shuffled order on every phone", async () => {
  const craig = await open("Craig"); await guestTo(craig); await shown(craig, "setup");
  const code = await hostGame(craig, { mode: "first" });
  const aiden = await open("Aiden"); await joinByLink(aiden, code, "Aiden");
  await everyoneSees([craig, aiden], ["Craig", "Aiden"]);
  await until(async () => (await aiden.textContent("#lobbySet")).startsWith("First touch"), { what: "the mode in the lobby" });
  assert(!(await visible(aiden, "#lobbyMode")), "only the host can change it");
  await craig.click('#lobbyMode [data-mode="turns"]');
  await until(async () => (await aiden.textContent("#lobbySet")).startsWith("Take turns"), { what: "the new mode on Aiden's phone" });
  await craig.click("#lobbyStart"); await shown(craig, "intro"); await inSync([craig, aiden], "start");
  eq(await aiden.evaluate(() => G.players.map(x => x.name)), await craig.evaluate(() => G.players.map(x => x.name)), "the same order of play");
  await closeAll(craig, aiden);
});

await browser.close(); await server.stop(); await srv.close();
report();
