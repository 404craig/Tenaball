// Tenaball leagues: a league's table, worked out from its games. The same code runs on the server (the line at full time)
// and in the game (the Leagues tab). index.html carries a copy between the "leagues.js" markers, made by
// scripts/embed-stats.mjs; tests/stats.test.mjs checks the copy matches this file.
// A game is { at, w, p: [{ u, s, r, b }] }: when it finished, the winner's account id (after any penalty shootout), and for
// each member who played: account id, final score, points in each round, and boards completed at each level (easy, medium, hard).
// Every round is a head to head against each other member in the game: a win, a draw on the same points, or a loss.

export const LEAGUE_MIN = 5; // head to heads to be ranked, unless nobody has that many yet

// a game as a phone reports it, checked: anything unexpected is dropped or clamped
export function cleanLeagueGame(g){
  g = g && typeof g === "object" ? g : {};
  const n = (v, max) => Math.max(0, Math.min(max, Math.floor(Number(v) || 0)));
  const p = (Array.isArray(g.p) ? g.p : []).slice(0, 4).map(x => {
    x = x && typeof x === "object" ? x : {};
    return { u: /^[a-f0-9]{24}$/.test(String(x.u || "")) ? x.u : null, s: n(x.s, 1000),
      r: (Array.isArray(x.r) ? x.r : []).slice(0, 7).map(v => n(v, 100)), b: [0, 1, 2].map(i => n((x.b || [])[i], 7)) };
  }).filter((x, i, all) => x.u && all.findIndex(y => y.u === x.u) === i);
  const w = p.some(x => x.u === g.w) ? g.w : null;
  return { at: n(g.at, 1e14), w, p };
}

// the table: rows of { id, name, p, w, rw, rd, rl, pct, form, b, last, pos }; ranked in order, then the rest
// opts.kind: "all" (rounds %, the default), "games" (games %) or "rounds" (rounds %); opts.since: only games from then on
export function leagueTable(games, members, opts = {}){
  const since = opts.since || 0, kind = opts.kind || "all";
  const T = new Map(members.map(m => [m.id, { id: m.id, name: m.name, p: 0, w: 0, rw: 0, rd: 0, rl: 0, form: "", b: [0, 0, 0], last: 0 }]));
  for (const g of [...games].sort((a, b) => a.at - b.at)){
    if (g.at < since) continue;
    const ps = g.p.filter(x => T.has(x.u)); if (ps.length < 2) continue;
    for (const x of ps){ const t = T.get(x.u); t.p++; if (g.w === x.u) t.w++; t.last = Math.max(t.last, g.at); x.b.forEach((k, i) => t.b[i] += k); }
    const rounds = Math.max(...ps.map(x => x.r.length));
    for (let i = 0; i < rounds; i++) for (const a of ps){
      const t = T.get(a.u), sa = a.r[i] || 0; let w = 0, d = 0, l = 0;
      for (const b of ps) if (b !== a){ const sb = b.r[i] || 0; if (sa > sb) w++; else if (sa < sb) l++; else d++; }
      t.rw += w; t.rd += d; t.rl += l;
      t.form += l ? "L" : d ? "D" : "W"; // the round: beat everyone, level with the best, or beaten
    }
  }
  const rds = t => t.rw + t.rd + t.rl;
  const pctOf = t => kind === "games" ? (t.p ? Math.round(100 * t.w / t.p) : 0) : (rds(t) ? Math.round(100 * (t.rw + t.rd / 2) / rds(t)) : 0);
  const rows = [...T.values()].map(t => ({ ...t, pct: pctOf(t), form: t.form.slice(-5) }));
  const played = rows.filter(t => t.p > 0), early = !played.some(t => rds(t) >= LEAGUE_MIN);
  const exact = t => kind === "games" ? (t.p ? t.w / t.p : 0) : (rds(t) ? (t.rw + t.rd / 2) / rds(t) : 0);
  const ranked = played.filter(t => early || rds(t) >= LEAGUE_MIN)
    .sort((a, b) => exact(b) - exact(a) || b.w - a.w || b.rw - a.rw || a.name.localeCompare(b.name));
  ranked.forEach((t, i) => t.pos = i + 1);
  const rest = rows.filter(t => !ranked.includes(t)).sort((a, b) => rds(b) - rds(a) || a.name.localeCompare(b.name));
  rest.forEach(t => t.pos = 0);
  return { ranked, rest, early };
}

const ordinal = n => n + (n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th");
// what a game did to the table, for the players in it: "Craig up to 1st · Phil down to 2nd"
export function leagueMoves(before, after, ids){
  const pos = (tbl, id) => (tbl.ranked.find(t => t.id === id) || {}).pos || 0;
  return after.ranked.filter(t => ids.includes(t.id)).map(t => {
    const b = pos(before, t.id), a = t.pos;
    return !b ? `${t.name} in at ${ordinal(a)}` : a < b ? `${t.name} up to ${ordinal(a)}` : a > b ? `${t.name} down to ${ordinal(a)}` : `${t.name} stays ${ordinal(a)}`;
  }).join(" · ");
}
