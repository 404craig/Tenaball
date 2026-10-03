# Tenaball: new Premier League boards for the game to consider

Prepared 3 October 2026 for the Tenaball Claude Code session. Craig has chosen these board ideas. Please check each against what is already in `index.html` and build any that are missing (or tell Craig which already exist). Apply the `CLAUDE.md` rules to every board: exactly 10 answers, ties at 10th place kept as a pool, no answer in 4 or more slots, a period line under each question.

## Read this first

- **Source for boards 1 to 9:** `pl_players_1992-2026.zip` (the player dataset built for Tenaball). It covers 34 completed Premier League seasons, 1992/93 to 2025/26, and every club-season reconciles to club goals. It does NOT include the 2026/27 season, so every figure here is "to the end of 2025/26". Either put "1992/93 to 2025/26" in the period line or add the 2026/27 games so far before building. Players still active (for example Salah, Bruno Fernandes) will have grown since.
- **Where a figure is out by one goal or one game** the game should just take what it believes is correct. Do not build alternatives.
- **Group by `player_id`, not name** (31 same-name cases are separated, for example Steve McManaman and Callum McManaman).
- **Nationality** is the country the player plays for (birth country if never capped). Dual nationality can make a player arguable: check any borderline name before use.
- **Ties:** every board below lists all entries tied at 10th place so any of them can be a valid answer.
- **Board 10 (signings)** comes from web research, not the dataset, and is less certain. Read the fee-basis notes before building.

## Summary of boards

| # | Board | Notes |
|---|---|---|
| 1 | Most appearances for each of 10 clubs | 10 sub-boards |
| 2 | Top scorers by nationality | France, Scotland, Republic of Ireland, Wales, Netherlands |
| 3 | Top scorers who were not English | |
| 4 | Most appearances by a non-English player | |
| 5 | Most appearances by a goalkeeper | |
| 6 | Most seasons at a single club | |
| 7 | Club record scorers, every club | Extends the existing 20-club pool |
| 8 | Most goals by a defender | Hand-checked positions, see caveat |
| 9 | Most goals by a midfielder | Hand-checked positions, see caveat |
| 10 | Record signings, each club's ten biggest buys | 10 clubs, fee-basis caveat |

## 1. Most Premier League appearances for a club

Period: Premier League only, 1992/93 to 2025/26. Appearances for that club only (starts plus sub appearances).

### Man Utd

| Rank | Answer | Value |
|---|---|---|
| 1 | Ryan Giggs | 632 apps |
| 2 | Paul Scholes | 499 apps |
| 3 | David de Gea | 415 apps |
| 4 | Gary Neville | 400 apps |
| 5 | Wayne Rooney | 393 apps |
| 6 | Roy Keane | 326 apps |
| 7 | Michael Carrick | 316 apps |
| 8 | Rio Ferdinand | 312 apps |
| 9 | Denis Irwin | 296 apps |
| 10 | Marcus Rashford | 287 apps |

Next below the cut-off (not valid answers): Patrice Evra 273 apps

### Liverpool

| Rank | Answer | Value |
|---|---|---|
| 1 | Jamie Carragher | 508 apps |
| 2 | Steven Gerrard | 504 apps |
| 3 | Jordan Henderson | 360 apps |
| 4 | Sami Hyypia | 318 apps |
| 5 | Mohamed Salah | 315 apps |
| 6 | Pepe Reina | 285 apps |
| 7 | Andy Robertson | 275 apps |
| 8 | Virgil van Dijk | 272 apps |
| 9 | Robbie Fowler | 266 apps |
| 10 | Trent Alexander-Arnold | 259 apps |

Next below the cut-off (not valid answers): Roberto Firmino 256 apps

### Arsenal

| Rank | Answer | Value |
|---|---|---|
| 1 | Ray Parlour | 333 apps |
| 2 | David Seaman | 325 apps |
| 3 | Dennis Bergkamp | 315 apps |
| 4 | Martin Keown | 310 apps |
| 5 | Lee Dixon | 305 apps |
| 6 | Patrick Vieira | 279 apps |
| =7 | Nigel Winterburn | 270 apps |
| =7 | Theo Walcott | 270 apps |
| 9 | Aaron Ramsey | 262 apps |
| 10 | Thierry Henry | 258 apps |

Next below the cut-off (not valid answers): Laurent Koscielny 255 apps; Tony Adams 255 apps

### Chelsea

| Rank | Answer | Value |
|---|---|---|
| 1 | John Terry | 492 apps |
| 2 | Frank Lampard | 429 apps |
| 3 | Cesar Azpilicueta | 349 apps |
| 4 | Petr Cech | 333 apps |
| =5 | Branislav Ivanovic | 261 apps |
| =5 | Dennis Wise | 261 apps |
| 7 | Didier Drogba | 254 apps |
| 8 | John Obi Mikel | 249 apps |
| 9 | Eden Hazard | 245 apps |
| 10 | Willian | 234 apps |

Next below the cut-off (not valid answers): Ashley Cole 229 apps; Gianfranco Zola 229 apps

### Spurs

| Rank | Answer | Value |
|---|---|---|
| 1 | Hugo Lloris | 361 apps |
| 2 | Son Heung-min | 333 apps |
| 3 | Harry Kane | 317 apps |
| 4 | Darren Anderton | 299 apps |
| 5 | Jermain Defoe | 276 apps |
| 6 | Eric Dier | 274 apps |
| 7 | Ledley King | 268 apps |
| 8 | Aaron Lennon | 266 apps |
| 9 | Sol Campbell | 255 apps |
| 10 | Ben Davies | 245 apps |

Next below the cut-off (not valid answers): Ian Walker 240 apps

### Man City

| Rank | Answer | Value |
|---|---|---|
| 1 | David Silva | 309 apps |
| 2 | Bernardo Silva | 304 apps |
| 3 | Kevin De Bruyne | 285 apps |
| 4 | Ederson | 276 apps |
| 5 | Sergio Aguero | 275 apps |
| 6 | Joe Hart | 266 apps |
| 7 | Vincent Kompany | 265 apps |
| 8 | Fernandinho | 264 apps |
| 9 | Richard Dunne | 253 apps |
| =10 | Pablo Zabaleta | 230 apps |
| =10 | Yaya Toure | 230 apps |

