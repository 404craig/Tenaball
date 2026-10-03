"""Build EXTRA_Q4, the Premier League records boards (managers, scoring records, transfer fees), and write it into index.html.

Rows are written out below; the 20-goal season boards read docs/data/Tenaball_EPL_Data_2026-10-01.txt (a text copy of Craig's workbook).
Sources, corrections and live lists to re-check: docs/PL_RECORDS_SOURCES.md.
Run from the repo root: python3 scripts/build-pl-records.py
"""
import json, re
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
    # a list of names in a row means any of them counts for that slot (for example a record that depends on whether add-ons count)
    slot = lambda l, n, v: {"label": l, "club": n[0], "alts": n, "pool": id[-6:] + l, "val": v} if isinstance(n, list) else {"label": l, "club": n, "val": v}
    Q.append({"id": id, "cat": "pl", "type": "person", "title": title, "brief": brief, "period": period, "level": level, "hard": level == 2, "slots": [slot(l, n, v) for l, n, v in rows], "notes": notes or {}})

LIVE = "Premier League era, 1992/93 to 2025/26"
DONE = "Premier League era, 1992/93 to 2025/26"

# managers
ranked("pl-at-mgr-wins", "Most Premier League wins as a manager", "Name the ten managers who have won the most Premier League games.", LIVE, 1,
 [("Alex Ferguson","528 wins"),("Arsene Wenger","476 wins"),("David Moyes","290 wins"),("Pep Guardiola","269 wins"),("Harry Redknapp","236 wins"),
  ("Jose Mourinho","217 wins"),("Jurgen Klopp","209 wins"),("Sam Allardyce","178 wins"),("Rafael Benitez","173 wins"),("Mark Hughes","158 wins")],
 {"Mauricio Pochettino":"Mauricio Pochettino is 11th with 150, just outside.","Mikel Arteta":"Mikel Arteta is 12th with 149, just outside.","Eddie Howe":"Eddie Howe has 140, not quite top ten.","Roy Hodgson":"Roy Hodgson has 136, just short.","Steve Bruce":"Steve Bruce has 133, just short."})
ranked("pl-at-mgr-winpct", "Best Premier League win rate as a manager", "Name the ten managers with the best Premier League win percentage, from at least 50 games.", LIVE, 2,
 [("Pep Guardiola","70.8%"),("Alex Ferguson","65.2%"),("Antonio Conte","62.9%"),("Jurgen Klopp","62.6%"),("Roberto Mancini","61.7%"),
  ("Mikel Arteta","60.1%"),("Jose Mourinho","59.8%"),("Arsene Wenger","57.5%"),("Thomas Tuchel","55.6%"),("Arne Slot","55.3%")],
 {"Carlo Ancelotti":"Carlo Ancelotti is just outside on 54.5%.","Enzo Maresca":"Enzo Maresca is on 49.1%, not top ten.","Manuel Pellegrini":"Manuel Pellegrini is on 52.6%, not quite top ten.","Mauricio Pochettino":"Mauricio Pochettino is on about 51%."})
ranked("pl-at-mgr-games", "Most Premier League games as a manager", "Name the ten managers who have taken charge of the most Premier League games. Caretaker spells count.", LIVE, 1,
 [("Arsene Wenger","828 games"),("Alex Ferguson","810 games"),("David Moyes","754 games"),("Harry Redknapp","641 games"),("Sam Allardyce","541 games"),
  ("Steve Bruce","476 games"),("Mark Hughes","466 games"),("Roy Hodgson","416 games"),("Pep Guardiola","380 games"),("Eddie Howe","369 games")],
 {"Jose Mourinho":"Jose Mourinho is 11th with 363.","Rafael Benitez":"Rafael Benitez is just outside with 359.","Martin O'Neill":"Martin O'Neill is just outside with 359.","Sean Dyche":"Sean Dyche has 351, just outside.","Jurgen Klopp":"Jurgen Klopp managed 334 Premier League games.","Tony Pulis":"Tony Pulis managed about 320.","Alan Pardew":"Alan Pardew managed about 320."})
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
ranked("pl-at-penalties", "Most Premier League penalties scored", "Name the ten players who have scored the most Premier League penalties.", LIVE, 1,
 [("Alan Shearer","56 penalties"),("Frank Lampard","43 penalties"),("Mohamed Salah","35 penalties"),("Harry Kane","33 penalties"),("Steven Gerrard","31 penalties"),
  ("Mark Noble","28 penalties"),("Sergio Aguero","27 penalties"),("Jamie Vardy","27 penalties"),("Bruno Fernandes","26 penalties"),("Matt Le Tissier","25 penalties")],
 {"Thierry Henry":"Thierry Henry is just outside with 23.","Wayne Rooney":"Wayne Rooney is just outside with 23 (he missed 11).","James Milner":"James Milner scored 18.","Erling Haaland":"Erling Haaland isn't in the top ten yet.","Cole Palmer":"Cole Palmer isn't in the top ten yet."})
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

