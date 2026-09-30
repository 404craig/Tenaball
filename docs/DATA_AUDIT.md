# Tenaball data audit

Status: audit only. Nothing in `index.html` or the game was changed. Snapshot date: 30 September 2026.

## Read this first

- **Where the data came from.** Everything audited here came from Craig's Google Drive folder "Tenaball Data Dump", which is a copy of his local "tenaball data" folder. The cloud session that did this audit cannot reach Craig's PC, so the Drive copy is all it saw.
- **What is in it.** 473 files, all CSV (30,113,264 bytes, about 30.1 MB), in five subfolders: `bulk`, `fbref`, `mgr`, `trf` and `wc`. There are **no zip files**.
- **Possibly missing files.** Craig expected files with the prefixes `fbref_`, `tour_`, `mt_` and `wf_`. **None of those prefixes exist in the dump.** The notes files inside the dump also name files that are not there (listed in section 3.0). If Craig has these on his PC, they did not make it into the upload.
- **Nothing is "checked against a source" yet.** The network proxy blocked direct page reads of FBref, Wikipedia, UEFA, FIFA, 11v11 and premierleague.com (and most other stats sites). Every spot-check below rests on **web search result summaries**, plus a few comparisons with **GitHub copies of public datasets** (Fjelstul World Cup database, martj42 international results, openfootball). Under Craig's rule ("only use data that has been checked against a source"), **nothing in this report counts as checked until someone reads the source pages first-hand.** Where the report says "match", read it as "consistent with a search summary".
- **Computed figures.** Some Premier League figures in sections 4 and 5 were worked out in this combined pass by joining `agg_pl_a.csv` and `agg_pl_b.csv` on `fbref_player_id`. These are labelled **"computed from the files, not source-checked"**.
- The per-group working notes (13 files) and the joined per-season CSVs (`agg_*.csv`) are in "/home/user/tenaball audit work/" outside the repo.

## Contents

1. Inventory
2. Sources and spot-checks
3. Gaps and conflicts (the holes)
4. What's usable (wishlist and planned work)
5. New ideas
6. Recommended next steps

---

## 1. Inventory

### 1.1 Folders

| Folder | Files | Bytes | What it holds |
|---|---:|---:|---|
| bulk | 32 | 19,387,755 | Two public datasets (Fjelstul World Cup, martj42 internationals) and a download log |
| fbref | 431 | 10,496,364 | Season-by-season player and keeper stats for six leagues, Champions League player stats, one notes file |
| mgr | 1 | 301 | A one-row log saying manager collection was blocked |
| trf | 5 | 153,150 | Transfer fee lists read from Wikipedia, a cross-check against a Transfermarkt scrape, a log |
| wc | 4 | 75,694 | World Cup and Euros tournament summaries, all-time records, knockout stages, a log |
| **All** | **473** | **30,113,264** | |

Files inside zips: **none** (the dump has no zip files).

Format: every file is UTF-8 CSV. The fbref files have a byte order mark (BOM) at the start.

### 1.2 FBref season files, one row per league and file type

All claim FBref as their source (FBref 8-character player ids in every row, and `fbref notes.csv`). One row per player (or keeper) per club per season, league matches only; a player who moved mid-season has one row per club.

Player file columns: season, league, fbref_player_id, player, nation, position, club, age, matches_played, starts, minutes, goals, assists, penalty_goals, penalty_attempts, yellow_cards, red_cards.

Keeper file columns: season, league, fbref_player_id, player, club, matches_played, starts, minutes, goals_against, clean_sheets, saves, penalties_faced, penalties_saved.

Champions League file columns: season, fbref_player_id, player, club, matches_played, goals, assists (no minutes, nation, position or age).

| League | File type | Seasons | Files | Total bytes | Rows | Notes |
|---|---|---|---:|---:|---:|---|
| Premier League | players | 1992-93 to 2025-26 | 34 | 1,672,616 | 18,653 | 22 clubs to 1994-95, then 20 |
| Premier League | keepers | 1992-93 to 2025-26 | 34 | 118,575 | 1,480 | |
| La Liga | players | 1992-93 to 2025-26 | 34 | 1,522,919 | 18,538 | 22 clubs in 1995-96 and 1996-97 |
| La Liga | keepers | 1992-93 to 2025-26 | 34 | 107,839 | 1,256 in 29 files, plus 5 files (2015-16 to 2019-20) of 38 to 51 rows each not recounted | |
| Serie A | players | 1992-93 to 2025-26 | 34 | 1,477,545 | 10,578 in 18 files (1992-93: 404; 2009-10 to 2025-26: 10,174). The 16 files 1993-94 to 2008-09 were read as text and not row-counted | 18 clubs to 2003-04, then 20 |
| Serie A | keepers | 1992-93 to 2025-26 | 34 | 108,716 | 851 in 18 files; 16 files (2.2 to 4.0 KB each) not counted | |
| Bundesliga | players | 1992-93 to 2025-26 | 34 | 1,385,531 | 16,114 | 18 clubs every season |
| Bundesliga | keepers | 1992-93 to 2025-26 | 34 | 92,682 | 1,211 | |
| Ligue 1 | players | **1995-96** to 2025-26 | 31 | 1,345,112 | 16,712 | No 1992-93 to 1994-95 |
| Ligue 1 | keepers | **1995-96** to 2025-26 | 31 | 89,436 | 1,252 | |
| Scottish Premiership | players | **2000-01** to 2025-26 | 26 | 872,336 | 8,791 in 25 files; **2018-19 (37,679 bytes) not read** | 12 clubs every season |
| Scottish Premiership | keepers | **2000-01** to 2025-26 | 26 | 61,818 | 708 | |
| Champions League | players | 1992-93 to 2025-26 | 34 | 1,163,248 | 22,119 | 32, 16, 24, 32 then 36 clubs as the format changed |
| (all fbref) | notes | none | 1 | 19,645 | 108 | `fbref/fbref notes.csv`: columns league, season, file, issue. The collector's log of known blanks and omitted rows for all fbref files |

Check: these rows plus the ten "(1)" copies below add up to the 431 fbref files and 10,496,364 bytes in the Drive listing.

### 1.3 bulk, trf, wc and mgr files, one row each

**Fjelstul World Cup database (bulk/fj_*)**. Every file is an unedited copy of the public Fjelstul World Cup Database v1.2.0 (19 July 2023, CC-BY-SA 4.0). Men's World Cups 1930 to 2022, women's 1991 to 2019.

| File | Bytes | Rows | Holds | Years covered |
|---|---:|---:|---|---|
| bulk/fj_award_winners.csv | 19,791 | 200 | Award winners (Golden Ball, Boot, Glove, Best Young Player, Silver and Bronze) | Men 1930 to 2022, women 1991 to 2019 |
| bulk/fj_awards.csv | 397 | 8 | List of awards with year introduced | none |
| bulk/fj_bookings.csv | 598,373 | 3,178 | Yellow and red cards | Men **1970** to 2022; women without 1999 |
| bulk/fj_confederations.csv | 715 | 6 | Confederations | none |
| bulk/fj_goals.csv | 734,494 | 3,637 | Every goal, with minute, penalty and own-goal flags | Men 1930 to 2022, women 1991 to 2019 |
| bulk/fj_group_standings.csv | 62,500 | 626 | Group tables | 20 men's tournaments (1934 and 1938 had no groups), 8 women's |
| bulk/fj_groups.csv | 10,042 | 159 | Groups | as above |
| bulk/fj_host_countries.csv | 2,162 | 31 | Hosts and how the host did | Men 1930 to 2022, women 1991 to 2019 |
| bulk/fj_manager_appearances.csv | 393,050 | 2,538 | Manager for each match | as above |
| bulk/fj_manager_appointments.csv | 55,021 | 637 | Manager per team per tournament | as above |
| bulk/fj_managers.csv | 39,938 | 475 | Managers | none |
| bulk/fj_matches.csv | 298,930 | 1,248 | Every match (964 men's, 284 women's) | as above |
| bulk/fj_penalty_kicks.csv | 65,128 | 396 | Shoot-out kicks only | Men 1982 to 2022, 5 women's tournaments |
| bulk/fj_player_appearances.csv | 4,676,840 | 27,432 | Player per match, starter or sub | Men **1970** to 2022; women without 1999 |
| bulk/fj_players.csv | 1,111,882 | 10,401 | Players, birth dates, positions, tournaments | none |
| bulk/fj_qualified_teams.csv | 44,266 | 625 | Teams per tournament and how far they got | Men 1930 to 2022, women 1991 to 2019 |
| bulk/fj_referee_appearances.csv | 233,232 | 1,248 | Referee per match | as above |
| bulk/fj_referee_appointments.csv | 81,522 | 668 | Referees per tournament | as above |
| bulk/fj_referees.csv | 63,549 | 493 | Referees | none |
| bulk/fj_squads.csv | 1,331,815 | 13,843 | Squad lists | Men 1930 to 2022, women 1991 to 2019 |
| bulk/fj_stadiums.csv | 34,297 | 240 | Stadiums and capacities | none |
| bulk/fj_substitutions.csv | 1,878,063 | 10,222 | Substitutions | Men **1970** to 2022; women without 1999 |
| bulk/fj_team_appearances.csv | 557,506 | 2,496 | One row per team per match (win, draw, loss, shoot-out flag) | Men 1930 to 2022, women 1991 to 2019 |
| bulk/fj_teams.csv | 24,772 | 88 | Teams | none |
| bulk/fj_tournament_stages.csv | 14,644 | 155 | Stages | Men 1930 to 2022, women 1991 to 2019 |
| bulk/fj_tournament_standings.csv | 6,965 | 120 | Final positions 1 to 4 | as above |
| bulk/fj_tournaments.csv | 3,287 | 30 | Tournaments, hosts, winners | as above |

**International results (bulk/mj_*) and the bulk log.** The mj files are byte-identical (or matching by size and samples) to the public martj42 "international_results" dataset on GitHub. Men's full internationals.

| File | Bytes | Rows | Holds | Years covered |
|---|---:|---:|---|---|
| bulk/mj_results.csv | 3,729,861 | 49,547 | Every international match: date, teams, score, tournament, city, country, neutral | 30 Nov 1872 to 26 Aug 2026 |
| bulk/mj_goalscorers.csv | 3,274,764 | 47,914 | Goals with scorer, minute, own goal and penalty flags (**no friendlies**) | 2 Jul 1916 to 19 Jul 2026 |
| bulk/mj_shootouts.csv | 29,050 | 683 | Penalty shoot-outs and winners | 1967 to 7 Jul 2026 |
| bulk/mj_former_names.csv | 1,691 | 36 | Former team names, with dates | name map |
| bulk/od_notes.csv | 9,208 | 58 | Download and QA log for the fj, mj and wf datasets | none |

**Transfers (trf).**

| File | Bytes | Rows | Holds | Years covered |
|---|---:|---:|---|---|
| trf/ew_notes.csv | 23,650 | 101 | Collector's log: sources used, gaps, page contradictions | none |
| trf/ew_wiki_club_records.csv | 53,254 | 373 | Club record signings and sales for 32 clubs, read from Wikipedia club pages | Mixed, up to summer 2026 |
| trf/ew_wiki_league_records.csv | 42,882 | 150 | World top 50, English clubs top 20 in and out, top 20 English players, Serie A record progression, Scotland lists | Up to summer 2026, but before 1 Sept 2026 |
| trf/ew_wiki_world_records.csv | 4,920 | 31 | World transfer record progression since 1992, two overlapping versions | 1992 to 2017 |
| trf/ew_xchk.csv | 28,444 | 310 | Wikipedia fees compared with the ewenme Transfermarkt scrape | Scrape ends January 2023 |

**World Cup and Euros (wc).**

| File | Bytes | Rows | Holds | Years covered |
|---|---:|---:|---|---|
| wc/tournaments.csv | 5,040 | 40 | One row per tournament: hosts, teams, winner, runner-up, final score and venue, third, fourth, semi-final losers, goals, matches | 23 World Cups 1930 to 2026, 17 Euros 1960 to 2024 |
| wc/all_time_records.csv | 9,279 | 95 | World Cup career goals (9 or more), Euro career goals (5 or more), titles and final appearances per team | Every tournament to 2026 (WC) and 2024 (Euros) |
| wc/knockout_teams.csv | 33,252 | 741 | Every team at every tournament with the stage reached | WC 1930 to 2026, Euros 1960 to 2024 |
| wc/notes.csv | 28,123 | 138 | Collector's log for the wc folder | none |

**Managers (mgr).**

| File | Bytes | Rows | Holds | Years covered |
|---|---:|---:|---|---|
| mgr/mgr_notes.csv | 301 | 1 | One line: collection stopped at the first Transfermarkt page, "blocked by site". **No manager data at all** | none |

### 1.4 The "(1)" duplicate copies

| Copy | Bytes | Original bytes | Same data? | Keep which |
|---|---:|---:|---|---|
| fbref/champions_league_2017-18 (1).csv | 42,853 | 35,391 | Same players, clubs, matches, goals, assists. The copy drops the country prefix on club names ("eng Liverpool" becomes "Liverpool") and quotes every field, which is why it is bigger | Keep "(1)" |
| fbref/champions_league_2018-19 (1).csv | 43,368 | 35,748 | as above | Keep "(1)" |
| fbref/champions_league_2019-20 (1).csv | 42,816 | 35,286 | as above | Keep "(1)" |
| fbref/champions_league_2020-21 (1).csv | 45,708 | 37,713 | as above | Keep "(1)" |
| fbref/champions_league_2021-22 (1).csv | 46,559 | 38,418 | as above | Keep "(1)" |
| fbref/champions_league_2022-23 (1).csv | 45,127 | 37,273 | as above | Keep "(1)" |
| fbref/champions_league_2023-24 (1).csv | 44,863 | 36,984 | as above | Keep "(1)" |
| fbref/champions_league_2024-25 (1).csv | 55,195 | 45,575 | as above | Keep "(1)" |
| fbref/champions_league_2025-26 (1).csv | 55,179 | 45,612 | as above | Keep "(1)" |
| fbref/players_scottish-premiership_2025-26 (1).csv | 36,678 | 36,678 | Byte-identical (same MD5, 389 rows each) | Either; one can go |

`fbref notes.csv` confirms the Champions League "(1)" files are the corrected ones and the originals can be deleted.

---

## 2. Sources and spot-checks

Reminder: every "match" below is against a **search result summary** or a GitHub dataset copy, not a page read first-hand. The URLs are the pages the summaries came from, so they are the pages to open when doing the real check.

### 2.1 Claimed sources

