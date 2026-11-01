// DROP2TOP leaderboards (October 2026): one table per game, every signed-in player on it automatically. The phone
// reports each finished game (a Daily go, a Classic season, a Club X season, a Goal Rush game, an Unbeaten run) with a
// run id of its own, so re-sending never counts twice; the server keeps every result and one aggregate per player per
// game with three sortable keys, so a table or a position is one ordered query. This file is the pure part (checking a
// result, folding results into an aggregate, ranking, the trophy and the table's wording); index.js holds the SQL.
// The games are called by their short ids: daily, classic, clubx, goal (Goal Rush) and ub (Unbeaten Run).

export const D2T_MODES = ["daily", "classic", "clubx", "goal", "ub"];
// Guests on the tables (false: signed-in players only, a guest is only told where they would sit; true: a guest's results
// are kept under an automatic name, "Player a1b2", by the random id their phone keeps). One switch, nothing else to change.
export const GUEST_ROWS = false;
export const DAILY_START = "2026-10-11";
const UB_STATS = { cg: "career goals", ca: "career appearances", cas: "career assists", cga: "career goals and assists", sg: "goals in a season", sga: "goals and assists in a season", pts: "club points in a season", w: "club wins in a season", atp: "all-time points" };
const GR_SHAPES = ["442", "433", "451", "352", "343", "424", "532", "541"];
const MAX_RESULTS = 5000; // results kept per player per game

