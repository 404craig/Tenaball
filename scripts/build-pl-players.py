"""Embed every Premier League player (docs/data/pl_players/, 1992/93 to 2025/26) in index.html as PL_PLAYERS, with the club open boards (PL_OPEN).

Each line is "name|letters|apps|aliases|clubs": the name the game shows, the surname letters it counts under on the letter boards
(the first letter of the surname and of the last word of the name, so "Kevin De Bruyne" counts for D and B), Premier League
appearances (used to pick well-known examples when a letter board is revealed), other spellings, and the clubs he played for
as numbers into PL_CLUBS. Two different players can share a name: each one's clubs are a separate group (split by "/"), so
"played for both" boards only count clubs one player played for.
PL_OPEN lists the club open boards: surname letters at one club, and players who played for two clubs. Their examples are the
players with the most appearances for those clubs.
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

# clubs per player (only clubs he actually played for), and appearances per club, from the season rows
rows = list(csv.DictReader(open("docs/data/pl_players/pl_players.csv", encoding="utf-8")))
pid_name = {r["player_id"]: CANON.get(r["player"], r["player"]) for r in rows}
club_apps = collections.defaultdict(collections.Counter)
for r in rows:
    if int(r["apps"]) > 0: club_apps[r["player_id"]][r["club"]] += int(r["apps"])
CLUBS = sorted({c for a in club_apps.values() for c in a})
groups = collections.defaultdict(list)
for pid, a in sorted(club_apps.items()): groups[pid_name[pid]].append(".".join(str(CLUBS.index(c)) for c in sorted(a)))
assert set(groups) <= set(people), set(groups) - set(people)

lines = [f'{n}|{"".join(sorted(p["letters"]))}|{p["apps"]}|{";".join(sorted(norm(a) for a in p["alias"]))}|{"/".join(groups.get(n, []))}' for n, p in sorted(people.items())]
data = "\\n".join(l.replace("\\", "").replace('"', "") for l in lines)

# club open boards: (id, clubs, letter or "", level)
LETTERS = {"Man Utd":"MS","Liverpool":"MS","Arsenal":"MS","Chelsea":"SB","Spurs":"SD","Man City":"SB","Newcastle":"BS","Everton":"BM","West Ham":"BM","Aston Villa":"BC"}
KEY = {"Man Utd":"mu","Liverpool":"lfc","Arsenal":"afc","Chelsea":"cfc","Spurs":"tot","Man City":"mci","Newcastle":"new","Everton":"eve","West Ham":"whu","Aston Villa":"avl"}
PAIRS = [("Chelsea","Man City"),("Arsenal","Chelsea"),("Everton","Man Utd"),("Liverpool","Newcastle"),("Newcastle","Spurs"),("Spurs","West Ham"),("Arsenal","West Ham"),("Aston Villa","Liverpool"),("Liverpool","Man City")]
plet = collections.defaultdict(set)
for r in rows: plet[r["player_id"]] |= {x for x in (first(r["surname"]), first(r["player"].split()[-1])) if x}
OPEN = []
def add_open(id, clubs, letter, title, brief):
    fit = [pid for pid, a in club_apps.items() if all(c in a for c in clubs) and (not letter or letter in plet[pid])]
    fit.sort(key=lambda pid: (-sum(club_apps[pid][c] for c in clubs), pid_name[pid]))
    names = list(dict.fromkeys(pid_name[pid] for pid in fit))
    assert len(names) >= 15, (id, len(names))
    OPEN.append({"id": id, "title": title, "brief": brief, "clubs": clubs, "letters": letter, "level": 1 if len(clubs) == 1 else 2, "examples": names[:40], "count": len(names)})
for club, ls in LETTERS.items():
    for l in ls:
        add_open(f"pl-letter-{KEY[club]}-{l.lower()}", [club], l, f"{club} players beginning with {l}",
                 f"Name players who have played for {club} in the Premier League and whose surname begins with {l}.")
for a, b in PAIRS:
    add_open(f"pl-both-{KEY[a]}-{KEY[b]}", [a, b], "", f"Played for {a} and {b}",
             f"Name players who have played Premier League games for both {a} and {b}.")
import json
block = f'const PL_PLAYERS = "{data}";\nconst PL_CLUBS = {json.dumps(CLUBS)};\nconst PL_OPEN = {json.dumps(OPEN, separators=(",", ":"))};\n'
src = open("index.html", encoding="utf-8").read()
src, n = re.subn(r'const PL_PLAYERS = ".*?";\n(const PL_CLUBS = .*?;\nconst PL_OPEN = .*?;\n)?', lambda m: block, src, count=1, flags=re.S)
assert n == 1, "PL_PLAYERS not found in index.html"
open("index.html", "w", encoding="utf-8").write(src)
print(len(lines), "players,", len(OPEN), "club open boards")
