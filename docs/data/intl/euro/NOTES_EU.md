# European Championship boards (eu02 to eu11): notes

Researched 5 October 2026. Men's European Championship finals tournaments only; qualifying is left out. Euro 2020 was played in 2021 and is labelled 2020 throughout. The latest tournament is Euro 2024.

## Boards written

All ten picks were built, in `boards/`:

| Pick | Board | Level | Kind |
|---|---|---|---|
| eu02 | Most Euros played | 0 | ranked, nation |
| eu03 | Most Euros matches won | 1 | ranked, nation |
| eu04 | Most Euros goals scored | 1 | ranked, nation |
| eu05 | Euros top scorers since 1996 | 0 | ranked, person, pool of 9 for 6th to 10th (all on 6) |
| eu06 | Most Euros appearances since 1996 | 1 | ranked, person, pool of 5 for 9th and 10th (all on 17) |
| eu07 | Most goals at one Euros since 1996 | 1 | ranked, person, pool of 8 for 8th to 10th (all on 4) |
| eu08 | Euros final scorers since 1996 | 1 | open, 16 names |
| eu09 | England's Euros scorers since 1996 | 0 | ranked, person, pool of 16 for 10th (all on 1) |
| eu10 | England's most Euros appearances since 1996 | 1 | ranked, person, pool of 4 for 9th and 10th (all on 10) |
| eu11 | Euro 2024 top scorers | 1 | ranked, person, pool of 10 for 7th to 10th (all on 2) |

None was dropped. No board breaks the 4-slot rule (every answer fills one slot).

## Sources

1. **Wikipedia, "UEFA European Championship records and statistics"** (wikitext via the API, updated to Euro 2024): ranking of teams by appearances, overall team records table (played, won, drawn, lost, goals), player records.
2. **martj42/international_results** on GitHub (`results.csv`, `goalscorers.csv`, `shootouts.csv`): every Euros finals match (1960 to 2024, 388 matches) with its score after extra time, and every goal with scorer, minute and own-goal flag. I worked out the team totals and the scorer lists from it with a script. Its goal rows add up to every match score (no mismatches).
3. **UEFA's own player stats** (`compstats.uefa.com/v1/player-ranking`, competition 3, one call per tournament from 1996 to 2024): appearances and goals for every player at each tournament. uefa.com itself refuses connections from this machine; the stats API answered.
4. **Transfermarkt**: the Euros all-time appearance list (`/europameisterschaft/rekordspieler/pokalwettbewerb/EURO`, top 150) and England's squad stats for each Euros (`/england/leistungsdaten/verein/3299/plus/1?reldata=EURO%26<season>`, seasons 1995, 1999, 2003, 2011, 2015, 2020, 2023).
5. **Wikipedia, "List of UEFA European Championship finals"**: scorers in each final.

Raw files: `euro_team_records.csv` (every nation's totals, worked out from source 2), `euro_players_1996_2024.csv` (every player who played from 1996 to 2024, from source 3, with apps and goals for each tournament), `euro_final_scorers_1996_2024.csv`. Cached pages are in the scratchpad (`intl_raw/EU/`).

## Checks

- **Team boards (eu02 to eu04):** every figure in the top 13 of Wikipedia's appearances ranking and overall records table matches my totals from results.csv: tournaments, wins and goals for each nation.
- **Scorers (eu05, eu07, eu09, eu11):** UEFA's goals for each player at each tournament from 1996 to 2024 match goalscorers.csv goal for goal: 717 goals in each, and the only differences are spellings (Joao Vieira Pinto and Joao Pinto, Dani Guiza and Daniel Guiza, Icelandic names). England's list and the Euro 2024 list agree exactly in both, and the script asserts it.
- **Appearances (eu06, eu10):** UEFA's appearances summed over 1996 to 2024 match Transfermarkt's all-time list for every player in the top 30. For England, UEFA and Transfermarkt agree for every player at every tournament from 1996 to 2024, with no differences. Appearances include games as a substitute.
- **Final scorers (eu08):** goalscorers.csv matches the Wikipedia list of finals for 1996 to 2024. Shaw and Bonucci (2021) are not named in that article's text, but the records page names them (fastest goal in a final, oldest scorer in a final).

## Decisions

- **Former nations.** On ranked team boards I followed UEFA's and Wikipedia's successor convention and the game's existing `wc-most-finals` board ("West Germany counts as Germany"): West Germany counts as Germany, the Soviet Union and the CIS (1992) as Russia, and Czechoslovakia as the Czech Republic. Each brief says so. The rows for those three nations carry `alts` (`["Germany","West Germany"]`, `["Russia","Soviet Union"]`, `["Czech Republic","Czechoslovakia"]`), the same way the game's year boards accept the old names. Without the merges Russia would have 6 tournaments, 6 wins and 22 goals and would drop off all three boards (Craig's example for eu02 includes Russia, so the merge seems to be what he meant). The Czech Republic alone has 8, 12 and 39, and Germany from 1992 has 9, 21 and 64. Wikipedia also credits Czechoslovakia's record to Slovakia; that doesn't affect any top ten. The CIS is not in `nations.txt`, but it only appears inside Russia's total, so nothing needs adding.
- **Penalty shoot-outs** count as draws for wins (eu03), the usual statistical convention and the one Wikipedia's table uses. Shoot-out kicks are not goals. Extra-time goals and wins count. The 1968 final replay counts as a match.
- **Player boards count from Euro 96.** None of the leading scorers or appearance-makers since 1996 played at a finals before 1996 except where noted (Shearer played at Euro 92 but did not score; Thuram, Blanc, Maldini and others are well outside the cut either way). The cut only removes players like Platini (9 goals, all in 1984), whose names have notes.
- **eu07:** each player counts once, for his best tournament. Ronaldo's best is 5 in 2020.
- **eu11:** six players shared the Golden Boot on 3 goals (UEFA gave it to all six). Ten players scored 2, so they share the last four places.
- Own goals are never credited to a player (for example Simon Kjaer's own goal for England in 2021 is not counted).

## Names

All names are plain ASCII, using the game's spelling where the player is already in index.html (Pepe, Eder, Thomas Muller, Joao Moutinho, Zlatan Ibrahimovic, Alvaro Morata, Niclas Fullkrug, Fabian Ruiz). These players are not yet in index.html and use their usual English spelling: Nuno Gomes, Marco Delvecchio, Angelos Charisteas, Razvan Marin, Merih Demiral. All nations used are in `nations.txt`.

## Uncertain

- Nothing in the figures: every number was checked against two sources that agree. The one judgement call is the successor merge on the team boards (see Decisions). If Craig wants the old nations kept separate, eu02 to eu04 need rebuilding from `euro_team_records.csv` with the merge map removed. Russia drops out of all three and Belgium (7 tournaments, 12 wins, 33 goals) and others come in.
