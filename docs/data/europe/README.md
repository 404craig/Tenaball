# La Liga, Bundesliga, Serie A, Ligue 1 and Top 5 boards (October 2026)

These are Craig's picks from the Europe question picker, built into `index.html` by `scripts/build-europe-records.py` (run from the repo root after changing anything here):
- `EXTRA_Q6`: the boards
- `EURO_OPEN`: the open boards
- `EURO_PEOPLE`: every 2025/26 squad player, so wrong answers are recognised

Every board covers league seasons 2000/01 to 2025/26 (Craig, 5 October 2026: not from 1992/93 for these leagues), or 2025/26 alone. Transfer fees run to the end of the summer 2026 window.

## What's here

- **`BRIEF.md`:** the rules and output format the research agents worked to.
- **`<league>/players.csv`:** every player's league apps, goals and assists per club and season, 2000/01 to 2025/26, from Transfermarkt. Each club's goals were checked against its table (`club_season_checks.csv`), and each season's top scorer against the game's own boards.
- **`<league>/tables.csv`:** the final tables. Each was checked three ways: Wikipedia, football-data.co.uk results with deductions added, and Transfermarkt. The 2024/25 and 2025/26 tables were added to the game.
- **`<league>/squads_2025_26.csv`:** every player with a 2025/26 league game.
- **`<league>/derby.csv`:** every El Clasico, Der Klassiker and Milan derby league match since 2000/01, with its scorers.
- **`<league>/transfers.csv`:** every fee, with Transfermarkt's figure and a news report.
- **`<league>/boards/<pick>.json`:** one board each, with its sources and checks.
- **`NOTES_*.md`:** method, second sources, disagreements and choices, one file per agent.

## Decisions

- **Second sources:** every top ten on the since-2000 player boards was checked against a second source (Wikipedia career tables, Transfermarkt game logs, ESPN). Where two sources disagree by a goal or a game, the board shows both, and an uncertain order becomes a pool.
- **2025/26 assists:** Transfermarkt and ESPN count assists differently, so the lower places on those boards are wide pools.
- **4-slot rule:** cup and award windows were kept only where they pass. No DFB-Pokal window before 2017 passes (Bayern). Coppa Italia windows after 2008 fail (Juventus). Coupe de France windows after 2007 fail (PSG). Ligue 1 Player of the Year can't reach 2021/22 (Mbappe).
- **Manager boards:** they stop at the end of 2025/26, so Mourinho's June 2026 return to Real Madrid isn't counted.
- **Transfers:** ranked by the guaranteed fee in euros as reported at the time. A loan with an obligation to buy counts at the obligation fee. Swap deals count only where each player was given a fee. See `top5/NOTES_T.md` for the borderline rows.
- **Not built:**
  - The 2026 Ballon d'Or top ten, which waits for the ceremony on 26 October 2026.
  - World record transfers in order: only eight records were set after July 2000.
- **Easy boards:** these were set by the build script, so every league has some.
- **New clubs:** Pisa and Paris FC were promoted for 2025/26 and are added as clubs.
- **Corrections made to the existing boards along the way:**
  - La Liga 2003/04 top scorer: Ronaldo scored 24, not 25.
  - La Liga 2004/05: Eto'o now counts with Forlan.
  - Ligue 1 shared top scorers now accept both names: 2001/02 Pauleta, 2011/12 Nene, 2019/20 Ben Yedder and 2024/25 Greenwood.
