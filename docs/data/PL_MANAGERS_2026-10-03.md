# Managers, medals, captains and new grounds (Premier League, 1992/93 to 2025/26)

Research for Tenaball boards. Figures run to the end of 2025/26 (last game 24 May 2026). Nothing from 2026/27 is counted.

## How the manager figures were built (read this first)

Wikipedia's "List of Premier League managers" (fetched in full as wikitext on 3 October 2026; the page says "up to date as of 5 August 2026" for spells and "updated 21 September 2026" for its games table) lists every spell with club, nationality, start and end dates and a caretaker mark, but **it has no games, wins, draws or losses per spell**. Its "Most games managed" table gives total games for the top 20 managers only, with no W/D/L.

So W/D/L was worked out by matching every Premier League result to the manager in charge on the match date:

- Results: engsoccerdata (jalapic/engsoccerdata on GitHub, `england.csv`) for 1992/93 to 2021/22 and 2024/25; openfootball (openfootball/england on GitHub) for 2022/23, 2023/24 and 2025/26 (engsoccerdata has no 2022/23 or 2025/26). 13,166 matches, every season complete (462 or 380 games).
- Check on the results: every club's points in every season, rebuilt from these matches with the four known deductions, matches `PL_PTS` in `index.html` exactly for all 34 seasons.
- Spells: the Wikipedia spell table (519 rows). A match on the day one manager left and another arrived was settled by checking who was actually in the dugout (searches listed in Flags).
- Check on the join: totals for all 20 managers in Wikipedia's games table now agree with Wikipedia exactly (Wenger 828, Ferguson 810, Moyes 754 to end of 2025/26, Redknapp 641, Allardyce 541, Bruce 476, Hughes 466, Hodgson 416, Guardiola 380, Howe 369, Mourinho 363, Benitez 359, O'Neill 359, Dyche 351, Klopp 334, Curbishley 328, Pulis 322, Pardew 320, Rodgers 312, Kinnear 302). Wikipedia's Moyes figure of 759 includes five 2026/27 games.
- External W/D/L checks that agree: Ferguson 528-168-114 and Wenger 476-199-153 (Premier League site figures, widely quoted), Moyes 290 wins, Guardiola 269 wins and 865 points (The Analyst, end of reign), Bruce 211 defeats and Allardyce 178 wins (Sports Mole summary).

The full spell list is in `managers.csv` (502 spells with at least one game, plus 6 unattributed caretaker games; 17 spells with no Premier League games in the period are left out, mostly 2026/27 appointments).

### Our game's figures: agreement

| Manager | Game says | Worked out | Agree? |
|---|---|---|---|
| Wenger games | 828 | 828 | Yes |
| Ferguson games | 810 | 810 | Yes |
| Moyes games | 754 | 754 | Yes |
| Redknapp games | 641 | 641 | Yes |
| Allardyce games | 541 | 541 | Yes |
| Bruce games | 476 | 476 | Yes |
| Hughes games | 466 | 466 | Yes |
| Hodgson games | 416 | 416 | Yes |
| Guardiola games | 380 | 380 | Yes |
| Howe games | 369 | 369 | Yes |
| Ferguson wins | 528 | 528 | Yes |
| Wenger wins | 476 | 476 | Yes |
| Moyes wins | 290 | 290 | Yes |
| Guardiola wins | 269 | 269 | Yes |

