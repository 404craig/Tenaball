# Badge library

Every club badge, flag and competition logo we have, kept here so new questions, answers and teams can use them. The game itself only carries the 323 crests it needs (embedded in `index.html`); everything else waits here.

## What's in here

| Folder or file | What it is |
| --- | --- |
| `clubs_72/` | 1,538 club crests, 72 by 72, transparent, 256 colours. The size the game embeds (24pt at 3x). |
| `masters_128_plain/` | The same 1,538 crests at 128 by 128, transparent. Use these to re-make a crest at another size. |
| `flags_72/circle/`, `flags_72/rect/` | Every country flag, plus `gb-eng`, `gb-sct`, `gb-wls`, `gb-nir` and `xk`. Named by code (`gb-sct.png`). Circle is 72 by 72, rectangle 72 by 54. |
| `competitions_72/` | The Champions League starball and Europa League trophy, in white (for dark backgrounds) and the dark originals. |
| `clubs.csv`, `clubs.json` | One row per crest. `file` is the badge file, `game_name` is the name the game uses, `club` is the source's name. A `|` in `game_name` means one badge answers to two names (`RB Salzburg|Red Bull Salzburg`). |
| `flags.csv` | Flag code, country name, continent and type. |

## Naming

- File names are the game name as a slug: `man-utd.png`, `spurs.png`, `saint-etienne.png`, `inverness-ct.png`.
- `game_name` follows the game's style: short common names, no accents, no FC/AFC/SC-type prefixes or suffixes, English city names ("Steaua Bucharest", "Zenit St Petersburg").
- `name_source` is `game` when the name came from the game's own club list, and `derived` when it was written to those rules. A `derived` name may need a check when that club first appears in a question.

## Using a new club

1. Find it in `clubs.csv` and check `game_name` matches the name used in the question data. Change `game_name` here if the game's name is different.
2. Add it to the embedded set in `index.html` (`BADGE_FILE` and `BADGE_IMG`). See "Club badges" in `CLAUDE.md`.
3. Clubs with no badge keep the game's two-colour circle: Arles, Lleida, Merida and Salamanca.

## Sources and rights

Crests from football-logos.cc, luukhopman/football-logos, timurkulenovic/sports-logos and sportlogos/football.db.logos. Flags from lipis/flag-icons (MIT). Crests and UEFA logos are trademarks: fine for a private family game, not for a public or commercial release.
