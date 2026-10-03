"""Build docs/data/pl_results/pl_results.csv: every Premier League result, 1992/93 to 2025/26.

Sources: football-data.co.uk (one file per season, 1993/94 to 2025/26) and engsoccerdata on GitHub (jalapic/engsoccerdata,
every English league result; used for 1992/93, which football-data doesn't have, and as a second source for every season it covers).
Checks, and the build stops if one fails:
- every season has 462 matches (22 clubs, to 1994/95) or 380;
- the two sources agree on every match they both have;
- the table built from the results gives every club the points in PL_PTS (index.html, sourced separately), allowing only
  for the known points deductions, and the same finishing order as PL.
Run from the repo root: python3 scripts/build-pl-results.py  (downloads about 7 MB into a temporary folder)
"""
import csv, io, json, re, tempfile, urllib.request, collections, os

FD = {"Man United": "Man Utd", "Tottenham": "Spurs", "Nott'm Forest": "Nottingham Forest", "Sheffield United": "Sheffield Utd", "Sheffield Weds": "Sheffield Wed"}
ES = {"Blackburn Rovers": "Blackburn", "Coventry City": "Coventry", "Ipswich Town": "Ipswich", "Leeds United": "Leeds", "Manchester City": "Man City",
      "Manchester United": "Man Utd", "Norwich City": "Norwich", "Oldham Athletic": "Oldham", "Queens Park Rangers": "QPR", "Sheffield United": "Sheffield Utd",
      "Sheffield Wednesday": "Sheffield Wed", "Tottenham Hotspur": "Spurs", "Newcastle United": "Newcastle", "West Ham United": "West Ham", "Swindon Town": "Swindon",
      "Leicester City": "Leicester", "Bolton Wanderers": "Bolton", "Derby County": "Derby", "Sunderland": "Sunderland", "Barnsley": "Barnsley", "Charlton Athletic": "Charlton",
      "Bradford City": "Bradford", "Watford": "Watford", "Wolverhampton Wanderers": "Wolves", "Wigan Athletic": "Wigan", "Birmingham City": "Birmingham",
      "West Bromwich Albion": "West Brom", "Hull City": "Hull", "Stoke City": "Stoke", "Swansea City": "Swansea", "Cardiff City": "Cardiff", "Huddersfield Town": "Huddersfield",
      "Brighton & Hove Albion": "Brighton", "AFC Bournemouth": "Bournemouth", "Luton Town": "Luton", "Norwich": "Norwich", "Nottingham Forest": "Nottingham Forest"}
# points deductions (club, season): points taken off, as the game's tables show them
DEDUCT = {("Middlesbrough", "1996/97"): 3, ("Portsmouth", "2009/10"): 9, ("Everton", "2023/24"): 8, ("Nottingham Forest", "2023/24"): 4}

def get(url):
    return urllib.request.urlopen(url, timeout=60).read()
def season(y): return f"{y}/{(y + 1) % 100:02d}"

tmp = tempfile.mkdtemp()
games = {}  # season -> list of (date, home, away, hg, ag)
for y in range(1993, 2026):
    raw = get(f"https://www.football-data.co.uk/mmz4281/{y % 100:02d}{(y + 1) % 100:02d}/E0.csv").decode("latin-1")
    rows = [r for r in csv.DictReader(io.StringIO(raw.lstrip("﻿"))) if r.get("HomeTeam")]
    def iso(d):
        dd, mm, yy = d.split("/"); yy = int(yy); yy += 2000 if yy < 50 else (1900 if yy < 100 else 0); return f"{yy:04d}-{int(mm):02d}-{int(dd):02d}"
    games[season(y)] = [(iso(r["Date"]), FD.get(r["HomeTeam"], r["HomeTeam"]), FD.get(r["AwayTeam"], r["AwayTeam"]), int(r["FTHG"]), int(r["FTAG"])) for r in rows]
es = collections.defaultdict(list)
for r in csv.DictReader(io.StringIO(get("https://raw.githubusercontent.com/jalapic/engsoccerdata/master/data-raw/england.csv").decode("utf-8"))):
    if r["tier"] == "1" and int(r["Season"]) >= 1992:
        es[season(int(r["Season"]))].append((r["Date"], ES.get(r["home"], r["home"]), ES.get(r["visitor"], r["visitor"]), int(r["hgoal"]), int(r["vgoal"])))
games["1992/93"] = es["1992/93"]

src = open("index.html", encoding="utf-8").read()
def block(name):
    i = src.index(f"const {name} = {{"); return src[i:src.index("};", i)]
PL = {s: v.split(",") for s, v in re.findall(r'^"(\d{4}/\d{2})":"([^"]+)"', block("PL"), re.M)}
PTS = {s: json.loads(v) for s, v in re.findall(r'^"(\d{4}/\d{2})":(\[[^\]]+\])', block("PL_PTS"), re.M)}
assert sorted(games) == sorted(PL), (sorted(set(PL) ^ set(games)))

agree = 0
for s, gs in sorted(games.items()):
    n = len(PL[s]); assert len(gs) == n * (n - 1), (s, len(gs))
    assert {g[1] for g in gs} == set(PL[s]), (s, {g[1] for g in gs} ^ set(PL[s]))
    if s != "1992/93" and es.get(s):  # second source: every match must agree
        a = {(h, aw): (hg, ag) for _, h, aw, hg, ag in gs}
        b = {(h, aw): (hg, ag) for _, h, aw, hg, ag in es[s]}
        assert a == b, (s, [k for k in a if a[k] != b.get(k)][:5]); agree += 1
    pts, gd, gf = collections.Counter(), collections.Counter(), collections.Counter()
    for _, h, aw, hg, ag in gs:
        pts[h] += 3 if hg > ag else (1 if hg == ag else 0); pts[aw] += 3 if ag > hg else (1 if hg == ag else 0)
        gd[h] += hg - ag; gd[aw] += ag - hg; gf[h] += hg; gf[aw] += ag
    for c in pts: pts[c] -= DEDUCT.get((c, s), 0)
    assert [pts[c] for c in PL[s]] == PTS[s], (s, [(c, pts[c], p) for c, p in zip(PL[s], PTS[s]) if pts[c] != p])
    order = sorted(PL[s], key=lambda c: (-pts[c], -gd[c], -gf[c]))
    assert order == PL[s], (s, [(a, b) for a, b in zip(order, PL[s]) if a != b][:3])

os.makedirs("docs/data/pl_results", exist_ok=True)
with open("docs/data/pl_results/pl_results.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["season", "date", "home", "away", "home_goals", "away_goals"])
    for s in sorted(games):
        for g in sorted(games[s]): w.writerow([s, *g])
print(sum(len(g) for g in games.values()), "matches;", agree, "seasons matched by both sources; every table matches PL_PTS and PL")
