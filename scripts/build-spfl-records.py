"""Build EXTRA_Q5, the Scottish top flight boards picked by Craig in October 2026, and write it into index.html.

Data, all in docs/data/spfl/ (see SPFL_SOURCES.md there):
  spfl_tables.csv      every final table 2000/01 to 2025/26, worked out from every result (football-data.co.uk) and checked
                       against the game's own tables and Wikipedia's (deductions from Wikipedia)
  spfl_players.csv     every player's league appearances, goals and assists per club and season (Transfermarkt),
                       cross-checked against fitba_players.csv (FitbaStats) for the seven biggest clubs
  derbies.csv          every Old Firm and Edinburgh derby league match with its scorers (FitbaStats, londonhearts, Wikipedia)
  SPFL_LISTS.md        managers, captains, PFA awards, cup finals, promotion and relegation, European final line-ups
  SPFL_TRANSFERS.md    transfer fees (Transfermarkt plus a news report for every fee)
Run from the repo root: python3 scripts/build-spfl-records.py
"""
import csv, json, re, unicodedata
from collections import Counter, defaultdict

D = "docs/data/spfl/"
Q = []
CANON = {"Andrew Driver": "Andy Driver", "Andrew Robertson": "Andy Robertson", "Georgios Giakoumakis": "Giorgos Giakoumakis"}  # one spelling per player, the game's own where it has one
def plain(s):
    """the game spells names without accents (Edouard, Cuellar)"""
    s = "".join(c for c in unicodedata.normalize("NFKD", s) if not unicodedata.combining(c)).replace("ø", "o").replace("Ø", "O")
    return CANON.get(s, s)

def board(id, type, title, brief, period, level, slots, notes=None, **extra):
    assert len(slots) == 10, (id, len(slots))
    for t in [title, brief, period, *(s.get("val", "") for s in slots), *(notes or {}).values()]: assert "—" not in t, id
    Q.append({"id": id, "cat": "spfl", "type": type, "title": title, "brief": brief, "period": period, "level": level, "hard": level == 2,
              "slots": slots, "notes": notes or {}, **extra})

def ranked(id, title, brief, period, level, rows, notes=None, type="person"):
    """rows: (name, val), or (names, val, pool, n) for n tied places any of the names can fill"""
    slots = []
    for r in rows:
        if isinstance(r[0], list):
            alts, val, pool, n = r
            for k in range(n): slots.append({"label": str(len(slots)+1), "club": alts[k], "alts": alts, "pool": pool, "val": val})
        else: slots.append({"label": str(len(slots)+1), "club": r[0], "val": r[1]})
    board(id, type, title, brief, period, level, slots, notes, numeric=True)

def labelled(id, title, brief, period, level, rows, notes=None, type="person"):
    """rows: (label, name or list of names that all count, val)"""
    slot = lambda l, n, v: {"label": l, "club": n[0], "alts": n, "pool": id[-8:] + l, "val": v} if isinstance(n, list) else {"label": l, "club": n, "val": v}
    board(id, type, title, brief, period, level, [slot(l, n, v) for l, n, v in rows], notes)

OPEN = []
def open_board(id, title, brief, period, level, names, examples, miss, type="person"):
    """any name in names counts; answers fill from 10th up. examples: shown in empty places at the end (best known first)"""
    names = list(dict.fromkeys(names)); assert len(names) >= 12 and set(examples) <= set(names), id
    for t in [title, brief, period, miss]: assert "—" not in t, id
    OPEN.append({"id": id, "type": type, "title": title, "brief": brief, "period": period, "level": level, "names": names,
                 "examples": list(dict.fromkeys(examples + names))[:40], "miss": miss})

def by(rows, *, fmt, cut=10, poolname):
    """rank (name, value) pairs, highest first; a tie across the cut becomes a pool for the places left.
    fmt(name, value) gives the slot's stat (name is None for a pool)"""
    rows = sorted(rows, key=lambda r: -r[1]); out, used, i = [], 0, 0
    while used < cut:
        v = rows[i][1]; tied = [r for r in rows if r[1] == v]
        if used + len(tied) <= cut: out += [(n, fmt(n, x)) for n, x in tied]; used += len(tied)
        else: out.append(([n for n, _ in tied], fmt(None, v), poolname, cut - used)); used = cut
        i += len(tied)
    return out

TOP = "Scottish top flight"
SINCE = "League seasons 2000/01 to 2025/26"

# ---------- tables (spfl_tables.csv) ----------
TAB = defaultdict(list)
for r in csv.DictReader(open(D + "spfl_tables.csv")): TAB[r["season"]].append({**r, "pos": int(r["pos"]), "pts": int(r["pts"]), "deduction": int(r["deduction"])})
SEAS = sorted(TAB)
assert SEAS[0] == "2000/01" and SEAS[-1] == "2025/26" and len(SEAS) == 26
OF = {"Celtic", "Rangers"}
c4 = Counter(r["club"] for s in SEAS for r in TAB[s] if r["pos"] <= 4 and r["club"] not in OF)
times = lambda n, x: f"{x} time{'s' if x > 1 else ''}"
ranked("spfl-rec-top4", "Most top-four finishes outside the Old Firm", "Name the clubs other than Celtic and Rangers with the most top-four finishes in the Scottish top flight since 2000.",
       SINCE, 1, by(list(c4.items()), fmt=times, poolname="t4"), type="club")
