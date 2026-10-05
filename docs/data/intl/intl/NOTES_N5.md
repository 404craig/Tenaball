# Notes from agent N5: boards across nations and team boards

Written 5 October 2026. Boards are in `boards/` (p01 to p07, t02, t03, t05). Raw data in this folder: `N5_50_goals_wikipedia_2026-08-09.csv`, `N5_100_caps_wikipedia_2026-08-24.csv`, `N5_p05_100caps_premier_league.csv`, `N5_afcon_finals.csv`. Wrong-answer names in `people_N5.txt` (738 names: everyone on Wikipedia's 50-goal and 100-cap lists, plus every name on these boards and in their notes).

## Periods
- All-time player boards: every official full international to the 2026 World Cup final, 19 July 2026. Germany includes West Germany (the DFB's own count).
- p04: full internationals from 1 January 2000 to 19 July 2026.
- FIFA official matches are used where an association counts more (for example the CBF's unofficial games for Pele), as Wikipedia and RSSSF do.

## Method
- Wikipedia lists were read as they stood after the World Cup and before the September window: "List of men's footballers with 50 or more international goals" (revision of 9 August 2026) and "List of men's footballers with 100 or more international caps" (revision of 24 August 2026). The current versions already include September and October 2026 games (for example Kane 89, Lewandowski 92, Modric 205 on Transfermarkt), which are left out.
- Active and recent players were counted match by match from Transfermarkt's game list (tmapi.transfermarkt.technology/player/<id>/performance-game, senior national team only, games up to 19 July 2026). These matched the Wikipedia revisions for every figure in the player boards.
- Retired players: RSSSF goal-by-goal and century pages (Daei, Chhetri, Dahari, Mabkhout, Puskas, Kocsis, Muller, Klose, Keane, Dzeko, Tomasson; century list to 1 February 2026).
- National records: each nation's Wikipedia infobox (August 2026 revisions) and Transfermarkt's record caps and record scorers pages.
- AFCON: Wikipedia's Africa Cup of Nations summary table (24 August 2026) and the finals in the martj42 international results dataset.
- FIFA ranking: FIFA's own country ranking pages (last update 20 July 2026), FIFA's news story of 20 July 2026, and Wikipedia's ranking data module (20 July 2026).

## Disagreements and decisions
- Ali Mabkhout: Wikipedia 85 goals, RSSSF 84 (last updated February 2024). He is in the ten on p01 and p04 either way (Neymar 80 is next); the board shows 85.
- Martin Reim: 157 caps in his article, RSSSF and Transfermarkt, 156 in Wikipedia's list (FIFA count). Level with or one behind Vertonghen (157), so 10th on p03 is a pool of both.
- Vitalijs Astafjevs: 167 (article, RSSSF), 166 (list), 168 (Transfermarkt). Between 5th and 7th on any count; 167 used.
- Anders Svensson: 148 (infobox, RSSSF), 147 (Transfermarkt), 146 (list). Sweden's record on every count; 148 used.
- Cafu 142 (Wikipedia, RSSSF; Transfermarkt 143). Cobi Jones 164 (Wikipedia, RSSSF; Transfermarkt 163). Gareth Bale 41 goals (FAW and Wikipedia; Transfermarkt 40). None changes a record holder.
- Jon Dahl Tomasson 52 (Wikipedia, RSSSF; Transfermarkt 51): shares Denmark's record with Poul Nielsen, one slot with both names.
- Spain's ranking points: FIFA 1995.88, Wikipedia 1995.98; FIFA's figure used.
- Vivian Woodward is left out of p02: Wikipedia's 75 includes England amateur internationals; he scored 29 in full internationals.
- Mohamed Salah (note only): 68 goals in Wikipedia, 66 on Transfermarkt.

## p05 (Premier League players with 100 caps)
212 players. Wikipedia's 689 100-cap players were matched to `docs/data/pl_players/players.csv` by name and nationality and checked by hand. Left out as different people with the same name: Cafu (the Portugal player at Forest), Marquinhos (Arsenal's is not Brazil's centre-back), Matheus Pereira, Lee Dixon, Gaston Ramirez. Savo Milosevic (listed for Serbia and Montenegro, Yugoslavia in the dataset) and Claudio Bravo (no nation code in the list) were added by hand. Every player's 100 caps are confirmed by a second source: Transfermarkt counted to 19 July 2026 or RSSSF's century list; Jahanbakhsh's 101 by RSSSF's 97 on 1 February 2026 plus four games since. Names use the game's spelling (`Heung-min Son`, `Theodoros Zagorakis`, `Mat Ryan`, `Seb Larsson`). Players who reached 100 caps after 19 July 2026 (Andy Robertson 97 and Virgil van Dijk 96 on that date) are not included and have notes.

## p04 (since 2000)
All ten made their debuts after 1 January 2000, so their career totals count in full. Players whose careers straddle 2000 were checked against RSSSF's goal lists: Bashar Abdullah (75 total, over 20 before 2000), Kiatisuk Senamuang (about 35 before 1999), Stern John, Robbie Keane (63 since 2000) and Carlos Ruiz all fall below Klose's 71. Daei and Ronaldo Nazario scored much of their totals before 2000.

## Dropped
- t01 (Copa America winners, t01-a and t01-b): no recent window passes the 4-slot rule. The latest ten editions (1999 to 2024, counting the 2016 Centenario) give Brazil 4 (1999, 2004, 2007, 2019), and every window starting earlier, back to 1983 to 2004, gives Brazil 4 or 5; the ten before (1967 to 1997) give Uruguay 4 (1967, 1983, 1987, 1995). The first window that passes is 1979 to 2001 (Brazil 3, Uruguay 3), which is not one of the latest, so per Craig's instruction no board was made.

## Nations not in nations.txt
Used on t02 and t03: Ivory Coast, Zambia, DR Congo (alt Zaire), Sudan, Ethiopia, Congo. (Burkina Faso appears only in a final's description, not as an answer.)
