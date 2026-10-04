# Question ideas

Questions Craig wants added, waiting for data to be sourced. The rules in `CLAUDE.md` apply to every one: exactly 10 answers, no answer filling 4 or more slots, Premier League era only (from 1992/93) for player and club data, a date line on every board, and only data checked against a source.

When one is built, move it to the "Built" list at the bottom with the date.

## Premier League

Ideas the player dataset (`docs/data/pl_players/`) can still answer:

| Idea | What the data gives |
| --- | --- |
| Top scorers and most appearances for more clubs: Southampton, Leicester, Crystal Palace, Fulham, Blackburn, Leeds, Sunderland, Bolton, Middlesbrough, Brighton, Wolves, Stoke, West Brom, Bournemouth, Nottingham Forest | Most are clean; a few need a pool at 10th (Stoke and Burnley). Easy for the club's fans, hard for everyone else. |
| Played for the most Premier League clubs | Marcus Bent 8; Cole, Bellamy, Crouch, Ben Haim and Routledge 7; then a big pool on 6. |
| Scored for the most Premier League clubs | Bellamy 7, then ten players on 6 (a pool for nine places). |
| Clubs with the most Premier League seasons | Exactly ten clubs on 29 or more: the six ever-presents on 34, Newcastle and Villa 31, West Ham 30, Man City 29. |
| Best single season for a club (each player once) | Man Utd: Ronaldo 31, Rooney 27, Van Persie 26. Needs each player once, or Henry, Kane, Aguero and Haaland fill too many slots. |

Ideas that need new data:

- Youngest and oldest players and scorers: the dataset has no dates of birth.
- Penalties, assists by club, clean sheets by club, red cards: no match events in the dataset.
- Own goals: the dataset leaves them out.

The full list of 233 researched Premier League ideas (October 2026), with sources and checks, is in the question picker artifact. Craig marked them on 3 October 2026: 119 liked, 114 dropped. The liked ones are below, grouped by where the data comes from, which is also the build order. Craig's comments are in quotes. "Hard" in a comment means set the board's level to hard.

### Picked, batch 1: our player dataset and the game's own tables (no research needed). Built 3 October 2026, except most defeats and fewest wins in a season, which need every result, so they move to batch 2