c6 = Counter(r["club"] for s in SEAS for r in TAB[s] if r["pos"] <= 6)
ranked("spfl-rec-top6", "Most top-six finishes", "Name the clubs with the most top-six finishes in the Scottish top flight since 2000.",
       SINCE, 0, by(list(c6.items()), fmt=times, poolname="t6"), type="club")
best, worst = {}, {}
for s in SEAS:
    for r in TAB[s]:
        if r["club"] not in OF and (r["club"] not in best or r["pts"] > best[r["club"]]["pts"]): best[r["club"]] = {**r, "season": s}
        if r["club"] not in worst or r["pts"] < worst[r["club"]]["pts"]: worst[r["club"]] = {**r, "season": s}
ranked("spfl-rec-best-other", "Best points totals outside the Old Firm", "Name the clubs other than Celtic and Rangers with the highest points total in a Scottish top flight season since 2000. Each club counts once, for its best season.",
       SINCE, 1, by([(c, r["pts"]) for c, r in best.items()], fmt=lambda n, x: f"{x} pts" + (f" ({best[n]['season']})" if n else ""), poolname="bo"), type="club")
ded = lambda r: f", after a {-r['deduction']}-point deduction" if r["deduction"] else ""
ranked("spfl-rec-fewest", "Fewest points in a Scottish top flight season", "Name the clubs with the lowest points total in a Scottish top flight season since 2000. Each club counts once, for its worst season. Points are after any deduction.",
       SINCE, 1, by([(c, -r["pts"]) for c, r in worst.items()], fmt=lambda n, x: f"{-x} pts" + (f" ({worst[n]['season']}{ded(worst[n])})" if n else ""), poolname="fw"), type="club")


# ---------- derbies (derbies.csv) ----------
def derby_goals(kind):
    g, club = Counter(), defaultdict(Counter)
    for r in csv.DictReader(open(D + "derbies.csv")):
        if r["derby"] != kind: continue
        for part in [x.strip() for x in r["scorers"].split(";") if x.strip()]:
            m = re.match(r"^(.*?) \(([^)]*)\)(?: x(\d+))?$", part); assert m, part
            if "og" in m.group(2): continue
            n = plain(m.group(1)); k = int(m.group(3) or 1); g[n] += k; club[n][m.group(2)] += k
    return g, club
for kind, id, title, brief, lv in [("oldfirm", "spfl-derby-oldfirm-goals", "Old Firm league scorers", "Name the players with the most league goals in Celtic against Rangers matches since 2000.", 0),
                                   ("edinburgh", "spfl-derby-edinburgh-goals", "Edinburgh derby league scorers", "Name the players with the most league goals in Hearts against Hibernian matches since 2000.", 2)]:
    g, club = derby_goals(kind)
    who = lambda n: " and ".join(f"{c} {k}" for c, k in club[n].most_common()) if len(club[n]) > 1 else next(iter(club[n]))
    ranked(id, title, brief, "League matches, 2000/01 to 2025/26", lv,
           by(list(g.items()), fmt=lambda n, x: f"{x} goals" + (f" ({who(n)})" if n else ""), poolname=kind[:4]))

# ---------- managers (SPFL_LISTS.md, two sources each) ----------
labelled("spfl-mgr-celtic", "Celtic managers in order", "Name Celtic's managers in order, every spell since 2010, interim spells included. A manager with two spells fills both.",
         "Managers from March 2010 to May 2026", 0,
         [("2010", "Neil Lennon", "2010 to 2014"), ("2014", "Ronny Deila", "2014 to 2016"), ("2016", "Brendan Rodgers", "2016 to 2019"),
          ("2019", "Neil Lennon", "2019 to 2021"), ("2021", "John Kennedy", "interim, 2021"), ("2021 ", "Ange Postecoglou", "2021 to 2023"),
          ("2023", "Brendan Rodgers", "2023 to 2025"), ("2025", "Martin O'Neill", "interim, 2025"), ("2025 ", "Wilfried Nancy", "2025 to 2026"),
          ("2026", "Martin O'Neill", "2026")])
labelled("spfl-mgr-rangers", "Rangers managers in order", "Name Rangers' managers in order since 2011. Caretakers and interim managers don't count.",
         "Managers from June 2011 to May 2026", 1,
         [("2011", "Ally McCoist", "2011 to 2014"), ("2015", "Mark Warburton", "2015 to 2017"), ("2017", "Pedro Caixinha", "2017"),
          ("2017 ", "Graeme Murty", "2017 to 2018"), ("2018", "Steven Gerrard", "2018 to 2021"), ("2021", "Giovanni van Bronckhorst", "2021 to 2022"),
          ("2022", "Michael Beale", "2022 to 2023"), ("2023", "Philippe Clement", "2023 to 2025"), ("2025", "Russell Martin", "2025"),
          ("2025 ", "Danny Rohl", "2025 to 2026")])