# relegations and promotions, from the game's season tables (PL) and checked against sources: docs/data/PL_RELEGATIONS_2026-10-03.md
REL3 = ["Nottingham Forest","Ipswich","QPR","Bolton","West Ham","Wolves","Southampton","Birmingham","Hull","Fulham"]
ranked("pl-at-relegated", "Most relegations from the Premier League", "Name the clubs relegated from the Premier League the most times. Ten clubs have gone down three times, so any one of them fills 10th.", LIVE, 1,
 [("Norwich","6 times"),("Leicester","5 times"),("West Brom","5 times"),("Burnley","5 times"),("Crystal Palace","4 times"),("Middlesbrough","4 times"),
  ("Sheffield Utd","4 times"),("Sunderland","4 times"),("Watford","4 times"),(REL3,"3 times","rel3",1)],
 {}, type="club")
PRO3 = ["Newcastle","West Ham","Nottingham Forest","Middlesbrough","Bolton","Birmingham","Wolves","Sheffield Utd","Hull"]
ranked("pl-at-promoted", "Most promotions to the Premier League", "Name the clubs promoted to the Premier League the most times, from 1993/94 (the 1992/93 founder members don't count as promoted). Nine clubs have come up three times, so any two of them fill 9th and 10th.", "Promotions for seasons 1993/94 to 2025/26", 1,
 [("Leicester","5 times"),("Sunderland","5 times"),("West Brom","5 times"),("Norwich","5 times"),("Burnley","5 times"),("Crystal Palace","4 times"),
  ("Watford","4 times"),("Fulham","4 times"),(PRO3,"3 times","pro3",2)], type="club")

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
labelled("pl-fee-clubbuy", "Club record signings", "Name each club's record signing (headline fees as reported in the UK). Man Utd and Everton have two answers: Pogba and Sigurdsson cost the most up front, Lukaku and Richarlison the most once add-ons are counted.", FEES, 1,
 [("Man Utd",["Romelu Lukaku","Paul Pogba"],"£90m Lukaku, 2017; £89m Pogba, 2016"),("Liverpool","Alexander Isak","£125m, 2025"),("Arsenal","Declan Rice","£105m, 2023"),
  ("Chelsea","Morgan Rogers","£117m, 2026"),("Man City","Enzo Fernandez","£125m, 2026"),("Spurs","Sandro Tonali","£100m, 2026"),
  ("Newcastle","Nick Woltemade","£69m, 2025"),("Aston Villa","Nicolas Jackson","£65m, 2026"),("West Ham","Lucas Paqueta","£51m, 2022"),("Everton",["Richarlison","Gylfi Sigurdsson"],"£50m Richarlison, 2018; £45m Sigurdsson, 2017")])


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


# each club's top Premier League scorers counting only goals from 2000/01, researched 2 October 2026 (docs/data/SINCE_2000_SCORERS.md)
S2000 = "Premier League goals from 2000/01 to 2025/26"
# each club's biggest signings (headline fees, add-ons included, as the most prominent UK outlets published them), researched 3 October 2026.
# Rows and sources: docs/data/PL_SIGNINGS_2026-10-03.md. Everton uses Sky's £36.6m for Moise Kean (Juventus said about £29m), Craig's call.
def buys(id, title, level, rows, notes=None):
    ranked(id, title, f"Name the ten players {re.sub(chr(39) + 's? biggest signings$', '', title)} signed for the biggest fees. {SB}", FEES, level, rows, notes)
