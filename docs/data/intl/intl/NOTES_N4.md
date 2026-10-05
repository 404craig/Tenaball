# Internationals boards: agent N4 (Italy, Portugal, Netherlands, Denmark, Sweden)

Researched 5 October 2026. Men's senior national teams, full internationals ('A' matches) only.

## Boards written (16)

| Pick | Board | Level |
|---|---|---|
| b01-ita | Italy's all-time top scorers | 1 |
| b02-ita | Italy's most capped players | 1 |
| b03-ita | Italy's top scorers since 2000 | 1 |
| b04-ita | Italy's most caps since 2000 | 1 |
| b01-por | Portugal's all-time top scorers | 0 |
| b02-por | Portugal's most capped players (10th place a pool: Rui Costa, Bruno Fernandes, 94) | 1 |
| b03-por | Portugal's top scorers since 2000 | 1 |
| b04-por | Portugal's most caps since 2000 | 1 |
| b01-ned | Netherlands' all-time top scorers | 0 |
| b02-ned | Netherlands' most capped players | 1 |
| b03-ned | Netherlands' top scorers since 2000 | 1 |
| b04-ned | Netherlands' most caps since 2000 | 1 |
| b03-den | Denmark's top scorers since 2000 | 1 |
| b04-den | Denmark's most caps since 2000 (10th place a pool of five on 81) | 2 |
| b03-swe | Sweden's top scorers since 2000 | 1 |
| b04-swe | Sweden's most caps since 2000 | 2 |

None dropped.

## Periods

- All-time boards: every full international from the nation's first game to 19 July 2026 (the 2026 World Cup final). Period line "All full internationals to 19 July 2026".
- Since-2000 boards: 1 January 2000 to 19 July 2026, counting only games and goals from 2000 on for players whose careers straddle 2000. Period line "Full internationals from 1 January 2000 to 19 July 2026".
- Games after 19 July 2026 are left out. By 5 October 2026 all five had played Nations League games in late September, and some in early October. Sources updated since then (Transfermarkt, Wikipedia) were adjusted by taking those games off; see below.
- Where each nation's last game before 19 July 2026 was: Italy 7 June (friendly in Greece; Italy went out in the World Cup play-off final in Bosnia on 31 March), Denmark 7 June (friendly v Ukraine; went out in the play-off final in the Czech Republic on 31 March), Portugal 6 July (World Cup quarter-final v Spain), Netherlands 30 June (round of 32 v Morocco), Sweden 30 June (round of 32 v France).

## Sources

1. **national-football-teams.com** (NFT): one page per nation per year (`/country/<id>/<year>/<Nation>.html`, ids Italy 92, Portugal 148, Netherlands 129, Denmark 51, Sweden 179), each listing every player's games (starts and sub appearances) and goals that year, split into FIFA and non-FIFA games. All 27 years (2000 to 2026) were downloaded for each nation and summed per player. This is the match-by-match count for the since-2000 boards. Its 2026 page runs to the first September 2026 game, which was taken off using that game's NFT match report (line-ups and scorers).
2. **Transfermarkt**: record caps and record scorers lists (`/rekordspieler/verein/<id>`, sorted by goals for scorers), and match reports (`/spielbericht/index/spielbericht/<id>`) for every 2026 game of the five nations, both before 19 July (32 reports) and Sweden's four autumn 2026 games. NFT and Transfermarkt agree player by player on every 2026 game before 19 July (raw data in `N4_2026_to_19jul_apps_goals.csv`).
3. **RSSSF** record international players pages: `ital-recintlp` (last match 7 June 2026, so complete to the cut-off for Italy), `port-recintlp` (to 16 November 2025), `ned-recintlp` (to 17 November 2025), `den-recintlp` (to 7 June 2026, complete for Denmark). There is no RSSSF page for Sweden.
4. **Wikipedia**: records and statistics pages (Italy, Portugal), List of Sweden international footballers (updated 5 October 2026), and the "appearances and goals by national team and year" tables in player articles for every player whose career straddles 2000 and for every disagreement. Fetched with `action=raw` because the API was rate-limited.
5. eu-football.info returned empty pages from this machine, so it could not be used.