TITLES = [("2000/01","Martin O'Neill"),("2001/02","Martin O'Neill"),("2002/03","Alex McLeish"),("2003/04","Martin O'Neill"),("2004/05","Alex McLeish"),
          ("2005/06","Gordon Strachan"),("2006/07","Gordon Strachan"),("2007/08","Gordon Strachan"),("2008/09","Walter Smith"),("2009/10","Walter Smith"),
          ("2010/11","Walter Smith"),("2011/12","Neil Lennon"),("2012/13","Neil Lennon"),("2013/14","Neil Lennon"),("2014/15","Ronny Deila"),("2015/16","Ronny Deila")]
CHAMP = {s: [r["club"] for r in TAB[s] if r["pos"] == 1][0] for s in SEAS}
for a in ("2000/01", "2006/07"):
    rows = [(s, m, CHAMP[s]) for s, m in TITLES if a <= s][:10]
    labelled(f"spfl-mgr-titles-{a}", "Title-winning managers", "Name the manager who won the Scottish top flight title each season.", f"Seasons {rows[0][0]} to {rows[-1][0]}", 0, rows)
AH = ["Ebbe Skovdahl","Steve Paterson","Jimmy Calderwood","Mark McGhee","Craig Brown","Derek McInnes","Stephen Glass","Jim Goodwin","Barry Robson","Neil Warnock",
      "Jimmy Thelin","Stephen Robinson","Peter Leven","Paul Sheerin",
      "Jim Jefferies","Craig Levein","John Robertson","George Burley","Graham Rix","Valdas Ivanauskas","Anatoliy Korobochka","Stephen Frail","Csaba Laszlo",
      "Paulo Sergio","John McGlynn","Gary Locke","Robbie Neilson","Ian Cathro","Daniel Stendel","Steven Naismith","Frankie McAvoy","Neil Critchley","Liam Fox",
      "Peter Houston","Eduard Malofeyev","Jon Daly","Austin MacPhee","Steven Pressley"]
open_board("spfl-open-mgr-abe-hea", "Aberdeen and Hearts managers", "Name anyone who has managed Aberdeen or Hearts since 2000, caretakers and interim spells included.",
           "Managers from July 2000 to May 2026", 2, AH,
           ["Derek McInnes","Jimmy Calderwood","Robbie Neilson","Craig Levein","Jim Jefferies","Steven Naismith","Craig Brown","Mark McGhee","Barry Robson","Jimmy Thelin"],
           "{n} hasn't managed Aberdeen or Hearts since 2000.")
CAPS = ["Tom Boyd","Paul Lambert","Jackie McNamara","Neil Lennon","Stephen McManus","Scott Brown","Callum McGregor",
        "Lorenzo Amoruso","Barry Ferguson","Craig Moore","Stefan Klos","Gavin Rae","David Weir","Steven Davis","Carlos Bocanegra","Lee McCulloch","Lee Wallace","James Tavernier"]
open_board("spfl-open-captains", "Old Firm captains", "Name anyone who has been club captain of Celtic or Rangers since 2000.", "Club captains from 2000 to May 2026", 0, CAPS,
           ["Scott Brown","Callum McGregor","James Tavernier","Barry Ferguson","Neil Lennon","Paul Lambert","David Weir","Lee McCulloch","Lee Wallace","Stephen McManus"],
           "{n} wasn't Celtic or Rangers club captain after 2000.")

# ---------- PFA Scotland awards ----------
PPY = [("2000/01","Henrik Larsson","Celtic"),("2001/02","Lorenzo Amoruso","Rangers"),("2002/03","Barry Ferguson","Rangers"),("2003/04","Chris Sutton","Celtic"),
       ("2004/05",["John Hartson","Fernando Ricksen"],"shared: Celtic and Rangers"),("2005/06","Shaun Maloney","Celtic"),("2006/07","Shunsuke Nakamura","Celtic"),
       ("2007/08","Aiden McGeady","Celtic"),("2008/09","Scott Brown","Celtic"),("2009/10","Steven Davis","Rangers"),("2010/11","Emilio Izaguirre","Celtic"),
       ("2011/12","Charlie Mulgrew","Celtic"),("2012/13","Michael Higdon","Motherwell"),("2013/14","Kris Commons","Celtic"),("2014/15","Stefan Johansen","Celtic"),
       ("2015/16","Leigh Griffiths","Celtic"),("2016/17","Scott Sinclair","Celtic"),("2017/18","Scott Brown","Celtic"),("2018/19","James Forrest","Celtic"),
       ("2020/21","James Tavernier","Rangers"),("2021/22","Callum McGregor","Celtic"),("2022/23","Kyogo Furuhashi","Celtic"),("2023/24","Lawrence Shankland","Hearts"),
       ("2024/25","Daizen Maeda","Celtic"),("2025/26","Claudio Braga","Hearts")]