| Files | Source the file claims | How we know |
|---|---|---|
| fbref/players_*, keepers_*, champions_league_* | FBref standard and goalkeeping stats pages ("Big 5" pages for the five leagues) | FBref player ids in every row; `fbref notes.csv`. No URL or scrape date inside the files |
| bulk/fj_* | Fjelstul World Cup Database v1.2.0, github.com/jfjelstul/worldcup | Byte-for-byte match with the public copy (17 files by MD5, the rest by size and content). Licence CC-BY-SA 4.0 needs a credit line |
| bulk/mj_* | martj42 international_results, github.com/martj42/international_results | `od_notes.csv` label, and byte match with upstream (commit 394fe81). Its README says it is built from Wikipedia, RSSSF and national FA sites |
| bulk/od_notes.csv | Log of downloads from the three open datasets (fj, mj, wf) | The file itself |
| wc/* | Wikipedia pages read through a summarising tool (notes say the pages looked cached), RSSSF for 2026 and for the Euro and World Cup scorer lists | `wc/notes.csv` |
| trf/ew_wiki_* | Wikipedia transfer pages ("List of most expensive association football transfers", "List of most expensive English football transfers", "World football transfer record", club pages) read through a summarising tool | `trf/ew_notes.csv` and the source_page column |
| trf/ew_xchk.csv | Comparison against github.com/ewenme/transfers (a Transfermarkt scrape, last data commit 6 March 2023, no licence file) | `trf/ew_notes.csv` |
| mgr/mgr_notes.csv | Transfermarkt Premier League 2025/26 page, blocked | The file itself |

### 2.2 Premier League (players and keepers)

| Check | File | Source summary | Result | URL |
|---|---|---|---|---|
| 1992-93 top 4 scorers | Sheringham 22 (1 Forest + 21 Spurs), Ferdinand 20, Holdsworth 19, Quinn 17 | same | match | https://www.sportsmole.co.uk/football/premier-league/1992-93/top-goal-scorers.html ; https://www.englishfootballleaguetables.co.uk/stats/Report/goal/g1992-93.html |
| 1997-98 top scorers | Dublin, Owen, Sutton 18 | same | match | https://www.sportsmole.co.uk/football/premier-league/1997-98/top-goal-scorers.html |
| 2003-04 top 9 | Henry 30, Shearer 22, Saha 20, van Nistelrooy 20, Forssell 17, Anelka, Angel, Yakubu, Owen 16 | same | match | https://www.englishfootballleaguetables.co.uk/stats/Report/goal/g2003-04.html ; https://www.espn.com/soccer/stats/_/league/ENG.1/season/2003/premiership-de-inglaterra |
| 2004-05 top 7 | Henry 25, A. Johnson 21, Pires 14, Lampard, Hasselbaink, Defoe, Yakubu 13 | same | match | https://www.sportsmole.co.uk/football/premier-league/2004-05/top-goal-scorers.html |
| 2000-01 mid-table | Marcus Stewart (Ipswich) 19 | 19 | match | https://en.wikipedia.org/wiki/2000%E2%80%9301_Ipswich_Town_F.C._season |
| 2004-05 keeper | Cech 35 apps, 13 conceded, 24 clean sheets | same | match | https://www.premierleague.com/en/news/3251101 ; https://theanalyst.com/articles/the-most-premier-league-clean-sheets |
| Le Tissier career | 101 goals in 270 | 100 in 270 | **conflict (1 goal, 1998-99 has 7, official 6)** | https://www.premierleague.com/players/533/Matthew-Le-Tissier/stats |
| Career penalties | Shearer 56, Le Tissier 24, Henry 24, Unsworth 21, van Nistelrooy 19 | Shearer 56, Le Tissier 25, Henry 23, Unsworth 22, van Nistelrooy 18 | Shearer matches; **four differ by 1** | https://www.statbunker.com/alltimestats/AllTimePenalties?comp_code=EPL ; https://www.worldfootball.net/competition/co91/england-premier-league/records-all-time-penalties/ |
| Career red cards to 2008-09 | Ferguson, Dunne, Vieira 8; Keane, Vinnie Jones, Alan Smith 7 | same, plus Cattermole 7 later | match | https://theanalyst.com/articles/most-premier-league-red-cards |
| 2025-26 top 6 | Haaland 27, Igor Thiago 22, Semenyo 17 (10 + 7), Watkins 16, Joao Pedro 15, Gibbs-White 15 | same | match | https://sports.yahoo.com/articles/premier-league-2025-26-top-201145753.html ; https://www.si.com/soccer/2025-26-premier-league-top-scorers-most-assists-golden-glove-winner |
| 2025-26 Salah | 7 | 7 | match | https://www.nbcsports.com/soccer/news/mohamed-salah-liverpool-stats-all-time-records-video-highlights |
| 2025-26 Mateta | 12 | 12 | match | https://tribuna.com/en/persons/jeanphilippe-mateta/stat/2025-2026/epl/ |
| 2025-26 Raya | 19 clean sheets in 37 | same | match | https://www.premierleague.com/en/news/4604681/ |
| 2014-15 top 3 | Aguero 26, Kane 21, Costa 20 | same | match | https://www.espn.com/soccer/stats/_/league/ENG.1/season/2014/english-premier-league |
| All-time penalties, recent players | Salah 35, Kane 33, Vardy 27, Aguero 27 | same | match | https://www.footballfancast.com/premier-league-most-penalties-scored-all-time/ |
| 2011-12 Grant Holt | 15 goals, 36 apps | 15 goals, "31 apps" | goals match, apps unresolved | https://en.wikipedia.org/wiki/2011%E2%80%9312_Norwich_City_F.C._season |
| **2023-24 clean sheets** | Raya 14, Pickford 10, Onana 9, Martinez 7, Vicario 6 | Raya 16, Pickford 13, Onana 9, Martinez 8, Vicario 7 | **conflict: the 2023-24 keeper file is short** | premierleague.com news 3980036; sofascore |

Blocked when tried: en.wikipedia.org, fbref.com, sportsmole.co.uk, englishfootballleaguetables.co.uk, statmuse.com, 11v11.com, premierleague.com, arsenal.com, espn.com.

### 2.3 La Liga

| Check | File | Source summary | Result | URL |
|---|---|---|---|---|
| Bebeto 1992-93 | 29, top | 29, Pichichi | match | https://en.wikipedia.org/wiki/1992%E2%80%9393_La_Liga |
| Zamorano 1994-95 | 28, top | 28 | match | https://en.wikipedia.org/wiki/1994%E2%80%9395_La_Liga |
| **Forlan 2004-05** | 24 (tied with Eto'o) | 25, sole Pichichi | **conflict** | https://en.wikipedia.org/wiki/2004%E2%80%9305_La_Liga |
| **Raul 2001-02** | 15 | 14 | **conflict** | https://en.wikipedia.org/wiki/Ra%C3%BAl_(footballer) ; https://fbref.com/en/players/2b81295d/Raul |
| **Raul 2006-07** | 8 | 7 | **conflict** (career 230 in file, 228 in sources) | as above |
| **Villa 2004-05 (Zaragoza)** | 14 goals, 2,807 min | 15 goals, 2,803 min | **conflict** | https://en.wikipedia.org/wiki/2004%E2%80%9305_Real_Zaragoza_season |
| Messi 2007-08 | 27 games, 10 goals | 28 games, 10 goals | goals match, **one game short** (file career 519 v usual 520) | https://fbref.com/en/players/d70ce98e/Lionel-Messi |
| Valdes 2004-05 (keeper) | 35 games, 25 conceded | same | match | https://en.wikipedia.org/wiki/Ricardo_Zamora_Trophy |
| 2025-26 Mbappe | 25 goals (8 pens) in 31 | same | match | https://sports.yahoo.com/articles/la-liga-top-goal-scorers-212600100.html |
| 2025-26 Muriqi | 23 goals, 5 pens | 23 goals; pens 5 or 7 | goals match, **pens disputed** | https://sportbusy.com/players/soccer/240209/ |
| 2025-26 top 8 | Mbappe 25, Muriqi 23, Budimir 17, Vinicius, Ferran Torres, Lamine Yamal 16, Oyarzabal 15, Lewandowski 14 | same | match | https://sports.yahoo.com/articles/la-liga-2025-26-season-151235306.html |
| Oyarzabal | 100 La Liga goals by 2025-26 | 100th on 10 May 2026 | match | https://tribuna.com/en/news/2026-05-10-mikel-oyarzabal-reaches-100-la-liga-goals-for-real-sociedad/ |
| 2025-26 Joan Garcia (keeper) | 21 conceded, 15 clean sheets, 74 saves | same but 75 saves | saves **off by 1** | https://www.fcbarcelona.com/en/football/first-team/news/4508895/joan-garcia-20252026-laliga-zamora-trophy-winner |
| 2016-17 Suarez | 28 goals | 28 (StatMuse), 29 on many Pichichi lists | counting difference, say which is used | https://x.com/statmusefc/status/1942584458684596723 |
| 2012-13 Ruben Castro | 18 | 18 | match | Wikipedia 2012-13 Real Betis season (summary) |
| Courtois 2012-13, 2013-14; Valdes 2011-12 | 29 in 37; 24 in 37; 28 in 35 | same | match | https://football-espana.net/2013/06/02/courtois-picks-up-zamora-trophy ; https://laligaexpert.com/zamora-trophy-winners/ |

Overall: 4 of 7 checkable early-season player rows were off by one goal or one game. The 1992-93 to 2008-09 La Liga files do not behave like a clean FBref export.

### 2.4 Serie A

| Check | File | Source summary | Result | URL |
|---|---|---|---|---|
| Sampdoria 1992-93 | Mancini 15, Jugovic 9 | same | match | https://en.wikipedia.org/wiki/1992%E2%80%9393_UC_Sampdoria_season |
| Club goal totals v league table | 1992-93 Sampdoria 43 (table 50); 1997-98 Juventus 62 (67), Inter 58 (62); 2005-06 all within 0 to 2 | tables | **gaps too big for own goals in 1992-93 and 1997-98** | https://en.wikipedia.org/wiki/1992%E2%80%9393_Serie_A ; https://en.wikipedia.org/wiki/1997%E2%80%9398_Serie_A ; https://en.wikipedia.org/wiki/2005%E2%80%9306_Serie_A |
| 2025-26 top scorers | Lautaro 17 (30 apps), Douvikas 14, Malen 14, Thuram 13, Nico Paz 12 | same | match | https://www.goal.com/it/liste/lautaro-martinez-capocannoniere-della-serie-a-2025-2026-leadership-continuita-e-goal-pesanti-nella-stagione-che-ha-consacrato-il-capitano-dell-inter/blta0903f1a65af1544 |
| 2025-26 clean sheets | Butez 19, Svilar 18, Sommer 15 | Butez 19; Svilar 18 or 17; Sommer 16 or 15 | Butez matches, **Sommer unresolved** | https://www.playermanager.info/2026/05/20/top-portieri-per-clean-sheet-in-serie-a-butez-vince-la-classifica-2025-2026/ ; https://www.threads.com/@fbref.stats/post/DYpPRmSjs8i/ |
| Berardi Sassuolo total | 130 to end of 2025-26 | 131 after first goal of 2026-27 | match | https://www.sassuolonews.net/news/berardi-131-sassuolo-supera-pascutti-vede-lautaro-bandiere-65728 |
| Season top scorers 1992-93 to 2024-25 | every winner | the game's seriea-ts boards and memory | consistent, not page-checked | none |
| Career totals from 1992-93 | Totti 250, Di Natale 209, Quagliarella 182, Toni 157 match reported figures; **Del Piero 187 and Gilardino 189 (reported 188 each)** | memory and reported figures | two possible one-goal errors | none |

### 2.5 Bundesliga

| Check | File | Source summary | Result | URL |
|---|---|---|---|---|
| 1993-94 top scorers | Kuntz and Yeboah 18 | same | match | https://en.wikipedia.org/wiki/1993%E2%80%9394_Bundesliga |
| Kahn 2001-02 | 20 conceded, 19 clean sheets | same | match | https://www.statmuse.com/fc/ask/oliver-kahn-most-clean-sheets-in-a-bundesliga-season |
| Cacau 2003-04 to 2007-08 | 5, 12, 4, 13, 9 | same | match | https://www.statmuse.com/fc/player/cacau-27588 |
| **Klose 2004-05** | 14 | 15 | **conflict** | https://www.kicker.de/miroslav-klose/spielerposition/bundesliga/2004-05/werder-bremen |
| **2001-02 season goals** | 860 player goals | 893 in all | **gap of 33, more than own goals explain** | https://en.wikipedia.org/wiki/2001%E2%80%9302_Bundesliga |
| 2025-26 top 9 | Kane 36 (10 pens), Undav 19, Guirassy 17, Schick 16, Diaz 15, Olise 15, Kramaric 14, Burkardt 13, Baumgartner 13 | same | match | https://www.bundesliga.com/en/bundesliga/news/top-scorers-2025-26-harry-kane-guirassy-schick-burkardt-kleindienst-32768 ; https://fcbayern.com/en/news/2026/05/harry-kane-crowned-bundesliga-top-scorer-for-third-year-running |
| Reus 156 (36 Gladbach + 120 Dortmund) | 156 | same | match | https://www.statmuse.com/fc/ask/marco-reus-career-goals-in-bundesliga |
| Kramaric 140 | 140 | "320 apps, 140 goals" | match | bundesliga.com player page (summary) |
| Hradecky 2023-24 | 24 conceded, 15 clean sheets | same | match | https://en.wikipedia.org/wiki/Lukas_Hradecky |
| Neuer 2014-15 | 20 clean sheets | 20 | match | https://www.thescore.com/bund/news/768986 |
| **Neuer 2015-16** | 20 | 21 (bundesliga.com), 20 (StatMuse) | **sources disagree** | bundesliga.com; statmuse.com |

### 2.6 Ligue 1

| Check | File | Source summary | Result | URL |
|---|---|---|---|---|
| 2025-26 Lepaul | 21 (20 Rennes + 1 Angers) | same, top scorer | match | https://ligue1.com/en/articles/l1_article_4940-top-scorer-esteban-lepaul-a-surprise-option-for-les-bleus ; https://fbref.com/en/players/85ce1949/Esteban-Lepaul |
| 1995-96 top two | Anderson 21, Drobnjak 20 | same | match | https://en.wikipedia.org/wiki/1995%E2%80%9396_French_Division_1 |
| El-Arabi 2010-11 | 38 apps, 17 goals | same | match | https://fbref.com/en/players/c63f6e46/Youssef-El-Arabi |
| Jonathan David at Lille | 13, 15, 24, 19, 16 = 87 | same | match | https://ligue1.com/en/articles/l1_article_2604-record-setting-jonathan-david-leaves-lille |
| PSG scorers | Mbappe 175, Cavani 138, Ibrahimovic 113, Neymar 82, Pauleta 76 | same (leading query, weak) | match | https://www.statmuse.com/fc/ask/psg-all-time-top-scorers?l=ligue1 |
| Ben Yedder | 161 (63 Toulouse + 98 Monaco) | 161; Monaco 97 or 98 | total match, split unclear | https://asmonaco.com/en/closer-look-117-goals-ben-yedder |
| 2015-16 clean sheets | Trapp 18, Enyeama 17, Ruffier 16 | same | match | https://fbref.com/en/comps/13/2015-2016/2015-2016-Ligue-1-Stats |
| **Mandanda career** | 555 apps, 179 clean sheets | 555, **177** | apps match, clean sheets **differ by 2** | https://www.ligue1.fr/Articles/Legendes/2022/07/04/clean-sheets-bilan-historique-gardiens-l1 |
| Nantes and Toulouse 2025-26 (33 games) | 33 each | final-day match abandoned after 22 minutes | explained | https://www.goal.com/en-us/lists/nantes-ultras-invade-pitch-with-flares-as-ligue-1-match-vs-toulouse-abandoned-due-to-dangerous-relegation-protest/blt2e36077c5bde695c |

### 2.7 Scottish Premiership

| Check | File | Source summary | Result | URL |
|---|---|---|---|---|
| Larsson 2000-01 | 35 | 35 | match | https://en.wikipedia.org/wiki/2000%E2%80%9301_Scottish_Premier_League |
| Stavrum 2000-01 (mid-table) | 17 | 17 | match | https://en.wikipedia.org/wiki/Arild_Stavrum |
| Boyd 2005-06 | 15 + 17 = 32 | same | match | https://en.wikipedia.org/wiki/2005%E2%80%9306_Scottish_Premier_League |
| 2022-23 top 3 | Kyogo 27, van Veen 25, Shankland 24 | same | match | https://www.goal.com/en-gb/news/scottish-premiership-top-scorers-2022-23/blta20d3f74e72df432 |
| **Griffiths 2015-16** | 30 | 31 | **conflict** | https://en.wikipedia.org/wiki/2015%E2%80%9316_Scottish_Premiership ; https://www.topscorersfootball.com/player/leigh-griffiths |
| Forster 2013-14 | 21 clean sheets | 21 | match | https://en.wikipedia.org/wiki/2013%E2%80%9314_Celtic_F.C._season |

### 2.8 Champions League

| Check | File | Source summary | Result | URL |
|---|---|---|---|---|
| All-time goals | Ronaldo 140, Messi 129, Lewandowski 109, Benzema 90, Raul 71 | same | match | https://www.uefa.com/uefachampionsleague/news/0257-0e910cf2494a-5185150de9d4-1000--champions-league-all-time-top-scorers-cristiano-ronaldo-/ ; https://www.statista.com/statistics/378059/champions-league-goals-by-player/ |
| **Mbappe all-time** | 70 | 71 "as of June 2026" | **conflict (1 goal)** | as above |
| 2025-26 | Mbappe 15, Kane 14 | same | match | https://www.uefa.com/uefachampionsleague/news/029d-1ec1670159ea-2d1882e6a430-1000--champions-league-top-scorer-kylian-mbappe/ |
| 1993-94 | Koeman, Rufer 8 | same | match | https://www.stuff.co.nz/sport/350203891/wynton-rufer-reflects-being-top-scorer-93-94-uefa-champions-league-30-years |
| 1992-93 | Romario 7 | 7 | match | https://en.wikipedia.org/wiki/1992%E2%80%9393_UEFA_Champions_League |
| 2003-04 | Morientes 9 | 9 | match | https://en.wikipedia.org/wiki/2003%E2%80%9304_UEFA_Champions_League |
| Crouch 2006-07; Bowyer 2000-01 | 6; 6 in 13 | same | match | http://www.sporting-heroes.net/football/liverpool-fc/peter-crouch-9661/uefa-champions-league-2006-07-2005-06_a20602/ ; https://en.wikipedia.org/wiki/Lee_Bowyer |
| Appearances (no qualifiers) | Ronaldo 183, Casillas 177, Messi 163, Muller 163 | same (older UEFA article) | match | https://www.uefa.com/uefachampionsleague/news/025a-0e9f8a3d1e40-d534e8b4a897-1000--champions-league-all-time-appearances-cristiano-ronaldo-iker/ |
| Appearances (UEFA now counts qualifiers) | Ronaldo 183, Casillas 177, Muller 163, Neuer 161, Xavi 151 | 187, 181, 165, 163, 157 | difference fits qualifiers, not a file error | https://www.statista.com/statistics/378070/champions-league-appearances-by-player/ |
| Man Utd club scorers | van Nistelrooy 35, Rooney 30, Giggs 28 | 38, 34, 29 (with qualifiers) | probably qualifiers, not proven | https://www.90min.com/posts/manchester-united-s-all-time-champions-league-top-scorers |
| **Assists** | Ronaldo 45, Messi 41, Di Maria 40, Giggs 39 | Opta: Ronaldo 42, Di Maria 41, Messi 40, Giggs 31 | **disagree (definitions differ, no assists before 1999-00)** | https://theanalyst.com/articles/who-has-the-most-champions-league-assists |
| **2003-04 season goals** | 287 | 309 | **gap of 22, too big for own goals alone** | https://en.wikipedia.org/wiki/2003%E2%80%9304_UEFA_Champions_League |

### 2.9 World Cup and Euros (fj, mj and wc files)

| Check | File | Other source | Result | URL |
|---|---|---|---|---|
| fj files v public Fjelstul v1.2.0 | all 27 | GitHub copy | identical | https://github.com/jfjelstul/worldcup |
| mj files v public martj42 | all 4 | GitHub copy | identical | https://github.com/martj42/international_results |
| 2022 match scores (64) | fj_matches | openfootball 2022 | all match | https://raw.githubusercontent.com/openfootball/worldcup.json/master/2022/worldcup.json |
| Winners, runners-up, 3rd, 4th, hosts 1930 to 2022 | fj | the game's wc boards | 241 entries, 0 mismatches | existing_boards.md |
| All-time WC scorers to 2022 | Klose 16, Ronaldo 15, G. Muller 14, Fontaine 13, Messi 13, Mbappe 12 | search | match | sportsgrid.com, foxsports.com, fifa.com (summaries) |
| WC appearances to 2022 | Messi 26, Matthaus 25, Klose 24 | search | match | olympics.com (summary) |
| WC career goals to 2026 (mj) | Mbappe 22, Messi 21, Klose 16 | search | match | https://sports.yahoo.com/soccer/article/who-has-most-goals-in-world-cup-history-kylian-mbappe-passes-lionel-messi-with-2-goals-in-third-place-game-161623449.html ; https://www.olympics.com/en/news/fifa-world-cup-messi-mbappe-goal-record-klose-football |
| 2026 final (mj, wc) | Spain 1-0 Argentina aet, 19 July 2026 | ESPN, Al Jazeera | match | https://www.espn.com/soccer/match/_/gameId/760517/argentina-spain ; https://www.aljazeera.com/sports/2026/7/19/spain-battle-past-10-man-argentina-1-0-in-extra-time-to-win-2026-world-cup |
| 2026 third place | England 6-4 France | ESPN, FIFA | match | https://www.espn.com/soccer/match/_/gameId/760516/england-france ; https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/france-england-report-highlights-bronze-final |
| Euro career goals | Ronaldo 14, Platini 9, then Kane, Shearer, Griezmann, Morata 7 | wc/all_time_records.csv (RSSSF) | match row for row | internal |
| **Parreira WC matches** | 24 | sacked after 2 games in 1998, so 23 | **conflict (co-manager credit)** | Washington Post, 21 June 1998 (summary) |
| Brazil WC wins | 79 raw | 76 is the usual figure | match once shoot-outs count as draws | memory only |

### 2.10 Transfers

| Check | File | Source summary | Result | URL |
|---|---|---|---|---|
| Rogers to Chelsea | £117m | £117m | match | https://www.espn.com/soccer/story/_/id/49392368/chelsea-agree-117m-deal-aston-villa-morgan-rogers-sources-transfer ; https://www.skysports.com/football/news/11095/13564944/morgan-rogers-transfer-news-chelsea-complete-record-breaking-lb117m-deal-to-sign-forward-from-aston-villa |
| Anderson to Man City | £116m | £116m | match | https://www.skysports.com/football/news/13558090/elliot-anderson-to-man-city-midfielder-completes-record-breaking-lb116m-transfer-from-nottingham-forest |
| Tonali and Mateus Fernandes to Spurs | £92.5m, £85m | same | match | https://www.espn.com/soccer/story/_/id/49246543/sandro-tonali-completes-record-transfer-tottenham-newcastle-united |
| **Barcola to Liverpool** | £106m | £123m | **conflict (base fee v add-ons?)** | https://www.thenationalnews.com/sport/football/2026/09/23/top-20-most-expensive-summer-transfers-of-2026-including-fernandez-anderson-and-barcola/ |
| **Enzo Fernandez to Man City** | missing | £125m, 1 Sept 2026 | **missing from every list** | https://www.skysports.com/football/news/13579972/enzo-fernandez-transfer-news-man-city-sign-midfielder-from-chelsea-in-british-record-equalling-lb125m-deal |
| Everton record | Sigurdsson £45m | same | match | https://www.goal.com/en/news/everton-sign-swansea-star-sigurdsson-for-45m-club-record-fee/m1029nknyspr1ozmkz9hhixlu |
| **Everton list** | no Dibling | Dibling 2025, £35m to £42m | **missing row** | https://www.teamtalk.com/everton/most-expensive-everton-signings-club-history |
| **West Ham record** | one row (Jarvis, no fee) | Paqueta £51m, 2022 | **missing** | https://www.skysports.com/football/news/11685/12682216/lucas-paqueta-signs-for-west-ham-from-lyon-in-club-record-lb51m-deal |

### 2.11 Managers

Nothing to check: there is no manager data (see 3.11).

---
## 3. Gaps and conflicts (the holes)

This is the list to work from when finding data elsewhere. Each competition has the same parts: missing seasons, blank columns by season range, missing or bad rows, off-by-one conflicts with sources, and where to look. A "Where to look" hint is given for each hole. Every hint is a suggestion of where the figure is published, not a promise that the site is reachable or right.

Two holes apply to every league file set, so they are not repeated below:

- **2026/27 so far is missing everywhere.** The files stop at the end of 2025-26. Several existing boards say "to September 2026" (the ten PL club scorer boards, `ucl-at-goals`, `t5-at-goals`). Any board with that date line needs the August and September 2026 games added. Where to look: FBref and the league sites' current-season stats pages.
- **Name and club spellings.** FBref short club names ("Manchester Utd", "Nottingham", "Tottenham", "Racing Sant", "Dep. La Coruna", "Athletic Club", "Milan", "Hellas Verona", "Dunfermline Ath.", "Hamilton Acad.", "Inverness CT") and accented player names need mapping to the game's style before anything is built. Not a data hole, but it blocks direct comparison with `index.html`.

### 3.0 Missing files (across the whole dump)

| Missing | Evidence | What it would have given | Where to look |
|---|---|---|---|
| Any file starting `fbref_`, `tour_`, `mt_` or `wf_` | Craig expected them; none in the 473 | Unknown. `wf_` files are the worldfootballR_data set, which `od_notes.csv` says was downloaded (converted from .rds, some stopping at 2024/25) | Craig's local "tenaball data" folder; re-upload |
| `ew_premier-league.csv`, `ew_primera-division.csv`, `ew_1-bundesliga.csv`, `ew_serie-a.csv`, `ew_ligue-1.csv`, `ew_readme.txt` | Named in `trf/ew_notes.csv` (PL file 23,675 rows, 1992/93 to 2022/23) | Every transfer in the five leagues to January 2023, fees in EUR millions | Craig's PC, or github.com/ewenme/transfers |
| `mj_readme.txt`, `mj_licence.txt` | Named in `bulk/od_notes.csv` | Licence and field notes for the mj set | github.com/martj42/international_results |
| `wc/awards.csv`, `wc/final_standings.csv`, `wc/scorers.csv`, `wc/winning_squads.csv` | Named in `wc/notes.csv`. scorers and winning_squads were "NOT COLLECTED" for WC 1994 on and Euros 1996 on | Tournament awards, full standings, per-tournament scorers, winning squads | Craig's PC; otherwise Wikipedia tournament pages, RSSSF |
| Any manager data | `mgr/mgr_notes.csv` says Transfermarkt blocked the first page | Premier League managers' games and wins | premierleague.com managers stats pages, LMA, Transfermarkt manager pages, Wikipedia "List of Premier League managers" |
| Scottish Premiership players 2018-19 (it is in Drive, id 1Csi_vyGi85rPRZpJ6-156HlrKpKsEPE0, 37,679 bytes) | The file is in the dump, but the audit could not read it (tool output too large, then permission refused) | 2018-19 player rows (Morelos, Edouard, Forrest, Tavernier and others) | Re-download from Drive on a machine that can read it. This is an audit hole, not a data hole |

### 3.1 Premier League

**Missing seasons:** none (1992-93 to 2025-26 all present, 20 or 22 clubs each season, all correct).

**Blank columns by season range**

| Column | Seasons | Blanks | Effect | Where to look |
|---|---|---|---|---|
| penalty_goals | 1992-93 to 2008-09 | 79 rows that have goals. Worst (goals in blank-pen rows, computed from the files, not source-checked): Andy Cole 25, Jamie Redknapp 23, Sheringham 22, Saha 20, Cantona 15, Ruel Fox 15, Dion Dublin 14, Whittingham 11, Anelka 11, Heskey 10. Mostly players who moved mid-season, plus Redknapp in six seasons | Penalty totals for these players are too low | statbunker all-time penalties; worldfootball.net penalty records; premierleague.com player stats |
| penalty_goals | 2014-15 | 2 rows | small | as above |
| penalty_attempts | 1992-93 to 2008-09 (worst 1995-96 to 1997-98) | 3 to 93 rows a season | No "penalties missed" board | as above |
| goals | 2004-05 | Jamie Redknapp, both club rows (Southampton, Spurs) blank, also pens and reds | Redknapp totals short | premierleague.com player page |
| penalties_faced, penalties_saved (keepers) | 1992-93 to 2015-16 | every row | Penalty-save boards can only start in 2016/17 | Opta via theanalyst.com; transfermarkt keeper penalty pages |
| keepers: starts, saves | 2013-14 (Fabianski starts and saves), 2017-18 (Jakupovic saves), 2018-19 (Will Norris minutes) | one row each | Minor | FBref keeper pages |
| nation | 2017-18 onward | 1 row a season | Minor | FBref |

**Missing or bad rows**

| Problem | Season | Detail | Where to look |
|---|---|---|---|
| Missing player row | 2014-15 Sunderland | 417 starts, not 418, and 68 minutes short. One starter missing; club goals may be short too | FBref Sunderland 2014-15 squad page; 11v11 |
| Keeper file wrong | 2023-24 | Clean sheets 1 to 3 short for four of the top five keepers (Raya 14 v 16, Pickford 10 v 13, Martinez 7 v 8, Vicario 6 v 7). Treat the whole file as unreliable | premierleague.com Golden Glove 2023-24; FBref keeper stats |
| Keeper minutes overlap | 1993-94 Sheffield United | 3,940 minutes, 160 more than 42 games | FBref |
| Keeper v player files | 1995-96 Nigel Spink | 1 app in keepers, 2 in players | FBref |
| Outfield players in keeper files | Dicks, Vinnie Jones, Nicol, Radebe 1995-96; Steve Brown 1998-99; Bo Hansen 2001-02; Horsfield 2002-03; Jagielka 2006-07 | Correct as rows, but must be left out of keeper boards | none needed |
| Odd clean sheet | 2018-19 Will Norris | 1 app, 0 starts, minutes blank, 1 clean sheet | FBref |
| Apps unresolved | 2011-12 Grant Holt | 36 in file, summary said 31 | Norwich 2011-12 season page |
| No match-level data | all | No hat-tricks, no game-by-game goals, so no "fastest to 50 or 100" | premierleague.com records; Wikipedia "List of Premier League hat-tricks"; 11v11 match logs |

**Off-by-one and other conflicts**

| Item | File | Source | Where to look |
|---|---|---|---|
| Le Tissier 1998-99 goals | 7 (career 101) | 6 (career 100). Changes Southampton's record scorer total, see 3.12 | premierleague.com player page |
| Career penalties | Le Tissier 24, Henry 24, Unsworth 21, van Nistelrooy 19, Gerrard 33 | 25, 23, 22, 18, Gerrard 31 | statbunker; worldfootball.net |
| 2023-24 clean sheets | see above | Golden Glove figures | premierleague.com |
| Wishlist relegation and promotion counts | Computed from the files' club lists (not source-checked): relegations to 2025-26 give ten clubs on 3; promotions (1993-94 onward) give nine clubs on 3 | The `QUESTION_IDEAS.md` notes say seven clubs on 3 (relegations) and eight on 3 (promotions) | Wikipedia "List of Premier League clubs" relegation and promotion history |

### 3.2 La Liga

**Missing seasons:** none (1992-93 to 2025-26, 20 clubs, 22 in 1995-96 and 1996-97; club lists checked season by season).

**Blank columns by season range**

| Column | Seasons | Blanks | Where to look |
|---|---|---|---|
| assists | 1992-93 to 1998-99 | every row | BDFutbol; Transfermarkt; worldfootball.net |
| assists | 1999-00 to 2008-09 | 4 to 33 rows a season, including a 2,117-minute player (2000-01) and a 1,558-minute player (2003-04) | as above |
| penalty_attempts | 1992-93 to 1998-99 | every row | BDFutbol |
| penalty_attempts | 1999-00 to 2008-09 | 4 to 40 rows a season | BDFutbol |
| penalty_goals | 1992-93 to 1998-99 | 14 to 21 rows a season, all on 0-goal players (harmless) | none needed |
| nation, position | 1992-93 to 1998-99 | 9 to 39 rows a season | FBref, BDFutbol |
| keepers: goals_against | 1992-93 to 1998-99 | 32 to 46 of 37 to 54 rows (almost all) | BDFutbol keeper pages; Zamora Trophy lists |
| keepers: clean_sheets, saves | 1992-93 to 1998-99 | every row | BDFutbol; clean sheets per season from club season pages |
| keepers: penalties faced and saved | 1992-93 to 2014-15 | every row | Transfermarkt; Opta |
| keepers: small blanks | 1999-00 Chuchi; 2005-06 Roberto saves; 2007-08 Andres Fernandez, Juan Carlos; 2010-11 Jesus; 2017-18 Brais Mendez minutes | one row each | FBref |

**Missing or bad rows**

| Problem | Season | Detail | Where to look |
|---|---|---|---|
| Keeper missing from keeper file | 1995-96 Valladolid | Ivan Alonso Lopez (2 starts) in the players file with blank position, not in keepers | BDFutbol |
| Keepers missing | 1996-97 Tenerife | Marino Bacallado and Domingo (1 start each) | BDFutbol |
| Keeper file does not match players file | 2015-16 to 2019-20 | Minutes 1 to 3 out; in 2018-19 and 2019-20 the keeper file adds games (Adan, Riesgo, Sergio Alvarez, Yoel, Fabricio). The players file is the one that adds up | FBref keeper pages |
| Impossible rows | 2015-16 Eibar (39 starts, 3,510 min); 2019-20 Celta, Eibar, Mallorca; 2021-22 Levante (Vezo, a 4-minute "start") | | FBref |
| Outfield players in keeper files | 2003-04 Christian Diaz, Eto'o, Torricelli; 2013-14 Gabi; 2017-18 Brais Mendez (doubtful); 2021-22 Vezo | Leave out of keeper boards | none needed |
| Minutes over the maximum | 1999-00 Kasey Keller (Rayo) | 2,610 minutes in 28 games | FBref |

**Off-by-one and other conflicts**

| Item | File | Source | Where to look |
|---|---|---|---|
| Forlan 2004-05 | 24, tied with Eto'o | 25, sole Pichichi (the game's board agrees with the source) | BDFutbol; Wikipedia 2004-05 La Liga |
| Raul 2001-02 and 2006-07 | 15 and 8 (career 230) | 14 and 7 (career 228) | BDFutbol player page; FBref |
| Villa 2004-05 | 14 goals, 2,807 min | 15 goals, 2,803 min | BDFutbol |
| Messi 2007-08 apps | 27 (career 519) | 28 (career 520) | FBref; BDFutbol |
| Joaquin career apps | 623 | 622 usually quoted | BDFutbol |
| Muriqi 2025-26 pens | 5 | 5 or 7 | LaLiga.com player stats |
| Joan Garcia 2025-26 saves | 74 | 75 | LaLiga.com |
| Suarez 2016-17 | 28 | 29 on many Pichichi lists (Marca's count) | Say which count is used |
| Zamora-style keeper boards | Files count every game | Zamora counts only games of 60 minutes or more (Courtois 2025-26: 28 in 32 v 26 in 31) | Don't build Zamora boards from these files |

Overall: the 1992-93 to 2008-09 half needs a row-by-row re-check or a fresh pull before any board uses it.

### 3.3 Serie A

**Missing seasons:** none (1992-93 to 2025-26, 18 clubs to 2003-04, then 20; known absences such as Juventus 2006-07 correct).

**Blank columns by season range**

| Column | Seasons | Blanks | Where to look |
|---|---|---|---|
| assists, penalty_attempts | 1992-93 to 1997-98 | every row | Transfermarkt; worldfootball.net; Lega Serie A archives |
| assists, penalty_attempts | 1998-99 to 2008-09 | cameo rows and some split-club rows (Nakata, Poggi 1999-00; Bjelanovic, Marazzina 2002-03; Adriano, Stankovic 2003-04; Bazzani, Bojinov, Pazzini 2004-05; Bonanni, Borriello, Di Michele, Mauri 2005-06; Bogdani, Oddo, Vigiani 2006-07) | as above |
| penalty_goals | 1992-93 | 10 of 404 rows (keepers and cameos) | none needed |
| nation, position | 1993-94 to 2008-09 | 1 to 9 fringe rows a season | FBref |
| keepers: goals_against | 1992-93 to 1997-98 | partly filled only (1992-93: 14 of 39 rows) | Wikipedia club season pages; calcio archives |
| keepers: clean_sheets, saves | 1992-93 to 1997-98 | every row | as above |
| keepers: saves | 2005-06 | Balli, Storari (34 apps), Handanovic (two clubs), cameo rows | FBref |
| keepers: goals_against | 2003-04 | Ballotta (Modena, 18 apps) | FBref |
| keepers: penalties faced and saved | 1992-93 to 2015-16 | every row | Transfermarkt |
| keepers: minutes | 2018-19 | Francesco Rossi (Atalanta) | FBref |

**Missing or bad rows**

| Problem | Season | Detail | Where to look |
|---|---|---|---|
| Club goals short of the table | 1992-93 Sampdoria (43 v 50); 1997-98 Juventus (62 v 67), Inter (58 v 62) | Gaps too big for own goals, so scorer rows or goals are probably missing. Run the club-by-club check for every season 1992-93 to 1998-99 | Wikipedia Serie A season pages (full tables); club season pages |
| Rows left out by the collector (no FBref id) | 2012-13 Vittiglio; 2013-14 Bruzzi; 2014-15 Broh, Esposito; 2016-17 Spizzichino, Borello; 2017-18 Rutjens | Fringe players, no effect on any top 10 | FBref |
| Keeper rows missing | 2005-06 Empoli and Messina (3,330 min each); 2016-17 Pegolo (Sassuolo) and Colombo (Cagliari); 2024-25 Parma (Suzuki 36 v 37 apps) | | FBref |
| Keeper minutes short | 1998-99 Inter 3,014; 1999-00 Venezia 3,044; 2002-03 Torino 3,088, Lazio 3,070 | | FBref |
| Copied value | 2005-06 Chimenti (Juventus, 3 apps) | 102 saves copied from his Cagliari row | FBref |
| Keeper v player file | 2014-15 Scuffet; 2019-20 Padelli, Reina; 2018-19 twelve keepers by 1 or 2 minutes | | FBref |
| Suspect minutes | 2003-04 Marazzina (22 apps, 284 min); 2007-08 Langella (25 starts, 1,560 min) | | FBref |
| Not a fault | 2012-13 Cagliari and Roma keepers 3,330 min | The match was awarded, not played | none |
| Audit hole | 1993-94 to 2008-09 | `agg_sa_a.csv` has scorer rows only (goals 1 or more), so it can't give appearance totals for those seasons | Re-read the 16 files with python |

**Off-by-one and other conflicts**

| Item | File | Source | Where to look |
|---|---|---|---|
| Del Piero Serie A goals since 1992/93 | 187 | 188 reported | Juventus.com; Lega Serie A |
| Gilardino | 189 | 188 reported | as above |
| Sommer 2025-26 clean sheets | 15 | 15 or 16 | Lega Serie A stats |
| Signori 1995-96 penalties | 12 | not checked, looks high | Wikipedia 1995-96 Serie A |

### 3.4 Bundesliga

**Missing seasons:** none (1992-93 to 2025-26, 18 clubs every season, promotion and relegation chain correct).

**Blank columns by season range**

| Column | Seasons | Blanks | Where to look |
|---|---|---|---|
| assists, penalty_attempts | 1992-93 to 1998-99 | every row | kicker.de; weltfussball.de; bundesliga.com |
| assists | 1999-00 to 2006-07 | 6 to 32 rows a season | as above |
| penalty_attempts | 1999-00 to 2006-07 | 6 to 35 rows a season | as above |
| penalty_goals | 1992-93 to 1998-99 | 10 to 20 rows a season, all on 0-goal players (harmless) | none needed |
| keepers: goals_against | 1992-93 to 1998-99 | 21 to 30 of 31 to 37 rows | kicker.de season keeper tables |
| keepers: clean_sheets, saves | 1992-93 to 1998-99 | every row | kicker.de; bundesliga.com records |
| keepers: small blanks | 1999-00 Kramer; 2003-04 Bade, Borel; 2005-06 Sela; 2006-07 Rost saves; 2009-10 to 2011-12 one cameo a season | | FBref |
| keepers: penalties faced and saved | 1992-93 to 2015-16 | every row | Transfermarkt |

**Missing or bad rows**

| Problem | Season | Detail | Where to look |
|---|---|---|---|
| Season goals short | 2001-02 | 860 player goals v 893 official, a gap of 33 (own goals are usually 15 to 25). Other seasons not checked against official totals | kicker.de season pages; Wikipedia season pages (goals and own goals) |
| Starts don't add up | 1999-00 to 2005-06 | 1 to 7 clubs a season at 367 to 381 starts, not 374 (for example 2003-04 Bayern 367, Freiburg 381; 2000-01 1860 Munich 378). Goals not affected | FBref |
| Keeper starts | 2003-04 Koln | 36 starts in a 34-game season | FBref |
| Impossible keeper row | 2019-20 Ulreich (Bayern) | 2 apps, 2 starts, 90 minutes (Bayern 35 starts) | FBref |
| More clean sheets than starts | 2021-22 Tschauner (Leipzig, 3 min, 1 clean sheet); 2024-25 Feller (Heidenheim, 1 start, 2 clean sheets) | | FBref; bundesliga.com |

**Off-by-one and other conflicts**

| Item | File | Source | Where to look |
|---|---|---|---|
| Klose 2004-05 | 14 (so career 120) | 15 (kicker, bundesliga.com) | kicker.de player page |
| Neuer 2015-16 clean sheets | 20 | 21 (bundesliga.com), 20 (StatMuse). Counting rule differs | Pick one source and say so |

### 3.5 Ligue 1

**Missing seasons: 1992-93, 1993-94, 1994-95.** FBref has no French top-flight data before 1995-96 (per `fbref notes.csv`). No Ligue 1 player board can say "since 1992/93". Players cut short include Sonny Anderson (Marseille 1993-94, Monaco 1994-95), Patrice Loko, Nicolas Ouedec, Youri Djorkaeff, Rai (PSG 1993-95), Florian Maurice and the keepers Coupet and Lama. Where to look: lfp.fr archives, footballdatabase.eu, RSSSF France pages, Wikipedia "1992-93 French Division 1" and the two seasons after.

**Blank columns by season range**

| Column | Seasons | Blanks | Where to look |
|---|---|---|---|
| assists, penalty_attempts | 1995-96 to 1998-99 | every row | lfp.fr; footballdatabase.eu |
| penalty_goals | 1995-96 to 1998-99 | 13 to 22 rows a season | as above |
| keepers: clean_sheets, saves, penalties | 1995-96 to 1998-99 | every row | ligue1.fr historical clean sheets article (link in 2.6) |
| keepers: goals_against | 1995-96 to 1998-99 | filled for only 16, 16, 6 and 6 rows | lfp.fr |
| keepers: penalties faced and saved | 1995-96 to 2015-16 | every row | Transfermarkt |

**Missing or bad rows**

| Problem | Season | Detail | Where to look |
|---|---|---|---|
| Rows left out (no FBref id) | 2013-14 Orengo, Moracchini; 2014-15 Malick Seck | Fringe players | FBref |
| Keeper starts over games | 1997-98 Strasbourg 35; 1998-99 Toulouse 35, Nancy 35 | Don't use keeper apps for those seasons unchecked | lfp.fr |
| Minutes errors | 1998-99 Laurent Fournier (25 apps, 387 min); 2001-02 Ziani (29 apps, 226 min) | Goals look fine | FBref |
| Team starts off by a few | 1999-00 to 2006-07 (for example Lyon 370, Nantes 378 in 1999-00; Rennes 412 in 2003-04) | Starts and minutes approximate | FBref |
| Short seasons (correct, but must be stated) | 2019-20 (28 games, PSG and Strasbourg 27); 2025-26 Nantes v Toulouse abandoned at 0-0 after 22 minutes | The final ruling on that match is not in the files | ligue1.com |
| League label | 1995-96 to 2001-02 | Files say "Ligue 1"; it was "Division 1" | say so in any date line |

**Off-by-one and other conflicts**

| Item | File | Source | Where to look |
|---|---|---|---|
| Mandanda career clean sheets | 179 | 177 (ligue1.fr, Orange) | ligue1.fr |
| Ben Yedder at Monaco | 98 | 97 or 98 | asmonaco.com |
| 2024-25 top scorer | Dembele and Greenwood both 21 | the game lists Dembele only (see 3.12) | ligue1.com |

### 3.6 Scottish Premiership

**Missing seasons: 1992-93 to 1999-2000** (the Premier Division to 1997-98, then the SPL). No Scottish player board can say "since 1992/93"; they would have to say "since 2000/01". Larsson's 1997-98 to 1999-2000 goals and all of McCoist, Hateley, van Hooijdonk, Cadete and Negri are missing. Where to look: Soccerbase, fitbastats.com (Rangers), thecelticwiki.com (Celtic), RSSSF Scotland, Wikipedia season pages, the Scottish Football Historical Archive.

**Players 2018-19 not read** (see 3.0). Every Scottish total in this report is missing 2018-19. Rangers (Morelos, Tavernier) and Celtic (Edouard, Forrest, Griffiths) club boards are not usable until it is read.

**Blank columns by season range**

| Column | Seasons | Blanks | Where to look |
|---|---|---|---|
| assists, penalty_attempts | 2000-01 to 2006-07 | some rows (Agathe 2000-01; Dodds, Rae 2002-04; Hamilton 2004-05; Hartley 2006-07) | Soccerbase; club history sites |
| nation | scattered | about 14 players (for example Paul Harvey, David Nicholls, Christy Manzinga) | FBref |
| keepers: penalties faced and saved | 2000-01 to 2017-18, 2019-20 to 2025-26 | every row (only 2018-19 has them) | Transfermarkt |
| keepers: goals_against | 2019-20 | Schofield | FBref |

**Missing or bad rows**

| Problem | Season | Detail | Where to look |
|---|---|---|---|
| Keeper file broken | 2018-19 | goals_against 0 for nearly every keeper, saves blank; clean sheets look plausible but unchecked | FBref; SPFL site |
| One player split into two ids | 2021-22 Alex Greive (St Mirren) | f40a57b2 (15 apps, 2 goals) and 7333dd77 (2 apps, 0 goals). Adding by id treats him as two people | FBref |
| Unusual row | 2000-01 Agathe | 4 goals in 5 apps for Hibernian | Hibernian history sites |
| League label | 2000-01 to 2012-13 | Files say "Scottish Premiership"; it was the SPL. Use "Scottish top flight" as the game does | none |
| Correct absences | Rangers 2012-13 to 2015-16 | Matches history | none |
| COVID season | 2019-20 | Cut short, lower totals | say so |
| Audit hole | all | `agg_sco.csv` has no fbref_player_id column, so Scottish totals were added by name | Re-run with ids |

**Off-by-one and other conflicts**

| Item | File | Source | Where to look |
|---|---|---|---|
| Griffiths 2015-16 | 30 | 31 | SPFL; Celtic season page |

### 3.7 Champions League

**Missing seasons:** none (1992-93 to 2025-26). Qualifying rounds are left out by design, and 1991-92 (the first group-stage season, before the name) was not collected.

**Missing columns**

| Column | Seasons | Effect | Where to look |
|---|---|---|---|
| assists | 1992-93 to 1998-99 | every row blank; FBref has none. Career assists of Giggs, Figo, Raul and others too low | UEFA.com player stats; Opta (theanalyst.com) |
| minutes, nation, position, age | all seasons | not in the files at all, so no minutes, nationality or keeper boards | FBref squad pages; UEFA.com |
| own goals | all seasons | not in the files; club totals are player goals only | UEFA match reports |
| qualifying rounds | all seasons | left out, so UEFA's own totals (which now include qualifiers) are higher (Ronaldo 187 v 183 apps) | UEFA.com |

**Missing or bad rows**

| Problem | Season | Detail | Where to look |
|---|---|---|---|
| Rows left out (no FBref id) | 2013-14 (2: "Gil Patri", "P P"); 2015-16 (5, including Sandro Ramirez of Barcelona); 2016-17 (2); 2017-18 (1, Bruno Costa of Porto) | 10 rows; their goals and apps are missing | UEFA.com season stats |
| Season goals short | 2003-04 | 287 v 309 official, a gap of 22. Too big for own goals alone, so rows may be missing | Wikipedia 2003-04 UEFA Champions League; UEFA match reports |
| Season goals short | 2000-01 | 440 v 449 (gap 9, could be own goals) | as above |
| Club names | 2017-18 to 2025-26 originals | Country prefixes ("eng Liverpool"). Fixed in the "(1)" copies | use the "(1)" copies |

**Off-by-one and other conflicts**

| Item | File | Source | Where to look |
|---|---|---|---|
| Mbappe all-time | 70 (6, 4, 4, 5, 8, 6, 7, 8, 7, 15) | 71 per UEFA and Statista "as of June 2026" | UEFA.com player profile, season by season |
| Assists | Ronaldo 45, Messi 41, Di Maria 40, Giggs 39 | Opta: 42, 40, 41, 31 | Pick one definition |
| Man Utd club scorers | van Nistelrooy 35, Rooney 30 and so on | 38, 34 (with qualifiers) | a list that excludes qualifiers |

### 3.8 World Cup and Euros

**Fjelstul files (bulk/fj_*)**

| Hole | Detail | Where to look |
|---|---|---|
| **Men's World Cup 2026 missing** | Fjelstul v1.2.0 stops at 2022. The game already has 2026 in its boards (see 3.12) | openfootball 2026 on GitHub (all 104 matches, scores, scorers, no line-ups); FIFA match reports; Wikipedia 2026 FIFA World Cup |
| **Women's World Cup 2023 missing** | stops at 2019 | FIFA; Wikipedia 2023 FIFA Women's World Cup |
| Player match data before 1970 | player_appearances, substitutions, bookings start in 1970 | RSSSF World Cup line-ups; Wikipedia tournament squad pages |
| Women's 1999 line-ups | missing from player_appearances, substitutions, bookings | FIFA technical report 1999 |
| Shoot-outs counted as wins | team_appearances credits a shoot-out win as a win (Brazil 79 raw, 76 with shoot-outs as draws) | recount as draws, say so on the board |
| Co-managers both credited | 42 team-matches; Parreira has 24, should be 23 (sacked after two games in 1998) | check manager boards man by man |
| Golden Ball from 1978 | awards file dates it from 1978 (Kempes); usually said to start in 1982 | FIFA awards page |
| 1930 third and fourth, 1950 "final" | from FIFA's later rankings (no 1930 play-off, no 1950 final) | the game already handles this |
| West Germany and Germany separate ids | count players by player_id and merge West Germany into Germany for team boards | none |
| Small errors | "quater-finals" spelling; 2002 host as one string "Korea, Japan"; duplicate stadium rows (S-036 and S-037, S-038 and S-039) | none |

**wc folder files**

| Hole | Detail | Where to look |
|---|---|---|
| 2026 blanks in tournaments.csv | stadium, total_goals and matches_played blank (mj has 308 goals in 104 matches; the final was at MetLife Stadium) | FIFA |
| Other blanks | 2006 final venue; Euro final venues 1960 (stadium), 1976, 1980, 1992, 2000; Euro 1968 final score (1-1, replay 2-0); Euro 1976 and 2020 shoot-out scores | Wikipedia final pages |
| Euro 2004, 2008, 2012 third and fourth | filled from infobox order, not a play-off. Don't use as "third place" answers | none |
| Reconstructed stages | knockout_teams for WC 1986, 1998 to 2018 and Euros 2016, 2020, 2024 were derived from match counts because page reads were garbled | Wikipedia tournament pages |
| Spelling | "Bosnia Herzegovina" (2026) v "Bosnia and Herzegovina" (2014) | none |
| Still missing, per wc/notes.csv | most appearances by a player, most tournaments by a player, most goals in a tournament, for both WC and Euros | RSSSF; FIFA |

**International results (mj_*)**

| Hole | Detail | Where to look |
|---|---|---|
| **No goals in friendlies** | 18,385 friendlies with 52,849 goals have 0 scorer rows. Also 0 for AFCON, Asian Cup qualifying, CONCACAF Nations League, Gulf Cup, Asian Games and others. Since 1992 only 34,864 of 87,108 goals have a scorer | RSSSF international top scorers; national FA records; EU-football.info |
| **No caps data at all** | results and goalscorers only | RSSSF "most capped players"; EU-football.info; national FA sites |
| Duplicates | 79 identical goal rows (mostly 1963, 1968, 1980 African and Asian games); 1974-02-17 Tahiti v New Caledonia twice with different scores | RSSSF |
| Blanks | 44 goals with no scorer; 254 with no minute; one shoot-out (2011-06-29 Saare County v Aland Islands) with no result row | none |
| Name forms | current names (West Germany as "Germany", Soviet Union as "Russia") | say so on the board |

### 3.9 Transfers

| Hole | Detail | Where to look |
|---|---|---|
| **Out of date (before 1 Sept 2026)** | Enzo Fernandez to Man City £125m (1 Sept 2026, equal British record) is missing from every list | Sky, Al Jazeera (links in 2.10); re-read the Wikipedia lists |
| **Fee basis mixed** | World and English lists give base fees (Wirtz £100m, Coutinho £105m); club pages and Transfermarkt include add-ons (Wirtz £116m, Coutinho EUR 135m). GBP and EUR mixed; fee_currency sometimes wrong | Choose one source and one rule ("initial fee as reported") |
| Pages contradict each other | Wirtz £116m v £100m; Coutinho £145m v £105m; Suarez £75m v £65m; Antony £82m v £81.3m; Lukaku £90m v £75m; Kane EUR 110m v £86m v £100m+; Dembele EUR 135m v EUR 105m; Bellingham EUR 113m v EUR 103m (and £115m v £88.5m); Havertz £62m v £65m; Gordon £69.3m v £60.6m; O'Donnell £1.75m v £2.6m; Barcola £106m v £123m | as above |
| Club lists incomplete | Liverpool 5 rows (no Barcola, Nunez, Szoboszlai); Arsenal 6 (no Ben White, Madueke, Gyokeres); West Ham 1 (no fee; record is Paqueta £51m); Man City missing Anderson, Bouaddi, Enzo; Everton missing Dibling; Newcastle has Woltemade twice and four "NOT STATED" fees; Chelsea probably missing Joao Pedro; Villa and Spurs have "rising to" and "+" fees | Transfermarkt club transfer records; club Wikipedia pages |
| No La Liga, Bundesliga or Ligue 1 lists | only Serie A as a lira-era progression table | Transfermarkt league record pages |
| Clubs with nothing | Barcelona, Atletico, Bayern, Roma, Lyon and many more; Real Madrid, Inter, Juventus, Milan, Napoli partial | Transfermarkt |
| Extraction slips | Lentini from-club (Sampdoria, should be Torino); garbled 1962 Gladbach name; Napoli and Hibernian role reversals; Ronaldo 1996 missing from one world-record version | none |
| Cross-check mostly unconverted | ew_xchk: 178 of 310 rows are "currency differs" (not converted, so not really checked); 23 "differs" | none |
| ewenme data ends January 2023 and has no licence | nothing after that can be checked against it | none |

### 3.10 Player records (all competitions)

| Record | Hole | Where to look |
|---|---|---|
| Hat-tricks (any league, Champions League) | No match-level data in any fbref file | Wikipedia "List of Premier League hat-tricks" and league equivalents; premierleague.com records; 11v11 |
| Fastest to 50 and 100 goals | No game-by-game data; the season files only show the season a player passed 50 or 100 | premierleague.com records; Opta; 11v11 player match logs |
| Assists before 1999-00 (La Liga, Serie A, Bundesliga, Ligue 1, Champions League) | blank | Transfermarkt; Opta |
| Keeper clean sheets before 1998-99 or 1999-00 (La Liga, Serie A, Bundesliga, Ligue 1) | blank | league and club archives |
| Keeper penalty saves before 2016-17 (all leagues) | blank | Transfermarkt |

### 3.11 Managers

| Hole | Detail | Where to look |
|---|---|---|
| All league manager data | none in the dump. `mgr/mgr_notes.csv` says Transfermarkt blocked the first page | premierleague.com managers stats; LMA; Wikipedia "List of Premier League managers"; Transfermarkt manager records |
| World Cup managers | fj_manager_* exist to 2022 only, with the co-manager problem (3.8) | FIFA; Wikipedia |

### 3.12 Disagreements with existing boards

| Board | Game says | Files say | Comment |
|---|---|---|---|
| `t5-ts-2024/25` (Ligue 1 2024/25) | Ousmane Dembele only | Dembele and Greenwood tied on 21 | The board's brief says "For shared awards, any of the winners counts", so Greenwood should probably be accepted too. Check against ligue1.com before changing |
| `ucl-at-goals` | Lists Mbappe 5th, ahead of Raul | Raul 71, Mbappe 70 | Same ten names either way. The board order fits UEFA's 71 for Mbappe. The one missing goal needs finding |
| World Cup boards ending in 2026 (`wc-win-1990`, `wc-ru-1990`, `wc-host-1990`, `wc-3rd-1990`, `wc-4th-1990`, `wc-f-2010`, `wc-sf-2010`, `wc-aw-2010`, `wc-most-finals`) | include 2026 | Fjelstul data ends in 2022 | Not a conflict in the answers (the mj and wc files and search summaries agree with the game's 2026 entries: Spain, Argentina, England, France, Rodri, Mbappe), but the fj files can't be used to check or extend anything past 2022 |
| `laliga-ts-1996/97` (2004/05) | Forlan | Forlan and Eto'o tied on 24 | The game agrees with the sources (Forlan 25); the file is wrong |
| `spfl-ts-2006/07` (2015/16) | Leigh Griffiths | Griffiths top with 30 | Name right; the file's count (30 v 31) is wrong |
| CLUB_REC Southampton | Le Tissier 100 | 101 | The game agrees with premierleague.com; the file is one high |
| `pl-whu-goals` | Noble listed before Di Canio | Di Canio 48, Noble 47 (computed from the files, not source-checked) | Board is 11v11-based; possible one-goal difference. Same ten names |
| Other PL club scorer boards (`pl-mu`, `-lfc`, `-afc`, `-cfc`, `-tot`, `-mci`, `-new`, `-eve`, `-avl`) | | Same ten names on every board (computed from the files, not source-checked). Everton's pool of three on 29 (Baines, Rideout, Mirallas) also matches | Thin margins: Man Utd Cantona 64 v Martial 63; Newcastle Rob Lee 34 v Ayoze Perez 33; Spurs Iversen 36 v Adebayor 35 |
| `pl-at-goals`, `pl-at-apps` | | Same ten names (computed; Fowler and Defoe tie on 163; Phil Neville 505 is 10th, then Rio Ferdinand and Gerrard on 504) | Tight at 10th for appearances |
| `pl-at-cs` | | Not checked. The 2023-24 keeper file is short, so file totals for keepers active that season (Pickford, Raya and others) would be low | Check against premierleague.com |
| Scottish notes on `spfl-ts-1996/97` | | The Scottish auditor flagged it for Larsson x5 | That board was already removed by the final pass; the game now has `spfl-ts-1992/93` (Larsson 3 times), which is inside the rule |

### 3.13 Oddities in index.html, from existing_boards.md (for information, not changed)

- `t5-bdo-2002` (Ballon d'Or 2002 to 2011) still says "There was no award in 2020." The re-cut copies the brief of the last board in the series.
- Re-cutting leaves big gaps: `pl-cr` keeps only 2015/16 to 2019/20, `pl-mgr` only 2011/12 to 2020/21, `ucl-w` only 1998 to 2017, `t5-bdo` only 2002 to 2011, `spfl-cup` only 2008 to 2017; `bund-ch` and `spfl-ch` vanish. Many trophy series have no 2020s seasons.
- The first three Golden Boot seasons (1992/93 to 1994/95: Sheringham, Cole, Shearer) are on no board; `pl-gb-1995/96` is the earliest window.
- All "highest points" and "most goals in a season" club record boards are removed (one club fills 4 or more slots), except `seriea-rec-gf`.
- No easy (level 0) boards for La Liga, Bundesliga, Serie A, Ligue 1 or the Scottish Premiership; the PL has 8 easy boards of 129.
- Final table coverage differs by league: PL 1992/93 to 2025/26; La Liga and Serie A 1993/94 to 2023/24; Bundesliga and Ligue 1 1993/94 to 2024/25; Scottish 1994/95 to 2025/26.
- `seriea-ch-1997/98` covers 11 seasons (1997/98 to 2007/08) because 2004/05 has no champion.
- Brief grammar in league builders: "finished 2nd in Bundesliga", "top scorer in Scottish top flight" (missing "the").
- Dead builders: `pl-rel`, `pl-pro`, `pl-top4`, `ucl-most` and `t5-dec` are built and then always deleted; `ucl-season-top` is replaced by `ucl-top-*`.
- `CLUB_REC` has only 20 clubs (10 per tier), so a level 2 draw always uses 8 of the same 10 tier-1 clubs.

---
## 4. What's usable: the wishlist and planned work

Every item in `docs/QUESTION_IDEAS.md` and in the "Planned work" part of `CLAUDE.md`, in order. For each: the verdict, the candidate top 10, the exact-10 or pool check, the 4-slot check, the pre-1992/93 check, and what is missing.

Verdicts: **possible** (the data gives a full board, still to be source-read), **partly** (some of it, or with a fix or rule decision), **not possible from this data**.

All numbers are from unchecked files. "Computed" means worked out in this combined pass from `agg_pl_a.csv` plus `agg_pl_b.csv`, joined on fbref_player_id: **computed from the files, not source-checked**. Every PL figure below runs to the end of 2025/26; boards dated "September 2026" need the 2026/27 games added.

### 4.1 Premier League wishlist

#### 4.1.1 Most appearances for each of the 10 clubs

**Verdict: possible** (after a source read). Computed from the files, not source-checked. Premier League games only, 1992/93 to 2025/26.

| Club | Top 10 (apps) | Exact 10 or pool | Active players who will move the list |
|---|---|---|---|
| Man Utd | Giggs 632, Scholes 499, de Gea 415, G. Neville 400, Rooney 393, Keane 326, Carrick 316, Rio Ferdinand 312, Irwin 296, Rashford 287 | Exact (11th Evra 273) | Rashford (if he plays for United again) |
| Liverpool | Carragher 508, Gerrard 504, Henderson 360, Hyypia 318, Salah 315, Reina 285, Robertson 275, van Dijk 272, Fowler 266, Alexander-Arnold 259 | Exact (11th Firmino 256) | Salah, Robertson, van Dijk; Firmino is 3 behind 10th |
| Arsenal | Parlour 333, Seaman 325, Bergkamp 315, Keown 310, Dixon 305, Vieira 279, Winterburn 270, Walcott 270, Ramsey 262, Henry 258 | Exact (11th Adams and Koscielny 255) | none in the ten |
| Chelsea | Terry 492, Lampard 429, Azpilicueta 349, Cech 333, Wise 261, Ivanovic 261, Drogba 254, Mikel 249, Hazard 245, Willian 234 | Exact (11th Zola and Ashley Cole 229) | none in the ten |
| Spurs | Lloris 361, Son 333, Kane 317, Anderton 299, Defoe 276, Dier 274, King 268, Lennon 266, Campbell 255, Ben Davies 245 | Exact (11th Ian Walker 240) | Ben Davies |
| Man City | David Silva 309, Bernardo Silva 304, De Bruyne 285, Ederson 276, Aguero 275, Hart 266, Kompany 265, Fernandinho 264, Dunne 253, then Zabaleta and Yaya Toure 230 | **Pool of 2 at 10th** | Bernardo Silva |
| Newcastle | Given 354, Shearer 303, Ameobi 294, Rob Lee 267, Solano 230, Jacob Murphy 218, Speed 213, Joelinton 212, Coloccini 211, Schar 211 | Exact (11th Aaron Hughes 205) | Murphy, Joelinton, Schar |
| Everton | Coleman 374, Howard 354, Osman 352, Baines 348, Pickford 331, Jagielka 322, Unsworth 302, Hibbert 265, Phil Neville 242, then Duncan Ferguson and Calvert-Lewin 239 | **Pool of 2 at 10th** | Coleman, Pickford |
| West Ham | Noble 414, Cresswell 312, Antonio 268, Bowen 231, Soucek 229, Carlton Cole 216, Potts 204, Rice 204, Ogbonna 201, Fabianski 195 | Exact (11th James Collins 188) | West Ham were relegated in 2025/26 (per `pl-bot-2025/26`), so the list is fixed while they are out |
| Aston Villa | Barry 365, Agbonlahor 322, Alan Wright 260, Hendrie 251, Staunton 244, Ian Taylor 233, McGinn 233, Mellberg 232, Konsa 231, Ehiogu 229 | Exact (11th Watkins 221) | McGinn, Konsa, Watkins (8 behind) |

- 4-slot check: one slot per player, so the rule can't be broken.
- Pre-1992/93 check: all from 1992/93. The date line must say "Premier League games only, since 1992/93": Giggs, Irwin, Adams, Dixon, Winterburn, Seaman, Staunton and others played earlier games that don't count.
- Missing: a first-hand source read (11v11 or premierleague.com club pages). Margins to watch: Arsenal Henry 258 v Adams 255; Liverpool Alexander-Arnold 259 v Firmino 256; Newcastle Coloccini and Schar 211 v Hughes 205.

#### 4.1.2 Relegated clubs, all-time, Premier League era

**Verdict: partly.** The files hold club lists, not tables, so relegation can be read from which clubs drop out the next season. Computed from the files, not source-checked, with the 2025/26 relegations (West Ham, Burnley, Wolves) taken from `pl-bot-2025/26`.

- Candidate: Norwich 6; Leicester, West Brom, Burnley 5; Crystal Palace, Middlesbrough, Sheffield United, Sunderland, Watford 4; then **ten clubs on 3** for 10th (Nottingham Forest, Ipswich, Bolton, QPR, Southampton, Birmingham, Hull, Fulham, Wolves, West Ham).
- Exact-10 check: 9 clear, then a **pool of 10 for 1 slot**. The wishlist note says seven clubs on 3; the files give ten. Recount against a source.
- 4-slot check: one slot per club, fine.
- Pre-1992/93: from 1992/93 on.
- Missing: a source list (Wikipedia "List of Premier League clubs"), and a decision on whether such a large pool is acceptable.

#### 4.1.3 Most promotions to the Premier League

**Verdict: partly.** Computed from the files' club lists, not source-checked, counting promotions into 1993/94 to 2025/26.

- Candidate: Leicester, Sunderland, West Brom, Norwich, Burnley 5; Crystal Palace, Watford, Fulham 4; then **nine clubs on 3** (Newcastle, West Ham, Nottingham Forest, Middlesbrough, Bolton, Birmingham, Wolves, Sheffield United, Hull) for 9th and 10th.
- If 1992/93's promoted clubs count (Ipswich, Middlesbrough, Blackburn came up into the first season), Middlesbrough goes to 4 and Ipswich to 3. The 2026/27 promoted clubs are not in the files.
- Exact-10 check: 8 clear, then a pool (9 for 2 slots, or more). The wishlist note says eight on 3; the files give nine. Recount.
- 4-slot: fine. Pre-1992/93: fine.
- Missing: a source list, the rule decision on 1992/93 and 2026/27.

#### 4.1.4 Most goals in a single season

**Verdict: possible.** Computed from the files, not source-checked.

Version A, seasons can repeat:

| # | Player | Season | Goals |
|---|---|---|---|
| 1 | Haaland | 2022/23 | 36 |
| 2 | Andy Cole | 1993/94 | 34 |
| 3 | Shearer | 1994/95 | 34 |
| 4 | Salah | 2017/18 | 32 |
| 5 | Shearer | 1993/94 | 31 |
| 6 | Shearer | 1995/96 | 31 |
| 7 | Cristiano Ronaldo | 2007/08 | 31 |
| 8 | Suarez | 2013/14 | 31 |
| 9 and 10 | pool of five on 30: Phillips 1999/00, Henry 2003/04, van Persie 2011/12, Kane 2017/18, Kane 2022/23 | | 30 |

- Exact-10: pool of 5 for 2 slots.
- 4-slot: Shearer has 3 slots (the limit is 3), Kane 2 in the pool. Passes.

Version B, best season per player: Haaland 36, Shearer 34, Cole 34, Salah 32, Ronaldo 31, Suarez 31, then Henry, Phillips, van Persie and Kane on 30. **Exactly 10** (11th Drogba 29). One slot per player.

- Pre-1992/93: fine. The brief must say 1992/93 to 1994/95 were 42-game seasons (Cole 34 and Shearer 34 came in those).
- Missing: a source read. The existing boards have no single-season player board, so no duplicate.

#### 4.1.5 Most hat-tricks

**Verdict: not possible from this data.** No match-level rows in any PL file. Missing: a hat-trick list (premierleague.com records, Wikipedia "List of Premier League hat-tricks").

#### 4.1.6 Record signings, all-time, Premier League era

**Verdict: partly.** From `trf/ew_wiki_league_records.csv` (English clubs incoming top 20), plus the Enzo Fernandez deal the list misses. Base fees:

- Candidate: Isak £125m, Enzo Fernandez (Chelsea to Man City) £125m, Rogers £117m, Anderson £116m, Enzo Fernandez (Benfica to Chelsea) £106.8m, Barcola £106m (or £123m), then Grealish, Wirtz, Rice and Caicedo on £100m.
- Exact-10: exactly 10 **only on base fees**; with add-ons the order and members change (Wirtz £116m, Caicedo £115m, Rice £105m).
- 4-slot: Enzo Fernandez appears twice (2 slots), fine.
- Pre-1992/93: all after 1992.
- Missing: one agreed fee source and rule, a re-read after 1 Sept 2026, the Barcola figure settled.

#### 4.1.7 Record signings for each of the 10 clubs

**Verdict: partly (Man Utd only close); not possible for the rest as the file stands.** From `trf/ew_wiki_club_records.csv`.

| Club | Rows | State |
|---|---:|---|
| Man Utd | 10 | Pogba £89.3m, Antony £82m, Maguire £80m, Lukaku £75m, Sancho £73m, Hojlund £72m, Sesko £66.3m, Mbeumo £65m, Cunha £62.5m, Casemiro £60m. Closest to usable; no 2026 deals checked |
| Liverpool | 5 | Not usable (no Barcola, Nunez, Szoboszlai) |
| Arsenal | 6 | Not usable (no Ben White, Madueke, Gyokeres) |
| Chelsea | 10 | Probably missing Joao Pedro and 2026 buys |
| Spurs | 10 | Four 2026 deals, several "+" fees; needs checking |
| Man City | 10 | Out of date: no Anderson, Bouaddi, Enzo Fernandez |
| Newcastle | 13 | Woltemade twice; four "NOT STATED" fees; can't be ordered |
| Everton | 10 | Out of date: no Dibling |
| West Ham | 1 | Nothing usable (record is Paqueta £51m) |
| Aston Villa | 10 | Three July and August 2026 deals with "rising to" fees; not checked |

4-slot: one slot per player. Pre-1992/93: the lists should be cut to deals from 1992/93. Missing: Transfermarkt or club-page lists for nine clubs, and the fee rule.

#### 4.1.8 Managers with the most PL games, and with the most PL wins

**Verdict: not possible from this data.** There is no manager data (`mgr/mgr_notes.csv`). Missing: everything. Where to look: premierleague.com managers stats, LMA.

#### 4.1.9 Fastest to 50 goals and fastest to 100 goals

**Verdict: not possible from this data.** Season totals only; at most they show the season in which a player passed 50 or 100. Missing: game-by-game logs or the premierleague.com records list.

#### 4.1.10 Most penalties scored

**Verdict: partly.** Computed from the files, not source-checked.

- Candidate: Shearer 56, Lampard 43, Salah 35, Gerrard 33, Kane 33, Noble 28, Aguero 27, Vardy 27, Bruno Fernandes 26, then Le Tissier and Henry on 24 (pool of 2 at 10th).
- Search summaries give Gerrard 31, Le Tissier 25 and Henry 23, which would make Le Tissier 10th alone. The 79 blank penalty cells on goal-scoring rows (3.1) don't touch these ten players' totals, but they do touch Cole, Sheringham, Saha and Cantona further down.
- Exact-10: depends on which source; pool of 2 on the file figures.
- 4-slot: one slot per player. Pre-1992/93: fine.
- Missing: one agreed source (statbunker or premierleague.com) for Gerrard, Le Tissier and Henry; Salah, Bruno Fernandes and Haaland (20) are still adding to theirs.

#### 4.1.11 Club record scorers for every Premier League club

**Verdict: possible for the pool.** The files cover every club that has played in the PL. Computed from the files, not source-checked. Record PL scorer for each club not yet in `CLUB_REC` (seasons in the PL in brackets), with the runner-up where it is close:

| Club | Record scorer (file) | Runner-up | Suggested tier |
|---|---|---|---|
| Sunderland (17) | Kevin Phillips 61 | Defoe 34 | 0 |
| Middlesbrough (15) | Hamilton Ricard 31 | Juninho 29 | 1 |
| Wolves (12) | Raul Jimenez 40 | Cunha 29 | 1 |
| West Brom (13) | Peter Odemwingie 30 | James Morrison 29 | 1 |
| Stoke (10) | Peter Crouch 45 | Jonathan Walters 43 | 1 |
| Norwich (10) | Chris Sutton 33 | Grant Holt 23 | 1 |
| Coventry (9) | Dion Dublin 61 | Ndlovu 35 | 1 |
| Bournemouth (9) | Joshua King 48 | Callum Wilson 41 | 1 |
| Watford (8) | Troy Deeney 47 | Doucoure 17 | 1 |
| Wimbledon (8) | Dean Holdsworth 58 | Robbie Earle 45 | 1 |
| Sheffield Wednesday (8) | Mark Bright 48 | David Hirst 34 | 1 |
| Charlton (8) | Jason Euell 34 | Darren Bent 31 | 1 |
| Wigan (8) | Hugo Rodallega 24 | Henri Camara 20 | 1 |
| QPR (7) | Les Ferdinand 60 | Bradley Allen 20 | 1 |
| Birmingham (7) | Mikael Forssell 29 | Cameron Jerome 21 | 1 |
| Derby (7) | Dean Sturridge 32 | Wanchope 23 | 1 |
| Portsmouth (7) | Yakubu 29 | LuaLua and Benjani 19 | 1 |
| Swansea (7) | Gylfi Sigurdsson 34 | Bony 27 | 1 |
| Ipswich (6) | Marcus Stewart 25 | Kiwomya 18 | 1 |
| Sheffield United (6) | Brian Deane 15 | McBurnie 13 | 1 |
| Brentford (5) | Yoane Wissa 45 | Mbeumo 42 | 1 |
| Hull (5) | Nikica Jelavic 12 | Geovanni 11 | 1 |
| Reading (3) | Kevin Doyle 19 | Kitson and Le Fondre 12 | 1 |
| Oldham, Bradford, Cardiff, Huddersfield (2 each); Barnsley, Blackpool, Swindon, Luton (1 each) | Sharp 16, Windass 13, Mutch 7, Mounie 9; Redfearn 10, DJ Campbell 13, Fjortoft 12, Carlton Morris 11 | | Probably leave out (too obscure, and low totals) |

- The file also agrees with 19 of the 20 existing `CLUB_REC` entries; Southampton is Le Tissier 101 in the file against 100 in the game (the game fits premierleague.com).
- 4-slot: a draw of 10 clubs can hold one player more than once (Shearer and Chris Wood are already in twice each). None of the new clubs adds a third club for any player, so the 3-slot limit still holds.
- Pre-1992/93: fine (Premier League goals only).
- Missing: a first-hand source read per club; Craig's call on tiers and on one-season clubs.

### 4.2 Planned work: club top-10 league scorers, 10 clubs per league

One slot per player on all of these, so the 4-slot rule can't bite; only ties at 10th matter. Figures are from the per-league notes (the league halves were joined on fbref_player_id by the league auditors).

#### 4.2.1 La Liga

**Verdict: possible, but the 1992-93 to 2008-09 half has one-goal errors, so every list needs a source read.** Period "La Liga goals, 1992/93 to 2025/26" (La Liga seasons only; second-tier seasons don't count).

| Club | Top 10 | 10th |
|---|---|---|
| Real Madrid | Cristiano Ronaldo 311, Benzema 238, Raul 230 (sources 228), Higuain 107, Ronaldo Nazario 83, Bale 81, Zamorano 77, Vinicius 77, Morientes 72, Ramos 72 | Exact (next Hierro 67) |
| Barcelona | Messi 474, Suarez 146, Eto'o 107, Kluivert 89, Rivaldo 86, Lewandowski 83, Luis Enrique 74, Ronaldinho 70, Neymar 68, then Xavi and Pedro 58 | Pool of 2 |
| Atletico Madrid | Griezmann 143, Torres 103, Aguero 75, Forlan 74, Correa 68, Diego Costa 55, Falcao 52, Kiko 48, Morata 46, then Caminero and Koke 40 | Pool of 2 |
| Sevilla | Kanoute 89, Luis Fabiano 72, Negredo 70, Suker 69, En-Nesyri 51, Gameiro 39, Julio Baptista 38, Ben Yedder 38, Rakitic 36, Bacca 34 | Exact (next Ocampos 33) |
| Valencia | Villa 108, Soldado 59, Mijatovic 56, Parejo 54, Claudio Lopez 46, Fernando Gomez 44, Mendieta 44, Angulo 42, Hugo Duro 42, Baraja 41 | Exact (next Mista 40) |
| Villarreal | Gerard Moreno 95, Rossi 54, Forlan 53, Cazorla 40, Victor 39, Riquelme 36, Bakambu 32, Bacca 28, Nilmar 25, then Joseba Llorente and Ayoze Perez 24 | Pool of 2 |
| Athletic Club | Aduriz 118, Urzaiz 115, Julen Guerrero 103, Etxeberria 89, Fernando Llorente 85, Inaki Williams 84, Ziganda 67, Raul Garcia 65, Muniain 56, Yeste 51 | Exact (next Ezquerro 46) |
| Real Sociedad | Oyarzabal 100, Kovacevic 92, Vela 66, Kodro 60, de Paula 57, Nihat 57, Agirretxe 55, Xabi Prieto 53, Willian Jose 52, de Pedro 45 | Exact (next Griezmann 40) |
| Real Betis | Ruben Castro 77, Alfonso 69, Joaquin 53, Borja Iglesias 39, Finidi 38, Edu 36, Ricardo Oliveira 32, Canales 30, Jorge Molina 29, Fernando 28 | Exact (next Loren 24) |
| Celta Vigo | Aspas 168, Gudelj 68, Mostovoi 56, Nolito 50, Juan Sanchez 38, Catanha 38, Santi Mina 34, Maxi Gomez 30, Baiano 28, then Karpin and Jesuli 26 | Pool of 2 |

- Pre-1992/93: the date line must say "since 1992/93" (Hierro, Butragueno and others lose earlier goals).
- Missing: a re-check of 1992-93 to 2008-09 (Forlan, Raul, Villa errors), BDFutbol or FBref club pages. Aspas's 168 is La Liga only (sources quote 203 Celta league goals including Segunda).

#### 4.2.2 Bundesliga

**Verdict: possible** (after a source read). Period "Bundesliga goals, 1992/93 to 2025/26".

| Club | Top 10 | 10th |
|---|---|---|
| Bayern | Lewandowski 238, Muller 150, Robben 99, Kane 98, Elber 92, Scholl 87, Pizarro 87, Ribery 85, Makaay 78, Gnabry 78 | Exact (11th Gomez 75) |
| Dortmund | Reus 120, Aubameyang 98, Chapuisat 82, Lewandowski 74, Haaland 62, Koller 59, Zorc 55, Ricken 48, Moller 47, Ewerthon 47 | Exact (11th Brandt 43) |
| Leverkusen | Kirsten 159, Kiessling 131, Schick 80, Berbatov 69, Paulo Sergio 47, Volland 44, Alario 42, Neuville 41, Rolfes 41, Havertz 36 | Exact (11th Schneider 35) |
| Gladbach | Stindl 62, Dahlin 58, Raffael 58, Plea 58, Herrmann 47, Hofmann 40, Reus 36, M. Thuram 34, Pflipsen 32, Pettersson 32 | Exact (11th T. Hazard 31) |
| Wolfsburg | Dzeko 66, Grafite 59, Weghorst 59, Klimowicz 57, Arnold 45, Juskowiak 39, Dost 36, Wind 32, Maric 31, then Petrov and Olic 28 | Pool of 2 |
| Hoffenheim | Kramaric 140, Salihovic 46, Ibisevic 43, Firmino 38, Bebou 36, Volland 33, Uth 29, Baumgartner 27, Ba 25, Szalai 23 | Exact (11th Modeste 19) |
| Mainz | Burkardt 41, Onisiwo 33, Quaison 31, Zidan 29, Malli 29, Lee Jae-sung 28, Okazaki 27, Szalai 24, Mateta 24, Ivanschitz 22 | Exact (11th N. Muller 21) |
| Frankfurt | Meier 93, Yeboah 45, Amanatidis 42, Andre Silva 40, Jovic 29, Marmoush 27, Aigner 25, Haller 24, Russ 23, Kamada 20 | Exact but thin (11th Ekitike 19) |
| Freiburg | Grifo 72, Petersen 69, Holer 45, Cisse 37, Iashvili 29, Cardoso 28, Zeyer 27, Sellimi 27, Schmid 27, Wassmer 23 | Exact (11th Doan 22) |
| Stuttgart | Cacau 81, Gomez 78, Bobic 69, Balakov 54, Harnik 53, Undav 46, Elber 41, Kuranyi 40, Guirassy 39, Ganea 34 | Exact (11th Ibisevic 33) |

- Pre-1992/93: date line "since 1992/93" (Kirsten, Chapuisat, Dahlin, Zorc, Max lose earlier goals).
- Missing: a source read; the Klose 2004-05 conflict doesn't touch these ten clubs' lists. Tight margins: Bayern 78 v 75; Frankfurt 20 v 19. Werder Bremen, Schalke, Augsburg and Leipzig were only built for 2009/10 onward.

#### 4.2.3 Serie A

**Verdict: possible for eight clubs; recheck Juventus and Inter (early-season goals short); Fiorentina needs a different cut.** Period "Serie A goals, 1992/93 to 2025/26".

| Club | Top 10 | 10th |
|---|---|---|
| Juventus | Del Piero 187, Trezeguet 123, Dybala 82, Ronaldo 81, F. Inzaghi 57, Vlahovic 50, Higuain 48, R. Baggio 46, Ravanelli 41, then Nedved and Tevez 39 | Pool of 2 (no 2006/07, Serie B) |
| Inter | Lautaro 132, Icardi 111, Vieri 103, Milito 62, Ibrahimovic 57, Lukaku 57, Recoba 53, Ronaldo 49, Cruz 49, Perisic 49 | Exact but thin (11th Adriano 48) |
| AC Milan | Shevchenko 127, Kaka 77, Ibrahimovic 76, F. Inzaghi 72, Leao 64, Pato 51, Weah 46, Seedorf 46, Giroud 39, then Simone and Bierhoff 37 | Pool of 2 |
| Napoli | Mertens 113, Hamsik 100, Insigne 96, Cavani 78, Higuain 71, Osimhen 65, Callejon 64, Lavezzi 38, Milik 38, Zielinski 37 | Exact (11th Fonseca 31) |
| Roma | Totti 250, Dzeko 85, Montella 84, Balbo 78, Delvecchio 62, El Shaarawy 52, Vucinic 46, De Rossi 43, Pellegrini 41, Mancini 40 | Exact (11th Cassano 39) |
| Lazio | Immobile 169, Signori 107, Rocchi 82, Milinkovic-Savic 57, Klose 55, Pandev 48, Luis Alberto 47, Felipe Anderson 45, Mauri 42, then Casiraghi and Candreva 41 | Pool of 2 |
| Atalanta | Doni 69, Duvan Zapata 69, Denis 56, Muriel 54, Gomez 50, Pasalic 50, Ilicic 47, Lookman 41, Ganz 28, Koopmeiners 26 | Exact (11th Retegui 25) |
| Fiorentina | Batistuta 139, Toni 55, Mutu 54, Gilardino 52, Vlahovic 44, Rui Costa 38, Jovetic 35, Enrico Chiesa 34, Ilicic 29, then five on 27 | **Pool of 5: needs a different cut** |
| Bologna | Orsolini 75, Signori 67, Di Vaio 65, K. Andersson 33, Destro 29, Cruz 27, Kolyvanov 26, Barrow 26, Arnautovic 24, R. Baggio 22 | Exact (11th Bellucci 21) |
| Udinese | Di Natale 191, Bierhoff 57, Iaquinta 57, Amoroso 39, Muzzi 39, Poggi 37, Thereau 35, Sosa 34, De Paul 33, Lasagna 30 | Exact (11th Jorgensen 29) |

- Spare: Sassuolo (2009/10 onward, exact), Torino (pool of 2).
- Pre-1992/93: date line "since 1992/93".
- Missing: the 1992-93 to 1998-99 club goal check (Sampdoria, Juventus, Inter short); a source read.

#### 4.2.4 Ligue 1

**Verdict: partly. Possible only as "1995/96 to 2025/26"; a "since 1992/93" version is not possible from this data** (no 1992-93 to 1994-95 files).

| Club | Top 10 | 10th |
|---|---|---|
| PSG | Mbappe 175, Cavani 138, Ibrahimovic 113, Neymar 82, Pauleta 76, Di Maria 57, Hoarau 38, Nene 36, Lucas Moura 34, Ousmane Dembele 34 | Exact (11th Rai 33; his 1993-95 goals would push him in) |
| Lyon | Lacazette 161, Juninho 74, Anderson 71, Gomis 64, Memphis 63, Lisandro Lopez 59, Moussa Dembele 56, Fekir 54, Govou 49, Caveglia 46 | Exact (11th Benzema and Tolisso 43) |
| Marseille (from 1996/97) | Thauvin 76, Niang 72, Payet 61, Gignac 59, Andre Ayew 43, Greenwood 37, Ravanelli 28, Bakayoko 28, Remy 28, then Valbuena and Aubameyang 27 | Pool of 2 |
| Monaco | Ben Yedder 98, Falcao 65, Nonda 57, Trezeguet 52, Giuly 47, Ikpeba 43, Anderson 40, Golovin 36, then Prso, Simone and Volland 28 | Pool of 3 for 2 slots |
| Rennes | Bourigeaud 52, Frei 48, Terrier 46, Kalimuendo 34, Briand 33, Monterrubio 32, Nonda 31, Hunou 26, Gouiri 25, Wiltord 24 | Exact |
| Nantes | Da Rocha 45, Sala 42, N'Doram 35, Simon 33, Blas 32, Moldovan 31, Vahirua 28, Mostafa Mohamed 25, Gourvennec 24, Monterrubio 23 | Exact (Loko, Ouedec, Pedros 1992-95 missing) |
| Bordeaux (to 2021/22) | Pauleta 65, Laslandes 57, Chamakh 56, Diabate 50, Wiltord 45, Micoud 37, Darcheville 37, Wendel 34, Cavenaghi 33, Rolan 33 | Exact (11th Jussie 32) |
| Montpellier | Camara 52, Savanier 42, Delort 40, Laborde 36, Giroud 33, Wahi 32, Belhanda 26, Bakayoko 24, Cabella 24, Bamogo 22 | Exact |
| Toulouse | Ben Yedder 63, Gignac 35, Braithwaite 35, Dallinga 26, Emana 23, Elmander 22, Gradel 22, Moreira 21, Sissoko 20, Aboukhlal 20 | Exact |
| Auxerre | Cisse 70, Guivarc'h 49, Jelen 48, Diomede 27, Marlet 25, Kapo 23, Oliech 23, Lachuer 22, Laslandes 22, Pieroni 21 | Exact |

- Spares with pools: Lille (pool of 2), Nice (pool of 3), Lens (pool of 2), Saint-Etienne (pool of 3), Strasbourg (pool of 3).
- Pre-1992/93: the start is 1995/96 by necessity; the date line must say so.
- Missing: 1992-93 to 1994-95 player data; a source read (only PSG and Lille were spot-checked).

#### 4.2.5 Scottish Premiership

**Verdict: partly. Only as "since 2000/01", and not until the 2018-19 players file is read. A "since 1992/93" version is not possible from this data.** Totals below are without 2018-19.

| Club | Top 10 (without 2018-19) | 10th |
|---|---|---|
| Celtic | Larsson 122, Hartson 88, Griffiths 87, Sutton 64, then Forrest, Commons, Hooper and Kyogo 63, Stokes 58, Petrov 54 | Exact on these figures, but 2018-19 (Edouard, Forrest, Griffiths) will change it |
| Rangers | Boyd 101, Tavernier 78, Kenny Miller 71, Morelos 61, Novo 47, Arveladze 44, Barry Ferguson 39, Lovenkrands 37, Dessers 34, de Boer 32 | Not usable until 2018-19 is read (Morelos, Tavernier) |
| Aberdeen | McGinn 66, Rooney 65, Mackie 57, Miovski 32, Vernon 30, Lee Miller 29, Hayes 29, Considine 26, Winters 22, Lewis Ferguson 21 | Exact |
| Hearts | Shankland 72, Skacel 41, Hartley 31, Jamie Walker 31, Kirk 30, de Vries 28, Callum Paterson 27, McKenna 21, Ryan Stevenson 21, Velicka 19 | Exact |
| Hibernian | Riordan 91, Boyle 62, O'Connor 58, Fletcher 44, Griffiths 31, Nisbet 31, Stokes 30, Shiels 24, Doidge 24, Nish 22 | Exact |
| Kilmarnock | Boyd 120, Nish 40, Invincibile 32, Naismith 29, Sammon 22, Heffernan 20, Dargo 19, Kiltie 19, then Magennis and Brophy 18 | Pool |
| Motherwell | McDonald 66, John Sutton 65, Clarkson 49, Higdon 40, Moult 39, McFadden 37, Jamie Murphy 34, van Veen 34, then Foran and Porter 23 | Pool |
| Dundee United | Daly 58, McIntyre 35, Goodwillie 33, Robson 32, Russell 31, Ciftci 25, Hunt 22, Mackay-Steven 21, Armstrong 18, Charlie Miller 17 | Exact |
| St Johnstone (17 seasons) | MacLean 48, Craig 44, May 44, Davidson 30, Kane 23, O'Halloran 21, Wotherspoon 20, Clark 17, Hendry 15, Sandaza 14 | Exact |
| St Mirren (17 seasons) | Thompson 42, McLean 21, O'Hara 20, Dorman and Mandron 19, Mehmet, Higdon and McGowan 18, Olusanya 14, Obika 13 | Exact |

- Pre-1992/93: 1992/93 to 1999/00 missing; the date line must say "since 2000/01". Larsson's pre-2000 goals are missing, so the Celtic board is not a club record.
- Missing: 2018-19 players file read; the 1990s seasons; Scottish totals were added by name (no ids in `agg_sco.csv`), so the Greive split and any same-name players need checking.

### 4.3 Planned work: player records, managers and transfers per competition

| Record | PL | La Liga | Bundesliga | Serie A | Ligue 1 | Scottish | Champions League |
|---|---|---|---|---|---|---|---|
| Hat-tricks | not possible | not possible | not possible | not possible | not possible | not possible | not possible |
| Fastest to 50 and 100 | not possible | not possible | not possible | not possible | not possible | not possible | not possible |
| 20-goal seasons | partly | possible | partly | partly | partly | not recommended | n/a (no one has 20 in a CL season) |
| Single-season highs | possible | possible | possible (one per player) | partly | possible (one per player) | partly | partly |
| Managers | not possible | not possible | not possible | not possible | not possible | not possible | not possible |
| Transfers | partly | not possible | not possible | not possible | not possible | partly | n/a |

Detail, league by league:

**20-goal seasons**

- **PL (partly).** Computed from the files, not source-checked: Shearer 7, Aguero 6, Kane 6, Henry 5, Salah 5, van Nistelrooy 4, Haaland 4, Ferdinand 3, Vardy 3, then **12 players on 2** for 10th (Cole, Wright, Fowler, Hasselbaink, Drogba, Rooney, Tevez, van Persie, Suarez, Diego Costa, Aubameyang, Isak). 9 clear, pool of 12 for 1 slot: too big. 4-slot: one slot per player. Shearer's include 42-game seasons.
- **La Liga (possible).** Messi 13, Cristiano Ronaldo 9, Benzema 6, Suarez 5, Ronaldo Nazario 4, then Raul, Rivaldo, Eto'o, Villa and Higuain on 3. Exact 10 (next group on 2). Since 1992/93; needs the early-half re-check.
- **Bundesliga (partly).** Since 1992/93: Lewandowski 10, Kirsten 3, Gomez 3, Kane 3, then ten players on 2 for 6 slots (pool of 10, weak). The 2009/10 to 2025/26 version is exact: Lewandowski 10, Kane 3, then Kiessling, Gomez, Aubameyang, Modeste, Werner, Haaland, Schick, Guirassy on 2.
- **Serie A (partly).** Since 1992/93: Immobile 6, Batistuta 5, Toni 4, Di Natale 4, then eight players on 3 (pool).
- **Ligue 1 (partly).** 1995/96 onward: Mbappe 5, Pauleta 4, Lacazette 4, Anderson 3, Ibrahimovic 3, then six on 2 for five slots (pool). Anderson's 1993-95 seasons are missing, so his count is a floor.
- **Scottish (not recommended).** Boyd 5, Larsson 4, then only three players on 2.

**Single-season highs**

- **PL (possible):** see 4.1.4.
- **La Liga (possible).** Best season per player since 1992/93: Messi 50, Cristiano Ronaldo 48, Suarez 40, Ronaldo Nazario 34, Forlan 32, Mbappe 31, Pizzi 31, Eto'o 30, Romario 30, then Makaay and Bebeto 29 (pool of 2). A plain list of seasons fails the 4-slot rule (Messi 5 of the top 10, Ronaldo 4).
- **Bundesliga (possible, one per player).** Lewandowski 41, Kane 36, Aubameyang 31, Huntelaar 29, then Werner, Guirassy, Gomez, Grafite, Ailton and Andre Silva on 28. Exactly 10 (11th Haaland 27). A list of seasons fails (Lewandowski 6 slots).
- **Serie A (partly).** 2009/10 onward, seasons can repeat: Higuain 36, Immobile 36, Ronaldo 31, then Di Natale, Cavani, Dzeko, Icardi, Immobile, Ronaldo on 29, then three on 28 (pool of 3). Immobile and Ronaldo 2 slots each, passes. Joined with 1992-2009, Toni 31 (2005/06) and Bierhoff 27 come in; recompute.
- **Ligue 1 (possible, one per player).** 1995/96 onward: Ibrahimovic 38, Cavani 35, Mbappe 33, Lacazette 28, Nonda 26, Cisse 26, Sow 25, Ben Yedder 25, Gignac 24, David 24. Exact (next 23). A list of seasons fails (Mbappe 5 of the top 12).
- **Scottish (partly).** Since 2000/01, without 2018-19: Larsson 35, Boyd 32, Griffiths 30 (sources 31), Larsson 30, Larsson 29, Larsson 28, then Kyogo, Commons, Boyd 27, Higdon 26. Larsson fills 4 of the top 6: **breaks the 4-slot rule** unless cut to years that leave him 3.
- **Champions League (partly).** Ronaldo 17 (2013/14), Ronaldo 16 (2015/16), then Ronaldo 2017/18, Lewandowski 2019/20, Benzema 2021/22 and Mbappe 2025/26 on 15, Messi 2011/12 and Kane 2025/26 on 14, then Lewandowski 2021/22, Guirassy and Raphinha 2024/25 on 13 (pool of 3 for 2 slots). Ronaldo 3 slots, passes.

**Managers:** not possible for any league (no data). The only manager data is World Cup managers to 2022 (fj files).

**Transfers:** PL partly (4.1.6, 4.1.7). Scotland: outgoing top 10 has a tie at 10th (van Dijk and Patterson £11.5m); incoming has four on £6m for 1 slot (weak); between Scottish clubs is exactly 10 but includes a 1 July 1992 deal (on the cut-off) and a disputed O'Donnell fee. No La Liga, Bundesliga or Ligue 1 lists; Serie A only as a lira-era progression.

---

## 5. New ideas (not on the wishlist)

Same checks as section 4. Each is flagged if it would duplicate an existing board. None below duplicates an existing board unless it says so.

### 5.1 Premier League

| Idea | Candidate top 10 | Exact or pool | 4-slot | Pre-1992/93 | Missing | Duplicate? |
|---|---|---|---|---|---|---|
| Most PL goals in the 2010s (2010/11 to 2019/20) | Aguero 180, Kane 143, Lukaku 113, Vardy 103, Rooney 102, van Persie 96, Sterling 86, Giroud 86, Hazard 85, Mane 84 | Exact (11th Salah 75) | one per player | fine | source read | No (`t5-dec` was top-five champions by decade, and is dead code) |
| Most PL goals in the 2020s so far (2020/21 to 2025/26) | Salah 118, Haaland 112, Watkins 91, Son 74, Kane 70, Bowen 64, Bruno Fernandes 63, Foden 62, Saka 59, then Wood and Isak 57 | Pool of 2 | fine | fine | source read; changes every week | No |
| Most PL appearances in the 2010s | Foster 323, de Gea 313, David Silva 309, Henderson 306, Milner 297, Walker 290, Sigurdsson 282, McArthur 280, Noble 280, then Cahill, Coleman, Azpilicueta 271 | Pool of 3 for 1 slot | fine | fine | source read | No |
| Most penalties in the 2020s | Salah 28, Bruno 22, Haaland 20, Palmer 18, Jorginho 15, Kane 13, Saka 12, then Ward-Prowse, Wilson, Toney, Isak 11 | Pool of 4 for 3 slots | fine | fine | source read | No |
| Most penalties in a single season (computed from the files, not source-checked) | Shearer 1994/95, A. Johnson 2004/05, Lampard 2009/10, Gerrard 2013/14, Milivojevic 2018/19 all 10; van Nistelrooy 2002/03, Bruno 2020/21, Palmer 2023/24, Salah 2024/25 on 9; then Vardy 2020/21 and Igor Thiago 2025/26 on 8 | Pool of 2 for the last slot | fine (no repeats) | fine | source read (penalty data has blanks, 3.1) | No |
| Most red cards | To 2008/09: Ferguson, Dunne, Vieira 8; Butt, Vinnie Jones, Keane, Alan Smith 7; plus Cattermole 7 later; then a pool on 6 | Pool for 9th and 10th | fine | fine | join both halves for cards (the agg files don't carry cards) and a source read | No |
| Most yellow cards | To 2008/09: Savage 90, Bowyer 88, Boateng 85, Butt and Vieira 83, Kevin Davies 78, Keane and Wise 76; Barry (the record) and others come from the later half | Not known yet | fine | fine | join and source read | No |
| Most clean sheets in one season | Cech 24 (2004/05), then 21s and 20s (Schmeichel, van der Sar, Reina, Seaman, Alisson, Ederson) | Unknown | **Risk: Reina has four seasons on 18 to 20** | fine | cut the period; the 2023/24 keeper file is wrong | No |
| Golden Boot 1992/93 to 1994/95 | Sheringham, Cole, Shearer | only 3 seasons | n/a | fine | can't make 10 on its own; would need a re-cut window, which the final pass controls | Overlaps the `pl-gb` series |
| Penalty saves from 2016/17 | not built | | | fine | keeper penalty columns start 2016/17 | No |

### 5.2 La Liga (from notes; joined 1992/93 to 2025/26 unless stated)

| Idea | Candidate top 10 | Exact or pool | 4-slot | Pre-1992/93 | Missing | Duplicate? |
|---|---|---|---|---|---|---|
| Most La Liga goals since 1992/93 | Messi 474, Cristiano Ronaldo 311, Benzema 238, Raul 230 (sources 228), Griezmann 205, Villa 185, Suarez 178, Aspas 170, Eto'o 161, Aduriz 158 | Exact (next Tamudo 146) | fine | date line "since 1992/93" | early-half re-check | No (`t5-at-goals` covers five leagues together) |
| Most La Liga penalty goals | Messi 61, Cristiano Ronaldo 61, Aspas 42, Parejo 34, Oyarzabal 32, Penev 30, Villa 30, Larrazabal 28, Tamudo 28, Stuani 27 | Exact (next Benzema 25) | fine | fine | source read | No |
| Most La Liga appearances | Joaquin 623 (usually 622), Raul Garcia 609, Griezmann 564, Parejo 558, Raul 550, Ramos 536, Messi 519 (usually 520), Koke 519, Jesus Navas 518, Casillas 510 | Exact (next Xavi 505) | fine | date line needed | two figures one off | No |
| Most clean sheets, 2009/10 to 2025/26 | Oblak 184, Courtois 148, ter Stegen 126, Soria 102, Bravo 99, Diego Lopez 89, Remiro 83, Asenjo 78, Iraizoz 76, Valdes 74 | Exact (next Unai Simon 73) | fine | window only (no clean sheets before 1999/00) | source read | No |
| Most clean sheets in one season, 2009/10 to 2025/26 | ter Stegen 26, Oblak 24, Bravo 23, Oblak 22, Valdes 20, Courtois 20, Courtois 20, Oblak 20, ter Stegen 19, Remiro 19 | Exact (next 18) | Oblak 3, passes | window only | source read | No |
| Most keeper appearances, 2009/10 to 2025/26 | Oblak 399, Courtois 343, Diego Lopez 330, Soria 309, ter Stegen 293, Iraizoz 282, Bravo 269, Asenjo 261, Remiro 246, Unai Simon 237 | Exact | fine | window only | keeper file errors 2018-20 (none of these ten affected) | No |

### 5.3 Serie A

| Idea | Candidate top 10 | Exact or pool | 4-slot | Pre-1992/93 | Missing | Duplicate? |
|---|---|---|---|---|---|---|
| Most Serie A goals since 1992/93 | Totti 250, Di Natale 209, Immobile 201, Gilardino 189, Del Piero 187, Quagliarella 182, Signori 177, Batistuta 171, Toni 157, Ibrahimovic 156 | Exact (11th F. Inzaghi 155), but Del Piero and Gilardino may each be 188 | fine | date line "since 1992/93" | settle the one-goal questions | No |
| Most clean sheets since 1998/99 | Buffon 265, Handanovic 201, De Sanctis 153, Abbiati 128, Frey 124, Consigli 113, Mirante 110, Szczesny 101, Antonioli 98, Julio Cesar 96 | Exact (11th Sorrentino 90) | fine | can only say "since 1998/99" | hand-summed, needs a recount and source read | No |
| Season clean-sheet leaders, 2016/17 to 2025/26 (year board) | Szczesny, Reina, Handanovic, Musso, Donnarumma or Handanovic, Maignan, Provedel, Milinkovic-Savic or Sommer, Meret, Butez | 10 seasons, two shared | Handanovic at most 2 | fine | source read | No |
| Most Serie A appearances, 2009/10 to 2025/26 | Candreva 499, Consigli 493, Handanovic 490, Bonucci 430, Acerbi 423, Zielinski 423, De Silvestri 415, Cuadrado 414, Quagliarella 410, Bonaventura 378 | Exact | fine | window only (the early `agg_sa_a` has no zero-goal rows) | re-read 1993-2009 files for a full version | No |
| Most penalty goals since 1992/93 | Totti 71, Immobile 52, Del Piero 51, Berardi 49, Signori 44, R. Baggio 37, then not built | Unknown | fine | fine | full list and penalty source | No |

### 5.4 Bundesliga

| Idea | Candidate top 10 | Exact or pool | 4-slot | Pre-1992/93 | Missing | Duplicate? |
|---|---|---|---|---|---|---|
| Most Bundesliga goals since 1992/93 | Lewandowski 312, Pizarro 197, Gomez 170, Kirsten 159, Reus 156, Muller 150, Kiessling 144, Kramaric 140, Elber 133, Ibisevic 127 | Exact (11th Klose 120, or 121 if 2004/05 is fixed) | fine | date line (Kirsten's career is 182) | source read | No |
| Most keeper appearances since 1992/93 | Neuer 545, Baumann 523, Kahn 494, Rost 426, Butt 387, Lehmann 357, Weidenfeller 355, Golz 329, Trapp 325, Hradecky 323 | Exact | fine | date line | source read | No |
| Most clean sheets, 1999/00 to 2025/26 | Neuer 242, Baumann 114, Rost 110, Weidenfeller 109, Kahn 107, Hildebrand 99, Gulacsi 96, Hradecky 90, Butt 78, Casteels 77 | Exact | fine | can only say "since 1999/00" | clean sheets 1992-99 | No |

### 5.5 Ligue 1 (1995/96 to 2025/26)

| Idea | Candidate top 10 | Exact or pool | 4-slot | Pre-1992/93 | Missing | Duplicate? |
|---|---|---|---|---|---|---|
| Most Ligue 1 goals | Mbappe 191, Lacazette 161, Ben Yedder 161, Pauleta 141, Cavani 138, Gomis 121, Ibrahimovic 113, Anderson 111, Payet 103, Gignac 103 | Exact (11th Laslandes and Briand 102) | fine | only "since 1995/96" | 1992-95 | No |
| Most keeper appearances | Landreau 618, Mandanda 555, Coupet 437, Ruffier 428, Lopes 427, Penneteau 411, Costil 407, Rame 405, Richert 381, Carrasso 352 | Exact (11th Cool 343) | fine | only "since 1995/96" | 1992-95; 1997-99 keeper starts over-counted (touches Richert) | No |
| Most clean sheets, 1999/00 to 2025/26 | Landreau 185, Mandanda 179 (source 177), Ruffier 159, Rame 139, Lopes 130, Carrasso 124, Coupet 123, Penneteau 111, Richert 101, Costil 97 | Exact (11th Cool 95) | fine | only "since 1999/00" | a clean-sheet source | No |
| Most penalty goals, 1999/00 to 2025/26 | Lacazette 34, Ben Yedder 33, Monterrubio 28, Savanier 26, Ibrahimovic 24, Pauleta 23, Neymar 23, Boudebouz 21, then Cavani, Mbappe, David 20 | Pool of 3 for 2 | fine | only "since 1999/00" | pre-1999 penalties | No |

### 5.6 Scottish top flight (since 2000/01)

| Idea | Candidate | Exact or pool | 4-slot | Pre-1992/93 | Missing | Duplicate? |
|---|---|---|---|---|---|---|
| Career clean sheets | McGregor 161, Craig Gordon 149, Langfield 104, Forster 92, Klos 82, Zander Clark 77, Douglas 71, Joe Lewis 71, Boruc 66, Mark Brown 63 | Exact on file values | fine | only "since 2000/01" | 2018-19 keeper file broken | No |
| Season clean-sheet leaders | windows need care (Forster leads 2010/11 to 2013/14; Gordon leads four seasons) | | cut windows | fine | 2018-19 keepers | No |
| Season top scorers 2000/01 onward | 2000/01 to 2009/10 fails (Larsson 4, Boyd 4) | | re-cut | fine | | **Overlaps `spfl-ts-*`** (the game already has 1992/93 to 2001/02, 2006/07 to 2015/16 and 2016/17 to 2025/26) |

### 5.7 Champions League (1992/93 to 2025/26, excluding qualifying rounds)

| Idea | Candidate top 10 | Exact or pool | 4-slot | Pre-1992/93 | Missing | Duplicate? |
|---|---|---|---|---|---|---|
| All-time appearances | Ronaldo 183, Casillas 177, Messi 163, Muller 163, Neuer 161, Benzema 152, Xavi 151, Kroos 151, Giggs 146, Lewandowski 144 | Exact (11th Ramos and Modric 142) | fine | fine | only the top 4 sourced; say "excluding qualifying rounds" | No |
| Season top scorers 1996/97 to 2005/06 | Pantic, Del Piero, Shevchenko or Yorke, Jardel or Raul or Rivaldo, Raul, van Nistelrooy, van Nistelrooy, Morientes, van Nistelrooy, Shevchenko | 10 seasons, shared winners accepted | van Nistelrooy 3, passes | fine | source read | Same series as `ucl-top-2016/17`; 2006/07 to 2015/16 fails (Messi 5), matching its removal |
| Single-season highs | see 4.3 | Pool of 3 for 2 | Ronaldo 3 | fine | source read | No |
| Top 10 scorers of one season | exact only in 1995/96, 2001/02, 2002/03, 2008/09, 2012/13, 2017/18 (for example 2017/18: Ronaldo 15; Firmino, Mane, Salah 10; Ben Yedder, Dzeko 8; Cavani, Kane 7; Messi, Neymar 6) | Exact in six seasons only | fine | fine | source read | No |
| Club all-time CL scorers | exact for Real Madrid, Barcelona, Bayern, Man Utd, Chelsea, Juventus, PSG, Atletico, Celtic; pools for Liverpool, Arsenal, Man City, Milan, Inter, Dortmund, Porto, Spurs, Rangers | varies | fine | fine | a source that excludes qualifiers (club lists usually include them) | No |

Not supported: all-time assists (blank before 1999/00, FBref and Opta disagree), most seasons played (ties at 17), hat-tricks, minutes, nationality boards.

### 5.8 World Cup and Euros (team boards may cover every tournament; player boards need Craig's rule decision)

| Idea | Candidate top 10 | Exact or pool | 4-slot | Period | Missing | Duplicate? |
|---|---|---|---|---|---|---|
| Most World Cups played (nation), 1930 to 2026 | Brazil 23, Germany 21, Argentina 19, Italy 18, Mexico 18, England 17, France 17, Spain 17, Belgium 15, Uruguay 15 | Exact (11th Sweden and Switzerland 13) | fine | every tournament | source read (top 5 in a search summary) | No |
| Most World Cup matches, 1930 to 2026 | Brazil 119, Germany 116, Argentina 96, Italy 83, England 82, France 81, Spain 75, Mexico 65, Uruguay 62, Netherlands 59 | Exact (11th Belgium 57) | fine | every tournament | second source | No |
| Most World Cup wins (shoot-outs as draws), 1930 to 2026 | Brazil 79, Germany 70, Argentina 54, France 45, Italy 45, England 38, Spain 38, Netherlands 32, Uruguay 25, Belgium 24 | Exact (11th Mexico 21) | fine | every tournament | state the draw rule | No |
| Most World Cup goals (nation) | to 2026: 10th Hungary and Sweden 87 | Pool of 2 | fine | every tournament | recount with 2026 | No |
| Most top-four finishes | to 2026: Germany 13, Brazil 11, Italy 8, France 8, Argentina 7, Uruguay 5, Netherlands 5, Sweden 4, England 4, then Croatia and Spain 3 | Pool of 2 | fine | every tournament | | Same theme as `wc-sf`, `wc-3rd`, `wc-4th` (different answers) |
| World Cup shoot-out winners, 1986 to 1994 | France, West Germany, Belgium, Republic of Ireland, Argentina, Argentina, West Germany, Bulgaria, Sweden, Brazil | Exact (10 shoot-outs) | max 2 per team | every tournament | source read | No |
| Most Euros played, 1960 to 2024 | Germany 14, Russia (with Soviet Union and CIS) 12, Spain 12, England 11, Italy 11, Netherlands 11, France 11, Denmark 10, Portugal 9, Czech Republic 8 | Exact (11th Belgium, Sweden, Croatia 7) | fine | every tournament | say the Soviet Union and CIS count as Russia | No |
| Most Euro matches won, 1960 to 2024 | Germany 30, Spain 28, France 23, Netherlands 23, Italy 22, Portugal 21, England 18, Russia 13, Belgium 12, Czech Republic 12 | Exact (11th Denmark 10) | fine | every tournament | same merge note | No |
| Euro shoot-out winners, Euro 1992 to 2008 | Denmark, England, France, Czech Republic, Germany, Italy, Portugal, Netherlands, Turkey, Spain | Exact | no repeats | every tournament | source read | No |
| World Cup goals (player), 1994 to 2026 | Mbappe 22, Messi 21, Klose 16, Ronaldo 15, Kane 14, Cristiano Ronaldo 11, Batistuta 10, T. Muller 10, then Neymar, Villa and Vieri 9 | Pool of 3 for 2 | fine | **Craig to decide: full history or 1994 on** | Neymar's 2026 goal unchecked | No |
| World Cup goals (player), full history to 2026 | Mbappe 22, Messi 21, Klose 16, Ronaldo 15, G. Muller 14, Kane 14, Fontaine 13, Pele 12, then Kocsis, Klinsmann, Cristiano Ronaldo 11 | Pool of 3 for 2 | fine | same decision | | No |
| World Cup appearances (player) | to 2022 only: Messi 26, Matthaus 25, Klose 24, Maldini 23, Cristiano Ronaldo 22 ... | Pool | fine | data only from 1970 | **2026 line-ups missing** | No |
| Women's World Cup finalists, 1991 to 2007 (5 at a time) | USA, Norway, Norway, Germany, USA, China, Germany, Sweden, Germany, Brazil | 10 slots | Germany 3, passes | every tournament | 2023 tournament missing for later windows | No (no women's boards exist) |
| Women's World Cup tournaments played, to 2019 | Brazil, Germany, Japan, Nigeria, Norway, Sweden, USA 8; China, Australia, Canada 7 | Exact to 2019 | fine | every tournament | 2023 | No |

Not workable: WC or Euro titles (8 and 10 winners only), WC shoot-outs played or won (big ties), Euro goals 1996 on (pool of 9), most WCs in a squad, WC manager matches (stale and the Parreira fault).

### 5.9 Transfers

| Idea | Candidate | Exact or pool | 4-slot | Pre-1992/93 | Missing | Duplicate? |
|---|---|---|---|---|---|---|
| Players who broke the world transfer record, 1998 to 2017 | Denilson, Vieri, Crespo, Figo, Zidane, Kaka, Cristiano Ronaldo, Bale, Pogba, Neymar | Exact, all different | fine | fine | names only, so the fee disagreements don't matter; source read | No (no transfer boards exist) |
| Most expensive English players | Rogers, Anderson, Grealish, Rice, Bellingham, Kane, Maguire, Sancho, Gordon, Eze | Exact, but slots 9 and 10 rest on disputed or add-on fees | fine | fine | one fee rule | No |

---

## 6. Recommended next steps

### 6.1 Ready to build now (each still needs a first-hand source read before it goes in)

1. **PL most appearances for each of the 10 clubs** (4.1.1). Eight are exact; Man City and Everton need a pool of 2. Read 11v11 or premierleague.com club pages. Date line "Premier League games only, since 1992/93"; add 2026/27 games if the date line says September 2026.
2. **PL most goals in a single season, best season per player** (4.1.4, version B). Exact 10. Read the premierleague.com season stats pages; state the 42-game seasons.
3. **Club record scorers for the other PL clubs** (4.1.11), to widen `CLUB_REC`. Read each club's premierleague.com or 11v11 page; Craig to set tiers.
4. **Bundesliga club top-10 scorers, 1992/93 to 2025/26** (4.2.2). Nine exact, Wolfsburg a pool of 2.
5. **World Cup team boards to 2026**: most World Cups played, most matches, most wins (4 and 5.8). Team data may cover every tournament, and the mj and wc files agree with each other.
6. **Champions League all-time appearances** (5.7). Exact 10; read UEFA's figures that exclude qualifiers.
7. **Players who broke the world transfer record, 1998 to 2017** (5.9). Names only.
8. **Tidy the dump**: delete the nine original Champions League files for 2017-18 to 2025-26 and one of the two identical Scottish 2025-26 player files.

### 6.2 Needs more checking first

1. **La Liga club top-10 scorers** (4.2.1): re-check the 1992-93 to 2008-09 half (Forlan, Raul, Villa, Messi errors) against BDFutbol or FBref.
2. **Serie A club top-10 scorers** (4.2.3): check 1992-93 to 1998-99 club goal totals against full tables (Sampdoria, Juventus, Inter short); find a cut for Fiorentina; settle Del Piero and Gilardino.
3. **Ligue 1 club top-10 scorers** (4.2.4): build as "1995/96 to 2025/26" only, after a source read per club.
4. **Scottish club top-10 scorers** (4.2.5): read the 2018-19 players file first, re-add with FBref ids, then build as "since 2000/01".
5. **PL penalties** (4.1.10): settle Gerrard (33 v 31), Le Tissier (24 v 25) and Henry (24 v 23) from one source.
6. **PL relegations and promotions** (4.1.2, 4.1.3): recount against a source (the files give ten clubs on 3 for relegations and nine on 3 for promotions, not the wishlist's seven and eight); decide on big pools and on 1992/93.
7. **Existing-board questions** (3.12): Greenwood for Ligue 1 2024/25 in `t5-ts-2024/25`; Mbappe's 71st Champions League goal for `ucl-at-goals` order; West Ham's Di Canio and Noble order.
8. **2023-24 PL keeper file**: re-pull before any keeper board uses it, and before trusting file totals against `pl-at-cs`.
9. **Record signings** (4.1.6, 4.1.7): choose one fee source and rule; re-read the lists after 1 Sept 2026 (Enzo Fernandez); fill the nine incomplete club lists.
10. **World Cup player boards** (5.8): Craig to decide full history or 1994 onwards; check 2026 goals.

### 6.3 Needs data we don't have

1. **PL managers: most games and most wins** (4.1.8). No manager data at all. premierleague.com or LMA.
2. **Hat-tricks, and fastest to 50 and 100 goals**, every competition (4.1.5, 4.1.9, 4.3). Needs match-level data or published record lists.
3. **Ligue 1 1992-93 to 1994-95** and **Scottish 1992-93 to 1999-2000** player data, for any "since 1992/93" board in those leagues.
4. **Assists, penalty attempts and keeper clean sheets before 1998-99 or 1999-00** in La Liga, Serie A, Bundesliga and Ligue 1; keeper penalty saves before 2016-17 everywhere.
5. **The missing files**: anything starting `fbref_`, `tour_`, `mt_` or `wf_`; the five ewenme league transfer files and readme; `mj_readme.txt` and `mj_licence.txt`; the wc files `awards.csv`, `final_standings.csv`, `scorers.csv` and `winning_squads.csv`. Check Craig's PC and re-upload.
6. **2026 World Cup line-ups and the 2023 Women's World Cup**, for player appearance boards and any women's board past 2019.
7. **International caps and friendly-match goals**, for any all-time international scorer or caps board.
8. **2026/27 games so far**, for every board dated "September 2026".
9. **Transfer fee lists for La Liga, Bundesliga and Ligue 1 clubs**, and complete lists for Liverpool, Arsenal, West Ham and the others in 4.1.7.
