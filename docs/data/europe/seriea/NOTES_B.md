# Serie A notes (researcher B), October 2026

Boards written to `boards/`: it10, it11, it13-2001, it13-2008, it22, it24-2005, it24-2016, it25, its05, its06. Data files: `tables.csv`, `derby.csv`. (it18, it19 and it21 in the same folder are not mine.)

Raw pages are cached under the session scratchpad (`euro_raw/B/`), not in the repo.

## it03: 2024/25 and 2025/26 tables (`tables.csv`)
- Sources: Wikipedia's table templates (`Template:2024-25 Serie A table`, `Template:2025-26 Serie A table`), football-data.co.uk `2425/I1.csv` and `2526/I1.csv` (380 results each), and Transfermarkt's final tables.
- Method: worked out W, D, L, GF and GA for every club from the results and asserted they equal the Wikipedia figures; every row matched. Transfermarkt's tables also match row for row.
- No points deductions in either season (none in the Wikipedia templates, and points equal 3W+D everywhere).
- Order on equal points follows Wikipedia's head-to-head notes: 2024/25 Fiorentina above Lazio (65), Torino above Udinese (44), Cagliari above Parma (36); 2025/26 Torino above Parma (45). Transfermarkt has the same order.
- Club names: Pisa (2025/26) isn't on `clubs_seriea.txt`; I used "Pisa". "Verona" is used for Hellas Verona and "AC Milan" for Milan, as in the list.
- No board JSON, as asked.

## its05 and its06: 2025/26 most goals scored, fewest conceded
- From `tables.csv`, so the same three-way check applies.
- its05: no tie at 10th (Udinese 45, Torino 44 11th).
- its06: Bologna and Parma both conceded 46 and fill 9th and 10th exactly, so no pool is needed; Udinese (48) are 11th. Inter and AC Milan (35) and Napoli and Atalanta (36) tie inside the ten.

## it10: Most Serie A titles as a player, 2000/01 to 2025/26
- How it was settled: only official titles. 2004/05 was stripped from Juventus and never reassigned, so it has no champion; 2005/06 counts for Inter (awarded the title), not Juventus. That leaves 25 title seasons.
- A player counts for a title if he made at least one league appearance for the champions that season. Appearances came from Transfermarkt's club season stats (`leistungsdaten`, IT1) for each champion, then counted per player (player id, so namesakes can't merge).
- Second source: the Serie A titles listed in each player's Wikipedia honours section. Every player on 5 or more agrees exactly (Buffon 10; Bonucci 9, including one game for Inter in 2005/06; Chiellini 9; Barzagli 8; Lichtsteiner and Marchisio 7; Samuel, Pirlo, Caceres, Asamoah and Cuadrado 6).
- Places 7 to 10 are a pool of the five players on 6.
- Julio Cesar (5, Transfermarkt) wasn't checked on Wikipedia (the page name didn't match), so he's left out of the near-miss notes.

## it11: Milan derby league scorers, 2000/01 to 2025/26
- `derby.csv` lists all 52 league derbies with every goal, scorer's club, minute (read from Transfermarkt's clock graphic, so stoppage-time goals show as 90) and own goals.
- Matches from Inter's Transfermarkt fixture lists; goals from Transfermarkt match reports. Each match's goals add up to its score.
- Second source: the match boxes in Wikipedia's Inter and AC Milan season articles for every season. Every match agrees with at least one of the two articles. The only real disagreement: 24 February 2013 (1-1), where the AC Milan article credits Bojan Krkic with Milan's goal; Transfermarkt and the Inter article both give Stephan El Shaarawy. I used El Shaarawy; neither player is near the board.
- Own goals left out: Samir Handanovic (October 2017) and Stefan de Vrij (November 2021).
- Result: Ibrahimovic 8 (2 for Inter, 6 for Milan), Shevchenko 6, Milito 6, Kaka 5, Icardi 5, Inzaghi, Stankovic, Lautaro and Lukaku 4. 10th is a pool of eight players on 3 (Adriano, Julio Cruz, Pato, Suso, de Vrij, Brozovic, Giroud, Leao). That's a big pool for one place; if Craig would rather not, the board could stop at a nine and a pool, or drop to a different idea.

