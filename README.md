# Tenaball

Tenable Football Edition. A Tenable-style football quiz for 1 to 4 players, built as a single self-contained web page.

Created by Aiden and Craig.

## Files

- `index.html`: the full game (questions, sounds, animations and artwork are all built in, with no build step)
- `tenable-animation.html`: a standalone preview of the winner's trophy animation
- `og-image.jpg`: the preview picture shown when the game's link is posted in WhatsApp, iMessage or on social media
- `firestore.rules` and `firebase.json`: security rules and emulator settings for sign-in and online games
- `docs/ONLINE_SETUP.md`: how to switch on sign-in and online games with a free Firebase project
- `tests/`: tests for sign-in, account stats and online games, run against the Firebase emulators (see `tests/README.md`)

## Playing

Open `index.html` in any modern browser. To host it for free, turn on GitHub Pages for this repository (Settings, Pages, deploy from the main branch, root folder). The game will then be available at `https://404craig.github.io/Tenaball/`.

## Notes

- Players can sign in with Apple, Google or email, or play as a guest. Signed-in players' stats are saved to their account; guests' stats and question history stay in the browser's local storage on that device.
- **Play online with friends** lets a host invite up to 3 others with a link or a 5-letter code. Everyone joins a live lobby, then plays on their own phone once the host starts.
- Sign-in and online games need a Firebase project; until one is connected they are switched off and the game works offline as before. See `docs/ONLINE_SETUP.md`.
- Fonts load from Google Fonts, and when online play is switched on, Firebase loads from Google's servers. Everything else is inside the HTML files.
