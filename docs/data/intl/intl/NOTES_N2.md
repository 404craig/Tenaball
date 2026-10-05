# Notes from N2: Brazil, Argentina, Uruguay

Boards written (all `ranked`, `person`):

| Pick | Board | Level |
| --- | --- | --- |
| b01-bra | Brazil's all-time top scorers | 0 |
| b02-bra | Brazil's most capped players | 1 |
| b03-bra | Brazil's top scorers since 2000 | 1 |
| b04-bra | Brazil's most caps since 2000 | 1 |
| b01-arg | Argentina's all-time top scorers | 0 |
| b02-arg | Argentina's most capped players | 1 |
| b03-arg | Argentina's top scorers since 2000 | 1 |
| b04-arg | Argentina's most caps since 2000 | 1 |
| b03-uru | Uruguay's top scorers since 2000 | 1 |
| b04-uru | Uruguay's most caps since 2000 | 2 |

None dropped.

## Periods and what counts

- All-time boards: every official full international to the 2026 World Cup final, 19 July 2026. Brazil's last game in the period was 5 July (lost to Norway in the round of 16), Argentina's 19 July (the final, lost to Spain after extra time), Uruguay's 26 June (group stage). September and October 2026 games are left out everywhere: Brazil v Australia (twice) and India, Argentina's two October friendlies, Uruguay's two September friendlies. The planned March 2026 Argentina v Spain game was not played.
- Since-2000 boards: matches from 1 January 2000 to 19 July 2026, counted match by match. A player whose career straddles 2000 counts only his games and goals from 2000 on (for example Cafu 57 caps, Roberto Carlos 59, Zanetti 97, Ronaldinho 84 caps and 26 goals, Ronaldo 26 goals, Rivaldo 17, Crespo 28, Abreu 23).
- FIFA official matches only, as RSSSF and Wikipedia do. The CBF also counts games against clubs and select sides; those are out (for example Kuwait SC in 2006, which Transfermarkt's career totals include, so its Cafu 143 and Roberto Carlos 127 are higher than the official 142 and 125).
- The 1968 Brazil v FIFA XI game: the CBF, RSSSF's tables and Wikipedia's tables keep it, but FIFA struck it off in 2001. Following the brief (FIFA official matches), it is left out. That changes three near misses: Tostao 31 goals (not 32), Rivellino 25 goals (not 26), and Pele 91 caps (not 92; his 77 goals are unchanged). Effect on the boards: Ademir (32) is 10th on Brazil's all-time scorers on his own. With the FIFA XI game counted, Tostao would tie him on 32 and 10th would be a pool of Ademir and Tostao; Craig may prefer that.
- Friendlies with more than six substitutes (Brazil v UAE 2005, several Argentina 2026 friendlies) are counted, as RSSSF, Wikipedia and Transfermarkt count them. National Football Teams lists a few such games as non-FIFA; its FIFA and non-FIFA columns are added together for the checks.

## Sources and method

- RSSSF record international players pages for Brazil (to 18 November 2025), Argentina (to 14 November 2025) and Uruguay (to 21 November 2023), plus RSSSF's Bebeto goals list.
- Wikipedia: each nation's records and statistics page (Brazil's dated 25 September 2026, Argentina's 3 October 2026, Uruguay's 31 March 2026) and player articles (infobox and caps-by-year tables), fetched through the API.
- Transfermarkt: the national team's fixtures for every year 2000 to 2026 (`/spielplan/verein/<id>/saison_id/<year>`, ids 3439 Brazil, 3437 Argentina, 3449 Uruguay) and every match report in the period (1,049 matches played: Brazil 376, Argentina 348, Uruguay 325), parsed for the starting eleven, substitutes who came on and scorers (own goals left out). Each match's goal count was checked against its score; the only mismatches were shoot-outs and four Uruguay games with missing data (below). The record players pages (`/rekordspieler/`) gave current career totals.
- National Football Teams (`national-football-teams.com/country/<id>/<year>/<Nation>.html`, ids 28 Brazil, 9 Argentina, 198 Uruguay): every player's caps, substitute caps and goals per year, 2000 to 2026, as the second source for the since-2000 boards. Its 2026 tables include Brazil's 25 September game and Uruguay's 24 September game but no October games; those were taken off player by player using the Transfermarkt reports.
- Raw data: `N2_matches.csv` (every match parsed), `N2_<nation>_since2000.csv` (Transfermarkt and National Football Teams counts side by side, to 19 July 2026, with Transfermarkt's year-by-year split), `N2_alltime.csv` (all-time figures from each source). Raw pages are cached in the scratchpad (`intl_raw/N2/`).

Transfermarkt and National Football Teams agree on the since-2000 figure of every player in all six since-2000 tens and on 11th and 12th, except where noted below. A year-by-year comparison of the two for the top 60 players of each nation found only these differences: Transfermarkt has no or partial line-ups for four Uruguay games (China in January 2000, Bosnia in January 2001, Tunisia in June 2006, Venezuela at the 2007 Copa America), so it is a cap short for Forlan, Cristian Rodriguez, Lugano, Diego Perez and a few others (National Football Teams, RSSSF and Wikipedia agree on the higher figures, which are used); Gabriel Jesus's 2016 goals (below); and a few one-cap differences between years that cancel out.

## Disagreements and decisions

- Bebeto (b01-bra, 6th): RSSSF 39 (match list) and his Wikipedia infobox 39; Wikipedia's records table 38; Transfermarkt 40 (unofficial games). 39 used.
- Gabriel Jesus (b03-bra, 10th): Transfermarkt and Wikipedia 19, RSSSF and National Football Teams 18; the difference is one 2016 World Cup qualifier goal. Fred has 18. 10th is a pool of Gabriel Jesus and Fred, val "18 or 19 goals". Fred's 18 includes two against the UAE in 2005 (eight substitutes; National Football Teams calls it non-FIFA, RSSSF, Wikipedia and Transfermarkt count it).
- Philippe Coutinho (b03-bra, 8th): Transfermarkt, National Football Teams and Wikipedia 21, RSSSF 20. 21 used; he is 8th either way (Richarlison 20).
- Gilberto Silva (b04-bra, 7th): RSSSF, Transfermarkt and National Football Teams 93, his Wikipedia infobox 89. 93 used; he is in the ten either way (11th is Ronaldinho on 84).
- Marquinhos: 110 at 19 July 2026 (RSSSF 103 plus 7 games in 2026; Transfermarkt match reports and National Football Teams agree). Wikipedia's 111 and Transfermarkt's current 112 include September 2026 games.
- Sergio Aguero and Gonzalo Higuain (b01-arg, b03-arg): Wikipedia, Transfermarkt and National Football Teams 41 and 31, RSSSF 42 and 32. 41 and 31 used. Neither changes who is in the ten.
- Batistuta 56 and Maradona 34: Wikipedia and RSSSF (Transfermarkt 55 and 33). Zanetti 145 and Ayala 115: Wikipedia and RSSSF (Transfermarkt 144 and 114).
- Diego Simeone (b02-arg, 7th): Wikipedia's records table and National Football Teams 104, Transfermarkt 105, RSSSF 106 (it includes 1995 and 1996 games against a Slovakia league XI and a Poland B league XI, which it says the AFA and FIFA recognise); his Wikipedia infobox says 108. 104 used; he is 7th on every count (Ayala 115, Aguero 101).
- Lautaro Martinez: 40 goals and 84 caps at 19 July 2026 (RSSSF 36 goals plus 4 in 2026; Transfermarkt and National Football Teams agree). Wikipedia's 42 and 86 on 3 October include two October games. On b01-arg he is 4th behind Aguero (41).
- Fernando Muslera (b04-uru, 3rd): 137 from Transfermarkt, National Football Teams (136 FIFA plus 1 non-FIFA), and his Wikipedia infobox and caps-by-year table. Wikipedia's records table gives 135 on 31 March 2026, one more than the match reports at that date. 137 used; he is 3rd either way unless the true figure were 135 or less (Cavani 136).
- Jose Maria Gimenez: 99 at 19 July 2026 (Transfermarkt, National Football Teams); his Wikipedia infobox's 100 includes 24 September 2026.
- Ties at the cut become pools: Brazil all-time caps 10th (Ronaldo and Djalma Santos, 98), Argentina all-time scorers 10th (Leopoldo Luque and Daniel Passarella, 22), Uruguay since-2000 scorers 10th (Diego Lugano and Federico Valverde, 9), Brazil since-2000 scorers 10th (above). Ties inside the ten (for example Di Maria and Higuain on 31, Lautaro Martinez and Paredes on 84) just take consecutive places.

## Names

- Spellings follow index.html where the player is already there: "Ronaldo" (Ronaldo Nazario), "Pele", "Kaka", "Lucio", "Julio Cesar", "Dani Alves", "Philippe Coutinho", "Gabriel Jesus", "Angel Di Maria", "Rodrigo De Paul", "Lionel Messi", "Jose Maria Gimenez", "Darwin Nunez", "Cristhian Stuani".
- "Fred" on b03-bra is Fred the striker (Frederico Chaves Guedes, born 1983). The game's existing "Fred" is the Manchester United midfielder (Frederico Rodrigues, who also played for Brazil: 32 caps, no goals). Both answer to "Fred"; the board means the striker. Worth a look when building.
- Single names used as commonly known: Ademir (Ademir de Menezes), Taffarel (Claudio Taffarel), Djalma Santos, Jairzinho, Zico, Bebeto.
- Nations: Brazil, Argentina and Uruguay are all in nations.txt.

## Wrong-answer list

`people_N2.txt`: 203 names: about the top 30 all-time scorers and caps for Brazil, Argentina and Uruguay (from RSSSF and Wikipedia) and the top 30 since 2000 in caps and goals for each (from the match counts).
