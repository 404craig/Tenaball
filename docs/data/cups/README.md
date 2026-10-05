# Champions League and Europa League boards

Craig's Champions League and Europa League picks (5 and 6 October 2026). `ucl/` and `uel/` each hold the board JSON (`boards/`), the data behind them (CSV) and the notes on sources, checks and decisions (`NOTES_*.md`). `clubs_all.txt` is every club a board may use (the game's own club names); the build stops on any other.

Periods: the Champions League from 1992/93, when it got its name; the Europa League, UEFA Cup included, from 2000/01.

Build with `python3 scripts/build-europe-records.py` from the repo root.
