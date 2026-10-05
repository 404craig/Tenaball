"""Build EXTRA_Q6 (La Liga, Bundesliga, Serie A, Ligue 1 and Top 5 boards from Craig's October 2026 picks, and the Champions League and Europa League boards from docs/data/cups/), EURO_OPEN (their open
boards) and EURO_PEOPLE (every player in the four leagues in 2025/26, so wrong answers are recognised), and write them into index.html.

Data, in docs/data/europe/ (see BRIEF.md and each league's NOTES files):
  <league>/boards/<pick>.json   one board each, from the research agents (two sources a figure)
  <league>/tables.csv           season tables the game doesn't have yet (2024/25 and 2025/26), with points
  <league>/squads_2025_26.csv   every player who played a league game in 2025/26
  <league>/players.csv          every player's league seasons since 2000/01; those with 30+ goals or 200+ games are recognised names too
Every board covers 2000/01 to 2025/26 (Craig, 5 October 2026: not 1992/93 for these leagues).
Run from the repo root: python3 scripts/build-europe-records.py
"""
import csv, glob, json, os, re, sys, unicodedata
from collections import Counter, defaultdict

E = "docs/data/europe/"
CAT = {"laliga": "laliga", "bund": "bund", "seriea": "seriea", "ligue1": "ligue1", "top5": "top5", "ucl": "ucl", "uel": "uel"}
LEAGUE = {"laliga": "La Liga", "bund": "Bundesliga", "seriea": "Serie A", "ligue1": "Ligue 1"}
h = open("index.html", encoding="utf-8").read()
problems = []

def plain(s):
    s = "".join(c for c in unicodedata.normalize("NFKD", s) if not unicodedata.combining(c))
    return s.replace("ø", "o").replace("Ø", "O").replace("ß", "ss").replace("ł", "l").replace("đ", "d").replace("ı", "i").strip()

def known_boards(cat):
    out = {}
    base = re.sub(r"const EXTRA_Q6 = \[.*?\];\n", "", h, count=1, flags=re.S)  # leave out this script's own earlier output
    for m in re.finditer(r'\{"id":"(%s-top-\d{4}/\d\d)".*?"table":(\[[^\]]*\])' % cat, base): out[m.group(1)[-7:]] = json.loads(m.group(2))
    return out
CLUBS = {k: set(open(E + f"clubs_{k}.txt").read().split("\n")) for k in LEAGUE}
CLUBS["ucl"] = CLUBS["uel"] = set(open("docs/data/cups/clubs_all.txt").read().split("\n")) | set().union(*CLUBS.values())

Q, OPEN = [], []
def family(pick, title, kind, typ="person"):
    t = title.lower()
    if kind == "open": return "open"
    if typ == "club" and not re.search(r"cup|pokal|coppa|copa|coupe", t): return "rec"
    if re.search(r"signing|sale|transfer", t): return "fee"
    if "manager" in t: return "mgr"
    if "assist" in t: return "assists"
    if "appearance" in t or "most-used" in t or "games" in t: return "apps"
    if re.search(r"scorer|goals|hat-trick|seasons \(each|biggest .* seasons|golden shoe", t): return "goals"
    if re.search(r"cup|pokal|coppa|copa|coupe|player of the year|award", t): return "aw"
    if re.search(r"ground|title|seasons", t): return "rec"
    return "x"

# ---------- season tables the game is missing ----------
for lg in LEAGUE:
    f = E + f"{lg}/tables.csv"
    if not os.path.exists(f): continue
    have = known_boards(CAT[lg]); rows = defaultdict(list)
    for r in csv.DictReader(open(f)): rows[r["season"]].append(r)
    for s, rs in sorted(rows.items()):
        if s in have or s < "2000/01": continue
        rs.sort(key=lambda r: int(r["pos"])); table = [r["club"] for r in rs]
        for c in table:
            if c not in CLUBS[lg]: problems.append(f"{lg} {s}: club {c} isn't in the game's club list")
        Q.append({"id": f"{CAT[lg]}-top-{s}", "cat": CAT[lg], "type": "club", "title": f"{s} {LEAGUE[lg]}", "brief": "Name the clubs that finished 1st to 10th.",
                  "slots": [{"label": str(i + 1), "club": r["club"], "val": f"{r['pts']} pts"} for i, r in enumerate(rs[:10])], "level": 1, "hard": False, "numeric": True,
                  "table": table, "league": LEAGUE[lg]})