/* ---------- dates: the Daily is the UK date, the week starts on Monday UK time ---------- */
const ukFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, weekday: "long" });
function ukParts(ms){ const p = {}; for (const x of ukFmt.formatToParts(new Date(ms))) p[x.type] = x.value; return p; }
export function ukDay(ms){ const p = ukParts(ms); return `${p.year}-${p.month}-${p.day}`; }
export function ukTime(ms){ const p = ukParts(ms); return `${p.hour === "24" ? "00" : p.hour}:${p.minute}`; }
export function ukWeekday(ms){ return ukParts(ms).weekday; }
export const validDay = d => /^\d{4}-\d{2}-\d{2}$/.test(String(d || "")) && !Number.isNaN(Date.parse(d + "T12:00:00Z")) && ukDay(Date.parse(d + "T12:00:00Z")) === d;
// the Monday of the week a day is in
export function weekStart(day){ const t = Date.parse(day + "T12:00:00Z"), wd = (new Date(t).getUTCDay() + 6) % 7; return new Date(t - wd * 864e5).toISOString().slice(0, 10); }
export const ordinal = n => n + (n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th");
const plural = (n, one, many) => `${n} ${n === 1 ? one : many || one + "s"}`;

/* ---------- one result, checked: anything unexpected is clamped or the result is refused (null) ---------- */
const n = (v, lo, hi) => { v = Math.floor(Number(v)); return Number.isFinite(v) ? Math.max(lo, Math.min(hi, v)) : lo; };
const str = (v, max) => String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, max);
const season = s => /^\d{4}\/\d{2}$/.test(String(s || "")) ? String(s) : null;
export function cleanResult(mode, raw, now = Date.now()){
  if (!D2T_MODES.includes(mode) || !raw || typeof raw !== "object") return null;
  const rid = str(raw.rid, 80); if (!/^[A-Za-z0-9:_./-]{1,80}$/.test(rid)) return null;
  const at = n(raw.at, now - 10 * 365 * 864e5, now) || now;
  const r = { rid, at };
  if (raw.carry){ // totals a phone kept before the tables existed, for the games that keep no list of their results
    if (mode === "goal"){ r.carry = true; r.games = n(raw.games, 0, 100000); r.exact = Math.min(r.games, n(raw.exact, 0, 100000)); r.best = raw.best == null ? null : n(raw.best, 0, 6000); return r; }
    if (mode === "ub"){ r.carry = true; r.runs = n(raw.runs, 0, 100000); r.best = {}; for (const k of Object.keys(UB_STATS)) if (raw.best && raw.best[k] != null) r.best[k] = n(raw.best[k], 0, 1000); return r; }
    return null;
  }
  if (mode === "daily"){
    if (!validDay(raw.date) || raw.date < DAILY_START || raw.date > ukDay(now)) return null;
    r.date = raw.date; r.club = str(raw.club, 40); r.season = season(raw.season); if (!r.club || !r.season) return null;
    r.finish = n(raw.finish, 1, 24); r.histFinish = n(raw.histFinish, 1, 24); r.rise = r.histFinish - r.finish; r.pts = n(raw.pts, 0, 130); r.histPts = n(raw.histPts, 0, 130); r.goes = n(raw.goes, 1, 500);
    return r;
  }
  if (mode === "classic"){
    r.club = str(raw.club, 40); r.season = season(raw.season); if (!r.club || !r.season) return null;
    r.finish = n(raw.finish, 1, 24); r.histFinish = n(raw.histFinish, 1, 24); r.rise = r.histFinish - r.finish; r.pts = n(raw.pts, 0, 130); r.histPts = n(raw.histPts, 0, 130);
    return r;
  }
  if (mode === "clubx"){
    r.careerId = str(raw.careerId, 80) || rid; r.career = n(raw.career, 1, 200); r.season = season(raw.season); if (!r.season) return null;
    r.club = str(raw.club, 20) || "Club X"; r.finish = n(raw.finish, 1, 24); r.pts = n(raw.pts, 0, 130);
    r.w = n(raw.w, 0, 46); r.d = n(raw.d, 0, 46 - r.w); r.l = n(raw.l, 0, 46 - r.w - r.d); r.gf = n(raw.gf, 0, 300); r.ga = n(raw.ga, 0, 300); r.sim = !!raw.sim;
    return r;
  }
  if (mode === "goal"){
    r.shape = String(raw.shape || ""); if (!GR_SHAPES.includes(r.shape)) return null;
    r.target = Number(r.shape); r.total = n(raw.total, 0, 6000); r.gap = Math.abs(r.total - r.target);
    return r;
  }
  if (mode === "ub"){
    r.stat = String(raw.stat || ""); if (!UB_STATS[r.stat]) return null;
    r.run = n(raw.run, 0, 1000);
    return r;
  }
  return null;
}
// the columns the result is stored under: the UK day it belongs to, whether it is a win (a title, spot on) and its
// sortable value (the club-season's real points for a Classic title, points for Club X, the gap for Goal Rush, the run)
export function resultKeys(mode, r, now = Date.now()){
  if (r.carry) return { day: ukDay(r.at), win: 0, val: 0 };
  if (mode === "daily") return { day: r.date, win: r.finish === 1 ? 1 : 0, val: r.finish };
  if (mode === "classic") return { day: ukDay(r.at), win: r.finish === 1 ? 1 : 0, val: r.histPts };
  if (mode === "clubx") return { day: ukDay(r.at), win: r.finish === 1 ? 1 : 0, val: r.pts };
  if (mode === "goal") return { day: ukDay(r.at), win: r.gap === 0 ? 1 : 0, val: r.gap };
  return { day: ukDay(r.at), win: 0, val: r.run };
}

