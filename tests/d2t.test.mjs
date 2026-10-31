// DROP2TOP's leaderboards, the pure part (server/src/d2t.js): results are checked, folded per player, ranked and sliced,
// and the trophy card names the right record and holder. The routes are covered in server.test.mjs.
import { cleanResult, resultKeys, aggregate, rank, slice, placeOf, trophy, onTable, ukDay, ukTime, weekStart, validDay, BOARDS, TABS } from "../server/src/d2t.js";
import { test, assert, eq, report } from "./harness.mjs";

const NOW = Date.parse("2026-10-31T14:05:00Z"); // a Saturday, 14:05 UK (GMT)
const at = (h, d = 0) => Date.parse("2026-10-31T00:00:00Z") + d * 864e5 + h * 3600e3;
const daily = (o = {}) => cleanResult("daily", { rid: "daily:" + Math.random(), date: "2026-10-31", club: "Bolton", season: "1995/96", finish: 4, histFinish: 20, pts: 60, histPts: 29, goes: 1, at: at(9), ...o }, NOW);
const classic = (o = {}) => cleanResult("classic", { rid: "c:" + Math.random(), club: "Derby", season: "2007/08", finish: 1, histFinish: 20, pts: 80, histPts: 11, at: at(10), ...o }, NOW);
const clubx = (o = {}) => cleanResult("clubx", { rid: "x:" + Math.random(), careerId: "car1", career: 1, season: "2012/13", club: "Hollow Rovers", finish: 1, pts: 90, w: 28, d: 6, l: 4, gf: 80, ga: 30, at: at(10), ...o }, NOW);
const goal = (o = {}) => cleanResult("goal", { rid: "g:" + Math.random(), shape: "433", total: 433, at: at(8.7), ...o }, NOW);
const ub = (o = {}) => cleanResult("ub", { rid: "u:" + Math.random(), stat: "cg", run: 12, at: at(11), ...o }, NOW);

