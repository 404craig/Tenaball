# Bundesliga research notes (agent B, October 2026)

All boards cover league seasons 2000/01 to 2025/26 unless the board says otherwise. Raw pages are cached under `scratchpad/euro_raw/B/bund/`. Board files are in `boards/`.

## Sources used

- Wikipedia (English and German), read as rendered pages or raw wikitext: the 26 season articles (2000-01 Bundesliga to 2025-26 Bundesliga), List of Bundesliga hat-tricks, List of foreign Bundesliga players, List of DFB-Pokal finals, the 2025-26 Bundesliga stadiums table, Javi Martinez, Edin Terzic, de: FC Bayern Munchen/Namen und Zahlen (coach list since 1963), de: Liste der Meistertrainer der Fussball-Bundesliga.
- football-data.co.uk D1 results CSVs for 2000/01 to 2025/26 (306 matches each; every file checked to be division D1).
- Transfermarkt: league tables (L1, every season), champion club season stats pages, head coach histories (Bayern, Dortmund, Werder Bremen, Stuttgart, Wolfsburg, Leverkusen), DFB-Pokal winners list, stadium pages for the 18 2025/26 clubs, Bayern v Dortmund head-to-head list and the 52 match reports. Every club season stats page for 2000/01 to 2025/26 (468 pages, fetched by agent A into `euro_raw/A/bund/club/`) for the British and Irish board.
- fussballdaten.de: the 52 Klassiker match pages, player career tables (title check), Dortmund coach list, 2025/26 stadium table, and every matchday page from 2000/01 to 2025/26 (884 pages, for hat-tricks).

## de03: 2025/26 table (tables.csv)

`tables.csv` has every season 2000/01 to 2025/26 (468 rows). Each season was checked three ways: Wikipedia's final table, the table worked out from every football-data.co.uk result, and Transfermarkt's table. All 468 rows agree on played, won, drawn, lost, goals and points, and the order worked out from points, goal difference and goals scored matches Wikipedia's positions.

- The only points deduction is Kaiserslautern 2003/04: 3 points for financial irregularities (Wikipedia note; results give 39, table shows 36).
- The game's existing `bund-top-*`, `bund-p2`, `bund-p3` and `bund-p4` boards (2000/01 to 2024/25) all agree with this file.
- 2025/26 places for the boards that need them: champions Bayern Munich 89 pts, runners-up Dortmund 73 pts, third RB Leipzig 65 pts, fourth Stuttgart 62 pts. Top scorer Harry Kane, 36 goals (Wikipedia's top scorers table and Transfermarkt agree; the game already has this). A `bund-top-2025/26` table board can be built straight from the file.

## des05 and des06: 2025/26 goals scored and conceded

From `tables.csv`. Most goals: Augsburg and Wolfsburg tie on 45 for 10th, so they share the place as a pool. Fewest conceded: Freiburg (57) are 10th outright; ties inside the ten are listed in league order.

## de12: Der Klassiker league scorers (derby.csv)

All 52 Bayern v Dortmund league matches. Scorers from Transfermarkt match reports, checked goal by goal (score after each goal and scorer) against fussballdaten.de: all 180 goals agree, including the two own goals (Mats Hummels for Bayern in November 2019, Gregor Kobel for Bayern in April 2023), which do not count. Every final score matches football-data.co.uk. In `derby.csv` an own goal's `scorer_team` is the team that benefited, as Transfermarkt shows it. Five players tie on 4 goals for 8th, so 8th to 10th is a pool.

## de11: Most titles as a player

Settled like this: a player gets a title for every champion squad in which Transfermarkt's club season stats page shows him with at least one Bundesliga appearance that season, counted by Transfermarkt player id. Everyone on 8 or more was then checked season by season against fussballdaten.de career tables. All agree except Javi Martinez in 2014/15 (fussballdaten shows no league game; Transfermarkt and Wikipedia, citing kicker, give him one), which counts. Muller and Neuer 13, Alaba, Lewandowski and Kimmich 10, then exactly five players on 9 (Ribery, Martinez, Boateng, Ulreich, Coman), so no pool. Schweinsteiger, Lahm and Robben are on 8.

## de22 and de23: managers in order

- Bayern: Transfermarkt's head coach history matches German Wikipedia's coach list. Caretakers (Heynckes 2009, Jonker 2011, Sagnol 2017) are left out. Thirteen spells began since 2000, so the board is the ten most recent, starting with Van Gaal in 2009 (Klinsmann 2008 is 11th). Heynckes fills two places (2011 and 2017). Flick's spell began as caretaker in November 2019 and became permanent; it is one spell.
- Dortmund: Transfermarkt matches fussballdaten.de (which also lists caretakers Tullberg, Stefes and Redepenning, left out). Decision: Terzic's December 2020 appointment, to the end of 2020/21, is counted as a head coach spell, because Transfermarkt, fussballdaten.de and his Wikipedia article all list it as one (like Stoger's 2017/18 spell). So Terzic fills two places and the board starts with Klopp in 2008; Doll (2007) is 11th. If Craig prefers to treat that spell as interim, drop Terzic 2020 and add Doll 2007 at the top.

## de24: title-winning managers

German Wikipedia's list of title-winning coaches matches the champion in each season's table and the coach in post at the end of the season in Transfermarkt's histories. Three windows written: de24-2000 (2000/01 to 2009/10), de24-2010 (2010/11 to 2019/20) and de24-2016 (2016/17 to 2025/26, the latest ten). The most slots for one manager in any window is 3 (Hitzfeld, Magath, Guardiola), so all pass.

## de14: DFB-Pokal winners

Wikipedia's finals list and Transfermarkt's winners list agree on every final from 2001 to 2026 (2026: Bayern 3-0 Stuttgart). Every ten-year window starting 2001 to 2014 gives Bayern 4 or more slots and fails. Windows starting 2015, 2016 and 2017 pass; only the latest, de14-2017 (2017 to 2026, Bayern 3 slots), is written because the others overlap it by eight or nine years. Ask if you want de14-2015 as well.

## de26: biggest grounds

Wikipedia's 2025/26 stadiums table, fussballdaten.de's 2025/26 stadium table and Transfermarkt's stadium pages. All three give the same top ten and Mainz 11th. Stuttgart and Frankfurt are both about 60,000 and the sources disagree on which is bigger, so they share 3rd and 4th as a pool. Each figure shown is one that two sources agree on. No two 2025/26 clubs share a ground (Hamburg and St Pauli use different stadiums), so the shared-ground rule did not apply.

## de25: British and Irish players

Open board, 36 names. Wikipedia's foreign players list (England, Scotland, Wales and Republic of Ireland sections; there is no Northern Ireland section) gives 36 players whose spells overlap 2000/01 to 2025/26; all 36 have at least one league appearance on Transfermarkt. Every player Transfermarkt lists with a British or Irish first nationality is on the Wikipedia list. Keanan Bennetts and Conor Noss are on Wikipedia's England and Ireland lists but Transfermarkt gives Germany first; both are kept. Players who only hold British or Irish citizenship second and are listed under other countries (Musiala, Olise, Holtby, Lookman, Mancienne and others) are left out, with notes. Ethan Nwaneri, Mikey Moore and Reigan Heskey joined for 2026/27 and are left out.

## Award by season

None of my Bundesliga picks is an award-by-season board, so nothing was written for that item.