/* ---------- one player's results folded into their aggregate for a game ---------- */
export function aggregate(mode, results){
  const R = results.filter(r => r && !r.carry), C = results.filter(r => r && r.carry);
  if (mode === "daily"){
    const days = {};
    for (const r of R){ const d = days[r.date] || (days[r.date] = { goes: 0, finish: 99, rise: -99, club: r.club }); d.goes = Math.max(d.goes, r.goes); if (r.finish < d.finish || (r.finish === d.finish && r.rise > d.rise)){ d.finish = r.finish; d.rise = r.rise; } }
    const L = Object.values(days);
    return { played: L.length, wins: L.filter(d => d.finish === 1).length, bestRise: L.length ? Math.max(...L.map(d => d.rise)) : null, bestFinish: L.length ? Math.min(...L.map(d => d.finish)) : null, goes: L.reduce((t, d) => t + d.goes, 0) };
  }
  if (mode === "classic"){
    const titles = R.filter(r => r.finish === 1), hard = titles.slice().sort((a, b) => a.histPts - b.histPts || a.at - b.at)[0] || null;
    return { seasons: R.length, titles: titles.length, top3: R.filter(r => r.finish <= 3).length, hardest: hard ? { club: hard.club, season: hard.season, histPts: hard.histPts, histFinish: hard.histFinish } : null };
  }
  if (mode === "clubx"){
    const careers = {};
    for (const r of R) (careers[r.careerId] = careers[r.careerId] || []).push(r);
    let inARow = 0, dyn = null;
    for (const list of Object.values(careers)){
      list.sort((a, b) => a.career - b.career); let run = 0;
      for (const r of list){ run = r.finish === 1 ? run + 1 : 0; if (run > inARow){ inARow = run; dyn = r.club; } }
    }
    const best = R.slice().sort((a, b) => b.pts - a.pts || b.w - a.w || (b.gf - b.ga) - (a.gf - a.ga) || a.at - b.at)[0] || null;
    return { seasons: R.length, titles: R.filter(r => r.finish === 1).length, inARow, dynasty: dyn, careers: Object.keys(careers).length,
      best: best ? { pts: best.pts, w: best.w, gd: best.gf - best.ga, club: best.club, career: best.career, season: best.season } : null };
  }
  if (mode === "goal"){
    const games = R.length + C.reduce((t, c) => t + c.games, 0), exact = R.filter(r => r.gap === 0).length + C.reduce((t, c) => t + c.exact, 0);
    const gaps = R.map(r => r.gap).concat(C.filter(c => c.best != null).map(c => c.best));
    // the average distance from the target, over the games stored one by one (a carry from before the tables has no gaps
    // to give, so it stays out; Craig, 1 Nov: it replaced the hit rate)
    const gapGames = R.length, gapSum = R.reduce((t, r) => t + r.gap, 0);
    return { games, exact, rate: games ? exact / games : 0, closest: gaps.length ? Math.min(...gaps) : null, gapSum, gapGames, avg: gapGames ? gapSum / gapGames : null };
  }
  if (mode === "ub"){
    const best = {}; for (const c of C) for (const [k, v] of Object.entries(c.best || {})) best[k] = Math.max(best[k] || 0, v);
    for (const r of R) best[r.stat] = Math.max(best[r.stat] || 0, r.run);
    const runs = R.length + C.reduce((t, c) => t + c.runs, 0), known = R.length, sum = R.reduce((t, r) => t + r.run, 0);
    const top = Object.entries(best).sort((a, b) => b[1] - a[1])[0] || null;
    return { runs, best: top ? top[1] : 0, bestStat: top ? top[0] : null, avg: known ? sum / known : null, known };
  }
  return {};
}

