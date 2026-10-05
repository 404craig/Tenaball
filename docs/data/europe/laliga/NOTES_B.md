# La Liga research notes (agent B, October 2026)

Boards are in `boards/`, raw data in this folder (`tables.csv`, `derby.csv`). Raw pages are cached in the scratchpad (`euro_raw/B/laliga/`). Every board covers league seasons 2000/01 to 2025/26 unless it says otherwise.

## Season tables (es03): `tables.csv`

- 2024/25 and 2025/26, all 20 clubs: played, won, drawn, lost, gf, ga, deduction, pts.
- Three-way check, all 40 rows identical:
  - Wikipedia's table templates (`Template:2024–25 La Liga table`, `Template:2025–26 La Liga table`), including the final order.
  - Tables worked out from every result in football-data.co.uk `2425/SP1.csv` and `2526/SP1.csv` (380 matches each).
  - Transfermarkt's final tables (position, W, D, L, goals and points).
- No points deductions in either season.
- La Liga breaks ties on head-to-head, so the order isn't always goal difference (2025/26: Sevilla, Alaves and Elche on 43; Levante, Osasuna and Mallorca on 42). The CSV uses the official order, which Wikipedia and Transfermarkt agree on.
- Club names follow `clubs_laliga.txt`. Real Oviedo, Levante and Elche (all promoted for 2025/26) are on the list.
- The game already has champions and top scorer boards running to 2025/26 (`laliga-ch-2016/17`, `laliga-ts-2016/17`); the season tables stop at 2023/24. I checked the 2024/25 and 2025/26 top scorers: Kylian Mbappe 31 and 25 (Wikipedia's Pichichi Trophy page and Transfermarkt's Real Madrid stats agree).
- **Problem in the game, not mine to fix:** `laliga-ts-2016/17` has Lionel Messi in five slots (2016/17 to 2020/21), which breaks the 4-slot rule.

## ess05, ess06: 2025/26 most goals scored, fewest conceded

- From `tables.csv`.
- ess05 has no tie at 10th: Levante and Mallorca, both on 47, are 9th and 10th. Valencia and Sevilla (46) are next.
- ess06 has a three-way tie at 10th on 55 conceded (Valencia, Espanyol, Girona): a pool for one place.

## es10: Most La Liga hat-tricks since 2000/01

- Counted from Wikipedia's "List of La Liga hat-tricks" for matches from July 2000 to June 2026: 301 hat-tricks. Four or more goals count once.
- Checked against Transfermarkt's list of every La Liga goal for each of the twelve players with 4 or more, grouped by match. All twelve agree.
- Also checked on Transfermarkt: Villa, Eto'o, Lewandowski, Aspas, Forlan and Neymar have 3 each, Raul 2, Mbappe 2.
- Mbappe's 26 August 2026 hat-trick is in 2026/27 and is left out.
- Two different Luis Suarezs are on the list. Only the Uruguayan (10) is on the board; the Colombian's one for Almeria is kept separate.
- 10th place is a pool of three on 4: Aduriz, Falcao, Sorloth.

## es11: Most La Liga titles as a player, 2000/01 to 2025/26

- **How a title counts:** the player made at least one league appearance for the champions that season.
- **Source 1:** Transfermarkt's league stats page for the champions in each of the 26 seasons. Counted by Transfermarkt player id.
- **Source 2:** the La Liga titles in each player's Wikipedia honours list, for all 18 players with 5 or more. All agree except two:
  - Marc-Andre ter Stegen: Wikipedia also credits 2014/15 and 2025/26, when he played no league game (Bravo was the league keeper in 2014/15; he was injured and then loaned to Girona in 2025/26). By the appearance rule he has 5.
  - Luis Suarez: Wikipedia lists his 2020/21 Atletico title in a separate line, which I counted in.
- Champions by season are from Wikipedia's list of La Liga winning managers and agree with the game's champions boards.
- Places 7 to 10 are a pool of five on 6: Valdes, Puyol, Marcelo, Dani Alves, Jordi Alba.
- Players before 2000/01 (Gento and others) don't come into it.

## es12: El Clasico league scorers since 2000/01

- All 52 league Clasicos, from Transfermarkt's Real Madrid fixtures and match reports. Every goal is in `derby.csv` (one row per goal, with minute, penalty, own goal and the Transfermarkt match id; the 0-0s have one row with no scorer).
- Each report's goals add up to its final score.
- All 52 matches agree with Wikipedia's "List of El Clasico matches" on score and scorers. The only differences are spellings: Simao/Simao Sabrosa, Carles/Carlos Puyol, Jeffren/Jeffren Suarez.
- The one own goal (Ronald Araujo, 19 March 2023) doesn't count.
- The Brazilian Ronaldo is written "Ronaldo Nazario", as in the game.
- 8th to 10th is a pool of six on 4: Xavi, Ronaldo Nazario, Eto'o, Van Nistelrooy, Bellingham, Mbappe. Henry, Alexis Sanchez, Neymar, Ferran Torres and Raphinha are next with 3.

## es14: Copa del Rey winners by year

- Winners from 2001 to 2026 agree between Wikipedia's list of finals and Transfermarkt's list of winners.
- The 2026 final: Real Sociedad 2-2 Atletico Madrid, Real Sociedad won 4-3 on penalties.
- **4-slot rule:** only windows starting from 2001 to 2006 pass.
  - Barcelona won in 2009, 2012 and 2015 to 2018.
  - Even the latest window, 2017 to 2026, has four Barcelona wins (2017, 2018, 2021, 2025).
