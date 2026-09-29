# Tests

Browser tests for Tenaball. Needs Node 20 or later.

```
cd tests
npm install
npm test
```

- `trophy.test.mjs`: the winner's trophy at full time on a 390 by 844 screen, for solo, two-player and drawn games. It checks the approved timeline, the real winner pill, the hand-over into the final table, tap to skip, reduced motion, and that nothing is left running afterwards. Screenshots go in `tests/output/`.

The tests use Playwright's Chromium. If Chromium lives somewhere unusual, set `CHROMIUM_PATH`.
