# Serie A notes (agent A, October 2026)

## What was built

- `players.csv`: every player with at least one Serie A appearance for every club in every season from 2000/01 to 2025/26 (14,924 player club seasons, 512 club seasons). Columns: season, club, player, position, nationality, apps, goals, assists, tm_player_id, source. Players who were in a squad but never played are left out.
- `club_season_checks.csv`: each club season's player goals against the goals for in the Transfermarkt table.
- `squads_2025_26.csv`: every player who played a Serie A game in 2025/26 (608 rows; 22 players appear twice because they played for two clubs).
- Boards in `boards/`: its01, its02, itc0b, itc1b, itc2b, itc3b, it07, it09, it14, it15, it16, it17. (The other files in `boards/` are from other agents.)

## Sources

- Transfermarkt league tables, `/serie-a/tabelle/wettbewerb/IT1/saison_id/<year>` (clubs, ids, goals for).
- Transfermarkt club season stats, `/<club>/leistungsdaten/verein/<id>/plus/1?reldata=IT1%26<year>` (apps, goals, assists, position, nationality; the first flag is taken as nationality).
- Transfermarkt player game logs, `/ceapi/performance-game/<player id>` (every game a player played, used as a second count built from single matches).
- English Wikipedia player articles, Career statistics club table (read with `index.php?action=raw`, because the API was rate-limited from this machine).
- ESPN season leaders for Serie A 2025 (`sports.core.api.espn.com/v2/sports/soccer/leagues/ita.1/seasons/2025/types/1/leaders`), for the 2025/26 goals and assists boards.
- Wikipedia `2025-26 Serie A` article (Top goalscorers table) for its01.

All raw pages are cached under the scratchpad at `euro_raw/A/seriea/`. Every cached table page shows `wettbewerb/IT1` and the right `saison_id`, and every club page's own link is `reldata=IT1%26<year>` for the year in its file name (checked after the shared cache warning; nothing needed refetching).

## Club names

Game names from `clubs_seriea.txt`, mapped by Transfermarkt id: AC Milan (5), Parma (130), Siena (1387), Venezia (607), Livorno (1210), Ancona (1388), Empoli (749), Chievo (862), Verona (276, Hellas), Messina (1104), Palermo (458), Spezia (3522). **Pisa (4172) is not on the list**: promoted for 2025/26, written as "Pisa".

## Checks

- **Goals against the table.** 503 of 512 club seasons are within 0 to 4 goals (own goals). Gaps of 5 (taken as own goals): Empoli 2005/06, Napoli 2014/15, Juventus 2016/17, Pescara 2016/17, Roma 2017/18, Inter 2020/21, Como 2024/25. Explained exceptions: Sassuolo 2016/17 is -1 and Pescara 2016/17 +5 because Sassuolo 2-1 Pescara was awarded 0-3 to Pescara (ineligible player); Verona 2020/21 is +8 because Verona 0-0 Roma was awarded 3-0 to Verona (Roma fielded an ineligible player), so 3 table goals have no scorer and 5 are own goals.
- **Starts.** Appearances minus substitute appearances add up to 38 x 11 = 418 starts (34 x 11 = 374 for the 18-team seasons) in 502 club seasons, including Inter, Juventus, Napoli and AC Milan in 2025/26. The few short ones are 11 starts short where one game has no line-up: Cagliari and Roma 2012/13 (Cagliari v Roma was awarded 0-3 and not played), and Empoli and Messina 2005/06 (one game with no line-up on Transfermarkt); and small Transfermarkt gaps (Inter and Fiorentina 2024/25 are 2 starts short, Roma 2013/14 and 2023/24 one short, Genoa 2013/14 five short). Pisa 2025/26 is 11 starts and about 1,050 minutes short, so one Pisa game has no line-up on Transfermarkt: a player who only played in that game could be missing from `squads_2025_26.csv`.
- **Season top scorers** match every `seriea-ts-` board in index.html, 2000/01 to 2025/26, including the shared seasons (Trezeguet and Hubner 2001/02, Icardi and Toni 2014/15, Icardi and Immobile 2017/18) and Lautaro Martinez's 17 in 2025/26. No season disagrees.
- **Counting by player id.** 22 names are shared by two different Transfermarkt ids (Adriano, Ronaldo, Emerson, Julio Cesar, Marco Rossi and others). They are kept apart, and none of them changes a board.
- **Assists.** Transfermarkt shows "-" for zero, and every club season since 2000/01 has assists recorded (league totals 0.62 to 0.84 assists a goal), so assists in `players.csv` are 0 or more and no unknown value was found. Assists from the early 2000s are less complete than recent ones and should be trusted less; no board uses them.