YPY = [("2000/01","Stiliyan Petrov","Celtic"),("2001/02","Kevin McNaughton","Aberdeen"),("2002/03","James McFadden","Motherwell"),("2003/04","Stephen Pearson","Celtic"),
       ("2004/05","Derek Riordan","Hibernian"),("2005/06","Shaun Maloney","Celtic"),("2006/07","Steven Naismith","Kilmarnock"),("2007/08","Aiden McGeady","Celtic"),
       ("2008/09","James McCarthy","Hamilton"),("2009/10","Danny Wilson","Rangers"),("2010/11","David Goodwillie","Dundee United"),("2011/12","James Forrest","Celtic"),
       ("2012/13","Leigh Griffiths","Hibernian"),("2013/14","Andy Robertson","Dundee United"),("2014/15","Jason Denayer","Celtic"),("2015/16","Kieran Tierney","Celtic"),
       ("2016/17","Kieran Tierney","Celtic"),("2017/18","Kieran Tierney","Celtic"),("2018/19","Ryan Kent","Rangers"),("2020/21","David Turnbull","Celtic"),
       ("2021/22","Liel Abada","Celtic"),("2022/23","Malik Tillman","Rangers"),("2023/24","David Watson","Kilmarnock"),("2024/25","Lennon Miller","Motherwell"),
       ("2025/26","Mikey Moore","Rangers")]
for rows, key, title, lvs in [(PPY, "ppy", "PFA Scotland Players' Player of the Year", (1, 1, 0)), (YPY, "ypy", "PFA Scotland Young Player of the Year", (2, 2, 1))]:
    for (a, b), lv in zip([(0, 10), (10, 20), (15, 25)], lvs):
        w = rows[a:b]
        labelled(f"spfl-aw-{key}-{w[0][0]}", title, f"Name the winner of the {title} award each season. There was no award in 2019/20." if any(s == "2020/21" for s, *_ in w) and any(s == "2018/19" for s, *_ in w)
                 else f"Name the winner of the {title} award each season.", f"Seasons {w[0][0]} to {w[-1][0]}", lv, w)

# ---------- cups, relegation and promotion ----------
SCR = [(2001,"Hibernian"),(2002,"Celtic"),(2003,"Dundee"),(2004,"Dunfermline"),(2005,"Dundee United"),(2006,"Gretna"),(2007,"Dunfermline"),(2008,"Queen of the South"),
       (2009,"Falkirk"),(2010,"Ross County"),(2011,"Motherwell"),(2012,"Hibernian"),(2013,"Hibernian"),(2014,"Dundee United"),(2015,"Falkirk"),(2016,"Rangers"),
       (2017,"Aberdeen"),(2018,"Motherwell"),(2019,"Hearts"),(2020,"Hearts"),(2021,"Hibernian"),(2022,"Hearts"),(2023,"Inverness CT"),(2024,"Rangers"),
       (2025,"Celtic"),(2026,"Dunfermline")]
for a, lv in [(2001, 2), (2007, 2), (2017, 1)]:
    w = [(str(y), c, "") for y, c in SCR if a <= y < a + 10]
    labelled(f"spfl-cup-ru-{a}", "Scottish Cup runners-up", "Name the club that lost the Scottish Cup final each year.", f"Years {a} to {a+9}", lv, [(l, c, "runners-up") for l, c, _ in w], type="club")
WINS = Counter({"St Johnstone": 3, "Hearts": 2, "Hibernian": 2, "Aberdeen": 2, "St Mirren": 2, "Kilmarnock": 1, "Livingston": 1, "Dundee United": 1, "Inverness CT": 1, "Ross County": 1})
WHEN = {"St Johnstone": "2014 SC, 2021 SC and LC", "Hearts": "2006 and 2012 SC", "Hibernian": "2007 LC, 2016 SC", "Aberdeen": "2014 LC, 2025 SC", "St Mirren": "2013 and 2026 LC",
        "Kilmarnock": "2012 LC", "Livingston": "2004 LC", "Dundee United": "2010 SC", "Inverness CT": "2015 SC", "Ross County": "2016 LC"}
ranked("spfl-cup-others", "Cup winners outside the Old Firm", "Name the clubs other than Celtic and Rangers that have won the Scottish Cup or the League Cup since 2000.",
       "Scottish Cup and League Cup finals, 2000/01 to 2025/26", 1, by(list(WINS.items()), fmt=lambda n, x: f"{x} win{'s' if x > 1 else ''}" + (f" ({WHEN[n]})" if n else ""), poolname="cw"), type="club")
