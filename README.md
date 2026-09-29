# Tenaball

Tenable Football Edition. A Tenable-style football quiz for 1 to 4 players, built as a single self-contained web page.

Created by Aiden and Craig.

## Files

- `index.html`: the full game (questions, sounds, animations and artwork are all built in, with no build step)
- `tenable-animation.html`: a standalone preview of the winner's trophy animation
- `og-image.jpg`: the preview picture shown when the game's link is posted in WhatsApp, iMessage or on social media
- `server/`: the small server for accounts, stats and online games, run on Cloudflare's free plan (see `docs/SERVER_SETUP.md`)
- `tests/`: tests for the server, accounts, online games and the end-of-game trophy (see `tests/README.md`)

## Playing

Open `index.html` in any modern browser. To host it for free, turn on GitHub Pages for this repository (Settings, Pages, deploy from the main branch, root folder). The game will then be available at `https://404craig.github.io/Tenaball/`.

## Notes

- Players can sign in with an email and a 4-digit PIN, or play as a guest. Signed-in players' stats are saved to their account and follow them to any phone; guests' stats and question history stay in the browser's local storage on that device.
- **Play online with friends** lets a host invite up to 3 others with a link or a 5-letter code. Everyone joins a live lobby, then plays on their own phone once the host starts.
- Accounts and online games need the server in `server/`; until it's connected they're switched off and the game works offline as before. See `docs/SERVER_SETUP.md`.
- Fonts load from Google Fonts. Everything else is inside the HTML files.
