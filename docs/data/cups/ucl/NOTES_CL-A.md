# Champions League boards, agent CL-A (October 2026)

Period for every board: Champions League seasons 1992/93 to 2025/26 (the 2026 final), main competition only. Figures stop at the 2026 final; nothing from 2026/27 is counted (several live sources already include September 2026 games, and those were taken out).

## What "main competition" means here

UEFA's own split was followed: qualifying rounds and the play-offs before the group or league stage are left out. In 1992/93 and 1993/94 the first and second rounds (knockout rounds before the eight-team group stage) are part of UEFA's main competition and count, as they do on UEFA.com, Transfermarkt and the game's existing all-time scorers board. From 2024/25 the knockout phase play-offs (after the league phase) count. The one exception is cl16 (seasons), which counts only seasons in which a club reached the group or league stage.

## Sources

- UEFA.com stats API (`compstats.uefa.com/v1/player-ranking` and `/team-ranking`, `phase=TOURNAMENT`), every season. UEFA's `seasonYear` is the start year up to 2006/07 (1992 = 1992/93, 2006 = 2006/07), 2007 is empty, and from 2007/08 it is the end year (2008 = 2007/08, 2026 = 2025/26).
- UEFA match data (`match.uefa.com/v5/matches`, every match with score, extra time, shoot-out and scorers) and line-ups (`match.uefa.com/v5/matches/<id>/lineups`, starting XI, bench and the coach for most games from 2008/09).
- Transfermarkt: season scorer lists (`torschuetzenliste`, competition CL, every season), the record appearances list filtered to 1992/93 to 2025/26, honours pages, player game logs (`/ceapi/performance-game/<id>`), each manager's list of Champions League games (`leistungsdatenDetail/trainer/<id>/saison_id/0/wettbewerb_id/CL`) and the all-time table.
- Wikipedia: European Cup and UEFA Champions League records and statistics; List of UEFA Champions League top scorers; List of UEFA Champions League hat-tricks; List of footballers with 100 or more UEFA Champions League appearances; Template:Participating clubs of the Champions League era; 2025-26 UEFA Champions League league phase.

Raw pages are cached in the scratchpad (`cups_raw/CL-A/`). Data files written here:

- `cl_player_seasons_uefa.csv`: every player season from UEFA.com (apps, goals, assists, minutes, by team).
- `cl_scorers_tm.csv`: every scorer season from Transfermarkt (clubs "two clubs" where a player moved mid-season).
- `cl_matches_uefa.csv`: all 4,125 main-competition matches 1992/93 to 2025/26 with extra time and shoot-outs.
- `cl_team_seasons_uefa.csv`: every club season (played, won, drawn, lost, goals).
- `cl_hattricks_uefa.csv`: every hat-trick worked out from UEFA scorer events (171).
- `cl_manager_games.csv`: every game for 18 managers, Transfermarkt attribution matched to UEFA results, with the coach UEFA names where it has one.
- `cl_keeper_clean_sheets.csv`: starts and clean sheets for the top keepers, UEFA line-ups against Transfermarkt game logs.

## A trap in UEFA.com player stats

UEFA.com files a player's whole season under the club he ended it with. For mid-season movers this puts goals under the wrong club (Haaland's 2019/20 Salzburg goals under Dortmund, Luis Diaz's 2021/22 Porto goals under Liverpool, Santiago Gimenez's 2024/25 Feyenoord goals under AC Milan, Mudryk's 2022/23 Shakhtar goals under Chelsea). Transfermarkt shows such seasons as "two clubs". Every mover near a club board's cut was split using Transfermarkt game logs.

## Boards written (24)