REL = [("2008/09","Inverness CT"),("2009/10","Falkirk"),("2010/11","Hamilton"),("2011/12","Dunfermline"),("2012/13","Dundee"),("2013/14","Hearts"),("2013/14 ","Hibernian"),
       ("2014/15","St Mirren"),("2015/16","Dundee United"),("2016/17","Inverness CT"),("2017/18","Ross County"),("2017/18 ","Partick Thistle"),("2018/19","Dundee"),
       ("2019/20","Hearts"),("2020/21","Hamilton"),("2020/21 ","Kilmarnock"),("2021/22","Dundee"),("2022/23","Dundee United"),("2023/24","Livingston"),
       ("2024/25","St Johnstone"),("2024/25 ","Ross County"),("2025/26","Livingston")]
PRO = [("2011/12","Ross County"),("2011/12 ","Dundee"),("2012/13","Partick Thistle"),("2013/14","Dundee"),("2013/14 ","Hamilton"),("2014/15","Hearts"),("2015/16","Rangers"),
       ("2016/17","Hibernian"),("2017/18","St Mirren"),("2017/18 ","Livingston"),("2018/19","Ross County"),("2019/20","Dundee United"),("2020/21","Hearts"),("2020/21 ","Dundee"),
       ("2021/22","Kilmarnock"),("2022/23","Dundee"),("2023/24","Dundee United"),("2024/25","Falkirk"),("2024/25 ","Livingston"),("2025/26","St Johnstone")]
for rows, key, title, brief, lvs in [(REL, "rel", "Relegated from the top flight", "Name the clubs relegated from the Scottish top flight each season, play-off losers included. A club can fill more than one slot.", (2, 1)),
                                     (PRO, "pro", "Promoted to the top flight", "Name the clubs promoted to the Scottish top flight each season, play-off winners included. A club can fill more than one slot.", (2, 1))]:
    for w, lv in [(rows[-20:-10], lvs[0]), (rows[-10:], lvs[1])]:
        labelled(f"spfl-{ {'rel': 'relegated', 'pro': 'promoted'}[key] }-{w[0][0].strip()}", title, brief + (" Rangers went up in 2016 after starting again in the bottom division in 2012." if key == "pro" and any(c == "Rangers" for _, c in w) else ""),
                 f"Seasons {w[0][0].strip()} to {w[-1][0].strip()}", lv, [(l, c, "play-off" if l.endswith(" ") else "") for l, c in w], type="club")

# ---------- European final line-ups (SPFL_LISTS.md 8: Wikipedia and FitbaStats agree on every name; where the two disagree on
# positions the slot just says defender, midfielder or forward) ----------
for id, team, final, other, when, res, xi in [
    ("spfl-xi-2003-cel", "Celtic", "2003 UEFA Cup final", "Porto", "Seville, 21 May 2003", "lost 3-2 after extra time",
     [("CB","Johan Mjallby","No. 35"),("CB","Bobo Balde","No. 6"),("CB","Joos Valgaeren","No. 5"),("RM","Didier Agathe","No. 17"),("DM","Paul Lambert","No. 14"),
      ("CM","Stiliyan Petrov","No. 19"),("CM","Neil Lennon","No. 18"),("LM","Alan Thompson","No. 8"),("CF","Chris Sutton","No. 9"),("CF","Henrik Larsson","No. 7")]),
    ("spfl-xi-2008-ran", "Rangers", "2008 UEFA Cup final", "Zenit", "Manchester, 14 May 2008", "lost 2-0",
     [("DF","Kirk Broadfoot","No. 21"),("DF","David Weir","No. 3"),("DF","Carlos Cuellar","No. 24"),("DF","Sasa Papac","No. 5"),("MF","Brahim Hemdani","No. 7"),
      ("MF","Barry Ferguson","No. 6"),("MF","Kevin Thomson","No. 8"),("MF","Steven Davis","No. 35"),("MF","Steven Whittaker","No. 28"),("FW","Jean-Claude Darcheville","No. 19")]),
    ("spfl-xi-2022-ran", "Rangers", "2022 Europa League final", "Eintracht Frankfurt", "Seville, 18 May 2022", "drew 1-1 and lost 5-4 on penalties",
     [("RB","James Tavernier","No. 2"),("CB","Connor Goldson","No. 6"),("CB","Calvin Bassey","No. 3"),("LB","Borna Barisic","No. 31"),("CM","Ryan Jack","No. 8"),
      ("CM","John Lundstram","No. 4"),("CM","Glen Kamara","No. 18"),("FW","Scott Wright","No. 23"),("FW","Joe Aribo","No. 17"),("FW","Ryan Kent","No. 14")])]:
    board(id, "person", f"{team}'s starters, {final}", f"Name the ten outfield players {team} started with in the {final} against {other} (they {res}).",
          f"{final}, {when}", 1, [{"label": l, "club": n, "val": v} for l, n, v in xi])

