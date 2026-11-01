// DROP2TOP's leaderboard routes on the real server code, run locally with an empty database: results by run id (a repeat
// never counts twice), a phone's old records merged once, the tables with the rows round the player, a guest told where
// they would sit, and the home page's positions.
import { startServer, TEST_SECRETS } from "./lib.mjs";
import { test, assert, eq, report } from "./harness.mjs";

const ORIGIN = "http://127.0.0.1:5199";
const srv = process.env.D2T_SERVER ? { url: process.env.D2T_SERVER, stop: async () => {} } : await startServer({ port: 8789, origins: [ORIGIN] });
let ipN = 0; const freshIp = () => `10.1.0.${++ipN}`;
async function api(path, body = {}, { token, ip = "10.9.9.9" } = {}){
  const r = await fetch(srv.url + "/api" + path, { method: "POST", headers: { "content-type": "application/json", Origin: ORIGIN, "CF-Connecting-IP": ip, ...(token ? { Authorization: "Bearer " + token } : {}) }, body: JSON.stringify(body) });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}
const signup = async (name, email) => (await api("/signup", { name, email, pin: "1234" }, { ip: freshIp() })).body.token;
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const classic = (rid, finish, o = {}) => ({ game: "classic", rec: { rid, club: "Derby", season: "2007/08", finish, histFinish: 20, pts: 70, histPts: 11, at: Date.now(), ...o } });
const daily = (rid, finish, goes = 1) => ({ game: "daily", rec: { rid, date: today, club: "Bolton", season: "1995/96", finish, histFinish: 20, pts: 60, histPts: 29, goes, at: Date.now() } });

const tom = await signup("toffee_tom", "tom@example.com"), lauren = await signup("LaurenB", "lauren@example.com"), deano = await signup("deano", "deano@example.com");

