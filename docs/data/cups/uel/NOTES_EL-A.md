# NOTES EL-A: Europa League scorers and 2025/26 boards

Agent EL-A, 5 October 2026. Period: UEFA Cup and Europa League seasons 2000/01 to 2025/26 (finals 2001 to 2026). Nothing earlier counts.

## What counts
- Main competition only. 2000/01 to 2008/09 (UEFA Cup): first round onwards (the qualifying round is left out; from 2004/05 the first round came before the group stage). 2009/10 onwards: group stage (league phase from 2024/25) onwards; qualifying rounds and the play-off round are left out. Knockout ties against clubs that dropped down from the Champions League count.
- This is how UEFA.com's stats ("TOURNAMENT" phase) and Transfermarkt's EL competition both count, which I checked by matching goal totals with match counts per season.

## Sources
- UEFA.com stats API: `https://compstats.uefa.com/v1/player-ranking?competitionId=14&phase=TOURNAMENT&seasonYear=<Y>&stats=goals&limit=500&optionalFields=PLAYER,TEAM`. Watch out: seasonYear is the start year for 2000/01 to 2006/07 (2000 to 2006) and the end year from 2007/08 (2008 onwards); seasonYear 2007 is empty.
- UEFA.com standings API (`standings.uefa.com/v1/standings?competitionId=14&seasonYear=2026`) and match API (`match.uefa.com/v5/matches?competitionId=14&seasonYear=<Y>`, with scorers and goal types for each final).
- Transfermarkt: season scorer lists (`/europa-league/torschuetzenliste/pokalwettbewerb/EL/saison_id/<startyear>`) and the all-time list with a season range (`/europa-league/ewigetorschuetzenliste/pokalwettbewerb/EL/plus/1?saisonIdVon=2000&saisonIdBis=2025`). Transfermarkt's table page for the league phase gave an error page, so Wikipedia was the second source there.
- Wikipedia: 2025-26 season and league phase articles, 2003-04 UEFA Cup, and every final's article 2001 to 2026.

## Raw data (this folder)
- `uel_scorers_by_season.csv`: every scorer per season from UEFA.com (a handful of UEFA rows have no player name, shown as `?id`; none are near any board).
- `uel_scorers_2000_2026_totals.csv`: top 100 totals summed by UEFA player id.
- `uel_final_scorers.csv`: every goal in each final 2001 to 2026 from UEFA.com, with goal type (SCORED, PENALTY, OWN).
- `uel_2025_26_league_phase.csv`: the 36-club league phase table.

## Boards written
- `el07`: top scorers 2000/01 to 2025/26. UEFA totals and Transfermarkt's ranged all-time list agree on all the top 13 (Aubameyang 34, Huntelaar 30, Falcao 30, Dzeko 28, Lukaku 27, Bruno Fernandes 27, Aduriz 26, Lacazette 26, then Larsson, Gameiro and Dabbur 24, a pool for 9th and 10th). Idea said "since 1992/93"; Craig's later rule makes it 2000/01, so Larsson's 1990s goals (Feyenoord, Celtic) don't count. Small differences lower down (Kerzhakov and Liedson 19 on UEFA, 20 on Transfermarkt) don't touch the board.
- `el09-2000`, `el09-2010`, `el09-2016`: each season's top scorer, windows 2000/01 to 2009/10, 2010/11 to 2019/20 and 2016/17 to 2025/26 (the latest). Joint top scorers are one row with alts. Nobody fills more than 2 slots in any window (Shearer, Falcao, Aduriz, Bruno Fernandes 2 each), so all pass the 4-slot rule.
  - Disagreement: 2003/04. UEFA.com's current stats give Sonny Anderson (Villarreal) 7 goals alone; Transfermarkt and Wikipedia (citing UEFA's match protocols of the time) give Anderson, Kezman, Drogba and Shearer 6 each. The row accepts all four, so Anderson is right under either.
  - Bruno Fernandes's 8 in 2019/20 were for Sporting and Man Utd combined (UEFA and Transfermarkt both list him top on 8).
- `el10`: open board, everyone who scored in a final 2001 to 2026 (66 players). UEFA match data and each final's Wikipedia article agree on every scorer. Own goals left out (Geli 2001, Mancini 2023; Lukaku scored a penalty in 2020 as well as his own goal, so he counts). Shoot-out goals don't count; 2014 was 0-0. "Adriano" is Adriano Correia (Sevilla, 2007) and "Diego" is Diego Ribas (Atletico Madrid, 2012); the game may match those single names to other players of the same name.
- `el15`: 2025/26 top scorers. UEFA.com, Transfermarkt and Wikipedia agree. Igor Jesus and Petar Stanic 7, Akturkoglu and Antony 6, then seven players on 5 share places 5 to 10 (pool).
- `el16`: 2025/26 league phase 1st to 10th. UEFA.com standings and Wikipedia agree on order, points and records. Lyon top on goal difference over Aston Villa; Bologna 10th ahead of Stuttgart on goal difference.

## Clubs not on clubs_all.txt (common English names used, flagged)
Midtjylland, Braga, Genk (el16); in el09 vals: Lausanne-Sport, AEK Athens, Basel, Zenit, CSKA Moscow, Union SG, Bodo/Glimt, Ludogorets. Red Bull Salzburg is used as the badge pack's alias name.

## Dropped
Nothing dropped.
