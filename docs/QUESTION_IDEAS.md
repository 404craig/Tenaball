# Question ideas

Questions Craig wants added, waiting for data to be sourced. The rules in `CLAUDE.md` apply to every one: exactly 10 answers, no answer filling 4 or more slots, Premier League era only (from 1992/93) for player and club data, a date line on every board, and only data checked against a source.

When one is built, move it to the "Built" list at the bottom with the date.

## Premier League

Ideas the player dataset (`docs/data/pl_players/`) can still answer:

| Idea | What the data gives |
| --- | --- |
| Top scorers and most appearances for more clubs: Southampton, Leicester, Crystal Palace, Fulham, Blackburn, Leeds, Sunderland, Bolton, Middlesbrough, Brighton, Wolves, Stoke, West Brom, Bournemouth, Nottingham Forest | Most are clean; a few need a pool at 10th (Stoke and Burnley). Easy for the club's fans, hard for everyone else. |
| Played for the most Premier League clubs | Marcus Bent 8; Cole, Bellamy, Crouch, Ben Haim and Routledge 7; then a big pool on 6. |
| Scored for the most Premier League clubs | Bellamy 7, then ten players on 6 (a pool for nine places). |
| Clubs with the most Premier League seasons | Exactly ten clubs on 29 or more: the six ever-presents on 34, Newcastle and Villa 31, West Ham 30, Man City 29. |
| Best single season for a club (each player once) | Man Utd: Ronaldo 31, Rooney 27, Van Persie 26. Needs each player once, or Henry, Kane, Aguero and Haaland fill too many slots. |

Ideas that need new data:

- Youngest and oldest players and scorers: the dataset has no dates of birth.
- Penalties, assists by club, clean sheets by club, red cards: no match events in the dataset.
- Own goals: the dataset leaves them out.

The full list of 233 researched Premier League ideas (October 2026), with sources and checks, is in the question picker artifact. Craig ticks the ones he wants there, and the liked ones get copied into this file before they're built.

## International football

A new competition for the home screen (an "Internationals" group, with its own theme, watermark and `--topc` like any other). Lists come from Wikipedia's national-team record pages (which can be fetched from the build machine) and RSSSF. Craig to decide the period rule: caps and goals are career figures, so most of these would be all time rather than from 1992, the same way the World Cup and Euros team boards already cover every tournament.

| Idea | Notes |
| --- | --- |
| Most caps for each home nation: England, Scotland, Wales, Northern Ireland, Republic of Ireland | Five boards. England: Shilton 125, Rooney 120, Kane, Beckham, Moore. Wikipedia lists are complete and current. |
| Top scorers for each home nation | Five boards. England: Kane, Rooney 53, Charlton 49, Lineker 48. Wales: Bale 41, Rush 28. Ireland: Robbie Keane 68. Northern Ireland: Healy 36. Scotland: Law and Dalglish 30. |
| Most caps and top scorers for the big European nations | Germany, France, Spain, Italy, Netherlands, Portugal, Belgium, Croatia, Denmark, Sweden, Norway. Two boards each (caps, goals). Portugal: Ronaldo tops both. |
| Most caps and top scorers in world football | Ronaldo, Messi, Ali Daei, Chhetri and so on. The world caps board is full of lesser-known names (Bader Al-Mutawa, Soh Chin Ann), so maybe goals only, or Europe only. |
| Most matches as captain for each home nation | England: Kane, Wright, Moore, Robson, Beckham. Lists exist for each nation. |
| International managers by games in charge | England: Winterbottom, Ramsey, Southgate, Robson, Greenwood. Also Scotland, Wales, Ireland. |
| World Cup all-time top scorers | Klose 16, Ronaldo 15, Muller 14, Mbappe, Messi, Fontaine. Not in the game yet (the World Cup boards are all teams). Check the 2026 tournament's goals are added. |
| Euros all-time top scorers | Ronaldo 14, Platini 9, then Griezmann, Shearer, Kane. |
| Most World Cup appearances (player) | Messi 26, Matthaus 25, Klose 24, Maldini 23. |
| Most World Cup tournaments played (player) | Ronaldo and Messi on 6 after 2026, then a pool on 5. |
| England's top scorers at major tournaments (World Cup plus Euros) | Kane, Lineker 10, Shearer 9, Rooney, Hurst, Owen. |
| Players with the most England caps who never played at a World Cup | Niche; check a list exists before building. |
| Most international caps by a Premier League player while at a PL club | Hard to source; probably drop. |
| Nations League winners, Copa America winners, Africa Cup of Nations winners by year | Year-labelled boards like the World Cup winners. Copa and AFCON go back far enough for clean ten-year windows; check the 4-slot rule (Egypt, Uruguay, Argentina). |
| Ballon d'Or winners by year | Year-labelled; Messi (8) and Ronaldo (5) mean only some windows pass. |

