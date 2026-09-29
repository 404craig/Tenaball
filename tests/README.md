# Tests

Tests for the Tenaball server, accounts, online games and the end-of-game trophy. Needs Node 20 or later.

```
cd server && npm install && cd ..
cd tests && npm install
npm test
```

The server tests and the browser tests start a local copy of the server with Cloudflare's own runtime (from `server/node_modules`), each with a fresh, empty database, so no Cloudflare account is needed.

- `server.test.mjs`: the server on its own: sign-up and sign-in checks, the PIN lockout and device limits, sessions on several phones, stats, the admin tools, which web addresses may use it, and online rooms (joining, full and started games, versions, removing players, host-only moves, move order, reconnecting, Play again, closing).
- `account.test.mjs`: accounts in the real game: the sign-in screen, creating an account, staying signed in, wrong PINs and the lock, guests, stats following a player to a second phone, adding a phone's earlier stats, saving a game played offline, an admin PIN reset, and changing your name.
- `online.test.mjs`: online games across several browser "phones": invite links and codes, live lobby updates, a full game with the boards checked after every move, moves out of turn, reloading and dropped connections mid-game, the shot clock, skipping a player, Play again, the host leaving and version checks.
- `trophy.test.mjs`: the winner's trophy at full time on a 390 by 844 screen, for solo, two-player and drawn games. It checks the approved timeline, the real winner pill, the hand-over into the final table, tap to skip, reduced motion, and that nothing is left running afterwards. Screenshots go in `tests/output/`.

The browser tests use Playwright's Chromium. If Chromium lives somewhere unusual, set `CHROMIUM_PATH`.