/* ---------- the tables: columns, the ranking column, what each row shows and the sort keys (bigger is better) ---------- */
const pct = v => `${Math.round(100 * v)}%`;
const sg = v => (v > 0 ? "+" : "") + v;
export const BOARDS = {
  daily: {
    all: { cols: ["Played", "Wins", "Best rise"], sort: 1, keys: a => [a.wins, a.bestRise == null ? -99 : a.bestRise, -a.played], vals: a => [a.played, a.wins, a.bestRise == null ? "-" : sg(a.bestRise)] },
    today: { cols: ["Goes", "Best finish", "Rise"], sort: 1, keys: a => [-(a.bestFinish == null ? 99 : a.bestFinish), -a.goes, a.bestRise == null ? -99 : a.bestRise], vals: a => [a.goes, a.bestFinish == null ? "-" : ordinal(a.bestFinish), a.bestRise == null ? "-" : sg(a.bestRise)] }
  },
  classic: {
    all: { cols: ["Seasons", "Titles", "Top 3"], sort: 1, keys: a => [a.titles, a.top3, -a.seasons], vals: a => [a.seasons, a.titles, a.top3] },
    week: { cols: ["Seasons", "Titles", "Top 3"], sort: 1, keys: a => [a.titles, a.top3, -a.seasons], vals: a => [a.seasons, a.titles, a.top3] }
  },
  clubx: {
    all: { cols: ["Seasons", "Titles", "In a row"], sort: 1, keys: a => [a.titles, a.inARow, -a.seasons], vals: a => [a.seasons, a.titles, a.inARow] },
    season: { cols: ["Points", "Wins", "Goal diff"], sort: 0, keys: a => [a.best ? a.best.pts : -1, a.best ? a.best.w : -1, a.best ? a.best.gd : -999], vals: a => [a.best ? a.best.pts : "-", a.best ? a.best.w : "-", a.best ? sg(a.best.gd) : "-"] }
  },
  goal: {
    // spot on first, then the lower average off target (none counted last), then more games
    all: { cols: ["Games", "Spot on", "Avg off"], sort: 1, keys: a => [a.exact, a.avg == null ? -1e6 : -a.avg, a.games], vals: a => [a.games, a.exact, a.avg == null ? "-" : "±" + Math.round(a.avg)] },
    today: { cols: ["Games", "Spot on", "Closest"], sort: 1, keys: a => [a.exact, -(a.closest == null ? 9999 : a.closest), -a.games], vals: a => [a.games, a.exact, a.closest == null ? "-" : a.closest] }
  },
  ub: {
    all: { cols: ["Runs", "Best run", "Average"], sort: 1, keys: a => [a.best, a.avg == null ? -1 : a.avg, a.runs], vals: a => [a.runs, a.best, a.avg == null ? "-" : a.avg.toFixed(1)] },
    week: { cols: ["Runs", "Best run", "Average"], sort: 1, keys: a => [a.best, a.avg == null ? -1 : a.avg, a.runs], vals: a => [a.runs, a.best, a.avg == null ? "-" : a.avg.toFixed(1)] }
  }
};
export const TABS = { daily: ["all", "today"], classic: ["all", "week"], clubx: ["all", "season"], goal: ["all", "today"], ub: ["all", "week"] };
// a player with nothing to rank (no games, no run) stays off the table
export function onTable(mode, a){
  if (mode === "daily") return a.played > 0;
  if (mode === "classic") return a.seasons > 0;
  if (mode === "clubx") return a.seasons > 0;
  if (mode === "goal") return a.games > 0;
  return a.runs > 0;
}
// the three stored sort keys for the all-time table (one ordered query ranks everyone)
export const rankKeys = (mode, a) => BOARDS[mode].all.keys(a);
// bigger keys first, then the id so ties always come out the same way
export const compare = (a, b) => { for (let i = 0; i < a.keys.length; i++) if (a.keys[i] !== b.keys[i]) return b.keys[i] - a.keys[i]; return a.uid < b.uid ? -1 : a.uid > b.uid ? 1 : 0; };
export function rank(mode, tab, players){
  const spec = BOARDS[mode][tab];
  const rows = players.filter(p => onTable(mode, p.agg)).map(p => ({ uid: p.uid, name: p.name, agg: p.agg, keys: spec.keys(p.agg) })).sort(compare);
  rows.forEach((r, i) => r.pos = i + 1);
  return rows;
}
// where an aggregate would sit on a ranked table (a guest's phone-only numbers), without adding it
export function placeOf(mode, tab, ranked, agg){
  if (!onTable(mode, agg)) return null;
  const me = { uid: "\uffff", keys: BOARDS[mode][tab].keys(agg) };   // level with someone on the table, a guest sits after them
  return 1 + ranked.filter(r => compare(r, me) < 0).length;
}
// the rows a phone is sent: the top of the table and the rows around the player, with a gap marked between them
export function slice(mode, tab, ranked, uid, top = 10, around = 2){
  const spec = BOARDS[mode][tab], row = r => ({ pos: r.pos, name: r.name, v: spec.vals(r.agg), me: r.uid === uid });
  const k = ranked.findIndex(r => r.uid === uid), out = ranked.slice(0, top).map(row);
  if (k >= top){
    const from = Math.max(top, k - around), to = Math.min(ranked.length, k + around + 1);
    if (from > top) out.push({ gap: true });
    ranked.slice(from, to).forEach(r => out.push(row(r)));
    if (to < ranked.length) out.push({ gap: true });
  } else if (ranked.length > top) out.push({ gap: true });
  return { rows: out, me: k >= 0 ? row(ranked[k]) : null, count: ranked.length };
}