Next below the cut-off (not valid answers): Phil Foden 225 apps; Raheem Sterling 225 apps

### Newcastle

| Rank | Answer | Value |
|---|---|---|
| 1 | Shay Given | 354 apps |
| 2 | Alan Shearer | 303 apps |
| 3 | Shola Ameobi | 294 apps |
| 4 | Rob Lee | 267 apps |
| 5 | Nolberto Solano | 230 apps |
| 6 | Jacob Murphy | 218 apps |
| 7 | Gary Speed | 213 apps |
| 8 | Joelinton | 212 apps |
| =9 | Fabian Schar | 211 apps |
| =9 | Fabricio Coloccini | 211 apps |

Next below the cut-off (not valid answers): Aaron Hughes 205 apps

### Everton

| Rank | Answer | Value |
|---|---|---|
| 1 | Seamus Coleman | 374 apps |
| 2 | Tim Howard | 354 apps |
| 3 | Leon Osman | 352 apps |
| 4 | Leighton Baines | 348 apps |
| 5 | Jordan Pickford | 331 apps |
| 6 | Phil Jagielka | 322 apps |
| 7 | David Unsworth | 302 apps |
| 8 | Tony Hibbert | 265 apps |
| 9 | Phil Neville | 242 apps |
| =10 | Dominic Calvert-Lewin | 239 apps |
| =10 | Duncan Ferguson | 239 apps |

Next below the cut-off (not valid answers): David Weir 235 apps

### West Ham

| Rank | Answer | Value |
|---|---|---|
| 1 | Mark Noble | 414 apps |
| 2 | Aaron Cresswell | 312 apps |
| 3 | Michail Antonio | 268 apps |
| 4 | Jarrod Bowen | 231 apps |
| 5 | Tomas Soucek | 229 apps |
| 6 | Carlton Cole | 216 apps |
| =7 | Declan Rice | 204 apps |
| =7 | Steve Potts | 204 apps |
| 9 | Angelo Ogbonna | 201 apps |
| 10 | Lukasz Fabianski | 195 apps |

Next below the cut-off (not valid answers): James Collins 188 apps

### Aston Villa

| Rank | Answer | Value |
|---|---|---|
| 1 | Gareth Barry | 365 apps |
| 2 | Gabriel Agbonlahor | 322 apps |
| 3 | Alan Wright | 260 apps |
| 4 | Lee Hendrie | 251 apps |
| 5 | Steve Staunton | 244 apps |
| =6 | Ian Taylor | 233 apps |
| =6 | John McGinn | 233 apps |
| 8 | Olof Mellberg | 232 apps |
| 9 | Ezri Konsa | 231 apps |
| 10 | Ugo Ehiogu | 229 apps |

Next below the cut-off (not valid answers): Ollie Watkins 221 apps

## 2. Premier League top scorers by nationality

Period: Premier League only, 1992/93 to 2025/26. Nationality is the country the player plays for.

### France

| Rank | Answer | Value |
|---|---|---|
| 1 | Thierry Henry | 175 goals |
| 2 | Nicolas Anelka | 125 goals |
| 3 | Olivier Giroud | 90 goals |
| 4 | Louis Saha | 85 goals |
| 5 | Eric Cantona | 70 goals |
| 6 | Anthony Martial | 63 goals |
| 7 | Robert Pires | 62 goals |
| 8 | Alexandre Lacazette | 54 goals |
| 9 | Jean-Philippe Mateta | 50 goals |
| 10 | Steed Malbranque | 39 goals |

Next below the cut-off (not valid answers): Samir Nasri 36 goals

### Scotland

| Rank | Answer | Value |
|---|---|---|
| 1 | Duncan Ferguson | 68 goals |
| 2 | Kevin Gallacher | 56 goals |
| 3 | Steven Fletcher | 53 goals |
| 4 | Gary McAllister | 49 goals |
| 5 | Don Hutchison | 37 goals |
| =6 | John Spencer | 36 goals |
| =6 | Paul Dickov | 36 goals |
| 8 | Charlie Adam | 33 goals |
| 9 | James Morrison | 32 goals |
| 10 | Robert Snodgrass | 26 goals |

Next below the cut-off (not valid answers): Che Adams 25 goals

### Republic of Ireland

| Rank | Answer | Value |
|---|---|---|
| 1 | Robbie Keane | 126 goals |
| 2 | Niall Quinn | 59 goals |
| 3 | Shane Long | 56 goals |
| 4 | Damien Duff | 54 goals |
| 5 | Jon Walters | 43 goals |
| 6 | Roy Keane | 39 goals |
| 7 | Kevin Doyle | 37 goals |
| 8 | Ian Harte | 28 goals |
| 9 | Rory Delap | 23 goals |
| 10 | Seamus Coleman | 22 goals |

Next below the cut-off (not valid answers): Stephen Hunt 21 goals

### Wales

| Rank | Answer | Value |
|---|---|---|
| 1 | Ryan Giggs | 109 goals |
| =2 | Craig Bellamy | 81 goals |
| =2 | Gary Speed | 81 goals |
| 4 | Mark Hughes | 64 goals |
| 5 | John Hartson | 55 goals |
| 6 | Gareth Bale | 53 goals |
| 7 | Ian Rush | 48 goals |
| 8 | Dean Saunders | 45 goals |
| 9 | Aaron Ramsey | 40 goals |
| 10 | Harry Wilson | 29 goals |

Next below the cut-off (not valid answers): Simon Davies 27 goals

### Netherlands

