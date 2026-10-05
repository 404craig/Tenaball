# Scottish top flight player seasons, 2000/01 to 2025/26

Every player who made at least one league appearance for a top-flight club (Scottish Premier League to 2012/13, Scottish Premiership from 2013/14), season by season, league games only. Collected on 5 October 2026.

## Files

- `spfl_players.csv`: one row per player per club per season. 9,301 rows, 3,387 different players (by Transfermarkt id), 312 club seasons (12 clubs in each of 26 seasons).
- `club_season_checks.csv`: one row per club season comparing the players' goals with the club's league goals for that season.

### spfl_players.csv columns

| column | meaning |
| --- | --- |
| season | for example `2010/11` |
| club | the game's own club names: Celtic, Rangers, Aberdeen, Hearts, Hibernian, Motherwell, Dundee United, Dundee, Kilmarnock, St Johnstone, St Mirren, Ross County, Livingston, Inverness CT, Hamilton, Partick Thistle, Dunfermline, Falkirk, Gretna |
| player | name as Transfermarkt writes it (for example `Kyogo Furuhashi`, `Sasa Papac`, `Duk`) |
| position | GK, DEF, MID or FWD, from the position group Transfermarkt shows on the season page. This is the player's main position on Transfermarkt today, not necessarily where he played that season |
| nationality | first nationality Transfermarkt lists (its own spellings, for example `Ireland`, `Korea, South`, `Bosnia-Herzegovina`) |
| apps | league appearances, starts plus substitute appearances |
| goals | league goals (Transfermarkt shows `-` for none; that is written as 0) |
| assists | league assists. Blank when Transfermarkt shows `-` in every part of the season, which can mean none or not recorded (see Assists below). A number means Transfermarkt recorded that many |
| tm_player_id | Transfermarkt player id. Use this, not the name, to join seasons together |
| source | the page or pages the row was read from, separated by spaces |

### club_season_checks.csv columns

`season, club, player_goals_sum, table_goals_for, gap, flag, tm_table_gf, wikipedia_gf, tm_vs_wiki, tm_games, note, sources`

- `table_goals_for` is the club's final league goals for from the Wikipedia season article's final table (all 38 games, or 29 to 30 in the curtailed 2019/20 season).
- `gap` is `table_goals_for - player_goals_sum`. Own goals scored by opponents explain small positive gaps.
- `flag` is `CHECK` when the gap is more than 4 either way.
- `tm_table_gf` is the same figure from Transfermarkt's own tables, where it could be read. `tm_vs_wiki` says `DIFFER` when the two disagree.

## Sources and method

