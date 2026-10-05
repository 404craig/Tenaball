# Notes from researcher T: transfer boards and Top 5 boards (October 2026)

Boards written (JSON in each league's `boards/` folder):

| Pick | Board | Folder | Level |
|---|---|---|---|
| es19 | Real Madrid's biggest signings | laliga | 0 |
| es20 | Real Madrid's biggest sales | laliga | 1 |
| es21 | Barcelona's biggest signings | laliga | 0 |
| es22 | Barcelona's biggest sales | laliga | 1 |
| es24 | Biggest signings by La Liga clubs | laliga | 1 |
| de17 | Bayern's biggest signings | bund | 1 |
| de19 | Dortmund's biggest sales | bund | 1 |
| de21 | Biggest sales by Bundesliga clubs | bund | 1 |
| it18 | Juventus's biggest signings | seriea | 1 |
| it19 | Napoli's biggest sales | seriea | 1 |
| it21 | Biggest sales by Serie A clubs | seriea | 1 |
| fr17 | PSG's biggest signings | ligue1 | 1 |
| fr18 | Monaco's biggest sales | ligue1 | 1 |
| t01-2016 | Golden Shoe winners 2016/17 to 2025/26 | top5 | 0 |
| t01-2000 | Golden Shoe winners 2000/01 to 2009/10 | top5 | 1 (my suggestion; Craig's list says easy, but Larsson, Jardel and Makaay are harder) |
| t04 | The most expensive transfers ever | top5 | 0 |
| t05 | Title winners in two or more big leagues | top5 | 1 |

Not written: t02 (2026 Ballon d'Or, pending) and t03 (world record transfers, dropped). See the end.

Every fee row, with the Transfermarkt figure, the news report and both links, is in `transfers.csv` in laliga, bund, seriea, ligue1 and top5 (t04).

## Transfer boards: method

1. **Candidates.** Transfermarkt's record signings (`transferrekorde`) and record sales (`rekordabgaenge`) pages for Real Madrid, Barcelona, Bayern, Dortmund, Juventus, Napoli, PSG and Monaco, and the league record pages (filtered to arrivals or departures) for La Liga signings and Bundesliga and Serie A sales. Fetched 5 October 2026, after the summer 2026 window closed. The top 20 to 25 of each list were taken as candidates.
2. **Window.** July 2000 to 1 September 2026. Figo (24 July 2000) and Crespo (July 2000) are inside; Ronaldo's 1997 moves are not.
3. **Fee basis.** Rank by the guaranteed (fixed) fee in euros as reported at the time. Transfermarkt usually adds add-ons it thinks were paid, or the buyer's costs (Juventus's ancillary costs), so its figure is often higher. Where a report splits fixed and add-ons, the fixed part is used and the row's `news_report_basis` in transfers.csv says so. Fees agreed in pounds use the euro figure in the report, or Wikipedia's conversion at the day's rate.
4. **Check.** Each fee was checked against a news report (BBC, Sky, Reuters, AP, AFP, ESPN, the Guardian, Eurosport, theScore, kicker, Calcio e Finanza, A Bola, or the club's own statement as reported). Where a BBC page could not be opened from here, the figure is the one Wikipedia's list cites to that BBC article, and it also agrees with Transfermarkt.
5. **Ties at 10th become pools**: es19 (Figo and Jovic, both EUR 60m, one place), it21 (Kaka, Retegui and Cancelo, all EUR 65m, one place), fr17 (Hakimi, Ugarte and Joao Neves, about EUR 60m, two places), fr18 (Fabinho, Tielemans, Disasi and Bakayoko, all EUR 45m, two places). Ties higher up just share a value.

### Decisions Craig may want to change

- **Swap deals.** When the clubs stated a fee for each player, each fee counts (Arthur EUR 72m and Pjanic EUR 60m; Cancelo EUR 65m and Danilo EUR 37m; Cillessen EUR 35m and Neto EUR 26m). When a player was only thrown in, just the cash counts. This leaves out **Zlatan Ibrahimovic** (EUR 46m plus Eto'o; Transfermarkt EUR 69.5m, which would put him 7th on es21 and 9th on it21), **Gianluigi Buffon** (75bn lire, about EUR 38.7m, plus Bachini; about EUR 52.9m with Bachini, which would put him 6th on it18). Each has a note on the board.
- **Loans with an obligation** count at the obligation fee: Mbappe EUR 180m, Goncalo Ramos EUR 65m, Openda EUR 40.6m, Chiesa EUR 40m (EUR 50m with his two loan fees, which would put him 8th on it18 instead of 11th). Douglas Costa had an option, not an obligation, which Juventus took up for EUR 40m (11th).
- **Neymar to Barcelona** is at EUR 57.1m, the fee Barcelona announced in 2013. The club later put the full cost at EUR 86.2m, which would move him from 10th to 4th on es21.
- **Fixed fee vs Transfermarkt order.** On es21 Coutinho (EUR 120m fixed) is above Dembele (EUR 105m fixed), and on t04 Dembele, Coutinho and Bellingham fall out of the ten on the fixed fee, though Transfermarkt's totals (EUR 148m, 135m, 127m) would put them in.

### Disagreements and soft spots

- **Huijsen** (es19): GBP 50m clause, about EUR 59m in reports; Transfermarkt EUR 62.5m. On the reported figure he is 11th, just below the Figo and Jovic pool.
- **Kaka** (es19, it21): reports at the time said EUR 65m; Transfermarkt and Wikipedia say EUR 67m. At EUR 67m he would share 9th and 10th with De Ligt on it21 and no pool would be needed.
- **James Rodriguez** (es19, fr18): reports EUR 80m, Transfermarkt EUR 75m. Either way he stays in both tens.
- **Lemar** (fr18): L'Equipe EUR 72m including bonuses; earlier reports EUR 60m to 70m; no fixed part published. 4th whatever the figure.
- **Kolo Muani** (de21, fr17): Frankfurt said EUR 95m; some reports say this includes bonuses, but no fixed part was published. 5th on de21 and 3rd on fr17 at anything from EUR 90m.
- **Olise** (de17): German reports EUR 53m fixed plus EUR 6m; Sky gave GBP 50.8m (EUR 60m) for the whole deal; kicker once said a EUR 70m clause. Transfermarkt EUR 53m. 5th at anything from EUR 51m to 66m.
- **Nathaniel Brown and Ismael Saibari** (de17, both 2026): EUR 50m fixed each; AP reported EUR 55m including bonuses.
- **Woltemade** (de21): Newcastle paid GBP 64.8m (EUR 75m) plus EUR 5m; one German site says EUR 85m fixed. On EUR 75m he is 11th; on EUR 85m he would tie Sancho for 7th. Left out on the majority figure.
- **Joao Neves** (fr17): Benfica's statement says EUR 59.92m fixed; most reports round to EUR 60m, so he is in the pool with Hakimi and Ugarte.
- **Nedved** (it18): sources split between 75bn lire (EUR 38.7m) and EUR 41m to 45m. Left out (note on the board); at EUR 41.2m he would be 8th and push Cancelo out.
- **Lavezzi** (it19): EUR 26m fixed plus bonuses to his EUR 31m clause (Transfermarkt EUR 30m). 8th either way.
- **Nico Paz**: Transfermarkt lists Real Madrid to Como (August 2024) at EUR 66m. Reports at the time said about EUR 6m, so this looks like a typing error on Transfermarkt; left out of es20.
- **2026 deals** (Diomande, Gordon, Rodri, Ferran Torres, Gonzalo Garcia, Brown, Saibari, Openda, Akliouche, Gutierrez, Enzo Fernandez, Rogers, Anderson, Barcola) are a month old; figures may be revised.

## t01: European Golden Shoe

Sources: Wikipedia's European Golden Shoe list and RSSSF's Golden Boot list, which agree on every winner and tally from 2000/01 to 2024/25. 2025/26 (Harry Kane, 36 goals, 72 points) from Bayern and bundesliga.com. RSSSF names one winner for a shared year; 2004/05 was shared by Henry and Forlan (both 25), so that row has both as alts. 2013/14 (Ronaldo and Suarez) is in neither window.

4-slot rule tested on every ten-season window: windows starting 2000/01 to 2004/05 and 2013/14 to 2016/17 pass; 2005/06 to 2012/13 fail (Messi or Ronaldo four or more). Written: the latest window (2016/17 to 2025/26, Messi three) and the first (2000/01 to 2009/10, Henry and Forlan two each). The winners are not all from the big five leagues (Larsson at Celtic, Jardel at Sporting), as the award covers every European league.

## t04: most expensive transfers ever

Wikipedia's list (updated 1 September 2026, each fee cited to BBC, Sky or The Athletic) and Transfermarkt's all-time list, with each 2026 deal checked again in a news report. Ranked by guaranteed fee: Neymar, Mbappe, Enzo Fernandez (Chelsea to Man City 2026, GBP 125m flat), Isak, Rogers (GBP 117m fixed), Anderson (GBP 116m guaranteed; Forest say add-ons could reach GBP 130m), Joao Felix, Diomande and Barcola (EUR 125m each), Enzo Fernandez (Benfica to Chelsea 2023). Enzo Fernandez fills two slots, which the 4-slot rule allows. 11th Griezmann EUR 120m, 12th Coutinho EUR 120m fixed. Enzo to City and Isak are both GBP 125m and only differ in euros through the exchange rate.

## t05: managers with titles in two or more big leagues

Transfermarkt's champions pages (which name each champion's coach) for all five leagues, 2000/01 to 2025/26, checked against Wikipedia's winning-manager lists and the 2025/26 season pages. Exactly ten, so it is a ranked board (leagues, then titles): Ancelotti (5 leagues, 6 titles), Guardiola (3, 12), Mourinho (3, 6), Conte (2, 6), Luis Enrique (2, 5), Mancini (2, 4), Flick (2, 4), Klopp (2, 3), Tuchel (2, 3), Capello (2, 2). Craig's guesses Van Gaal and Trapattoni drop out (their second leagues came before 2000/01); Klopp and Mancini come in. Capello's revoked Juventus titles don't count; Inter's awarded 2005/06 title is counted for Mancini. Xabi Alonso has one league only (Real Madrid didn't win La Liga in 2025/26).

## Not produced

- **t02, 2026 Ballon d'Or top ten**: pending. The ceremony is on 26 October 2026; add it then, with the other vote boards.
- **t03, world record transfers since July 2000**: dropped. Only eight records were set from July 2000: Crespo (July 2000), Figo, Zidane, Kaka, Ronaldo, Bale, Pogba, Neymar. Neymar's EUR 222m still stands. Fewer than ten, so no board.
