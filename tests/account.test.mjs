// Email and PIN accounts in the real game, against a local copy of the Tenaball server.
import { serve, launch, phone as makePhone, startServer, until, visible, TEST_SECRETS } from "./lib.mjs";
import { test, assert, eq, report } from "./harness.mjs";

const site = await serve(5184);
const origin = site.url.replace(/\/$/, "");
const srv = await startServer({ port: 8791, origins: [origin] });
const browser = await launch();
const open = async (name, opts = {}) => { const p = await makePhone(browser, name, { server: opts.offline ? null : srv.url, ...opts }); await p.goto(site.url); await p.waitForFunction(() => document.readyState === "complete"); return p; };
const shown = (p, id, timeout) => until(() => visible(p, "#" + id), { what: `${p.label} to show #${id}`, timeout });
const acct = p => p.evaluate(() => { drawAcct(); return [...document.querySelectorAll("#acct *")].filter(e => !e.children.length).map(e => e.textContent.trim()).join(" "); });
const closeAll = async (...ps) => { const errs = ps.flatMap(p => p.errors); for (const p of ps) await p.ctx.close(); assert(!errs.length, errs.join("\n")); };
async function signUp(p, name, email, pin = "2468"){
  await shown(p, "login"); await p.click("#tabUp");
  await p.fill("#signName", name); await p.fill("#signEmail", email); await p.fill("#signPin", pin); await p.fill("#signPin2", pin);
  await p.click("#authBtn"); await shown(p, "setup");
}
async function signIn(p, email, pin){ await shown(p, "login"); await p.click("#tabIn"); await p.fill("#signEmail", email); await p.fill("#signPin", pin); await p.click("#authBtn"); }
const serverStats = async email => {
  const r = await fetch(srv.url + "/api/admin/find", { method: "POST", headers: { "content-type": "application/json", Origin: srv.url }, body: JSON.stringify({ password: TEST_SECRETS.ADMIN_PASSWORD, q: email }) });
  return (await r.json()).users[0];
};
const finishGame = (p, players) => p.evaluate(pl => { cfg.count = pl.length; G = { players: pl.map(([n, s], i) => ({ name: n, score: s, lives: 3, color: `var(--p${i+1})` })), round: 3, picked: new Set(), refreshLeft: 3 }; endGame(); }, players);

