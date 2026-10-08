# Penalty shootout (latest build from Craig's other chat)

`shootout-latest.html` is the "Tenaball Penalty Shootout" artifact (https://claude.ai/artifact/Q4vVn1DF7LJXjN6EsV8sMB, last updated 8 October 2026), saved as it stands. Open it in a browser to play it. It is the basis for the tie-break shootout in the game.

## Flow (`shootout(tied, auto)`)

- 2 to 4 players level on points. Setup has presets and an auto-play toggle.
- Build-up lines, then a coin toss (`coinToss`, nine coin frames spinning and slowing) picks who shoots first; with 3 or 4 players it is a draw.
- Laws of the Game: five kicks each, in turn. It ends as soon as nobody can catch the leader (`checkRegular`); with 3 or 4 players anyone who can't catch the leader drops out. Still level after five: sudden death, one kick each, until a round ends with someone ahead.
- Each round everyone still in answers the same question first, then the kicks play out in order. A right answer scores, a wrong one is saved or missed.
- The winner gets +1 point. Tally dots per player: goal, miss, pending, with a divider before sudden death.

## Questions (`DATA`, `POOL`)

- "Who has more X?" with two options. `DATA.h` holds 28 question headers (text and period line), `DATA.r` 614 rows `[header, a, b, value a, value b, unit, gap]`.
- Gap is the difficulty: 1 (214 rows), 2 (211), 3 (189). The pool is shuffled then sorted by gap, so early kicks get the clear-cut ones. No pair is asked twice.
- After the round the answer is shown with both values.

## Kicks (`makeKick`, `kickAnim`)

- Goals: nine spots (left, centre, right by top, middle, low), jittered, never the same spot twice running. The keeper dives the wrong way (either way for a central shot).
- Saves: seven spots, the keeper goes the same way and holds it.
- 20 percent of misses are off target instead: post, bar, over or wide (with a clang for woodwork).
- Ball flight is a Web Animations path with spin and shadow. On a goal the ball sits in a sprung net (`NET`, a 19 by 9 spring grid plus a ripple sent out three times, fading), then drops and bounces.

## Keeper

- Pixel-art keeper from Craig's artwork: 77 PNG frames embedded in `GK` (dives high, mid and low each way, catches, rocking idle, get-up frames 57 to 66 and a ball-drop celebration 67 to 76).
- `playKeeper(move, target, contactAt)` times the dive to reach the ball at contact. Frame blending is a setting (`tenaball-blend`). Gloves mode (`tenaball-gloves`) swaps the keeper for floating gloves.

## Commentary and settings

- Football Manager style commentary box (`comm`, queued with `say`), tagged Round n, Sudden death, Penalty shootout or Full time. Build-up lines, stakes ("Score this and X wins it", "X must score to stay alive"), result lines, end-of-round round-ups. Big lines on the result (`GOAL_BIG`, `SAVE_BIG`, `MISS_BIG`).
- Settings drawer (gear): commentary on or off (`tenaball-comm`), blending, gloves.
- Sounds reuse the game's synth (`tone`, `bell`, `sfx`) plus a clang and a net swish.

## Before it goes in the game

- Commentary says "he" and "his" in places; players are family and friends, so those lines need rewording.
- Online it would need the host to draw the question order and kick outcomes and send them as moves, so every phone plays the same shootout (`makeKick` and the coin toss use `Math.random`).
- Questions need checking against the board rules (periods, verified sources).