- One-club men: most appearances, and most goals, for players who only played for one Premier League club.
- Best goals-per-game ratio (200+ games).
- Most seasons scoring 10+ goals; most seasons scoring 15+.
- Most consecutive seasons with a goal (Giggs 21).
- Most seasons as a club's top scorer.
- Most appearances by a defender, a midfielder, a forward.
- English top scorers for Man Utd, Liverpool, Arsenal and Chelsea.
- Played for the most Premier League clubs; scored for the most. "Hard."
- Clubs with the most Premier League seasons.
- Clubs that have used the most players; fielded the most nationalities; most and fewest players used in a season.
- Nationalities with the most players at a club (France at Arsenal and so on).
- Most goals in a season by a midfielder. "Remove Salah and include a 10th player." (Go by a player's career position, so Salah counts as a forward.)
- Best single season for each big club (each player once).
- The 100-goal club and the 500-game club (open boards).
- More two-club open boards (pairs with 15+ shared players). Three-club boards: only seven players have played for three of the big six, so that one can't be an open board.
- Most appearances for the big clubs since 2000/01 (only where the ten differ from the all-time board).
- Most appearances by a non-British or Irish player, per club.
- Top scorers by continent: Africa and South America. "Do you also have the other continents?" Yes: Europe outside the UK and Ireland (Henry 175, Van Persie 144, Hasselbaink 127, Anelka 125, Lukaku 121, Haaland 112) and North and Central America (Yorke 123, Antonio 68, Jimenez 68, Dempsey 57, Euell 56, Hernandez 53, Wanchope 50) are clean tens. Asia and Oceania tail off into little-known names after five or six (Asia's 10th has 8 goals), so leave them out.
- Top scorers from the home nations outside England, together.
- Most top-four finishes; most top-six; most consecutive seasons; most seasons without winning the title; yo-yo clubs (promotions plus relegations); most bottom-half finishes.
- Fewest points in a season; relegated with the most points; survived with the fewest points; most defeats; fewest wins. "Hard" on the first three.
- Best finish by a promoted club, by season.
- The champions' top scorer, by season (ten-season blocks). "Hard."
- Club position open boards, from Craig's comment on the shirt-number idea: "do eg Liverpool forwards, Newcastle forwards, Arsenal forwards. Top 10 clubs for forwards, midfielders and defenders as open boards. Probably easy for the top six, then medium outside that." Thirty boards (ten clubs, three positions).
- Not building: top scorers for 15 more clubs as single-club boards. "Happy if it's one team and their top scorer on a board of other teams, not a board of only that club's 10 top scorers." That's already in the game as the club record scorers board, which now covers all 51 clubs.

### Picked, batch 2: computed from every Premier League result (engsoccerdata and football-data.co.uk), checked against Wikipedia's records page

- Most defeats and fewest wins in a season (moved from batch 1: the game's tables hold points, not results).
- Biggest Premier League wins. "Unsure how we'd display this well within the answer pill." Plan: the answer is the winning club (badge and name, as on every club board) and the stat on the right shows the score and opponent, for example "9-0 v Ipswich, 1995".
- Fewest goals conceded, most clean sheets, most goals conceded, fewest goals scored, best goal difference and worst goal difference, each in a season. Worst goal difference: "Hard."
- Longest unbeaten, winning, losing and winless runs; longest home unbeaten run; most consecutive clean sheets.
- Most wins over the big six by clubs outside it. "Needs number of wins if we can calculate them." Yes, the wins are the stat.

### Picked, batch 3: Wikipedia lists (can be fetched in full from the build machine)

- PFA Players' Player of the Year by season; PFA Young Player by season ("more recent years"); Premier League Player of the Season by season; most Player of the Month awards.
- Golden Glove by season (2016/17 to 2025/26); most Golden Gloves.
- Most Manager of the Month awards; most Manager of the Season awards.
- FA Cup winners by season; League Cup winners by season (the clean windows only).
- Most hat-tricks for one club; most hat-tricks in a season; scored four or more in a game (open board); most goals without ever scoring a hat-trick (with our dataset).
- Clubs that moved to a new ground; longest single spells as manager; most games by foreign, Scottish, Italian and Spanish managers.
- Most winners' medals; won the title with two clubs; title-winning captains.
- World Cup winners, Euros winners, Premier League plus Champions League winners and Premier League plus La Liga winners, each ranked by Premier League appearances from our dataset.
- Merseyside, Manchester and North London derby top scorers.

### Picked, batch 4: published lists found by search (Opta's The Analyst, the Premier League site, BBC, Sky)

- Most assists; most assists in a season (each player once); most goals and assists combined; most assists for each big club; most assists by a defender, all time and in a season; the 50 goals and 50 assists club (open board).
- Most clean sheets; most clean sheets for one club; most penalty saves.
- Most red cards; most yellow cards; most own goals.
- Fastest hat-tricks; perfect hat-tricks (open board).
- Longest scoring streaks; most minutes played.
- Most goals as a substitute ("Hard"); most headed goals; most direct free kicks; most goals from open play; scored against the most different clubs.
- Most points and most defeats as a manager.
- Highest average attendances 2025/26; biggest grounds.
- Most expensive British players; most expensive teenagers; record signing of each season ("only for the most recent 10 years"); biggest sales abroad.
- Man Utd's number 7s and Newcastle's number 9s (open boards).

### Picked, batch 5: only if the data can be found

- Most goals in a calendar year ("if we can get the data").
- Most goals from outside the box (only the top four are published).

### Dropped

The 114 ideas Craig dropped stay in the picker artifact for reference.

## International football

A new competition for the home screen (an "Internationals" group, with its own theme, watermark and `--topc` like any other). Lists come from Wikipedia's national-team record pages (which can be fetched from the build machine) and RSSSF. Craig to decide the period rule: caps and goals are career figures, so most of these would be all time rather than from 1992, the same way the World Cup and Euros team boards already cover every tournament.

| Idea | Notes |
| --- | --- |
| Most caps for each home nation: England, Scotland, Wales, Northern Ireland, Republic of Ireland | Five boards. England: Shilton 125, Rooney 120, Kane, Beckham, Moore. Wikipedia lists are complete and current. |
| Top scorers for each home nation | Five boards. England: Kane, Rooney 53, Charlton 49, Lineker 48. Wales: Bale 41, Rush 28. Ireland: Robbie Keane 68. Northern Ireland: Healy 36. Scotland: Law and Dalglish 30. |
| Most caps and top scorers for the big European nations | Germany, France, Spain, Italy, Netherlands, Portugal, Belgium, Croatia, Denmark, Sweden, Norway. Two boards each (caps, goals). Portugal: Ronaldo tops both. |
| Most caps and top scorers in world football | Ronaldo, Messi, Ali Daei, Chhetri and so on. The world caps board is full of lesser-known names (Bader Al-Mutawa, Soh Chin Ann), so maybe goals only, or Europe only. |
| Most matches as captain for each home nation | England: Kane, Wright, Moore, Robson, Beckham. Lists exist for each nation. |
| International managers by games in charge | England: Winterbottom, Ramsey, Southgate, Robson, Greenwood. Also Scotland, Wales, Ireland. |
| World Cup all-time top scorers | Klose 16, Ronaldo 15, Muller 14, Mbappe, Messi, Fontaine. Not in the game yet (the World Cup boards are all teams). Check the 2026 tournament's goals are added. |
| Euros all-time top scorers | Ronaldo 14, Platini 9, then Griezmann, Shearer, Kane. |
| Most World Cup appearances (player) | Messi 26, Matthaus 25, Klose 24, Maldini 23. |
| Most World Cup tournaments played (player) | Ronaldo and Messi on 6 after 2026, then a pool on 5. |
| England's top scorers at major tournaments (World Cup plus Euros) | Kane, Lineker 10, Shearer 9, Rooney, Hurst, Owen. |
| Players with the most England caps who never played at a World Cup | Niche; check a list exists before building. |
| Most international caps by a Premier League player while at a PL club | Hard to source; probably drop. |
| Nations League winners, Copa America winners, Africa Cup of Nations winners by year | Year-labelled boards like the World Cup winners. Copa and AFCON go back far enough for clean ten-year windows; check the 4-slot rule (Egypt, Uruguay, Argentina). |
| Ballon d'Or winners by year | Year-labelled; Messi (8) and Ronaldo (5) mean only some windows pass. |

## Game modes

Designs agreed with Craig on 4 October 2026, mocked up in the modes artifact (https://claude.ai/artifact/A4BxSUqCxqRjY4gy6z6zcT). Not built yet.

### Home screen: three doors

- Keep the logo, the "Tenable: Football Edition!" subtitle and the cyan line exactly as now. Below them, three doors: **Play solo**, **H2H on this phone** and **H2H online**. Each door has a large glowing ring icon in its own colour with a softly tinted symbol inside (green ring and a player for solo, pink ring and a group of players for H2H on this phone, blue ring and a globe for H2H online), as in Craig's mock-up; no coloured edge on the doors. Door descriptions: Play solo "Beat your best score and complete more boards."; H2H on this phone "2 to 4 players. Pass and play."; H2H online "Play on separate phones. 3 game modes." Smaller line icons in the logo's cyan-to-green are used for the game modes (Take turns is a pair of circular arrows, First touch a lightning bolt, Beat the clock a stopwatch).
- Each door opens its own settings, laid out like today's home screen panels (Who's playing, The game, House rules) and changed as little as possible: solo has your name; head to head on this phone has 2 to 4 players and names; online has your name and the game mode, then create a game or join with a code.
- Only the online door offers the new modes. For First touch and Beat the clock the shot clock is replaced by a time limit per round (30, 60 or 90 seconds).
- A tab bar along the bottom with three tabs (no Play tab): **Stats** (the stats page), **Share** (the phone's share sheet with the game link, or copy it, without starting a game) and **Account** (sign in, name, PIN, sign out).

### Who goes first

- For H2H on this phone and online Take turns: the players' pills (the same size as board rows) shuffle, a blur of names at first, then slowing swap by swap until they settle into a random order; the top pill glows in its player's colour. About five seconds; a tap skips to the result. The order is final: no reshuffle.
- Each round then starts one place further down the order, as now. Online, the host's phone draws the order and sends it with the first move so every phone shows the same result (keep the apply functions free of randomness).

### First touch (was "Race the board")

Description: "Race against your friends to fill each slot first." Everyone plays the same board at the same time, with no turns; the first right answer to reach the server claims the slot, and it's then gone for everyone else. Wrong answers still cost a life (a yellow card), and three gone is a red card. The round ends when the board is full, everyone is out, or the time limit runs out. Scoring: a point for every slot claimed, the last one included (no last-slot bonus), and a bonus point for winning the round (most slots; players level on most slots each get it).

- A claimed slot fills with the finder's colour as a gentle gradient that stays close to that colour (cyan into aqua, two yellows, two greens, lilac into purple with a touch of pink). The player dots under the board are solid colours. The rest of the board (background, chip, watermark) keeps the competition's design.
- "Too slow" message when someone else got there first, with no card. The server's move order decides ties, so every phone agrees.
- The clock sits bottom right, where the shot clock is now. Slots stay the game's usual 46px rows.

### Beat the clock

Everyone gets their own copy of the same board and the same time limit. Empty slots stay blank. When someone else finds a slot, their name appears in a small pill of their colour where the answer would go, and the stat shows on the right, but the answer stays hidden. When you find it, it becomes your full colour pill, with no other names on it. The host's phone sends "time up" so everyone stops at the same point in the move log. At time up the board becomes one results grid: every answer down the side, a column per player (headed in their colour) with a filled dot where they found it and an empty ring where they didn't, a star where only one player found it, greyed rows nobody found, and each player's points at the bottom. Scoring: 1 point an answer, 2 for an answer nobody else found. The most points wins. The key under the grid is one line ("✓ 1 point · ★ only one player found it: 2 points").

### End of a round (First touch and Beat the clock)

A sheet slides up over the bottom of the board. Each player gets a full colour pill (their gradient), in order of total points, showing their points this round and their running total, with a crown for the round's winner. Under it the host has Next round (Final scores after the last round); everyone else sees an outlined "Waiting for Craig to start…" pill. A small ✕ in a see-through circle at the sheet's top right slides it down to a bar so the finished board can be seen while waiting; tapping the bar brings the points back.

### My stats (reworked)

Opened from My stats on the home screen and from the link at full time. A filter along the top: All, Solo, H2H phone, H2H online, First touch, Beat the clock. Sections:

- Headline: games, wins, win rate and points (solo: games, best score, average, points).
- Boards: boards played, Tenables (full boards) with a percentage, and one bar of all the slots on the boards you played: found by you, found by others, found by nobody, each with a percentage.
- Answers: right and wrong with percentages, passes, time-outs, yellow and red cards.
- Personal bests: best game, best round, longest run of right answers, plus mode records (first touches, beaten to it and quickest claim in First touch; most slots in a round and answers nobody else found in Beat the clock).
- Boards completed: overall (completed out of played) and for each competition, under every filter including Solo and H2H; Compare shows both players' completed boards by competition side by side.
- Accuracy by competition and by difficulty; head-to-head records against each opponent; the last 10 results; badges to chase.
- Share my stats (a stats card, like the results card) and Compare (you against a friend, side by side).
- Reset my stats at the bottom, with an in-page confirm step ("can't be undone"); afterwards the page shows zeros and "your stats start again with your next game".
- Who you can compare with: no open friend search or requests. You can only add someone you've played online: after each online game the server saves who each signed-in player played, the stats page lists your last 10 signed-in opponents under "Played online recently", and a star keeps someone as a friend at the top. Players without an account are listed under "On this phone" from the local stats. Server work: a played-with list per account (updated when a game ends), a starred list, and a read of a friend's summary stats.
- Needs the game to record more per round: mode, competition, difficulty, slots found by others and by nobody, opponents. Older games keep their totals only.

### Sharing the new modes

The Share button keeps sending a picture and a message together.

- Picture (1080 by 1350, as now): just the final table. Each player as a full colour pill in their own colours with their points, the winner on top with the game's black line crown (drawn, not an emoji), then the settings line, "Think you can beat …?" and the link. No last-round board.
- Message: short, like today's: the mode, who won and with how many points, the banter line, and the challenge with the link. No coloured squares.

### Playing a bot

No fourth door: a bot is another kind of player. Play solo gets an Opponent choice (Nobody, or TenaBot at Easy, Medium or Hard; you take turns with it). In H2H on this phone every seat after the first has a Bot switch, with one bot level for the game. The bot answers after a short "thinking" pause, finds answers at a rate set by its level (deeper places are harder for it), and sometimes gives a near miss from the board's notes, so it can get cards too. Bot moves are worked out on the phone that's playing, so online play is unaffected. Games against a bot count in stats under their own filter and don't change your win rate against people.

## Other competitions

Carried over from `CLAUDE.md`:

- Club top-10 league scorers for 10 clubs in each of La Liga, Bundesliga, Serie A, Ligue 1 and the Scottish Premiership, from season-by-season player stats (for example FBref), working back from 2025/26 and stopping where data can't be verified.
- Player records (hat-tricks, fastest to 50 and 100 goals, 20-goal seasons, single-season highs), managers and transfers, per competition.

## Built

- October 2026 (4th): World Cup and Euros final line-ups, the ten outfield starters for each finalist in the last four of each (16 boards).

- October 2026 (4th): Champions League final line-ups, the ten outfield starters for each finalist from 2017 to 2026 (20 boards).
- October 2026 (4th, Aiden's idea): Ballon d'Or boards under Top 5 Leagues: most wins, winners 1993 to 2002 and 2002 to 2011, and the top ten of the 2022 to 2025 votes (hard). Next: the 2026 vote after 26 October, and winners 2016 to 2026.

- October 2026 (3rd, batches 2 to 5 of Craig's picks): 77 more records boards and 4 open boards. Season and run records from every result (batch 2); awards, cups, hat-tricks, managers, medals, captains (open board), new grounds, winners of the World Cup, Euros, Champions League and La Liga ranked by Premier League games, and the three big derbies' top scorers (batch 3); scoring streaks, minutes, sub, headed, free-kick, open-play and long-range goals, scored against the most clubs, keepers and cards, assists (best season, goals plus assists, the 50 and 50 club), manager points and defeats, crowds, grounds, British and teenage fees, record signing each season, sales abroad, and Man Utd's 7s and Newcastle's 9s (batch 4). Left out: goals in a calendar year (only nine players could be verified), club and defenders' assists (one source below the top few places), and Newcastle's 9s before 1995 (eleven players, one too many). Two-club champions became a ranked board (eleven names is too few for an open board).

- October 2026 (3rd, batch 1 of Craig's picks): 66 boards from the player dataset and the game's tables, plus 41 open boards (the 100-goal and 500-game clubs, forwards, midfielders and defenders for ten clubs, and nine more two-club pairs).

- October 2026 (3rd, second batch, Craig's picks): Everton's biggest signings; top English scorers; top scorers for ten more countries and most appearances for fifteen (well-known players only, plus Scotland at Craig's request); top scorers since 2000/01 for Spurs, Newcastle, Everton, West Ham and Villa; top scorers and appearances by decade; countries with the most Premier League players; club open boards (surname letters at a club, and played for two clubs); most games as a manager; most penalties scored; most relegations and most promotions.

- October 2026 (3rd): from Craig's new boards document (`docs/data/Tenaball_new_boards_2026-10-03.md`): most appearances for each of 10 clubs; top scorers for France, the Netherlands, Scotland, the Republic of Ireland and Wales; top scorers and most appearances from outside England; most appearances by a goalkeeper; most seasons at one club; most goals by a defender and by a midfielder; biggest signings for nine clubs (Everton waits); and club record scorers for all 51 Premier League clubs.

- October 2026: every Premier League player since 1992/93 is in the game (Craig's dataset), and 22 surname-letter boards use it. Next from the same data: top scorers since 2000/01 for the other clubs, and appearances boards per club (the most-appearances idea above).

- October 2026: top Premier League scorers since 2000/01 for Man Utd, Liverpool, Arsenal and Chelsea. The rest of the clubs wait for the every-player dataset (`docs/PLAYER_DATABASE_BRIEF.md`), which also unlocks surname-letter boards.

- October 2026: twenty Premier League records boards from Craig's workbook (managers' wins, win rate and clubs managed; biggest single seasons; most 20-goal seasons and five every-20-goal-season boards; hat-tricks; fastest to 50 and 100; most seasons played; biggest signings, by position and club records). Sources and checks in `docs/PL_RECORDS_SOURCES.md`. Still to do from this list: most Premier League games as a manager, and record signings for each of the 10 clubs (their ten biggest buys).

- September 2026: club record scorers now draw a fresh 10 clubs each time (from the 20 checked so far).
- September 2026: most Premier League titles as a manager (`pl-at-mgr-titles`) and every club to finish in the top two (`pl-at-top2`), in place of sliding windows that broke the 4-slot rule.