buys("pl-fee-buys-mu", "Man Utd's biggest signings", 1,
 [("Romelu Lukaku","£90m, 2017"),("Paul Pogba","£89m, 2016"),("Antony","£85.5m, 2022"),("Harry Maguire","£80m, 2019"),("Benjamin Sesko","£73.7m, 2025"),
  ("Jadon Sancho","£73m, 2021"),("Rasmus Hojlund","£72m, 2023"),("Bryan Mbeumo","£71m, 2025"),("Casemiro","£70m, 2022"),("Carlos Baleba","£70m, 2026")],
 {"Matheus Cunha":"Matheus Cunha's £62.5m move is just outside.","Mason Mount":"Mason Mount's £60m move is just outside.","Angel Di Maria":"Angel Di Maria's £59.7m move is just outside."})
buys("pl-fee-buys-lfc", "Liverpool's biggest signings", 1,
 [("Alexander Isak","£125m, 2025"),("Bradley Barcola","£123m, 2026"),("Florian Wirtz","£116.5m, 2025"),("Darwin Nunez","£85m, 2022"),("Hugo Ekitike","£79m, 2025"),
  ("Virgil van Dijk","£75m, 2018"),("Alisson","£66.8m, 2018"),("Dominik Szoboszlai","£60m, 2023"),("Jeremy Jacquet","£60m, 2026"),("Naby Keita","£52.75m, 2018")],
 {"Luis Diaz":"Luis Diaz's £49m move is just outside.","Milos Kerkez":"Milos Kerkez's £40m move is outside the ten."})
buys("pl-fee-buys-afc", "Arsenal's biggest signings", 1,
 [("Declan Rice","£105m, 2023"),("Bruno Guimaraes","£75m, 2026"),("Nicolas Pepe","£72m, 2019"),("Eberechi Eze","£67.5m, 2025"),("Kai Havertz","£65m, 2023"),
  ("Viktor Gyokeres","£63.5m, 2025"),("Martin Zubimendi","£60m, 2025"),("Pierre-Emerick Aubameyang","£56m, 2018"),("Ezri Konsa","£55m, 2026"),("Alexandre Lacazette","£52.6m, 2017")],
 {"Noni Madueke":"Noni Madueke's £52m move is just outside.","Ben White":"Ben White's £50m move is just outside.","Gabriel Jesus":"Gabriel Jesus's £45m move is outside the ten."})
buys("pl-fee-buys-cfc", "Chelsea's biggest signings", 1,
 [("Morgan Rogers","£117m, 2026"),("Moises Caicedo","£115m, 2023"),("Enzo Fernandez","£106.8m, 2023"),("Romelu Lukaku","£97.5m, 2021"),("Mykhailo Mudryk","£88.5m, 2023"),
  ("Wesley Fofana","£75m, 2022"),("Kepa Arrizabalaga","£71.6m, 2018"),("Kai Havertz","£71m, 2020"),("Alvaro Morata","£70m, 2017"),("Marc Cucurella","£62m, 2022")],
 {"Joao Pedro":"Joao Pedro's £60m move is just outside.","Romeo Lavia":"Romeo Lavia's £58m move is just outside.","Christian Pulisic":"Christian Pulisic's £58m move is just outside."})
buys("pl-fee-buys-mci", "Man City's biggest signings", 1,
 [("Enzo Fernandez","£125m, 2026"),("Elliot Anderson","£116m, 2026"),("Jack Grealish","£100m, 2021"),("Ayyoub Bouaddi","£86m, 2026"),("Josko Gvardiol","£77.6m, 2023"),
  ("Antoine Semenyo","£65m, 2026"),("Iliman Ndiaye","£65m, 2026"),("Ruben Dias","£65m, 2020"),("Omar Marmoush","£63.2m, 2025"),("Rodri","£62.8m, 2019")],
 {"Riyad Mahrez":"Riyad Mahrez's £60m move is just outside.","Joao Cancelo":"Joao Cancelo's £60m move is just outside.","Aymeric Laporte":"Aymeric Laporte's £57m move is just outside."})
buys("pl-fee-buys-tot", "Spurs' biggest signings", 2,
 [("Sandro Tonali","£100m, 2026"),("Mateus Fernandes","£85m, 2026"),("Savinho","£85m, 2026"),("Dominic Solanke","£65m, 2024"),("Tanguy Ndombele","£63m, 2019"),
  ("Richarlison","£60m, 2022"),("Mohammed Kudus","£55m, 2025"),("Jan Paul van Hecke","£52m, 2026"),("Xavi Simons","£51.8m, 2025"),("Brennan Johnson","£47.5m, 2023")],
 {"Cristian Romero":"Cristian Romero's £47m move is just outside.","Davinson Sanchez":"Davinson Sanchez's £42m move is just outside.","Omar Marmoush":"Omar Marmoush is on loan, with a £50m fee due if the obligation is met."})