# ---------- transfers (SPFL_TRANSFERS.md: Transfermarkt plus a news report for every fee; deals from July 2000 to September 2026,
# ranked by the fee reported at the time in pounds, guaranteed part only) ----------
FEE = "Deals from July 2000 to the end of the summer 2026 window"
ranked("spfl-fee-celtic-sales", "Celtic's biggest sales", "Name the ten players Celtic have sold for the biggest fees since 2000.", FEE, 0,
       [(["Kieran Tierney","Matt O'Riley","Jota"],"£25m","cs25",3),("Arne Engels","£22m to West Ham, 2026"),("Moussa Dembele","£19.7m to Lyon, 2018"),
        ("Nicolas Kuhn","about £16.5m to Como, 2025"),("Odsonne Edouard","£14m to Crystal Palace, 2021"),("Kristoffer Ajer","£13.5m to Brentford, 2021"),
        ("Virgil van Dijk","£13m to Southampton, 2015"),("Victor Wanyama","£12.5m to Southampton, 2013")],
       {"Fraser Forster":"Fraser Forster went for £10m, just outside.","Kyogo Furuhashi":"Kyogo went for a reported £10m, just outside.","Daizen Maeda":"Daizen Maeda went for a reported £10m, just outside.",
        "Jeremie Frimpong":"Jeremie Frimpong went for about £10m, just outside.","Aiden McGeady":"Aiden McGeady went for £9.5m, just outside."})
ranked("spfl-fee-celtic-buys", "Celtic's biggest signings", "Name the players Celtic have paid the biggest fees for since 2000. Jota was signed twice, so he can fill two places. Six players cost £6m, so any three of them fill the last three places.", FEE, 1,
       [(["Kasper Hogh","Arne Engels"],"£11m","cb11",2),("Adam Idah","£9.5m from Norwich, 2024"),(["Odsonne Edouard","Jota"],"£9m","cb9",2),
        ("Christopher Jullien","£7m from Toulouse, 2019"),("Jota","£6.5m from Benfica, 2022"),
        (["Chris Sutton","John Hartson","Cameron Carter-Vickers","Auston Trusty","Haissem Hassan","Camilo Duran"],"£6m","cb6",3)],
       {"Eyal Berkovic":"Eyal Berkovic cost £5.75m in 1999, before this list starts.","Neil Lennon":"Neil Lennon cost £5.75m, just outside.","Sebastian Tounekti":"Sebastian Tounekti cost £5.2m, just outside."})
ranked("spfl-fee-rangers-sales", "Rangers' biggest sales", "Name the ten players Rangers have sold for the biggest fees since 2000.", FEE, 1,
       [("Calvin Bassey","£19.6m to Ajax, 2022"),("Nathan Patterson","£11.5m to Everton, 2022"),("Hamza Igamane","£10.4m to Lille, 2025"),("Alan Hutton","£9m to Spurs, 2008"),
        ("Giovanni van Bronckhorst","£8.5m to Arsenal, 2001"),("Jean-Alain Boumsong","£8m to Newcastle, 2005"),("Carlos Cuellar","£7.8m to Aston Villa, 2008"),
        ("Barry Ferguson","£7.5m to Blackburn, 2003"),("Tore Andre Flo","£6.75m to Sunderland, 2002"),(["Joe Aribo","Jefte"],"£6m","rs6",1)],
       {"Nikica Jelavic":"Nikica Jelavic went for £5.5m, just outside.","Glen Kamara":"Glen Kamara went for about £5m, just outside."})
ranked("spfl-fee-rangers-buys", "Rangers' biggest signings", "Name the ten players Rangers have paid the biggest fees for since 2000.", FEE, 1,
       [("Tore Andre Flo","£12m from Chelsea, 2000"),("Kevin Kelsy","£9m from Portland Timbers, 2026"),("Kim Min-su","£8.5m from Girona, 2026"),
        ("Youssef Chermiti","£8m from Everton, 2025"),(["Ryan Kent","Michael Ball"],"£6.5m","rb65",2),("Ivor Pandur","£6m from Hull, 2026"),
        ("Mikel Arteta","£5.8m from Barcelona, 2002"),("Danilo","£5.2m from Feyenoord, 2023"),("Ryan Naderi","£4.7m from Hansa Rostock, 2026")],
       {"Andrei Kanchelskis":"Andrei Kanchelskis cost £5.5m in 1998, before this list starts.","Vanja Dragojevic":"Vanja Dragojevic cost about £4.6m, just outside.",
        "Ronald de Boer":"Ronald de Boer cost £4.5m, just outside."})
ranked("spfl-fee-other-sales", "Biggest sales outside the Old Firm", "Name the players sold for the biggest fees by Scottish top flight clubs other than Celtic and Rangers since 2000.", FEE, 2,
       [("Craig Gordon","£9m, Hearts to Sunderland, 2007"),(["Bojan Miovski","Kieron Bowie"],"about £6m to £7m","os67",2),("Elijah Just","about £5m to £6m, Motherwell to Swansea, 2026"),
        ("Lennon Miller","£4.75m, Motherwell to Udinese, 2025"),("Scott Brown","£4.4m, Hibernian to Celtic, 2007"),("Calvin Ramsay","£4.2m, Aberdeen to Liverpool, 2022"),
        ("David Turnbull","£3.25m, Motherwell to Celtic, 2020"),(["Scott McKenna","Steven Fletcher","Martin Boyle","Josh Doig","Lewis Ferguson","Ryan Gauld"],"£3m","os3",2)],
       {"Andy Robertson":"Andy Robertson went from Dundee United to Hull for £2.85m, just outside.","John McGinn":"John McGinn went from Hibernian to Aston Villa for £2.75m, just outside."})