- **cl01** Most appearances (easy). UEFA.com season sums and Transfermarkt agree on all ten. Wikipedia has Giggs on 141 (UEFA and Transfermarkt 145: his 1993/94 first and second round games). Raul, Ramos and Modric are 11th to 13th on 142.
- **cl03** Most hat-tricks (medium). Wikipedia's list and a count from UEFA scorer events agree exactly (171 to the end of 2025/26; Wikipedia's 173 includes two from September 2026). Places 1 to 9 fixed; tenth is a pool of the 15 players on two.
- **cl04** Most goals in one season, each player once (medium). UEFA, Transfermarkt and Wikipedia agree. Ninth and tenth are a pool of three on 12 (Van Nistelrooy, Gomez, Haaland).
- **cl05** Most titles (easy). Rule: a title counts if the player played in that season's competition for the winning club. UEFA season apps and Transfermarkt game logs agree on this rule. Four on six (Kroos, Modric, Carvajal, Nacho), then a pool of seven on five for places 5 to 10 (Ronaldo, Bale, Benzema, Casemiro, Marcelo, Lucas Vazquez, Seedorf). Disagreements: Wikipedia gives Seedorf four (it drops 1999/2000, when he played for Real Madrid until January); Transfermarkt honours give Isco five (2021/22 squad, no Champions League games). Under the "played" rule Seedorf has five and Isco four.
- **cl06** Most clean sheets (hard). Rule: started the game and the team conceded nothing in 90 or 120 minutes. UEFA line-ups plus results and Transfermarkt game logs agree on every keeper once Transfermarkt's shoot-out scores are allowed for. Wikipedia also has Neuer 63. UEFA.com's own player clean-sheet stat is incomplete before about 2003 (Van der Sar 43, Kahn 29) and was not used; flag this if Craig expects the UEFA.com figures.
- **cl07-1992** Season top scorers 1992/93 to 2001/02 and **cl07-2001** 2001/02 to 2010/11 (medium). UEFA, Transfermarkt and Wikipedia agree except 1993/94: Wikipedia and Transfermarkt have Koeman level with Rufer on 8, UEFA.com has Koeman on 7, so the slot takes either. Shared awards are one slot with alts. No player fills more than three slots. Flag: in cl07-2001 Man Utd players fill four slots (Van Nistelrooy three, Ronaldo one); the brief asked for no club filling four, but every window that reaches past 2006/07 breaks that, and the board's answers are people, not clubs. Drop cl07-2001 if the club rule is meant strictly. Seasons 2011/12 to 2015/16 cannot go on any board: every ten-year window containing them gives Messi or Ronaldo four or more slots. The windows overlap on 2001/02.
- **cl08-real, -barca, -bayern, -manutd, -liverpool, -chelsea, -arsenal, -mancity, -juventus, -milan** Club scorers (medium). UEFA and Transfermarkt sums agree except: Elber (Bayern) 22 or 21, shown as "21 or 22"; Del Piero 41 on UEFA.com, 42 on Transfermarkt and Wikipedia, shown as 42; Luis Diaz (Liverpool) and Gimenez (Milan) corrected as above. Pools: Real 8th to 10th (four on 16), Bayern 10th (Makaay, Coman), Liverpool 10th (Owen, Benayoun, Szoboszlai, Luis Diaz on 6), Arsenal 10th (Sanchez, Havertz), Man City 10th (David Silva, Julian Alvarez), Milan 10th (Van Basten, Crespo, Pato, Leao, Giroud on 6).
- **cl09** English clubs' scorers (easy). Both sources agree. Sterling 24 + 3, Jesus 20 + 6.
- **cl14** Managers' match wins (easy) and **cl15** managers' games (medium). Each manager's game list is from Transfermarkt; every game was matched to UEFA's result (wins after extra time count, shoot-outs are draws; Transfermarkt adds shoot-out kicks to its scores, so its win colours were not used). UEFA line-ups name the coach for most games from 2008/09 and agree with Transfermarkt except games under a touchline ban (UEFA names the assistant: Mourinho 5, Wenger 2, Guardiola 1, Simeone 1). The boards count banned games for the manager of record. Before 2008/09 UEFA line-ups mostly have no coach, so for the 1990s and 2000s attribution rests on Transfermarkt alone, with Wikipedia's games table as the check: it has the same top nine and Hitzfeld tenth, but counts differently (leaves out banned games, treats 1993/94 first and second rounds as qualifying, includes 2026/27 and pre-1992 European Cup games). cl15 tenth is a pool of three on 95 (Hitzfeld, Van Gaal, Benitez). Wins are less independently checked than the player boards; treat as checked against one attribution source plus UEFA results.
- **cl16** Group or league stage seasons (medium). Wikipedia's participation template and UEFA team stats agree. Tenth is a pool of Benfica, Dortmund and Chelsea on 20.
- **cl17** Club match wins (easy). UEFA team stats and a recount from every UEFA result agree. Transfermarkt's all-time table has the same top ten in the same order with slightly higher totals (it lists a few extra matches; AC Milan 211 games against UEFA's 207, and the 207 matches the rounds Milan played), and on Transfermarkt AC Milan tie Liverpool on 95. Board uses UEFA: Liverpool 95, AC Milan 94 just outside.
- **cl22** 2025/26 top scorers (medium). UEFA and Transfermarkt agree. Tenth is a pool of seven on 6.
- **cl24** 2025/26 league phase, first to tenth (medium). Wikipedia's table and a rebuild from all 144 UEFA league phase results agree. PSG were 11th and won the final.

## Dropped

- **cl02** Most assists. The sources use different rules and disagree on who is in the ten, so it cannot be verified:
  - Opta (Wikipedia's table, from 1992/93, updated September 2026): Giggs 41, Ronaldo 40, Messi 39, Di Maria 38, Beckham 36, Figo 34, Xavi 31, Neymar 30, then De Bruyne, Raul, Benzema 27.
  - Transfermarkt (1992/93 to 2025/26): Ronaldo 50, Giggs 46, Messi 45, Di Maria 42, Figo 38, Beckham 37, Neymar 37, Muller 34, Raul 33, Vinicius 33, then Xavi and Kroos 31.
  - UEFA.com season sums (full assist data only from 2003/04): Ronaldo 42, Di Maria 41, Messi 40, Neymar 33, Vinicius 32, Giggs 30, Xavi 30, then Iniesta, Benzema, Muller and De Bruyne 29.
  Only five names (Ronaldo, Giggs, Messi, Di Maria, Neymar) are in all three top tens. If Craig picks one source (UEFA's official list is the obvious one), the board can be built from that alone.

## Club names

All clubs used are in `docs/data/cups/clubs_all.txt` (Spurs, Sporting, Olympiacos, Dortmund, PSG, Inter and so on). No new club names were needed.

## Names not yet in the game's people list

Wynton Rufer, Milinko Pantic, Luiz Adriano, Daniele Massaro, Jean-Pierre Papin, Marco Simone, Jens Petter Hauge and Mircea Lucescu appear on these boards but not yet in `index.html`; boards of type `person` add them.