buys("pl-fee-buys-new", "Newcastle's biggest signings", 2,
 [("Nick Woltemade","£69m, 2025"),("Alexander Isak","£63m, 2022"),("Yoane Wissa","£55m, 2025"),("Anthony Elanga","£55m, 2025"),("Sandro Tonali","£55m, 2023"),
  ("Nico Gonzalez","£52m, 2026"),("Matias Fernandez-Pardo","£51m, 2026"),("Anthony Gordon","£45m, 2023"),("Jacob Ramsey","£43m, 2025"),("Bazoumana Toure","£43m, 2026")],
 {"Bruno Guimaraes":"Bruno Guimaraes's £40m move is just outside.","Joelinton":"Joelinton's £40m move is just outside."})
buys("pl-fee-buys-avl", "Aston Villa's biggest signings", 2,
 [("Nicolas Jackson","£65m, 2026"),("Johan Manzambi","£59.5m, 2026"),("Moussa Diaby","£51.9m, 2023"),("Amadou Onana","£50m, 2024"),("Ibrahim Mbaye","£47m, 2026"),
  ("Joao Gomes","£38m, 2026"),("Emiliano Buendia","£38m, 2021"),("Ian Maatsen","£37.5m, 2024"),("Ollie Watkins","£33m, 2020"),("Pau Torres","£31.5m, 2023")],
 {"Leon Bailey":"Leon Bailey's £30m move is just outside.","Evann Guessand":"Evann Guessand's £30m move is just outside.","Taylor Harwood-Bellis":"Taylor Harwood-Bellis's £30m move is just outside.","Danny Ings":"Danny Ings's £30m move is just outside.","Alejandro Garnacho":"Alejandro Garnacho is on loan, with a fee due only if the obligation is met."})
buys("pl-fee-buys-whu", "West Ham's biggest signings", 2,
 [("Lucas Paqueta","£51m, 2022"),("Sebastien Haller","£45m, 2019"),("Mateus Fernandes","£42m, 2025"),("Felipe Anderson","£42m, 2018"),("Max Kilman","£40m, 2024"),
  ("Mohammed Kudus","£38m, 2023"),("Gianluca Scamacca","£35.5m, 2022"),("Edson Alvarez","£35.4m, 2023"),("Jean-Clair Todibo","£34.2m, 2025"),("Crysencio Summerville","£34m, 2024")],
 {"Nayef Aguerd":"Nayef Aguerd's £30m move is just outside.","Kurt Zouma":"Kurt Zouma's £29.8m move is just outside."})

buys("pl-fee-buys-eve", "Everton's biggest signings", 2,
 [("Richarlison","£50m, 2018"),("Gylfi Sigurdsson","£45m, 2017"),("Tyler Dibling","£42m, 2025"),("Moise Kean","£36.6m, 2019"),("Alex Iwobi","£34m, 2019"),
  ("Amadou Onana","£33.7m, 2022"),("Jordan Pickford","£30m, 2017"),("Michael Keane","£30m, 2017"),("Yannick Bolasie","£30m, 2016"),("Kiernan Dewsbury-Hall","£29m, 2025")],
 {"Yerry Mina":"Yerry Mina's £28.5m move is just outside.","Romelu Lukaku":"Romelu Lukaku's £28m move is just outside.","Thierno Barry":"Thierno Barry's move is just outside the ten."})

def since(id, club, rows, notes):
    ranked(id, f"{club}'s Premier League scorers since 2000", f"Name {club}'s ten highest Premier League scorers, counting only goals from the 2000/01 season onwards.", S2000, 1, rows, notes)
since("pl-mu-2000-goals", "Man Utd",
 [("Wayne Rooney","183 goals"),("Cristiano Ronaldo","103 goals"),("Ruud van Nistelrooy","95 goals"),("Marcus Rashford","87 goals"),("Bruno Fernandes","71 goals"),
  ("Paul Scholes","66 goals"),("Anthony Martial","63 goals"),("Ryan Giggs","55 goals"),("Dimitar Berbatov","48 goals"),("Robin van Persie","48 goals")],
 {"Ole Gunnar Solskjaer":"Ole Gunnar Solskjaer scored 43 from 2000/01, just outside.","Javier Hernandez":"Javier Hernandez scored 37, just outside.","Juan Mata":"Juan Mata scored about 34, not quite top ten."})
