# Scottish top flight boards: sources and checks

Craig's picks from the Scottish Premiership question picker (5 October 2026), built into `index.html` as `EXTRA_Q5` and `SPFL_OPEN` by `scripts/build-spfl-records.py`. Every board covers league seasons 2000/01 to 2025/26 unless it says otherwise. Run the script from the repo root after changing any file here.

## Files

| File | What it is | Sources |
|---|---|---|
| `spfl_tables.csv` | Every final table, 2000/01 to 2025/26 | Worked out from every result in football-data.co.uk's Scottish files (`SC0.csv` for each season). All 250 points totals in the game's own season tables matched; 2025/26 matched Wikipedia (Celtic 82, Hearts 80, Rangers 72). Deductions from Wikipedia's season articles: Gretna -10 (2007/08), Rangers -10 (2011/12), Hearts -15 (2013/14), Dundee United -3 (2015/16). |
| `spfl_players.csv` | Every player's league appearances, goals and assists for each club and season | Transfermarkt club season pages, with the post-split games (TM's SCPM and SCPA codes) added; see `README.md`. Each club's goals were checked against its table (gaps of 0 to 4 are own goals). The season's top scorer matched the game's own top scorer boards for 25 of 26 seasons; the 26th (Ross County 2021/22) is corrected below. |
| `second_source.csv` | A second source for every club scorers and appearances board | FitbaStats for Celtic, Rangers and Hibernian (`fitba_players.csv`, `FITBA_NOTES.md`); AFC Heritage for Aberdeen, londonhearts.com and Soccerbase for Hearts, Soccerbase and Wikipedia for Motherwell and Dundee United (`XCHECK_NOTES.md`). |
| `derbies.csv` | Every Old Firm and Edinburgh derby league match with its scorers | FitbaStats match pages, londonhearts.com and the clubs' Wikipedia season articles (`DERBIES_NOTES.md`). |
| `SPFL_LISTS.md` | Managers, captains, PFA Scotland awards, cup finals, promotion and relegation, European final line-ups | Wikipedia, FitbaStats, RSSSF, AFC Heritage, BBC and others, two sources a row. |
| `SPFL_TRANSFERS.md` | Celtic, Rangers and other clubs' biggest fees | Transfermarkt plus a news report for every fee. |

## Corrections and decisions

- **Two sources for the club boards:** every club scorers and appearances top ten is the same in both sources. Where the totals differ (by one or two), the board shows both, for example "88 or 89 goals", and players whose order isn't certain in both sources (level in either, or the other way round) share their places, so either order counts.
- **One source only (overall scorers, assists, best seasons, 20-goal seasons, top scorer per country):** where the sources could be compared they differed by a goal or a game, so on these boards players within one of each other share their places, and a gap of one at the cut brings the next player into a shared 10th (the overall scorers' 10th is Kenny Miller, Adam Rooney or Billy McKay).

- **Ross County 2021/22:** Transfermarkt has Regan Charles-Cook on 10 goals and Joseph Hungbo on 6. Wikipedia's season article and the game's own top scorer board have 13 and 7, so the CSV uses those.
- **Dundee 3-2 Aberdeen, 17 May 2026:** Transfermarkt has no line-ups for this game, so players in it are one appearance short for 2025/26. It changes no board.
- **Assists:** Transfermarkt's assists are only complete from 2007/08, so the assists boards start there and say so.
- **Transfers:** only deals from July 2000, ranked by the fee reported at the time in pounds (the guaranteed part). Fees with a range of reports share a place with the player they could swap with (a pool). Transfermarkt's €16.2m for Jota's 2022 move to Celtic doesn't match any report and isn't used; £6.5m (BBC) is.
- **Title-winning managers:** the boards stop at 2015/16, because Rodgers would fill four places in any later ten-season window, and 2018/19 and 2025/26 were shared between managers.
- **Celtic managers:** every spell since 2010 counts, interim spells included (Kennedy 2021, O'Neill 2025), so Lennon, Rodgers and O'Neill each fill two places.
- **Rangers managers:** permanent managers only, from McCoist in 2011, to give exactly ten.
- **Final line-ups:** Wikipedia and FitbaStats agree on every name. For Rangers in 2008 and 2022 the sources disagree on exact positions, so those boards label the slots DF, MF and FW.
- **PFA awards:** no award in 2019/20. The 2004/05 Players' Player was shared (Hartson and Ricksen), so either name fills that year.
- **Top-three finishes outside the Old Firm:** only nine clubs have one, so the board uses top-four finishes (ten clubs).
- **Managers who won the league:** only nine since 2000, so it became the two title-winner series instead.
- **Clubs to win a major trophy since 2000:** this is the cup winners outside the Old Firm board plus Celtic and Rangers, so only the outside-the-Old-Firm board was built (ten clubs, ranked by wins).
- **Points on the game's 2025/26 tables:** the 2025/26 table and the champions, 2nd, 3rd and 4th place boards had no points; they now show them, from `spfl_tables.csv`.