await test("d2t server: a result needs a sign-in, is checked, and a repeat never counts twice", async () => {
  eq((await api("/d2t/result", classic("run1", 1))).status, 401);
  eq((await api("/d2t/result", { game: "classic", rec: { rid: "bad", club: "Derby", season: "x", finish: 1 } }, { token: tom })).status, 400, "nonsense is refused");
  eq((await api("/d2t/result", { game: "moon", rec: {} }, { token: tom })).status, 400, "a game that is not one");
  const r = await api("/d2t/result", classic("run1", 1), { token: tom });
  eq([r.status, r.body.added, r.body.games.classic.titles, r.body.pos.classic], [200, 1, 1, { pos: 1, count: 1 }]);
  const again = await api("/d2t/result", classic("run1", 1), { token: tom });
  eq([again.body.added, again.body.games.classic.seasons], [0, 1], "the same run id again adds nothing");
  await api("/d2t/result", classic("run2", 5), { token: tom });
  eq((await api("/d2t/me", {}, { token: tom })).body.games.classic, { pos: 1, count: 1 });
});
await test("d2t server: a phone's old records merge once, in one call, and the tables rank everyone", async () => {
  const m = await api("/d2t/merge", { results: [classic("old:1", 1, { club: "Burnley", season: "2009/10", histPts: 30 }), classic("old:2", 2), classic("old:3", 1, { histPts: 25 }), { game: "goal", rec: { rid: "carry:phone1", carry: true, games: 23, exact: 2, best: 4 } }, { game: "nope", rec: {} }] }, { token: deano });
  eq([m.body.added, m.body.refused, m.body.games.classic.titles, m.body.games.goal.games], [4, 1, 2, 23]);
  eq((await api("/d2t/merge", { results: [classic("old:1", 1), classic("old:2", 2)] }, { token: deano })).body.added, 0, "sent again: nothing doubles");
  await api("/d2t/result", classic("l1", 3), { token: lauren });
  const b = (await api("/d2t/board", { game: "classic", tab: "all" }, { token: lauren })).body;
  eq(b.cols, ["Seasons", "Titles", "Top 3"]); eq(b.sort, 1); eq(b.count, 3);
  eq(b.rows.map(r => r.gap ? "…" : `${r.pos} ${r.name} ${r.v.join("/")}`), ["1 deano 3/2/3", "2 toffee_tom 2/1/1", "3 LaurenB 1/0/1"]);
  eq(b.me, { pos: 3, name: "LaurenB", v: [1, 0, 1], me: true });
  eq(b.trophy, { title: "The hardest title", who: "toffee_tom", val: "Derby", what: "Won the league with Derby 2007/08 (11 pts for real)" });
  eq((await api("/d2t/board", { game: "goal", tab: "all" })).body.rows, [{ pos: 1, name: "deano", v: [23, 2, "-"], me: false }], "carried Goal Rush totals count");
});
await test("d2t server: the Daily today: every go counts, the best of the day ranks, the first champion holds the trophy", async () => {
  await api("/d2t/result", daily("d:tom:1", 4, 1), { token: tom });
  await api("/d2t/result", daily("d:lauren:1", 1, 1), { token: lauren });
  await api("/d2t/result", daily("d:tom:2", 1, 2), { token: tom });
  const b = (await api("/d2t/board", { game: "daily", tab: "today" }, { token: tom })).body;
  eq(b.rows.map(r => `${r.pos} ${r.name} ${r.v.join("/")}`), ["1 LaurenB 1/1st/+19", "2 toffee_tom 2/1st/+19"], "level on the finish, fewer goes first");
  eq(b.trophy.who, "LaurenB"); assert(/Bolton champions at \d\d:\d\d, on the 1st go/.test(b.trophy.what), b.trophy.what);
  const all = (await api("/d2t/board", { game: "daily", tab: "all" }, { token: tom })).body;
  eq(all.rows[0].v, [1, 1, "+19"]); eq(all.trophy.title, "Most Daily wins");
  eq((await api("/d2t/board", { game: "classic", tab: "week" }, { token: deano })).body.trophy.what.slice(0, 18), "2 titles this week");
});
await test("d2t server: a guest can read every table and is told where their phone's numbers would sit, nothing stored", async () => {
  const g = (await api("/d2t/board", { game: "classic", tab: "all", mine: [classic("x", 1).rec, classic("y", 1).rec, classic("z", 1).rec] })).body;
  eq([g.signedIn, g.you, g.me], [false, { pos: 1, v: [3, 3, 3] }, null]);
  eq((await api("/d2t/board", { game: "classic", tab: "all" })).body.you, null, "nothing played: no row");
  eq((await api("/d2t/board", { game: "classic", tab: "all" })).body.count, 3, "the guest was not added");
  eq((await api("/d2t/board", { game: "ub", tab: "week" })).body, { game: "ub", tab: "week", cols: ["Runs", "Best run", "Average"], sort: 1, signedIn: false, name: null, rows: [], me: null, count: 0, you: null, trophy: null }, "an empty table");
  eq((await api("/d2t/me", {})).body, { signedIn: false, games: {} });
});
await test("d2t server: Club X, Goal Rush and Unbeaten tables and positions", async () => {
  const x = (n, finish, pts) => ({ game: "clubx", rec: { rid: "x:" + n, careerId: "car", career: n, season: "2012/13", club: "Kirk United", finish, pts, w: 30, d: 5, l: 3, gf: 90, ga: 20, at: Date.now() } });
  await api("/d2t/merge", { results: [x(1, 1, 90), x(2, 1, 104), x(3, 2, 80)] }, { token: deano });
  const xb = (await api("/d2t/board", { game: "clubx", tab: "season" }, { token: deano })).body;
  eq(xb.rows[0].v, [104, 30, "+70"]); eq(xb.trophy.what, "104 points with Kirk United, season 2");
  eq((await api("/d2t/board", { game: "clubx", tab: "all" }, { token: deano })).body.trophy.what, "2 titles in a row with Kirk United");
  await api("/d2t/merge", { results: [{ game: "goal", rec: { rid: "g1", shape: "433", total: 433, at: Date.now() } }, { game: "goal", rec: { rid: "g2", shape: "541", total: 560, at: Date.now() } }] }, { token: lauren });
  const gb = (await api("/d2t/board", { game: "goal", tab: "today" }, { token: lauren })).body;
  eq(gb.rows[0], { pos: 1, name: "LaurenB", v: [2, 1, 0], me: true }); eq(gb.trophy.title, "First spot on today"); assert(/^Spot on 433 at/.test(gb.trophy.what));
  await api("/d2t/merge", { results: [{ game: "ub", rec: { rid: "u1", stat: "cg", run: 41, at: Date.now() } }, { game: "ub", rec: { rid: "u2", stat: "pts", run: 3, at: Date.now() } }, { game: "ub", rec: { rid: "carry:p", carry: true, runs: 10, best: { w: 9 } } }] }, { token: tom });
  const ub = (await api("/d2t/board", { game: "ub", tab: "all" }, { token: tom })).body;
  eq(ub.rows[0].v, [12, 41, "22.0"]); eq(ub.trophy.what, "41 in a row on career goals");
  const me = (await api("/d2t/me", {}, { token: deano })).body.games;
  eq([me.classic.pos, me.clubx, me.goal.pos, me.ub, me.daily], [1, { pos: 1, count: 1 }, 1, null, null], "2 spot on in 23 games ranks above 1 in 2");
});
await test("d2t server: a long table sends the top ten and the rows round the player", async () => {
  const toks = []; for (let i = 0; i < 14; i++) toks.push(await signup("p" + i, `p${i}@example.com`));
  for (let i = 0; i < 14; i++) await api("/d2t/result", { game: "ub", rec: { rid: "r", stat: "cg", run: 50 - i, at: Date.now() } }, { token: toks[i] });
  const b = (await api("/d2t/board", { game: "ub", tab: "all" }, { token: toks[13] })).body;
  eq(b.count, 15); eq(b.me.pos, 15);
  eq(b.rows.map(r => r.gap ? "…" : r.pos), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "…", 13, 14, 15]);
  eq((await api("/d2t/board", { game: "ub", tab: "all" }, { token: toks[2] })).body.rows.length, 11, "in the top ten: the ten and a gap");
});
await test("d2t server: the admin page counts accounts, who has used DROP2TOP and the automatic sign-ins, names only", async () => {
  eq((await api("/d2t/adopted", {})).status, 401, "an automatic sign-in needs the token it adopted");
  const kim = await signup("KimW", "kim@example.com");
  eq((await api("/d2t/adopted", {}, { token: kim })).status, 200);
  await api("/d2t/me", {}, { token: kim });
  const d = (await api("/admin/d2t", { password: TEST_SECRETS.ADMIN_PASSWORD }, { ip: "10.7.7.7" })).body;
  eq([d.adopted, d.adoptedPlayers], [1, 1]);
  assert(d.accounts >= 4 && d.d2t.some(p => p.name === "KimW") && d.d2t.some(p => p.name === "toffee_tom"), "accounts and DROP2TOP players: " + JSON.stringify(d));
  assert(!JSON.stringify(d).includes("@"), "no emails on the DROP2TOP view");
  eq((await api("/admin/d2t", { password: "wrong-password" }, { ip: "10.7.7.8" })).status, 401);
});
await test("d2t server: the backup: signed in only, versioned so two phones never write over each other, results for a phone with nothing", async () => {
  eq((await api("/d2t/backup", {})).status, 401, "signed out");
  const none = (await api("/d2t/backup", { results: true }, { token: tom })).body;
  eq([none.v, none.data], [0, null], "nothing backed up yet");
  assert(none.results.length >= 3 && none.results.every(x => x.game && x.rec && x.rec.rid), "the account's results come with it");
  const p1 = await api("/d2t/backup", { op: "put", base: 0, data: { record: { runs: [{ key: "a" }] } } }, { token: tom });
  eq([p1.status, p1.body.v], [200, 1]);
  const stale = await api("/d2t/backup", { op: "put", base: 0, data: { record: { runs: [] } } }, { token: tom });
  eq([stale.status, stale.body.conflict, stale.body.v, stale.body.data.record.runs.length], [409, true, 1, 1], "a phone behind is told, with the newer copy");
  eq((await api("/d2t/backup", { op: "put", base: 1, data: [] }, { token: tom })).status, 400, "not an object");
  eq((await api("/d2t/backup", { op: "put", base: 1, data: { record: { runs: [{ key: "a" }, { key: "b" }] } } }, { token: tom })).body.v, 2);
  const got = (await api("/d2t/backup", {}, { token: tom })).body;
  eq([got.v, got.data.record.runs.length, got.results], [2, 2, undefined]);
  eq((await api("/d2t/backup", {}, { token: lauren })).body.data, null, "each account its own");
});
await srv.stop();
report();
