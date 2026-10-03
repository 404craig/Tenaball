# Premier League hat-tricks, 1992/93 to 2025/26

Files:
- `hattricks.csv`: the list asked for. Columns `season,date,player,player_club,opponent,goals,perfect`. 405 rows, one per hat-trick (a four or five-goal game is one row, with goals 4 or 5).
- `hattricks_detail.csv`: the same 405 rows plus `home,away,score,result,sub` (result W/D/L for the scorer's team; sub = yes if he came off the bench). Use it if a board needs venue or result.
- `ht.wiki` (raw wikitext snapshot fetched 3 October 2026) and `parse_ht.py` (the parser) so the CSV can be rebuilt.

## Source

Wikipedia, "List of Premier League hat-tricks" (https://en.wikipedia.org/wiki/List_of_Premier_League_hat-tricks), raw wikitext fetched in full on 3 October 2026 (`action=raw`, 270 KB, so nothing was cut off). Its summary tables are marked "updated 20 September 2026". The page has one big table of every hat-trick; I parsed every row, carrying over `rowspan` cells (games where two players scored hat-tricks, and shared dates) and reading the scorer's club from the bolded score as the page's key says.

Two rows on the page are from 2026/27 and were left out: Bruno Fernandes (Man Utd 5-2 Ipswich, 30 August 2026) and Brian Brobbey (Sunderland, lost 5-3 at Man City, 20 September 2026).

Names: accents stripped and changed to the spelling in Craig's player dataset (`docs/data/pl_players/pl_players.csv`), so every one of the 212 scorers matches a name there. Changes from Wikipedia: Andrei Arshavin -> Andrey Arshavin, Andrew Johnson -> Andy Johnson (the Fulham one, 2011), Benjani Mwaruwari -> Benjani, Jan Age Fjortoft -> Jan Aage Fjortoft, Jonathan Walters -> Jon Walters, Joshua King -> Josh King, Matthew Le Tissier -> Matt Le Tissier, Micky Quinn -> Mick Quinn, Nwankwo Kanu -> Kanu. Wikipedia's club names are kept in full (Manchester City, Brighton & Hove Albion, Wolverhampton Wanderers, and so on).

Seasons come from the date (August onwards starts a new season; the 2019/20 games played in June and July 2020 count as 2019/20).

## How it was checked

1. **Total.** 405 hat-tricks from 1992/93 to 2025/26 (407 on the page including the two 2026/27 rows). Wikipedia doesn't print a single total, but its "Hat-tricks by club" and "Hat-tricks by nationality" tables each add up to 407, and my per-club counts match the by-club table for every club exactly.
2. **Independent count.** The Analyst (Opta), 26 November 2025, says Eberechi Eze's hat-trick against Spurs on 23 November 2025 was "the 400th scored by a player in the Premier League" (https://theanalyst.com/articles/premier-league-hat-tricks-history-stats). Eze is row 400 in the CSV, so the count agrees with Opta, and 5 more followed in 2025/26 (Schade, Igor Thiago, Palmer, Joao Pedro, Gibbs-White), giving 405.
3. **Conceded table.** Wikipedia's "Hat-tricks conceded" table adds up to 404, not 407. The 3 gap is games with two hat-tricks against the same side, which that table counts once: Southampton (Arsenal 6-1 in 2003, Leicester 9-0 in 2019) and Man Utd (Man City 6-3 in 2022). So it isn't a sign of missing rows.
4. **Season counts** agree with the page's text: 19 in 1993/94 and in 2011/12 (the most), 3 in 2006/07 (the fewest).
5. **Each player's own count.** The page marks each repeat scorer's running count, e.g. "(7)". Every one of those agrees with the order of my rows.
6. **Most hat-tricks table.** My per-player totals match Wikipedia's "Multiple hat-tricks" table for all 69 players with two or more, including their last hat-trick dates.

Per-season totals: 92/93 14, 93/94 19, 94/95 13, 95/96 16, 96/97 12, 97/98 16, 98/99 12, 99/00 13, 00/01 14, 01/02 7, 02/03 13, 03/04 10, 04/05 8, 05/06 7, 06/07 3, 07/08 15, 08/09 6, 09/10 14, 10/11 17, 11/12 19, 12/13 13, 13/14 8, 14/15 10, 15/16 14, 16/17 11, 17/18 10, 18/19 11, 19/20 11, 20/21 12, 21/22 13, 22/23 8, 23/24 17, 24/25 12, 25/26 7.

Other totals: 212 different scorers; 42 games of four or more (37 fours, 5 fives); 7 off the bench; 21 where the scorer's side didn't win.

### Most hat-tricks (to the end of 2025/26)

| Rank | Player | Hat-tricks |
|---|---|---|
| 1 | Sergio Aguero | 12 |
| 2 | Alan Shearer | 11 |
| 3 | Robbie Fowler | 9 |
| 4= | Erling Haaland | 8 |
| 4= | Thierry Henry | 8 |
| 4= | Harry Kane | 8 |
| 4= | Michael Owen | 8 |
| 8 | Wayne Rooney | 7 |
| 9 | Luis Suarez | 6 |
| 10= | Dimitar Berbatov, Andy Cole, Ruud van Nistelrooy, Robin van Persie, Raheem Sterling, Ian Wright | 5 |
| Just outside (4) | Kevin Campbell, Jermain Defoe, Les Ferdinand, Jimmy Floyd Hasselbaink, Matt Le Tissier, Cole Palmer, Mohamed Salah, Teddy Sheringham, Son Heung-min, Chris Sutton, Carlos Tevez, Fernando Torres, Dwight Yorke, Yakubu | 4 |

Matches Wikipedia's table and The Analyst (Aguero 12, Shearer 11). Bruno Fernandes is on 1 at the end of 2025/26 (his second came in August 2026).

## 2025/26 hat-tricks (7), each confirmed by a match report

| Date | Player | For | Against | Score | Confirmed by |
|---|---|---|---|---|---|
| 18 Oct 2025 | Jean-Philippe Mateta | Crystal Palace | Bournemouth | 3-3 (H) | cpfc.co.uk match report: goals 64, 69, 90+7 pen |
| 23 Nov 2025 | Eberechi Eze | Arsenal | Tottenham | 4-1 (H) | Al Jazeera, TSN, The Analyst (the 400th PL hat-trick) |
| 27 Dec 2025 | Kevin Schade | Brentford | Bournemouth | 4-1 (H) | premierleague.com and brentfordfc.com reports; perfect hat-trick (left foot, right foot, header) |
| 4 Jan 2026 | Igor Thiago | Brentford | Everton | 4-2 (A) | premierleague.com and brentfordfc.com reports |
| 7 Feb 2026 | Cole Palmer | Chelsea | Wolves | 3-1 (A) | Flashscore, Express & Star: two penalties and a finish, all first half |
| 4 Mar 2026 | Joao Pedro | Chelsea | Aston Villa | 4-1 (A) | beIN Sports, Citizen Digital: goals 35, first half, 64 |
| 19 Apr 2026 | Morgan Gibbs-White | Nottingham Forest | Burnley | 4-1 (H) | Irish News/PA, beIN Sports: 15-minute hat-trick, 62, 69, 77 |

Search found no other 2025/26 Premier League hat-tricks (Haaland's 2025/26 hat-trick against Liverpool was in the FA Cup). One search summary said "eight different players" won the match ball that season, but it gave no names and probably counts every competition; nothing backs up an eighth league hat-trick.

## Perfect hat-tricks (left foot, right foot, header)

Wikipedia marks 40 (37 players; Robbie Fowler 3, Yakubu 2):

| Date | Player | For | Against | Goals |
|---|---|---|---|---|
| 9 Nov 1992 | Mark Robins | Norwich City | Oldham Athletic | 3 |
| 25 Sep 1993 | Efan Ekoku | Norwich City | Everton | 4 |
| 30 Oct 1993 | Robbie Fowler | Liverpool | Southampton | 3 |
| 9 Apr 1994 | Matt Le Tissier | Southampton | Norwich City | 3 |
| 27 Aug 1994 | Chris Sutton | Blackburn Rovers | Coventry City | 3 |
| 11 Feb 1995 | Tommy Johnson | Aston Villa | Wimbledon | 3 |
| 4 Mar 1995 | Andy Cole | Manchester United | Ipswich Town | 5 |
| 23 Dec 1995 | Robbie Fowler | Liverpool | Arsenal | 3 |
| 24 Aug 1997 | Gianluca Vialli | Chelsea | Barnsley | 4 |
| 16 Jan 1999 | Robbie Fowler | Liverpool | Southampton | 3 |
| 4 Dec 1999 | Ole Gunnar Solskjaer | Manchester United | Everton | 4 |
| 15 Oct 2000 | Emile Heskey | Liverpool | Derby County | 3 |
| 25 Nov 2000 | Les Ferdinand | Tottenham Hotspur | Leicester City | 3 |
| 13 Mar 2002 | Jimmy Floyd Hasselbaink | Chelsea | Tottenham Hotspur | 3 |
| 19 Jan 2003 | Thierry Henry | Arsenal | West Ham United | 3 |
| 31 Mar 2007 | Peter Crouch | Liverpool | Arsenal | 3 |
| 8 Dec 2007 | Yakubu | Everton | Fulham | 3 |
| 1 Mar 2008 | Mikael Forssell | Birmingham City | Tottenham Hotspur | 3 |
| 17 Aug 2008 | Gabriel Agbonlahor | Aston Villa | Manchester City | 3 |
| 13 Sep 2008 | Emmanuel Adebayor | Arsenal | Blackburn Rovers | 3 |
| 25 Apr 2010 | Salomon Kalou | Chelsea | Stoke City | 3 |
| 9 May 2010 | Didier Drogba | Chelsea | Wigan Athletic | 3 |
| 5 Feb 2011 | Louis Saha | Everton | Blackpool | 4 |
| 28 Aug 2011 | Edin Dzeko | Manchester City | Tottenham Hotspur | 4 |
| 31 Oct 2011 | Demba Ba | Newcastle United | Stoke City | 3 |
| 3 Dec 2011 | Yakubu | Blackburn Rovers | Swansea City | 4 |
| 4 Mar 2012 | Pavel Pogrebnyak | Fulham | Wolves | 3 |
| 24 Nov 2012 | Jordi Gomez | Wigan Athletic | Reading | 3 |
| 19 May 2013 | Kevin Nolan | West Ham United | Reading | 3 |
| 19 May 2013 | Romelu Lukaku | West Bromwich Albion | Manchester United | 3 |
| 31 Jan 2015 | Jon Walters | Stoke City | QPR | 3 |
| 12 Sep 2015 | Steven Naismith | Everton | Chelsea | 3 |
| 5 Dec 2015 | Riyad Mahrez | Leicester City | Swansea City | 3 |
| 20 Jan 2018 | Sergio Aguero | Manchester City | Newcastle United | 3 |
| 26 Oct 2019 | Christian Pulisic | Chelsea | Burnley | 3 |
| 4 Oct 2020 | Ollie Watkins | Aston Villa | Liverpool | 3 |
| 12 Feb 2022 | Raheem Sterling | Manchester City | Norwich City | 3 |
| 31 Aug 2022 | Erling Haaland | Manchester City | Nottingham Forest | 3 |
| 15 Apr 2024 | Cole Palmer | Chelsea | Everton | 4 |
| 27 Dec 2025 | Kevin Schade | Brentford | Bournemouth | 3 |

Cross-check against Opta and the Premier League:
- The Premier League's own article "Perfect treble helps Aguero join elite" (23 January 2018, https://www.premierleague.com/news/601677) says Aguero then had **two** perfect hat-tricks; the earlier one was the five-goal game against Newcastle on 3 October 2015 ("three of five goals in total that day"). Wikipedia doesn't mark that game. That article counts 30 players by January 2018 (Fowler 3, Aguero 2, Yakubu 2, plus 27 others). Wikipedia's marks give 31 players by the same date (counting Aguero once). So Wikipedia has one player the Premier League doesn't. The fetched text named 25 of the 27 others; the three Wikipedia names it didn't show were Jordi Gomez, Kevin Nolan and Riyad Mahrez. Nolan's is confirmed by West Ham and Planet Football. Gomez is named as one in search results. So Mahrez (Swansea, December 2015) is the likely extra one, but I couldn't confirm the foot of each goal.
- The PL's 16 April 2024 article on Palmer's earliest perfect hat-trick (29 minutes) names Palmer, Tommy Johnson, Haaland, Watkins and Fowler, all of them on the list.
- One search summary gave "31 perfect hat-tricks" with no clear source or date. It doesn't fit either count, so I didn't use it.
- Wikipedia's text says "36 different players"; that was written before Schade (December 2025), who makes 37 by its own marks.
- **Best figure:** going by the Premier League's own count, 41 perfect hat-tricks by 37 players (Wikipedia's 40 plus Aguero's October 2015 game), or 40 by 36 players if Mahrez's doesn't count. For a board, "most perfect hat-tricks" is Fowler 3, then Aguero and Yakubu 2 (by the Premier League's count). Everyone else has 1.

## Fastest hat-tricks (time from first goal to third)

Main source: Premier League, "Where does Amad's hat-trick rank among fastest EVER?", 16 January 2025 (https://www.premierleague.com/news/4225919), with times to the second. The top seven match The Analyst (Opta), 28 September 2024 (https://theanalyst.com/articles/fastest-premier-league-hat-trick-in-history/).

| Rank | Player | Match | Date | Time |
|---|---|---|---|---|
| 1 | Sadio Mane | Southampton 6-1 Aston Villa | 16 May 2015 | 2m 56s (goals at 12:22, 13:46, 15:18) |
| 2 | Robbie Fowler | Liverpool 3-0 Arsenal | 28 Aug 1994 | 4m 33s |
| 3 | Jermain Defoe | Tottenham 9-1 Wigan | 22 Nov 2009 | 7m 00s |
| 4 | Gabriel Agbonlahor | Aston Villa 4-2 Man City | 17 Aug 2008 | 7m 10s |
| 5 | Ian Wright | Arsenal 4-1 Ipswich | 15 Apr 1995 | 9 min (whole minutes only; exact goal times not available, say both PL and Opta) |
| 6 | Cole Palmer | Chelsea 4-2 Brighton | 28 Sep 2024 | 9m 48s (PL); 9m 46s (The Analyst) |
| 7 | Andy Carroll | West Ham 3-3 Arsenal | 9 Apr 2016 | 9m 50s |
| 8 | Yannick Bolasie | Sunderland 1-4 Crystal Palace | 11 Apr 2015 | 10m 33s |
| 9 | Romelu Lukaku | Sunderland 0-3 Everton | 12 Sep 2016 | 11m 37s |
| 10 | Sergio Aguero | Man City 6-1 Newcastle | 3 Oct 2015 | 11m 40s |
| 11 (just outside) | Amad Diallo | Man Utd 3-1 Southampton | 16 Jan 2025 | 12m 07s |

Since January 2025, none of the 2025/26 hat-tricks is quicker than 12 minutes: Gibbs-White's was 15 minutes (62, 69, 77) and the rest were spread over longer. So the top ten holds to the end of 2025/26.

Notes on the times:
- These times are actual time played, stoppage time included. That is why Aguero is 11m 40s although his goals came at 42, 49 and 50 (first-half stoppage time falls in between), and why some low-quality lists give Carroll 7m 14s or Aguero 8 minutes from the minute marks. Use the PL/Opta times.
- Older lists also give Jermaine Pennant (Arsenal v Southampton, 2003), Teddy Sheringham (Man Utd v Southampton, 2000) and Ole Gunnar Solskjaer (Forest v Man Utd, 1999, off the bench) as "10 minutes", in whole minutes. The PL's list to the second doesn't have them in its top 11, so they must be slower than 12m 07s by its timing (or not timed). I left them out.
- Hat-tricks before about 2000 may lack exact goal times (Wright's is flagged); the PL and Opta lists may not have timed every old game exactly.
- Wikipedia's text says "six" under 10 minutes but then names seven; the PL/Opta lists have seven.

## Rows I was unsure of / flags

- **Jon Walters, Stoke 3-1 QPR, 31 January 2015**: the page doesn't bold either score in this row, so the scorer's side couldn't be read from it. Set to Stoke City (he played for Stoke; Stoke won 3-1), and the BBC reference title confirms the game.
- **Aguero's perfect hat-trick against Newcastle in October 2015**: counted by the Premier League but not marked by Wikipedia; left blank in the CSV to keep Wikipedia's marks. Change it to `yes` if you follow the PL count.
- **Mahrez, Swansea 0-3 Leicester, December 2015**: marked perfect by Wikipedia, apparently not in the PL's January 2018 count; not confirmed either way.
- **Wikipedia's intro text is out of date** (it says 206 scorers and 36 perfect scorers; the table itself has 212 scorers by the end of 2025/26 and 37 perfect). I used the table, not the text.
- **Andy Johnson**: the dataset has two players with this name; the hat-trick (Fulham v QPR, 2 October 2011) is the Crystal Palace/Everton/Fulham striker, not the Norwich one.
- Everything else matched all the internal checks above. The only outside check of the full list is Opta's "400th" (exact).

## Sources

- Wikipedia, List of Premier League hat-tricks, raw wikitext fetched 3 October 2026 (summary tables updated 20 September 2026): https://en.wikipedia.org/wiki/List_of_Premier_League_hat-tricks
- The Analyst (Opta), Premier League hat-tricks history and stats, 26 November 2025: https://theanalyst.com/articles/premier-league-hat-tricks-history-stats
- The Analyst (Opta), Fastest Premier League hat-trick in history, 28 September 2024: https://theanalyst.com/articles/fastest-premier-league-hat-trick-in-history/
- Premier League, Where does Amad's hat-trick rank among fastest EVER?, 16 January 2025: https://www.premierleague.com/news/4225919
- Premier League, Perfect treble helps Aguero join elite, 23 January 2018: https://www.premierleague.com/news/601677
- Premier League, Palmer sets Premier League record with earliest EVER perfect hat-trick, 16 April 2024: https://www.premierleague.com/news/3969471
- 2025/26 match reports: https://www.cpfc.co.uk/news/first-team/match-report-highlights-live-blog-crystal-palace-bournemouth-october-2025 ; https://www.aljazeera.com/sports/2025/11/23/arsenal-thrash-tottenham-to-go-six-points-clear-as-eze-grabs-a-hat-trick ; https://www.premierleague.com/en/news/4517732/brentford-4-1-bournemouth-match-report-27-december-2025 ; https://www.premierleague.com/en/news/4516580/everton-2-brentford-match-report-4-january-2026 ; https://www.flashscore.com/news/soccer-premier-league-report-chelsea-wolves-07-02/0Clw3bfM ; https://www.beinsports.com/en-nz/football/premier-league/articles-video/joao-pedro-nets-hat-trick-as-chelsea-thumps-villa-2026-03-04 ; https://us.irishnews.com/sport/soccer/morgan-gibbs-white-hits-15-minute-hat-trick-as-nottingham-forest-beat-burnley-HFDAZC5RSZMBHFGBM6KYLXLFM4/
- Schade perfect hat-trick detail: https://cryptobriefing.com/brentford-schade-hat-trick-bournemouth/ and the Brentford FC report
- Nolan perfect hat-trick: https://www.planetfootball.com/nostalgia/remembering-kevin-nolans-forgotten-perfect-hat-trick-for-west-ham
