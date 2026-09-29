// Tenaball server: accounts (email and 4-digit PIN), stats that follow the account, and online game rooms.
// Runs on Cloudflare Workers. Accounts live in one SQLite-backed Durable Object; each online game is its own.
import { DurableObject } from "cloudflare:workers";
import { ADMIN_PAGE } from "./admin.js";

const BLANK_STATS = { played: 0, multi: 0, wins: 0, streak: 0, best: 0, points: 0, top: 0, tenables: 0 };
const MAX_PLAYERS = 4;
const cleanName = n => String(n || "").replace(/\s+/g, " ").trim().slice(0, 20);
const cleanEmail = e => String(e || "").trim().toLowerCase();
const validEmail = e => e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const validPin = p => /^\d{4}$/.test(String(p || ""));
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
const randomHex = bytes => hex(crypto.getRandomValues(new Uint8Array(bytes)));
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...headers } });
const fail = (status, error, extra = {}) => json({ error, ...extra }, status);

async function sha256(text){ return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))); }
// PINs are scrambled with a server-only secret as well as a per-account salt: with only 10,000 possible PINs,
// the secret is what stops anyone who got hold of the database from simply trying them all
async function pinHash(secret, salt, pin){
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${salt}:${pin}`)));
}
function sameText(a, b){ // compares without leaking how much matched through timing
  a = String(a); b = String(b); let d = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) d |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return d === 0;
}
function bumpStats(old, r){
  const s = { ...BLANK_STATS, ...(old || {}) };
  s.played++; s.points += r.score; s.top = Math.max(s.top, r.score); s.tenables += r.tenables;
  if (r.multi){ s.multi++; if (r.won){ s.wins++; s.streak++; s.best = Math.max(s.best, s.streak); } else s.streak = 0; }
  return s;
}

/* ---------- the front door: CORS, routing, and connecting sockets to rooms ---------- */
function allowedOrigin(req, env){
  const origin = req.headers.get("Origin");
  if (!origin) return null;
  const list = String(env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  return list.includes(origin) || origin === new URL(req.url).origin ? origin : null;
}
const accounts = env => env.ACCOUNTS.get(env.ACCOUNTS.idFromName("accounts"));
const room = (env, code) => env.ROOMS.get(env.ROOMS.idFromName(code));
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(5)), b => CODE_CHARS[b % CODE_CHARS.length]).join("");

// who is asking: a signed-in player (by session token) or a guest (by the random id their phone keeps)
async function identify(env, token, guestId, guestName){
  if (token){
    const r = await accounts(env).fetch("https://accounts/whoami", { method: "POST", body: JSON.stringify({ token }) });
    if (!r.ok) return null;
    const { user } = await r.json();
    return { pid: "u:" + user.id, name: user.name, account: true };
  }
  if (/^[a-f0-9]{24,64}$/.test(guestId || "")){
    const name = cleanName(guestName);
    return name ? { pid: "g:" + guestId, name, account: false } : null;
  }
  return null;
}

export default {
  async fetch(req, env){
    const url = new URL(req.url), origin = allowedOrigin(req, env);
    const cors = origin ? { "access-control-allow-origin": origin, "access-control-allow-headers": "content-type, authorization", "access-control-allow-methods": "GET, POST, OPTIONS", "vary": "Origin" } : {};
    const withCors = r => { const h = new Headers(r.headers); for (const [k, v] of Object.entries(cors)) h.set(k, v); return new Response(r.body, { status: r.status, headers: h, webSocket: r.webSocket }); };
    if (req.method === "OPTIONS") return new Response(null, { status: origin ? 204 : 403, headers: cors });
    try {
      if (url.pathname === "/") return new Response("Tenaball server is running.", { headers: { "content-type": "text/plain" } });
      if (url.pathname === "/admin") return new Response(ADMIN_PAGE, { headers: { "content-type": "text/html; charset=utf-8", "x-frame-options": "DENY", "cache-control": "no-store" } });
      if (!url.pathname.startsWith("/api/")) return new Response("Not found", { status: 404 });
      if (!origin) return fail(403, "This address isn't allowed to use the Tenaball server.");
      const ip = req.headers.get("CF-Connecting-IP") || "local";

      // online games: live connection
      const ws = url.pathname.match(/^\/api\/rooms\/([A-Z0-9]{5})\/live$/);
      if (ws){
        if (req.headers.get("Upgrade") !== "websocket") return fail(426, "Expected a live connection.");
        const q = url.searchParams, who = await identify(env, q.get("token"), q.get("guest"), q.get("name"));
        if (!who) return fail(401, "Sign in or enter a name to join.");
        const h = new Headers(req.headers); h.set("x-pid", who.pid); h.set("x-name", encodeURIComponent(who.name)); h.set("x-ver", q.get("ver") || "");
        return room(env, ws[1]).fetch(new Request(req.url, { headers: h }));
      }
      if (url.pathname === "/api/rooms" && req.method === "POST"){
        const body = await req.json().catch(() => ({}));
        const token = (req.headers.get("Authorization") || "").replace(/^Bearer /, "");
        const who = await identify(env, token, body.guest, body.name);
        if (!who) return withCors(fail(401, "Sign in or enter a name to create a game."));
        for (let i = 0; i < 8; i++){
          const code = newCode();
          const r = await room(env, code).fetch("https://room/create", { method: "POST", body: JSON.stringify({ code, host: who.pid, name: who.name, settings: body.settings, ver: String(body.ver || "") }) });
          if (r.status === 409) continue;
          return withCors(r);
        }
        return withCors(fail(503, "Couldn't find a free game code. Try again."));
      }
      // accounts, stats and the admin tools
      if (req.method !== "POST") return withCors(fail(405, "Use POST."));
      const body = await req.text();
      if (body.length > 20000) return withCors(fail(413, "Too much data."));
      const token = (req.headers.get("Authorization") || "").replace(/^Bearer /, "");
      return withCors(await accounts(env).fetch("https://accounts" + url.pathname.slice(4), { method: "POST", body, headers: { "x-ip": ip, "x-token": token } }));
    } catch (e){
      console.error(e);
      return withCors(fail(500, "Something went wrong on the server. Try again."));
    }
  }
};

/* ---------- accounts ---------- */
export class Accounts extends DurableObject {
  constructor(ctx, env){
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, salt TEXT NOT NULL, pin TEXT NOT NULL,
      fails INTEGER NOT NULL DEFAULT 0, lock_until INTEGER NOT NULL DEFAULT 0, stats TEXT NOT NULL, created INTEGER NOT NULL)`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, uid TEXT NOT NULL, created INTEGER NOT NULL, seen INTEGER NOT NULL)`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS throttle (key TEXT PRIMARY KEY, count INTEGER NOT NULL, since INTEGER NOT NULL)`);
  }
  one(q, ...a){ const r = this.sql.exec(q, ...a).toArray(); return r[0] || null; }
  userOut(u){ return { id: u.id, name: u.name, email: u.email }; }
  statsOf(u){ try { return { ...BLANK_STATS, ...JSON.parse(u.stats) }; } catch(e){ return { ...BLANK_STATS }; } }
  // counts attempts per key inside a time window; true once the limit is reached
  limited(key, limit, windowMs, add = 0){
    const now = Date.now(); let row = this.one("SELECT count, since FROM throttle WHERE key = ?", key);
    if (!row || now - row.since > windowMs) row = { count: 0, since: now };
    row.count += add;
    this.sql.exec("INSERT OR REPLACE INTO throttle (key, count, since) VALUES (?, ?, ?)", key, row.count, row.since);
    if (Math.random() < .02) this.sql.exec("DELETE FROM throttle WHERE since < ?", now - 86400000);
    return row.count >= limit;
  }
  async newSession(uid){
    const token = randomHex(32), now = Date.now();
    this.sql.exec("INSERT INTO sessions (token, uid, created, seen) VALUES (?, ?, ?, ?)", await sha256(token), uid, now, now);
    return token;
  }
  async userFromToken(token){
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
    const t = await sha256(token), s = this.one("SELECT uid, seen FROM sessions WHERE token = ?", t);
    if (!s) return null;
    if (Date.now() - s.seen > 3600000) this.sql.exec("UPDATE sessions SET seen = ? WHERE token = ?", Date.now(), t);
    return this.one("SELECT * FROM users WHERE id = ?", s.uid);
  }
  secret(){ return this.env.PIN_SECRET && String(this.env.PIN_SECRET).length >= 16 ? String(this.env.PIN_SECRET) : null; }

  async fetch(req){
    const path = new URL(req.url).pathname, ip = req.headers.get("x-ip") || "local", token = req.headers.get("x-token") || "";
    let b = {}; try { b = JSON.parse(await req.text() || "{}"); } catch(e){ return fail(400, "That request didn't make sense."); }
    const tries = Number(this.env.MAX_PIN_TRIES) || 5, lockMs = (Number(this.env.LOCK_MINUTES) || 15) * 60000;

    if (path === "/whoami"){ const u = await this.userFromToken(b.token); return u ? json({ user: this.userOut(u) }) : fail(401, "Not signed in."); }

    if (path === "/signup"){
      if (!this.secret()) return fail(503, "The server isn't set up yet (PIN_SECRET is missing).");
      const name = cleanName(b.name), email = cleanEmail(b.email);
      if (!name) return fail(400, "Enter your name so other players know who you are.");
      if (!validEmail(email)) return fail(400, "That email address doesn't look right.");
      if (!validPin(b.pin)) return fail(400, "Your PIN must be 4 digits.");
      if (this.limited("signup:" + ip, 10, 3600000, 1)) return fail(429, "Too many new accounts from this device. Try again later.");
      if (this.one("SELECT id FROM users WHERE email = ?", email)) return fail(409, "There's already an account with that email. Sign in instead.");
      const id = randomHex(12), salt = randomHex(16);
      this.sql.exec("INSERT INTO users (id, email, name, salt, pin, stats, created) VALUES (?, ?, ?, ?, ?, ?, ?)", id, email, name, salt, await pinHash(this.secret(), salt, b.pin), JSON.stringify(BLANK_STATS), Date.now());
      const u = this.one("SELECT * FROM users WHERE id = ?", id);
      return json({ token: await this.newSession(id), user: this.userOut(u), stats: this.statsOf(u) });
    }

    if (path === "/signin"){
      if (!this.secret()) return fail(503, "The server isn't set up yet (PIN_SECRET is missing).");
      if (this.limited("signin:" + ip, 20, 3600000)) return fail(429, "Too many wrong tries from this device. Wait a while and try again.");
      const email = cleanEmail(b.email), u = validEmail(email) ? this.one("SELECT * FROM users WHERE email = ?", email) : null, now = Date.now();
      if (u && u.lock_until > now){ const mins = Math.ceil((u.lock_until - now) / 60000); return fail(423, `Too many wrong PINs. This account is locked for ${mins} more minute${mins === 1 ? "" : "s"}.`, { retryAfter: mins }); }
      if (!u || !validPin(b.pin) || !sameText(await pinHash(this.secret(), u.salt, b.pin), u.pin)){
        this.limited("signin:" + ip, 20, 3600000, 1);
        if (!u) return fail(401, "That email and PIN don't match.");
        const fails = u.fails + 1;
        if (fails >= tries){
          this.sql.exec("UPDATE users SET fails = 0, lock_until = ? WHERE id = ?", now + lockMs, u.id);
          const mins = Math.max(1, Math.round(lockMs / 60000));
          return fail(423, `Too many wrong PINs. This account is locked for ${mins} minutes.`, { retryAfter: mins });
        }
        this.sql.exec("UPDATE users SET fails = ? WHERE id = ?", fails, u.id);
        const left = tries - fails;
        return fail(401, `That email and PIN don't match. ${left} ${left === 1 ? "try" : "tries"} left before the account is locked for a while.`);
      }
      this.sql.exec("UPDATE users SET fails = 0, lock_until = 0 WHERE id = ?", u.id);
      return json({ token: await this.newSession(u.id), user: this.userOut(u), stats: this.statsOf(u) });
    }

    // everything below needs a signed-in player (or, for /admin/*, the admin password)
    if (path.startsWith("/admin/")) return this.admin(path, b, ip);
    const u = await this.userFromToken(token);
    if (!u) return fail(401, "You're signed out. Sign in again.");

    if (path === "/me") return json({ user: this.userOut(u), stats: this.statsOf(u) });
    if (path === "/signout"){ this.sql.exec("DELETE FROM sessions WHERE token = ?", await sha256(token)); return json({ ok: true }); }
    if (path === "/name"){
      const name = cleanName(b.name); if (!name) return fail(400, "Enter a name.");
      this.sql.exec("UPDATE users SET name = ? WHERE id = ?", name, u.id);
      return json({ user: { ...this.userOut(u), name } });
    }
    if (path === "/stats"){ // one finished game for this player
      const n = v => Number.isInteger(v) && v >= 0 && v <= 1000;
      if (!n(b.score) || !n(b.tenables || 0)) return fail(400, "Those results don't look right.");
      const s = bumpStats(this.statsOf(u), { score: b.score, tenables: b.tenables || 0, multi: !!b.multi, won: !!b.won });
      this.sql.exec("UPDATE users SET stats = ? WHERE id = ?", JSON.stringify(s), u.id);
      return json({ stats: s });
    }
    if (path === "/stats/merge"){ // stats this phone kept before the player signed in
      const o = b.stats || {}, n = k => Math.max(0, Math.min(100000, Math.floor(Number(o[k]) || 0)));
      const s = this.statsOf(u), m = { played: n("played"), multi: Math.min(n("multi"), n("played")), wins: n("wins"), streak: n("streak"), best: n("best"), points: n("points"), top: n("top"), tenables: n("tenables") };
      m.wins = Math.min(m.wins, m.multi);
      const out = { played: s.played + m.played, multi: s.multi + m.multi, wins: s.wins + m.wins, streak: Math.max(s.streak, m.streak), best: Math.max(s.best, m.best, s.streak, m.streak), points: s.points + m.points, top: Math.max(s.top, m.top), tenables: s.tenables + m.tenables };
      this.sql.exec("UPDATE users SET stats = ? WHERE id = ?", JSON.stringify(out), u.id);
      return json({ stats: out });
    }
    return fail(404, "Not found");
  }

  // the admin page: find players, set a new PIN, unlock or delete an account
  async admin(path, b, ip){
    if (!this.env.ADMIN_PASSWORD || String(this.env.ADMIN_PASSWORD).length < 8) return fail(503, "The admin page isn't set up yet (ADMIN_PASSWORD is missing).");
    if (this.limited("admin:" + ip, 10, 3600000)) return fail(429, "Too many wrong passwords. Try again in an hour.");
    if (!sameText(b.password || "", this.env.ADMIN_PASSWORD)){ this.limited("admin:" + ip, 10, 3600000, 1); return fail(401, "Wrong admin password."); }
    const row = u => ({ ...this.userOut(u), locked: u.lock_until > Date.now(), created: u.created, played: this.statsOf(u).played });
    if (path === "/admin/find"){
      const q = "%" + String(b.q || "").trim().toLowerCase().replace(/[%_]/g, "") + "%";
      return json({ users: this.sql.exec("SELECT * FROM users WHERE lower(email) LIKE ? OR lower(name) LIKE ? ORDER BY created DESC LIMIT 50", q, q).toArray().map(row) });
    }
    const u = this.one("SELECT * FROM users WHERE id = ?", String(b.id || ""));
    if (!u) return fail(404, "No player with that id.");
    if (path === "/admin/pin"){
      if (!this.secret()) return fail(503, "The server isn't set up yet (PIN_SECRET is missing).");
      if (!validPin(b.pin)) return fail(400, "The new PIN must be 4 digits.");
      const salt = randomHex(16);
      this.sql.exec("UPDATE users SET salt = ?, pin = ?, fails = 0, lock_until = 0 WHERE id = ?", salt, await pinHash(this.secret(), salt, b.pin), u.id);
      this.sql.exec("DELETE FROM sessions WHERE uid = ?", u.id); // signed out everywhere, so the new PIN is needed
      return json({ ok: true, user: row(this.one("SELECT * FROM users WHERE id = ?", u.id)) });
    }
    if (path === "/admin/unlock"){ this.sql.exec("UPDATE users SET fails = 0, lock_until = 0 WHERE id = ?", u.id); return json({ ok: true, user: row(this.one("SELECT * FROM users WHERE id = ?", u.id)) }); }
    if (path === "/admin/delete"){ this.sql.exec("DELETE FROM sessions WHERE uid = ?", u.id); this.sql.exec("DELETE FROM users WHERE id = ?", u.id); return json({ ok: true }); }
    return fail(404, "Not found");
  }
}

