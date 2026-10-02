"""Build EXTRA_Q4, the Premier League records boards (managers, scoring records, transfer fees), and write it into index.html.

Rows are written out below; the 20-goal season boards read docs/data/Tenaball_EPL_Data_2026-10-01.txt (a text copy of Craig's workbook).
Sources, corrections and live lists to re-check: docs/PL_RECORDS_SOURCES.md.
Run from the repo root: python3 scripts/build-pl-records.py
"""
import json, re
NOW = "1 October 2026"
Q = []
def ranked(id, title, brief, period, level, rows, notes=None, type="person"):
    """rows: (name, val) or (alts list, val, poolname, count) for a tie at the end"""
    slots = []
    for r in rows:
        if isinstance(r[0], list):
            alts, val, pool, n = r
            for k in range(n): slots.append({"label": str(len(slots)+1), "club": alts[k], "alts": alts, "pool": pool, "val": val})
        else:
            slots.append({"label": str(len(slots)+1), "club": r[0], "val": r[1]})
    assert len(slots) == 10, (id, len(slots))
    Q.append({"id": id, "cat": "pl", "type": type, "title": title, "brief": brief, "period": period, "level": level, "hard": level == 2, "numeric": True, "slots": slots, "notes": notes or {}})
def labelled(id, title, brief, period, level, rows, notes=None):
    assert len(rows) == 10, id
    Q.append({"id": id, "cat": "pl", "type": "person", "title": title, "brief": brief, "period": period, "level": level, "hard": level == 2, "slots": [{"label": l, "club": n, "val": v} for l, n, v in rows], "notes": notes or {}})

LIVE = f"Premier League only, 1992/93 to {NOW}"
DONE = "Premier League era, 1992/93 to 2025/26"

# managers
ranked("pl-at-mgr-wins", "Most Premier League wins as a manager", "Name the ten managers who have won the most Premier League games.", LIVE, 1,
 [("Alex Ferguson","528 wins"),("Arsene Wenger","476 wins"),("David Moyes","292 wins"),("Pep Guardiola","269 wins"),("Harry Redknapp","236 wins"),
  ("Jose Mourinho","217 wins"),("Jurgen Klopp","209 wins"),("Sam Allardyce","178 wins"),("Rafael Benitez","173 wins"),("Mark Hughes","158 wins")],
 {"Mikel Arteta":"Mikel Arteta is 11th with 153 and closing in.","Mauricio Pochettino":"Mauricio Pochettino is just outside with 150.","Eddie Howe":"Eddie Howe has 140, not quite top ten.","Roy Hodgson":"Roy Hodgson has 136, just short.","Steve Bruce":"Steve Bruce has 133, just short."})
ranked("pl-at-mgr-winpct", "Best Premier League win rate as a manager", "Name the ten managers with the best Premier League win percentage, from at least 50 games.", LIVE, 2,
 [("Pep Guardiola","70.8%"),("Alex Ferguson","65.2%"),("Antonio Conte","62.9%"),("Jurgen Klopp","62.6%"),("Roberto Mancini","61.7%"),
  ("Mikel Arteta","60.5%"),("Jose Mourinho","59.8%"),("Arsene Wenger","57.5%"),("Thomas Tuchel","55.6%"),("Arne Slot","55.3%")],
 {"Carlo Ancelotti":"Carlo Ancelotti is just outside on 54.5%.","Enzo Maresca":"Enzo Maresca is on 53.2%, just outside.","Manuel Pellegrini":"Manuel Pellegrini is on 52.6%, not quite top ten.","Mauricio Pochettino":"Mauricio Pochettino is on about 51%."})
FOUR = ["Ron Atkinson","Rafael Benitez","David Moyes","Nuno Espirito Santo","Claudio Ranieri","Marco Silva","Graeme Souness","Neil Warnock","Chris Hughton"]
ranked("pl-at-mgr-clubs", "Most Premier League clubs managed", "Name the managers who have taken charge of the most different Premier League clubs. Caretaker spells count. Nine managers have had four, so any four of them fill the last four places.", LIVE, 2,
 [("Sam Allardyce","9 clubs"),(["Roy Hodgson","Mark Hughes"],"6 clubs","mgrc6",2),(["Harry Redknapp","Steve Bruce","Alan Pardew"],"5 clubs","mgrc5",3),(FOUR,"4 clubs","mgrc4",4)],
 {"Tony Pulis":"Tony Pulis managed three Premier League clubs.","Martin O'Neill":"Martin O'Neill managed three Premier League clubs.","Sean Dyche":"Sean Dyche managed three Premier League clubs.","Brendan Rodgers":"Brendan Rodgers managed three Premier League clubs."})