await test("account: without a server address the game opens on the home screen, with no sign-in or online options", async () => {
  const p = await open("offline", { offline: true });
  await shown(p, "setup");
  for (const id of ["login", "onlineBtn", "acct"]) assert(!(await visible(p, "#" + id)), `#${id} should stay hidden`);
  await closeAll(p);
});
await test("account: a first visit offers sign in, create account and guest; the name and second PIN only show when creating", async () => {
  const p = await open("first");
  await shown(p, "login");
  for (const id of ["signEmail", "signPin", "authBtn", "guestBtn", "pinNote"]) assert(await visible(p, "#" + id), `#${id} visible`);
  for (const id of ["signName", "signPin2"]) assert(!(await visible(p, "#" + id)), `#${id} hidden when signing in`);
  eq(await p.textContent("#pinNote"), "Forgotten your PIN? Ask Craig to reset it.");
  await p.click("#tabUp");
  for (const id of ["signName", "signPin2"]) assert(await visible(p, "#" + id), `#${id} shown when creating`);
  assert(!(await visible(p, "#pinNote")), "no forgotten PIN note when creating");
  eq(await p.getAttribute("#signPin", "inputmode"), "numeric", "a number keypad on phones");
  await p.fill("#signPin", "a1b2"); eq(await p.inputValue("#signPin"), "12", "only digits");
  await p.fill("#signPin", "123456"); eq(await p.inputValue("#signPin"), "1234", "at most 4");
  await closeAll(p);
});
await test("account: creating an account checks the details, then signs in and names you player 1", async () => {
  const p = await open("craig"); await shown(p, "login"); await p.click("#tabUp");
  const tryIt = async (name, email, pin, pin2, want) => { await p.fill("#signName", name); await p.fill("#signEmail", email); await p.fill("#signPin", pin); await p.fill("#signPin2", pin2); await p.click("#authBtn");
    await until(async () => (await p.textContent("#authMsg")) === want, { what: `message "${want}"` }); };
  await tryIt("", "craig@example.com", "2468", "2468", "Enter your name so other players know who you are.");
  await tryIt("Craig", "", "2468", "2468", "Enter your email.");
  await tryIt("Craig", "craig@example.com", "246", "246", "Your PIN is 4 digits.");
  await tryIt("Craig", "craig@example.com", "2468", "2469", "Those PINs don't match. Type the same 4 digits twice.");
  await tryIt("Craig", "craig@", "2468", "2468", "That email address doesn't look right.");
  await p.fill("#signEmail", "craig@example.com"); await p.click("#authBtn"); await shown(p, "setup");
  await until(async () => (await acct(p)).includes("Name Craig ›"), { what: "account line" });
  eq(await p.inputValue("#nameFields input"), "Craig", "player 1 box");
  const other = await open("dup"); await shown(other, "login"); await other.click("#tabUp");
  await other.fill("#signName", "Craig 2"); await other.fill("#signEmail", "CRAIG@example.com"); await other.fill("#signPin", "1111"); await other.fill("#signPin2", "1111"); await other.click("#authBtn");
  await until(async () => (await other.textContent("#authMsg")) === "There's already an account with that email. Sign in instead.", { what: "email in use" });
  await closeAll(p, other);
});
await test("account: you stay signed in, a wrong PIN says how many tries are left, and 5 lock the account", async () => {
  const a = await open("a"); await signUp(a, "Lock", "lock@example.com", "1357");
  await a.reload(); await shown(a, "setup");
  assert((await acct(a)).includes("Name Lock ›"), "still signed in after reopening");
  assert(!(await visible(a, "#login")), "no sign-in screen for a returning player");
  const b = await open("b");
  for (let i = 1; i <= 4; i++){ await signIn(b, "lock@example.com", "0000");
    await until(async () => (await b.textContent("#authMsg")).includes(`${5 - i} ${5 - i === 1 ? "try" : "tries"} left`), { what: `tries left after ${i}` }); }
  await signIn(b, "lock@example.com", "0000");
  await until(async () => (await b.textContent("#authMsg")) === "Too many wrong PINs. This account is locked for 15 minutes.", { what: "locked" });
  await signIn(b, "lock@example.com", "1357");
  await until(async () => (await b.textContent("#authMsg")).startsWith("Too many wrong PINs. This account is locked for"), { what: "still locked with the right PIN" });
  await closeAll(a, b);
});
await test("account: signing out goes back to the sign-in screen; guests go straight to the home screen next time", async () => {
  const p = await open("out"); await signUp(p, "Leaver", "leaver@example.com");
  await p.click('[data-view="acct"]'); await p.click("#acctOut"); await shown(p, "login");
  await p.reload(); await shown(p, "login");
  await p.click("#guestBtn"); await shown(p, "setup");
  assert((await acct(p)).includes("Playing as a guest"), "guest line");
  await p.reload(); await shown(p, "setup");
  await p.click('[data-view="acct"]'); await p.click("#acctIn"); await shown(p, "login");
  await closeAll(p);
});
await test("account: stats follow you to another phone", async () => {
  const phoneA = await open("phone A"); await signUp(phoneA, "Aiden", "aiden@example.com", "1234");
  await finishGame(phoneA, [["Aiden", 14], ["Craig", 9]]);
  await until(async () => (await serverStats("aiden@example.com")).played === 1, { what: "the result on the server" });
  await phoneA.click("#winTrophy").catch(() => {});
  await until(async () => (await phoneA.textContent("#podium")).includes("Saved to your account."), { what: "saved note" });
  eq(await phoneA.evaluate(() => Object.keys(loadStats())), ["craig"], "the phone keeps only the other player's local stats");
  const phoneB = await open("phone B"); await signIn(phoneB, "aiden@example.com", "1234"); await shown(phoneB, "setup");
  eq(await phoneB.evaluate(() => [NET.stats.played, NET.stats.wins, NET.stats.top]), [1, 1, 14], "same stats on the second phone");
  await finishGame(phoneB, [["Aiden", 6], ["Emma", 11]]);
  await until(async () => (await serverStats("aiden@example.com")).played === 2, { what: "second result" });
  await phoneB.click("#winTrophy").catch(() => {});
  await until(async () => (await phoneB.textContent("#podium")).includes("Saved to your account."), { what: "Aiden's panel updated" });
  await phoneA.reload(); await shown(phoneA, "setup");
  await until(() => phoneA.evaluate(() => NET.stats && NET.stats.played === 2), { what: "phone A picks up the new total" });
  await closeAll(phoneA, phoneB);
});
await test("account: a phone's earlier stats for your name can be added to your account when you sign in", async () => {
  const p = await open("merge"); await shown(p, "login"); await p.click("#guestBtn"); await shown(p, "setup");
  await finishGame(p, [["Emma", 12], ["Craig", 8]]); await p.waitForTimeout(400); await p.click("#winTrophy").catch(() => {}); await p.waitForTimeout(1500);
  await finishGame(p, [["Emma", 5], ["Craig", 9]]); await p.waitForTimeout(400); await p.click("#winTrophy").catch(() => {}); await p.waitForTimeout(1500);
  eq(await p.evaluate(() => loadStats().emma.played), 2, "two guest games saved for Emma on this phone");
  await p.click("#setupBtn"); await p.click('[data-view="acct"]'); await p.click("#acctIn"); await p.click("#tabUp");
  await p.fill("#signName", "Emma"); await p.fill("#signEmail", "emma@example.com"); await p.fill("#signPin", "5555"); await p.fill("#signPin2", "5555"); await p.click("#authBtn");
  await shown(p, "setup");
  const asked = await p.evaluate(() => window.__asked || []);
  assert(asked.some(d => d === "This phone has 2 games saved for Emma. Add them to your account?"), `asked: ${asked.join(" | ")}`);
  const s = await serverStats("emma@example.com");
  eq(s.played, 2, "added to the account");
  eq(await p.evaluate(() => "emma" in loadStats()), false, "and taken off the phone so they aren't counted twice");
  await closeAll(p);
});
await test("account: a result from a game played offline is saved to the account once the phone is back online", async () => {
  const p = await open("offline game"); await signUp(p, "Offline", "offline@example.com");
  await p.ctx.setOffline(true);
  await finishGame(p, [["Offline", 21]]); await p.click("#winTrophy").catch(() => {});
  await until(async () => (await p.textContent("#podium")).includes("Offline: this game will be added"), { what: "offline note" });
  await p.ctx.setOffline(false);
  eq((await serverStats("offline@example.com")).played, 0, "nothing saved yet");
  await p.reload(); await shown(p, "setup");
  await until(async () => (await serverStats("offline@example.com")).played === 1, { what: "sent after reopening" });
  eq(await p.evaluate(() => localStorage.getItem("tenaball-pending-stats")), "[]", "nothing left waiting");
  await closeAll(p);
});
await test("account: when the admin resets a PIN, the player's phone goes back to the sign-in screen and the new PIN works", async () => {
  const p = await open("reset"); await signUp(p, "Forgetful", "forget@example.com", "1234");
  const { id } = await serverStats("forget@example.com");
  await fetch(srv.url + "/api/admin/pin", { method: "POST", headers: { "content-type": "application/json", Origin: srv.url }, body: JSON.stringify({ password: TEST_SECRETS.ADMIN_PASSWORD, id, pin: "9753" }) });
  await p.reload(); await shown(p, "login");
  await signIn(p, "forget@example.com", "9753"); await shown(p, "setup");
  assert((await acct(p)).includes("Name Forgetful ›"), "signed in with the new PIN");
  await closeAll(p);
});
await test("account: you can change your name by tapping it", async () => {
  const p = await makePhone(browser, "rename", { server: srv.url }); await p.goto(site.url);
  await signUp(p, "Old", "rename@example.com");
  await p.evaluate(() => { window.TENABALL_ASK_VALUE = "New Name"; });
  await p.click('[data-view="acct"]'); await p.click("#acctName");
  await until(async () => (await acct(p)).includes("Name New Name ›"), { what: "new name" });
  eq(await p.inputValue("#nameFields input"), "New Name", "player 1 follows the new name");
  eq((await serverStats("rename@example.com")).name, "New Name");
  await closeAll(p);
});

await browser.close(); await srv.stop(); await site.close();
report();
