# Champions League boards, agent CL-B (5 October 2026)

Ideas: cl10, cl12, cl13, cl18, cl26. Period 1992/93 to 2025/26 (finals 1993 to 2026). Fourteen boards written, none dropped, though cl12 can't cover 2018 to 2026 (see below).

## Sources and method

- **Transfermarkt.** For each season 1992 to 2025 I took the final's match id from the fixtures page (`/uefa-champions-league/gesamtspielplan/pokalwettbewerb/CL/saison_id/<year>`, the round headed "Final"), then the match report (`/spielbericht/index/spielbericht/<id>`). From each report I read the starting XIs with shirt numbers, the captain's armband icon, the goals and the substitutions. The ids are in `cl_finals_1993_2026.csv`.
- **Wikipedia.** The article for each final, 1993 to 2026, read as raw wikitext (`index.php?action=raw`, since the API was rate-limiting). From each I read the team sheets (position, shirt number, (c) mark) and the infobox goals.
- **Transfermarkt squad pages.** The Champions League stats page for each winning club and season (`leistungsdaten ... reldata=CL%26<year>`), used for cl13. Transfermarkt's CL competition leaves out qualifying rounds, so the appearances count from the group or league stage on. All rows are in `cl_winners_squad_apps.csv`.
- **Wikipedia player articles.** The Honours sections of the 28 cl13 players.
- The game's own `UCL_W` and `UCL_R` arrays, for cl18.

Raw pages are cached in the scratchpad (`cups_raw/CL-B/`). The board-building script is `boards.py` in the same folder.

## Checks, board by board

- **cl18, most finals (easy).** Counted from `UCL_W` and `UCL_R` for 1993 to 2026, then counted again from the finalists in the 34 Transfermarkt reports. The two counts match. Dortmund, Chelsea, Inter and PSG tie on 3 finals for 8th to 10th, so those places are a pool of four. Ajax, Valencia, Arsenal, Atletico Madrid and Man City (2 each) are in the notes.
- **cl10, final scorers (open, medium).** There are 71 scorers. The Wikipedia infobox goals and the Transfermarkt goals agree for all 34 finals: same player, same year, same club. The match was checked automatically. Neither source shows an own goal in any final from 1993 to 2026, and the 2003 final was 0-0. Shoot-out penalties aren't counted; extra-time goals are. Juliano Belletti is entered as `Belletti`, the game's existing spelling.
- **cl12, winning captains (medium).** The captain is the player with the armband at kick-off: the (c) on Wikipedia's team sheet and the armband icon on Transfermarkt. The two agree for every winner from 1993 to 2026. The windows that pass the four-slot rule (checked for both player and club) are:
  - `cl12-1993` (1993 to 2002; Real Madrid on 3)
  - `cl12-2003` (2003 to 2012; Barcelona on 3)
  - `cl12-2008` (2008 to 2017; Barcelona 3, Real Madrid 3, Ramos 2). This one overlaps the 2003 window by five years. Pick one or keep both.

  No ten-year window ending in 2018 or later passes, because Real Madrid would fill four or more slots. So the most recent captains (Ramos 2018, Henderson, Neuer, Azpilicueta, Benzema, Gundogan, Nacho, Marquinhos 2025 and 2026) aren't on any board. The notes cover the cases where someone else lifted the trophy:
  - Schmeichel in 1999 and Lampard in 2012 (the usual captain was suspended)
  - Ferdinand with Giggs in 2008
  - Xavi starting in 2011, with Puyol coming on and Abidal lifting the trophy
  - Iniesta starting in 2015, with Xavi coming on and lifting it
- **cl13, won it with two or more clubs (open, medium).** Definition: the player played at least one game, from the group or league stage on, in a season his club won it. That gives 28 players. Every one is confirmed by his Wikipedia Honours section, which lists the Champions League with each club. Players in a winning squad who never played that season don't count.
  - Seedorf and Eto'o each have three clubs. Eto'o's third is Real Madrid 1999/2000, with 3 games on Transfermarkt and listed in his Wikipedia honours.
  - Seedorf also played 6 games for Real Madrid in 1999/2000 before he left. Wikipedia doesn't count that one, and it doesn't change his place.
  - Craig's example Mandzukic doesn't qualify, because he won only with Bayern (2013). Kovacic does: Real Madrid 2016 to 2018 and Chelsea 2021.
  - If Craig wants the broader "medal in the squad" meaning, the list would grow. That can't be checked from two sources here, so I didn't use it.
- **cl26, English finals' line-ups before 2017 (medium).** Nine boards: `cl26-1999-manutd`, `-2005-liverpool`, `-2006-arsenal`, `-2007-liverpool`, `-2008-manutd`, `-2008-chelsea`, `-2009-manutd`, `-2011-manutd`, `-2012-chelsea`. For each, the Wikipedia team sheet and the Transfermarkt report have the same eleven shirt numbers and players. Positions are Wikipedia's labels, and each slot's val is "No. N". The goalkeeper is left out. Substitutes who came on are in the notes. For 1999 (Keane and Scholes) and 2012 (Terry, Ivanovic, Ramires, Meireles), suspended players are noted as well, from the final articles. Names use the game's spellings: Bolo Zenden, Park Ji-sung, Fabio, Anderson, Jose Bosingwa, John Obi Mikel, Javier Hernandez, Andy Cole, Alexander Hleb.

## Disagreements and loose ends

- **1994 Barcelona captain.** Wikipedia has Bakero; Transfermarkt shows no armband. This doesn't affect any board, because Barcelona lost.
- **2000 Valencia line-up.** Wikipedia and Transfermarkt differ by one shirt number. Valencia lost, so it isn't on any board.
- **Club names.** All are on `clubs_all.txt`; no new names were needed.

## Raw data written here

- `cl_finals_1993_2026.csv`: each final's winner, runner-up, Transfermarkt score (shoot-out score where there was one), both captains, scorers and Transfermarkt match id.
- `cl26_english_final_lineups.csv`: the nine line-ups.
- `cl13_two_club_winners.csv`: the 28 players and their winning seasons by club.
- `cl_winners_squad_apps.csv`: every player in each winner's Transfermarkt CL squad page, with appearances.
