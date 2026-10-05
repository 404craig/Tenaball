# Ligue 1 notes (agent A, October 2026)

## Files

- `players.csv`: every player with at least one Ligue 1 appearance, per club and season, 2000/01 to 2025/26 (14,349 rows, 510 club seasons). Columns: season, club, player, position, nationality, apps, goals, assists, tm_player_id, source. Position is Transfermarkt's broad group (Goalkeeper, Defender, Midfield, Attack). Nationality is the first flag Transfermarkt shows. Players listed but not used in a season are left out.
- `club_season_checks.csv`: each club season's player goals against its goals for in the table.
- `squads_2025_26.csv`: every player with a league game in 2025/26, by club (561 rows; a player who played for two clubs appears under both).
- `boards/frs01.json`, `frs02.json`, `frc0a.json`, `frc0b.json`, `fr07.json`, `fr09.json`, `fr15.json`.

## Sources and method

- League tables: `https://www.transfermarkt.com/ligue-1/tabelle/wettbewerb/FR1/saison_id/<year>` for 2000 to 2025, which give each season's clubs, Transfermarkt ids, goals for and points. 2019/20 was stopped after 27 or 28 games.
- Club season stats: `https://www.transfermarkt.com/<slug>/leistungsdaten/verein/<id>/plus/1?reldata=FR1%26<year>` for all 510 club seasons. Every cached page was checked to carry `reldata/FR1` (and every table page `wettbewerb/FR1`), so no other league's pages crept in. Raw pages are cached in the scratchpad under `euro_raw/A/ligue1/`.
- Counting is by Transfermarkt player id, so players who share a name (two Vitinhas, two Marquinhos, two Nuno Mendes and so on) stay separate.
- Assists: a dash on Transfermarkt is 0 where the club season has assist data. Where a whole club season shows no assists at all (Strasbourg 2002/03 and Istres 2004/05) the assists are left blank as unknown. Transfermarkt's assist counts for the early 2000s are thinner than later seasons; no assist board here uses them.
- Names are plain ASCII. Renamed to match the game or common English use: Alex Frei to Alexander Frei, Kang-in Lee to Lee Kang-in, Ilya Zabarnyi to Illia Zabarnyi. Letters such as o-slash are written out (Hojbjerg), not dropped.
- Clubs use `clubs_ligue1.txt`. Paris FC (2025/26) is not on that list; I used "Paris FC". Flag for the club list.

## Second sources

- Transfermarkt match logs (`/ceapi/performance-game/<player id>`, every game a player played): for 70 players (everyone near the top of the boards), the Ligue 1 games and goals from 2000/01 to 2025/26 match the season pages exactly.
- English Wikipedia career statistics tables (read with `index.php?action=raw`, as the API was rate-limited by the other agents), season by season, for 32 players. Disagreements:
  - Andre-Pierre Gignac 2010/11: Wikipedia 9 goals, Transfermarkt 8 (total 103 or 102).
  - Guillaume Hoarau 2010/11 (PSG): Wikipedia 9, Transfermarkt 10 (PSG total 38 or 39).
  - Appearance only (no board effect): Gomis 2016/17 (32 or 31), Briand 2005/06 (28 or 29), Jonathan David 2024/25 (31 or 32).
- ESPN (`sports.core.api.espn.com` leaders for fra.1 season 2025, and the PSG team leaders and roster): 2025/26 goals agree with Transfermarkt for every player in the top 17 and every PSG scorer. The PSG roster has the same 28 players with league games and the same appearance counts.
- ESPN and Transfermarkt disagree on 2025/26 assists (see frs02).

## Club season goal checks

Gaps (table goals minus player goals) are own goals for. Most are 0 to 3. Flagged, gap over 4:
- 2017/18 PSG 108 against 100 (8). Largest gap; checked the page, nothing missing that I could find (Marquinhos shows 0 goals, 2 assists). Possibly own goals plus a Transfermarkt shortfall.
- 2022/23 Marseille 67 against 61 (6).
- Gap of exactly 5: 2003/04 Lyon, 2006/07 Sedan, 2008/09 Marseille, 2009/10 Bordeaux, 2013/14 PSG, 2014/15 Marseille, 2019/20 Nantes, 2020/21 Lyon.
- 2000/01 Metz is the only negative gap: players 36, table 35.
None of these touch a board figure that wasn't also checked against Wikipedia.

## Season top scorers against the game's ligue1-ts boards

Every season 2000/01 to 2025/26 agrees on the goal total and the name. Things for the game's boards:
- Shared top scorers that the game's boards list with one name only and no alts: 2001/02 Pauleta (22, with Cisse), 2011/12 Nene (21, with Giroud), 2019/20 Wissam Ben Yedder (18, with Mbappe), 2024/25 Mason Greenwood (21, with Dembele). The brief line says "any of the winners counts", so these slots probably need `alts`.
- `ligue1-ts-2016/17` has Mbappe in six slots (2018/19 to 2023/24), which breaks the 4-slot rule.
- Spelling: Transfermarkt has "Alex Frei"; the dataset uses the game's "Alexander Frei".

## Boards

- frs01 Ligue 1 top scorers 2025/26 (medium): Lepaul 21 (20 Rennes, 1 Angers), Greenwood and Panichelli 16, Balogun 13, Edouard, Said and Sinayoko 12, then places 8 to 10 a pool of five on 11 (Barcola, Thauvin, Sulc, Tolisso, Ansu Fati).
- frs02 Ligue 1 assists 2025/26 (hard): built, but less firm. Transfermarkt and ESPN count assists differently (Thomasson and Ajorque 10 or 9; Al-Tamari 9 or 6; Kouassi 8 or 6). Nine names are top ten on both. The 10th place is a pool of the five who are top ten on both counts (Al-Tamari, Kouassi, Akliouche, Clauss, Diego Moreira). Drop it if a single agreed figure per slot is needed.
- frc0a PSG top scorers 2025/26 (medium): Barcola 11 down to Mendes and Mayulu 4; places 9 and 10 a pool of three on 3 (Zaire-Emery, Lee Kang-in, Mbaye).
- frc0b Name 10 PSG players from 2025/26 (medium, open): 28 names; examples are the ten with most games.
- fr07 Ligue 1 top scorers since 2000/01 (hard): Mbappe 191, Lacazette and Ben Yedder 161, Pauleta 141, Cavani 138, Gomis 122, Ibrahimovic 113, Payet 103, Gignac 102 or 103, Briand 102. Gameiro 101 is 11th on both sources, so no pool is needed.
- fr09 Biggest Ligue 1 seasons (medium): Ibrahimovic 38 down to David and Gignac on 24; Pauleta 23 is 11th. No tie at the cut.
- fr15 PSG top league scorers since 2000/01 (medium): Mbappe 175, Cavani 138, Ibrahimovic 113, Neymar 82, Pauleta 76, Di Maria 56, Hoarau 38 or 39, Nene 36, Lucas Moura and Dembele 34. Pastore and Barcola 29 are next.

No boards dropped.