# ---------- players (spfl_players.csv, Transfermarkt; counted by Transfermarkt's player id, so two players who share a name stay apart) ----------
PR = list(csv.DictReader(open(D + "spfl_players.csv")))
for r in PR:
    r["apps"] = int(r["apps"] or 0); r["goals"] = int(r["goals"] or 0); r["assists"] = None if r["assists"] == "" else int(r["assists"]); r["name"] = plain(r["player"])
PNAME = {r["tm_player_id"]: r["name"] for r in PR}
def tally(rows, f):
    t = Counter()
    for r in rows: t[r["tm_player_id"]] += r[f] or 0
    return t
SECOND = defaultdict(dict)
for r in csv.DictReader(open(D + "second_source.csv")): SECOND[r["board"]][r["player"]] = int(r["value"])
def top(rows, f, word, poolname, board=None, margin=1):
    """the top ten by Transfermarkt. With a second source for the board (second_source.csv), the ten must be the same in both;
    a figure the two disagree on shows both, and players whose order isn't certain (level in either source, or the other way
    round in the second) share their places as a pool"""
    t = Counter({PNAME[p]: v for p, v in tally(rows, f).items() if v})
    two = SECOND.get(board)
    if not two:
        # one source only: where we could compare, the two sources differed by a goal or a game, so players within one of each
        # other share their places, and a gap of one at the cut brings the next player into a shared 10th
        order = [n for n, _ in t.most_common()]; out, i, used = [], 0, 0
        while used < 10:
            bl = [order[i]]
            while i + len(bl) < len(order) and t[bl[-1]] - t[order[i + len(bl)]] <= margin: bl.append(order[i + len(bl)])
            k = min(len(bl), 10 - used)
            if len(bl) == 1: out.append((bl[0], f"{t[bl[0]]} {word}"))
            else:
                lo, hi = t[bl[-1]], t[bl[0]]
                out.append((bl, f"{lo} {word}" if lo == hi else f"{lo} to {hi} {word}", f"{poolname}{len(out)}", k))
            used += k; i += len(bl)
        return out
    order = [n for n, _ in t.most_common()]
    ten, rest = order[:10], order[10:]
    assert all(n in two for n in ten), (board, [n for n in ten if n not in two])
    assert t[ten[9]] > t[rest[0]] and all(two[ten[9]] > two.get(n, -1) for n in rest[:3]) and min(two[n] for n in ten) > max([two.get(n, -1) for n in rest] or [-1]), (board, "the cut isn't clear in both sources")
    blocks = [[ten[0]]]
    for a, b in zip(ten, ten[1:]):
        if t[a] == t[b] or two[a] <= two[b]: blocks[-1].append(b)
        else: blocks.append([b])
    fig = lambda n: f"{t[n]}" if t[n] == two[n] else f"{min(t[n], two[n])} or {max(t[n], two[n])}"
    out = []
    for k, bl in enumerate(blocks):
        if len(bl) == 1: out.append((bl[0], f"{fig(bl[0])} {word}"))
        else:
            lo, hi = min(min(t[n], two[n]) for n in bl), max(max(t[n], two[n]) for n in bl)
            out.append((bl, f"{lo} {word}" if lo == hi else f"{lo} to {hi} {word}", f"{poolname}{k}", len(bl)))
    return out
CLUBS = {"cel": "Celtic", "ran": "Rangers", "abe": "Aberdeen", "hea": "Hearts", "hib": "Hibernian", "mot": "Motherwell", "dun": "Dundee United"}
POSS = {"Celtic": "Celtic's", "Rangers": "Rangers'", "Aberdeen": "Aberdeen's", "Hearts": "Hearts'", "Hibernian": "Hibernian's", "Motherwell": "Motherwell's", "Dundee United": "Dundee United's"}
ranked("spfl-goals", "Scottish top flight scorers since 2000", "Name the ten players with the most Scottish top flight league goals since 2000.", SINCE, 0, top(PR, "goals", "goals", "g"))
for k, lv in [("cel", 0), ("ran", 0), ("abe", 2), ("hea", 2), ("hib", 2)]:
    c = CLUBS[k]; rows = [r for r in PR if r["club"] == c]
    ranked(f"spfl-{k}-goals", f"{POSS[c]} top flight scorers since 2000", f"Name {POSS[c]} ten highest scorers in Scottish top flight league games since 2000.", SINCE, lv, top(rows, "goals", "goals", k + "g", f"spfl-{k}-goals"))
