# Brief: every Premier League player since 2000/01

A task to paste into the Claude chat that has web access and subagents. It gathers one dataset that lets Tenaball add two new kinds of question:

- Open boards such as "Name 10 Premier League players whose surname starts with A" (any player in the list counts).
- "Since 2000" scorer boards for every club, such as "Man Utd's top Premier League scorers since 2000/01".

When the zip comes back, give it to the Tenaball Claude Code chat to check and build from.

## The task to paste

```
I need a dataset of every footballer who has played in the Premier League since the 2000/01 season, for a family football quiz. Please use subagents and split the work so each one takes a handful of clubs (or a block of seasons), then combine and check the results. Do not skip the checks.

SCOPE
Every player who made at least one Premier League appearance (starting or as a substitute) in each season from 2000/01 to 2025/26, plus 2026/27 up to today. That is roughly 500 players a season and 26 seasons, so expect about 5,000 different players.
If 2000/01 can't be covered reliably, start from the earliest season you can cover fully (2001/02, 2002/03 and so on) and tell me which season you started from. A season is either complete for all 20 clubs or left out; never half a season.

ONE ROW PER PLAYER, PER CLUB, PER SEASON
Columns, in this order:
  season         for example 2004/05
  club           the club's short common name (Man Utd, Man City, Spurs, Newcastle, Wolves, West Brom, QPR, Sheffield Wed, Nottingham Forest, Brighton, Bournemouth and so on)
  player         the name fans use (Cristiano Ronaldo, Kepa Arrizabalaga, Son Heung-min), without accents
  full_name      full name with accents as the source spells it
  surname        the part of the name a fan would call his surname (Alexander-Arnold, van Persie, Ameobi). For one-name players (Fabinho, Rodri, Kepa), put that name here too
  position       GK, DEF, MID or FWD, as the main source groups him
  nationality    country he plays for, or was born in if he never played internationally
  apps           Premier League appearances for that club that season (starts plus substitute appearances)
  goals          Premier League goals for that club that season
  source         the page the row came from
A player who moved in January gets one row for each club.

SOURCES
Use the club season squad and statistics pages on worldfootball.net, FBref (from 2017/18 it has full stats), Transfermarkt, 11v11, the Premier League website player pages, and Wikipedia's "YYYY-YY [Club] F.C. season" pages. Check every club-season against a second source: the number of players who appeared, and the total goals (which should match the club's goals for that season, less own goals).

CHECKS (each subagent, then once more for the whole set)
- Every club-season has a row count that matches a second source, and the goals add up to the club's season total less own goals scored by opponents.
- Each season has exactly 20 clubs.
- The same player is spelt the same way in every row (one player, one name across all seasons).
- Flag anything that two sources disagree on, and which one you used.

PACKAGING
One folder called pl_players_2000 containing:
  - pl_players_2000.csv: every row, sorted by season, club, player
  - players.csv: one row per player (player, full_name, surname, position, nationality, first_season, last_season, clubs, total_apps, total_goals)
  - by_club/ with one CSV per club (all its seasons)
  - README.md: which seasons are covered, the sources used, how many rows and players, every disagreement and how it was settled, and anything you couldn't check
Then zip it as pl_players_2000.zip.

RULES
- Never use em dashes in any text you write.
- Never make up a player or a figure. If a club-season can't be checked, say so in the README and leave it out.
- When you finish, tell me which seasons are complete, how many players there are, and anything you couldn't do.
```

## What the game will do with it

- **Letter boards:** "Name 10 Premier League players since 2000/01 whose surname starts with A". Any player in `players.csv` with that surname letter counts, so the board fills in the order players are named, with a list of well-known examples shown at the end. This needs a new kind of open board in the game, which gets built when the data arrives. Letters with too few well-known players (Q, X, U and so on) are left out.
- **Since 2000 scorer boards:** each club's ten highest Premier League scorers from 2000/01, worked out from the goals column, checked against the boards researched by hand for Man Utd, Liverpool, Arsenal and Chelsea.
- **Wrong answers:** every player in the list becomes a name the game recognises, so a wrong guess gets "not on the board" instead of "not a name I know".
