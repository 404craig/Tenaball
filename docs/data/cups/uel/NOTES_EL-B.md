# Europa League boards, agent EL-B (October 2026)

Period: UEFA Cup and Europa League finals from 2000/01 (the 2001 final) to 2025/26 (the 2026 final), as Craig asked. Nothing earlier counts. Only finals are used on these boards, so the question of qualifying rounds does not come up.

## Raw data

- `uel_finals.csv`: all 26 finals, 2001 to 2026: winner, runner-up, score, winning manager, venue. Club names are the game's (`docs/data/cups/clubs_all.txt`).
- `uel_final_xis.csv`: the ten outfield starters for every English final line-up board, with position and shirt number.

## Sources

- Wikipedia, List of UEFA Cup and Europa League finals (winner, runner-up, score, venue for each final).
- Wikipedia, each final's own article (`2001 UEFA Cup final` to `2026 UEFA Europa League final`): line-ups, positions, shirt numbers, managers. Fetched with `index.php?action=raw` because the API was rate-limited by other agents on the same IP.
- UEFA's match feed, `https://match.uefa.com/v5/matches?competitionId=14&seasonYear=<y>` (the final of each season; seasonYear is the start year up to 2006/07 and the end year from 2007/08) and `https://match.uefa.com/v5/matches/<id>/lineups` (starting elevens, shirt numbers, field positions and, for most finals from 2008, the coach).
- Transfermarkt, `europa-league/erfolge/pokalwettbewerb/EL` (every winner and its coach) and each final's line-up page `spielbericht/aufstellung/spielbericht/<id>` (UEFA Cup seasons are under `uefa-cup/.../pokalwettbewerb/UEFA`).

Raw pages are cached in the scratchpad under `cups_raw/EL-B/`.

## Checks

- Winners: Wikipedia list, Transfermarkt and UEFA's feed agree on all 26.
- Runners-up and scores: Wikipedia list and UEFA's feed agree on all 26.
- Winning managers: Transfermarkt and the Wikipedia final articles agree on all 26; UEFA's feed agrees wherever it names a coach. The one wrinkle is 2018: Wikipedia's line-up and UEFA's feed name German Burgos, because Diego Simeone was serving a touchline ban; Transfermarkt and every report credit Simeone as Atletico's manager. The board has Simeone, with a note for Burgos. Craig may want Burgos added as an alternative answer.
- Line-ups: for each of the 12 English sides the eleven starters and their shirt numbers agree in all three sources (Wikipedia article, UEFA feed, Transfermarkt). Positions are Wikipedia's labels, as on the Champions League line-up boards. Spellings follow `docs/data/pl_players/pl_players.csv` (every one of the 120 names is in it): Emerson (Wikipedia has Emerson Palmieri), Pedro, Pape Matar Sarr, Rasmus Hojlund.

## Boards written (`boards/`)

- el01 Winners by year (medium): `el01-2001` (2001 to 2010), `el01-2009` (2009 to 2018), `el01-2017` (2017 to 2026). Sevilla's seven titles (2006, 2007, 2014, 2015, 2016, 2020, 2023) put four into every window starting 2006, 2007 and 2011 to 2015, so those fail; the three chosen windows cover all 26 finals with a two-year overlap each. Most in one window: Sevilla 2, Atletico 3 and Sevilla 3, Sevilla 2.
- el02 Beaten finalists by year (hard): `el02-2001`, `el02-2009`, `el02-2017`, same windows. No club loses more than twice (Benfica 2013 and 2014, Man Utd 2021 and 2025, Marseille, Rangers).
- el03 Finalists, both clubs, five finals a board (medium): `el03-2002`, `el03-2007`, `el03-2012`, `el03-2017`, `el03-2022`, labelled "2002 winners" / "2002 runners-up" like the Champions League boards. 26 finals do not split into fives, so 2001 (Liverpool v Alaves) is left off these boards; it is on el01 and el02. Sevilla fill three slots in 2012 to 2016, the most on any board.
- el04 Winning managers by year (medium): `el04-2001`, `el04-2009`, `el04-2017`. Emery won five (2014, 2015, 2016, 2021 with Villarreal, 2026 with Aston Villa): three in 2009 to 2018, two in 2017 to 2026.
- el06 Most titles since 2001 (easy): Sevilla 7, Atletico Madrid 3, Chelsea 2, Porto 2, then twelve clubs on one title share the last six places as a pool. I chose since 2000/01 to keep to Craig's period rule; notes cover Inter, Juventus, Parma and Galatasaray, whose titles are older.
- el12 English and Scottish clubs in finals (easy): exactly ten clubs reached a final from 2001 to 2026, ranked by finals (Man Utd 3; Liverpool, Rangers, Chelsea 2; Celtic, Middlesbrough, Fulham, Arsenal, Spurs, Aston Villa 1), ties ordered by first final, stat gives the years and results. Arsenal's 2000 final falls before the period (noted).
- el13 Final line-ups (medium), ten outfield starters each, labelled by position, val "No. N": Chelsea 2013 and 2019, Liverpool 2016, Man Utd 2017, 2021 and 2025, Arsenal 2019, Spurs 2025 (the eight in the idea), plus Aston Villa 2026 (the latest final, which came after the idea was written) and Liverpool 2001, Middlesbrough 2006 and Fulham 2010, which were cheap to add once the sources were in hand. Celtic 2003 and Rangers 2008 and 2022 are already in the game (`spfl-xi-*`), so not repeated. Drop any of the extra four if eight is enough.

## Clubs not in clubs_all.txt (flagged)

- CSKA Moscow (2005 winners), Zenit St Petersburg (2008 winners, the spelling the game already uses in a brief), Dnipro (2015 runners-up). Braga is not in clubs_all.txt but the game already uses "Braga".

## Dropped

Nothing from my list was dropped.
