# Ligue 1 notes (agent B, October 2026)

Raw pages are cached under `scratchpad/euro_raw/B/ligue1/` (football-data CSVs `fd/`, Wikipedia wikitext `wiki/`, Transfermarkt pages `tm/`). Every football-data file used was checked to be `F1` (Div column), every Wikipedia page to be the Ligue 1 or French Division 1 article (or its table template), and every Transfermarkt page by its title.

## fr03: season tables (`tables.csv`)

- 26 seasons, 2000/01 to 2025/26, 510 rows: season, pos, club, played, won, drawn, lost, gf, ga, deduction, pts.
- Sources: each season's Wikipedia article (the sports table in the article, or the `Template:<season> Ligue 1 table` it transcludes from 2016/17 on); football-data.co.uk `F1.csv` for every season, with a table worked out from every result; Transfermarkt's table for each season as a tie-breaker.
- The CSV holds the official final standings (Wikipedia's). Positions are Wikipedia's.
- Deductions (points taken off, from Wikipedia): Ajaccio 2 in 2012/13; Nice 1 and Lyon 1 in 2021/22; Montpellier 1 in 2023/24 (crowd trouble that caused the abandoned match with Clermont). Monaco's 2-point deduction for 2013/14 was overturned and isn't applied.
- 2019/20 was stopped after 27 or 28 games and ranked on points per game. The CSV shows the games actually played. Nice are 5th and Reims 6th (both 41 points from 28 games). Wikipedia has them that way, and so do the European places (Nice went into the Europa League group stage). Transfermarkt has them the other way round.
- Results worked out from football-data match Wikipedia exactly in 22 seasons. The 4 that differ are all down to matches awarded after they were played; football-data keeps the score on the pitch:
  - **2000/01** (false passports affair): Metz 2-2 Rennes was awarded 2-0 to Rennes, and Saint-Etienne lost matches by forfeit. This changes Rennes, Metz, Toulouse and Saint-Etienne. Wikipedia and Transfermarkt agree on points. Transfermarkt's goals differ by one for Toulouse (35 for, against 34) and Saint-Etienne (57 against, against 56). The CSV follows Wikipedia.
  - **2006/07**: Nantes 0-0 Toulouse counts as a Toulouse win in the official table. Points agree in all three sources (Toulouse 58, Nantes 34). Wikipedia keeps the 0-0 goals; Transfermarkt adds the awarded 3-0 (Toulouse 47 for, Nantes 52 against). The CSV follows Wikipedia, whose goals also match football-data.
  - **2013/14**: Nantes 2-0 Bastia counts as a Bastia win in the official table, with the goals taken out. Wikipedia and Transfermarkt agree on points (Bastia 49, Nantes 46) and goals.
  - **2016/17**: Bastia v Lyon was abandoned and awarded to Lyon. football-data has it as 0-3. Wikipedia and Transfermarkt agree that the goals don't count (Lyon 77-48, Bastia 29-54) and that the points do (Lyon 67, Bastia 34).
- Transfermarkt's won, drawn and lost columns count some awarded matches as draws, but its points match Wikipedia's in every season.
- Club names follow `clubs_ligue1.txt`. **Paris FC** (promoted for 2025/26) isn't on that list; I used "Paris FC".

## frs05 and frs06: 2025/26 goals boards

- Taken from the 2025/26 rows of the table. Wikipedia, football-data (all 306 results) and Transfermarkt agree on every figure.
- frs05 (most scored): Toulouse and Paris FC both scored 47 and share 10th as a pool.
- frs06 (fewest conceded): Le Havre and Auxerre both conceded 44 and share 5th and 6th as a pool. Angers are 10th alone with 48; Paris FC and Rennes are next with 50.

## fr12: Coupe de France winners (`fr12-2001`, `fr12-2007`)

- Wikipedia's Coupe de France results-by-club table and Transfermarkt's list of all winners agree on all 26 finals, 2001 to 2026 (2026: Lens beat Nice).
- PSG won 2004, 2006, 2010, 2015 to 2018, 2020, 2021, 2024 and 2025. Every ten-year window starting in 2008 or later gives PSG four or more slots. Only windows starting 2001 to 2007 pass.
- I wrote 2001 to 2010 and 2007 to 2016, so the boards together cover 2001 to 2016; they overlap in 2007 to 2010.
- PSG fill 3 slots in each.
- Notes list the runners-up who never won in that window.

## fr13: Ligue 1 (UNFP) Player of the Year (`fr13-2000`, `fr13-2010`)

- English Wikipedia's "Ligue 1 Player of the Year" and French Wikipedia's "Trophees UNFP du football" (which cites tropheesunfp.com) agree on every season.
- Transfermarkt's honours pages confirm 11 of the 16 winners. They leave the award out for Carriere, Essien, Gourcuff, Lisandro Lopez and Lacazette. That's a gap on Transfermarkt, not a disagreement.
- No award in 2019/20 (COVID-19). The second board therefore runs over eleven seasons, 2010/11 to 2020/21, to get ten winners. The brief and the period say so.
- Mbappe won five times (2018/19, then 2020/21 to 2023/24) and Dembele twice (2024/25, 2025/26). Any window reaching 2021/22 gives Mbappe four slots, so there is no board for the most recent seasons.
- Juninho is written "Juninho Pernambucano" so he isn't mixed up with the Premier League Juninho.

## fr21: PSG managers in order (permanent only)

- Transfermarkt's staff history and Wikipedia's list of PSG managers agree on 13 permanent spells since 2000: Luis Fernandez (Dec 2000), Halilhodzic (2003), Fournier (Feb 2005), Lacombe, Le Guen, Kombouare, Ancelotti, Blanc, Emery, Tuchel, Pochettino, Galtier and Luis Enrique.
- The board takes the ten most recent, so it **starts with Guy Lacombe**. No caretakers were needed, and no one has two spells in the window.
- Start-year disagreements:
  - Lacombe: Transfermarkt 27 Dec 2005, Wikipedia Jan 2006.
  - Ancelotti: Transfermarkt 1 Jan 2012, Wikipedia Dec 2011.
  - The labels use the appointment year, 2005 and 2011. These two labels are the softest data on the board.

## fr22: title-winning managers (`fr22-2000`, `fr22-2010`, `fr22-2016`)

- Champions and coaches come from Transfermarkt's Ligue 1 winners page. I checked them against the manager column in each Wikipedia season article's personnel table.
- Where a season article has no manager table:
  - 2000/01: the article names Denoueix with champions Nantes.
  - 2001/02 to 2003/04: checked against the Santini and Le Guen Wikipedia articles' honours.
  - 2025/26: checked against the 2025/26 PSG season article.
- Windows 2000/01 to 2009/10 (Le Guen 3), 2010/11 to 2019/20 (Blanc 3) and 2016/17 to 2025/26 (Luis Enrique 3) all pass the 4-slot rule.
- Blanc's 2008/09 title with Bordeaux falls in the first window and his three PSG titles in the second, so he never reaches 4 on one board.

## fr24: biggest grounds

- Capacities come from Wikipedia's 2025/26 Ligue 1 stadium table, checked against each club's Transfermarkt stadium page.
- Both sources have the same ten clubs above Metz (28,786 in both). The board shows Wikipedia's figures.
- Small differences that don't change the order of the top 8: PSG 47,926 against 48,583, Lens 37,705 against 38,223, Nice 35,624 against 36,178.
- **9th and 10th are a pool of Rennes and Strasbourg**, because the sources disagree on the order:
  - Wikipedia: Rennes 29,778, Strasbourg 29,230 (the Meinau was being rebuilt).
  - Transfermarkt: Strasbourg 32,300 (including 6,000 standing), Rennes 29,778.
- Shared grounds: none among the 2025/26 clubs (PSG at the Parc des Princes, Paris FC at Stade Jean-Bouin), so the "counts once, first-named club" rule never applied.
- I didn't use the clubs' own sites; Transfermarkt is the second list.

## Not in my list

The brief's general instructions also cover derby scorers, most titles as a player, British and Irish players and hat-tricks. None of those ideas were in my Ligue 1 list (fr03, frs05, frs06, fr12, fr13, fr21, fr22, fr24), so I wrote no derby.csv and no boards for them. Other files in `boards/` (fr07, fr09, fr15 and so on) aren't mine.

## Dropped

- Nothing was dropped outright.
- Recent windows for fr12 (any starting 2008 or later) and fr13 (any reaching 2021/22) can't be built because of the 4-slot rule.
