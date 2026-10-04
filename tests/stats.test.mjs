// The stats code shared by the game and the server: the copy in index.html matches server/src/stats.js, and games fold in as expected.
import { readFileSync } from "node:fs";
import { BLANK_STATS, bumpStats, mergeStats, statBuckets, cleanRec, upgradeStats } from "../server/src/stats.js";
import { test, assert, eq, report } from "./harness.mjs";

await test("index.html carries the same stats code as the server", () => {
  const src = readFileSync(new URL("../server/src/stats.js", import.meta.url), "utf8").replace(/^export /gm, "").trim();
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const a = html.indexOf("/* stats.js: start */") + "/* stats.js: start */".length, b = html.indexOf("/* stats.js: end */");
  eq(html.slice(a, b).trim(), src, "run node scripts/embed-stats.mjs after changing server/src/stats.js");
});

const round = (o = {}) => ({ cat: "pl", lv: 1, pts: 5, f: 5, o: 3, z: 2, r: 5, w: 1, done: false, ...o });
await test("games against people and TenaBot count towards the win rate; games on your own don't", () => {
  let s = bumpStats(null, { door: "h2h", mode: "turns", people: 1, score: 9, result: "w", rounds: [round()], opp: [{ name: "Aiden", score: 4 }] }, 1);
  s = bumpStats(s, { door: "solo", mode: "first", bots: true, people: 0, score: 3, result: "l", rounds: [round({ f: 3 })], opp: [{ name: "TenaBot", bot: true, score: 8 }] }, 2);
  s = bumpStats(s, { door: "solo", mode: "turns", score: 7, result: "s", rounds: [round({ f: 10, o: 0, z: 0, done: true })] }, 3);
  eq([s.played, s.multi, s.wins, s.points, s.top], [3, 2, 1, 19, 9], "totals");
  eq([s.x.b.all.games, s.x.b.all.people, s.x.b.all.wins], [3, 2, 1], "all filter");
  eq([s.x.b.bot.games, s.x.b.bot.bgames, s.x.b.bot.bwins], [1, 1, 0], "vs TenaBot filter");
  eq(s.x.b.solo.games, 1, "solo only has the game on your own"); eq(s.x.b.first.games, 1, "First touch filter");
  eq(s.x.b.all.comp.pl, [3, 1, 15, 3], "boards, completed, right, wrong per competition");
  eq(s.x.b.first.mostClaims, 3, "most claimed in a round");
  eq(s.x.vs.aiden, { name: "Aiden", w: 1, l: 0, d: 0, t: 1 }, "head to head skips TenaBot");
  eq(s.x.form, "slw", "newest first");
});
await test("bad records are cleaned", () => {
  const r = cleanRec({ door: "moon", score: -5, rounds: Array(20).fill({ f: 99, cat: "PL<>" }), opp: [{ name: "  x  ", uid: "u:zz" }] });
  eq([r.door, r.score, r.rounds.length, r.rounds[0].f, r.rounds[0].cat, r.opp[0].name, r.opp[0].uid], ["solo", 0, 7, 10, "", "x", null]);
  eq(statBuckets({ door: "online", mode: "clock", people: 2 }), ["all", "online", "clock"]);
});
await test("old stats keep their totals and gain the detail from the next game", () => {
  const old = { played: 40, multi: 30, wins: 12, streak: 2, best: 5, points: 400, top: 22, tenables: 3 };
  const s = bumpStats(old, { door: "online", people: 1, score: 10, result: "l", rounds: [round()] });
  eq([s.played, s.multi, s.wins, s.streak, s.x.b.all.games], [41, 31, 12, 0, 1]);
});
await test("merging a phone's stats onto an account adds them up", () => {
  const a = bumpStats(null, { door: "h2h", people: 1, score: 5, result: "w", rounds: [round()], opp: [{ name: "Aiden", score: 2 }] });
  const b = bumpStats({ ...BLANK_STATS, played: 2, points: 9 }, { door: "h2h", people: 1, score: 6, result: "l", rounds: [round({ done: true })], opp: [{ name: "Aiden", score: 8 }] });
  const m = mergeStats(a, b);
  eq([m.played, m.points, m.x.b.all.games, m.x.b.all.done, m.x.vs.aiden.w, m.x.vs.aiden.l], [4, 20, 2, 1, 1, 1]);
});
await test("stats saved before the change pick up their games against TenaBot once", () => {
  const old = { played: 17, multi: 1, wins: 1, streak: 1, best: 1, points: 100, top: 21, tenables: 0,
    x: { b: { all: { games: 2, people: 1, wins: 1, bgames: 1, bwins: 0 }, bot: { games: 1, people: 0, wins: 0, bgames: 1, bwins: 0 } }, vs: {}, form: "lw" } };
  const u = upgradeStats(JSON.parse(JSON.stringify(old)));
  eq([u.multi, u.wins, u.x.b.all.people, u.x.b.bot.people, u.x.v], [2, 1, 2, 1, 2]);
  eq(upgradeStats(u).multi, 2, "only once");
  eq(bumpStats(old, { door: "solo", bots: true, score: 1, result: "l", rounds: [] }).multi, 3, "upgraded before the next game");
});
await report();
