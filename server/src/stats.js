// Tenaball stats: how one finished game folds into a player's all-time stats.
// The same code runs on the server (accounts) and in the game (stats kept on the phone). index.html carries a copy between
// the "stats.js" markers, made by scripts/embed-stats.mjs; tests/stats.test.mjs checks the copy matches this file.
// The totals at the top level (played, multi, wins and so on) go back to the first game. Everything under x (filters by
// door and mode, boards, answers, bests, head to head) starts from the first game played after the October 2026 update.

export const BLANK_STATS = { played: 0, multi: 0, wins: 0, streak: 0, best: 0, points: 0, top: 0, tenables: 0 };
// one filter's figures: people = games with an opponent, a person or TenaBot (wins, draws, streaks and the win rate count
// only those, not games on your own); bgames and bwins are the games against TenaBot alone
export const STAT_KEYS = ["games", "people", "wins", "draws", "streak", "bestStreak", "bgames", "bwins", "points", "best", "boards", "done", "found", "others", "nobody",
  "right", "wrong", "passes", "timeouts", "yellow", "red", "bestRound", "bestRun", "claims", "slow", "unique", "fullClock", "mostClaims", "mostClock", "roundWins", "sweeps"];
const MAX_KEYS = ["bestStreak", "best", "bestRound", "bestRun", "mostClaims", "mostClock"];
export const STAT_FILTERS = ["all", "solo", "h2h", "online", "first", "clock", "bot"];
const blankAgg = () => Object.fromEntries(STAT_KEYS.map(k => [k, 0]));

// a game's record, checked: anything unexpected is dropped or clamped
export function cleanRec(r){
  r = r && typeof r === "object" ? r : {};
  const n = (v, max = 1000) => Math.max(0, Math.min(max, Math.floor(Number(v) || 0)));
  const pick = (v, ok, d) => ok.includes(v) ? v : d;
  const rounds = (Array.isArray(r.rounds) ? r.rounds : []).slice(0, 7).map(x => {
    x = x && typeof x === "object" ? x : {};
    return { cat: String(x.cat || "").replace(/[^a-z0-9]/g, "").slice(0, 10), lv: pick(x.lv, [0, 1, 2], 1), pts: n(x.pts, 40), f: n(x.f, 10), o: n(x.o, 10), z: n(x.z, 10), r: n(x.r, 100), w: n(x.w, 3), done: !!x.done };
  });
  const opp = (Array.isArray(r.opp) ? r.opp : []).slice(0, 3).map(o => {
    o = o && typeof o === "object" ? o : {};
    return { name: String(o.name || "").replace(/\s+/g, " ").trim().slice(0, 20), uid: /^u:[a-f0-9]{24}$/.test(String(o.uid || "")) ? o.uid : null, bot: !!o.bot, score: n(o.score) };
  }).filter(o => o.name);
  return { door: pick(r.door, ["solo", "h2h", "online"], "solo"), mode: pick(r.mode, ["turns", "first", "clock"], "turns"),
    bots: !!r.bots, people: n(r.people, 3), score: n(r.score), tenables: n(r.tenables, 7), result: pick(r.result, ["w", "l", "d", "s"], "s"),
    right: n(r.right), wrong: n(r.wrong), passes: n(r.passes), timeouts: n(r.timeouts), yellow: n(r.yellow), red: n(r.red),
    bestRun: n(r.bestRun, 70), claims: n(r.claims, 70), slow: n(r.slow), unique: n(r.unique, 70), roundWins: n(r.roundWins, 7), sweep: !!r.sweep, rounds, opp };
}

// which filters a game counts under
export function statBuckets(r){
  const b = ["all"];
  if (r.bots && !r.people) b.push("bot");
  else if (r.door === "solo" && !r.bots && !r.people) b.push("solo");
  if (r.door === "h2h") b.push("h2h");
  if (r.door === "online") b.push("online");
  if (r.mode === "first") b.push("first");
  if (r.mode === "clock") b.push("clock");
  return b;
}

// stats saved before 5 October 2026 left games against TenaBot out of the win rate; this adds them in, once
export function upgradeStats(s){
  if (!s || typeof s !== "object" || !s.x || typeof s.x !== "object" || s.x.v >= 2) return s;
  const b = s.x.b || {}, all = b.all || {};
  s.multi = (s.multi || 0) + (all.bgames || 0); s.wins = (s.wins || 0) + (all.bwins || 0);
  for (const a of Object.values(b)) if (a && typeof a === "object"){ a.people = (a.people || 0) + (a.bgames || 0); a.wins = (a.wins || 0) + (a.bwins || 0); }
  s.x.v = 2;
  return s;
}

