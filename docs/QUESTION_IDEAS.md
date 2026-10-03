# Question ideas

Questions Craig wants added, waiting for data to be sourced. The rules in `CLAUDE.md` apply to every one: exactly 10 answers, no answer filling 4 or more slots, Premier League era only (from 1992/93) for player and club data, a date line on every board, and only data checked against a source.

When one is built, move it to the "Built" list at the bottom with the date.

## Premier League

| Idea | Notes |
| --- | --- |
| Most appearances for [club], for the same 10 clubs as the club scorer boards (Man Utd, Liverpool, Arsenal, Chelsea, Spurs, Man City, Newcastle, Everton, West Ham, Aston Villa) | Premier League games only. Needs per-club appearance lists, for example from 11v11 or the Premier League site. |
| Relegated clubs, all-time, Premier League era | Clubs relegated the most times. The game's own final tables (`PL`) already give this: Norwich 6, then Leicester, West Brom and Burnley 5, then Palace, Middlesbrough, Sheffield Utd, Sunderland and Watford 4, with seven clubs on 3 sharing 10th (a pool). Check the counts against a source before building. |
| Most promotions to the Premier League, Premier League era | Count each time a club came up (promotion or play-off). From the game's tables: Leicester, Sunderland, West Brom, Norwich and Burnley 5, Palace, Watford and Fulham 4, with eight clubs on 3 sharing 9th and 10th (a pool). Decide whether 1992/93's promoted clubs count, and whether 2026/27's count once the season starts. |
| Record signings for [club], for the same 10 clubs | Each club's 10 biggest buys. Same fee-source question as above. |
| Most penalties scored, all clubs, Premier League era | Ties near 10th likely, use a pool. |
| Club record scorers for every Premier League club | The board now draws 10 clubs at random from a pool (`CLUB_REC`), but the pool only has the 20 clubs already checked. Add the other clubs that have played in the Premier League (Sunderland, Middlesbrough, Wolves, Stoke, Watford, Bournemouth, Brentford and so on), each checked against a source, and give each a tier (0 well known, 1 less so). |

## Other competitions

Carried over from `CLAUDE.md`:

- Club top-10 league scorers for 10 clubs in each of La Liga, Bundesliga, Serie A, Ligue 1 and the Scottish Premiership, from season-by-season player stats (for example FBref), working back from 2025/26 and stopping where data can't be verified.
- Player records (hat-tricks, fastest to 50 and 100 goals, 20-goal seasons, single-season highs), managers and transfers, per competition.

## Built

- October 2026: every Premier League player since 1992/93 is in the game (Craig's dataset), and 22 surname-letter boards use it. Next from the same data: top scorers since 2000/01 for the other clubs, and appearances boards per club (the most-appearances idea above).

- October 2026: top Premier League scorers since 2000/01 for Man Utd, Liverpool, Arsenal and Chelsea. The rest of the clubs wait for the every-player dataset (`docs/PLAYER_DATABASE_BRIEF.md`), which also unlocks surname-letter boards.

- October 2026: twenty Premier League records boards from Craig's workbook (managers' wins, win rate and clubs managed; biggest single seasons; most 20-goal seasons and five every-20-goal-season boards; hat-tricks; fastest to 50 and 100; most seasons played; biggest signings, by position and club records). Sources and checks in `docs/PL_RECORDS_SOURCES.md`. Still to do from this list: most Premier League games as a manager, and record signings for each of the 10 clubs (their ten biggest buys).

- September 2026: club record scorers now draw a fresh 10 clubs each time (from the 20 checked so far).
- September 2026: most Premier League titles as a manager (`pl-at-mgr-titles`) and every club to finish in the top two (`pl-at-top2`), in place of sliding windows that broke the 4-slot rule.
