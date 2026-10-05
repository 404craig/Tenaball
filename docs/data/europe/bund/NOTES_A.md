# Bundesliga notes (agent A)

## Files

- `players.csv`: every player with at least one Bundesliga appearance for every club in every season from 2000/01 to 2025/26 (12,612 rows, 468 club seasons). The columns are season, club, player, position, nationality (first flag shown), apps, goals, assists, tm_player_id and source. The source is the Transfermarkt club season stats page (`/leistungsdaten/verein/<id>/plus/1?reldata=L1%26<year>`). Transfermarkt shows assists for every club season back to 2000/01, so no assists are unknown. An empty assists cell would mean unknown, and 0 means none. Players who were in a squad but never played are left out. Totals are counted by Transfermarkt player id (there are two different players called Ailton, for example).
- `club_season_checks.csv`: each club season's player goals against the goals for in the Transfermarkt table. 467 of the 468 gaps are between 0 and 6. Flagged:
  - Leverkusen 2015/16 (gap 5), Eintracht Frankfurt 2020/21 (6) and Bayern Munich 2021/22 (5) are taken to be own goals. ESPN's rosters give the same player goal totals for Leverkusen 2015/16 (51) and Bayern 2021/22 (92). For Frankfurt, ESPN's roster is incomplete.
  - Union Berlin 2024/25 (gap -1): the Union v Bochum game in December 2024 (1-1) was awarded 2-0 to Bochum after a lighter hit the Bochum keeper. The table drops Union's goal, but the player stats keep it.
- `squads_2025_26.csv`: everyone who played a 2025/26 league game, with season, club, player and Transfermarkt id (507 rows; players who moved mid-season appear once for each club).
- Raw pages are cached in `scratchpad/euro_raw/A/bund/` (moved there out of the shared `A/` folder). Every cached table and club page has been checked to show `wettbewerb/L1` or `reldata=L1%26<year>` for the right year and club.

Club names follow `clubs_bund.txt`. Every club from 2000/01 to 2025/26 is on that list, so none had to be added.

Name spellings changed from Transfermarkt: Min-jae Kim is written Kim Min-jae, and Alex Frei is written Alexander Frei. Accents are stripped (Muller, Kiessling, Gotze).

## Top scorer check against the game

Every season's top scorer from 2000/01 to 2025/26, with their goal totals, matches the game's `bund-ts-*` boards, shared seasons included (2000/01, 2001/02, 2002/03 and 2022/23).

## Second sources

- **Wikipedia player career tables** (fetched with `action=raw`, because the parse API was rate-limited): I checked the Bundesliga rows from 2000/01 to 2025/26 season by season for 45 players. They cover every name on de07, de08, de09, de15 and de16 plus the near misses. Every total matches Transfermarkt exactly, so no board needed split figures. There were small differences inside individual seasons that don't change any total:
  - Hummels has one goal in 2007/08 on Wikipedia but in 2008/09 on Transfermarkt.
  - Barrios has 17 games in 2011/12 on Wikipedia and 18 on Transfermarkt. Only his goals are used.
  - Ewerthon and Koller have no season table on Wikipedia, but their infobox Dortmund totals match.
- **Wikipedia List of Bundesliga top scorers**: its all-time totals and club splits match for players whose careers started after 2000. Pizarro's list figure of 197 includes 10 goals from 1999/00, and the board uses 187.
- **Transfermarkt game-by-game data** (`/ceapi/performance-game/<id>`) for 53 players: their league games and goals in each season at each club match the club pages.
- **ESPN** (core API leaders and team rosters) for 2025/26: the goals leaders and the Bayern and Dortmund team leaders match Transfermarkt on every figure. ESPN's older data has gaps (no 2000/01 to 2002/03, empty 2018/19 rosters, fewer games in early seasons), so I didn't use it for the "since 2000" boards.

## Boards

- des01: Bundesliga top scorers 2025/26. Places 8 to 10 are a pool of 4 players on 13 goals (Baumgartner, Burkardt, Tabakovic and El Mala).
- des02: Bundesliga assists 2025/26. This board is uncertain because the sources disagree:

  | Player | Transfermarkt | ESPN |
  |---|---|---|
  | Olise | 21 | 19 |
  | Diaz | 17 | 14 |
  | Ryerson | 15 | 15 |
  | Toure | 12 | 9 |
  | Ilic | 10 | 9 |
  | Eriksen | 10 | 9 |

  The board puts Olise first, makes places 2 and 3 a Diaz and Ryerson pool, and makes places 4 to 10 a pool of the 12 players who are in either source's top ten with ties. Players on 8 on both sources are near misses. Craig may prefer to drop this board, since assists aren't agreed beyond the top three.
- dec0a: Bayern's top scorers 2025/26. Places 9 and 10 are a pool of 4 players on 3 goals.
- dec0b: Name 10 Bayern Munich players 2025/26. This is an open board with 32 names. The examples are the ten with most games.
- dec1a: Dortmund's top scorers 2025/26. Places 8 to 10 are a pool of 6 players on 2 goals.
- dec1b: Name 10 Dortmund players 2025/26. This is an open board with 27 names. The tie at 10th on games (28) went to Schlotterbeck on minutes.
- de07: Bundesliga top scorers since 2000/01. The board has no tie at the cut: Kuranyi is 10th with 111 and Werner 11th with 102.
- de08: Most Bundesliga games since 2000/01. Arnold is 10th with 400 and Reus 11th with 391.
- de09: Biggest single seasons, with each player counted once. Six players are joint 5th on 28 goals and fill places 5 to 10 exactly. Haaland is 11th with 27.
- de15: Bayern's top league scorers since 2000/01. Elber is 10th with 54, counting only his seasons from 2000/01 on. Musiala is 11th with 48.
- de16: Dortmund's top league scorers since 2000/01. Barrios is 10th with 39 and Guirassy 11th with 38. Chapuisat, who was mentioned in the idea, left Dortmund in 1999 and doesn't count.

No board was dropped. Other files in `boards/` (de11, de12, des05 and so on) and NOTES_B.md belong to another agent.
