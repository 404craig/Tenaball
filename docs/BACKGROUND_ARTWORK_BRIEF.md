# Brief: competition background artwork

A task to paste into a Claude chat that has subagents and web access. It finds trophy and badge artwork for every Tenaball competition, then turns it into faint background marks. The result goes back into the game behind each competition's round header, as the Champions League starball already does in the mock-up.

## The task to paste

```
I'm building a football quiz game called Tenaball (dark purple phone screens). I need background artwork for each competition: a large, faint mark behind the header of each question, like a watermark. Please do this in two stages, using a subagent for each stage, and do not skip the checks.

COMPETITIONS (id, name, the colour at the top of its theme)
pl       Premier League           #3c1857 (purple)
laliga   La Liga                  #4a161c (dark red)
bund     Bundesliga               #351f23 (dark red-black)
seriea   Serie A                  #17235a (navy)
ligue1   Ligue 1                  #1e34ac (blue)
spfl     Scottish Premiership     #0e3067 (navy)
top5     Top 5 Leagues            #1e5740 (green). There is no single trophy or badge for this, see the note below.
ucl      Champions League         #1e2262 (night blue)
uel      Europa League            #12080a-ish dark with orange accent (#ff8a00). Not in the game yet, but design it now.
wc       World Cup                #312a14 (black and gold)
euro     Euros (European Championship)  #1a2668 (navy)

STAGE 1, a research subagent: find source artwork
For each competition find 3 candidate images of its trophy or its league badge or emblem (a mix: at least one trophy and one badge where both exist). Prefer SVG or a transparent PNG at least 1000px tall. Good places: Wikimedia Commons, Wikipedia file pages, official league and UEFA/FIFA media pages, football-logos.cc, sportslogos.net. For each candidate record: competition id, what it is (trophy or badge), the direct file URL, the page it came from, the pixel size, the licence as stated on the page, and any problem (watermark, low quality, background not transparent, clearly a fan drawing). Download the files. Do not make images up and do not use AI-generated logos. If fewer than 3 good candidates exist for a competition, say so plainly.
For top5 (Top 5 Leagues) do not search. Instead propose 3 ways to draw it from the other five leagues' artwork, for example five small badges in a row, five trophies fanned out, or the five league flags as a ring.

STAGE 2, a design subagent: turn each into a background mark
For each competition make 3 variants (one per candidate, or more varied if the candidates are similar):
  1. Silhouette: a single-colour white version of the trophy or badge on a transparent background.
  2. Outline: a thin white line-art version (outline only), so it feels light.
  3. Cropped: a large version cropped so it bleeds off the top right corner, in white.
Make every one work at about 10 to 15 percent opacity over its competition's dark theme colour. Test that by rendering each variant at 14 percent opacity on its theme colour inside a fake round header (a rounded rectangle about 360 by 200 pixels with a pill and a title on it) so we can judge it. Fix anything that looks heavy, noisy or unreadable.

PACKAGING (important)
Make one folder called competition_backgrounds with:
  - one sub-folder per competition id (pl, laliga, bund, seriea, ligue1, spfl, top5, ucl, uel, wc, euro)
  - inside each, 3 files: <id>-1.png, <id>-2.png, <id>-3.png, each 1024 by 1024, transparent background, white artwork, optimised to under 150 KB. If the source was vector, also include <id>-1.svg and so on.
  - preview_sheet.png: every variant for every competition in a grid at 14 percent opacity on its theme colour inside the fake header, labelled with the id and variant number
  - manifest.csv with the columns: id, variant, kind (silhouette, outline or cropped), source_type (trophy, badge or composite), source_url, licence, notes
  - SOURCES.md listing every source page and its licence
Then zip the folder as tenaball_backgrounds.zip.

RULES
- Never use em dashes in any text you write.
- Only real trophies and badges. No invented logos.
- Private family game use only: note that trophies and badges are trademarks and say so in SOURCES.md.
- When you finish, tell me which variant you would pick for each competition and why, in a short table, and list anything you couldn't find.
```

## How the game will use them

- Behind the header of each round intro, top right, about 130px tall, at 10 to 15 percent opacity, like the starball in the mock-up.
- Possibly larger and fainter behind the home screen logo for the currently ticked competition.
- Files are named `<id>-<variant>.png`, so the game can load them by competition id (`pl`, `laliga`, `bund`, `seriea`, `ligue1`, `spfl`, `top5`, `ucl`, `uel`, `wc`, `euro`).
