# Premier League records boards: sources and checks

Twenty boards added in October 2026 (`EXTRA_Q4` in `index.html`), built from Craig's research workbook `docs/data/Tenaball_EPL_Data_2026-10-01.xlsx` (collected 1 October 2026, sources listed on its Sources tab). Before going in, every list was audited by three separate checks against published sources (The Analyst, StatMuse, Premier League, Sky Sports, ESPN, BBC, Football365 and match-level datasets on GitHub). Wikipedia and most stats sites could not be opened directly from the build machine, so the checks used search results that quote them.

## Boards

| Board | Id | Notes |
| --- | --- | --- |
| Most Premier League wins as a manager | `pl-at-mgr-wins` | Live. Arteta (153) is 5 behind Hughes (158) in 10th. |
| Best Premier League win rate as a manager | `pl-at-mgr-winpct` | Live. Minimum 50 games. Mancini corrected to 82 from 133 (61.7%). Maresca (53.2%) could pass Slot (55.3%). |
| Most Premier League clubs managed | `pl-at-mgr-clubs` | Live. Caretaker spells count. Nine on 4 share the last four places, including Chris Hughton, whose 1998 Spurs caretaker spell (two games) some sources credit to David Pleat. |
| Biggest Premier League seasons | `pl-at-season-goals` | One entry per player, best season. 42-game seasons count. |
| Most 20-goal Premier League seasons | `pl-at-20-goals` | Twelve players on 2 share 10th. |
| Every 20-goal season, five boards | `pl-20g-2023/24`, `-2018/19`, `-2009/10`, `-2002/03`, `-1996/97` | The only runs of consecutive seasons that hold exactly ten 20-goal seasons with nobody in 4 slots. |
| Most Premier League hat-tricks | `pl-at-hattricks` | Live. Six on 5 share 10th. Haaland still on 8 (his April 2026 hat-trick was in the FA Cup). |
| Fastest to 50 and to 100 Premier League goals | `pl-at-fastest-50`, `pl-at-fastest-100` | Ties at 10th share the place. Andy Cole's 185 games to 100 is the least sourced figure, but The Analyst and SI agree. |
| Most Premier League seasons played | `pl-at-apps-seasons` | Completed seasons to 2025/26. Welbeck has 18 (the workbook's 19 counted 2026/27). Six on 19 share the last five places. |
| Most expensive signings, and by position (keepers, defenders, midfielders, forwards) | `pl-fee-signings`, `pl-fee-gk`, `-def`, `-mid`, `-fwd` | Headline fees as reported in the UK. Trafford's 2025 move to Man City corrected to £27m (the £31m was Newcastle's bid). Morgan Rogers is counted as a midfielder. |
| Club record signings | `pl-fee-clubbuy` | Headline fees. Villa's record on headline fee is Nicolas Jackson (£65m); on guaranteed fee it would be Manzambi. |

## Left out

- Most points as a manager: nearly the same ten as most wins.
- Most titles as a manager: already in the game (`pl-at-mgr-titles`).
- Biggest sales, at home or abroad, and club record sales: the fees mix guaranteed and headline figures, and places 6 to 11 abroad sit within a few hundred thousand pounds of each other depending on exchange rates.

## Re-check

The live boards (manager wins, win rate, clubs managed, hat-tricks) change week to week. Re-check them after each international break, and the fee boards after each transfer window.