| Rank | Answer | Value |
|---|---|---|
| 1 | Robin van Persie | 144 goals |
| 2 | Jimmy Floyd Hasselbaink | 127 goals |
| 3 | Ruud van Nistelrooy | 95 goals |
| 4 | Dennis Bergkamp | 87 goals |
| 5 | Dirk Kuyt | 51 goals |
| 6 | Cody Gakpo | 32 goals |
| 7 | Virgil van Dijk | 31 goals |
| 8 | Georginio Wijnaldum | 27 goals |
| 9 | Marc Overmars | 25 goals |
| =10 | Bryan Roy | 24 goals |
| =10 | Rafael van der Vaart | 24 goals |

Next below the cut-off (not valid answers): Justin Kluivert 21 goals

Northern Ireland has only a thin board (10th place is on 9 goals with ties), so it is left out unless the game wants a pool.

## 3. Top scorers who were not English

Period: Premier League only, 1992/93 to 2025/26.

| Rank | Answer | Value |
|---|---|---|
| 1 | Mohamed Salah | 193 goals |
| 2 | Sergio Aguero | 184 goals |
| 3 | Thierry Henry | 175 goals |
| 4 | Robin van Persie | 144 goals |
| =5 | Jimmy Floyd Hasselbaink | 127 goals |
| =5 | Son Heung-min | 127 goals |
| 7 | Robbie Keane | 126 goals |
| 8 | Nicolas Anelka | 125 goals |
| 9 | Dwight Yorke | 123 goals |
| 10 | Romelu Lukaku | 121 goals |

Next below the cut-off (not valid answers): Erling Haaland 112 goals

## 4. Most appearances by a non-English player

Period: Premier League only, 1992/93 to 2025/26.

| Rank | Answer | Value |
|---|---|---|
| 1 | Ryan Giggs | 632 apps |
| 2 | Gary Speed | 535 apps |
| 3 | Mark Schwarzer | 514 apps |
| 4 | Sylvain Distin | 469 apps |
| 5 | Aaron Hughes | 455 apps |
| 6 | Shay Given | 451 apps |
| 7 | Brad Friedel | 450 apps |
| 8 | John O'Shea | 445 apps |
| 9 | Petr Cech | 443 apps |
| 10 | Jussi Jaaskelainen | 436 apps |

Next below the cut-off (not valid answers): Richard Dunne 431 apps

## 5. Most appearances by a goalkeeper

Period: Premier League only, 1992/93 to 2025/26.

| Rank | Answer | Value |
|---|---|---|
| 1 | David James | 572 apps |
| 2 | Mark Schwarzer | 514 apps |
| 3 | Shay Given | 451 apps |
| 4 | Brad Friedel | 450 apps |
| 5 | Petr Cech | 443 apps |
| 6 | Jussi Jaaskelainen | 436 apps |
| 7 | David de Gea | 415 apps |
| 8 | Tim Howard | 399 apps |
| 9 | Ben Foster | 390 apps |
| 10 | Lukasz Fabianski | 376 apps |

Next below the cut-off (not valid answers): Paul Robinson 375 apps

## 6. Most Premier League seasons at a single club

Period: Premier League only, 1992/93 to 2025/26. A season counts if the player made at least one appearance for that club. Each player appears once, at the club where he has most seasons.

| Rank | Answer | Value |
|---|---|---|
| 1 | Ryan Giggs (Man Utd) | 22 seasons |
| =2 | John Terry (Chelsea) | 19 seasons |
| =2 | Paul Scholes (Man Utd) | 19 seasons |
| =4 | Gary Neville (Man Utd) | 17 seasons |
| =4 | Jamie Carragher (Liverpool) | 17 seasons |
| =4 | Seamus Coleman (Everton) | 17 seasons |
| =4 | Steven Gerrard (Liverpool) | 17 seasons |
| =8 | Mark Noble (West Ham) | 16 seasons |
| =8 | Tony Hibbert (Everton) | 16 seasons |
| =10 | Ledley King (Spurs) | 14 seasons |
| =10 | Leon Osman (Everton) | 14 seasons |

Next below the cut-off (not valid answers): Frank Lampard (Chelsea) 13 seasons; Jason Dodd (Southampton) 13 seasons; Leighton Baines (Everton) 13 seasons; Roy Keane (Man Utd) 13 seasons

## 7. Club record scorers, every club

Period: Premier League only, 1992/93 to 2025/26. Premier League goals for that club only. The game already has a 20-club pool (`CLUB_REC`); this lists the top scorer and the next two for every club that has played in the league, so the missing clubs can be added and the existing ones cross-checked. Ties for top place are marked.

