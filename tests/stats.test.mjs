// The stats code shared by the game and the server: the copy in index.html matches server/src/stats.js, and games fold in as expected.
import { readFileSync } from "node:fs";
import { BLANK_STATS, bumpStats, mergeStats, statBuckets, cleanRec, upgradeStats } from "../server/src/stats.js";
import { leagueTable, leagueMoves, cleanLeagueGame, LEAGUE_MIN } from "../server/src/leagues.js";
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
await 
await test("index.html carries the same leagues code as the server", () => {
  const src = readFileSync(new URL("../server/src/leagues.js", import.meta.url), "utf8").replace(/^export /gm, "").trim();
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const a = html.indexOf("/* leagues.js: start */") + "/* leagues.js: start */".length, b = html.indexOf("/* leagues.js: end */");
  eq(html.slice(a, b).trim(), src, "run node scripts/embed-stats.mjs after changing server/src/leagues.js");
});
await test("leagues: each round is a head to head against every other member in the game; draws count half", () => {
  const A = "a".repeat(24), B = "b".repeat(24), C = "c".repeat(24), D = "d".repeat(24);
  const members = [{ id: A, name: "Craig" }, { id: B, name: "Phil" }, { id: C, name: "Aiden" }, { id: D, name: "Mum" }];
  const g = (at, w, p) => cleanLeagueGame({ at, w, p });
  const games = [
    g(1, A, [{ u: A, s: 9, r: [5, 4], b: [1, 0, 0] }, { u: B, s: 6, r: [3, 3], b: [1, 0, 0] }, { u: C, s: 4, r: [3, 1] }]),
    g(2, B, [{ u: A, s: 2, r: [2, 0, 0] }, { u: B, s: 7, r: [2, 5, 0] }, { u: "e".repeat(24), s: 9, r: [9, 0, 0] }]) // a non-member's results don't count
  ];
  const t = leagueTable(games, members);
  const row = id => [...t.ranked, ...t.rest].find(x => x.id === id);
  eq([row(A).p, row(A).w, row(A).rw, row(A).rd, row(A).rl], [2, 1, 4, 2, 1], "Craig: 2 played, 1 won; rounds 4-2-1");
  eq([row(B).p, row(B).w, row(B).rw, row(B).rd, row(B).rl], [2, 1, 2, 3, 2], "Phil: rounds 2-3-2");
  eq([row(C).rw, row(C).rd, row(C).rl], [0, 1, 3], "Aiden: rounds 0-1-3");
  eq(row(A).form, "WWDLD", "Craig's form, oldest first: beat both, beat both, level, beaten, level");
  eq(row(A).pct, Math.round(100 * 5 / 7), "rounds %: draws count half");
  eq(row(A).b, [1, 0, 0], "boards completed in the league");
  eq(row(D).p, 0, "Mum hasn't played");
  eq(t.ranked.map(x => x.name), ["Craig", "Phil"], "5 head to heads to be ranked once anyone has 5");
  eq(t.rest.map(x => x.name), ["Aiden", "Mum"]);
  const early = leagueTable(games.slice(0, 1), members);
  eq(early.ranked.map(x => x.name), ["Craig", "Phil", "Aiden"], "until anyone has 5, everyone who has played is ranked");
  const gm = leagueTable(games, members, { kind: "games" });
  eq(gm.ranked.map(x => [x.name, x.pct]), [["Craig", 50], ["Phil", 50]], "games %, level on games won goes to rounds won");
  eq(leagueTable(games, members, { since: 2 }).ranked.map(x => x.name), ["Phil", "Craig"], "a time filter leaves earlier games out");
  assert(LEAGUE_MIN === 5);
});
await test("leagues: the line at full time says what the game did to the table", () => {
  const A = "a".repeat(24), B = "b".repeat(24), C = "c".repeat(24), members = [{ id: A, name: "Craig" }, { id: B, name: "Phil" }, { id: C, name: "Aiden" }];
  const g = (at, ...r) => cleanLeagueGame({ at, p: r.map(([u, x]) => ({ u, r: x })) });
  const before = leagueTable([g(1, [B, [5, 5, 5]], [A, [1, 1, 1]], [C, [0, 0, 0]])], members);
  const after = leagueTable([g(1, [B, [5, 5, 5]], [A, [1, 1, 1]], [C, [0, 0, 0]]), g(2, [A, [9, 9, 9, 9, 9]], [B, [0, 0, 0, 0, 0]])], members);
  eq(leagueMoves(before, after, [A, B]), "Craig up to 1st · Phil down to 2nd");
  eq(leagueMoves(leagueTable([], members), before, [A, B, C]), "Phil in at 1st · Craig in at 2nd · Aiden in at 3rd");
});
await test("leagues: a reported game is checked: unknown ids, repeats and silly numbers are dropped or clamped", () => {
  const A = "a".repeat(24);
  const g = cleanLeagueGame({ at: 5, w: "nobody", p: [{ u: A, s: 99999, r: [1, 500, -3], b: [9, 1] }, { u: A, s: 1 }, { u: "x", s: 1 }, null] });
  eq(g, { at: 5, w: null, p: [{ u: A, s: 1000, r: [1, 100, 0], b: [7, 1, 0] }] });
});
report();