since("pl-lfc-2000-goals", "Liverpool",
 [("Mohamed Salah","191 goals"),("Steven Gerrard","119 goals"),("Sadio Mane","90 goals"),("Roberto Firmino","82 goals"),("Michael Owen","70 goals"),
  ("Luis Suarez","69 goals"),("Fernando Torres","65 goals"),("Dirk Kuyt","51 goals"),("Daniel Sturridge","50 goals"),("Diogo Jota","47 goals")],
 {"Philippe Coutinho":"Philippe Coutinho scored 41, just outside.","Emile Heskey":"Emile Heskey scored 36 from 2000/01, just outside.","Cody Gakpo":"Cody Gakpo has 32, not top ten yet.","Robbie Fowler":"Most of Robbie Fowler's goals came before 2000/01."})
since("pl-afc-2000-goals", "Arsenal",
 [("Thierry Henry","158 goals"),("Robin van Persie","96 goals"),("Olivier Giroud","73 goals"),("Pierre-Emerick Aubameyang","68 goals"),("Theo Walcott","65 goals"),
  ("Robert Pires","62 goals"),("Bukayo Saka","60 goals"),("Alexis Sanchez","60 goals"),("Alexandre Lacazette","54 goals"),("Emmanuel Adebayor","46 goals")],
 {"Gabriel Martinelli":"Gabriel Martinelli scored 41, just outside.","Aaron Ramsey":"Aaron Ramsey scored 40, just outside.","Freddie Ljungberg":"Freddie Ljungberg scored 39 from 2000/01, just outside.","Dennis Bergkamp":"Dennis Bergkamp scored 30 from 2000/01."})
since("pl-cfc-2000-goals", "Chelsea",
 [("Frank Lampard","147 goals"),("Didier Drogba","104 goals"),("Eden Hazard","85 goals"),("Jimmy Floyd Hasselbaink","69 goals"),("Eidur Gudjohnsen","54 goals"),
  ("Diego Costa","52 goals"),("Cole Palmer","47 goals"),("John Terry","41 goals"),("Nicolas Anelka","38 goals"),("Willian","37 goals")],
 {"Salomon Kalou":"Salomon Kalou scored 36, just outside.","Florent Malouda":"Florent Malouda scored 35, just outside.","Gianfranco Zola":"Gianfranco Zola scored 26 from 2000/01."})

# boards worked out from Craig's player dataset (docs/data/pl_players/pl_players.csv, every Premier League player 1992/93 to 2025/26)
# Players are grouped by player_id and use the game's own spelling (CANON, as in build-pl-players.py). Ideas from docs/data/Tenaball_new_boards_2026-10-03.md.
import csv
from collections import defaultdict, Counter
CANON = {"Son Heung-min": "Heung-min Son", "Theo Zagorakis": "Theodoros Zagorakis", "Kanu": "Nwankwo Kanu", "Juninho": "Juninho Paulista", "Salva": "Salva Ballesta"}
PR = list(csv.DictReader(open("docs/data/pl_players/pl_players.csv", encoding="utf-8")))
PNAME = {r["player_id"]: CANON.get(r["player"], r["player"]) for r in PR}
def tally(rows, field):
    t = Counter()
    for r in rows: t[r["player_id"]] += int(r[field])
    return t
def board(id, title, brief, level, tally_, unit, notes=None, val=None, period=None):
    """the ten highest in tally_ (player_id -> number); a tie across 10th becomes a pool and the brief says so"""
    val = val or (lambda p, v: f"{v} {unit}")
    order = sorted(tally_, key=lambda p: (-tally_[p], PNAME[p]))
    cut = tally_[order[9]]
    above = [p for p in order if tally_[p] > cut]
    tied = [p for p in order if tally_[p] == cut]
    rows = [(PNAME[p], val(p, tally_[p])) for p in above]
    if len(above) + len(tied) == 10:
        rows += [(PNAME[p], val(p, tally_[p])) for p in tied]
    else:
        n = 10 - len(above); names = [PNAME[p] for p in tied]
        rows.append((names, f"{cut} {unit}", id.replace("pl-", "")[:12], n))
        WORDS = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"]
        who = " and ".join(names) if len(names) == 2 else f"{WORDS[len(names)]} players"
        brief += f" {who} share {'10th' if n == 1 else 'the last ' + str(n) + ' places'}, so {'either' if len(names) == 2 else 'any ' + ('one' if n == 1 else str(n))} of them {'counts' if n == 1 else 'fill them'}."
    below = [p for p in order if tally_[p] < cut][:3]
    auto = {PNAME[p]: f"{PNAME[p]} is just outside with {tally_[p]}." for p in below}
    auto.update(notes or {})
    ranked(id, title, brief, period or LIVE, level, rows, auto)