/* ---------- online game rooms ----------
   The room keeps the lobby and the numbered move log. Every phone replays the log through the game's own
   rules, so the boards match; the room makes sure moves arrive in one order, come from players in the game,
   and that only the host sends the host's moves (reveal, question changes, next round, skip). */
const PLAYER_MOVES = ["guess", "pass", "timeout"], HOST_MOVES = ["round", "reveal", "refresh", "next", "skip"];
const IDLE_MS = 24 * 3600000;

export class Room extends DurableObject {
  constructor(ctx, env){
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec("CREATE TABLE IF NOT EXISTS moves (game INTEGER NOT NULL, seq INTEGER NOT NULL, pid TEXT NOT NULL, type TEXT NOT NULL, data TEXT NOT NULL, PRIMARY KEY (game, seq))");
  }
  async load(){ return this.state || (this.state = await this.ctx.storage.get("room")) || null; }
  async save(){ await this.ctx.storage.put("room", this.state); await this.ctx.storage.setAlarm(Date.now() + IDLE_MS); }
  publicRoom(){ const r = this.state; return { code: r.code, host: r.host, status: r.status, game: r.game, settings: r.settings, ver: r.ver, players: r.players, order: r.order || null, seq: r.seq }; }
  movesOf(game){ return this.sql.exec("SELECT seq, pid, type, data FROM moves WHERE game = ? ORDER BY seq", game).toArray().map(m => ({ seq: m.seq, uid: m.pid, type: m.type, data: JSON.parse(m.data) })); }
  send(ws, msg){ try { ws.send(JSON.stringify(msg)); } catch(e){} }
  broadcast(msg){ const s = JSON.stringify(msg); for (const ws of this.ctx.getWebSockets()) try { ws.send(s); } catch(e){} }
  pidOf(ws){ return (ws.deserializeAttachment() || {}).pid; }
  closeAll(code, reason){ for (const ws of this.ctx.getWebSockets()) try { ws.close(code, reason); } catch(e){} }