No differences. One note: `docs/data/PL_MANAGER_GAMES_2026-10-03.md` quotes Guardiola as 269 W, 57 D, 52 L, which only adds up to 378. The match data gives 269 W, 58 D, 53 L (380 games, 865 points, and The Analyst's 865 points agrees). Use 58 D and 53 L if a board ever needs them.

---

## Board: Most Premier League points as a manager (3 for a win, 1 for a draw)

| # | Manager | Points | P | W | D | L | Clubs |
|---|---|---|---|---|---|---|---|
| 1 | Alex Ferguson | 1,752 | 810 | 528 | 168 | 114 | Man Utd |
| 2 | Arsene Wenger | 1,627 | 828 | 476 | 199 | 153 | Arsenal |
| 3 | David Moyes | 1,069 | 754 | 290 | 199 | 265 | Everton (two spells), Man Utd, Sunderland, West Ham (two spells) |
| 4 | Harry Redknapp | 875 | 641 | 236 | 167 | 238 | West Ham, Portsmouth (two spells), Southampton, Spurs, QPR |
| 5 | Pep Guardiola | 865 | 380 | 269 | 58 | 53 | Man City |
| 6 | Jose Mourinho | 735 | 363 | 217 | 84 | 62 | Chelsea (two spells), Man Utd, Spurs |
| 7 | Jurgen Klopp | 705 | 334 | 209 | 78 | 47 | Liverpool |
| 8 | Sam Allardyce | 680 | 541 | 178 | 146 | 217 | Bolton, Newcastle, Blackburn, West Ham, Sunderland, Crystal Palace, Everton, West Brom, Leeds |
| 9 | Rafael Benitez | 605 | 359 | 173 | 86 | 100 | Liverpool, Chelsea, Newcastle, Everton |
| 10 | Mark Hughes | 601 | 466 | 158 | 127 | 181 | Blackburn, Man City, Fulham, QPR, Stoke, Southampton |

Just outside: Steve Bruce 531, Mauricio Pochettino 520, Roy Hodgson 510 (then Martin O'Neill 505, Eddie Howe 501, Mikel Arteta 495). No tie at 10th. Points are worked out, not an official stat (no deductions applied; points deductions are club penalties, not results).

## Board: Most Premier League defeats as a manager

| # | Manager | Defeats | Games |
|---|---|---|---|
| 1 | David Moyes | 265 | 754 |
| 2 | Harry Redknapp | 238 | 641 |
| 3 | Sam Allardyce | 217 | 541 |
| 4 | Steve Bruce | 211 | 476 |
| 5 | Mark Hughes | 181 | 466 |
| 6 | Roy Hodgson | 178 | 416 |
| 7 | Sean Dyche | 157 | 351 |
| 8 | Arsene Wenger | 153 | 828 |
| 9 | Eddie Howe | 148 | 369 |
| 10 | Alan Pardew | 143 | 320 |

Just outside: Alan Curbishley 135, Tony Pulis 131, then Martin O'Neill 114 and Alex Ferguson 114. No tie at 10th.

## Board: Longest single spell at one club (Premier League games)

A spell is one continuous appointment (Wikipedia spell rows). Only Premier League games count, so Ferguson's spell counts from 1992/93 and spells at clubs that went down count only their top-flight seasons.

| # | Manager | Club | PL games | Spell (appointment dates) |
|---|---|---|---|---|
| 1 | Arsene Wenger | Arsenal | 828 | Oct 1996 to May 2018 |
| 2 | Alex Ferguson | Man Utd | 810 | Nov 1986 to June 2013 (PL games from Aug 1992) |
| 3 | David Moyes | Everton | 427 | Mar 2002 to June 2013 (first spell) |
| 4 | Pep Guardiola | Man City | 380 | July 2016 to May 2026 |
| 5 | Jurgen Klopp | Liverpool | 334 | Oct 2015 to May 2024 |
| 6 | Joe Kinnear | Wimbledon | 278 | Jan 1992 to June 1999 |
| 7 | Harry Redknapp | West Ham | 269 | Aug 1994 to May 2001 |
| 8 | Alan Curbishley | Charlton | 266 | July 1991 to May 2006 (PL seasons only) |
| 9 | Sean Dyche | Burnley | 258 | Oct 2012 to Apr 2022 (PL seasons only) |
| 10 | Mikel Arteta | Arsenal | 248 | Dec 2019 to present (games to end of 2025/26) |

Just outside: Rafael Benitez (Liverpool) 228, Sam Allardyce (Bolton) 226, Mauricio Pochettino (Spurs) 202, Jim Smith (Derby) 197. No tie at 10th. Arteta is still in post, so his figure grows in 2026/27; the board's date line must say "to end of 2025/26".

## Board: Most Premier League games by a foreign manager (not British or Irish)

Excludes England, Scotland, Wales, Northern Ireland and Republic of Ireland (Wikipedia nationality flags).

| # | Manager | Nationality | Games |
|---|---|---|---|
| 1 | Arsene Wenger | France | 828 |
| 2 | Pep Guardiola | Spain | 380 |
| 3 | Jose Mourinho | Portugal | 363 |
| 4 | Rafael Benitez | Spain | 359 |
| 5 | Jurgen Klopp | Germany | 334 |
| 6 | Mauricio Pochettino | Argentina | 294 |
| 7 | Roberto Martinez | Spain | 265 |
| 8 | Mikel Arteta | Spain | 248 |
| 9 | Marco Silva | Portugal | 247 |
| 10 | Claudio Ranieri | Italy | 238 |

Just outside: Gerard Houllier 234 (includes 12 games as joint manager with Roy Evans in 1998/99; 222 without them, still 11th), Nuno Espirito Santo 219, Martin Jol 202, Unai Emery 190. No tie at 10th. Marco Silva (Fulham) was still in post at the end of 2025/26.

## Board: Most Premier League games by a Scottish manager

| # | Manager | Games |
|---|---|---|
| 1 | Alex Ferguson | 810 |
| 2 | David Moyes | 754 |
| 3 | George Graham | 287 |
| 4 | Graeme Souness | 280 |
| 5 | Gordon Strachan | 271 |
| 6 | Kenny Dalglish | 238 |
| 7 | Paul Lambert | 154 |
| 8 | Walter Smith | 143 |
| 9 | Alex McLeish | 138 |
| 10 | George Burley | 98 |

Just outside: Steve Kean 59, Steve Clarke 55, John Gorman 42. No tie at 10th. Ferguson and Moyes on one board would fill 2 slots only, so no 4-slot problem.

## Board: Most Premier League games by an Italian manager

| # | Manager | Games |
|---|---|---|
| 1 | Claudio Ranieri | 238 |
| 2 | Carlo Ancelotti | 134 |
| 3 | Roberto Mancini | 133 |
| 4 | Antonio Conte | 132 |
| 5 | Gianluca Vialli | 94 |
| 6 | Roberto De Zerbi | 77 |
| 7 | Gianfranco Zola | 72 |
| 8 | Enzo Maresca | 57 |
| 9 | Roberto Di Matteo | 48 |
| 10= | Maurizio Sarri | 38 |
| 10= | Walter Mazzarri | 38 |

Tie at 10th: Sarri and Mazzarri on 38 (pool both). Just outside: Francesco Guidolin 23, Paolo Di Canio 12, Attilio Lombardo 7 (joint caretaker with Tomas Brolin). De Zerbi's 77 is Brighton 70 plus 7 at Spurs in spring 2026 (still Spurs manager). Maresca's 57 is all Chelsea (38 in 2024/25, 19 in 2025/26).

## Board: Most Premier League games by a Spanish manager

| # | Manager | Games |
|---|---|---|
| 1 | Pep Guardiola | 380 |
| 2 | Rafael Benitez | 359 |
| 3 | Roberto Martinez | 265 |
| 4 | Mikel Arteta | 248 |
| 5 | Unai Emery | 190 |
| 6 | Andoni Iraola | 114 |
| 7 | Javi Gracia | 67 |
| 8 | Quique Sanchez Flores | 48 |
| 9 | Julen Lopetegui | 43 |
| 10 | Juande Ramos | 35 |

Just outside: Aitor Karanka 27, Pepe Mel 18, Ruben Selles 16. No tie at 10th. Arteta, Emery and Iraola were still active at the end of 2025/26.

Bonus, for reference: most Premier League wins: Ferguson 528, Wenger 476, Moyes 290, Guardiola 269, Redknapp 236, Mourinho 217, Klopp 209, Allardyce 178, Benitez 173, Hughes 158; then Pochettino 150, Arteta 149, Howe 140. Most draws: Wenger 199 and Moyes 199 (tie), Ferguson 168, Redknapp 167, Allardyce 146, Bruce 132, Hughes 127, O'Neill 115, Hodgson 102, Dyche 95.

---

## Board: Most Premier League winners' medals (players)

Source: Wikipedia "List of Premier League winning players" (a Featured List, marked "updated end of 2025/26 season", fetched 3 October 2026). Its note says a player is only added if his Premier League site profile shows "Premier League Champion". Totals: 344 players, 683 medals, matching the page's own intro.

Medal rule used: the Premier League's own award rule. A player needs 5 league appearances for the title-winning club from 2012/13 onwards (10 before that); the league board can give extra medals at its discretion. So this counts medals awarded, not just being in the squad.

| # | Player | Medals | Club(s) | Seasons |
|---|---|---|---|---|
| 1 | Ryan Giggs | 13 | Man Utd | 92/93, 93/94, 95/96, 96/97, 98/99, 99/00, 00/01, 02/03, 06/07, 07/08, 08/09, 10/11, 12/13 |
| 2 | Paul Scholes | 11 | Man Utd | 95/96 to 12/13 |
| 3 | Gary Neville | 8 | Man Utd | 95/96, 96/97, 98/99, 99/00, 00/01, 02/03, 06/07, 08/09 |
| 4= | Denis Irwin | 7 | Man Utd | 92/93 to 00/01 |
| 4= | Roy Keane | 7 | Man Utd | 93/94 to 02/03 |
| 6= | David Beckham | 6 | Man Utd | 95/96 to 02/03 |
| 6= | Nicky Butt | 6 | Man Utd | 95/96 to 02/03 |
| 6= | Phil Neville | 6 | Man Utd | 95/96 to 02/03 |
| 6= | Ole Gunnar Solskjaer | 6 | Man Utd | 96/97 to 06/07 |
| 6= | Rio Ferdinand | 6 | Man Utd | 02/03 to 12/13 |
| 6= | Kevin De Bruyne | 6 | Man City | 17/18, 18/19, 20/21, 21/22, 22/23, 23/24 |
| 6= | Ederson | 6 | Man City | same six |
| 6= | Phil Foden | 6 | Man City | same six |
| 6= | Bernardo Silva | 6 | Man City | same six |
| 6= | John Stones | 6 | Man City | same six |
| 6= | Kyle Walker | 6 | Man City | same six |

Top ten plus ties = 16 names (11 tied on 6). For a board this needs a pool on places 6 to 10 (any five of the eleven), or a re-cut such as "7 or more medals" (5 names only). Five Man Utd players on 6 plus six City players.

Just outside (5 medals, 16 players): Peter Schmeichel, Andy Cole, Wes Brown, John O'Shea, Michael Carrick, Patrice Evra, Darren Fletcher, Wayne Rooney, Nemanja Vidic (all Man Utd), John Terry (Chelsea), Sergio Aguero, Fernandinho, Ilkay Gundogan, Aymeric Laporte (Man City), Riyad Mahrez (Leicester 1, Man City 4), Gabriel Jesus (Man City 4, Arsenal 1).

## Board: Players who won the Premier League with two or more clubs (complete list)

From the same Wikipedia list (its intro says eleven players; the table gives the same eleven). No player has won it with three clubs.

| Player | Titles | Clubs (titles) |
|---|---|---|
| Riyad Mahrez | 5 | Leicester (1: 15/16), Man City (4: 18/19, 20/21, 21/22, 22/23) |
| Gabriel Jesus | 5 | Man City (4: 17/18, 18/19, 20/21, 21/22), Arsenal (1: 25/26) |
| Henning Berg | 3 | Blackburn (1: 94/95), Man Utd (2: 98/99, 99/00) |
| Ashley Cole | 3 | Arsenal (2: 01/02, 03/04), Chelsea (1: 09/10) |
| Gael Clichy | 3 | Arsenal (1: 03/04), Man City (2: 11/12, 13/14) |
| Robert Huth | 3 | Chelsea (2: 04/05, 05/06), Leicester (1: 15/16) |
| Carlos Tevez | 3 | Man Utd (2: 07/08, 08/09), Man City (1: 11/12) |
| James Milner | 3 | Man City (2: 11/12, 13/14), Liverpool (1: 19/20) |
| Nicolas Anelka | 2 | Arsenal (97/98), Chelsea (09/10) |
| Kolo Toure | 2 | Arsenal (03/04), Man City (11/12) |
| N'Golo Kante | 2 | Leicester (15/16), Chelsea (16/17) |

Exactly 11, so a board would need one name dropped or a "name ten of eleven" pool. Gabriel Jesus is the 2025/26 addition (Arsenal).

---

## Board: Title-winning captains

"Lifted" = who raised the trophy at the presentation. Where the club captain and the man who lifted it differ, or two lifted it together, it is marked.

| Season | Champions | Captain who lifted it | Notes |
|---|---|---|---|
| 1992/93 | Man Utd | Steve Bruce and Bryan Robson (joint) | Lifted together v Blackburn, 3 May 1993. Robson was club captain, Bruce captain on the pitch most of the season. |
| 1993/94 | Man Utd | Steve Bruce and Bryan Robson (joint) | Lifted together after 0-0 v Coventry, 8 May 1994 (Robson's last game). |
| 1994/95 | Blackburn | Tim Sherwood | |
| 1995/96 | Man Utd | Steve Bruce | At Middlesbrough, 5 May 1996. |
| 1996/97 | Man Utd | Eric Cantona | |
| 1997/98 | Arsenal | Tony Adams | |
| 1998/99 | Man Utd | Roy Keane | |
| 1999/2000 | Man Utd | Roy Keane | |
| 2000/01 | Man Utd | Roy Keane | |
| 2001/02 | Arsenal | Tony Adams | |
| 2002/03 | Man Utd | Roy Keane | |
| 2003/04 | Arsenal | Patrick Vieira | |
| 2004/05 | Chelsea | John Terry | |
| 2005/06 | Chelsea | John Terry | |
| 2006/07 | Man Utd | Gary Neville | Neville was injured from March 2007 but is credited as title-winning captain (PA series, Sports Mole, manutd.com "fifth United captain to lift the Premier League trophy"). |
| 2007/08 | Man Utd | Ryan Giggs | Disputed: Giggs lifted it at Wigan (manutd.com, PA series); Neville was club captain but injured almost all season. Some lists credit Neville. |
| 2008/09 | Man Utd | Gary Neville | |
| 2009/10 | Chelsea | John Terry | |
| 2010/11 | Man Utd | Nemanja Vidic | |
| 2011/12 | Man City | Vincent Kompany | |
| 2012/13 | Man Utd | Nemanja Vidic | Lifted with vice-captain Patrice Evra and Ferguson alongside. |
| 2013/14 | Man City | Vincent Kompany | |
| 2014/15 | Chelsea | John Terry | |
| 2015/16 | Leicester | Wes Morgan | (with manager Claudio Ranieri) |
| 2016/17 | Chelsea | John Terry and Gary Cahill (joint) | Terry subbed off after 26 minutes of his farewell game v Sunderland; he and Cahill raised it together. |
| 2017/18 | Man City | Vincent Kompany | |
| 2018/19 | Man City | Vincent Kompany | |
| 2019/20 | Liverpool | Jordan Henderson | |
| 2020/21 | Man City | Fernandinho | v Everton, 23 May 2021. |
| 2021/22 | Man City | Fernandinho | v Aston Villa, 22 May 2022, his last game. |
| 2022/23 | Man City | Ilkay Gundogan | |
| 2023/24 | Man City | Kyle Walker | |
| 2024/25 | Liverpool | Virgil van Dijk | |
| 2025/26 | Arsenal | Martin Odegaard | At Selhurst Park after 2-1 v Crystal Palace, 24 May 2026. |

Count per player (main credit, joint lifts counted for both):

| # | Player | Titles as captain |
|---|---|---|
| 1 | John Terry | 5 (2005, 2006, 2010, 2015, 2017 shared) |
| 2= | Roy Keane | 4 |
| 2= | Vincent Kompany | 4 |
| 4 | Steve Bruce | 3 (two shared with Robson) |
| 5= | Bryan Robson | 2 (both shared with Bruce) |
| 5= | Tony Adams | 2 |
| 5= | Gary Neville | 2 |
| 5= | Nemanja Vidic | 2 |
| 5= | Fernandinho | 2 |
| 10= | Tim Sherwood, Eric Cantona, Patrick Vieira, Ryan Giggs, Wes Morgan, Gary Cahill (shared), Jordan Henderson, Ilkay Gundogan, Kyle Walker, Virgil van Dijk, Martin Odegaard | 1 each |

Captain count depends on the counting rule. Under the "one captain per title" rule some outlets use (PA, Sports Mole: Robson 1993, Bruce 1994 and 1996, Terry 2017, Giggs 2008), you get Terry 5, Keane 4, Kompany 4, then Bruce, Adams, Neville, Vidic and Fernandinho on 2. A board of "captains with the most titles" is solid for the top three only. A plain "name a title-winning captain" open board is the safer use.

---

## Board: Clubs that moved to a new permanent ground in the Premier League era

Clubs that have played in the Premier League at some point and moved after August 1992. Year = first league game at the new ground. Sources: Wikipedia articles for each stadium (fetched 3 October 2026) and "List of Premier League stadiums".

| Club | Old ground | New ground (current name) | First league game at new ground |
|---|---|---|---|
| Huddersfield Town | Leeds Road | Kirklees Stadium (John Smith's) | 1994 (20 Aug 1994 v Wycombe) |
| Middlesbrough | Ayresome Park | Riverside Stadium | 1995 (26 Aug 1995 v Chelsea) |
| Sunderland | Roker Park | Stadium of Light | 1997 |
| Derby County | Baseball Ground | Pride Park | 1997 (first completed game 30 Aug 1997 v Barnsley; 13 Aug v Wimbledon abandoned) |
| Bolton Wanderers | Burnden Park | Reebok Stadium (Toughsheet Community Stadium) | 1997 (1 Sep 1997 v Everton) |
| Stoke City | Victoria Ground | Britannia Stadium (bet365 Stadium) | 1997 |
| Reading | Elm Park | Madejski Stadium (Select Car Leasing Stadium) | 1998 (22 Aug 1998 v Luton) |
| Wigan Athletic | Springfield Park | JJB Stadium (Brick Community Stadium) | 1999 (7 Aug 1999 v Scunthorpe) |
| Southampton | The Dell | St Mary's | 2001 |
| Leicester City | Filbert Street | Walkers Stadium (King Power) | 2002 (10 Aug 2002 v Watford) |
| Hull City | Boothferry Park | KC Stadium (MKM Stadium) | 2002 (Dec 2002 v Hartlepool) |
| Manchester City | Maine Road | City of Manchester Stadium (Etihad) | 2003 (23 Aug 2003 v Portsmouth) |
| Coventry City | Highfield Road | Ricoh Arena (Coventry Building Society Arena) | 2005 (20 Aug 2005 v QPR) |
| Swansea City | Vetch Field | Liberty Stadium (Swansea.com Stadium) | 2005 (6 Aug 2005 v Tranmere) |
| Arsenal | Highbury | Emirates Stadium | 2006 (19 Aug 2006 v Aston Villa) |
| Cardiff City | Ninian Park | Cardiff City Stadium | 2009 (8 Aug 2009 v Scunthorpe) |
| Brighton | Goldstone Ground (left 1997; Gillingham then Withdean in between) | Falmer Stadium (Amex) | 2011 (v Doncaster) |
| West Ham United | Boleyn Ground (Upton Park) | London Stadium | 2016 |
| Tottenham Hotspur | White Hart Lane (Wembley 2017 to 2019 in between) | Tottenham Hotspur Stadium | 2019 (3 Apr 2019 v Crystal Palace) |
| Brentford | Griffin Park | Brentford Community Stadium (Gtech) | 2020 |
| Everton | Goodison Park | Hill Dickinson Stadium | 2025 (24 Aug 2025 v Brighton) |

That is 21 clubs, so a board needs a cut (for example "moved since 2000": Southampton, Leicester, Hull, Man City, Coventry, Swansea, Arsenal, Cardiff, Brighton, West Ham, Spurs, Brentford, Everton = 13; or "moved since 2001 while a Premier League club or within a year of it"). Year is not a rank, so a board could use the year as the stat.

Edge cases left out (say so if a player names them):
- Wimbledon: groundsharing at Selhurst Park since 1991, moved to the National Hockey Stadium, Milton Keynes in 2003 and became MK Dons in 2004 (Stadium MK from 2007). A relocation, not a new home ground for the same club in the usual sense.
- Charlton: returned to The Valley in December 1992 after groundsharing; old ground, not new.
- Bournemouth: Dean Court rebuilt on the same site (2001). Same ground.
- Temporary moves: Fulham (Loftus Road 2002 to 2004), Spurs (Wembley 2017 to 2019), Coventry (Sixfields 2013/14, St Andrew's 2019 to 2021), Brighton (Gillingham, Withdean).

---

## Sources

- Wikipedia, "List of Premier League managers", wikitext fetched 3 Oct 2026 (spells up to date as of 5 Aug 2026; games table updated 21 Sep 2026). https://en.wikipedia.org/wiki/List_of_Premier_League_managers
- Match results: jalapic/engsoccerdata `data-raw/england.csv` (raw.githubusercontent.com), seasons 1992/93 to 2021/22 and 2024/25; openfootball/england `2022-23`, `2023-24`, `2025-26` `1-premierleague.txt`. Cross-checked against `PL_PTS` in index.html (all 34 seasons agree).
- The Analyst, "Seven stats: Pep Guardiola's Man City reign" (269 wins, 865 points in 380 games). https://theanalyst.com/articles/seven-stats-pep-guardiola-man-city-reign
- Sports Mole, top 20 managers by Premier League games (Bruce 211 defeats, Allardyce 178 wins). https://www.sportsmole.co.uk/football/man-city/feature/top-20-premier-league-managers-who-have-taken-charge-of-the-most-games-in-history_558526.html
- Wikipedia, "List of Premier League winning players" (Featured List, updated end of 2025/26). https://en.wikipedia.org/wiki/List_of_Premier_League_winning_players
- Captains: Getty Images captions and Man Utd sources as quoted in search results (1993, 1994, 1996); manutd.com "The day United won the title at Wigan" (2008, Giggs); Sports Mole / PA "Premier League title-winning captains: Gary Neville"; FourFourTwo / PA series (Bruce, Robson, Cantona, Neville, Giggs, Vieira); InDaily / AFP on Terry and Cahill (21 May 2017); Getty / mancity.com on Fernandinho (2021, 2022); Jamaica Observer / AFP 24 May 2026 on Odegaard; Wikipedia "Nemanja Vidic" related summary (2013 with Evra); GiveMeSport "All 19 Premier League winning captains" (for the alternative credits).
- Grounds: Wikipedia, "List of Premier League stadiums" and each stadium's article (Riverside Stadium, Kirklees Stadium, Toughsheet Community Stadium, Pride Park Stadium, Stadium of Light, bet365 Stadium, Madejski Stadium, DW Stadium, St Mary's Stadium, King Power Stadium, MKM Stadium, City of Manchester Stadium, Coventry Building Society Arena, Swansea.com Stadium, Emirates Stadium, Cardiff City Stadium, Falmer Stadium, London Stadium, Tottenham Hotspur Stadium, Brentford Community Stadium, Hill Dickinson Stadium, Stadium MK), fetched 3 Oct 2026.
- Arsenal 1995 caretaker: Wikipedia "1994-95 Arsenal F.C. season" (Houston in charge v Forest, 21 Feb 1995). West Brom 2013: wba.co.uk and ITV (Clarke sacked after Cardiff defeat, 14 Dec 2013).

## Flags

1. **W/D/L is worked out, not copied.** Wikipedia's manager list has no W/D/L. Every figure comes from matching results to spell dates. All top-20 game totals agree with Wikipedia and the published W/D/L checks above agree, so the leading boards are solid. Spells further down may be off by one game where a sacking or appointment fell on a match day and was not checked one by one.
2. **Match-day changeovers settled by hand** (in `join.py` as overrides): Arsenal 21 Feb 1995 to Houston; Coventry 23 Oct 1993 to Gould; Everton 4 Dec 1993 to Kendall; Man City 19 Dec 2009 to Hughes; Villa 23 Apr to 22 May 2011 (5 games) to McAllister (Houllier in hospital); Villa 2 Nov 2015 to MacDonald; Chelsea 19 Dec 2015 to Holland; QPR 24 Nov 2012 to Bowen; Palace 23 Nov 2013 to Millen and 19 Feb 2024 to McCarthy; Newcastle 1 Jan 2015 to Carver; West Brom 1 Jan 2015 to Kelly and 14 Dec 2013 to Clarke; West Ham 15 May 2011 to Grant; Southampton 15 Dec 2024 to Martin; Stoke 15 Jan 2018 to Niedzwiecki; Swansea 18 Jan 2016 and 3 Jan 2017 to Curtis; Portsmouth 26 Oct 2008 to Jordan; Man City 19 Mar 2005 to Pearce (Wikipedia starts his spell on 21 Mar); Portsmouth 25 Nov to 23 Dec 2004 (6 games) to Velimir Zajec (Wikipedia dates his start 24 Dec 2004, very likely a slip for 24 Nov). The Redknapp, Hughes, O'Neill, Pulis and Pardew fixes were needed to make their totals match Wikipedia.
3. **Joint managers credited to both:** Roy Evans and Gerard Houllier (12 games, 1998/99), Paul Goddard and John Wark (Ipswich 1994), Attilio Lombardo and Tomas Brolin, Ron Noades and Ray Lewington (Palace 1998), John Deehan and Stuart Gray (Villa 2002), Graham Rix and Ray Wilkins (Chelsea 2000), David Pleat and Chris Hughton (Spurs 1998, 4 games), Clive Allen and Alex Inglethorpe (Spurs 2007), Adam Sadler and Mike Stowell (Leicester 2019, 2023), Kevin Bond and Chris Ramsey (QPR 2015). None of these changes any top-ten board except Houllier's foreign total (234 with, 222 without), who is 11th either way.
4. **Six games with no manager in Wikipedia's list** (left unattributed in the CSV): Southampton 15 Jan 1994, Spurs 24 Nov 1997, Blackburn 29 Nov 1998 and 11 Sep 2004 (probably Tony Parkes), Sunderland 4 Dec 2011 (Eric Black), Reading 16 Mar 2013 (probably Eamonn Dolan). None affects any board.
5. **Joe Kinnear split:** Wikipedia's games table shows Wimbledon 284 and Newcastle 18; Wimbledon only played 278 Premier League games while he was there, so the split is wrong, but the total (302) agrees. Our CSV has Wimbledon 278, Newcastle 24 (Wikipedia's spell dates give Kinnear the games Chris Hughton took while Kinnear was ill in 2009).
6. **Pardew split:** Wikipedia's table says Palace 74, Charlton 18; the match data says Palace 73, Charlton 19. Total 320 agrees.
7. **Guardiola draws and defeats:** 58 and 53 (match data, adds to 380 and to The Analyst's 865 points), not the 57 and 52 in `PL_MANAGER_GAMES_2026-10-03.md`.
8. **Medals:** single source (Wikipedia Featured List checked against Premier League profiles). Solid. The 6-medal tie makes a top ten of 16 names.
9. **Captains:** 1992/93, 1993/94 (Bruce and Robson together), 2007/08 (Giggs lifted, Neville club captain) and 2016/17 (Terry and Cahill together) are disputed or shared. Counting rule changes the per-player totals below the top three. Arsenal 2025/26 Odegaard rests on news reports from 24 May 2026 (single outlet group, AFP).
10. **Grounds:** years are from Wikipedia stadium articles. Brentford, Sunderland, Stoke and Southampton exact first-league-game dates were not checked, but their years are certain (the new ground opened that summer). Whether Wimbledon to Milton Keynes counts is a judgement call.

## Summary of board quality

- Solid: most points, most defeats, longest single spell, foreign managers' games, Scottish, Italian (tie at 10th: Sarri and Mazzarri), Spanish, most medals (but 11-way tie on 6), players who won with two clubs (exactly 11), clubs moving ground (21 clubs, needs a cut).
- Shaky: title-winning captains per player below the top three (counting rule for shared lifts).
- Impossible: none.