# scoring records
ranked("pl-at-season-goals", "Biggest Premier League seasons", "Name the ten players with the highest goal tally in a single Premier League season. Each player counts once, for his best season. The 42-game seasons up to 1994/95 count.", "Premier League seasons 1992/93 to 2025/26", 1,
 [("Erling Haaland","36 in 2022/23"),("Andy Cole","34 in 1993/94"),("Alan Shearer","34 in 1994/95"),("Mohamed Salah","32 in 2017/18"),("Cristiano Ronaldo","31 in 2007/08"),
  ("Luis Suarez","31 in 2013/14"),("Kevin Phillips","30 in 1999/00"),("Thierry Henry","30 in 2003/04"),("Robin van Persie","30 in 2011/12"),("Harry Kane","30, twice")],
 {"Didier Drogba":"Didier Drogba's best was 29 in 2009/10, one short.","Wayne Rooney":"Wayne Rooney's best was 27.","Sergio Aguero":"Sergio Aguero's best was 26.","Ruud van Nistelrooy":"Ruud van Nistelrooy's best was 25.","Jamie Vardy":"Jamie Vardy's best was 24."})
TWO = ["Andy Cole","Ian Wright","Robbie Fowler","Jimmy Floyd Hasselbaink","Didier Drogba","Wayne Rooney","Carlos Tevez","Robin van Persie","Luis Suarez","Diego Costa","Pierre-Emerick Aubameyang","Alexander Isak"]
ranked("pl-at-20-goals", "Most 20-goal Premier League seasons", "Name the players with the most Premier League seasons of 20 goals or more. Twelve players have done it twice, so any one of them fills 10th.", "Premier League seasons 1992/93 to 2025/26", 2,
 [("Alan Shearer","7 seasons"),("Harry Kane","6 seasons"),("Sergio Aguero","6 seasons"),("Thierry Henry","5 seasons"),("Mohamed Salah","5 seasons"),
  ("Ruud van Nistelrooy","4 seasons"),("Erling Haaland","4 seasons"),("Les Ferdinand","3 seasons"),("Jamie Vardy","3 seasons"),(TWO,"2 seasons","g20two",1)])
FIVE = ["Dimitar Berbatov","Andy Cole","Ruud van Nistelrooy","Robin van Persie","Raheem Sterling","Ian Wright"]
ranked("pl-at-hattricks", "Most Premier League hat-tricks", "Name the ten players with the most Premier League hat-tricks. Six players have five, so any one of them fills 10th.", LIVE, 1,
 [("Sergio Aguero","12 hat-tricks"),("Alan Shearer","11 hat-tricks"),("Robbie Fowler","9 hat-tricks"),("Erling Haaland","8 hat-tricks"),("Thierry Henry","8 hat-tricks"),
  ("Harry Kane","8 hat-tricks"),("Michael Owen","8 hat-tricks"),("Wayne Rooney","7 hat-tricks"),("Luis Suarez","6 hat-tricks"),(FIVE,"5 hat-tricks","ht5",1)],
 {"Mohamed Salah":"Mohamed Salah has 4, one short.","Heung-min Son":"Son has 4, one short.","Cole Palmer":"Cole Palmer has 4, one short."})
ranked("pl-at-fastest-50", "Fastest to 50 Premier League goals", "Name the ten players who reached 50 Premier League goals in the fewest games. Thierry Henry and Kevin Phillips share 10th, so either counts.", "Premier League seasons 1992/93 to 2025/26", 2,
 [("Erling Haaland","48 games"),("Andy Cole","65 games"),("Alan Shearer","66 games"),("Ruud van Nistelrooy","68 games"),("Fernando Torres","72 games"),
  ("Mohamed Salah","72 games"),("Alexander Isak","76 games"),("Pierre-Emerick Aubameyang","79 games"),("Sergio Aguero","81 games"),(["Thierry Henry","Kevin Phillips"],"83 games","f50",1)],
 {"Diego Costa":"Diego Costa took 85 games, just outside."})