# most appearances for a club
CLUBS = [("mu","Man Utd","Man Utd's","Manchester United",1),("lfc","Liverpool","Liverpool's","Liverpool",1),("afc","Arsenal","Arsenal's","Arsenal",1),
         ("cfc","Chelsea","Chelsea's","Chelsea",1),("tot","Spurs","Spurs'","Tottenham",2),("mci","Man City","Man City's","Manchester City",2),
         ("new","Newcastle","Newcastle's","Newcastle United",2),("eve","Everton","Everton's","Everton",2),("whu","West Ham","West Ham's","West Ham United",2),
         ("avl","Aston Villa","Aston Villa's","Aston Villa",2)]
for key, club, poss, full, lv in CLUBS:
    board(f"pl-{key}-apps", f"{poss} most Premier League appearances", f"Name the ten players who have played the most Premier League games for {full}.", lv,
          tally([r for r in PR if r["club"] == club], "apps"), "games")

# top scorers by nationality (the country a player plays for, or his birth country if never capped)
for key, nat, adj, lv in [("fra","France","French",1),("ned","Netherlands","Dutch",1),("sco","Scotland","Scottish",2),("irl","Republic of Ireland","Republic of Ireland",2),("wal","Wales","Welsh",2)]:
    who = "Republic of Ireland players" if key == "irl" else f"{adj} players"
    board(f"pl-nat-{key}-goals", f"Top Premier League scorers: {nat}", f"Name the ten {who} with the most Premier League goals.", lv,
          tally([r for r in PR if r["nationality"] == nat], "goals"), "goals")
noneng = [r for r in PR if r["nationality"] != "England"]
board("pl-nonen-goals", "Top Premier League scorers who aren't English", "Name the ten highest Premier League scorers who don't or didn't play for England.", 0,
      tally(noneng, "goals"), "goals", {"Harry Kane":"Harry Kane is English.","Alan Shearer":"Alan Shearer is English.","Wayne Rooney":"Wayne Rooney is English."})
board("pl-nonen-apps", "Most Premier League appearances by a non-English player", "Name the ten players with the most Premier League games who don't or didn't play for England.", 2,
      tally(noneng, "apps"), "games", {"James Milner":"James Milner is English.","Gareth Barry":"Gareth Barry is English.","Frank Lampard":"Frank Lampard is English."})
board("pl-gk-apps", "Most Premier League appearances by a goalkeeper", "Name the ten goalkeepers who have played the most Premier League games.", 1,
      tally([r for r in PR if r["position"] == "GK"], "apps"), "games")

# most seasons at one club: a season counts if he played at least once; each player once, at the club where he has most
seas = defaultdict(set)
for r in PR:
    if int(r["apps"]) > 0: seas[(r["player_id"], r["club"])].add(r["season"])
best = {}
for (p, c), s in seas.items():
    if p not in best or len(s) > best[p][1]: best[p] = (c, len(s))
board("pl-apps-one-club", "Most Premier League seasons at one club", "Name the players who have played in the most Premier League seasons for the same club (one game in a season counts).", 1,
      Counter({p: n for p, (c, n) in best.items()}), "seasons", {"James Milner":"James Milner has the most seasons overall, but never more than 8 at one club."},
      val=lambda p, v: f"{v} seasons, {best[p][0]}")

# goals by position. Positions are the dataset's (footballsquads, season by season); wingers count as midfielders, as they do there.
# A player is placed by the position he played most of his games in; every goal he scored counts.
pos = defaultdict(Counter)
for r in PR: pos[r["player_id"]][r["position"]] += int(r["apps"])
main = {p: c.most_common(1)[0][0] for p, c in pos.items()}
# checked by hand: Gareth Barry is 327 games in defence to 326 in midfield, and fans know him as a midfielder
main.update({p: "MID" for p in PNAME if PNAME[p] == "Gareth Barry"})
goals = tally(PR, "goals")
board("pl-defender-goals", "Most Premier League goals by a defender", "Name the ten defenders with the most Premier League goals.", 2,
      Counter({p: g for p, g in goals.items() if main[p] == "DEF"}), "goals",
      {"Gareth Barry":"Gareth Barry played about half his games in defence, but he counts as a midfielder here.","Sol Campbell":"Sol Campbell scored 20.","Rio Ferdinand":"Rio Ferdinand scored 11."})