| Club | Top scorer | Goals | 2nd | 3rd |
|---|---|---|---|---|
| Arsenal | Thierry Henry | 175 | Ian Wright 104 | Robin van Persie 96 |
| Aston Villa | Ollie Watkins | 91 | Gabriel Agbonlahor 74 | Dwight Yorke 60 |
| Barnsley | Neil Redfearn | 10 | Ashley Ward 8 | Jan Aage Fjortoft 6 |
| Birmingham | Mikael Forssell | 29 | Cameron Jerome 21 | Clinton Morrison 14 |
| Blackburn | Alan Shearer | 112 | Chris Sutton 47 | Kevin Gallacher 46 |
| Blackpool | DJ Campbell | 13 | Charlie Adam 12 | Gary Taylor-Fletcher 6 |
| Bolton | Kevin Davies | 68 | Kevin Nolan 39 | Matt Taylor 23 |
| Bournemouth | Josh King | 48 | Callum Wilson 41 | Antoine Semenyo 30 |
| Bradford | Dean Windass | 13 | Peter Beagrie 8 | Robbie Blake 6 |
| Brentford | Yoane Wissa | 45 | Bryan Mbeumo 42 | Ivan Toney 36 |
| Brighton | Danny Welbeck | 46 | Pascal Gross 31 | Glenn Murray 26 |
| Burnley | Chris Wood | 49 | Ashley Barnes 42 | Sam Vokes 17 |
| Cardiff | Jordon Mutch | 7 | Fraizer Campbell 6 | Bobby De Cordova-Reid 5 |
| Charlton | Jason Euell | 34 | Darren Bent 31 | Jonatan Johansson 27 |
| Chelsea | Frank Lampard | 147 | Didier Drogba 104 | Eden Hazard 85 |
| Coventry | Dion Dublin | 61 | Peter Ndlovu 35 | Noel Whelan 31 |
| Crystal Palace | Wilfried Zaha | 68 | Jean-Philippe Mateta 50 | Christian Benteke 35 |
| Derby | Dean Sturridge | 32 | Paulo Wanchope 23 | Deon Burton 22 |
| Everton | Romelu Lukaku | 68 | Duncan Ferguson 60 | Dominic Calvert-Lewin 57 |
| Fulham | Clint Dempsey | 50 | Brian McBride 32 | Steed Malbranque 32 |
| Huddersfield | Steve Mounie | 9 | Aaron Mooy 7 | Laurent Depoitre 6 |
| Hull | Nikica Jelavic | 12 | Geovanni 11 | Abel Hernandez 8 |
| Ipswich | Marcus Stewart | 25 | Chris Kiwomya 18 | Ian Marshall 13 |
| Leeds | Mark Viduka | 59 | Harry Kewell 45 | Rod Wallace 42 |
| Leicester | Jamie Vardy | 145 | James Maddison 43 | Riyad Mahrez 39 |
| Liverpool | Mohamed Salah | 191 | Robbie Fowler 128 | Steven Gerrard 120 |
| Luton | Carlton Morris | 11 | Elijah Adebayo 10 | Ross Barkley 5 |
| Man City | Sergio Aguero | 184 | Erling Haaland 112 | Raheem Sterling 91 |
| Man Utd | Wayne Rooney | 183 | Ryan Giggs 109 | Paul Scholes 107 |
| Middlesbrough | Hamilton Ricard | 31 | Juninho 29 | Mark Viduka 26 |
| Newcastle | Alan Shearer | 148 | Alexander Isak 54 | Callum Wilson 47 |
| Norwich | Chris Sutton | 33 | Grant Holt 23 | Teemu Pukki 22 |
| Nottingham Forest | Chris Wood | 38 | Morgan Gibbs-White 32 | Bryan Roy 24 |
| Oldham | Graeme Sharp | 16 | Ian Olney 13 | Darren Beckford 9 |
| Portsmouth | Yakubu | 28 | Benjani 19 | Lomana LuaLua 19 |
| QPR | Les Ferdinand | 60 | Bradley Allen 20 | Charlie Austin 18 |
| Reading | Kevin Doyle | 19 | Adam Le Fondre 12 | Dave Kitson 12 |
| Sheffield Utd | Brian Deane | 15 | Oli McBurnie 13 | Adrian Littlejohn 11 |
| Sheffield Wed | Mark Bright | 48 | David Hirst 34 | Andy Booth 25 |
| Southampton | Matt Le Tissier | 100 | James Beattie 68 | James Ward-Prowse 49 |
| Spurs | Harry Kane | 213 | Son Heung-min 127 | Teddy Sheringham 97 |
| Stoke | Peter Crouch | 45 | Jon Walters 43 | Mame Biram Diouf 23 |
| Sunderland | Kevin Phillips | 61 | Jermain Defoe 34 | Darren Bent 32 |
| Swansea | Gylfi Sigurdsson | 34 | Wilfried Bony 27 | Michu 20 |
| Swindon | Jan Aage Fjortoft | 12 | Paul Bodin 7 | Andy Mutch 6 |
| Watford | Troy Deeney | 47 | Abdoulaye Doucoure 17 | Odion Ighalo 16 |
| West Brom | Peter Odemwingie | 30 | James Morrison 29 | Chris Brunt 24 |
| West Ham | Michail Antonio | 68 | Jarrod Bowen 65 | Mark Noble 47 |
| Wigan | Hugo Rodallega | 24 | Henri Camara 20 | Charles N'Zogbia 15 |
| Wimbledon | Dean Holdsworth | 58 | Robbie Earle 45 | Efan Ekoku 37 |
| Wolves | Raul Jimenez | 40 | Matheus Cunha 29 | Hwang Hee-chan 24 |

## 8. Most Premier League goals by a defender

Period: Premier League only, 1992/93 to 2025/26. **Position caveat:** positions in the dataset come from footballsquads season by season (its M covers wingers), so a raw filter misplaces some people (Gareth Barry shows as a defender with 36 goals and a midfielder with 17, and fans call him a midfielder). The list below is checked by hand: players who spent their career as defenders or full-backs, goals counted across all their Premier League seasons. Gareth Barry is deliberately excluded. Please sanity-check Unsworth, Watson, Harte and Alonso (centre-back, full-back or wing-back depending on the season) before building.

| Rank | Answer | Goals |
|---|---|---|
| 1 | John Terry | 41 goals |
| 2 | David Unsworth | 38 goals |
| 3 | Leighton Baines | 32 goals |
| 4 | Virgil van Dijk | 31 goals |
| =5 | Ian Harte | 28 goals |
| =5 | Gary Cahill | 28 goals |
| =7 | Steve Watson | 26 goals |
| =7 | Marcos Alonso | 26 goals |
| 9 | William Gallas | 25 goals |
| 10 | Julian Dicks | 24 goals |

Next below the cut-off: Joleon Lescott 23; Matt Elliott, Sami Hyypia, Branislav Ivanovic, Seamus Coleman and Laurent Koscielny all on 22. There is no tie at 10th, so Dicks 24 is the cut-off. Van Dijk is still adding goals.

## 9. Most Premier League goals by a midfielder

Period: Premier League only, 1992/93 to 2025/26. **Position caveat:** the source lists wingers as midfielders, so Sterling, Hazard, Mahrez, Giggs and Beckham-type players are counted as midfielders here. Decide whether the board accepts wingers (the question could say "midfielder or winger") or limit it to central midfielders, in which case remove Sterling, Hazard and Mahrez and promote the next names. Salah, Son and Sane are classed as forwards in the data and are excluded.

