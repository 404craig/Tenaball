// The admin page at /admin: find a player, set a new PIN, unlock or delete an account.
// It sends the admin password with each request; the server checks it and limits wrong guesses.
export const ADMIN_PAGE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Tenaball admin</title>
<style>
:root{color-scheme:dark;--bg:#1c0020;--panel:#2a0630;--line:rgba(255,255,255,.16);--ink:#fff;--muted:#e3cde6;--acc:#e90052;--ok:#00ff85;--bad:#ff8fb0}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:560px;margin:0 auto;padding:20px 16px 40px}h1{font-size:1.6rem;margin:0 0 4px}p{margin:0 0 12px;color:var(--muted)}
input,button{font:inherit}input{width:100%;padding:12px 14px;border-radius:12px;border:1.5px solid var(--line);background:rgba(0,0,0,.25);color:var(--ink);margin:0 0 10px}
button{border:0;border-radius:999px;padding:11px 18px;font-weight:700;background:var(--acc);color:#fff;cursor:pointer}button.ghost{background:transparent;border:1.5px solid var(--line)}
.row{display:flex;gap:8px}.row input{flex:1;margin:0}.msg{min-height:1.4em;margin:10px 0}.msg.ok{color:var(--ok)}.msg.bad{color:var(--bad)}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px 14px;margin:10px 0}.card b{display:block}.card small{color:var(--muted)}
.acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.acts button{padding:8px 14px;font-size:.9rem}.tag{font-size:.75rem;background:#ffd23f;color:#1b1300;border-radius:999px;padding:2px 8px;margin-left:6px}
.hidden{display:none}
</style></head><body><main>
<h1>Tenaball admin</h1><p>Reset a player's PIN, unlock or delete an account.</p>
<form id="login"><input type="password" id="pw" placeholder="Admin password" autocomplete="current-password" aria-label="Admin password"><button>Open</button></form>
<section id="tools" class="hidden">
  <div class="row"><input id="q" placeholder="Search by email or name" aria-label="Search"><button id="find">Find</button></div>
  <div class="msg" id="msg" aria-live="polite"></div>
  <div id="list"></div>
</section>
<div class="msg" id="lmsg" aria-live="polite"></div>
</main><script>
let pw = "";
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const say = (el, m, ok) => { $(el).textContent = m || ""; $(el).className = "msg " + (ok ? "ok" : "bad"); };
async function call(path, body){
  const r = await fetch("/api/admin/" + path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pw, ...body }) });
  const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.error || "Something went wrong."); return d;
}
$("login").onsubmit = async e => { e.preventDefault(); pw = $("pw").value;
  try { await call("find", { q: "" }); $("login").classList.add("hidden"); $("tools").classList.remove("hidden"); say("lmsg", ""); find(); }
  catch(err){ say("lmsg", err.message); } };
async function find(){
  try { const { users } = await call("find", { q: $("q").value });
    $("list").innerHTML = users.length ? "" : "<p>No players found.</p>";
    users.forEach(u => { const c = document.createElement("div"); c.className = "card";
      c.innerHTML = "<b>" + esc(u.name) + (u.locked ? '<span class="tag">Locked</span>' : "") + "</b><small>" + esc(u.email) + " &middot; " + u.played + " games &middot; joined " + new Date(u.created).toLocaleDateString() + "</small>"
        + '<div class="acts"><button data-a="pin">Set new PIN</button>' + (u.locked ? '<button class="ghost" data-a="unlock">Unlock</button>' : "") + '<button class="ghost" data-a="delete">Delete</button></div>';
      c.querySelector('[data-a="pin"]').onclick = async () => { const pin = prompt("New 4-digit PIN for " + u.name); if (pin === null) return;
        if (!/^\\d{4}$/.test(pin)) return say("msg", "The PIN must be 4 digits.");
        try { await call("pin", { id: u.id, pin }); say("msg", u.name + "'s PIN is now " + pin + ". They've been signed out everywhere, so tell them the new PIN.", true); find(); } catch(err){ say("msg", err.message); } };
      const un = c.querySelector('[data-a="unlock"]'); if (un) un.onclick = async () => { try { await call("unlock", { id: u.id }); say("msg", u.name + " is unlocked.", true); find(); } catch(err){ say("msg", err.message); } };
      c.querySelector('[data-a="delete"]').onclick = async () => { if (!confirm("Delete " + u.name + "'s account and stats? This can't be undone.")) return;
        try { await call("delete", { id: u.id }); say("msg", u.name + "'s account has been deleted.", true); find(); } catch(err){ say("msg", err.message); } };
      $("list").appendChild(c); });
  } catch(err){ say("msg", err.message); }
}
$("find").onclick = find; $("q").addEventListener("keydown", e => { if (e.key === "Enter") find(); });
</script></body></html>`;