ranked("pl-at-fastest-100", "Fastest to 100 Premier League goals", "Name the ten players who reached 100 Premier League goals in the fewest games. Michael Owen and Andy Cole share 10th, so either counts.", "Premier League seasons 1992/93 to 2025/26", 2,
 [("Erling Haaland","111 games"),("Alan Shearer","124 games"),("Harry Kane","141 games"),("Sergio Aguero","147 games"),("Thierry Henry","160 games"),
  ("Mohamed Salah","162 games"),("Ian Wright","173 games"),("Robbie Fowler","175 games"),("Les Ferdinand","178 games"),(["Michael Owen","Andy Cole"],"185 games","f100",1)],
 {"Robin van Persie":"Robin van Persie took 197 games, just outside."})
NINETEEN = ["Jermain Defoe","John Terry","Paul Scholes","Phil Neville","Sol Campbell","Shay Given"]
ranked("pl-at-apps-seasons", "Most Premier League seasons played", "Name the players who have played in the most Premier League seasons (one game in a season counts). Six players have 19, so any five of them fill the last five places.", DONE, 2,
 [("James Milner","24 seasons"),("Ryan Giggs","22 seasons"),("Gareth Barry","21 seasons"),(["Frank Lampard","Rio Ferdinand"],"20 seasons","sp20",2),(NINETEEN,"19 seasons","sp19",5)],
 {"Danny Welbeck":"Danny Welbeck has 18, one short.","David James":"David James played in 18 seasons.","Mark Schwarzer":"Mark Schwarzer played in 18 seasons.","Ashley Young":"Ashley Young played in 18 seasons.","Peter Crouch":"Peter Crouch played in 18 seasons.","Michael Carrick":"Michael Carrick played in 18 seasons.","Gary Neville":"Gary Neville played in 18 seasons."})

# transfers (headline fees as reported in the UK)
FEES = "All time, to 1 September 2026"
ranked("pl-fee-signings", "Most expensive Premier League signings", "Name the players behind the ten biggest fees paid by Premier League clubs (headline fees as reported in the UK). A player can fill more than one slot. Jack Grealish and Sandro Tonali share 10th, so either counts.", FEES, 1,
 [("Alexander Isak","£125m, 2025"),("Enzo Fernandez","£125m, 2026"),("Bradley Barcola","£123m, 2026"),("Morgan Rogers","£117m, 2026"),
  ("Elliot Anderson","£116m, 2026"),("Florian Wirtz","£116m, 2025"),("Moises Caicedo","£115m, 2023"),("Enzo Fernandez","£106.8m, 2023"),
  ("Declan Rice","£105m, 2023"),(["Jack Grealish","Sandro Tonali"],"£100m","fee100",1)],
 {"Romelu Lukaku":"Romelu Lukaku's £97.5m move to Chelsea is just outside.","Paul Pogba":"Paul Pogba's £89m move is now well down the list."})
ranked("pl-fee-gk", "Most expensive goalkeepers", "Name the goalkeepers behind the ten biggest fees paid by Premier League clubs for a keeper (headline fees as reported in the UK). A player can fill more than one slot.", FEES, 2,
 [("Kepa Arrizabalaga","£71.6m, 2018"),("Alisson","£66.8m, 2018"),("Andre Onana","£47.2m, 2023"),("James Trafford","£45m, 2026"),
  ("Ederson","£34.9m, 2017"),("Jordan Pickford","£30m, 2017"),("Aaron Ramsdale","£30m, 2021"),("Giorgi Mamardashvili","£29m, 2024"),
  ("James Trafford","£27m, 2025"),("David Raya","£27m, 2024")],
 {"Gianluigi Donnarumma":"Gianluigi Donnarumma's £26m move to Man City is just outside."})
