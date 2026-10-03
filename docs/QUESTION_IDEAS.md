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

## Other competitions

Carried over from `CLAUDE.md`:

- Club top-10 league scorers for 10 clubs in each of La Liga, Bundesliga, Serie A, Ligue 1 and the Scottish Premiership, from season-by-season player stats (for example FBref), working back from 2025/26 and stopping where data can't be verified.
- Player records (hat-tricks, fastest to 50 and 100 goals, 20-goal seasons, single-season highs), managers and transfers, per competition.

## Built

- October 2026 (3rd, second batch, Craig's picks): Everton's biggest signings; top English scorers; top scorers for ten more countries and most appearances for fourteen (well-known players only); top scorers since 2000/01 for Spurs, Newcastle, Everton, West Ham and Villa; top scorers and appearances by decade; countries with the most Premier League players; club open boards (surname letters at a club, and played for two clubs); most games as a manager; most penalties scored; most relegations and most promotions.

- October 2026 (3rd): from Craig's new boards document (`docs/data/Tenaball_new_boards_2026-10-03.md`): most appearances for each of 10 clubs; top scorers for France, the Netherlands, Scotland, the Republic of Ireland and Wales; top scorers and most appearances from outside England; most appearances by a goalkeeper; most seasons at one club; most goals by a defender and by a midfielder; biggest signings for nine clubs (Everton waits); and club record scorers for all 51 Premier League clubs.

- October 2026: every Premier League player since 1992/93 is in the game (Craig's dataset), and 22 surname-letter boards use it. Next from the same data: top scorers since 2000/01 for the other clubs, and appearances boards per club (the most-appearances idea above).

- October 2026: top Premier League scorers since 2000/01 for Man Utd, Liverpool, Arsenal and Chelsea. The rest of the clubs wait for the every-player dataset (`docs/PLAYER_DATABASE_BRIEF.md`), which also unlocks surname-letter boards.

- October 2026: twenty Premier League records boards from Craig's workbook (managers' wins, win rate and clubs managed; biggest single seasons; most 20-goal seasons and five every-20-goal-season boards; hat-tricks; fastest to 50 and 100; most seasons played; biggest signings, by position and club records). Sources and checks in `docs/PL_RECORDS_SOURCES.md`. Still to do from this list: most Premier League games as a manager, and record signings for each of the 10 clubs (their ten biggest buys).

- September 2026: club record scorers now draw a fresh 10 clubs each time (from the 20 checked so far).
- September 2026: most Premier League titles as a manager (`pl-at-mgr-titles`) and every club to finish in the top two (`pl-at-top2`), in place of sliding windows that broke the 4-slot rule.