1. **League tables.** `https://www.transfermarkt.co.uk/scottish-premiership/tabelle/wettbewerb/SC1/saison_id/<year>` for each season (year is the starting year, so 2010 is 2010/11). This gave the 12 clubs and their Transfermarkt ids.
2. **Player stats.** For each club and season, `https://www.transfermarkt.co.uk/<club>/leistungsdaten/verein/<id>/plus/1?reldata=SC1%26<year>`.
3. **The split.** Transfermarkt stores the post-split games as separate competitions in most seasons: `SCPM` (top six) and `SCPA` (bottom six, relegation round). This applies to 2001/02, 2002/03, 2017/18, 2018/19 and 2020/21 to 2025/26, where its SC1 table stops at 33 games. In the other seasons (2000/01, 2003/04 to 2016/17) the split games are inside SC1. For each club the split page was chosen from the club's place after 33 games (1st to 6th: SCPM, 7th to 12th: SCPA) and fetched with the same URL pattern and `reldata=SCPM%26<year>` or `reldata=SCPA%26<year>`. Each player's SC1 and split rows were added together. Note that the competition list on Transfermarkt's own pages leaves out SCPA for 2001/02, but the pages exist and have the data. Relegation play-offs (`SC1P`) are not top-flight league games and are not included.
4. **Missing matches.** A minutes check (all players' minutes divided by 990 should equal games played) found three matches that Transfermarkt's season pages leave out. They were read straight from Transfermarkt's match reports and added to the rows:
   - Dundee United 2-1 Hibernian, 2001/02 relegation round (date shown as unknown on Transfermarkt): line-ups, substitutes and goals added. https://www.transfermarkt.co.uk/spielbericht/index/spielbericht/3903364
   - Dundee 0-1 Kilmarnock, 2002/03 top-six split (date unknown on Transfermarkt): line-ups, substitutes and goals added. https://www.transfermarkt.co.uk/spielbericht/index/spielbericht/3840374
   - Dundee 3-2 Aberdeen, 17 May 2026: Transfermarkt has no line-ups for this match ("no data available"), so only the goals and assists from the match report were added. **Appearances for this match are missing** for every Dundee and Aberdeen player (Wikipedia's 2025-26 Dundee season page shows each Dundee player one appearance higher). https://www.transfermarkt.co.uk/spielbericht/index/spielbericht/4859229
   The same check also shows Dundee United 2000/01 about 2 games' worth of minutes short and Motherwell 2005/06 about 1, but every match report for those seasons has line-ups and their goal totals match, so appearances there are probably right and only minutes are incomplete. Treat appearance counts for those two club seasons with a little care.
5. **Goals check.** Final league goals for each club were taken from the English Wikipedia season articles (`2000–01 Scottish Premier League` to `2012–13 Scottish Premier League`, `2013–14 Scottish Premiership` onwards; for 2014/15, 2016/17 and 2017/18 the table template `Template:<season> Scottish Premiership table`), a source independent of Transfermarkt. Transfermarkt's split tables proved unreliable for this (some show season totals, some show only the five split games, a few disagree with Wikipedia outright, and 2001/02 and 2002/03 have no split table at all), so they are kept only as a second column.

Requests were spaced at least 1.6 seconds apart, with retries. Raw pages are cached in the session scratchpad (`spfl_raw/tm/` and `spfl_raw/wiki/`), along with the scripts (`scrape.py`, `build.py`).

## Goal check results

Gap (table goals minus players' goals) across the 312 club seasons:

| gap | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| club seasons | 3 | 91 | 106 | 64 | 30 | 12 | 4 | 1 | 1 |

Total gap 402 goals over 26 seasons, about 1.3 a club season, which is the usual own goal rate.

Gaps over 4 (flagged `CHECK`):

| season | club | players | table | gap | finding |
| --- | --- | --- | --- | --- | --- |
| 2007/08 | Celtic | 79 | 84 | 5 | Not resolved; probably own goals (several in the Wikipedia match list) |
| 2010/11 | Rangers | 81 | 88 | 7 | Explained: 7 own goals in the Wikipedia Rangers season scorers table |
| 2020/21 | Rangers | 87 | 92 | 5 | Not resolved; probably own goals |
| 2021/22 | Ross County | 41 | 47 | 6 | **Real gap.** Wikipedia's Ross County season page lists only 2 own goals and has Regan Charles-Cook on 13 league goals (Transfermarkt 10) and Joseph Hungbo on 7 (Transfermarkt 6). Transfermarkt's own 33-game table has Ross County on 45 against 39 from its players. The CSV keeps Transfermarkt's figures |
| 2023/24 | St Mirren | 41 | 46 | 5 | Explained: the Wikipedia/ESPN St Mirren scorers table also gives 41 by players, so 5 own goals |
| 2025/26 | Falkirk | 45 | 50 | 5 | Not resolved; probably own goals (several in the Wikipedia match list) |

Three club seasons have one more player goal than the table (2003/04 Dundee United, 2005/06 Dunfermline, 2013/14 Partick Thistle): one goal is credited to a player on Transfermarkt that is not in the final table, or an own goal is credited to a player.

Dundee 2025/26 now has a gap of 4 (35 plus the 3 added goals, against 42) and is not flagged.

## Assists

Transfermarkt shows `-` both for no assists and for no data, so blanks are ambiguous. Assist totals for Celtic and Rangers (team assists against team goals):

| season | Celtic goals / assists | Rangers goals / assists | assists per goal, whole league |
| --- | --- | --- | --- |
| 2000/01 | 88 / 16 | 75 / 13 | 0.19 |
| 2001/02 | 93 / 81 | 81 / 58 | 0.42 |
| 2002/03 | 97 / 92 | 99 / 48 | 0.36 |
| 2003/04 | 103 / 56 | 75 / 12 | 0.31 |
| 2004/05 | 85 / 35 | 76 / 33 | 0.36 |
| 2005/06 | 92 / 52 | 64 / 44 | 0.60 |
| 2006/07 | 62 / 27 | 60 / 23 | 0.42 |
| 2007/08 | 79 / 60 | 82 / 70 | 0.77 |
| 2008/09 | 78 / 64 | 75 / 66 | 0.83 |
| 2009/10 to 2016/17 | 75 to 106 / 66 to 94 | 55 to 82 / 52 to 79 | 0.88 to 0.96 |
| 2017/18 to 2025/26 | 72 to 110 / 47 to 87 | 63 to 93 / 52 to 73 | 0.67 to 0.92 |

**Assists look complete for both Celtic and Rangers from 2007/08**, which is the first season both clubs have assists on roughly three quarters or more of their goals and stay there. Before that they are patchy (Celtic 2001/02 and 2002/03 look fairly full, Rangers 2003/04 has 12 assists for 75 goals), so assist boards should start at 2007/08. The league-wide rate also drifts down after 2019/20 (about 0.7 assists a goal), which looks like Transfermarkt counting assists more strictly in recent seasons rather than missing data, but that has not been checked against a second source.

## Known gaps and cautions

- Ross County 2021/22: about 4 goals missing on Transfermarkt (see above).
- Dundee and Aberdeen 2025/26: appearances for the 17 May 2026 match are missing.
- Dundee United 2000/01 and Motherwell 2005/06: minutes short on Transfermarkt, appearances probably fine.
- 2019/20 was stopped after 29 or 30 games per club; that is the full season.
- Positions are each player's current main position group on Transfermarkt.
- A player who moved between two top-flight clubs in one season has a row for each club (for example Kris Boyd 2005/06: Kilmarnock 15, Rangers 17).
- Names are Transfermarkt's. Some differ from common English spellings and may need the game's spelling before use.
- Nothing in the data has been changed by hand except the three match-report additions listed under Method.
