# Premier League records boards: sources and checks

Sixty-two boards added in October 2026 (`EXTRA_Q4` in `index.html`). The first thirty-two were built from Craig's research workbook `docs/data/Tenaball_EPL_Data_2026-10-01.xlsx` (collected 1 October 2026, sources listed on its Sources tab). Before going in, every list was audited by three separate checks against published sources (The Analyst, StatMuse, Premier League, Sky Sports, ESPN, BBC, Football365 and match-level datasets on GitHub). Wikipedia and most stats sites could not be opened directly from the build machine, so the checks used search results that quote them.

## Boards

| Board | Id | Notes |
| --- | --- | --- |
| Most Premier League wins as a manager | `pl-at-mgr-wins` | To the end of 2025/26: Moyes 290, Arteta 149 (12th, behind Pochettino's 150). |
| Best Premier League win rate as a manager | `pl-at-mgr-winpct` | To the end of 2025/26. Minimum 50 games. Mancini corrected to 82 from 133 (61.7%). Arteta 149 from 248 (60.1%). |
| Most Premier League clubs managed | `pl-at-mgr-clubs` | To the end of 2025/26. Caretaker spells count. Nine on 4 share the last four places, including Chris Hughton, whose 1998 Spurs caretaker spell (two games) some sources credit to David Pleat. |
| Biggest Premier League seasons | `pl-at-season-goals` | One entry per player, best season. 42-game seasons count. |
| Most 20-goal Premier League seasons | `pl-at-20-goals` | Twelve players on 2 share 10th. |
| Every 20-goal season, five boards | `pl-20g-2023/24`, `-2018/19`, `-2009/10`, `-2002/03`, `-1996/97` | The only runs of consecutive seasons that hold exactly ten 20-goal seasons with nobody in 4 slots. |
| Most Premier League hat-tricks | `pl-at-hattricks` | To the end of 2025/26. Six on 5 share 10th. Haaland still on 8 (his April 2026 hat-trick was in the FA Cup). |
| Fastest to 50 and to 100 Premier League goals | `pl-at-fastest-50`, `pl-at-fastest-100` | Ties at 10th share the place. Andy Cole's 185 games to 100 is the least sourced figure, but The Analyst and SI agree. |
| Most Premier League seasons played | `pl-at-apps-seasons` | Completed seasons to 2025/26. Welbeck has 18 (the workbook's 19 counted 2026/27). Six on 19 share the last five places. |
| Most expensive signings, and by position (keepers, defenders, midfielders, forwards) | `pl-fee-signings`, `pl-fee-gk`, `-def`, `-mid`, `-fwd` | Headline fees as reported in the UK. Trafford's 2025 move to Man City corrected to £27m (the £31m was Newcastle's bid). Morgan Rogers is counted as a midfielder. |
| Club record signings | `pl-fee-clubbuy` | Headline fees. Villa's record on headline fee is Nicolas Jackson (£65m); on guaranteed fee it would be Manzambi. Man Utd and Everton take either answer (3 October 2026): Lukaku £90m and Richarlison £50m with add-ons, Pogba £89m and Sigurdsson £45m up front. |
| Top scorers since 2000/01 for Man Utd, Liverpool, Arsenal and Chelsea | `pl-mu-2000-goals`, `pl-lfc-2000-goals`, `pl-afc-2000-goals`, `pl-cfc-2000-goals` | Premier League goals for the club from 2000/01 to 2025/26 only. Totals checked against published club career figures, less goals before 2000/01 (Scholes, Giggs, Solskjaer, Owen, Gerrard, Heskey, Henry). Some single-season splits inside those totals rest on subtraction, but every total is sourced. Research in `docs/data/SINCE_2000_SCORERS.md`. |
| Biggest sales, all clubs, and for Man Utd, Liverpool, Man City, Arsenal, Chelsea, Spurs and Newcastle | `pl-fee-sales`, `pl-fee-sales-mu`, `-lfc`, `-mci`, `-afc`, `-cfc`, `-tot`, `-new` | Added 2 October 2026 at Craig's request: players accept fees are estimates, so each uses the biggest published figure (add-ons included) from the most prominent UK outlets. Research with sources and reserves is in `docs/data/PL_SALES_2026-10-02.md`. All-time: Kane, Grealish and Tonali (£100m) share 9th and 10th. Arsenal: six on £25m share the last three places. Loans with an obligation count at the combined fee (Hojlund, Morata); swaps with no fee (Sanchez, Mkhitaryan) are left out. |
| Most appearances for Man Utd, Liverpool, Arsenal, Chelsea, Spurs, Man City, Newcastle, Everton, West Ham and Aston Villa | `pl-mu-apps`, `pl-lfc-apps`, `-afc-`, `-cfc-`, `-tot-`, `-mci-`, `-new-`, `-eve-`, `-whu-`, `-avl-apps` | Added 3 October 2026 from Craig's player dataset (`docs/data/pl_players/`, every club-season reconciled), worked out by `scripts/build-pl-records.py` straight from the CSV, grouped by player. Man City (Zabaleta and Yaya Toure, 230) and Everton (Calvert-Lewin and Ferguson, 239) have a pool at 10th. Ideas from `docs/data/Tenaball_new_boards_2026-10-03.md`; the script's figures match that document's tables. |
| Top scorers by nationality: France, Netherlands, Scotland, Republic of Ireland, Wales | `pl-nat-fra-goals`, `-ned-`, `-sco-`, `-irl-`, `-wal-goals` | Same dataset. Nationality is the country a player plays for (birth country if never capped). Netherlands: Bryan Roy and Van der Vaart (24) share 10th. Northern Ireland left out: 10th is on 9 goals. |
| Top scorers, and most appearances, by non-English players | `pl-nonen-goals`, `pl-nonen-apps` | Same dataset. |
| Most appearances by a goalkeeper | `pl-gk-apps` | Same dataset. |
| Most seasons at one club | `pl-apps-one-club` | Same dataset. One game in a season counts; each player once, at his best club. King and Osman (14) share 10th. |
| Most goals by a defender, and by a midfielder | `pl-defender-goals`, `pl-midfield-goals` | Same dataset, whose positions come from footballsquads. Each player goes by the position he played most of his games in, and all his goals count. Wingers count as midfielders (so Sterling, Hazard and Mahrez are on it; Salah and Son are forwards). Checked by hand: Gareth Barry (327 games in defence, 326 in midfield) counts as a midfielder; Unsworth, Harte and Alonso are defenders throughout, and Steve Watson is listed as a defender in every season. |
| Biggest signings for Man Utd, Liverpool, Arsenal, Chelsea, Man City, Spurs, Newcastle, Aston Villa and West Ham | `pl-fee-buys-mu`, `-lfc`, `-afc`, `-cfc`, `-mci`, `-tot`, `-new`, `-avl`, `-whu` | Researched 3 October 2026 by two web-search passes; headline fees (add-ons included), as on the other fee boards. Research, sources, confidence and reserves: `docs/data/PL_SIGNINGS_2026-10-03.md`. Figures with one source only: Keita £52.75m, Zubimendi £60m, Marmoush £63.2m, Savinho £85m, Diaby £51.9m, Torres £31.5m, Todibo £34.2m and Summerville £34m. Loans with an unmet obligation (Marmoush to Spurs, Garnacho to Villa) are left out. Everton is held back: Moise Kean's fee (Sky £36.6m, Juventus about £29m) decides 10th place. |
| Club record scorers, every club | `CLUB_REC` in `index.html` | Extended from 20 to all 51 Premier League clubs on 3 October 2026, with a third tier for clubs with few seasons. The build script checks every row against the dataset and stops if one doesn't match. |

## Left out

- Most points as a manager: nearly the same ten as most wins.
- Most titles as a manager: already in the game (`pl-at-mgr-titles`).
- Biggest sales abroad only, and club record sales: covered by the biggest sales boards instead.
- Everton's biggest signings: waiting on a ruling for Moise Kean's fee (see above).
- Northern Ireland's top scorers: too thin (10th place is on 9 goals).

## Cut-off

Craig's call (3 October 2026): boards stop at the end of a completed season, never part-way through one. Everything here is to the end of 2025/26, except transfer fees, which run to the end of the summer 2026 window. Update the boards once a season ends (and the fee boards after each window).
