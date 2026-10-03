"""Embed every Premier League player (docs/data/pl_players/players.csv, 1992/93 to 2025/26) in index.html as PL_PLAYERS.

Each line is "name|letters|apps": the name the game shows, the surname letters it counts under on the letter boards
(the first letter of the surname and of the last word of the name, so "Kevin De Bruyne" counts for D and B), and
Premier League appearances (used to pick well-known examples when a letter board is revealed).
Run from the repo root: python3 scripts/build-pl-players.py
"""
import csv, re, unicodedata, collections

# the game already spells these players its own way; keep the game's spelling (the data's spelling becomes an alias)
CANON = {"Son Heung-min": "Heung-min Son", "Theo Zagorakis": "Theodoros Zagorakis", "Kanu": "Nwankwo Kanu", "Juninho": "Juninho Paulista", "Salva": "Salva Ballesta"}

def norm(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", s)).strip()

def first(s):
    n = norm(s)
    return n[0].upper() if n and n[0].isalpha() else ""

people = collections.OrderedDict()
for r in csv.DictReader(open("docs/data/pl_players/players.csv", encoding="utf-8")):
    name = CANON.get(r["player"], r["player"])
    p = people.setdefault(name, {"letters": set(), "apps": 0, "alias": set()})
    p["letters"] |= {x for x in (first(r["surname"]), first(r["player"].split()[-1])) if x}
    p["apps"] += int(r["total_apps"] or 0)
    if name != r["player"]: p["alias"].add(r["player"])
    if norm(r["surname"]) != norm(r["player"].split()[-1]): p["alias"].add(r["surname"])

lines = [f'{n}|{"".join(sorted(p["letters"]))}|{p["apps"]}|{";".join(sorted(norm(a) for a in p["alias"]))}' for n, p in sorted(people.items())]
data = "\\n".join(l.replace("\\", "").replace('"', "") for l in lines)
src = open("index.html", encoding="utf-8").read()
src, n = re.subn(r'const PL_PLAYERS = ".*?";', lambda m: f'const PL_PLAYERS = "{data}";', src, count=1, flags=re.S)
assert n == 1, "PL_PLAYERS not found in index.html"
open("index.html", "w", encoding="utf-8").write(src)
print(len(lines), "players")