## it13: Coppa Italia winners by year
- Sources: Wikipedia's list of Coppa Italia finals and Transfermarkt's winners list; all 26 winners (2001 to 2026) agree. The 2026 final: Inter 2-0 Lazio.
- 4-slot rule: of the windows starting 2001 to 2017, only 2001, 2006, 2007 and 2008 pass. Inter have 4 in any window starting 2002 to 2005; Juventus have 4 or more in any window starting 2009 to 2017, so no window ending after 2017 passes (2017 to 2026 has Juventus in 2017, 2018, 2021 and 2024).
- Kept: it13-2001 (2001 to 2010) and it13-2008 (2008 to 2017). They overlap on 2008 to 2010, because nothing in between passes.

## it22: Juventus managers in order
- Sources: Wikipedia's list of Juventus managers and Transfermarkt's head coach history; spells and start dates agree.
- Fifteen permanent spells began from 2000 (from Lippi in 2001), so the board takes the ten most recent and starts at Alberto Zaccheroni (January 2010). Allegri fills two places (2014 and 2021). Spalletti (appointed 30 October 2025) is still in charge.
- Caretakers left out: Wikipedia marks Giancarlo Corradini (2007) and Massimo Brambilla (2025) as interim. None was needed to make ten. Both sources list Zaccheroni as a normal appointment, not interim.
- Labels are the year each spell began, so 2010 and 2025 each appear twice; rows are in order, oldest first.

## it24: Title-winning managers by season
- Sources: Wikipedia's list of Serie A winning managers and Transfermarkt's list of champions with coaches; every season agrees (2025/26: Cristian Chivu, Inter).
- 2004/05 has no champion, so no ten-season window can include it; windows start from 2005/06.
- 4-slot rule: only 2005/06 to 2014/15, 2006/07 to 2015/16 and 2016/17 to 2025/26 pass (Allegri has 4 or more in every window starting 2007/08 to 2015/16). Kept the two that don't overlap: it24-2005 and it24-2016.
- Not written: a 2000/01 window. 2000/01 to 2010/11 without 2004/05 would give ten titles and pass, but it covers eleven seasons and has a gap, so I left it out. It's easy to add if Craig wants it.

## it25: British and Irish players in Serie A since 2000/01 (open board)
- Source one: the England, Scotland, Wales, Northern Ireland and Republic of Ireland sections of Wikipedia's list of foreign Serie A players (it sorts players by the national team they play for, then by country of birth), keeping players whose Serie A years overlap 2000/01 to 2025/26. 46 names.
- Source two: Transfermarkt season stats for every Serie A club from 2000/01 to 2025/26 (512 club seasons). All 46 have at least one league appearance with a British or Irish citizenship.
- Transfermarkt also has 16 players with a second British or Irish citizenship who play for, or are listed by Wikipedia under, another country (for example Lookman, Aina, Moses, Musah, Morrison, Ronaldo Vieira, Perrotta). They are left out, and the best-known ones get notes.
- No Northern Ireland player played in this period. Trevoh Chalobah (Como, from 2026/27) doesn't count; Harry Winks and Omari Forson count for their earlier seasons only.
- Examples: Beckham, Walker, Vardy, McTominay, Smalling, Tomori, Abraham, Ashley Cole, Ramsey, Hart.
- Gascoigne, Platt and Ince (in the idea's examples) played before 2000/01, so they're not on the list; each has a note.

## Not done
- The prompt's general list also covers an award by season, biggest grounds and most hat-tricks, but none of these was in my list of Serie A ideas, so I didn't build them.