## Method

- All-time boards (Italy, Portugal, Netherlands): RSSSF totals, plus each player's 2026 games to 19 July from NFT and Transfermarkt where RSSSF stops in November 2025, checked against Wikipedia's records page (Italy, Portugal) and Transfermarkt's record lists (all three).
- Since-2000 boards: NFT year pages summed from 2000. For each player in the ten and 11th and 12th: if he started in 2000 or later, his NFT total must match RSSSF's (or for Sweden, Wikipedia's list's and Transfermarkt's) career total plus 2026; if he started earlier, his NFT figure from 2000 must match the year table in his Wikipedia article. Results of that check for straddling players: Buffon 164, Cannavaro 105, Zambrotta 95, Nesta 56, Totti 49 caps; Inzaghi 19, Del Piero 17, Vieri 13 goals; Pauleta 77 caps and 44 goals, Figo 70 and 20, Nuno Gomes 71 and 29, Simao 84 and 21, Rui Costa 46 and 9, Sergio Conceicao 36 and 10; Van Bronckhorst 92, Van der Sar 87, Frank de Boer 40 caps, Van Nistelrooy 34 and Kluivert 23 goals; Thomas Sorensen 100, Tomasson 97 and 46, Ebbe Sand 45 and 17, Martin Jorgensen 80 and 9; Svensson 147 (see below), Henrik Larsson 60 and 27, Allback 73 and 30. All matched NFT except where listed under disagreements.

## FIFA versus association counts

NFT marks some games as non-FIFA. Which count each association uses was settled by checking against RSSSF and Wikipedia:

- **Italy, Portugal, Netherlands, Sweden:** the federations (and RSSSF, Wikipedia) count those games, so NFT's FIFA and non-FIFA games are added together. Italy: one 2006 game (Buffon, De Rossi, Cannavaro, Zambrotta each one short in NFT's FIFA column). Portugal: friendlies in 2007, 2008 and 2010 (Ronaldo, Moutinho, Pepe, Nani, Bruno Alves one to three short without them). Sweden: January tour games (Allback 30 goals, Berg 24 with them; 29 and 23 without).
- **Denmark:** the DBU does not count the January tour games against league selections in 2000, 2012 and 2013 that NFT marks non-FIFA (Cornelius has 9 goals in RSSSF and Wikipedia, 13 with those games; Rommedahl 126 caps, 127 with them). Denmark's boards use NFT's FIFA games only.

## Disagreements and decisions

- Belotti (Italy goals since 2000): NFT 13, RSSSF and Wikipedia 12. Used 12; he is 11th. With 13 he would have tied for 8th.
- Donnarumma (Italy caps): RSSSF and NFT 83 at 19 July 2026; Transfermarkt higher (it includes autumn 2026). Used 83.
- Eusebio (Portugal goals): RSSSF and Wikipedia 41, Transfermarkt 42. Joao Vieira Pinto: RSSSF and Wikipedia 23, Transfermarkt 22. Used 41 and 23 (FPF count). With 22, Joao Pinto would share 10th with Nene and Simao.
- Bruno Alves (Portugal caps): RSSSF, Wikipedia and NFT 96, Transfermarkt 95. Used 96.
- Nani (Portugal goals): RSSSF and Wikipedia 24, NFT 23. Used 24 (6th either way).
- Depay (Netherlands goals): RSSSF, Transfermarkt and Wikipedia 55, NFT 54. Used 55.
- Van Dijk (Netherlands caps): RSSSF 88 to November 2025 plus 8 in 2026 = 96; NFT 96. Transfermarkt's current figure includes autumn 2026.
- Dolberg (Denmark goals): RSSSF 13, NFT and Wikipedia (year table and infobox) 12. Used 12. The same ten names fill the board either way.
- Lars Jacobsen and William Kvist (Denmark caps): NFT 87 and 84, RSSSF and Wikipedia 81 each. Used 81. Five players share 10th on 81 (Bendtner, Christensen, Delaney, Jacobsen, Kvist), so the 10th place is a pool; Martin Jorgensen is next on 80.
- Yussuf Poulsen (Denmark caps): RSSSF and his Wikipedia infobox 86, NFT 85 FIFA games plus one January 2013 game, his Wikipedia year table 87 (counting that game). Used 86; he is 9th on any count.
- Anders Svensson (Sweden caps since 2000): Swedish FA and Wikipedia 148 in all, one in 1999, so 147 from 2000 (his Wikipedia year table agrees); NFT 146 from 2000 (one short in 2011) and Transfermarkt 147 in all. Used the association's 147; he is 1st either way.
- Elmander (Sweden goals): Transfermarkt 18, Wikipedia (list and year table) and NFT 20. Used 20.

