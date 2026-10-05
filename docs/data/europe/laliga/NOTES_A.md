# La Liga research notes (A), October 2026

## Data built

- `players.csv`: every player with at least one La Liga game, every club, 2000/01 to 2025/26 (520 club seasons, 14,502 rows). Columns: season, club, player, position, nationality, apps, goals, assists, tm_player_id, source. Taken from Transfermarkt club season stats pages (`/leistungsdaten/verein/<id>/plus/1?reldata=ES1%26<year>`); each season's clubs and ids came from the Transfermarkt table page (`/laliga/tabelle/wettbewerb/ES1/saison_id/<year>`). Players listed but unused (0 games) are left out. Goals shown as "-" for a player who played are 0.
- Assists: Transfermarkt's assist records are incomplete for some early seasons. Where a club season's assists add up to less than 40 percent of its goals, the assists column is left blank (unknown) for that club season, rather than 0. That affects 59 club seasons: most of 2000/01, almost all of 2004/05 to 2006/07. All other club seasons keep 0 as a real 0.
- Names are plain ASCII from Transfermarkt, with a few changed to the game's or the common English spelling: Ronaldo (Brazilian) is Ronaldo Nazario, Daniel Carvajal is Dani Carvajal, Marc ter Stegen is Marc-Andre ter Stegen, Reinildo Mandava is Reinildo (`names_override` in the build script). Clubs use `clubs_laliga.txt`; every club in these seasons is on that list.
- Counting is by Transfermarkt player id. Some names belong to two players (for example two Raul Garcias and two Kokes, plus about 80 common Spanish names); they stay separate.
- `club_season_checks.csv`: each club season's player goals against the table's goals for. Most gaps are 0 to 3 (own goals). Gaps over 4, flagged CHECK: Sevilla 2002/03 (6), Deportivo 2003/04 (7), Barcelona 2005/06 (5), Valencia 2014/15 (5), Espanyol 2018/19 (5), Barcelona 2020/21 (5). None of these changes a board: the board players in those seasons (Eto'o 2005/06, Messi 2020/21) were checked against Wikipedia and agree.
- `squads_2025_26.csv`: every player with a league game in 2025/26, with club (611 rows).

## Top scorer check against the game (laliga-ts boards in index.html)

Every season from 2000/01 to 2025/26 agrees with the dataset except:
- 2003/04: the game says Ronaldo Nazario 25 goals. Transfermarkt and the Wikipedia season page (Pichichi table) both have 24.
- 2004/05: the game has Diego Forlan alone on 25. Transfermarkt and Wikipedia both have Samuel Eto'o on 25 as well (Forlan got the Pichichi). The game may want Eto'o as an alternative for that year.

## Second sources

- 2025/26 boards: ESPN (core API season leaders and the 2025/26 team rosters with season stats). Goals for the top 13 scorers match exactly; appearances and goals match player by player for Real Madrid, Barcelona and Atletico Madrid. Players not on ESPN's end-of-season rosters (Endrick, Dro Fernandez, Javi Galan, Conor Gallagher, Giacomo Raspadori) were checked against their Wikipedia career tables and agree. The top ten scorers also match Wikipedia's 2025/26 La Liga page.
- Since 2000/01 boards: each top-13 player's Transfermarkt seasons were compared season by season with the La Liga rows of his Wikipedia career statistics table (fetched with `action=raw`, as the API was rate-limiting). Also checked against Wikipedia's List of La Liga top scorers.
- es09: each player's best season checked against that season's Wikipedia top scorers (Pichichi) table.

## Disagreements

- David Villa 2006/07: Transfermarkt 15, Wikipedia 16. Shown as "185 or 186 goals" on es07.
- Luis Suarez 2016/17: Transfermarkt 28, Wikipedia 29; 2018/19: 19 and 21. Shown as "176 or 179 goals" (es07) and "144 or 147 goals" (es16). The order does not change.
- Assists 2025/26 (ess02): Transfermarkt and ESPN differ for several players (Rashford 10 and 7, Pepe 10 and 8, Yamal 12 and 11, Abde 9 and 8, Brahim Diaz 8 and 6). Yamal is first on both. The same nine names follow on ESPN's top ten, but in a different order, so places 2 to 10 are one pool of ten names (those nine plus Brahim Diaz, who ties for 9th on Transfermarkt).
- Smaller differences that don't touch a board: Raul Garcia 2014/15 goals (5 and 4), Dani Parejo 2014/15 (11 and 12), Jesus Navas 2007/08 (5 and 4), Javier Saviola 2012/13 games (26 and 27), Marc Pubill 2025/26 games (19, ESPN 20).

## Boards written (17)

ess01, ess02, esc0a, esc0b, esc0c, esc1a, esc1b, esc1c, esc2a, esc2b, esc2c, es07, es08, es09, es15, es16, es17.

Pools: ess02 (places 2 to 10), esc0a none (four players on 2 goals fill 7 to 10 exactly), esc0c (Huijsen, Carreras, Bellingham on 28 for 10th), esc1a (Cancelo, Pedri, Bernal on 2 for 9th and 10th), esc2a (Molina, Gallagher, Koke, Baena on 2 for 8th to 10th), esc2c (Almada, Baena on 27 for 10th), es09 (Guiza, Higuain, Benzema, Diego Costa, Lewandowski on 27 for 10th).

Open boards: esc0b (35 names), esc1b (29), esc2b (36). Examples are the ten with the most games. Notes cover players who played for the club in 2024/25 but not in 2025/26.

## Boards dropped

None.

## Uncertain

- es09's 10th place is a pool of five for one place, which is generous but is what the data says.
- Assist figures depend on the provider; ess02 is built to accept either source's top ten.
- The raw cache folder `euro_raw/A/` is shared with the other leagues' "A" agents. My Transfermarkt table pages there are saved as `table_<year>.html` and are La Liga tables; another league's agent reading the same names would get La Liga. My ESPN files are under `euro_raw/A/laliga/`.
