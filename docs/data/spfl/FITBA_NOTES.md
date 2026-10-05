# FitbaStats cross-check: Scottish top-flight league appearances and goals

Independent second source for the Scottish player records, taken only from FitbaStats (https://www.fitbastats.com/), with no use of Transfermarkt. Collected 5 October 2026.

File: `fitba_players.csv` (season, club, player, starts, subs, apps, goals, source_url). One row per player, club and season where the player made at least one league appearance. `apps` is starts plus sub appearances. `source_url` is the FitbaStats player page the row was read from.

## Method

- Each club section on FitbaStats has `player_stats_season.php?from=<season id>`, which lists every player used that season (all competitions) with a link to `player.php?playerid=<id>`. Its competition filter is greyed out and ignored, so it can't give league-only figures.
- Each player page has a "Season Breakdown" table with separate columns for Scottish League, Scottish Cup, League Cup, European competition, Other and Total, each as starts (as sub) and goals. The CSV takes the Scottish League column only.
- `team_results_season.php?from=<season id>` lists every match with its competition and round, for example "Scottish League (SPL / 37)" or "Scottish League (Premiership / 38)". This was used to confirm the division each season and to count league games for the checks below.
- Season ids are the same in every club section: 2000/01 is 12, counting down to 2011/12 as 1; 2012/13 is 142, counting up to 2025/26 as 155.
- League means the top flight only: SPL 2000/01 to 2012/13, Premiership 2013/14 to 2025/26. Premiership play-offs are a separate competition on FitbaStats ("Premiership Play-Offs") and are not counted (Hibernian 2013/14, Motherwell 2014/15).
- Seasons outside the top flight, confirmed from the results pages and skipped: Rangers 2012/13 (Division Three), 2013/14 (League One), 2014/15 and 2015/16 (Championship); Hibernian 2014/15 to 2016/17; Hearts 2014/15 and 2020/21; Dundee United 2016/17 to 2019/20 and 2023/24.
- Raw pages are cached in the session scratchpad (`spfl_raw/fitba/<club>/`), with at least 1.6 seconds between requests.
- Player names are FitbaStats's own spelling, taken from the page title (first name first). FitbaStats sometimes uses full names, for example "Cyriel Kolawole Dessers", "Christian Rhys Doidge", "Charles Joseph John Hart", and keeps accents, for example "Tom Rogić".

## Coverage

| Club | FitbaStats player data | In the CSV |
|---|---|---|
| Celtic | Complete for every season | Complete, all 26 top-flight seasons, 2000/01 to 2025/26 (318 player pages) |
| Rangers | Complete for every season | Partial: 136 of the 330 players used in top-flight seasons. Every listed player the coordinator asked about is in. Seasons 2002/03 to 2010/11 are complete; the others are not |
| Hibernian | Complete for every season | Partial: only the 12 players the coordinator asked about |
| Aberdeen | Only 2017/18 (complete) and 5 matches of 2018/19 | None (not fetched) |
| Hearts | Only 2017/18 (complete) | None (not fetched) |
| Motherwell | None at all (no player pages for any season) | None |
| Dundee United | None at all (no player pages for any season) | None |

The full Rangers and Hibernian run was stopped on the coordinator's instruction once the requested players were in. Running `fetch.py` again would finish them (the cached pages are reused).

So FitbaStats can't cross-check Aberdeen, Hearts, Motherwell or Dundee United for 2000/01 to 2025/26.

## Checks

- Celtic, every season: the players' league starts add up to exactly 11 times the league games (418 for a 38-game season, 330 for the 30 games of the curtailed 2019/20).
- Celtic, league goals: the players' goals are 0 to 5 below the team's league goals each season, the gap being own goals. One exception: 2020/21, where the players' goals total 79 but the results page has the team scoring 78. That's one goal too many somewhere on FitbaStats, not found.
- Rangers 2002/03 to 2010/11: starts add up to 11 times the games. Other Rangers seasons are short because not all their players were fetched.
- Spot checks against well-known figures: Larsson 122 league goals 2000/01 to 2003/04 (35, 29, 28, 30), Hooper 63 (20, 24, 19), Kris Boyd 101 for Rangers.

## Things to know

- Rogić joined Celtic in January 2013, so his 2012/13 league games (8 apps, 0 goals) count. He made no Celtic league appearances in 2014/15. Celtic total 2012/13 to 2021/22: 178 apps (113 starts, 65 sub), 32 goals. For 2013/14 to 2021/22 only: 170 apps (110 + 60), 32 goals.
- Kenny Miller (Rangers) has three spells; the Championship seasons 2014/15 and 2015/16 are left out.
- Martin Boyle's Hibernian games in 2015/16 and 2016/17 were in the Championship and are left out.
