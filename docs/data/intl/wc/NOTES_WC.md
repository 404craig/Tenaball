# World Cup boards: notes (October 2026)

Boards for the men's FIFA World Cup finals tournaments (qualifying left out), researched 5 October 2026. The board JSON files are in `boards/` and follow the format in `docs/data/europe/BRIEF.md`. Raw pages are cached in the session scratchpad (`intl_raw/WC/`), not in the repo.

## Boards written

| Pick | Board | Kind | Level |
| --- | --- | --- | --- |
| wc02 | Most World Cups played | ranked, nation | 0 |
| wc03 | Most World Cup matches won | ranked, nation | 1 |
| wc04 | Most World Cup goals scored | ranked, nation (pool at 10th: Sweden, Hungary on 87) | 1 |
| wc07 | European nations at the 2026 World Cup | open, nation (16 names) | 1 |
| wc08 | 2026 World Cup top scorers | ranked, person | 1 |
| wc09 | World Cup top scorers since 1994 | ranked, person (pool of 3 on 9 for 9th and 10th) | 0 |
| wc10 | Most World Cup games since 1994 | ranked, person (pool of 5 on 20 for 10th) | 1 |
| wc11 | Most goals at one World Cup since 1994 | ranked, person (pool of 6 on 6 for 6th to 10th) | 1 |
| wc12 | World Cup final scorers since 1994 | open, person (14 names) | 1 |
| wc14 | England's World Cup scorers since 1994 | ranked, person (pool of 22 one-goal scorers for 10th) | 0 |
| wc15 | England's most World Cup games since 1994 | ranked, person (pool of 6 on 12 for 8th to 10th) | 1 |

No board was dropped.

## Rules applied

- Team boards (wc02, wc03, wc04, wc07) cover every tournament, 1930 to 2026.
- Player boards count only from the 1994 World Cup. Goals and games from earlier tournaments are taken off, and the period line says so (for example Klinsmann's 3 goals in 1990 and Maldini's 7 games in 1990).
- Shoot-outs: matches settled on penalties count as draws and shoot-out goals don't count. This is the all-time table's own convention, so wins (wc03) and goals (wc04) use it as published. Wins in extra time count as wins.
- West Germany: the game's existing World Cup boards give a West Germany slot `alts: ["West Germany", "Germany"]`. The all-time tallies (FIFA's way, which Wikipedia follows) count the pre-war Germany team, West Germany (1950 to 1990) and Germany since 1994 as one team. So on wc02, wc03 and wc04 the slot is named Germany with `alts: ["Germany", "West Germany"]`, and a note explains it. On wc07 (2026 teams) only Germany counts.
- Other successor teams as the all-time table shows them: Russia includes the Soviet Union and Serbia includes Yugoslavia. Neither reaches a top ten, but notes mention them.

## Nation names

All nations used are in `docs/data/intl/nations.txt` except one:

- **Bosnia and Herzegovina** (wc07). This is its common English name. It needs adding to nations.txt (and a flag, `ba` in the circle flag pack) before wc07 can be built.

Czech Republic and Turkey are used under the game's names; FIFA calls them Czechia and Turkiye.

## Sources and checks

### Team tallies (wc02, wc03, wc04)
- Wikipedia, "FIFA World Cup records and statistics", Overall team records (the all-time table, updated for 2026; saved as `wc_alltime_table_1930_2026.csv`).
- The same table as it stood on 29 May 2026 (revision 1356803625), before the 2026 finals.
- Wikipedia, "2026 FIFA World Cup", Tournament ranking (each team's 2026 W, D, L, goals for and against, sourced to FIFA's competition summary PDF).
- Wikipedia, "National team appearances in the FIFA World Cup" (appearance counts).

Check: for all 81 main rows, the May 2026 table plus each team's 2026 record equals the current table exactly. Germany's main row also equals its three sub-rows added together (1934 to 1938, West Germany, Germany since 1994). Appearance counts agree between the all-time table and the appearances article, and I checked each top-ten count by listing the tournaments that nation missed.

One oddity: the 2026 tournament ranking credits Jordan with 3 goals but the 2026 goalscorer list has only 1 Jordan goal (and no own goal for Jordan). This does not affect any board: Jordan is nowhere near the team top tens, and Transfermarkt's 2026 top ten (separate data) has no Jordan player. The other gaps between team goals and scorer lists are all own goals.

### 2026 top scorers (wc08)
- Wikipedia's 2026 goalscorer data (`Module:Goalscorers/data/2026 FIFA World Cup`, marked complete at 104 matches).
- Transfermarkt's 2026 World Cup top scorers list.