| Rank | Answer | Goals |
|---|---|---|
| 1 | Frank Lampard | 177 goals |
| 2 | Raheem Sterling | 123 goals |
| 3 | Steven Gerrard | 120 goals |
| 4 | Ryan Giggs | 109 goals |
| 5 | Paul Scholes | 107 goals |
| 6 | Eden Hazard | 85 goals |
| 7 | Riyad Mahrez | 82 goals |
| 8 | Gary Speed | 81 goals |
| 9 | Kevin De Bruyne | 72 goals |
| 10 | Bruno Fernandes | 71 goals |

Next below the cut-off: Kevin Nolan 69; Phil Foden 68; Gylfi Sigurdsson 67. There is no tie at 10th. Sterling's total is across all his clubs; some of his seasons are classed as forward in the data.

## 10. Record signings: each club's ten biggest buys

Period: transfers from 1 July 1992 to 3 October 2026, permanent signings only, fee in GBP millions. Researched from Wikipedia, Reuters, Sky, BBC and press lists; only some fees have two sources, so treat the notes column seriously. All ties at 10th place are shown.

**Fee basis, decide once for the whole board.** Sources differ on headline (including add-ons) versus initial fee. The existing `pl-fee-*` boards use headline fees, and the Man Utd and Chelsea lists below mix the two (for example Antony 81.3 initial, 85.5 headline; Mudryk 62 initial, 88.5 headline; Hojlund 72 headline, about 64 initial). For consistency with the existing boards, use the headline fee and re-sort. Every club's note column says where the choice changes the order. Man Utd's order under headline fees would put Lukaku (90) first, then Pogba 89, Antony 85.5, which also conflicts with the existing `pl-fee-clubbuy` row naming Pogba as United's record signing at 89: that existing row should be revisited.

### Man Utd

| Rank | Player | From | Year | Fee | Note |
|---|---|---|---|---|---|
| 1 | Paul Pogba | Juventus | 2016 | £89m | Club record. Reported 89 to 89.3 (EUR 105m). |
| 2 | Antony | Ajax | 2022 | £81.3m | Initial 81.3; fee rising to about 85.5 with add-ons (context file uses 85.5). |
| 3 | Harry Maguire | Leicester City | 2019 | £80m | Consistent across sources. |
| 4 | Romelu Lukaku | Everton | 2017 | £75m | Initial 75 (Wikipedia summary 72); up to 90 with add-ons. |
| 5 | Jadon Sancho | Borussia Dortmund | 2021 | £73m | Wikipedia 73; Sports Mole 72.3 (about EUR 85m). |
| 6 | Rasmus Hojlund | Atalanta | 2023 | £72m | Headline 72 (Sky Sports; SI); initial 64 plus 8 add-ons per some reports; Sports Mole lists 62.8. Medium confidence on basis. |
| 7 | Benjamin Sesko | RB Leipzig | 2025 | £66.3m | Initial 66.3 plus 7.4 add-ons (up to 73.7 per context file). |
| =8 | Carlos Baleba | Brighton | 2026 | £65m | 65 plus 5 add-ons (Sports Mole lists 70 headline; TeamTalk 65 + 5). Tied with Mbeumo. |
| =8 | Bryan Mbeumo | Brentford | 2025 | £65m | 65 plus up to 6 add-ons. |
| 10 | Matheus Cunha | Wolverhampton Wanderers | 2025 | £62.5m | Release clause 62.5 (EUR 74m). |

Next below the cut-off (not valid answers): Casemiro £60m; Angel Di Maria £59.7m; Andrey Santos £48m

### Liverpool

| Rank | Player | From | Year | Fee | Note |
|---|---|---|---|---|---|
| 1 | Alexander Isak | Newcastle United | 2025 | £125m | Club record. EUR 145m reported. |
| 2 | Bradley Barcola | Paris Saint-Germain | 2026 | £123m | Headline 123 (EUR 125m); TeamTalk says 106 guaranteed rising to 123 with add-ons; some outlets 124. |
| 3 | Florian Wirtz | Bayer Leverkusen | 2025 | £116m | Headline 116 (up to; initial about 100). EUR 125m. |
| 4 | Darwin Nunez | Benfica | 2022 | £85m | Rising to 85 with add-ons; initial 64. |
| 5 | Hugo Ekitike | Eintracht Frankfurt | 2025 | £79m | Headline up to 79; initial 69 (Wikipedia lists 69). |
| 6 | Virgil van Dijk | Southampton | 2018 | £75m | Consistent. EUR 84.7m. |
| 7 | Alisson | Roma | 2018 | £66.8m | Wikipedia 66.8; Empire of the Kop 65; EUR 72.5m. |
| =8 | Dominik Szoboszlai | RB Leipzig | 2023 | £60m | Release clause 60 (EUR 70m). Tied with Jacquet. |
| =8 | Jeremy Jacquet | Rennes | 2026 | £60m | Sky Sports 60 (55 plus 5 add-ons per TeamTalk and Empire of the Kop). EUR 63.6m. Tied. |
| 10 | Naby Keita | RB Leipzig | 2018 | £52.7m | Up to 52.7 (initial 48; Empire of the Kop 52.7). Confidence medium on basis. |

Next below the cut-off (not valid answers): Luis Diaz £49.5m; Milos Kerkez £40m; Cody Gakpo £37m

### Arsenal

| Rank | Player | From | Year | Fee | Note |
|---|---|---|---|---|---|
| 1 | Declan Rice | West Ham United | 2023 | £105m | Headline £105m per context; Wikipedia records page shows £100m (some reports £100m plus £5m add-ons). Confident on club record. |
| 2 | Bruno Guimaraes | Newcastle United | 2026 | £75m | Single secondary source (roundtable.io). Moderate confidence; not cross-checked. |
| 3 | Nicolas Pepe | Lille | 2019 | £72m | Reported £72m; Wikipedia records page agrees. High confidence. |
| 4 | Viktor Gyokeres | Sporting CP | 2025 | £63.5m | Widely reported £55m plus add-ons up to ~£63.5m (some say £64m); figure from memory of 2025 reports, page not opened. Moderate confidence. |
| 5 | Kai Havertz | Chelsea | 2023 | £62m | Wikipedia £62m; some outlets £65m with add-ons. High confidence. |
| 6 | Eberechi Eze | Crystal Palace | 2025 | £60m | Wikipedia £60m (some reports £67.5m incl. add-ons). High confidence on headline. |
| =7 | Pierre-Emerick Aubameyang | Borussia Dortmund | 2018 | £56m | Wikipedia £56m (some say £60m). Moderate-high confidence. |
| =7 | Martin Zubimendi | Real Sociedad | 2025 | £56m | Release clause about EUR 60m reported as £51m or £56m; Wikipedia says £56m. Moderate confidence. |
| 9 | Ezri Konsa | Aston Villa | 2026 | £55m | Single secondary source (roundtable.io). Moderate confidence; not cross-checked. |
| 10 | Ben White | Brighton & Hove Albion | 2021 | £50m | Widely reported £50m (up to £50m). 10th place has no tie among known deals, but fee for Madueke is close (48.5). Not re-verified this run. |

