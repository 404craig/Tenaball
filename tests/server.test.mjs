// The Tenaball server on its own: accounts, PIN lockout, device limits, stats, the admin tools and online rooms.
// Runs the real server code locally (Cloudflare's own runtime) with an empty database.
import { startServer, until, TEST_SECRETS } from "./lib.mjs";
import { test, assert, eq, report } from "./harness.mjs";

const ORIGIN = "http://127.0.0.1:5199";
const srv = await startServer({ port: 8788, origins: [ORIGIN], vars: { LOCK_MINUTES: "0.05" } }); // a 3 second lock, so the test can wait it out
let ipN = 0; const freshIp = () => `10.0.0.${++ipN}`;
async function api(path, body = {}, { token, ip = "10.9.9.9", origin = ORIGIN } = {}){
  const r = await fetch(srv.url + "/api" + path, { method: "POST", headers: { "content-type": "application/json", Origin: origin, "CF-Connecting-IP": ip, ...(token ? { Authorization: "Bearer " + token } : {}) }, body: JSON.stringify(body) });
  return { status: r.status, body: await r.json().catch(() => ({})), headers: r.headers };
}
const signup = (name, email, pin = "1234", ip) => api("/signup", { name, email, pin }, { ip: ip || freshIp() });
const admin = (path, body = {}, ip = "10.8.8.8") => api("/admin/" + path, { password: TEST_SECRETS.ADMIN_PASSWORD, ...body }, { ip });

// a phone's live connection to a room
function live(code, who){
  const q = new URLSearchParams({ ver: who.ver || "v1", ...(who.token ? { token: who.token } : { guest: who.guest, name: who.name }) });
  const ws = new WebSocket(`${srv.url.replace("http", "ws")}/api/rooms/${code}/live?${q}`, { headers: { Origin: ORIGIN } });
  const c = { ws, msgs: [], closed: null };
  ws.onmessage = e => c.msgs.push(JSON.parse(e.data));
  ws.onclose = e => c.closed = e.code;
  c.send = m => ws.send(JSON.stringify(m));
  c.wait = (pred, what) => until(() => c.msgs.find(pred), { timeout: 5000, every: 20, what });
  c.last = t => [...c.msgs].reverse().find(m => m.t === t);
  c.opened = new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  return c;
}
// a connection the server should turn away before it's opened
async function refusedUpgrade(path){
  const ws = new WebSocket(`${srv.url.replace("http", "ws")}${path}`, { headers: { Origin: ORIGIN } });
  let hello = false; ws.onmessage = () => hello = true;
  const how = await new Promise(res => { ws.onopen = () => res("opened"); ws.onerror = () => res("refused"); });
  try { ws.close(); } catch(e){}
  return how === "refused" && !hello;
}
const guestId = () => [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, "0")).join("");
async function newRoom(host, settings = { rounds: 3, cat: "pl", clock: 0, level: 1, repeat: "all" }){
  const r = await fetch(srv.url + "/api/rooms", { method: "POST", headers: { "content-type": "application/json", Origin: ORIGIN, ...(host.token ? { Authorization: "Bearer " + host.token } : {}) },
    body: JSON.stringify({ settings, ver: host.ver || "v1", ...(host.token ? {} : { guest: host.guest, name: host.name }) }) });
  return { status: r.status, ...(await r.json()) };
}

