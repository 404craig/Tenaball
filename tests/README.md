# Tests

Tests for sign-in, account stats and online games. They run against the Firebase emulators, so no real Firebase project is needed.

Needs Node 20 or later and Java 11 or later (the Firestore emulator runs on Java).

```
cd tests
npm install
npm test
```

`npm test` starts the Auth and Firestore emulators, then runs:

- `rules.test.mjs`: the Firestore security rules (who can join, start and play a room, and whose stats can be read).
- `login.test.mjs`: the sign-in screen in a real browser: email accounts, password reset, guests, Google and Apple, and stats saved to an account.
- `online.test.mjs`: online games across several browser "phones": invite links and codes, live lobby updates, a full game with the boards checked after every move, moves out of turn, reloading mid-game, the shot clock, skipping a player, Play again, the host leaving and version checks.

The browser tests use Playwright's Chromium. If Chromium lives somewhere unusual, set `CHROMIUM_PATH`.

Google's and Apple's real sign-in windows can't run against the emulator, so those two tests swap only the popup for the emulator's test sign-in with the same provider. Everything after the popup (the account, profile and routing) is the real code.
