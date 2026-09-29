# Tenaball

Tenable Football Edition. A Tenable-style football quiz for 1 to 4 players, built as a single self-contained web page.

Created by Aiden and Craig.

## Files

- `index.html`: the full game (questions, sounds, animations and artwork are all built in, with no build step)
- `tenable-animation.html`: a standalone preview of the winner's trophy animation
- `og-image.jpg`: the preview picture shown when the game's link is posted in WhatsApp, iMessage or on social media
- `tests/`: browser tests for the end-of-game trophy (see `tests/README.md`)

## Playing

Open `index.html` in any modern browser. To host it for free, turn on GitHub Pages for this repository (Settings, Pages, deploy from the main branch, root folder). The game will then be available at `https://404craig.github.io/Tenaball/`.

## Notes

- Player stats and question history are stored in the browser's local storage, per device, matched by player name. A login is planned for later.
- Fonts load from Google Fonts. Everything else is inside the HTML files.