Next below the cut-off (not valid answers): Noni Madueke £48.5m; Alexandre Lacazette £46.5m; Gabriel Jesus £45m

### Chelsea

| Rank | Player | From | Year | Fee | Note |
|---|---|---|---|---|---|
| 1 | Morgan Rogers | Aston Villa | 2026 | £117m | Club record; Wikipedia and Irish News headline £117m. High confidence. |
| 2 | Moises Caicedo | Brighton & Hove Albion | 2023 | £115m | Context file £115m (incl. add-ons); Wikipedia records page shows £100m initial. Alternatives: 100 / 115. |
| 3 | Enzo Fernandez | Benfica | 2023 | £106.8m | EUR 121m release clause = £106.8m. High confidence. |
| 4 | Romelu Lukaku | Inter Milan | 2021 | £97.5m | High confidence. |
| 5 | Mykhailo Mudryk | Shakhtar Donetsk | 2023 | £88.5m | Context file £88.5m (maximum incl. add-ons); initial fee £62m per Wikipedia. Alternatives: 62 / 88.5. If ranked at 62 he would fall to =8 level. |
| 6 | Kepa Arrizabalaga | Athletic Bilbao | 2018 | £71.6m | EUR 80m release clause = £71.6m. High confidence. |
| 7 | Wesley Fofana | Leicester City | 2022 | £70m | Reported £70m. High confidence. |
| 8 | Kai Havertz | Bayer Leverkusen | 2020 | £62m | Initial £62m; up to ~£71m with add-ons per some outlets. |
| 9 | Joao Pedro | Brighton & Hove Albion | 2025 | £60m | ESPN/Goal headline £60m (reported as £55m plus £5m add-ons by some). Moderate-high confidence. |
| =10 | Alvaro Morata | Real Madrid | 2017 | £58m | Wikipedia £58m; some reports £60m (up to £70m reported by others). Moderate confidence. |
| =10 | Christian Pulisic | Borussia Dortmund | 2019 | £58m | Wikipedia £58m; also reported £57.6m (EUR 64m). Moderate-high confidence. |
| =10 | Romeo Lavia | Southampton | 2023 | £58m | Sky Sports and theScore headline £58m (including add-ons). High confidence. |

Next below the cut-off (not valid answers): Marc Cucurella £55.3m; Maxence Lacroix £52m; Christopher Nkunku £52m

### Man City

| Rank | Player | From | Year | Fee | Note |
|---|---|---|---|---|---|
| 1 | Enzo Fernandez | Chelsea | 2026 | £125m | Joint British record; consistent across Al Jazeera and Reuters factbox. High confidence |
| 2 | Elliot Anderson | Nottingham Forest | 2026 | £116m | Reuters factbox says 115; Flashscore/ITV/The National say 116. Using 116 |
| 3 | Jack Grealish | Aston Villa | 2021 | £100m | Widely reported headline £100m; high confidence |
| 4 | Ayyoub Bouaddi | Lille | 2026 | £86m | ITV/Capital FM say 86; Echo/Citizen say 85.6; Reuters factbox says 100 (outlier). Using 86 per brief |
| 5 | Josko Gvardiol | RB Leipzig | 2023 | £77.6m | Wikipedia records page says 77.5; most outlets 77.6. High confidence |
| =6 | Antoine Semenyo | Bournemouth | 2026 | £65m | Jan 2026. Sky said 64 in headline; most outlets 65. Using 65 |
| =6 | Iliman Ndiaye | Everton | 2026 | £65m | Euro equivalent 75.8m (Irish outlets); theScore/Reuters say 65. Sep 2026 |
| =6 | Ruben Dias | Benfica | 2020 | £65m | Per brief 65 (widely reported headline incl. some add-ons); Wikipedia records page shows 62; other outlets 61-65. Medium confidence |
| 9 | Rodri | Atletico Madrid | 2019 | £63.6m | Wikipedia 63.6; others 62.8 or 63; EUR 70m. Medium confidence |
| =10 | Riyad Mahrez | Leicester City | 2018 | £60m | Wikipedia 60; EUR 67.8m also quoted. Tied for 10th |
| =10 | Joao Cancelo | Juventus | 2019 | £60m | Wikipedia 60; EUR 65m quoted by footballtransfers (part of Danilo swap deal). Tied for 10th |

Next below the cut-off (not valid answers): Omar Marmoush £59m; Aymeric Laporte £57m; Jeremy Doku £55.4m

### Spurs