## Board by board

- **it07, it14, it15, it16, it17** (since 2000/01 goals): every top ten player and the near misses that decide the cut were counted three ways: Transfermarkt club pages, the player's Transfermarkt game log, and his Wikipedia career table (Serie A seasons from 2000/01 only, for that club). All three agree exactly for every player in the ten and at the cut. A few names lower down in the notes (Mandzukic, Iaquinta, Bacca, Theo Hernandez, Palacio, Vucinic, De Rossi) were checked only against the game log. Tight cuts: it07 Berardi 130 v Del Piero 129; it14 Vidal and Morata 35 v Marchisio 33; it15 Kessie 35 v Pirlo 32; it16 Cambiasso 41 v Recoba and Marcus Thuram 40. No disagreements, so no "or" values and no pools on these boards.
- **it17** counts Serie A goals for Roma and Napoli together. None of the players in the ten played for both clubs.
- **it09**: best single season per player, goals for two clubs in one season added. Clean ten (the 26-goal seasons of Totti, Crespo, Quagliarella, Belotti and Osimhen are joint 11th, in the notes). Checked against game logs and Wikipedia (Crespo and Belotti only against the game log; Crespo's 26 is also on the game's 2000/01 top scorer board).
- **its01**: Transfermarkt, game logs, ESPN and Wikipedia all agree. Seven players tied on 10 share places 8 to 10 (pool `its01-10`: Bonazzoli, Davis, Krstovic, McTominay, Orsolini, Scamacca, Yildiz).
- **its02**: assists differ between providers. Transfermarkt and ESPN agree on the top four players (Dimarco 18 or 17, Barella 9 or 8, Jesus Rodriguez 9, Lauriente 9). Below that the two order the 6 and 7 assist players differently (Transfermarkt: Dybala, Nico Paz and Yildiz 7, then eight on 6; ESPN: seven on 6), so places 5 to 10 are one pool of the 12 players who are on 6 or more in either source. Ange-Yoan Bonny is 6 on Transfermarkt but 4 on ESPN (a gap of two), and Maxence Caqueret is 6 on ESPN but 5 on Transfermarkt; both are in the pool. Craig may prefer to drop this board if a pool of 12 for 6 places is too loose.
- **itc0b to itc3b** (open boards): every player with a league appearance for the club in 2025/26 (Inter 29, Juventus 27, Napoli 29, AC Milan 26). Checked internally: the club's starts add up to 418 and its player goals add up to the table's goals for, less own goals. Examples are the ten with most games, ties broken by minutes played (Inter's tenth is Lautaro Martinez on 30 games, ahead of Luis Henrique and Mkhitaryan on 30 on minutes).

## Names to watch

- "Giovane" (Verona, 2025/26) is a different player from Giovane Elber, who is already in the game.
- "Adriano" on it16 is Adriano Leite Ribeiro (Inter); Transfermarkt has a second Adriano in Serie A in this period.
- Transfermarkt names were converted to plain ASCII (Lautaro Martinez, Rasmus Hojlund, Nicolo Barella, Kenan Yildiz, Armand Lauriente, Jesus Rodriguez, Kaka, Rafael Leao, Franck Kessie). Single names are kept as Transfermarkt has them (Bremer, Kaka, Adriano, Giovane).

## Dropped

Nothing dropped. its02 is the least certain board (see above).