/* ----- accounts ----- */
await test("server: sign-up checks the name, email and PIN, and stores the email in lower case", async () => {
  eq((await signup("", "a@b.co")).body.error, "Enter your name so other players know who you are.");
  eq((await signup("Craig", "not-an-email")).body.error, "That email address doesn't look right.");
  for (const pin of ["123", "12345", "12a4", ""]) eq((await signup("Craig", "c@x.co", pin)).body.error, "Your PIN must be 4 digits.", `PIN "${pin}"`);
  const r = await signup("  Craig   Wilson ", "  Craig@Example.COM ");
  eq(r.status, 200); eq(r.body.user.email, "craig@example.com"); eq(r.body.user.name, "Craig Wilson");
  assert(/^[a-f0-9]{64}$/.test(r.body.token), "a session token"); eq(r.body.stats.played, 0);
});
await test("server: an email can only be used once, whatever its capitals", async () => {
  await signup("Aiden", "aiden@example.com");
  const r = await signup("Aiden again", "AIDEN@example.com");
  eq([r.status, r.body.error], [409, "There's already an account with that email. Sign in instead."]);
});
await test("server: sign-in with the right PIN works; a wrong PIN says how many tries are left", async () => {
  await signup("Emma", "emma@example.com", "4321");
  const bad = await api("/signin", { email: "emma@example.com", pin: "1111" }, { ip: freshIp() });
  eq([bad.status, bad.body.error], [401, "That email and PIN don't match. 4 tries left before the account is locked for a while."]);
  const ok = await api("/signin", { email: " EMMA@example.com", pin: "4321" }, { ip: freshIp() });
  eq(ok.status, 200); eq(ok.body.user.name, "Emma");
  const nobody = await api("/signin", { email: "nobody@example.com", pin: "1234" }, { ip: freshIp() });
  eq([nobody.status, nobody.body.error], [401, "That email and PIN don't match."], "an unknown email gets the same message");
});
await test("server: 5 wrong PINs lock the account; the right PIN is refused until the lock ends, then works", async () => {
  await signup("Lock", "lock@example.com", "2468");
  let r; for (let i = 0; i < 5; i++) r = await api("/signin", { email: "lock@example.com", pin: "0000" }, { ip: freshIp() });
  eq(r.status, 423); assert(r.body.error.startsWith("Too many wrong PINs. This account is locked"), r.body.error);
  const blocked = await api("/signin", { email: "lock@example.com", pin: "2468" }, { ip: freshIp() });
  eq(blocked.status, 423, "right PIN while locked");
  await new Promise(res => setTimeout(res, 3300));
  eq((await api("/signin", { email: "lock@example.com", pin: "2468" }, { ip: freshIp() })).status, 200, "after the lock");
  eq((await api("/signin", { email: "lock@example.com", pin: "0000" }, { ip: freshIp() })).body.error, "That email and PIN don't match. 4 tries left before the account is locked for a while.", "the count starts again");
});
await test("server: one device guessing across many accounts is stopped after 20 wrong tries", async () => {
  const ip = freshIp(); let r;
  for (let i = 0; i < 20; i++) r = await api("/signin", { email: `guess${i}@example.com`, pin: "1234" }, { ip });
  r = await api("/signin", { email: "emma@example.com", pin: "4321" }, { ip });
  eq([r.status, r.body.error], [429, "Too many wrong tries from this device. Wait a while and try again."]);
  eq((await api("/signin", { email: "emma@example.com", pin: "4321" }, { ip: freshIp() })).status, 200, "other devices are unaffected");
});
await test("server: a player stays signed in on two phones at once, and signing out on one leaves the other", async () => {
  const a = (await signup("Two", "two@example.com", "1357")).body.token;
  const b = (await api("/signin", { email: "two@example.com", pin: "1357" }, { ip: freshIp() })).body.token;
  eq((await api("/me", {}, { token: a })).body.user.name, "Two"); eq((await api("/me", {}, { token: b })).body.user.name, "Two");
  await api("/signout", {}, { token: a });
  eq((await api("/me", {}, { token: a })).status, 401); eq((await api("/me", {}, { token: b })).status, 200);
  eq((await api("/me", {}, { token: "f".repeat(64) })).status, 401, "a made-up token");
});
await test("server: stats follow the account to every phone", async () => {
  const a = (await signup("Stats", "stats@example.com", "1111")).body.token;
  const b = (await api("/signin", { email: "stats@example.com", pin: "1111" }, { ip: freshIp() })).body.token;
  await api("/stats", { score: 21 }, { token: a });                                  // a solo game
  await api("/stats", { score: 14, multi: true, won: true, tenables: 1 }, { token: b }); // a win on the other phone
  await api("/stats", { score: 6, multi: true, won: false }, { token: a });            // a loss
  const s = (await api("/me", {}, { token: b })).body.stats;
  eq([s.played, s.multi, s.wins, s.streak, s.best, s.points, s.top, s.tenables], [3, 2, 1, 0, 1, 41, 21, 1]);
  eq((await api("/stats", { score: -3 }, { token: a })).status, 400, "nonsense results are refused");
  eq((await api("/stats", { score: 5 })).status, 401, "signed-out results are refused");
});
await test("server: a phone's own stats can be added to an account once", async () => {
  const t = (await signup("Merge", "merge@example.com")).body.token;
  await api("/stats", { score: 10, multi: true, won: true }, { token: t });
  const r = await api("/stats/merge", { stats: { played: 4, multi: 3, wins: 2, streak: 2, best: 2, points: 40, top: 18, tenables: 1 } }, { token: t });
  eq(r.body.stats, { played: 5, multi: 4, wins: 3, streak: 2, best: 2, points: 50, top: 18, tenables: 1 });
  const odd = await api("/stats/merge", { stats: { played: 1, multi: 9, wins: 99 } }, { token: t });
  eq([odd.body.stats.multi - 4, odd.body.stats.wins - 3], [1, 1], "wins can't exceed games against others");
});
await test("server: a player can change their name", async () => {
  const t = (await signup("Old Name", "rename@example.com")).body.token;
  eq((await api("/name", { name: "  New  Name " }, { token: t })).body.user.name, "New Name");
  eq((await api("/me", {}, { token: t })).body.user.name, "New Name");
  eq((await api("/name", { name: "   " }, { token: t })).status, 400);
});