| Rank | Player | From | Year | Fee | Note |
|---|---|---|---|---|---|
| 1 | Sandro Tonali | Newcastle United | 2026 | £100m | Reuters/theScore/others 100; Wikipedia says 92.5+ (add-ons); EUR 108m quoted. Club record. Using 100 |
| =2 | Mateus Fernandes | West Ham United | 2026 | £85m | Consistent at 85 (City AM; Reuters factbox; Wikipedia). EUR 99m quoted by All Football. High confidence |
| =2 | Savinho | Manchester City | 2026 | £85m | Reuters and PA say 85; Wikipedia says 75+ (possible add-ons structure); EUR 87.7m quoted. Using 85 |
| 4 | Tanguy Ndombele | Lyon | 2019 | £55.4m | Wikipedia 55.4+; Football Whispers 63 incl add-ons; Planet Football 55. Using initial fee |
| =5 | Dominic Solanke | Bournemouth | 2024 | £55m | Wikipedia/Planet Football 55; TNT Sports reported up to 65 with add-ons. Using 55 |
| =5 | Mohammed Kudus | West Ham United | 2025 | £55m | Wikipedia and Planet Football 55 |
| 7 | Jan Paul van Hecke | Brighton & Hove Albion | 2026 | £52m | ESPN/theScore 52; agreed June 2026 |
| 8 | Xavi Simons | RB Leipzig | 2025 | £51.8m | Wikipedia 51; Planet Football 51.8; EUR 65m quoted. Using 51.8 |
| 9 | Richarlison | Everton | 2022 | £50m | Initial 50; Football Whispers lists 60 including add-ons. Using 50 |
| 10 | Brennan Johnson | Nottingham Forest | 2023 | £47.5m | Consistent at 47.5 across sources. No tie at 10th |

Next below the cut-off (not valid answers): Cristian Romero £42.5m; Davinson Sanchez £42m; James Maddison £40m

### Newcastle

| Rank | Player | From | Year | Fee | Note |
|---|---|---|---|---|---|
| 1 | Nick Woltemade | VfB Stuttgart | 2025 | £69.3m | Club record. Footballtransfers lists EUR75m; Wikipedia 69.3; commonly rounded to 69. High confidence. |
| 2 | Alexander Isak | Real Sociedad | 2022 | £63m | Wikipedia and 90min 63; commonly quoted 'about 60'. Sold to Liverpool 2025. High confidence. |
| =3 | Yoane Wissa | Brentford | 2025 | £55m | Wikipedia lists 55; some reports about 50 plus add-ons. Medium-high confidence. |
| =3 | Anthony Elanga | Nottingham Forest | 2025 | £55m | Widely reported 55 (agreed July 2025). Footballtransfers EUR61.4m. High confidence. |
| =3 | Sandro Tonali | AC Milan | 2023 | £55m | 90min 55; Shields Gazette and others quoted 52 initial rising to 55-63 with add-ons; footballtransfers EUR60.8m. Sold to Spurs 2026. Medium confidence on exact figure. |
| 6 | Nico Gonzalez | Manchester City | 2026 | £52m | Reported 52 by theScore and beIN; Newcastle World said 50; Wikipedia summer 2026 page 47. Unconfirmed officially. Medium confidence. Top-10 place unaffected. |
| 7 | Matias Fernandez-Pardo | Lille | 2026 | £51m | Reported 51 by ESPN and Goal (deadline day). High confidence. |
| 8 | Anthony Gordon | Everton | 2023 | £45m | Reported 45 initial (some reports up to 55 with add-ons). Jan 2023. Sold to Barcelona 2026. High confidence. |
| 9 | Jacob Ramsey | Aston Villa | 2025 | £43m | Wikipedia 43; footballtransfers EUR45.2m. Medium-high confidence. |
| 10 | Bazoumana Toure | Hoffenheim | 2026 | £42.8m | Wikipedia 42.8; Africasoccer reported EUR50m (about 43). Official fee undisclosed. Medium confidence. No tie at 10th (next is 40). |

Next below the cut-off (not valid answers): Joelinton £40m; Bruno Guimaraes £40m; Harvey Barnes £38m

### Aston Villa

| Rank | Player | From | Year | Fee | Note |
|---|---|---|---|---|---|
| 1 | Nicolas Jackson | Chelsea | 2026 | £65m | Headline 65 (beIN, Flashscore). Wikipedia: 47.5 guaranteed plus 17.5 add-ons. High confidence on headline. |
| 2 | Johan Manzambi | SC Freiburg | 2026 | £59.5m | Reported 52 initially (Express and Star, Wikipedia) rising to 59.5 with add-ons (readastonvilla); footballtransfers EUR60m. If initial fee is used instead, he is 52 and still 2nd. Medium confidence on which figure is 'headline'. |
| 3 | Amadou Onana | Everton | 2024 | £50m | Reported 50 (Football Whispers, Wikipedia). Footballtransfers EUR59.4m. High confidence. |
| 4 | Ibrahim Mbaye | Paris Saint-Germain | 2026 | £47m | Reported 47 (theScore, Ground News). Footballtransfers EUR55m. High confidence. |
| 5 | Moussa Diaby | Bayer Leverkusen | 2023 | £43m | Football Whispers 43; Wikipedia summariser shows 51.9 maximum with add-ons (summariser text garbled, treat as unconfirmed). Footballtransfers EUR55m. Ordering only affected if 51.9 used. |
| =6 | Joao Gomes | Wolverhampton Wanderers | 2026 | £38m | 34 base plus 4 add-ons (Wikipedia, readastonvilla); 34 if base used. High confidence. |
| =6 | Emiliano Buendia | Norwich City | 2021 | £38m | 33 initial rising to 38 with add-ons (Wikipedia); Football Whispers 33. If 33 is used he drops below Maatsen and Torres but stays in 9th-10th range. Medium confidence. |
| 8 | Ian Maatsen | Chelsea | 2024 | £37.5m | Reported 37.5 (Wikipedia, Football Whispers). High confidence. |
| 9 | Pau Torres | Villarreal | 2023 | £31.5m | Reported 31.5 (Wikipedia, Football Whispers). High confidence. |
| =10 | Evann Guessand | Nice | 2025 | £30m | Reported 30 (Football365, Fotmob, Citizen Digital). High confidence. |
| =10 | Taylor Harwood-Bellis | Southampton | 2026 | £30m | Wikipedia 25 base plus 5 add-ons; football365 combined 'double swoop' with Mbaye at 77 (47 + 30). If base fee 25 is used he drops out of the tie. Medium confidence. |
| =10 | Leon Bailey | Bayer Leverkusen | 2021 | £30m | Reported 30 (Wikipedia). Not cross-checked with a second source in this run. Medium confidence. |