The two agree on the whole top ten. Mbappe 10, Messi 8, Bellingham and Haaland 7, Kane and Dembele 6, Oyarzabal 5, then exactly three on 4 (Vinicius Junior, Julian Quinones, Ismaila Sarr), so there is no pool. Eighteen players scored 3 and get near-miss notes.

### Scorers since 1994 and best single tournament (wc09, wc11)
- The goalscorer list in every tournament's Wikipedia article, 1994 to 2022, plus the 2026 data module. All of it is in `wc_scorers_1994_2026.csv`, one row per player per tournament. Each tournament's total matches its goals minus own goals: 140, 165, 158, 143, 143, 166, 157, 170 and 292.
- Transfermarkt's all-time World Cup scorers list (career totals) and Transfermarkt's top scorers list for each tournament.

Every top-ten total matches Transfermarkt's career total once the pre-1994 goals come off. For wc11, every tournament's leading scorers agree between Wikipedia and Transfermarkt. Each player counts once, at his best tournament: Mbappe's 8 in 2022 and Messi's 7 in 2022 are left out, and Kane scored 6 in both 2018 and 2026.

### Games since 1994 (wc10)
- Transfermarkt's World Cup record appearances list.
- Opta Analyst, "Most FIFA World Cup Appearances by a Player" (20 July 2026, after the final).
- Wikipedia's records page confirms Messi's 34.

Every player on 20 or more has the same total in Transfermarkt and Opta. Opta's text says Maldini played all seven of Italy's games in 1990, so he has 16 from 1994. Matthaus (25) and Maradona (21) both fall well below 20 once pre-1994 games come off: Matthaus could have played at most 10 games in 1994 and 1998, and Argentina played only 4 in 1994. I did not check their exact split by tournament. Seeler, Zmuda and Lato played only before 1994. Five players on 20 (Cafu, whose first World Cup was 1994, Mascherano, Lahm, Schweinsteiger and Lloris) share 10th. The players on 19 named in the notes come from Transfermarkt only.

### Final scorers (wc12)
- Wikipedia, "List of FIFA World Cup finals" (scores), and each final's own article from 1998 to 2026 (match box scorers).
- The 2026 final: Ferran Torres scored in the 106th minute, Spain 1-0 Argentina after extra time. The final article and the 2026 goalscorer data both have this, and Wikipedia cites BBC Sport for it.

The scorers add up to each final's score. 1994 ended 0-0, so it has no scorers. Mandzukic scored an own goal and a goal in 2018 and counts for the goal. Shoot-out penalties (Grosso 2006, Montiel 2022) don't count. The 14 names are: Zidane, Petit, Ronaldo Nazario, Materazzi, Iniesta, Gotze, Mandzukic, Perisic, Griezmann, Pogba, Mbappe, Messi, Di Maria and Ferran Torres.

### England (wc14, wc15)
- Wikipedia, "England at the FIFA World Cup" (top goalscorers, most appearances, England's goals by tournament).
- Transfermarkt's England squad stats for each World Cup, 1998 to 2026. These are saved as `eng_wc_apps_1998_2026.csv`. Their goals per tournament match England's goals less own goals: 7, 6, 5, 3, 2, 12, 13 and 20.
- englandstats.com, World Cup Finals page (most caps and most goals at World Cup finals).

For goals, the three sources agree for every scorer. For games, englandstats agrees with the Transfermarkt sums for every player on 11 or more, and Wikipedia's list agrees for the top seven. England didn't qualify in 1994, so these boards really run from 1998, and the period line says so. Twenty-two England players scored exactly one goal, so they all share 10th place on wc14. That is a big pool, but it is what the tie gives.

## Player names

I used the game's spellings from index.html: Ronaldo Nazario (the Brazilian), Kylian Mbappe, Thomas Muller, Mario Gotze, Andres Iniesta, Angel Di Maria, Davor Suker, Nicolas Otamendi, Ismaila Sarr, Julian Quinones, Ferran Torres and so on. Every person name on these boards is already in index.html.

## Uncertain or worth a look

- wc14's 10th place is a pool of 22 one-goal scorers, which makes that slot easy to fill. It could instead be cut to nine fixed answers plus the pool, or the board could be dropped if Craig thinks the pool is too loose.
- wc11 has six players on 6 goals for five places, and wc15 has six players on 12 games for three places. Both are normal pools.
- wc07 needs Bosnia and Herzegovina added to the nation list.
- The 2026 figures rely on Wikipedia, Transfermarkt, Opta and englandstats as updated after July 2026. They all agree, but none of it can be checked against an official FIFA technical report yet.