  async fetch(req){
    const url = new URL(req.url);
    if (url.pathname === "/create"){
      const b = await req.json();
      if (await this.load()) return fail(409, "taken");
      const s = b.settings || {}, pick = (v, ok, d) => ok.includes(v) ? v : d;
      this.state = { code: b.code, host: b.host, status: "lobby", game: 1, seq: 0, ver: b.ver, created: Date.now(),
        settings: { rounds: pick(s.rounds, [3, 5, 7], 5), cat: String(s.cat || "random").slice(0, 20), clock: pick(s.clock, [0, 15, 30, 60], 30), level: pick(s.level, [0, 1, 2], 1), repeat: pick(s.repeat, ["all", "one"], "all") },
        players: { [b.host]: { name: b.name, n: 0 } } };
      await this.save();
      return json({ code: b.code, room: this.publicRoom() });
    }

    // a live connection from a phone
    const pair = new WebSocketPair(), [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    const pid = req.headers.get("x-pid"), name = cleanName(decodeURIComponent(req.headers.get("x-name") || "")), ver = req.headers.get("x-ver") || "";
    const r = await this.load(), refuse = (code, why) => { this.send(server, { t: "refused", why }); server.close(code, why); return new Response(null, { status: 101, webSocket: client }); };
    if (!r) return refuse(4404, "notfound");
    if (r.ver !== ver) return refuse(4409, "version");
    if (!r.players[pid]){
      if (r.status !== "lobby") return refuse(4403, "started");
      const taken = Object.values(r.players);
      if (taken.length >= MAX_PLAYERS) return refuse(4429, "full");
      let nm = name, k = 2; while (taken.some(p => p.name.toLowerCase() === nm.toLowerCase())) nm = cleanName(name.slice(0, 17)) + " " + (k++);
      r.players[pid] = { name: nm, n: Math.max(...taken.map(p => p.n)) + 1 };
      await this.save();
      this.broadcast({ t: "room", room: this.publicRoom() });
    }
    server.serializeAttachment({ pid });
    this.send(server, { t: "hello", you: pid, room: this.publicRoom(), moves: r.status === "playing" ? this.movesOf(r.game) : [] });
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, raw){
    const r = await this.load(), pid = this.pidOf(ws);
    if (!r || !pid || !r.players[pid] || typeof raw !== "string" || raw.length > 4000) return;
    let m; try { m = JSON.parse(raw); } catch(e){ return; }
    const host = pid === r.host, oops = msg => this.send(ws, { t: "error", msg, ref: m.ref });
    if (m.t === "ping") return this.send(ws, { t: "pong" });
    if (m.t === "kick"){
      if (!host || r.status !== "lobby" || !r.players[m.pid] || m.pid === r.host) return oops("Only the host can remove players, in the lobby.");
      delete r.players[m.pid]; await this.save();
      for (const s of this.ctx.getWebSockets()) if (this.pidOf(s) === m.pid){ this.send(s, { t: "removed" }); s.close(4001, "removed"); }
      return this.broadcast({ t: "room", room: this.publicRoom() });
    }
    if (m.t === "leave"){
      if (host) return this.close("The host closed this game.");
      if (r.status === "lobby"){ delete r.players[pid]; await this.save(); this.broadcast({ t: "room", room: this.publicRoom() }); }
      return ws.close(1000, "left");
    }
    if (m.t === "close"){ if (host) return this.close(r.status === "playing" ? "The host ended the game." : "The host closed this game."); return; }
    if (m.t === "start"){
      const order = Object.entries(r.players).sort((a, b) => a[1].n - b[1].n).map(e => e[0]);
      if (!host || r.status !== "lobby") return oops("Only the host can start the game.");
      if (order.length < 2) return oops("You need at least 2 players.");
      if (!m.move || m.move.type !== "round") return oops("The first move must set the question.");
      r.status = "playing"; r.order = order; r.seq = 0; await this.save();
      this.broadcast({ t: "room", room: this.publicRoom() });
      return this.addMove(pid, m.move, m.ref);
    }
    if (m.t === "again"){
      if (!host || r.status !== "playing") return oops("Only the host can start another game.");
      r.status = "lobby"; r.game += 1; r.seq = 0; r.order = null; await this.save();
      this.sql.exec("DELETE FROM moves WHERE game < ?", r.game);
      return this.broadcast({ t: "room", room: this.publicRoom() });
    }
    if (m.t === "move"){
      if (r.status !== "playing" || !r.order.includes(pid)) return oops("The game isn't running.");
      if (!(PLAYER_MOVES.includes(m.type) || (host && HOST_MOVES.includes(m.type)))) return oops("That move isn't allowed.");
      return this.addMove(pid, m, m.ref);
    }
  }
  async addMove(pid, m, ref){
    const r = this.state, seq = r.seq + 1, data = m.data && typeof m.data === "object" ? m.data : {};
    this.sql.exec("INSERT INTO moves (game, seq, pid, type, data) VALUES (?, ?, ?, ?, ?)", r.game, seq, pid, m.type, JSON.stringify(data));
    r.seq = seq; await this.save();
    this.broadcast({ t: "move", game: r.game, move: { seq, uid: pid, type: m.type, data }, ref: ref && typeof ref === "string" ? ref.slice(0, 40) : undefined });
  }
  async close(reason){
    this.broadcast({ t: "closed", reason });
    this.closeAll(4000, "closed");
    await this.ctx.storage.deleteAll(); this.state = null;
  }
  async webSocketClose(ws, code){ try { ws.close(code === 1005 || code === 1006 ? 1000 : code, "bye"); } catch(e){} }
  async webSocketError(){}
  async alarm(){ // tidy away rooms nobody has touched for a day
    const r = await this.load();
    if (r && this.ctx.getWebSockets().length){ await this.ctx.storage.setAlarm(Date.now() + IDLE_MS); return; }
    this.closeAll(4000, "expired"); await this.ctx.storage.deleteAll(); this.state = null;
  }
}