for k, lv in [("cel", 0), ("ran", 0), ("abe", 2), ("hea", 2), ("mot", 2), ("dun", 2)]:
    c = CLUBS[k]; rows = [r for r in PR if r["club"] == c]
    ranked(f"spfl-{k}-apps", f"{POSS[c]} most appearances since 2000", f"Name the ten players with the most Scottish top flight league appearances for {c} since 2000. Substitute appearances count.", SINCE, lv, top(rows, "apps", "games", k + "a", f"spfl-{k}-apps"))
ASSIST = "League seasons 2007/08 to 2025/26 (assists are only fully recorded from 2007/08)"
for k in ("cel", "ran"):
    c = CLUBS[k]; rows = [r for r in PR if r["club"] == c and r["season"] >= "2007/08"]
    ranked(f"spfl-{k}-assists", f"{POSS[c]} most assists", f"Name the ten players with the most Scottish top flight league assists for {c} since 2007/08.", ASSIST, 1, top(rows, "assists", "assists", k + "x"))
# best season: goals in one season, both clubs added together if a player moved mid-season; each player once
seas = Counter(); where = defaultdict(list)
for r in PR:
    if r["goals"]: seas[(r["tm_player_id"], r["season"])] += r["goals"]; where[(r["tm_player_id"], r["season"])].append(f"{r['goals']} {r['club']}")
bestp = {}
for (p, s), g in seas.items():
    if p not in bestp or g > bestp[p][0]: bestp[p] = (g, s)
ranked("spfl-goals-season", "Biggest Scottish top flight seasons", "Name the players with the highest league goal tally in a single Scottish top flight season since 2000. Each player counts once, for his best season. Goals for two clubs in the same season are added together.",
       SINCE, 1, by([(PNAME[p], g) for p, (g, s) in bestp.items()], fmt=lambda n, x: f"{x} goals" + (f" in {[v for k, v in bestp.items() if PNAME[k] == n][0][1]}" if n else ""), poolname="bs"))
twenty = Counter(p for (p, s), g in seas.items() if g >= 20)
ranked("spfl-goals-20", "Most 20-goal Scottish top flight seasons", "Name the players with the most Scottish top flight seasons of 20 league goals or more since 2000. Seventeen players have done it once, so any of them fills the last places.",
       SINCE, 2, by([(PNAME[p], n) for p, n in twenty.items()], fmt=lambda n, x: f"{x} season{'s' if x > 1 else ''}", poolname="g20"))
NAT = defaultdict(Counter)
for r in PR:
    if r["nationality"] != "Scotland": NAT[r["nationality"]][r["tm_player_id"]] += r["goals"]
bestn = {n: max(c.items(), key=lambda x: x[1]) for n, c in NAT.items()}
NATS = {PNAME[p]: n for n, (p, g) in bestn.items()}
ranked("spfl-goals-nations", "Each country's top scorer in Scotland", "Name the players who are the top Scottish top flight scorer from their country since 2000, for the ten countries whose best scorer has the most goals. Scotland doesn't count.",
       SINCE, 1, by([(PNAME[p], g) for n, (p, g) in bestn.items()], fmt=lambda n, x: f"{x} goals" + (f" ({NATS[n]})" if n else ""), poolname="nat"))

# letter boards: Celtic or Rangers players since 2000 by the first letter of the surname (the first word after the first name, and the last word, both count)
def letters(n):
    w = n.split()
    return {w[-1][0].upper(), *(x[0].upper() for x in w[1:])} if len(w) > 1 else {w[0][0].upper()}
for k, ls in [("cel", "MBS"), ("ran", "MBC")]:
    c = CLUBS[k]; apps = tally([r for r in PR if r["club"] == c], "apps")
    for l in ls:
        names = [PNAME[p] for p, _ in apps.most_common() if l in letters(PNAME[p])]
        open_board(f"spfl-letter-{k}-{l.lower()}", f"{c} players beginning with {l}", f"Name players who have played for {c} in the Scottish top flight since 2000 and whose surname begins with {l}.",
                   f"{c} league players, 2000/01 to 2025/26", 1, names, names[:10], f"{{n}} didn't play for {c} in the Scottish top flight after 2000, or the surname doesn't begin with {l}.")


# ---------- write into index.html ----------
import sys
if "--dry" in sys.argv:
    for q in Q + OPEN: print(q["id"], [(s["club"], s.get("val")) for s in q.get("slots", [])] or q["names"][:12])
    sys.exit()
ids = [q["id"] for q in Q + OPEN]; assert len(ids) == len(set(ids))
print(len(Q), "boards and", len(OPEN), "open boards")
h = open("index.html", encoding="utf-8").read()
for name, data in [("EXTRA_Q5", Q), ("SPFL_OPEN", OPEN)]:
    h, n = re.subn(r"const %s = \[.*?\];\n" % name, lambda m: f"const {name} = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n", h, count=1, flags=re.S)
    assert n == 1, name
open("index.html", "w", encoding="utf-8").write(h)
