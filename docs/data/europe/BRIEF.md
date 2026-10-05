# Brief for the La Liga, Bundesliga, Serie A, Ligue 1 and Top 5 boards (October 2026)

Tenaball is a Tenable-style football quiz: each board has exactly 10 answers. You are gathering verified data for boards Craig picked. Read this whole brief.

## Rules (Craig's, keep these)
- **Period:** every "since" or all-time board covers league seasons **2000/01 to 2025/26 only**. Count nothing from before 2000/01 (for example titles, goals or games from 1999/00 or earlier don't count). Cups and awards by year run from the 2000/01 season (the 2001 final) to 2025/26 (the 2026 final).
- **Last season:** figures stop at the end of 2025/26 (May 2026). Transfer fees may run to the end of the summer 2026 window (1 September 2026).
- **Two sources:** only verified data. Every figure needs two sources that agree, or one source plus an internal check (for example a club's player goals adding up to its goals in the table). If you can't verify a board, don't produce it; say why in your notes file.
- **Ten answers:** every board has exactly 10 slots. A tie across 10th place becomes a pool: the tied names share the places left, and any of them fills one.
- **The 4-slot rule:** no single answer may fill 4 or more slots on a board. For year-by-year boards, pick ten-year windows that pass; if none pass, drop the board.
- **No em dashes anywhere** (in board text, notes or docs).
- **Names:** plain ASCII with no accents (Mbappe, Muller, Lewandowski, Kvaratskhelia, Joao Felix), as commonly known in English football (Vinicius Junior, Kylian Mbappe). One spelling per player.
- **Clubs:** the game's own names, listed in `docs/data/europe/clubs_<league>.txt` (laliga, bund, seriea, ligue1). For example Bayern Munich, Gladbach, AC Milan, Inter, PSG, Atletico Madrid, Athletic Bilbao, Deportivo, Real Betis, Saint-Etienne. If a club isn't on the list (a newly promoted club), use its common English name and flag it in your notes.

## Sites
- **Transfermarkt:** works with curl and a desktop browser User-Agent ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36').
  - Club season stats: `/<club-slug>/leistungsdaten/verein/<id>/plus/1?reldata=<COMP>%26<startyear>`, where COMP is ES1, L1, IT1 or FR1 and startyear 2010 means 2010/11. These pages list every player's league appearances, goals and assists.
  - League table: `/<league-slug>/tabelle/wettbewerb/<COMP>/saison_id/<year>`.
  - Record signings: `/<club>/transferrekorde/verein/<id>`.
  - Record sales: `/<club>/rekordabgaenge/verein/<id>`.
- **Wikipedia:** use the API (`https://en.wikipedia.org/w/api.php?action=parse&page=...&prop=wikitext&format=json&formatversion=2`, URL-encode en dashes as %E2%80%93) with a User-Agent like 'Mozilla/5.0 (TenaballResearch; github.com/404craig)'. It rate-limits: wait at least 3 seconds between requests and back off 30 seconds or more on a "too many requests" reply.
- **football-data.co.uk:** every result per season, as CSV: `https://www.football-data.co.uk/mmz4281/<yy><yy>/<DIV>.csv` with DIV SP1, D1, I1 or F1 (for example 2526/SP1.csv). Good for working out tables and points.
- **Blocked from this machine:** FBref, worldfootball.net and 11v11.
- **Politeness:** wait at least 1.5 seconds between requests to any one site. Cache raw pages under `/tmp/claude-0/-home-user-Tenaball/1942e5b7-4590-54e0-9256-57174477852b/scratchpad/euro_raw/<yourname>/`.

## Output
Write one JSON file per board to `docs/data/europe/<league>/boards/<pick>.json` (league = laliga, bund, seriea, ligue1 or top5; pick = the id in brackets in your list, such as es07):

```json
{"pick": "es07", "kind": "ranked", "type": "person", "level": 0,
 "title": "La Liga top scorers since 2000", "brief": "Name the ten players with the most La Liga goals since 2000/01.",
 "period": "League seasons 2000/01 to 2025/26",
 "rows": [{"label": "1", "name": "Lionel Messi", "val": "474 goals"}, ...],
 "notes": {"Some Name": "Some Name is 11th with 140, just outside."},
 "sources": ["https://..."], "checks": "How each figure was checked against a second source."}
```

- **kind:**
  - `ranked`: labels "1" to "10".
  - `labelled`: labels are years or seasons ("2005/06") or positions.
  - `open`: no rows; give `names` (every right answer) and `examples` (the ten best known, in order). Any listed name fills from 10th up.
- **type:** `person` or `club`.
- **level:** 0 easy, 1 medium, 2 hard. Use the level in your list.
- **Pools (a tie at the cut):** write one row per shared place, each with the same `"pool": "<short key>"` and `"alts": [all tied names]`, and the same `val`.
- **Shared award (two names one year):** one row with `"alts": [both names]`.
- **Notes:** give near misses (11th and 12th) so wrong answers get a helpful note.
- **Brief:** says exactly what to name. The title is short.
- **Raw data:** put any CSVs you build in `docs/data/europe/<league>/`.
- **Notes file:** write `docs/data/europe/<league>/NOTES_<yourname>.md` with sources, method, checks, disagreements and boards you dropped.

Don't edit index.html and don't commit. When done, report briefly: boards written, boards dropped and why, and anything uncertain.