# ---------- most seasons since 2000/01 (Bundesliga and Serie A; La Liga and Ligue 1 have their own already) ----------
for lg, pick in [("bund", "de27"), ("seriea", "it26")]:
    have = known_boards(CAT[lg]); have.update({q["id"][-7:]: q["table"] for q in Q if q["cat"] == CAT[lg] and "-top-" in q["id"]})
    seas = sorted(s for s in have if "2000/01" <= s <= "2025/26")
    if len(seas) != 26: problems.append(f"{lg}: most seasons needs 26 tables, has {len(seas)}"); continue
    n = Counter(c for s in seas for c in have[s]); order = n.most_common(); v10 = order[9][1]
    top = [(c, k) for c, k in order if k > v10]; tied = [c for c, k in order if k == v10]
    slots = [{"label": str(i + 1), "club": c, "val": f"{k} seasons"} for i, (c, k) in enumerate(top)]
    for i in range(10 - len(slots)): slots.append({"label": str(len(slots) + 1), "club": tied[i], "alts": tied, "pool": pick, "val": f"{v10} seasons"})
    Q.append({"id": f"{CAT[lg]}-rec-seasons-2000", "cat": CAT[lg], "type": "club", "title": f"Most {LEAGUE[lg]} seasons since 2000",
              "brief": f"Name the clubs that have played the most {LEAGUE[lg]} seasons since 2000/01." + (f" {len(tied)} clubs share {v10} seasons, so any of them fills the last places." if len(slots) - len(top) and len(tied) > 10 - len(top) else ""),
              "period": "Seasons 2000/01 to 2025/26", "level": 1, "hard": False, "numeric": True, "slots": slots, "note": {}})

# ---------- the agents' boards ----------
for path in sorted(glob.glob(E + "*/boards/*.json") + glob.glob("docs/data/cups/*/boards/*.json")):
    lg = path.split("/")[-3]; b = json.load(open(path)); pick = b.get("pick") or os.path.basename(path)[:-5]
    where = f"{lg}/{pick}"
    text = [b.get("title", ""), b.get("brief", ""), b.get("period", ""), *b.get("notes", {}).values(), *(r.get("val", "") for r in b.get("rows", []))]
    if any("—" in t for t in text): problems.append(f"{where}: em dash"); continue
    if not b.get("period"): problems.append(f"{where}: no period line"); continue
    if not re.search(r"20\d\d", b["period"]) : problems.append(f"{where}: period doesn't name its years: {b['period']}")
    kind, typ, lv = b.get("kind"), b.get("type", "person"), int(b.get("level", 1))
    id = f"{CAT[lg]}-{family(pick, b['title'], kind, typ)}-{pick.replace('/', '-')}"
    fix = (lambda n: plain(n)) if typ == "person" else (lambda n: n)
    if kind == "open":
        names = list(dict.fromkeys(fix(n) for n in b.get("names", [])))
        ex = [fix(n) for n in b.get("examples", []) if fix(n) in names]
        if len(names) < 12: problems.append(f"{where}: open board with only {len(names)} answers"); continue
        OPEN.append({"id": id, "cat": CAT[lg], "type": typ, "title": b["title"], "brief": b["brief"], "period": b["period"], "level": lv,
                     "names": names, "examples": list(dict.fromkeys(ex + names))[:40], "miss": b.get("miss") or "{n} isn't one of them."})
        continue
    rows = b.get("rows", [])
    if len(rows) != 10: problems.append(f"{where}: {len(rows)} rows"); continue
    slots, used = [], defaultdict(set)
    for r in rows:
        name = r.get("name")
        if not name and r.get("alts"):  # a shared place given only as its list of names: take the next one not used yet
            name = next(a for a in r["alts"] if a not in used[r.get("pool")]); used[r.get("pool")].add(name)
        s = {"label": str(r.get("label", len(slots) + 1)), "club": fix(name), "val": r.get("val", "")}
        if r.get("alts"): s["alts"] = [fix(a) for a in r["alts"]]; s["pool"] = f"{pick}-{r.get('pool') or s['label']}"
        if s.get("alts") and s["club"] not in s["alts"]: s["alts"].insert(0, s["club"])
        slots.append(s)
    reps = Counter(s["club"] for s in slots if not s.get("pool"))
    if reps and max(reps.values()) > 3: problems.append(f"{where}: {reps.most_common(1)[0][0]} fills {reps.most_common(1)[0][1]} slots"); continue
    if typ == "club" and lg in CLUBS:
        for s in slots:
            for c in s.get("alts") or [s["club"]]:
                if c not in CLUBS[lg]: problems.append(f"{where}: club {c} isn't in the game's club list")
    q = {"id": id, "cat": CAT[lg], "type": typ, "title": b["title"], "brief": b["brief"], "period": b["period"], "level": lv, "hard": lv == 2,
         "slots": slots, "note": {fix(k): v for k, v in b.get("notes", {}).items()}}
    if kind == "ranked": q["numeric"] = True
    Q.append(q)

