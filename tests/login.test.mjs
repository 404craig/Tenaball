// Sign-in screen, accounts and stats saved to an account, driven in a real browser against the Auth and Firestore emulators.
import { serve, launch, phone, resetEmulators, adminGet, until, visible } from "./lib.mjs";
import { test, assert, eq, report } from "./harness.mjs";

const srv = await serve(5174);
const browser = await launch();
const open = async (name, opts) => { const p = await phone(browser, name, opts); await p.goto(srv.url); await p.waitForFunction(() => document.readyState === "complete"); return p; };
const shown = (p, id) => until(() => visible(p, "#" + id), { what: `${p.label} to show #${id}` });
const acctText = p => p.textContent("#acct");
const uidOf = p => p.evaluate(() => NET.user && NET.user.uid);
const done = async (...ps) => { for (const p of ps){ assert(!p.errors.length, p.errors.join("\n")); await p.ctx.close(); } };
// the emulator can't show Google's or Apple's real sign-in window here, so swap the popup for the emulator's test sign-in with the same provider
const fakePopup = (p, sub, email, name) => p.evaluate(([sub, email, name]) => {
  const Au = NET.api.Au;
  NET.api.Au = { ...Au, signInWithPopup: (auth, prov) => {
    window.__popupProvider = prov.providerId; window.__popupScopes = prov.getScopes ? prov.getScopes() : [];
    const token = JSON.stringify({ sub, email, email_verified: true, name });
    const cred = prov.providerId === "google.com" ? Au.GoogleAuthProvider.credential(token) : new Au.OAuthProvider(prov.providerId).credential({ idToken: token });
    return Au.signInWithCredential(auth, cred);
  } };
}, [sub, email, name]);
async function createAccount(p, name, email, pass = "goal123"){
  await shown(p, "login");
  await p.click("#modeBtn"); await p.fill("#signName", name); await p.fill("#signEmail", email); await p.fill("#signPass", pass);
  await p.click("#emailBtn"); await shown(p, "setup");
}

await test("login: without a Firebase config the game opens straight to the home screen, with no sign-in or online options", async () => {
  const p = await open("offline", { firebase: false });
  await shown(p, "setup");
  assert(!(await visible(p, "#login")), "login screen should stay hidden");
  assert(!(await visible(p, "#onlineBtn")), "online button should stay hidden");
  assert(!(await visible(p, "#acct")), "account line should stay hidden");
  await done(p);
});

await test("login: a first visit shows the sign-in screen with Apple, Google, email and guest options", async () => {
  await resetEmulators(); const p = await open("first");
  await shown(p, "login");
  for (const id of ["appleBtn", "googleBtn", "signEmail", "signPass", "emailBtn", "guestBtn"]) assert(await visible(p, "#" + id), `#${id} should be visible`);
  assert(!(await visible(p, "#signName")), "the name box only appears when creating an account");
  await done(p);
});

await test("login: creating an email account signs you in, names you player 1 and saves a profile", async () => {
  await resetEmulators(); const p = await open("craig");
  await createAccount(p, "Craig", "craig@example.com");
  await until(async () => (await acctText(p)).includes("Signed in as Craig"), { what: "account line" });
  eq(await p.evaluate(() => cfg.names[0]), "Craig", "player 1 name");
  eq(await p.inputValue("#nameFields input"), "Craig", "player 1 box");
  const prof = await until(async () => adminGet(`users/${await uidOf(p)}`), { what: "profile document" });
  eq(prof.name, "Craig", "profile name");
  await done(p);
});

await test("login: helpful messages for a short password, a wrong password and an email already in use", async () => {
  await resetEmulators(); const a = await open("a");
  await createAccount(a, "Craig", "craig@example.com"); await done(a);
  const p = await open("b"); await shown(p, "login");
  await p.fill("#signEmail", "craig@example.com"); await p.fill("#signPass", "123"); await p.click("#emailBtn");
  eq(await p.textContent("#authMsg"), "Use at least 6 characters for your password.");
  await p.fill("#signPass", "wrongpass"); await p.click("#emailBtn");
  await until(async () => (await p.textContent("#authMsg")) === "That email and password don't match.", { what: "wrong password message" });
  await p.click("#modeBtn"); await p.fill("#signName", "Craig"); await p.fill("#signPass", "another1"); await p.click("#emailBtn");
  await until(async () => (await p.textContent("#authMsg")).startsWith("There's already an account with that email"), { what: "email in use message" });
  await p.click("#modeBtn"); await p.fill("#signPass", "goal123"); await p.click("#emailBtn");
  await shown(p, "setup");
  await done(p);
});