await test("d2t: dates are UK dates, the week starts on Monday", () => {
  eq(ukDay(Date.parse("2026-07-01T23:30:00Z")), "2026-07-02", "British Summer Time");
  eq(ukDay(Date.parse("2026-12-01T23:30:00Z")), "2026-12-01");
  eq(ukTime(Date.parse("2026-07-01T08:41:00Z")), "09:41");
  eq(weekStart("2026-10-31"), "2026-10-26"); eq(weekStart("2026-10-26"), "2026-10-26"); eq(weekStart("2026-11-01"), "2026-10-26");
  assert(validDay("2026-10-31") && !validDay("2026-02-30") && !validDay("31/10/2026"), "a day is checked");
});
await test("d2t: a result is checked and clamped, and the rise is worked out, never trusted", () => {
  const d = daily({ finish: 99, rise: 50, pts: -4, goes: 0 });
  eq([d.finish, d.rise, d.pts, d.goes], [24, -4, 0, 1]);
  eq(daily({ date: "2026-11-01" }), null, "a Daily from tomorrow");
  eq(daily({ date: "2026-10-10" }), null, "a Daily from before the first one");
  eq(cleanResult("goal", { rid: "g1", shape: "4-3-3", total: 400 }, NOW), null, "a shape the game has not got");
  eq(goal({ total: 441 }).gap, 8); eq(goal({ shape: "352", total: 352 }).target, 352);
  eq(cleanResult("ub", { rid: "u1", stat: "xx", run: 5 }, NOW), null, "a stat the game has not got");
  eq(cleanResult("classic", { rid: "bad id!", club: "Derby", season: "2007/08", finish: 1 }, NOW), null, "a run id with odd characters");
  eq(cleanResult("classic", { rid: "c1", club: "Derby", season: "200708", finish: 1 }, NOW), null, "a season that is not one");
  const x = clubx({ w: 40, d: 10, l: 10 }); eq([x.w, x.d, x.l], [40, 6, 0], "wins, draws and losses never add up to more than 46");
  const c = cleanResult("goal", { rid: "carry:abc", carry: true, games: 23, exact: 2, best: 4 }, NOW); eq([c.carry, c.games, c.exact, c.best], [true, 23, 2, 4]);
  eq(cleanResult("classic", { rid: "carry:abc", carry: true }, NOW), null, "Classic keeps every season, so nothing is carried");
  eq(cleanResult("daily", { rid: "d1", date: "2026-10-31", club: "Bolton", season: "1995/96", finish: 1, histFinish: 20, at: NOW + 864e5 }, NOW).at, NOW, "a time from the future is now");
});
await test("d2t: stored keys: the Daily's own date, a title or spot on as a win, a sortable value", () => {
  eq(resultKeys("daily", daily({ finish: 1, date: "2026-10-30" }), NOW), { day: "2026-10-30", win: 1, val: 1 });
  eq(resultKeys("classic", classic(), NOW), { day: "2026-10-31", win: 1, val: 11 });
  eq(resultKeys("goal", goal({ total: 440 }), NOW), { day: "2026-10-31", win: 0, val: 7 });
  eq(resultKeys("ub", ub({ run: 19 }), NOW).val, 19);
});
await test("d2t: a Daily folds by day (the best go counts, goes are the most reported), a carried Goal Rush total adds in", () => {
  const a = aggregate("daily", [daily({ finish: 4, goes: 1 }), daily({ finish: 1, goes: 3 }), daily({ date: "2026-10-30", finish: 9, goes: 2 }), daily({ date: "2026-10-30", finish: 12, goes: 1 })]);
  eq([a.played, a.wins, a.bestRise, a.bestFinish, a.goes], [2, 1, 19, 1, 5]);
  const g = aggregate("goal", [goal({ total: 433 }), goal({ total: 440 }), cleanResult("goal", { rid: "carry:p", carry: true, games: 23, exact: 2, best: 4 }, NOW)]);
  eq([g.games, g.exact, g.closest, Math.round(100 * g.rate)], [25, 3, 0, 12]);
  const u = aggregate("ub", [ub({ run: 12 }), ub({ run: 7, stat: "pts" }), cleanResult("ub", { rid: "carry:p", carry: true, runs: 10, best: { cg: 15, w: 3 } }, NOW)]);
  eq([u.runs, u.best, u.bestStat, u.avg, u.known], [12, 15, "cg", 9.5, 2]);
});
await test("d2t: Club X counts titles in a row within one career, and the best season by points", () => {
  const a = aggregate("clubx", [clubx({ career: 1 }), clubx({ career: 2, pts: 95, w: 30 }), clubx({ career: 3, finish: 2 }), clubx({ career: 4 }), clubx({ careerId: "car2", career: 1, finish: 1, pts: 70 })]);
  eq([a.seasons, a.titles, a.inARow, a.dynasty, a.careers, a.best.pts, a.best.career], [5, 4, 2, "Hollow Rovers", 2, 95, 2]);
  eq(onTable("clubx", aggregate("clubx", [])), false);
});
await test("d2t: ranking puts the most titles first, then top 3s, then fewer seasons, ties by id; a dash row for nobody", () => {
  const P = [
    { uid: "a", name: "gaffer_ali", agg: aggregate("classic", [classic(), classic({ finish: 3 }), classic({ finish: 8 })]) },
    { uid: "b", name: "deano", agg: aggregate("classic", [classic(), classic({ finish: 2 })]) },
    { uid: "c", name: "TashF", agg: aggregate("classic", [classic({ finish: 5 })]) },
    { uid: "d", name: "nobody", agg: aggregate("classic", []) }
  ];
  const r = rank("classic", "all", P);
  eq(r.map(x => x.name + ":" + x.pos), ["deano:1", "gaffer_ali:2", "TashF:3"], "deano: 1 title, 2 top 3s in 2 seasons beats 1 title, 2 top 3s in 3 seasons");
  const s = slice("classic", "all", r, "c", 2, 1);
  eq(s.rows.map(x => x.gap ? "…" : x.name), ["deano", "gaffer_ali", "TashF"], "around the player: no gap when the rows touch");
  eq(s.me.pos, 3); eq(s.count, 3); eq(s.rows[2].v, [1, 0, 0]);
  eq(placeOf("classic", "all", r, aggregate("classic", [classic(), classic()])), 1, "a guest with 2 titles would be top");
  eq(placeOf("classic", "all", r, aggregate("classic", [classic({ finish: 9 })])), 4, "a guest with no title sits under everyone with one");
  eq(placeOf("classic", "all", r, aggregate("classic", [])), null);
});
await test("d2t: a long table's slice is the top ten, a gap, the rows round the player, a gap", () => {
  const P = Array.from({ length: 40 }, (_, i) => ({ uid: "u" + String(i).padStart(2, "0"), name: "p" + i, agg: aggregate("ub", [ub({ run: 40 - i })]) }));
  const s = slice("ub", "all", rank("ub", "all", P), "u22");
  eq(s.rows.filter(r => !r.gap).map(r => r.pos), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 21, 22, 23, 24, 25]);
  eq(s.rows.map(r => r.gap ? "…" : "").filter(Boolean).length, 2); eq(s.me.pos, 23); eq(s.count, 40);
  const top = slice("ub", "all", rank("ub", "all", P), "u03");
  eq(top.rows.length, 11, "a player in the top ten: the ten and one gap"); eq(top.me.pos, 4);
});
await test("d2t: the Daily today ranks by best finish, then fewest goes; Goal Rush today by spot on, then closest", () => {
  const r = rank("daily", "today", [
    { uid: "a", name: "jj", agg: aggregate("daily", [daily({ finish: 1, goes: 1 })]) },
    { uid: "b", name: "lauren", agg: aggregate("daily", [daily({ finish: 1, goes: 2 })]) },
    { uid: "c", name: "kop", agg: aggregate("daily", [daily({ finish: 2, goes: 1 })]) }]);
  eq(r.map(x => x.name), ["jj", "lauren", "kop"]); eq(BOARDS.daily.today.vals(r[1].agg), [2, "1st", "+19"]);
  const g = rank("goal", "today", [
    { uid: "a", name: "near", agg: aggregate("goal", [goal({ total: 436 })]) },
    { uid: "b", name: "spot", agg: aggregate("goal", [goal({ total: 433 }), goal({ total: 500 })]) },
    { uid: "c", name: "far", agg: aggregate("goal", [goal({ total: 300 })]) }]);
  eq(g.map(x => x.name), ["spot", "near", "far"]); eq(BOARDS.goal.today.vals(g[0].agg), [2, 1, 0]);
});
await test("d2t: every game has two tabs, All time first, and every board has three columns", () => {
  for (const [m, tabs] of Object.entries(TABS)){ eq(tabs[0], "all", m); for (const t of tabs){ eq(BOARDS[m][t].cols.length, 3, m + " " + t); assert(BOARDS[m][t].sort >= 0 && BOARDS[m][t].sort <= 2); } }
  eq(TABS.clubx[1], "season"); eq(BOARDS.goal.all.cols[1], "Spot on");
});
await test("d2t: the trophies name the record and its holder, or nobody", () => {
  const dailyAll = rank("daily", "all", [{ uid: "a", name: "toffee_tom", agg: aggregate("daily", [daily({ finish: 1 }), daily({ date: "2026-10-30", finish: 1 }), daily({ date: "2026-10-29", finish: 5 })]) }]);
  eq(trophy("daily", "all", dailyAll), { title: "Most Daily wins", who: "toffee_tom", val: "2", what: "2 league titles from 3 Dailies" });
  eq(trophy("daily", "all", rank("daily", "all", [{ uid: "a", name: "x", agg: aggregate("daily", [daily({ finish: 5 })]) }])), null, "no wins yet: nobody");
  eq(trophy("daily", "today", [], { first: { name: "LaurenB", r: daily({ finish: 1, goes: 2, at: at(9.25) }) } }), { title: "First to win the league today", who: "LaurenB", val: "09:15", what: "Bolton champions at 09:15, on the 2nd go" });
  eq(trophy("daily", "today", [], {}), null);
  eq(trophy("classic", "all", [], { hardest: { name: "deano", r: classic() } }).what, "Won the league with Derby 2007/08 (11 pts for real)");
  const wk = rank("classic", "week", [{ uid: "a", name: "gaffer_ali", agg: aggregate("classic", [classic({ club: "Burnley", season: "2009/10", histFinish: 18, histPts: 30 }), classic({ histPts: 40 })]) }]);
  eq(trophy("classic", "week", wk).what, "2 titles this week, the best Burnley 2009/10 from 18th");
  const x = rank("clubx", "all", [{ uid: "a", name: "kop_kid", agg: aggregate("clubx", [clubx({ career: 1 }), clubx({ career: 2 }), clubx({ career: 3 })]) }, { uid: "b", name: "more", agg: aggregate("clubx", [clubx({ career: 1 }), clubx({ career: 2, finish: 3 }), clubx({ career: 3 }), clubx({ career: 4 }), clubx({ career: 5, finish: 4 }), clubx({ career: 6 })]) }]);
  eq(x[0].name, "more", "most titles tops the table");
  eq(trophy("clubx", "all", x), { title: "The longest dynasty", who: "kop_kid", val: "3", what: "3 titles in a row with Hollow Rovers" }, "the longest run of titles, not the most titles");
  eq(trophy("clubx", "season", rank("clubx", "season", x)).what, "90 points with Hollow Rovers, season 1");
  eq(trophy("goal", "all", rank("goal", "all", [{ uid: "a", name: "jj_saints", agg: aggregate("goal", [goal(), goal({ total: 1 })]) }])).what, "Spot on 1 time in 2 games");
  eq(trophy("goal", "today", [], { first: { name: "jj_saints", r: goal({ at: at(8 + 41 / 60) }) } }).what, "Spot on 433 at 08:41");
  eq(trophy("ub", "all", [], { longest: { name: "LaurenB", r: ub({ run: 41 }) } }).what, "41 in a row on career goals");
  eq(trophy("ub", "week", [], { longest: { name: "kop_kid", r: ub({ run: 23, stat: "pts", at: at(12, -4) }) } }).what, "23 in a row on club points in a season, Tuesday");
  eq(trophy("ub", "week", [], { longest: { name: "x", r: ub({ run: 0 }) } }), null);
});
report();