board("pl-midfield-goals", "Most Premier League goals by a midfielder", "Name the ten midfielders with the most Premier League goals. Wingers count as midfielders, and each player goes by the position he played most often.", 1,
      Counter({p: g for p, g in goals.items() if main[p] == "MID"}), "goals",
      {"Mohamed Salah":"Mohamed Salah counts as a forward here.","Heung-min Son":"Son counts as a forward here.","Matt Le Tissier":"Matt Le Tissier counts as a forward here.","Dennis Bergkamp":"Dennis Bergkamp counts as a forward here.","Leroy Sane":"Leroy Sane counts as a forward here."})

# more boards from the player dataset (Craig's picks, 3 October 2026)
board("pl-nat-eng-goals", "Top English Premier League scorers", "Name the ten English players with the most Premier League goals.", 0,
      tally([r for r in PR if r["nationality"] == "England"], "goals"), "goals",
      {"Mohamed Salah":"Mohamed Salah is Egyptian.","Sergio Aguero":"Sergio Aguero is Argentinian.","Thierry Henry":"Thierry Henry is French."})
# top scorers for more countries: only those whose ten are mostly well-known players (Norway, Denmark, Sweden, USA, Australia, Jamaica and Northern Ireland left out)
for key, nat, adj, lv in [("esp","Spain","Spanish",1),("bra","Brazil","Brazilian",1),("arg","Argentina","Argentinian",1),("bel","Belgium","Belgian",1),("por","Portugal","Portuguese",1),
                          ("ger","Germany","German",2),("civ","Ivory Coast","Ivory Coast",2),("nga","Nigeria","Nigerian",2),("sen","Senegal","Senegalese",2),("ita","Italy","Italian",2)]:
    who = "Ivory Coast players" if key == "civ" else f"{adj} players"
    board(f"pl-nat-{key}-goals", f"Top Premier League scorers: {nat}", f"Name the ten {who} with the most Premier League goals.", lv,
          tally([r for r in PR if r["nationality"] == nat], "goals"), "goals")
# most appearances by country, the same rule for which countries go in (Scotland added at Craig's request)
for key, nat, adj, lv in [("eng","England","English",1),("fra","France","French",1),("esp","Spain","Spanish",1),("irl","Republic of Ireland","Republic of Ireland",2),
                          ("wal","Wales","Welsh",2),("sco","Scotland","Scottish",2),("ned","Netherlands","Dutch",2),("bra","Brazil","Brazilian",1),("arg","Argentina","Argentinian",2),
                          ("por","Portugal","Portuguese",2),("bel","Belgium","Belgian",1),("ger","Germany","German",2),("civ","Ivory Coast","Ivory Coast",2),
                          ("nga","Nigeria","Nigerian",2),("ita","Italy","Italian",2)]:
    who = f"{adj} players" if key not in ("irl", "civ") else f"{adj} players"
    board(f"pl-nat-{key}-apps", f"Most Premier League appearances: {nat}", f"Name the ten {who} who have played the most Premier League games.", lv,
          tally([r for r in PR if r["nationality"] == nat], "apps"), "games")

# top scorers since 2000/01 for more clubs (Man City is left out: since 2000 its ten are the same as its all-time board)
for key, club, poss in [("tot","Spurs","Spurs'"),("mci","Man City","Man City's"),("new","Newcastle","Newcastle's"),("eve","Everton","Everton's"),("whu","West Ham","West Ham's"),("avl","Aston Villa","Aston Villa's")]:
    allt = tally([r for r in PR if r["club"] == club], "goals")
    s2k = tally([r for r in PR if r["club"] == club and r["season"] >= "2000/01"], "goals")
    top10 = lambda t: set(sorted(t, key=lambda p: -t[p])[:10])
    if top10(allt) == top10(s2k): continue
    before = {PNAME[p]: f"Most of {PNAME[p]}'s goals for {club} came before 2000/01." for p in sorted(allt, key=lambda p: -allt[p])[:12] if s2k[p] * 2 < allt[p]}
    board(f"pl-{key}-2000-goals", f"{poss} Premier League scorers since 2000", f"Name {poss} ten highest Premier League scorers, counting only goals from the 2000/01 season onwards.", 1,
          s2k, "goals", before, period=S2000)