- **Written:** `es14-2001` (2001 to 2010) and `es14-2006` (2006 to 2015, the latest window that passes).
- These two overlap by five years. If only non-overlapping windows are wanted, keep `es14-2001` only.

## es25, es26: managers in order

- Wikipedia's club manager lists (Real Madrid's correct to 16 September 2026) and Transfermarkt's staff history agree on every spell.

### Real Madrid (es25)

- 21 spells since 2000, so the board takes the ten most recent. It starts with Ancelotti, June 2013.
- Ancelotti and Zidane each fill two places.
- Solari was caretaker from 29 October 2018 and was made permanent on 13 November 2018. Transfermarkt shows the two parts; I count one spell.
- Arbeloa was promoted from Castilla on 12 January 2026. Both sources list him as a full manager, with no caretaker mark. **Flag:** if Craig sees him as interim, the board would start one spell earlier, with Mourinho in 2010.
- Mourinho returned on 11 June 2026.
- No caretaker was needed to make ten.

### Barcelona (es26)

- 14 permanent spells since 2000, so the board takes the ten most recent. It starts with Rijkaard, 2003.
- Caretakers left out:
  - Antonio de la Cruz, 2003.
  - Jordi Roura, January to March 2013. He stood in while Vilanova had cancer treatment, and Vilanova's spell counts once, as Wikipedia has it.
  - Sergi Barjuan, 2021.
- Two spells began in 2020 (Setien, Koeman), so two labels read 2020.
- The manager names follow the game's spellings: Jose Mourinho, Rafael Benitez, Gerardo Martino, Quique Setien.

## es27: Title-winning managers by season

- Wikipedia's list of La Liga winning managers, checked against Transfermarkt's staff histories for Real Madrid, Barcelona, Valencia and Atletico Madrid.
- No window breaks the 4-slot rule. The most any manager fills is 3: Guardiola in 2008/09 to 2010/11, inside windows starting 2001 to 2008.
- **Written:**
  - `es27-2000`: 2000/01 to 2009/10.
  - `es27-2010`: 2010/11 to 2019/20.
  - `es27-2016`: 2016/17 to 2025/26, the latest ten. It overlaps es27-2010 by four seasons.
- 2012/13 is credited to Tito Vilanova, though Jordi Roura stood in for part of the season.
- Each slot's val is the champion club.

## es28: British and Irish players since 2000/01 (open board)

- **Names:** the 30 players listed under England, Northern Ireland, Republic of Ireland, Scotland and Wales in Wikipedia's "List of foreign La Liga players" with any season from 2000/01 to 2025/26. Nobody from Northern Ireland.
- **Check:** I scanned Transfermarkt's league stats pages for all 520 La Liga club seasons from 2000/01 to 2025/26 for anyone with a British or Irish citizenship and at least one league appearance.
  - All 30 are there, at the right club and season.
  - No player with British or Irish first citizenship is missing from Wikipedia's list.
- **Left out:** players with a British or Irish second citizenship who represent other countries: Lookman, Brereton Diaz, Musah, Diangana, Cho, Ilori, Mateo Joseph, Jon Toral, Brandon Thomas, Mat Ryan, Wanchope and Yaya Toure. Several have notes so a guess gets an explanation.
- **Spellings:**
  - John Patrick Finn (Getafe, Ireland) is "John Patrick" on Transfermarkt.
  - Oliver McBurnie is "Oli" on Transfermarkt.
- Examples: Beckham, Bale, Bellingham, Owen, McManaman, Trippier, Woodgate, Greenwood, Rashford, Alexander-Arnold.
- The JSON also carries a `details` list (nation, clubs, seasons) for reference.

## es29: Biggest La Liga grounds

- 2025/26 clubs, from Wikipedia's 2025/26 stadium table and Transfermarkt's 2025/26 La Liga stadium list.
- **Where the sources agree:**
  - The same ten clubs; Oviedo is 11th, on 30,500 in both.
  - Real Madrid 2nd, on 83,186 in both.
  - 5th to 10th: Athletic, Valencia, Sevilla, Real Sociedad, Espanyol, Elche.
- **Barcelona:** 1st on the Camp Nou's full capacity (Wikipedia 105,000, Transfermarkt 99,354). Transfermarkt shows 62,657 open during the 2025/26 works, and Barcelona also used the Johan Cruyff and Montjuic early in the season.
- **3rd and 4th:** Atletico and Betis swap between the sources, so those two places are a pool.
  - Wikipedia: Atletico 70,692, Betis 70,000.
  - Transfermarkt: Atletico 70,813, Betis 71,374.
  - Betis played at La Cartuja while the Villamarin is rebuilt. On the old Villamarin (about 60,700) they would still be 4th.
- No 2025/26 ground was shared by two clubs. Rayo's one game at Butarque is ignored.
- Vals say "about" where the two sources' figures differ.

## Cache check

- All my raw pages are under `euro_raw/B/laliga/cache` (with `index.txt` listing every URL), not the shared `euro_raw/B/` folder.
- I checked the index: every Wikipedia title is a La Liga, Spanish club or player page, and every Transfermarkt page is ES1, Real Madrid, Barcelona, a La Liga club or a Copa del Rey page.
- The football-data files are `SP1` (`fd_2425.csv`, `fd_2526.csv`, whose rows start with `SP1`).

## Ideas not built

- "Award by season" is in the general instructions, but my list has no award idea, so I made none.
