# Tenaball: notes for Claude Code

Tenable-style football quiz. Everything lives in `index.html` (HTML, CSS and JavaScript in one file, assets embedded as data URIs). `tenable-animation.html` is a standalone preview of the end-of-game trophy sequence and should stay in step with the game's version.

## Question rules (set by Craig, keep these)

- Every question has exactly 10 answers.
- No single answer may fill 4 or more slots on a board. Move the question to years that avoid it, otherwise drop it.
- Player and goals data counts only from the start of the Premier League, 1992/93. Champions League data from 1992/93, when it became the Champions League.
- World Cup and Euros team questions (winners, hosts and so on) can cover every tournament since each competition began.
- Every question states the period it covers, shown as a date line under the question.
- Every board shows positions 1 to 10 down the left, including year-based boards.
- Only use data that has been checked against a source. If data can't be verified, stop rather than guess.

## Writing style

- Never use em dashes in any text in the game or in docs.

## Structure pointers

- Question data: `PL`, `T5`, `UCL_W`, `UCL_R`, `EXTRA_Q`, `EXTRA_Q2`, `EXTRA_Q3` and the helper builders near them. A final pass re-cuts or removes boards that break the 4-slot rule.
- Difficulty: `q.level` (0 easy, 1 medium, 2 hard); the home screen slider picks the level.
- Variety: `family(q)` groups questions by type; `pickQuestion` favours the least recently played type.
- Themes: `body[data-cat=...]` CSS blocks per competition.
- Phone status bar: iOS Safari paints it one solid colour taken from a fixed full-width strip at the top (`.topfade`, and each overlay's own `::before`); Android Chrome uses `<meta name="theme-color">`, which `syncChrome()` keeps on the colour at the top of the screen. Safari ignores a strip 10px or thinner, one below the page (negative z-index), or a see-through one that ignores taps, so the strips are 16px, z-index 0, and the page (`.toplogo`, `.wrap`) sits above them at z-index 1. Each theme sets `--topc` (its average top-edge colour) and each full-screen overlay sets `--band`. A new theme or overlay needs one of these, or a band shows under the status bar.
- Stats: win rate and win streaks count only games against other players (`multi`). Solo games count towards games, best score, average and full boards, and the stats panel says so.
- End of game: `endGame()` builds the final table, records stats (`recordGame`), then runs `trophyReveal()` which hands the winner pill into first place. The trophy sequence is a signed-off copy of `tenable-animation.html`: keep its artwork, timings, colours and effects identical to the preview. `closeTrophy()` stops everything in the overlay (animations, the ribbons' SVG ripple, the idle bolt timer, leftover confetti) whenever it closes; `tests/trophy.test.mjs` checks the sequence and the hand-over.
- Accounts and online games: the last `<script>` in `index.html` talks to the server in `server/` (a Cloudflare Worker). `TENABALL_SERVER` switches them on (null means offline, as before). Accounts are an email plus a 4-digit PIN; there's no email checking or PIN recovery by email, Craig resets PINs from the server's `/admin` page. Stats: `recordGame` keeps local stats for everyone except the signed-in player, whose results go to their account through `accountRecord`.
- Online play is a replayed move log. The server's room puts moves in one order, checks the sender is in the game, and lets only the host send `round`, `reveal`, `refresh`, `next` and `skip`; players send `guess`, `pass` and `timeout`. Every phone applies them in order through `applyAction`, which calls the same `applyGuess`, `applyPass`, `applyTimeout`, `applyReveal`, `applyRefresh` and `applyNext` a local game uses. Keep those deterministic: no randomness, clock reads or local-only state in them, or phones will drift apart. Question picking happens only on the host, and the chosen id travels in the move.
- Tests: `cd tests && npm install && (cd ../server && npm install) && npm test` runs the server tests, the account and multi-phone online tests (against a local copy of the server) and the trophy tests. Run them after changing the server, the online code, the game loop or the end of game.
- Sharing: `prepareShare()` runs from `endGame()`. It builds the WhatsApp-style message (`shareText`, where `*text*` is bold) and draws the results card image (`shareCard`, 1080 by 1350) ahead of time, so tapping Share opens the share sheet straight away. `og-image.jpg` plus the `og:` meta tags give the link preview; it is the one asset kept outside `index.html`, because link previews need a real image URL.

## Planned work

- Club top-10 league scorers for 10 clubs in each of La Liga, Bundesliga, Serie A, Ligue 1 and the Scottish Premiership, using season-by-season player stats (for example FBref), working back from 2025/26 and stopping where data can't be verified.
- Player records (hat-tricks, fastest to 50 and 100 goals, 20-goal seasons, single-season highs), managers and transfers, per competition.