/* ----- admin ----- */
await test("server: the admin tools need the admin password, and stop guessing after 10 tries", async () => {
  eq((await api("/admin/find", { password: "wrong" }, { ip: "10.7.7.7" })).status, 401);
  for (let i = 0; i < 9; i++) await api("/admin/find", { password: "wrong" + i }, { ip: "10.7.7.7" });
  eq((await api("/admin/find", { password: TEST_SECRETS.ADMIN_PASSWORD }, { ip: "10.7.7.7" })).status, 429, "even the right password waits after 10 wrong ones");
  eq((await admin("find", { q: "" })).status, 200, "another device is fine");
});
await test("server: the admin can find a player, set a new PIN (signing them out everywhere), unlock and delete", async () => {
  const t = (await signup("Forgetful", "forgot@example.com", "1234")).body.token;
  const found = (await admin("find", { q: "FORGOT" })).body.users;
  eq(found.map(u => u.email), ["forgot@example.com"]);
  const id = found[0].id;
  eq((await admin("pin", { id, pin: "12" })).body.error, "The new PIN must be 4 digits.");
  eq((await admin("pin", { id, pin: "8642" })).status, 200);
  eq((await api("/me", {}, { token: t })).status, 401, "signed out everywhere");
  eq((await api("/signin", { email: "forgot@example.com", pin: "1234" }, { ip: freshIp() })).status, 401, "old PIN");
  eq((await api("/signin", { email: "forgot@example.com", pin: "8642" }, { ip: freshIp() })).status, 200, "new PIN");
  for (let i = 0; i < 5; i++) await api("/signin", { email: "forgot@example.com", pin: "0000" }, { ip: freshIp() });
  eq((await admin("find", { q: "forgot" })).body.users[0].locked, true);
  await admin("unlock", { id });
  eq((await admin("find", { q: "forgot" })).body.users[0].locked, false);
  eq((await api("/signin", { email: "forgot@example.com", pin: "8642" }, { ip: freshIp() })).status, 200, "works after unlocking");
  await admin("delete", { id });
  eq((await admin("find", { q: "forgot" })).body.users, []);
  eq((await api("/signin", { email: "forgot@example.com", pin: "8642" }, { ip: freshIp() })).status, 401, "deleted");
});
await test("server: the admin page is served at /admin", async () => {
  const r = await fetch(srv.url + "/admin"); const html = await r.text();
  eq(r.status, 200); assert(html.includes("<title>Tenaball admin</title>") && html.includes("Set new PIN"), "admin page");
  eq(r.headers.get("x-frame-options"), "DENY");
});
await test("server: only the game's own address can use the server", async () => {
  const bad = await api("/signin", { email: "emma@example.com", pin: "4321" }, { origin: "https://evil.example", ip: freshIp() });
  eq(bad.status, 403);
  const ok = await api("/signin", { email: "emma@example.com", pin: "4321" }, { ip: freshIp() });
  eq(ok.headers.get("access-control-allow-origin"), ORIGIN);
  const pre = await fetch(srv.url + "/api/signin", { method: "OPTIONS", headers: { Origin: ORIGIN, "Access-Control-Request-Method": "POST" } });
  eq(pre.status, 204);
});