export function bumpStats(old, raw, now = Date.now()){
  const r = cleanRec(raw), s = upgradeStats(JSON.parse(JSON.stringify({ ...BLANK_STATS, ...(old && typeof old === "object" ? old : {}) })));
  const won = r.result === "w" || r.result === "d", vs = r.people > 0 || r.bots;
  s.played++; s.points += r.score; s.top = Math.max(s.top, r.score); s.tenables += r.tenables;
  if (vs){ s.multi++; if (won){ s.wins++; s.streak++; s.best = Math.max(s.best, s.streak); } else s.streak = 0; }
  const x = s.x = s.x && typeof s.x === "object" ? s.x : {};
  x.b = x.b || {}; x.vs = x.vs || {}; x.form = typeof x.form === "string" ? x.form : ""; x.since = x.since || now; x.v = 2;
  for (const k of statBuckets(r)){
    const p = x.b[k] || {}, a = x.b[k] = { ...blankAgg(), ...p, comp: p.comp || {}, lvl: Array.isArray(p.lvl) ? p.lvl : [[0, 0], [0, 0], [0, 0]] };
    a.games++; a.points += r.score; a.best = Math.max(a.best, r.score);
    if (vs){ a.people++; if (won){ a.wins++; a.streak++; a.bestStreak = Math.max(a.bestStreak, a.streak); } else a.streak = 0; if (r.result === "d") a.draws++; }
    if (r.bots && !r.people){ a.bgames++; if (won) a.bwins++; }
    for (const f of ["right", "wrong", "passes", "timeouts", "yellow", "red", "claims", "slow", "unique", "roundWins"]) a[f] += r[f];
    a.bestRun = Math.max(a.bestRun, r.bestRun); if (r.sweep) a.sweeps++;
    for (const d of r.rounds){
      a.boards++; a.done += d.done ? 1 : 0; a.found += d.f; a.others += d.o; a.nobody += d.z; a.bestRound = Math.max(a.bestRound, d.pts);
      if (d.cat){ const c = a.comp[d.cat] = a.comp[d.cat] || [0, 0, 0, 0]; c[0]++; c[1] += d.done ? 1 : 0; c[2] += d.r; c[3] += d.w; }
      a.lvl[d.lv][0] += d.r; a.lvl[d.lv][1] += d.w;
      if (r.mode === "first") a.mostClaims = Math.max(a.mostClaims, d.f);
      if (r.mode === "clock"){ a.mostClock = Math.max(a.mostClock, d.f); if (d.done) a.fullClock++; }
    }
  }
  // head to head against people (TenaBot's results stay in the vs TenaBot filter)
  for (const o of r.opp){
    if (o.bot) continue;
    const key = o.name.toLowerCase(), v = x.vs[key] = x.vs[key] || { name: o.name, w: 0, l: 0, d: 0 };
    v.name = o.name; if (o.uid) v.uid = o.uid; v.t = now;
    if (r.score > o.score) v.w++; else if (r.score < o.score) v.l++; else v.d++;
  }
  const names = Object.keys(x.vs);
  if (names.length > 30) names.sort((a, b) => (x.vs[a].t || 0) - (x.vs[b].t || 0)).slice(0, names.length - 30).forEach(k => delete x.vs[k]);
  x.form = (r.result + x.form).slice(0, 10); // newest first: w, l, d, or s for a game on your own
  return s;
}

// two sets of stats added together (a phone's guest stats going onto an account)
export function mergeStats(a, b){
  const n = v => Math.max(0, Math.floor(Number(v) || 0));
  // each side on its own terms first: wins can't exceed games against others, which can't exceed games
  const fix = o => { const t = { ...BLANK_STATS, ...(o && typeof o === "object" ? o : {}) }; t.played = n(t.played); t.multi = Math.min(n(t.multi), t.played); t.wins = Math.min(n(t.wins), t.multi); return t; };
  const A = fix(upgradeStats(a && typeof a === "object" ? JSON.parse(JSON.stringify(a)) : a)), B = fix(upgradeStats(b && typeof b === "object" ? JSON.parse(JSON.stringify(b)) : b));
  const out = {};
  for (const k of Object.keys(BLANK_STATS)) out[k] = ["streak", "best", "top"].includes(k) ? Math.max(n(A[k]), n(B[k])) : n(A[k]) + n(B[k]);
  out.multi = Math.min(out.multi, out.played); out.wins = Math.min(out.wins, out.multi); out.best = Math.max(out.best, out.streak);
  const xa = A.x || {}, xb = B.x || {};
  if (!A.x && !B.x) return out;
  const x = out.x = { v: 2, b: {}, vs: {}, form: String(xa.form || "") .slice(0, 10), since: Math.min(xa.since || Infinity, xb.since || Infinity) };
  if (x.since === Infinity) x.since = Date.now();
  for (const k of STAT_FILTERS){
    const p = (xa.b || {})[k], q = (xb.b || {})[k]; if (!p && !q) continue;
    const m = x.b[k] = { ...blankAgg(), comp: {}, lvl: [[0, 0], [0, 0], [0, 0]] };
    for (const f of STAT_KEYS) m[f] = MAX_KEYS.includes(f) ? Math.max(n((p || {})[f]), n((q || {})[f])) : n((p || {})[f]) + n((q || {})[f]);
    m.streak = Math.max(n((p || {}).streak), n((q || {}).streak));
    for (const src of [p, q]) if (src){
      for (const [c, v] of Object.entries(src.comp || {})) if (Array.isArray(v)){ const t = m.comp[c] = m.comp[c] || [0, 0, 0, 0]; v.slice(0, 4).forEach((y, i) => t[i] += n(y)); }
      (Array.isArray(src.lvl) ? src.lvl : []).slice(0, 3).forEach((v, i) => { if (Array.isArray(v)){ m.lvl[i][0] += n(v[0]); m.lvl[i][1] += n(v[1]); } });
    }
  }
  for (const src of [xa.vs || {}, xb.vs || {}]) for (const [k, v] of Object.entries(src)){
    if (!v || typeof v !== "object") continue;
    const t = x.vs[k] = x.vs[k] || { name: String(v.name || k).slice(0, 20), w: 0, l: 0, d: 0 };
    t.w += n(v.w); t.l += n(v.l); t.d += n(v.d); if (v.uid) t.uid = v.uid; t.t = Math.max(t.t || 0, n(v.t));
  }
  if (!x.form) x.form = String(xb.form || "").slice(0, 10);
  return out;
}