await test("login: forgot password sends a reset email", async () => {
  await resetEmulators(); const a = await open("a"); await createAccount(a, "Craig", "craig@example.com"); await done(a);
  const p = await open("b"); await shown(p, "login");
  await p.click("#forgotBtn"); eq(await p.textContent("#authMsg"), "Enter your email above, then tap Forgot password.");
  await p.fill("#signEmail", "craig@example.com"); await p.click("#forgotBtn");
  await until(async () => (await p.textContent("#authMsg")).startsWith("Check your email"), { what: "reset message" });
  const codes = await (await fetch("http://127.0.0.1:9099/emulator/v1/projects/demo-tenaball/oobCodes")).json();
  assert(codes.oobCodes.some(c => c.email === "craig@example.com" && c.requestType === "PASSWORD_RESET"), "a reset email should have been sent");
  await done(p);
});

await test("login: signed-in players go straight to the home screen next time, and can sign out", async () => {
  await resetEmulators(); const p = await open("craig"); await createAccount(p, "Craig", "craig@example.com");
  await p.reload(); await shown(p, "setup");
  await until(async () => (await acctText(p)).includes("Signed in as Craig"), { what: "still signed in after reload" });
  assert(!(await visible(p, "#login")), "no sign-in screen for a returning player");
  await p.click("#acctOut"); await shown(p, "login");
  await p.reload(); await shown(p, "login");
  await done(p);
});

await test("login: guests go to the home screen and aren't asked to sign in again", async () => {
  await resetEmulators(); const p = await open("guest"); await shown(p, "login");
  await p.click("#guestBtn"); await shown(p, "setup");
  assert((await acctText(p)).includes("Playing as a guest"), "guest account line");
  await p.reload(); await shown(p, "setup");
  assert(!(await visible(p, "#login")), "guests skip the sign-in screen");
  await p.click("#acctIn"); await shown(p, "login");
  await done(p);
});

await test("login: Continue with Google signs in with the Google provider and uses the Google name", async () => {
  await resetEmulators(); const p = await open("google"); await shown(p, "login");
  await until(() => p.evaluate(() => !!NET.api), { what: "Firebase to load" });
  await fakePopup(p, "g-123", "aiden@gmail.com", "Aiden"); await p.click("#googleBtn");
  await shown(p, "setup");
  eq(await p.evaluate(() => window.__popupProvider), "google.com");
  await until(async () => (await acctText(p)).includes("Signed in as Aiden"), { what: "Google name" });
  eq((await adminGet(`users/${await uidOf(p)}`)).name, "Aiden");
  await done(p);
});

await test("login: Continue with Apple signs in with the Apple provider and asks for name and email", async () => {
  await resetEmulators(); const p = await open("apple"); await shown(p, "login");
  await until(() => p.evaluate(() => !!NET.api), { what: "Firebase to load" });
  await fakePopup(p, "a-456", "emma@icloud.com", "Emma"); await p.click("#appleBtn");
  await shown(p, "setup");
  eq(await p.evaluate(() => window.__popupProvider), "apple.com");
  eq((await p.evaluate(() => window.__popupScopes)).sort(), ["email", "name"]);
  await until(async () => (await acctText(p)).includes("Signed in as Emma"), { what: "Apple name" });
  await done(p);
});

await test("login: stats from a game on this phone are saved to the signed-in player's account", async () => {
  await resetEmulators(); const p = await open("craig"); await createAccount(p, "Craig", "craig@example.com");
  const uid = await uidOf(p);
  const finish = (scores) => p.evaluate(sc => { cfg.count = 2; G = { players: [{ name: "Craig", score: sc[0], lives: 3, color: "var(--p1)", tenables: 1 }, { name: "Aiden", score: sc[1], lives: 3, color: "var(--p2)" }], round: 3, picked: new Set(), refreshLeft: 3 }; endGame(); }, scores);
  await finish([14, 9]);
  await until(async () => { const u = await adminGet(`users/${uid}`); return u && u.stats && u.stats.played === 1; }, { what: "account stats" });
  let s = (await adminGet(`users/${uid}`)).stats;
  eq([s.played, s.multi, s.wins, s.streak, s.top, s.points, s.tenables], [1, 1, 1, 1, 14, 14, 1], "stats after a win");
  await p.click("#winTrophy").catch(() => {});
  await until(async () => (await p.textContent("#podium")).includes("Saved to your account."), { what: "saved note on the final table" });
  await p.waitForTimeout(1500); await finish([6, 11]);
  await until(async () => (await adminGet(`users/${uid}`)).stats.played === 2, { what: "second game saved" });
  s = (await adminGet(`users/${uid}`)).stats;
  eq([s.played, s.wins, s.streak, s.best, s.top, s.points], [2, 1, 0, 1, 14, 20], "stats after a loss");
  await done(p);
});

await browser.close(); await srv.close();
report();