ranked("pl-fee-def", "Most expensive defenders", "Name the defenders behind the ten biggest fees paid by Premier League clubs for a defender (headline fees as reported in the UK).", FEES, 2,
 [("Harry Maguire","£80m, 2019"),("Josko Gvardiol","£77.6m, 2023"),("Virgil van Dijk","£75m, 2018"),("Wesley Fofana","£75m, 2022"),
  ("Ruben Dias","£65m, 2020"),("Marc Cucurella","£62m, 2022"),("Joao Cancelo","£60m, 2019"),("Jeremy Jacquet","£60m, 2026"),
  ("Leny Yoro","£59.9m, 2024"),("Aymeric Laporte","£57m, 2018")],
 {"Lisandro Martinez":"Lisandro Martinez's £56.7m move is just outside.","Ezri Konsa":"Ezri Konsa's £55m move to Arsenal is just outside.","Marc Guehi":"Marc Guehi moved to Man City for only £20m."})
ranked("pl-fee-mid", "Most expensive midfielders", "Name the midfielders behind the ten biggest fees paid by Premier League clubs for a midfielder, attacking midfielders included (headline fees as reported in the UK). A player can fill more than one slot.", FEES, 2,
 [("Enzo Fernandez","£125m, 2026"),("Morgan Rogers","£117m, 2026"),("Elliot Anderson","£116m, 2026"),("Florian Wirtz","£116m, 2025"),
  ("Moises Caicedo","£115m, 2023"),("Enzo Fernandez","£106.8m, 2023"),("Declan Rice","£105m, 2023"),("Sandro Tonali","£100m, 2026"),
  ("Paul Pogba","£89m, 2016"),("Ayyoub Bouaddi","£86m, 2026")],
 {"Mateus Fernandes":"Mateus Fernandes's £85m move to Spurs is just outside.","Bruno Guimaraes":"Bruno Guimaraes's £75m move is outside the top ten."})
ranked("pl-fee-fwd", "Most expensive forwards", "Name the strikers and wingers behind the ten biggest fees paid by Premier League clubs for a forward (headline fees as reported in the UK). A player can fill more than one slot.", FEES, 2,
 [("Alexander Isak","£125m, 2025"),("Bradley Barcola","£123m, 2026"),("Jack Grealish","£100m, 2021"),("Romelu Lukaku","£97.5m, 2021"),
  ("Romelu Lukaku","£90m, 2017"),("Mykhailo Mudryk","£88.5m, 2023"),("Antony","£85.5m, 2022"),("Savinho","£85m, 2026"),
  ("Darwin Nunez","£85m, 2022"),("Hugo Ekitike","£79m, 2025")],
 {"Benjamin Sesko":"Benjamin Sesko's £73.7m move to Man Utd is just outside."})
labelled("pl-fee-clubbuy", "Club record signings", "Name each club's record signing (headline fees as reported in the UK).", FEES, 1,
 [("Man Utd","Paul Pogba","£89m, 2016"),("Liverpool","Alexander Isak","£125m, 2025"),("Arsenal","Declan Rice","£105m, 2023"),
  ("Chelsea","Morgan Rogers","£117m, 2026"),("Man City","Enzo Fernandez","£125m, 2026"),("Spurs","Sandro Tonali","£100m, 2026"),
  ("Newcastle","Nick Woltemade","£69m, 2025"),("Aston Villa","Nicolas Jackson","£65m, 2026"),("West Ham","Lucas Paqueta","£51m, 2022"),("Everton","Gylfi Sigurdsson","£45m, 2017")])


# biggest sales (headline fees, estimates as published by the most prominent UK outlets), researched 2 October 2026
SALES = "All time, to the end of the summer 2026 window"
SB = "Fees are estimates: the biggest published figure, add-ons included."
def sales(id, title, brief, level, rows, notes=None):
    ranked(id, title, brief + " " + SB, SALES, level, rows, notes)
sales("pl-fee-sales", "Biggest sales by Premier League clubs", "Name the players behind the ten biggest fees received by Premier League clubs. Harry Kane, Jack Grealish and Sandro Tonali all went for £100m, so any two of them fill 9th and 10th.", 1,
 [("Philippe Coutinho","£142m, 2018"),("Eden Hazard","£130m, 2019"),("Alexander Isak","£125m, 2025"),("Enzo Fernandez","£125m, 2026"),("Morgan Rogers","£117m, 2026"),
  ("Elliot Anderson","£116m, 2026"),("Moises Caicedo","£115m, 2023"),("Declan Rice","£105m, 2023"),(["Harry Kane","Jack Grealish","Sandro Tonali"],"£100m","sale100",2)],
 {"Romelu Lukaku":"Romelu Lukaku's £90m move from Everton is just outside.","Gareth Bale":"Gareth Bale's £85.3m move is just outside.","Savinho":"Savinho's £85m move to Spurs is just outside."})
