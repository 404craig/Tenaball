# Game mode ideas (future)

Craig's list of possible new modes, from the modes picker artifact (https://claude.ai/artifact/RNfEATeMdq1QK6PTFLqgcB, 6 October 2026). Nothing here is agreed: each is a maybe to talk through. The plan is to take one mode at a time, make a demo artifact for it until Craig is happy, and only then build it into the game.

## Maybes (my picks to talk through)

- Hot potato: one hidden fuse per round, passed on by a right answer.
- Chess clock: a bank of time per player for the round.
- Push your luck: keep answering to build a pot, bank it or lose it on a wrong answer.
- Knockout: lives last the whole game, last player standing wins.
- Go low: a house rule where an answer scores its slot number.
- Bid for it: bid how many you can name in a row, then deliver.
- Doubles: two teams of two sharing lives and points.
- Team up against the board: everyone shares five lives to fill the board.
- Penalty shoot-out: five kicks each, each naming one exact slot.
- Higher or lower: which of two names on a board has the bigger stat, as a streak.
- Football grid: a 3 by 3 grid of clubs, name a player who played for both.
- Connections: sixteen names into four of our boards.
- What's the question?: guess the board's title from its answers.
- Easy mode for kids: four names to choose from instead of typing.
- Daily board: one board a day for everyone, with a spoiler-free share and streaks.
- Ghost challenge: send a board as a link and race the sender's ghost.

## Not for now

Power cards, speed run, closest wins, impostor, heads up, family league, draft and bingo (reasons in the picker).

## Big boards (30 or 50 answers)

Added 6 October 2026. On a phone a big board would be a compact grid of numbered tiles (5 across, 10 down for 50), and the scan would jump to the slot instead of climbing every row. The 4-slot rule would need a big-board version (for example no answer filling more than a tenth of the slots).

Ways to play (maybes): the Sporcle-style solo round against a total clock, the family against the 50 (shared lives), round the table last one standing, territory (Fastest answer wins on a big grid), tiered scoring (deeper places worth more), and a big board of the day or week. Not for now: find any ten.

Example boards and data:
- Every club to play in the Premier League: exactly 51, from `docs/data/pl_results/`.
- Premier League top 50 scorers (50th on 88, clean gap) and top 50 appearances (50th on 396), from `docs/data/pl_players/`; places below 10th need a second source.
- Each big club's top 30 Premier League scorers, same dataset (ties at 30th become pools).
- Every nation at the 2026 World Cup: exactly 48, from the World Cup agent's data.
- Every player in a club's 2025/26 Premier League squad (22 to 32 a club), from `docs/data/pl_players/`.
- England's (and the other big nations') top 30 scorers and caps, from `docs/data/intl/intl/`.
- Every Ballon d'Or winner (about 45 people), one list to check.
- Not for now: top 50 World Cup nations by games (too obscure at the bottom), and the four European leagues' top 50 scorers since 2000 (one source below the top ten).