## Game modes

Ideas for new ways to play, not new questions. Both are online modes (one phone each), built on the server's move log.

### Race the board

Everyone plays the same board at the same time, with no turns. Any player can type an answer whenever they like; the first correct answer to reach the server claims that slot, and it's then gone for everyone else. Wrong answers still cost a life (a yellow card), and losing all three is a red card that puts that player out of the round. The round ends when the board is full, when everyone is out, or when a time limit runs out.

- Fits the current design well: the server already puts moves in one order, so if two players send the same answer, whoever's move the server saw first gets it, and every phone agrees.
- Needs: guesses allowed out of turn (today only the player whose turn it is can guess), a "too late, already taken" message, and each slot showing who claimed it. Scoring is one point per slot claimed, with the usual 2-point bonus for whoever fills the last slot.
- Doesn't work on one shared phone, so it stays online only.

### Beat the clock

Everyone gets their own copy of the same board and the same time limit, for example 60 seconds. Each player fills as many slots as they can on their own board; the round ends for everyone at the same moment (losing all three lives, a red card, ends it early for that player). Then all the boards are revealed side by side and the most slots wins the round.

- The clock must come from the host, not each phone: the host sends a "time up" move when the minute is over, so every phone ends at the same point in the move log and nobody's slow phone gives them extra time. The game's rule that `applyGuess` and the rest never read the clock stays intact.
- Hide the other players' boards during the round (show only how many slots each has found), then reveal them all at the end.
- Could also work on one phone as "pass and play": each player takes their own 60 seconds in turn with the board hidden from the others, though that's slower.
- Settings: the time limit (30, 60 or 90 seconds), and whether repeated answers across players matter (they don't here, since every board is separate).

## Other competitions

Carried over from `CLAUDE.md`:

- Club top-10 league scorers for 10 clubs in each of La Liga, Bundesliga, Serie A, Ligue 1 and the Scottish Premiership, from season-by-season player stats (for example FBref), working back from 2025/26 and stopping where data can't be verified.
- Player records (hat-tricks, fastest to 50 and 100 goals, 20-goal seasons, single-season highs), managers and transfers, per competition.

## Built

- October 2026 (3rd, second batch, Craig's picks): Everton's biggest signings; top English scorers; top scorers for ten more countries and most appearances for fifteen (well-known players only, plus Scotland at Craig's request); top scorers since 2000/01 for Spurs, Newcastle, Everton, West Ham and Villa; top scorers and appearances by decade; countries with the most Premier League players; club open boards (surname letters at a club, and played for two clubs); most games as a manager; most penalties scored; most relegations and most promotions.

- October 2026 (3rd): from Craig's new boards document (`docs/data/Tenaball_new_boards_2026-10-03.md`): most appearances for each of 10 clubs; top scorers for France, the Netherlands, Scotland, the Republic of Ireland and Wales; top scorers and most appearances from outside England; most appearances by a goalkeeper; most seasons at one club; most goals by a defender and by a midfielder; biggest signings for nine clubs (Everton waits); and club record scorers for all 51 Premier League clubs.

- October 2026: every Premier League player since 1992/93 is in the game (Craig's dataset), and 22 surname-letter boards use it. Next from the same data: top scorers since 2000/01 for the other clubs, and appearances boards per club (the most-appearances idea above).

- October 2026: top Premier League scorers since 2000/01 for Man Utd, Liverpool, Arsenal and Chelsea. The rest of the clubs wait for the every-player dataset (`docs/PLAYER_DATABASE_BRIEF.md`), which also unlocks surname-letter boards.

- October 2026: twenty Premier League records boards from Craig's workbook (managers' wins, win rate and clubs managed; biggest single seasons; most 20-goal seasons and five every-20-goal-season boards; hat-tricks; fastest to 50 and 100; most seasons played; biggest signings, by position and club records). Sources and checks in `docs/PL_RECORDS_SOURCES.md`. Still to do from this list: most Premier League games as a manager, and record signings for each of the 10 clubs (their ten biggest buys).

- September 2026: club record scorers now draw a fresh 10 clubs each time (from the 20 checked so far).
- September 2026: most Premier League titles as a manager (`pl-at-mgr-titles`) and every club to finish in the top two (`pl-at-top2`), in place of sliding windows that broke the 4-slot rule.