sales("pl-fee-sales-mu", "Man Utd's biggest sales", "Name the ten players Man Utd sold for the biggest fees.", 2,
 [("Cristiano Ronaldo","£80m, 2009"),("Romelu Lukaku","£74m, 2019"),("Angel Di Maria","£44.3m, 2015"),("Rasmus Hojlund","£43.2m, 2026"),("Alejandro Garnacho","£40m, 2025"),
  ("Mason Greenwood","£26.7m, 2024"),("Scott McTominay","£25.7m, 2024"),("David Beckham","£25m, 2003"),("Daniel James","£25m, 2021"),("Morgan Schneiderlin","£24m, 2017")],
 {"Memphis Depay":"Memphis Depay's £21.7m move is just outside.","Antony":"Antony's £21.6m move to Real Betis is just outside."})
sales("pl-fee-sales-lfc", "Liverpool's biggest sales", "Name the ten players Liverpool sold for the biggest fees.", 2,
 [("Philippe Coutinho","£142m, 2018"),("Luis Suarez","£75m, 2014"),("Luis Diaz","£65.5m, 2025"),("Darwin Nunez","£56.6m, 2025"),("Fernando Torres","£50m, 2011"),
  ("Raheem Sterling","£49m, 2015"),("Fabinho","£40m, 2023"),("Sadio Mane","£35.1m, 2022"),("Jarell Quansah","£35m, 2025"),("Christian Benteke","£32m, 2016")],
 {"Curtis Jones":"Curtis Jones's £30m move to Inter is just outside.","Xabi Alonso":"Xabi Alonso's £30m move is just outside."})
sales("pl-fee-sales-mci", "Man City's biggest sales", "Name the ten players Man City sold for the biggest fees.", 2,
 [("Savinho","£85m, 2026"),("Julian Alvarez","£81.5m, 2024"),("Rodri","£65.4m, 2026"),("Ferran Torres","£55m, 2022"),("Leroy Sane","£54.8m, 2020"),
  ("Tijjani Reijnders","£52m, 2026"),("Nico Gonzalez","£52m, 2026"),("Raheem Sterling","£47.5m, 2022"),("Gabriel Jesus","£45m, 2022"),("Cole Palmer","£42.5m, 2023")],
 {"Oleksandr Zinchenko":"Oleksandr Zinchenko's £32m move is just outside.","Riyad Mahrez":"Riyad Mahrez's £30m move is just outside."})
SIX = ["Marc Overmars","Emmanuel Adebayor","Samir Nasri","Theo Walcott","Joe Willock","Aaron Ramsdale"]
sales("pl-fee-sales-afc", "Arsenal's biggest sales", "Name the ten players Arsenal sold for the biggest fees. Six players went for £25m, so any three of them fill the last three places.", 2,
 [("Gabriel Martinelli","£60m, 2026"),("Alex Oxlade-Chamberlain","£35m, 2017"),("Alex Iwobi","£35m, 2019"),("Cesc Fabregas","£35m, 2011"),("Folarin Balogun","£34.3m, 2023"),
  ("Emile Smith Rowe","£34m, 2024"),("Eddie Nketiah","£30m, 2024"),(SIX,"£25m","afc25",3)],
 {"Robin van Persie":"Robin van Persie's £24m move to Man Utd is just outside.","Alexis Sanchez":"Alexis Sanchez went to Man Utd in a swap, with no fee."})
sales("pl-fee-sales-cfc", "Chelsea's biggest sales", "Name the ten players Chelsea sold for the biggest fees.", 2,
 [("Eden Hazard","£130m, 2019"),("Enzo Fernandez","£125m, 2026"),("Kai Havertz","£65m, 2023"),("Nicolas Jackson","£65m, 2026"),("Mason Mount","£60m, 2023"),
  ("Oscar","£60m, 2017"),("Alvaro Morata","£58.3m, 2020"),("Diego Costa","£57m, 2017"),("Noni Madueke","£52m, 2025"),("Marc Cucurella","£51.8m, 2026")],
 {"David Luiz":"David Luiz's £50m move is just outside.","Andrey Santos":"Andrey Santos's £50m move to Man Utd is just outside.","Liam Delap":"Liam Delap's £50m move to Forest is just outside."})