# ---------- tidier period lines and titles ----------
FEE = "Deals from July 2000 to the end of the summer 2026 window, by the fee reported at the time (euros, without add-ons)"
PERIOD = {"de22": "Bayern managers, 2009 to May 2026", "de23": "Dortmund managers, 2008 to May 2026", "fr21": "PSG managers, December 2005 to May 2026"}
for q in Q:
    k = q["id"].split("-", 2)[-1]
    if "-fee-" in q["id"]: q["period"] = FEE
    if k in PERIOD: q["period"] = PERIOD[k]
    if k == "it17": q["title"] = "Roma and Napoli top scorers since 2000"

# ---------- levels: each league gets some easy boards (only La Liga had any), from its best-known names ----------
EASY = {"de07", "de15", "de12", "de22", "de17", "dec0b", "it07", "it14", "it15", "it16", "it18", "itc1b", "fr07", "fr15", "fr17", "fr21", "frc0b"}
for q in Q + OPEN:
    if q["id"].rsplit("-", 1)[-1] in EASY or any(q["id"].endswith("-" + k) for k in EASY): q["level"] = 0; q["hard"] = False

# ---------- 2025/26 squads: recognised names ----------
people = set()
for f in glob.glob(E + "*/squads_2025_26.csv"):
    for r in csv.DictReader(open(f)): people.add(plain(r["player"]))
# and the well-known names since 2000/01 (Craig, 6 October 2026): 30 or more league goals or 200 or more league games in that league
for f in glob.glob(E + "*/players.csv"):
    g, a, nm = Counter(), Counter(), {}
    for r in csv.DictReader(open(f)):
        k = r["tm_player_id"]; g[k] += int(r["goals"] or 0); a[k] += int(r["apps"] or 0); nm[k] = plain(r["player"])
    people |= {nm[k] for k in nm if g[k] >= 30 or a[k] >= 200}

ids = [q["id"] for q in Q + OPEN]
dup = [i for i, k in Counter(ids).items() if k > 1]
if dup: problems.append(f"duplicate ids: {dup}")
print(len(Q), "boards,", len(OPEN), "open boards,", len(people), "recognised names (2025/26 squads, and 30+ goals or 200+ games since 2000/01)")
for p in problems: print("  !", p)
if "--dry" in sys.argv:
    for q in Q + OPEN: print(q["id"], (q.get("slots") or [{"club": n} for n in q["names"][:10]])[:10] and [s["club"] for s in (q.get("slots") or [{"club": n} for n in q["names"][:10]])])
    sys.exit()
for name, data in [("EXTRA_Q6", Q), ("EURO_OPEN", OPEN), ("EURO_PEOPLE", sorted(people))]:
    h, n = re.subn(r"const %s = \[.*?\];\n" % name, lambda m: f"const {name} = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n", h, count=1, flags=re.S)
    assert n == 1, name
open("index.html", "w", encoding="utf-8").write(h)