## Ties inside the ten

Ties that sit wholly inside the ten are listed one after another with consecutive labels (no pool needed), for example Italy's scorers (Baggio and Del Piero 27; Altobelli, Baloncieri and Inzaghi 25; Graziani and Vieri 23).

## Names

Plain ASCII, the game's spelling where the player is already in index.html: Dirk Kuyt (not Kuijt), Seb Larsson (the game's name for Sebastian Larsson), Freddie Ljungberg, Zlatan Ibrahimovic, Kim Kallstrom, Marcus Allback, Viktor Gyokeres, Simon Kjaer, Thomas Sorensen, Pierre-Emile Hojbjerg, Luis Figo, Nani, Pepe, Pauleta, Nuno Gomes, Klaas-Jan Huntelaar, Ruud van Nistelrooy, Johan Cruyff, Marco van Basten.

New names (not yet in the game): Gigi Riva, Giuseppe Meazza, Silvio Piola, Alessandro Altobelli, Adolfo Baloncieri, Francesco Graziani, Dino Zoff, Giacinto Facchetti, Sandro Mazzola, Eusebio, Simao (Simao Sabrosa), Joao Pinto (Joao Vieira Pinto, 1991 to 2002; not the 1980s defender of the same name, who has 70 caps), Fernando Couto, Rui Costa, Bruno Alves, Faas Wilkes, Abe Lenstra, Beb Bakhuys, Phillip Cocu, Joris Mathijsen, Thomas Delaney, Kasper Dolberg, Soren Larsen, Marcus Berg, Mikael Lustig, Viktor Claesson.

Name to watch: **Nene**. The game already has "Nene" (the Brazilian forward). Portugal's Nene (Tamagnini Nene, 22 goals, joint 11th) appears only in a note on b01-por and in people_N4.txt; if the dictionary treats them as one person that is harmless, but they are different players.

All five nations are in `docs/data/intl/nations.txt`.

## Files

- `boards/b01-ita.json` to `boards/b04-ned.json`, `boards/b03-den.json`, `boards/b04-den.json`, `boards/b03-swe.json`, `boards/b04-swe.json`.
- `N4_<nation>_since2000_nft.csv`: every player's caps and goals from 1 January 2000 to 19 July 2026 summed from NFT (FIFA and non-FIFA together), the 2000 to 2025 part, and NFT's FIFA-only totals (these last two columns still include the first September 2026 game).
- `N4_2026_to_19jul_apps_goals.csv`: each player's 2026 games and goals to 19 July from NFT and from Transfermarkt match reports, side by side (a blank Transfermarkt cell is a name spelt differently there, not a missing game).
- `people_N4.txt`: top 30 all-time caps and scorers for all five nations (Transfermarkt record lists) and top 30 since 2000 in each (NFT), 338 names.

Raw pages are cached under the session scratchpad (`intl_raw/N4/`).