/* ----- rooms ----- */
await test("rooms: a host creates a game and friends join over a live connection; everyone sees each join", async () => {
  const craig = { token: (await signup("Craig", "craig.rooms@example.com")).body.token };
  const r = await newRoom(craig);
  eq(r.status, 200); assert(/^[A-HJ-NP-Z2-9]{5}$/.test(r.code), `code ${r.code}`);
  eq(r.room.settings, { rounds: 3, cat: "pl", clock: 0, level: 1, repeat: "all" });
  const h = live(r.code, craig); await h.opened;
  const hello = await h.wait(m => m.t === "hello", "host hello");
  eq(Object.values(hello.room.players).map(p => p.name), ["Craig"]);
  const aiden = live(r.code, { guest: guestId(), name: "Aiden" }); await aiden.opened;
  await h.wait(m => m.t === "room" && Object.keys(m.room.players).length === 2, "host sees Aiden");
  await aiden.wait(m => m.t === "hello", "Aiden's hello");
  eq(aiden.msgs[0].t, "hello", "a newcomer hears who they are before any room news");
  const emma = live(r.code, { guest: guestId(), name: "aiden" }); await emma.opened; // same name as Aiden
  const seen = await h.wait(m => m.t === "room" && Object.keys(m.room.players).length === 3, "host sees the third player");
  eq(Object.values(seen.room.players).sort((a, b) => a.n - b.n).map(p => p.name), ["Craig", "Aiden", "aiden 2"]);
  await aiden.wait(m => m.t === "room" && Object.keys(m.room.players).length === 3, "Aiden sees the third player too");
  for (const c of [h, aiden, emma]) c.ws.close();
});
await test("rooms: full games, started games, unknown codes and old versions are refused with a reason", async () => {
  const host = { guest: guestId(), name: "Host" };
  const { code } = await newRoom(host);
  const conns = [live(code, host)]; for (let i = 0; i < 3; i++) conns.push(live(code, { guest: guestId(), name: "P" + i }));
  await Promise.all(conns.map(c => c.opened)); await conns[0].wait(m => m.t === "room" && Object.keys(m.room.players).length === 4, "4 players");
  const fifth = live(code, { guest: guestId(), name: "Late" });
  eq((await fifth.wait(m => m.t === "refused", "refusal")).why, "full"); await until(() => fifth.closed === 4429, { what: "close code" });
  const old = live(code, { guest: guestId(), name: "Old", ver: "v0" });
  eq((await old.wait(m => m.t === "refused", "refusal")).why, "version");
  const none = live("ZZZZZ", { guest: guestId(), name: "Lost" });
  eq((await none.wait(m => m.t === "refused", "refusal")).why, "notfound");
  conns[0].send({ t: "start", move: { type: "round", data: { qid: "q1" } } });
  await conns[1].wait(m => m.t === "move", "the first move");
  const after = live(code, { guest: guestId(), name: "After" });
  eq((await after.wait(m => m.t === "refused", "refusal")).why, "started");
  assert(await refusedUpgrade(`/api/rooms/${code}/live?ver=v1&guest=${guestId()}`), "a guest needs a name");
  conns.forEach(c => c.ws.close());
});
await test("rooms: only the host can start, remove players or send host moves; players can leave the lobby", async () => {
  const host = { guest: guestId(), name: "Host" }, a = { guest: guestId(), name: "A" }, b = { guest: guestId(), name: "B" };
  const { code } = await newRoom(host);
  const H = live(code, host), A = live(code, a), B = live(code, b); await Promise.all([H.opened, A.opened, B.opened]);
  await H.wait(m => m.t === "room" && Object.keys(m.room.players).length === 3, "3 players");
  A.send({ t: "start", move: { type: "round", data: {} }, ref: "x1" });
  eq((await A.wait(m => m.t === "error" && m.ref === "x1", "error")).msg, "Only the host can start the game.");
  A.send({ t: "kick", pid: "g:" + b.guest, ref: "x2" });
  eq((await A.wait(m => m.t === "error" && m.ref === "x2", "error")).msg, "Only the host can remove players, in the lobby.");
  H.send({ t: "kick", pid: "g:" + b.guest });
  await B.wait(m => m.t === "removed", "B told they were removed"); await until(() => B.closed === 4001, { what: "B disconnected" });
  A.send({ t: "leave" }); await until(() => A.closed === 1000, { what: "A left" });
  await H.wait(m => m.t === "room" && Object.keys(m.room.players).length === 1, "host alone again");
  const A2 = live(code, a); await A2.opened; await H.wait(m => m.t === "room" && Object.keys(m.room.players).length === 2, "A back");
  H.send({ t: "start", move: { type: "round", data: { qid: "q1" } } });
  await A2.wait(m => m.t === "move" && m.move.seq === 1, "the game starts");
  A2.send({ t: "move", type: "reveal", ref: "x3" });
  eq((await A2.wait(m => m.t === "error" && m.ref === "x3", "error")).msg, "That move isn't allowed.");
  A2.send({ t: "move", type: "hack", ref: "x4" });
  eq((await A2.wait(m => m.t === "error" && m.ref === "x4", "error")).msg, "That move isn't allowed.");
  [H, A2].forEach(c => c.ws.close());
});
await test("rooms: moves are numbered in one order for everyone, and a phone that reconnects gets the whole list", async () => {
  const host = { token: (await signup("Mover", "mover@example.com")).body.token }, a = { guest: guestId(), name: "A" };
  const { code } = await newRoom(host);
  const H = live(code, host), A = live(code, a); await Promise.all([H.opened, A.opened]);
  await H.wait(m => m.t === "room" && Object.keys(m.room.players).length === 2, "2 players");
  H.send({ t: "start", move: { type: "round", data: { qid: "q1" } } });
  const start = await A.wait(m => m.t === "room" && m.room.status === "playing", "playing");
  eq(start.room.order.length, 2);
  H.send({ t: "move", type: "reveal" });
  // both send at once: the room puts them in a single order
  A.send({ t: "move", type: "guess", data: { name: "Arsenal" }, ref: "a" }); H.send({ t: "move", type: "pass", ref: "h" });
  await until(() => H.msgs.filter(m => m.t === "move").length === 4 && A.msgs.filter(m => m.t === "move").length === 4, { what: "4 moves each" });
  const seqH = H.msgs.filter(m => m.t === "move").map(m => [m.move.seq, m.move.type]), seqA = A.msgs.filter(m => m.t === "move").map(m => [m.move.seq, m.move.type]);
  eq(seqH, seqA, "same order on both phones"); eq(seqH.map(x => x[0]), [1, 2, 3, 4]);
  eq(A.msgs.find(m => m.t === "move" && m.move.type === "guess").move.uid, "g:" + a.guest, "moves carry who sent them");
  A.ws.close(); await until(() => A.closed !== null, { what: "A dropped" });
  const A2 = live(code, a); await A2.opened;
  const hello = await A2.wait(m => m.t === "hello", "hello on reconnect");
  eq(hello.moves.map(m => [m.seq, m.type]), seqH, "the full move list comes back");
  [H, A2].forEach(c => c.ws.close());
});
await test("rooms: Play again returns everyone to the lobby for a fresh game 2; the host closing ends it for all", async () => {
  const host = { guest: guestId(), name: "Host" }, a = { guest: guestId(), name: "A" };
  const { code } = await newRoom(host);
  const H = live(code, host), A = live(code, a); await Promise.all([H.opened, A.opened]);
  await H.wait(m => m.t === "room" && Object.keys(m.room.players).length === 2, "2 players");
  H.send({ t: "start", move: { type: "round", data: { qid: "q1" } } }); H.send({ t: "move", type: "next" });
  await A.wait(m => m.t === "move" && m.move.seq === 2, "two moves");
  H.send({ t: "again" });
  const back = await A.wait(m => m.t === "room" && m.room.status === "lobby" && m.room.game === 2, "back in the lobby");
  eq([back.room.seq, Object.keys(back.room.players).length], [0, 2]);
  H.send({ t: "start", move: { type: "round", data: { qid: "q9" } } });
  const first = await A.wait(m => m.t === "move" && m.game === 2, "game 2's first move");
  eq([first.move.seq, first.move.data.qid], [1, "q9"]);
  H.send({ t: "close" });
  eq((await A.wait(m => m.t === "closed", "closed")).reason, "The host ended the game.");
  await until(() => A.closed === 4000, { what: "A disconnected" });
  const late = live(code, a); eq((await late.wait(m => m.t === "refused", "refusal")).why, "notfound", "the room is gone");
});
await test("rooms: a signed-in player joins with their account name, and a bad session is refused", async () => {
  const host = { guest: guestId(), name: "Host" }, { code } = await newRoom(host);
  const H = live(code, host); await H.opened;
  const t = (await signup("Account Name", "acct.room@example.com")).body.token;
  const P = live(code, { token: t }); await P.opened;
  const m = await H.wait(m => m.t === "room" && Object.keys(m.room.players).length === 2, "joined");
  assert(Object.values(m.room.players).some(p => p.name === "Account Name"), "account name used");
  assert(await refusedUpgrade(`/api/rooms/${code}/live?ver=v1&token=${"a".repeat(64)}`), "a made-up session is refused");
  [H, P].forEach(c => c.ws.close());
});

await srv.stop();

await test("server: without its secrets the server refuses to create accounts rather than storing weak PINs", async () => {
  const bare = await startServer({ port: 8789, origins: [ORIGIN], vars: { PIN_SECRET: "", ADMIN_PASSWORD: "" } });
  try {
    const r = await fetch(bare.url + "/api/signup", { method: "POST", headers: { "content-type": "application/json", Origin: ORIGIN }, body: JSON.stringify({ name: "A", email: "a@b.co", pin: "1234" }) });
    eq([r.status, (await r.json()).error], [503, "The server isn't set up yet (PIN_SECRET is missing)."]);
    const a = await fetch(bare.url + "/api/admin/find", { method: "POST", headers: { "content-type": "application/json", Origin: ORIGIN }, body: JSON.stringify({ password: "anything" }) });
    eq(a.status, 503);
  } finally { await bare.stop(); }
});

report();
