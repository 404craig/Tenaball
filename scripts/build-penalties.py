#!/usr/bin/env python3
"""Builds the penalty shootout's questions and artwork into index.html.

Questions start from Craig's shootout build (docs/penalties/questions_raw.json, rows of
[header, a, b, value a, value b, unit, gap]). Nothing goes in unchecked:
  - Premier League player goals, appearances and goals per club are worked out from the player
    dataset (docs/data/pl_players/pl_players.csv), to the end of 2025/26.
  - Premier League club points (after deductions), wins and seasons come from every result
    (docs/data/pl_results/pl_results.csv).
  - Scottish top flight seasons come from the season tables (docs/data/spfl/spfl_tables.csv),
    which start in 2000/01, so that question covers 2000/01 to 2025/26.
  - Every other question uses the values in docs/penalties/verified.json (two sources each, see
    docs/penalties/VERIFY_NOTES.md). A question missing from it is left out, and so is any pair
    where a value couldn't be checked or the two are level.

The artwork (the keeper's frames, the coin and the ball) is copied from docs/penalties/shootout-latest.html.
Run it from the repo root: python3 scripts/build-penalties.py
"""
import collections, csv, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)

raw = json.load(open(P("docs/penalties/questions_raw.json")))
heads = {h["id"]: dict(h) for h in raw["headers"]}
PL_PERIOD = "Premier League era, 1992/93 to 2025/26"

# ---- Premier League players ----
players = list(csv.DictReader(open(P("docs/data/pl_players/pl_players.csv"))))
goals, apps, club_goals = collections.Counter(), collections.Counter(), collections.Counter()
for r in players:
    goals[r["player"]] += int(r["goals"]); apps[r["player"]] += int(r["apps"])
    club_goals[(r["club"], r["player"])] += int(r["goals"])
ALIAS = {"Heung-min Son": "Son Heung-min"}
CLUB_Q = {6: "Man Utd", 7: "Liverpool", 8: "Arsenal", 9: "Everton", 10: "West Ham", 11: "Aston Villa",
          12: "Newcastle", 13: "Spurs", 14: "Man City", 15: "Chelsea"}

# ---- Premier League clubs, from every result ----
results = list(csv.DictReader(open(P("docs/data/pl_results/pl_results.csv"))))
pts, wins, seasons = collections.Counter(), collections.Counter(), collections.defaultdict(set)
for r in results:
    h, a, hg, ag = r["home"], r["away"], int(r["home_goals"]), int(r["away_goals"])
    seasons[h].add(r["season"]); seasons[a].add(r["season"])
    if hg > ag: wins[h] += 1; pts[h] += 3
    elif hg < ag: wins[a] += 1; pts[a] += 3
    else: pts[h] += 1; pts[a] += 1
# results don't show deductions (docs/PL_POINTS_SOURCES.md)
for club, d in [("Middlesbrough", 3), ("Portsmouth", 9), ("Everton", 8), ("Nottingham Forest", 4)]:
    pts[club] -= d

# ---- Scottish top flight, 2000/01 on ----
spfl = collections.Counter(r["club"] for r in csv.DictReader(open(P("docs/data/spfl/spfl_tables.csv"))))

def player(n): n = ALIAS.get(n, n); return n
CALC = {0: lambda n: goals[player(n)], 1: lambda n: apps[player(n)],
        4: lambda n: pts[n], 5: lambda n: wins[n], 17: lambda n: len(seasons[n]), 22: lambda n: spfl[n]}
for h, club in CLUB_Q.items():
    CALC[h] = (lambda c: lambda n: club_goals[(c, player(n))])(club)
for h in [0, 1, 4, 5, 17] + list(CLUB_Q): heads[h]["period"] = PL_PERIOD
heads[22]["period"] = "Seasons 2000/01 to 2025/26"

verified = {}
if os.path.exists(P("docs/penalties/verified.json")):
    verified = {int(k): v for k, v in json.load(open(P("docs/penalties/verified.json"))).items()}
for h, v in verified.items():
    if h in CALC: continue
    heads[h]["q"] = v.get("q") or heads[h]["q"]; heads[h]["period"] = v.get("period") or heads[h]["period"]

rows, dropped, changed = [], collections.Counter(), 0
for h, a, b, va, vb, unit, gap in raw["rows"]:
    if h in CALC: na, nb = CALC[h](a), CALC[h](b)
    elif h in verified: na, nb = verified[h]["values"].get(a), verified[h]["values"].get(b)
    else: dropped[h] += 1; continue
    if na is None or nb is None or na == nb or not na or not nb: dropped[h] += 1; continue
    if (na, nb) != (va, vb): changed += 1
    rows.append([h, a, b, na, nb, unit, gap])

# gap: how far apart the two sit in that question's ranking (1 is neighbours, the closest call), worked out
# again from the checked values since some orders changed
by_h = collections.defaultdict(dict)
for r in rows: by_h[r[0]].update({r[1]: r[3], r[2]: r[4]})
for r in rows:
    order = sorted(by_h[r[0]].values(), reverse=True)
    r[6] = max(1, min(3, abs(order.index(r[3]) - order.index(r[4]))))

# keep only the questions that still have pairs, renumbered
used = sorted({r[0] for r in rows})
renum = {h: i for i, h in enumerate(used)}
out_h = [[heads[h]["q"], heads[h]["period"]] for h in used]
out_r = [[renum[r[0]]] + r[1:] for r in rows]
for t in [x for hh in out_h for x in hh] + [x for r in out_r for x in r if isinstance(x, str)]:
    if "—" in t: sys.exit(f"em dash in {t!r}")
data = json.dumps({"h": out_h, "r": out_r}, ensure_ascii=False, separators=(",", ":"))

# ---- artwork from Craig's build ----
art_src = open(P("docs/penalties/shootout-latest.html"), encoding="utf-8").read()
gk = re.search(r"^const GK = (\[.*\]);$", art_src, re.M).group(1)
coin = re.search(r"^const COIN_FRAMES = (\[.*\]);$", art_src, re.M).group(1)
ball = re.search(r'<g id="soBallSpin"><image href="(data:image/[^"]+)"', art_src).group(1)

html = open(P("index.html"), encoding="utf-8").read()
block = ("<script>/* penalties: built by scripts/build-penalties.py */\n"
         f"const PEN_DATA = {data};\n"
         f"const PEN_GK = {gk};\n"
         f"const PEN_COIN = {coin};\n"
         f"const PEN_BALL = {json.dumps(ball)};\n"
         "</script>")
pat = re.compile(r"<script>/\* penalties: built by scripts/build-penalties\.py \*/\n.*?</script>", re.S)
if pat.search(html): html = pat.sub(lambda m: block, html, count=1)
else:
    anchor = "<!-- penalties: data -->"
    if anchor not in html: sys.exit("index.html has no <!-- penalties: data --> marker")
    html = html.replace(anchor, anchor + "\n" + block, 1)
open(P("index.html"), "w", encoding="utf-8").write(html)
print(f"{len(out_h)} questions, {len(out_r)} pairs ({changed} values corrected; dropped: {dict(dropped) or 'none'})")
gaps = collections.Counter(r[6] for r in out_r); print("by gap:", dict(sorted(gaps.items())))
