# Premier League records boards: sources and checks

Thirty-two boards added in October 2026 (`EXTRA_Q4` in `index.html`), built from Craig's research workbook `docs/data/Tenaball_EPL_Data_2026-10-01.xlsx` (collected 1 October 2026, sources listed on its Sources tab). Before going in, every list was audited by three separate checks against published sources (The Analyst, StatMuse, Premier League, Sky Sports, ESPN, BBC, Football365 and match-level datasets on GitHub). Wikipedia and most stats sites could not be opened directly from the build machine, so the checks used search results that quote them.

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
| Club record signings | `pl-fee-clubbuy` | Headline fees. Villa's record on headline fee is Nicolas Jackson (£65m); on guaranteed fee it would be Manzambi. |
| Top scorers since 2000/01 for Man Utd, Liverpool, Arsenal and Chelsea | `pl-mu-2000-goals`, `pl-lfc-2000-goals`, `pl-afc-2000-goals`, `pl-cfc-2000-goals` | Premier League goals for the club from 2000/01 to 2025/26 only. Totals checked against published club career figures, less goals before 2000/01 (Scholes, Giggs, Solskjaer, Owen, Gerrard, Heskey, Henry). Some single-season splits inside those totals rest on subtraction, but every total is sourced. Research in `docs/data/SINCE_2000_SCORERS.md`. |
| Biggest sales, all clubs, and for Man Utd, Liverpool, Man City, Arsenal, Chelsea, Spurs and Newcastle | `pl-fee-sales`, `pl-fee-sales-mu`, `-lfc`, `-mci`, `-afc`, `-cfc`, `-tot`, `-new` | Added 2 October 2026 at Craig's request: players accept fees are estimates, so each uses the biggest published figure (add-ons included) from the most prominent UK outlets. Research with sources and reserves is in `docs/data/PL_SALES_2026-10-02.md`. All-time: Kane, Grealish and Tonali (£100m) share 9th and 10th. Arsenal: six on £25m share the last three places. Loans with an obligation count at the combined fee (Hojlund, Morata); swaps with no fee (Sanchez, Mkhitaryan) are left out. |

## Left out

- Most points as a manager: nearly the same ten as most wins.
- Most titles as a manager: already in the game (`pl-at-mgr-titles`).
- Biggest sales abroad only, and club record sales: covered by the biggest sales boards instead.

## Cut-off

Craig's call (3 October 2026): boards stop at the end of a completed season, never part-way through one. Everything here is to the end of 2025/26, except transfer fees, which run to the end of the summer 2026 window. Update the boards once a season ends (and the fee boards after each window).
