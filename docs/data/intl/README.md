# World Cup and Euros boards

Craig's World Cup and Euros picks (6 October 2026). Each folder holds the board JSON (`boards/`), the data the boards were worked out from (CSV) and the notes on sources, checks and decisions (`NOTES_WC.md`, `NOTES_EU.md`). `nations.txt` is every nation a board may use; the build stops on any name not in it, and a new nation also needs a row in `NATION_ROWS` and a flag in `NATION_FLAG` and `FLAG_IMG` in `index.html`.

Periods: nation boards cover every tournament (West Germany counts as Germany, the Soviet Union and CIS as Russia, Czechoslovakia as the Czech Republic, each with the old name as an alt); player boards count from the 1994 World Cup and Euro 96. Shoot-outs count as draws and shoot-out goals don't count.

Build with `python3 scripts/build-europe-records.py` from the repo root.