# by decade (the 2020s so far)
for dec, a, b, glv, alv in [("1990s","1992/93","1999/00",1,2),("2000s","2000/01","2009/10",1,2),("2010s","2010/11","2019/20",0,2),("2020s","2020/21","2025/26",1,1)]:
    rows = [r for r in PR if a <= r["season"] <= b]
    per = f"Premier League seasons {a} to {b}"
    board(f"pl-dec-{dec[:4]}-goals", f"Top Premier League scorers of the {dec}", f"Name the ten players who scored the most Premier League goals from {a} to {b}.", glv,
          tally(rows, "goals"), "goals", period=per)
    board(f"pl-dec-{dec[:4]}-apps", f"Most Premier League appearances in the {dec}", f"Name the ten players who played the most Premier League games from {a} to {b}.", alv,
          tally(rows, "apps"), "games", period=per)

# countries with the most Premier League players
nat_players = defaultdict(set)
for r in PR: nat_players[r["nationality"]].add(r["player_id"])
order = sorted(nat_players, key=lambda n: -len(nat_players[n]))
assert len(nat_players[order[9]]) > len(nat_players[order[10]])
ranked("pl-nat-players", "Countries with the most Premier League players", "Name the ten countries that have had the most players in the Premier League (a player counts for the country he plays for).", "Premier League players, 1992/93 to 2025/26", 1,
       [(n, f"{len(nat_players[n])} players") for n in order[:10]], {n: f"{n} is just outside with {len(nat_players[n])}." for n in order[10:13]}, type="nation")

# the club record scorers in index.html (CLUB_REC) must match the dataset
h0 = open("index.html", encoding="utf-8").read()
cr = re.search(r"const CLUB_REC = \[(.*?)\];", h0, re.S).group(1)
for club, name, g in re.findall(r'\["([^"]+)","([^"]+)",(\d+),\d\]', cr):
    t = tally([r for r in PR if r["club"] == club], "goals")
    top = max(t.values()); tops = [PNAME[p] for p in t if t[p] == top]
    assert tops == [name] and top == int(g), (club, name, g, tops, top)

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

# levels rebalanced at Craig's request (3 October 2026): too many hard boards and too few easy ones
RELEVEL = {0: ["pl-mu-apps","pl-lfc-apps","pl-mu-2000-goals","pl-lfc-2000-goals","pl-at-season-goals","pl-at-hattricks","pl-at-penalties","pl-at-mgr-wins",
               "pl-fee-signings","pl-fee-clubbuy","pl-midfield-goals","pl-dec-2000-goals","pl-dec-2020-goals","pl-nat-fra-goals","pl-nat-bra-goals","pl-apps-one-club"],
           1: ["pl-tot-apps","pl-mci-apps","pl-new-apps","pl-eve-apps","pl-whu-apps","pl-nat-wal-goals","pl-nat-irl-goals","pl-nat-sco-goals","pl-nat-civ-goals",
               "pl-nat-wal-apps","pl-nat-irl-apps","pl-nat-ned-apps","pl-fee-buys-tot","pl-fee-buys-new","pl-fee-buys-avl","pl-fee-buys-whu","pl-fee-buys-eve",
               "pl-fee-sales-mu","pl-fee-sales-lfc","pl-fee-sales-cfc","pl-dec-2000-apps","pl-dec-2010-apps","pl-at-20-goals","pl-at-fastest-50",
               "pl-defender-goals","pl-20g-2009/10"]}
ids = {q["id"]: q for q in Q}
for lv, names in RELEVEL.items():
    for i in names: ids[i]["level"] = lv; ids[i]["hard"] = lv == 2

for q in Q:
    for s in q["slots"]:
        for t in [s.get("val",""), q["brief"], q["title"], q["period"], *q["notes"].values()]: assert "—" not in t
print(len(Q))
data = json.dumps(Q, ensure_ascii=False, separators=(",", ":"))
h = open("index.html", encoding="utf-8").read()
h, n = re.subn(r"const EXTRA_Q4 = \[.*?\];\n", lambda m: "const EXTRA_Q4 = " + data + ";\n", h, count=1, flags=re.S)
assert n == 1
open("index.html", "w", encoding="utf-8").write(h)