/* ---------- the trophy card: the record and its holder, from the ranked table or the results that set it ---------- */
export const TROPHY = {
  daily: { all: "Most Daily wins", today: "First to win the league today" },
  classic: { all: "The hardest title", week: "Most titles this week" },
  clubx: { all: "The longest dynasty", season: "Most points in a season" },
  goal: { all: "Most times spot on", today: "First spot on today" },
  ub: { all: "The record run", week: "Best run this week" }
};
// first: the earliest winning result of the period (daily today, goal today), hardest: the Classic title with the fewest
// real points, longest: the longest Unbeaten run; each { name, r } or null. ranked: the period's table.
export function trophy(mode, tab, ranked, { first = null, hardest = null, longest = null } = {}){
  const title = TROPHY[mode][tab], top = ranked[0], a = top && top.agg;
  const out = (who, val, what) => ({ title, who, val: String(val), what });
  if (mode === "daily" && tab === "all") return a && a.wins > 0 ? out(top.name, a.wins, `${plural(a.wins, "league title")} from ${plural(a.played, "Daily", "Dailies")}`) : null;
  if (mode === "daily") return first ? out(first.name, ukTime(first.r.at), `${first.r.club} champions at ${ukTime(first.r.at)}, on the ${ordinal(first.r.goes)} go`) : null;
  if (mode === "classic" && tab === "all") return hardest ? out(hardest.name, hardest.r.club, `Won the league with ${hardest.r.club} ${hardest.r.season} (${hardest.r.histPts} pts for real)`) : null;
  if (mode === "classic") return a && a.titles > 0 ? out(top.name, a.titles, `${plural(a.titles, "title")} this week${a.hardest ? `, the best ${a.hardest.club} ${a.hardest.season} from ${ordinal(a.hardest.histFinish)}` : ""}`) : null;
  if (mode === "clubx" && tab === "all"){ const d = ranked.slice().sort((x, y) => y.agg.inARow - x.agg.inARow || compare(x, y))[0]; return d && d.agg.inARow > 0 ? out(d.name, d.agg.inARow, `${plural(d.agg.inARow, "title")} in a row with ${d.agg.dynasty}`) : null; }
  if (mode === "clubx") return a && a.best ? out(top.name, a.best.pts, `${plural(a.best.pts, "point")} with ${a.best.club}, season ${a.best.career}`) : null;
  if (mode === "goal" && tab === "all") return a && a.exact > 0 ? out(top.name, a.exact, `Spot on ${plural(a.exact, "time")} in ${plural(a.games, "game")}`) : null;
  if (mode === "goal") return first ? out(first.name, ukTime(first.r.at), `Spot on ${first.r.target} at ${ukTime(first.r.at)}`) : null;
  if (mode === "ub" && tab === "all") return longest && longest.r.run > 0 ? out(longest.name, longest.r.run, `${longest.r.run} in a row on ${UB_STATS[longest.r.stat]}`) : null;
  return longest && longest.r.run > 0 ? out(longest.name, longest.r.run, `${longest.r.run} in a row on ${UB_STATS[longest.r.stat]}, ${ukWeekday(longest.r.at)}`) : null;
}
export { UB_STATS, GR_SHAPES, MAX_RESULTS };