Next below the cut-off (not valid answers): Zion Suzuki £29.9m; Ollie Watkins £28m; Lucas Digne £25m

### West Ham

| Rank | Player | From | Year | Fee | Note |
|---|---|---|---|---|---|
| 1 | Lucas Paqueta | Lyon | 2022 | £51m | Club record. Westhamzone and 3addedminutes say 51; Goal lists 38.66 (likely a conversion error). High confidence in 51 as the widely reported fee |
| 2 | Sebastien Haller | Eintracht Frankfurt | 2019 | £45m | Reported 45; Football Whispers says 43. Westhamzone says 2021 but signing was July 2019. High confidence in 45 |
| 3 | Mateus Fernandes | Southampton | 2024 | £42m | Both lists say 42. Sold to Tottenham in 2026 for 85 (per context). Medium-high confidence |
| 4 | Max Kilman | Wolves | 2024 | £40m | Summer 2024 (3addedminutes says 2023 which looks wrong). 40 reported by Football Whispers and both lists |
| 5 | Mohamed Kudus | Ajax | 2023 | £38m | Football Whispers says 37; westhamzone and 3addedminutes say 38. Initial fee around 38 (EUR 44m) |
| 6 | Felipe Anderson | Lazio | 2018 | £36m | Goal lists 34.2; westhamzone and 3addedminutes 36; ESPN reported club record at the time. Medium confidence |
| 7 | Edson Alvarez | Ajax | 2023 | £35.4m | Sky Sports 35.4; others round to 35; thescore EUR 38m |
| 8 | Jean-Clair Todibo | Nice (via Juventus) | 2024 | £34m | Loan Aug 2024 with obligation; made permanent 1 Jul 2025 for EUR 40m (about 34 GBP). Other lists 35 and 36.2. Year is 2024 (loan) or 2025 (permanent). Unsure of exact GBP figure |
| 9 | Gianluca Scamacca | Sassuolo | 2022 | £30.7m | Reported 30.7 at signing; Goal 32.4; westhamzone 35.5 and 3addedminutes 35 (likely euro). Unsure which; could rank above Todibo and Alvarez if 35 is used |
| 10 | Nayef Aguerd | Rennes | 2022 | £30m | Sky Sports and others report 30; Goal lists 31.5. Zouma is 29.8 so 10th place is close but no exact tie |

Next below the cut-off (not valid answers): Kurt Zouma £29.8m; Niclas Fullkrug £27m; Nikola Vlasic £26.5m

### Everton

| Rank | Player | From | Year | Fee | Note |
|---|---|---|---|---|---|
| 1 | Gylfi Sigurdsson | Swansea City | 2017 | £45m | Club record. Widely reported 45; Sportsdunia says 40 plus 5 add-ons; Football Whispers 44; footballtransfers EUR 49.4m. High confidence |
| =2 | Richarlison | Watford | 2018 | £35m | Initial 35 (Football365 35; Football Whispers 36); Sportsdunia says 40; Eurosport reported talks up to 50 with add-ons. Medium confidence on exact figure |
| =2 | Tyler Dibling | Southampton | 2025 | £35m | Wikipedia 2025-26 season page says 35; footballtransfers EUR 40.5m (about 35). Medium-high confidence |
| 4 | Amadou Onana | Lille | 2022 | £33m | Reported figures vary: 30.8 (Football365) 31 (Sportsdunia) 31.5 (Football Whispers) EUR 39.9m. 33 is not confirmed this session; treat as 31 to 33. Unsure |
| 5 | Romelu Lukaku | Chelsea | 2014 | £28m | Sportsdunia 28; Football365 31.8; Football Whispers 31; EUR 35.4m. Some reports 28 rising to 35 with add-ons. Previously on loan at Everton in 2013-14 but this is the permanent fee. Unsure |
| 6 | Alex Iwobi | Arsenal | 2019 | £28m | Football Whispers and Sportsdunia 28; Football365 27; EUR 30.4m. Initial 27 rising to 34 reported elsewhere |
| 7 | Moise Kean | Juventus | 2019 | £27.5m | Sportsdunia 27.5; Football365 24.75. Medium confidence |
| 8 | Yerry Mina | Barcelona | 2018 | £27.2m | Goal reported 27 bid; Sportsdunia 27; EUR 30.3m. About 27 |
| 9 | Thierno Barry | Villarreal | 2025 | £27m | Wikipedia 26; Vavel 27; footballtransfers EUR 30m. Between 26 and 27.5 |
| =10 | Jordan Pickford | Sunderland | 2017 | £25m | Initial 25 rising to 30 with add-ons per Sportsdunia; Football365 25.65. Tied on 25 |
| =10 | Michael Keane | Burnley | 2017 | £25m | Sportsdunia 25; Football365 25.65. Tied on 25 |
| =10 | Yannick Bolasie | Crystal Palace | 2016 | £25m | Sportsdunia 25; Football365 26; footballtransfers EUR 28.9m. Tied on 25 |
| =10 | Kiernan Dewsbury-Hall | Chelsea | 2025 | £25m | Wikipedia 25; footballtransfers EUR 28.7m. Tied on 25 |

Next below the cut-off (not valid answers, but Godfrey is £25m on headline fee and £20m initial, so he could join the tie on a headline basis): Ben Godfrey £25m; Davy Klaassen £24m; Jean-Philippe Gbamin £22.5m

Weakest club lists, in order of doubt: Everton and West Ham (only secondary lists were readable; several fees are a few million different between outlets), Aston Villa (some fees are base plus add-ons), Arsenal (Guimaraes and Konsa 2026 deals rest on one source, Gyokeres and Ben White not re-opened). Before building any signing board, spot-check the 10th-place fee, because that is where a small disagreement changes who is on the board.

## Rules reminder

- Exactly 10 answers per board plus all tied entries at 10th place as a pool.
- No answer in 4 or more slots on a board. No board here lists the same person twice.
- Period line under every question.
- No em dashes in any text, code or commits.
- Figures may be out by one goal or game: use what looks right, do not create alternative answers.
