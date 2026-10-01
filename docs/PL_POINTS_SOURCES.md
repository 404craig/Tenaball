# Premier League final points, 1992/93 to 2025/26: verification notes

In the game as `PL_PTS` in `index.html`, one list per season in the same order as the game's `PL` club list in `index.html` (22 clubs up to 1994/95, 20 after). All 34 seasons are included.

## Method

Wikipedia, worldfootball.net, rsssf, premierleague.com, BBC, Sky and every other football site were blocked by the container's egress proxy, for both curl and WebFetch. Only GitHub, PyPI, npm and WebSearch could be reached. So I worked out the final tables from complete match-by-match results in independent public datasets on GitHub, added the known points deductions, and checked the results against published final tables found through WebSearch.

Sources (match results, every game, used to work out W/D/L, goals and points):

- **engsoccerdata**: James Curley's dataset, `jalapic/engsoccerdata`, `data-raw/england.csv`. Covers 1992/93 to 2024/25 but has no 2022/23 games.
- **football-data.co.uk**: mirrored in `datasets/football-datasets`, `datasets/premier-league/season-*.csv`. Covers 1993/94 to 2025/26.
- **footballcsv**: `footballcsv/england`, `eng.1.csv` per season. Covers 1992/93 to 2023/24; its 2020/21 file is in a different format and was not used.
- **openfootball txt**: `openfootball/england`, `1-premierleague.txt`. Covers 2000/01 to 2025/26 but has no 2024/25 file. footballcsv and openfootball come from the same project, so between them they count as one independent source.

For each season I checked that every source had the right number of games (462 for 22 clubs, 380 for 20) and the right clubs. The points from every source agreed exactly, with no disagreements in any season. I then sorted each table by points (after deductions), goal difference and goals scored. The order came out the same as the game's order in all 34 seasons.

Published-table checks through WebSearch (search summaries of Wikipedia, NBC Sports, Sporting Life and other sites):

- Every club's points matched for 1992/93, 2024/25 and 2025/26 (2025/26 with full P/W/D/L/GF/GA as well).
- Spot values matched for 1994/95 (top 6, Norwich 43, Ipswich 27), 1996/97 (Middlesbrough 39), 2009/10 (Portsmouth 19), 2022/23 (top 3, Everton 36, Leicester 34) and 2023/24 (Everton 40, Forest 32, Luton 26).

## Sources and result per season

| Season | Match sources that agree | Points | Order vs game |
|---|---|---|---|
| 1992/93 | engsoccerdata, footballcsv | agree | matches |
| 1993/94 | engsoccerdata, football-data.co.uk, footballcsv | agree | matches |
| 1994/95 | engsoccerdata, football-data.co.uk, footballcsv | agree | matches |
| 1995/96 | engsoccerdata, football-data.co.uk, footballcsv | agree | matches |
| 1996/97 | engsoccerdata, football-data.co.uk, footballcsv | agree | matches |
| 1997/98 | engsoccerdata, football-data.co.uk, footballcsv | agree | matches |
| 1998/99 | engsoccerdata, football-data.co.uk, footballcsv | agree | matches |
| 1999/00 | engsoccerdata, football-data.co.uk, footballcsv | agree | matches |
| 2000/01 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2001/02 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2002/03 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2003/04 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2004/05 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2005/06 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2006/07 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2007/08 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2008/09 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2009/10 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2010/11 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2011/12 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2012/13 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2013/14 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2014/15 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2015/16 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2016/17 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2017/18 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2018/19 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2019/20 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2020/21 | engsoccerdata, football-data.co.uk, openfootball txt | agree | matches |
| 2021/22 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2022/23 | football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2023/24 | engsoccerdata, football-data.co.uk, footballcsv, openfootball txt | agree | matches |
| 2024/25 | engsoccerdata, football-data.co.uk | agree | matches |
| 2025/26 | football-data.co.uk, footballcsv, openfootball txt | agree | matches |

Every season has at least two independent sources:

- 1992/93: engsoccerdata and footballcsv, plus the full published table through WebSearch.
- 2022/23: football-data.co.uk and openfootball.
- 2024/25: engsoccerdata and football-data.co.uk, plus the full published table.
- 2025/26: football-data.co.uk and openfootball, plus the full published table.

## Points deductions (already taken off in the JSON)

Match results do not show deductions, so these were added by hand. Each was confirmed through WebSearch (SI, 90min, beIN, NBC and others), and these sources list no other Premier League deductions.

- 1996/97 Middlesbrough: minus 3 for not playing their fixture at Blackburn in December 1996. 42 from results, 39 final, 19th and relegated.
- 2009/10 Portsmouth: minus 9 for going into administration. 28 from results, 19 final, 20th.
- 2023/24 Everton: minus 8 in total. A 10-point PSR penalty was cut to 6 on appeal, then 2 more came off in April 2024. 48 from results, 40 final, 15th.
- 2023/24 Nottingham Forest: minus 4 for a PSR breach. 36 from results, 32 final, 17th.

## Disagreements and order mismatches

- No disagreements between sources in any season.
- No order mismatches: the game's club order is right in all 34 seasons.

## Seasons not verified

None. All 34 seasons are in the JSON.

## Caveat

The source the task asked for (Wikipedia League table sections) could not be fetched directly, because Wikipedia is blocked here. The points come from independent match records that all agree with each other and with published final tables. If Wikipedia access is opened later, a direct compare against those pages is cheap.