sales("pl-fee-sales-tot", "Spurs' biggest sales", "Name the ten players Spurs sold for the biggest fees.", 2,
 [("Harry Kane","£100m, 2023"),("Gareth Bale","£85.3m, 2013"),("Kyle Walker","£54m, 2017"),("Luka Vuskovic","£50m, 2026"),("Brennan Johnson","£35m, 2026"),
  ("Cristian Romero","£34.2m, 2026"),("Luka Modric","£33m, 2012"),("Dimitar Berbatov","£30.75m, 2008"),("Steven Bergwijn","£26.4m, 2022"),("Djed Spence","£25.7m, 2026")],
 {"Oliver Skipp":"Oliver Skipp's £25m move is just outside.","Robbie Keane":"Robbie Keane's £20.3m move is outside the top ten."})
sales("pl-fee-sales-new", "Newcastle's biggest sales", "Name the ten players Newcastle sold for the biggest fees.", 2,
 [("Alexander Isak","£125m, 2025"),("Sandro Tonali","£100m, 2026"),("Bruno Guimaraes","£75m, 2026"),("Anthony Gordon","£69.3m, 2026"),("Andy Carroll","£35m, 2011"),
  ("Elliot Anderson","£35m, 2024"),("Yankuba Minteh","£33m, 2024"),("Moussa Sissoko","£30m, 2016"),("Ayoze Perez","£30m, 2019"),("Allan Saint-Maximin","£30m, 2023")],
 {"Georginio Wijnaldum":"Georginio Wijnaldum's £25m move is just outside.","Aleksandar Mitrovic":"Aleksandar Mitrovic's £22m move is outside the top ten."})

# every 20-goal season, in runs of consecutive seasons that hold exactly ten
TWENTY = [l.split(" | ") for l in open("docs/data/Tenaball_EPL_Data_2026-10-01.txt", encoding="utf-8").read().split("== 20+ Seasons")[1].split("== 20+ Players")[0].splitlines() if re.match(r"^\d\d/\d\d \|", l)]
FIX = {"Sergio Agüero":"Sergio Aguero","Luis Suárez":"Luis Suarez","Jürgen Klinsmann":"Jurgen Klinsmann","Yaya Touré":"Yaya Toure","Alexis Sánchez":"Alexis Sanchez","Sadio Mané":"Sadio Mane","Son Heung-min":"Heung-min Son"}
CLUBFIX = {"Nottm Forest":"Nottingham Forest"}
def full(s): a, b = s.split("/"); y = int(a); return f"{1900+y if y > 50 else 2000+y}/{b}"
WINDOWS = [("23/24","25/26",1),("18/19","20/21",1),("09/10","11/12",2),("02/03","04/05",2),("96/97","01/02",2)]
order = sorted({r[0] for r in TWENTY}, key=lambda s: full(s))
for a, b, lv in WINDOWS:
    seas = [s for s in order if full(a) <= full(s) <= full(b)]
    rows = [(full(r[0]), FIX.get(r[1], r[1]), f"{r[3]} goals") for s in seas for r in TWENTY if r[0] == s]
    from collections import Counter
    assert len(rows) == 10 and max(Counter(r[1] for r in rows).values()) <= 3, (a, b)
    labelled(f"pl-20g-{full(a)}", "Every 20-goal Premier League season", "Name every player who scored 20 or more Premier League goals in a season. A player can fill more than one slot.", f"Seasons {full(a)} to {full(b)}", lv, rows)

for q in Q:
    for s in q["slots"]:
        for t in [s.get("val",""), q["brief"], q["title"], q["period"], *q["notes"].values()]: assert "—" not in t
print(len(Q))
data = json.dumps(Q, ensure_ascii=False, separators=(",", ":"))
h = open("index.html", encoding="utf-8").read()
h, n = re.subn(r"const EXTRA_Q4 = \[.*?\];\n", lambda m: "const EXTRA_Q4 = " + data + ";\n", h, count=1, flags=re.S)
assert n == 1
open("index.html", "w", encoding="utf-8").write(h)
