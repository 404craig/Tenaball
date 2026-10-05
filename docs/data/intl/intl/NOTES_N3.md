# Internationals boards: France, Germany, Spain, Belgium, Croatia (agent N3)

Boards written (all `ranked`, `person`):

| pick | board | level |
|---|---|---|
| b01-fra, b01-ger, b01-esp | all-time top scorers | 0 |
| b02-fra, b02-ger, b02-esp | most capped, all time | 1 |
| b03-fra, b03-ger, b03-esp, b03-bel, b03-cro | top scorers since 2000 | 1 |
| b04-fra, b04-ger, b04-esp | most caps since 2000 | 1 |
| b04-bel, b04-cro | most caps since 2000 | 2 |

None dropped. No ten needed a pool: every tie falls inside the ten or wholly outside it.

## Periods

- All-time boards: every full international from the nation's first match to the 2026 World Cup final, 19 July 2026. Germany includes West Germany (the DFB's count).
- Since-2000 boards: matches from 1 January 2000 to 19 July 2026 only. Players whose careers straddle 2000 count only their games and goals from then.
- September and October 2026 games are left out. They matter for Mbappe (107 caps and 67 goals now, 106 and 66 at the cut-off), Kimmich (116 now, 114), Oyarzabal (31 goals now, 30), Lukaku, De Bruyne, Tielemans, Modric, Perisic and Kovacic.

## Sources and method

1. **Transfermarkt.** The record lists `/<nation>/rekordspieler/verein/<id>` (pages 1 to 5 by caps, 1 to 3 by goals) gave the candidates and current totals. For every candidate born in 1962 or later with 35+ caps or 8+ goals (351 players), the match-by-match record came from Transfermarkt's own data feed (`https://tmapi.transfermarkt.technology/player/<id>/performance-game`, the same data its national team pages show). Only games for the senior national team with participation "played" were counted, between the board's dates. These totals match the record lists exactly for all 351 players.
2. **national-football-teams.com.** The yearly squad pages (`/country/<id>/<year>/<Nation>.html`, 2000 to 2026) gave the candidates. Each player's page lists every match with its date and goals, and those matches were counted between the board's dates. It is an independent database.
3. **RSSSF** record international players pages (France `fran-recintlp`, (West) Germany `duit-recintlp`, Spain `span-recintlp`, each updated to November 2025). These give the all-time totals of retired players, and older players whose national-football-teams.com records are incomplete (it has only part of the pre-1980 matches).
4. The international results dataset (results.csv and goalscorers.csv, shared in the EU agent's cache) was used to identify matches where the two sources disagreed. Its goalscorers file covers only competitive matches, so it wasn't used for totals.

Every figure in each ten, and 11th and 12th, has two sources that agree.

Not usable from here: eu-football.info returns empty pages to every request (bot protection), and Wikipedia's API returned "too many requests" throughout (other agents were using it). Neither was needed.

## Disagreements and decisions

- **France v FIFA World XI, 15 August 2000** (France won 5-1 in Marseille). The French federation, RSSSF, Wikipedia's totals and Transfermarkt count it (it is in Henry's 123 caps and Trezeguet's 34 goals). national-football-teams.com and the results dataset don't, because the opponent isn't a nation. I count it, as the federation and RSSSF do. Effect: national-football-teams.com is one lower for Henry, Desailly, Zidane, Vieira, Lizarazu, Anelka and Pires, and three goals lower for Trezeguet (he scored a hat-trick). It changes no place: Vieira is 10th on the France since-2000 caps board with 89 (88 without it), five clear of 11th; Trezeguet is 6th on the since-2000 scorers with 31 (28 without it), with 24 next.
- **Germany v South Africa, 15 December 1995.** The DFB, RSSSF and national-football-teams.com count it; Transfermarkt doesn't. So Klinsmann has 108 caps and Kohler 105 (Transfermarkt 107 and 104), and Hassler 101 (Transfermarkt 100). I used the DFB figures. Klinsmann is 10th and Kohler 11th either way.
- Transfermarkt stores some older matches a day earlier (a UTC date); matches were paired allowing one day's difference. No match falls near 1 January 2000 or 19 July 2026, so the cut-offs aren't affected.

## Near misses (11th and 12th, also in each board's notes)

- France all-time goals: Djorkaeff 28, Wiltord 26. Caps: Blanc, Lizarazu and Benzema 97.
- France since 2000 goals: Pogba and Anelka 11; Govou and Pires 10. Caps: Wiltord, Gallas and Matuidi 84.
- Germany all-time goals: Fritz Walter 33, Klaus Fischer 32. Caps: Kohler 105, Mertesacker 104.
- Germany since 2000 goals: Schurrle 22; Gundogan and Kuranyi 19. Caps: Ozil 92, Rudiger 86.
- Spain all-time goals: Sergio Ramos and Di Stefano 23. Caps: Pique and Raul 102.
- Spain since 2000 goals: Xabi Alonso 16; Fabregas and Cazorla 15. Caps: Puyol 100, Villa 98.
- Belgium since 2000 goals: Wilmots and Emile Mpenza 13, Witsel 12. Caps: Kompany 89, Fellaini 87.
- Croatia since 2000 goals: Niko Kovac 14, Petric 13. Caps: Corluka 103, Brozovic 99.

## Names

Plain ASCII, with the game's spelling where `index.html` already has the player: Kylian Mbappe, Raul, Xavi, Pedro (Pedro Rodriguez), Eduardo (Eduardo da Silva), Alfredo Di Stefano, Mesut Ozil, Ilkay Gundogan. Not yet in the game, all with their common names: Bixente Lizarazu, Rudi Voller, Uwe Seeler, Fritz Walter, Klaus Fischer, Jurgen Kohler, Thomas Hassler, Emilio Butragueno, Julio Salinas, Andoni Zubizarreta, Wesley Sonck, Marc Wilmots, Timmy Simons, Darijo Srna, Stipe Pletikosa. All five nations are in `docs/data/intl/nations.txt`.

## Files

- `boards/b0*-{fra,ger,esp,bel,cro}.json`: the 16 boards.
- `N3_<code>_players.csv`: every candidate with Transfermarkt and national-football-teams.com ids and caps and goals to 19 July 2026, since 2000 and now.
- `people_N3.txt`: 301 names (each nation's top 30 all-time scorers and caps from Transfermarkt's record lists, and the top 30 since 2000 in each), so that near misses are recognised.
- Raw pages and scripts are cached in the session scratchpad (`intl_raw/N3/`).
