# Premier League club signings, headline fees (researched 3 October 2026)

Two research passes by web search for the ten clubs in docs/data/Tenaball_new_boards_2026-10-03.md, board 10. The game uses the headline fee (add-ons included) as the other fee boards do. All ten clubs are built (`pl-fee-buys-*` in scripts/build-pl-records.py). For Everton, Craig left the call to us: Moise Kean is taken at Sky's £36.6m (Juventus said about £29m).

## Record signings, headline basis: Man Utd, Liverpool, Arsenal, Chelsea, Man City

Checked 3 October 2026 by web search (search-result text only; pages were not opened). Basis for every row: the HEADLINE fee, meaning the biggest figure prominent outlets report including add-ons. Permanent signings 1992 to 1 September 2026. "Source" names the outlet whose report the search returned; "2+" in confidence means two or more independent outlets agreed. Rows marked "single source" had only one outlet carrying the headline figure in the results.

---

## Man Utd

| Rank | Player | From | Year | Headline £m | Source | Confidence |
|---|---|---|---|---|---|---|
| 1 | Romelu Lukaku | Everton | 2017 | 90 | Sky Sports ("£90m move"), theScore; £75m up front plus £15m add-ons | High (2+) |
| 2 | Paul Pogba | Juventus | 2016 | 89 | Al Jazeera, TNT Sports/Eurosport | High (2+) |
| 3 | Antony | Ajax | 2022 | 85.5 | Yahoo UK ("£85m"), beIN; £81.3m plus add-ons to £85.5m | High (2+) |
| 4 | Harry Maguire | Leicester City | 2019 | 80 | ESPN, Goal, Shoot | High (2+) |
| 5 | Benjamin Sesko | RB Leipzig | 2025 | 73.7 | Reuters/AFP syndication (beIN, Free Malaysia Today): £66.3m guaranteed, £73.7m total | High (2+) |
| 6 | Jadon Sancho | Borussia Dortmund | 2021 | 73 | Football365, Goal, Yahoo UK | High (2+) |
| 7 | Rasmus Hojlund | Atalanta | 2023 | 72 | Sky Sports ("£72m deal"), SI; £64m plus £8m | High (2+) |
| 8 | Bryan Mbeumo | Brentford | 2025 | 71 | Sky Sports ("£71m transfer"), theScore; £65m plus £6m | High (2+) |
| =9 | Casemiro | Real Madrid | 2022 | 70 | BBC (via FBC News), Sky Sports original headline "£70m"; £60m plus £10m | High (2+) |
| =9 | Carlos Baleba | Brighton | 2026 | 70 | AP (TSN, Lethbridge Herald): "reported £70m"; British media £65m plus £5m | High (2+) |

Next below the cut-off (not valid answers): 11th Matheus Cunha £62.5m (Sky Sports, release clause); 12th Mason Mount £60m (£55m plus £5m; Yahoo UK, Flashscore). Then Angel Di Maria £59.7m, Leny Yoro about £59m, Andrey Santos £50m incl. add-ons (2026).

**Differences from the doc:** order changes throughout. Lukaku (90, not 75) goes top, so the existing `pl-fee-clubbuy` row naming Pogba as United's record signing conflicts on headline basis. Antony 85.5 (doc 81.3). Sesko 73.7 (doc 66.3) moves above Sancho. Mbeumo 71 and Baleba 70 are no longer tied. **Casemiro (70) enters** at =9 and **Cunha (62.5) drops out** to 11th. Exactly ten names, Casemiro and Baleba share 9th and 10th.

---

## Liverpool

| Rank | Player | From | Year | Headline £m | Source | Confidence |
|---|---|---|---|---|---|---|
| 1 | Alexander Isak | Newcastle United | 2025 | 125 | TNT Sports, LBC, Reuters syndication | High (2+) |
| 2 | Bradley Barcola | Paris Saint-Germain | 2026 | 123 | AP (Ahram), The National, Cyprus Mail; £106m plus £17m. NST/AFP gives 124 | High on 123 (2+); 124 a minority figure |
| 3 | Florian Wirtz | Bayer Leverkusen | 2025 | 116.5 | Sky Sports, City AM (£100m plus £16.5m) | High (2+) |
| 4 | Darwin Nunez | Benfica | 2022 | 85 | Sky Sports, City AM (£64m plus up to £21m) | High (2+) |
| 5 | Hugo Ekitike | Eintracht Frankfurt | 2025 | 79 | The National, Flashscore (£69m plus £10m) | High (2+) |
| 6 | Virgil van Dijk | Southampton | 2018 | 75 | SI, ESPN (Maguire stories cite it) | High (2+) |
| 7 | Alisson | Roma | 2018 | 66.8 | Shoot, 90min, theScore | High (2+) |
| =8 | Dominik Szoboszlai | RB Leipzig | 2023 | 60 | Guardian (PressReader), SI, Liverpool FC media watch | High (2+) |
| =8 | Jeremy Jacquet | Rennes | 2026 | 60 | Sky Sports ("£60m"), AP; £55m plus £5m | High (2+) |
| 10 | Naby Keita | RB Leipzig | 2018 | 52.75 | Empire of the Kop; widely £48m when agreed in 2017, final 52.75 after Leipzig's league finish | Medium: single source in these results for 52.75 |

Next below the cut-off: 11th Luis Diaz £49m (Sky Sports, £37m rising to £49m); 12th Milos Kerkez £40m (from doc, not re-checked). Victor Munoz (£34m, 2026) is well below.

**Differences from the doc:** same ten names and same order. Only figure changes: Wirtz 116.5 (doc 116), Diaz 49 (doc 49.5). Barcola keep 123 (124 in some outlets; the "EUR 125m" note in the doc conflicts with theScore's "up to EUR 145m", worth correcting in the note).

---

## Arsenal

| Rank | Player | From | Year | Headline £m | Source | Confidence |
|---|---|---|---|---|---|---|
| 1 | Declan Rice | West Ham United | 2023 | 105 | Flashscore/Reuters, Camden New Journal (£100m plus £5m) | High (2+) |
| 2 | Bruno Guimaraes | Newcastle United | 2026 | 75 | Sky Sports, theScore, Irish Examiner | High (2+) |
| 3 | Nicolas Pepe | Lille | 2019 | 72 | Sky Sports, ITV | High (2+) |
| 4 | Eberechi Eze | Crystal Palace | 2025 | 67.5 | Sky Sports ("£67.5m deal"), Flashscore (£68m); £60m plus £7.5m | High (2+) |
| 5 | Kai Havertz | Chelsea | 2023 | 65 | Flashscore, TheCable (£62m plus £3m) | High (2+) |
| 6 | Viktor Gyokeres | Sporting CP | 2025 | 63.5 | £55m plus about £8.5m; "as much as £64m" in PA syndication (Irish News, Offaly Express) | Medium-high (headline is "£55m" in most titles; 63.5 to 64 is the add-ons total) |
| 7 | Martin Zubimendi | Real Sociedad | 2025 | 60 | BBC "almost £60m" (paid over the £51m clause to spread it); Capital FM/AFP "£60m" | Low-medium: figures range 51 / 55 / 60 |
| 8 | Pierre-Emerick Aubameyang | Borussia Dortmund | 2018 | 56 | Eurosport, Daily Mail, ITV | High (2+) |
| 9 | Ezri Konsa | Aston Villa | 2026 | 55 | Sky Sports (headline updated from £51m to "£55m"), Sports Mole; £51m plus £4m | High (2+) |
| 10 | Alexandre Lacazette | Lyon | 2017 | 52.6 | Shoot, Capital FM: £46.5m, could rise to £52.6m (some say 52.7) | Medium-high |

Next below the cut-off: 11th Noni Madueke £52m (Sky Sports "£52m deal", £48.5m plus £3.5m); 12th Ben White £50m (Sky Sports, TNT Sports). Then Gabriel Jesus £45m.

**Differences from the doc:** Eze 67.5 (doc 60) moves up to 4th; Havertz 65 (doc 62); Gyokeres drops to 6th; Zubimendi 60 (doc 56) goes above Aubameyang; Konsa is 55 on headline (Sky now says 55). **Lacazette (52.6) enters at 10th and Ben White drops out** (to 12th, behind Madueke 52). Note how fragile 7th to 11th is: if Zubimendi is taken at the £51m clause he falls to 12th and Madueke (52) becomes 10th. Recommend 60 for Zubimendi only if Craig accepts the BBC "almost £60m" wording; otherwise drop the ambiguity by using 51 and ranking Konsa 7, Lacazette 8, Madueke 9, Zubimendi 10 (51) with White 11.

---

## Chelsea

| Rank | Player | From | Year | Headline £m | Source | Confidence |
|---|---|---|---|---|---|---|
| 1 | Morgan Rogers | Aston Villa | 2026 | 117 | Express and Star/PA, Sky Sports, Outlook India | High (2+) |
| 2 | Moises Caicedo | Brighton & Hove Albion | 2023 | 115 | theScore, Citizen Digital (£100m plus £15m) | High (2+) |
| 3 | Enzo Fernandez | Benfica | 2023 | 106.8 | CNBC, TNT Sports/Eurosport | High (2+) |
| 4 | Romelu Lukaku | Inter Milan | 2021 | 97.5 | Sky Sports, TNT Sports | High (2+) |
| 5 | Mykhailo Mudryk | Shakhtar Donetsk | 2023 | 88.5 | Sporting Life/PA: £62m up front plus £26.5m add-ons ("rising to £88m") | High (2+) |
| 6 | Wesley Fofana | Leicester City | 2022 | 75 | Flashscore/Reuters, ESPN (£70m plus £5m) | High (2+) |
| 7 | Kepa Arrizabalaga | Athletic Bilbao | 2018 | 71.6 | Wikipedia, Stadium Astro (EUR 80m release clause) | High (2+) |
| 8 | Kai Havertz | Bayer Leverkusen | 2020 | 71 | theScore, TheCable (£62m rising to £71m) | High (2+) |
| 9 | Alvaro Morata | Real Madrid | 2017 | 70 | Yahoo UK/Telegraph "club record £70m"; Malay Mail "£70.6m with add-ons"; initial about £58m | Medium-high (headline 70 to 70.6) |
| 10 | Marc Cucurella | Brighton & Hove Albion | 2022 | 62 | Irish Times, SI (£55m plus up to £7m) | High (2+) |

Next below the cut-off: 11th Joao Pedro £60m (£55m plus £5m; Peninsula/AFP, Capital FM); 12th =Romeo Lavia £58m (£53m plus £5m; theScore, SI) and Christian Pulisic £58m (doc figure, not re-checked). Then Jorginho £57m (Sky/TNT, £50m rising to £57m), Maxence Lacroix £52m (2026), Christopher Nkunku £52m.

**Differences from the doc:** Fofana is 75 on headline (doc 70) and moves above Kepa; Havertz 71 (doc 62); **Morata 70 (doc 58) and Cucurella 62 (doc 55.3 below the cut) enter**; **Joao Pedro drops to 11th; Lavia and Pulisic drop out** (12th). No tie at 10th any more. Chelsea signed nothing of note in January 2026; summer 2026 adds Rogers, Lacroix (52), Marco Palestra (47) and Geovany Quenda (40), none of which besides Rogers reach the ten.

---

## Man City

| Rank | Player | From | Year | Headline £m | Source | Confidence |
|---|---|---|---|---|---|---|
| 1 | Enzo Fernandez | Chelsea | 2026 | 125 | ITV, Irish News/PA, LBC | High (2+) |
| 2 | Elliot Anderson | Nottingham Forest | 2026 | 116 | Sky Sports, Flashscore, AP | High (2+) |
| 3 | Jack Grealish | Aston Villa | 2021 | 100 | Goal, TBS/Reuters | High (2+) |
| 4 | Ayyoub Bouaddi | Lille | 2026 | 86 | ITV, Sky Sports/Capital FM ("£86m"); Echo/PA 85.6 (£81.3m plus £4.3m) | High (2+) |
| 5 | Josko Gvardiol | RB Leipzig | 2023 | 77.6 | Sky Sports, Breaking News/PA | High (2+) |
| =6 | Antoine Semenyo | Bournemouth | 2026 | 65 | Shoot, Malay Mail, Capital FM (release clause); Sky said 64 | High (2+) |
| =6 | Iliman Ndiaye | Everton | 2026 | 65 | Irish News/PA, theScore (£60m plus £5m) | High (2+) |
| =6 | Ruben Dias | Benfica | 2020 | 65 | Sky Sports ("£65m deal": £62m plus £3m) | High (2+) |
| 9 | Omar Marmoush | Eintracht Frankfurt | 2025 | 63.2 | Flashscore/AFP "£63m deal"; Al Jazeera "£59m plus £4.2m add-ons" | Medium: no BBC/Sky headline at 63 seen; theScore headline is £59m |
| 10 | Rodri | Atletico Madrid | 2019 | 62.8 | Eurosport, Daily Mail, Sports Mole (ITV says 62.6) | High (2+) |

Next below the cut-off: =11th Riyad Mahrez £60m (Goal) and Joao Cancelo £60m (Goal, FourFourTwo; EUR 65m package including Danilo). Then Aymeric Laporte £57m, Jeremy Doku £55.4m. Summer 2026 smaller buys (Allan Elias £34.2m, Jeremy Monga £10m) and Marc Guehi (January 2026, about £20m) are well below.

**Differences from the doc:** Rodri 62.8 (doc 63.6). **Marmoush (63.2 with add-ons) enters at 9th, Rodri goes 10th, and Mahrez and Cancelo drop out** (tied 11th). If Craig prefers not to rely on Marmoush's add-ons figure (one wire service, not BBC or Sky), use 59 for him: then Rodri is 9th and Mahrez and Cancelo tie for 10th as in the doc (11 names).

---

## Rows supported by one source only (flag)

- Liverpool: Keita 52.75 (Empire of the Kop in these results).
- Arsenal: Zubimendi 60 (BBC wording "almost £60m"; the exact number is AFP's).
- Man City: Marmoush 63.2 (AFP/Flashscore only for the total; others give 59 headline).
- Not re-checked this run (outside the ten): Pulisic 58, Kerkez 40.

## Record signings, headline basis: Spurs, Newcastle, Aston Villa, West Ham, Everton

Checked 3 October 2026. Basis: the HEADLINE fee, meaning the biggest figure prominent UK outlets reported including add-ons. Permanent signings 1992 to 1 September 2026. Loans with an obligation count only once the obligation has been met. Every figure below comes from search result text (WebFetch was not available), so the outlet named is the one whose headline or summary carried the figure.

Confidence: High = two or more outlets agree on the figure. Medium = one prominent outlet, or outlets disagree. Low = one source only, or there is a known conflict.

---

## Spurs

| Rank | Player | From | Year | Headline £m | Source | Confidence |
|---|---|---|---|---|---|---|
| 1 | Sandro Tonali | Newcastle United | 2026 | 100 | bein Sports, Flashscore, Reuters via The Star: club record "worth up to £100m" (£92.5m initial plus £7.5m add-ons) | High |
| =2 | Mateus Fernandes | West Ham United | 2026 | 85 | ESPN, Flashscore, bein Sports: "club-record £85m" | High |
| =2 | Savinho | Manchester City | 2026 | 85 | Express and Star (PA): initial £75m plus £10m add-ons; eNCA and NST give only the £75m | Medium (85 is the full package; several outlets give only the £75m initial) |
| 4 | Dominic Solanke | Bournemouth | 2024 | 65 | Express and Star (PA), Capital FM, theScore: "deal worth up to £65m" (£55m plus £10m) | High |
| 5 | Tanguy Ndombele | Lyon | 2019 | 63 | Sky Sports: "Tottenham sign Tanguy Ndombele for £63m" (EUR 60m plus 10m) | High |
| 6 | Richarlison | Everton | 2022 | 60 | Sky Sports: "complete £60m deal" (£50m plus £10m); ESPN "£60m" | High |
| 7 | Mohammed Kudus | West Ham United | 2025 | 55 | theScore, Goal, SI, TeamTalk: about £55m | High |
| 8 | Jan Paul van Hecke | Brighton | 2026 | 52 | ESPN: "agree £52m deal", fixed fee with no add-ons; theScore £52m | High |
| 9 | Xavi Simons | RB Leipzig | 2025 | 51.8 | PA via Irish regional papers: EUR 60m (£51.8m) | High |
| 10 | Brennan Johnson | Nottingham Forest | 2023 | 47.5 | Sky Sports: "in £47.5m deal"; Football365 £47.5m | High |
| 11 | Cristian Romero | Atalanta | 2021 | 47 | Football Faithful and SI: total package about £47m (EUR 55m), loan then permanent | Medium |
| 12 | Davinson Sanchez | Ajax | 2017 | 42 | Widely reported £42m club record at the time | Medium (not searched again in this run) |

How this differs from the doc:
- Order changes. Solanke (65), Ndombele (63) and Richarlison (60) go up to 4th, 5th and 6th on headline fees. The doc used 55, 55.4 and 50.
- Kudus drops from =5 to 7th. Van Hecke goes from 7th to 8th and Simons from 8th to 9th.
- The ten names don't change. No tie at 10th.
- Savinho: only PA gives the £85m total. Most other outlets say £75m. He is =2nd at 85 or 3rd at 75, so either way he stays in the top three.
- Not counted: Omar Marmoush (Man City, 2026) is a loan with a £50m obligation to buy that has not been met yet. Mykhailo Mudryk (Chelsea, 2026) is a loan with an option. If Marmoush's obligation is met (£50m), he goes in at 10th and knocks out Johnson. Check this again in summer 2027.
- ESPN's Fernandes story says Solanke's £65m was the club record before 2026. That matches the headline basis.

---

## Newcastle

| Rank | Player | From | Year | Headline £m | Source | Confidence |
|---|---|---|---|---|---|---|
| 1 | Nick Woltemade | VfB Stuttgart | 2025 | 69 | PA via Hello Rayo, Newcastle World: "club-record £69m" | High |
| 2 | Alexander Isak | Real Sociedad | 2022 | 63 | Sky Sports and TNT Sports: £58m rising to £63m with add-ons | High |
| =3 | Yoane Wissa | Brentford | 2025 | 55 | Sky Sports and Flashscore: £50m plus £5m | High |
| =3 | Anthony Elanga | Nottingham Forest | 2025 | 55 | ESPN, Sky Sports, Flashscore: £55m | High |
| =3 | Sandro Tonali | AC Milan | 2023 | 55 | Sky Sports: "announce £55m signing"; Sporting Life £55m. Newcastle World said £52m plus add-ons | High |
| 6 | Nico Gonzalez | Manchester City | 2026 | 52 | bein Sports and theScore: £52m (£48m plus about £4m); Newcastle World £50m | High |
| 7 | Matias Fernandez-Pardo | Lille | 2026 | 51 | ESPN and theScore: "reported £51m deal"; British media £51.4m | Medium (before the deal, reports said up to £55m; TeamTalk says £55m) |
| 8 | Anthony Gordon | Everton | 2023 | 45 | Sky Sports: "joins Newcastle for £45m" (£40m plus £5m) | High |
| =9 | Jacob Ramsey | Aston Villa | 2025 | 43 | Sky Sports: "deal worth up to £43m" (£39m plus £4m) | High |
| =9 | Bazoumana Toure | Hoffenheim | 2026 | 43 | Reuters via Flashscore: British media £43m. Sky Sports £42m, Sports Mole £42.5m | Medium |
| 11 | Bruno Guimaraes | Lyon | 2022 | 42 | EUR 50.1m to 50.5m with bonuses, quoted as about £42m (footballtransfers, Arab News conversion). Most UK outlets said £40m | Low |
| 12 | Joelinton | Hoffenheim | 2019 | 40 | Club record at the time, as quoted in the Isak reports (Isak's fee was "57.5% above" it) | Medium |

How this differs from the doc:
- Tonali: the "up to £63m" mentioned in the brief was not found from any outlet. Sky, Sporting Life and SI all say £55m. Gordon: the "up to £55m" in the brief was not found either. Sky and Football365 say £45m in total (£40m plus £5m). Both keep the doc's figures.
- Toure goes up from 42.8 to 43 and ties Ramsey for 9th. On Sky's £42m he would be 10th alone.
- Membership is the same as the doc's.
- Risk at 10th: Bruno could be £42m or £40m depending on the outlet. If Toure is taken at Sky's £42m and Bruno at £42m, they tie for 10th. I recommend Toure at 43 (Reuters, quoting British media), with Bruno outside the ten.
- Fernandez-Pardo: if £55m is accepted as his headline, he joins the tie at =3 and Nico Gonzalez drops to 7th. The ten names don't change.

---

## Aston Villa

| Rank | Player | From | Year | Headline £m | Source | Confidence |
|---|---|---|---|---|---|---|
| 1 | Nicolas Jackson | Chelsea | 2026 | 65 | Sky Sports: "confirm club record £65m signing"; Irish News (PA) £65m | High |
| 2 | Johan Manzambi | SC Freiburg | 2026 | 59.5 | Sky Sports: "club record £59.5m deal"; Express and Star | High |
| 3 | Moussa Diaby | Bayer Leverkusen | 2023 | 51.9 | TNT Sports: club-record deal "in the region of £51.9m" | Medium (one outlet; Football Whispers says 43) |
| 4 | Amadou Onana | Everton | 2024 | 50 | Sky Sports, City AM, ESPN: £50m | High |
| 5 | Ibrahim Mbaye | Paris Saint-Germain | 2026 | 47 | theScore and Football365: £47m (EUR 55m) | High |
| =6 | Joao Gomes | Wolverhampton Wanderers | 2026 | 38 | Sky Sports: "in £38m deal" (£34m plus £4m) | High |
| =6 | Emiliano Buendia | Norwich City | 2021 | 38 | £33m rising to £38m (Wikipedia, citing the press at the time); theScore £33m | Medium |
| 8 | Ian Maatsen | Chelsea | 2024 | 37.5 | Express and Star and NST: £37.5m | High |
| 9 | Ollie Watkins | Brentford | 2020 | 33 | Yahoo UK and theScore: £28m that could rise to £33m | Medium |
| 10 | Pau Torres | Villarreal | 2023 | 31.5 | Reported fee in the region of £31.5m (EUR 32.5m plus 5m add-ons) | Medium |
| =11 | Leon Bailey | Bayer Leverkusen | 2021 | 30 | Express and Star and theScore: £30m (EUR 30m rising to 35m) | Medium |
| =11 | Evann Guessand | Nice | 2025 | 30 | Citizen Digital and FotMob: £30m (£26m plus about £4m) | Medium |
| =11 | Taylor Harwood-Bellis | Southampton | 2026 | 30 | Express and Star: "£30m defender"; Football365 £30m (£25m plus £5m) | High |
| =11 | Danny Ings | Southampton | 2021 | 30 | Yahoo UK: £25m plus £5m add-ons | Medium |

How this differs from the doc:
- Diaby goes up from 5th (43) to 3rd (51.9). Onana and Mbaye each drop one place.
- Ollie Watkins is new at 9th (£28m rising to £33m). The doc had him outside the top ten at £28m.
- Pau Torres becomes 10th alone. The doc's three-way tie for 10th (Guessand, Harwood-Bellis, Bailey) moves to 11th, where Danny Ings (£25m rising to £30m) joins them.
- Not counted: Alejandro Garnacho (Chelsea, 2026) is a loan with a conditional obligation to buy, about £42.6m to £43m according to Sky Sports. The obligation has not been met yet. If it is met in 2027, he goes in at 6th.
- Torres' £31.5m came from one search summary only. Two more add-ons would make it about £32m, so Torres stays 10th either way.

---

## West Ham

| Rank | Player | From | Year | Headline £m | Source | Confidence |
|---|---|---|---|---|---|---|
| 1 | Lucas Paqueta | Lyon | 2022 | 51 | Planet Sport, TeamTalk (citing Sky): £36.5m rising to £51m | High |
| 2 | Sebastien Haller | Eintracht Frankfurt | 2019 | 45 | Telegraph via Yahoo UK: "club record £45m"; ITV "between £45m and £50m" | Medium (ITV's top figure is 50; 2nd either way) |
| =3 | Mateus Fernandes | Southampton | 2025 | 42 | Sky Sports: "complete £42m deal" (£38m plus £4m). Guardian said £38m in total | High |
| =3 | Felipe Anderson | Lazio | 2018 | 42 | ESPN: initial £35m rising to £42m. TeamTalk £42m. Yahoo UK £41.5m | Medium |
| 5 | Max Kilman | Wolves | 2024 | 40 | theScore and Reuters: British media £40m | High |
| 6 | Mohammed Kudus | Ajax | 2023 | 38 | Sky Sports and TNT Sports: "complete £38m deal" | High |
| 7 | Gianluca Scamacca | Sassuolo | 2022 | 35.5 | Sky Sports: "complete £35.5m deal" (£30.5m plus £5m); Guardian £35.5m | High |
| 8 | Edson Alvarez | Ajax | 2023 | 35.4 | Sky Sports: "complete £35.4m" (£32.8m plus £2.6m) | High |
| 9 | Jean-Clair Todibo | Nice | 2024 loan, permanent 2025 | 34.2 | Sports Mole: obligation to buy for £34.22m (EUR 40m), which was met | Medium |
| 10 | Crysencio Summerville | Leeds United | 2024 | 34 | PA via Sporting Life and The League Paper: initial £25m, could rise to £34m | Medium |
| 11 | Nayef Aguerd | Rennes | 2022 | 30 | Sky Sports: "complete £30m signing", around £30m including add-ons | High |
| 12 | Kurt Zouma | Chelsea | 2021 | 29.8 | TNT Sports and Yahoo UK: £29.8m | High |

How this differs from the doc:
- Felipe Anderson goes up from 6th (36) to =3rd (42).
- Scamacca goes from 9th (30.7) up to 7th (35.5). Sky and the Guardian both say £35.5m, so the doc's "likely euro" note is wrong.
- Crysencio Summerville is new at 10th (£25m rising to £34m, PA). Aguerd drops out to 11th.
- Mateus Fernandes signed in August 2025, not 2024 as the doc says.
- Todibo and Summerville are only £0.2m apart. If Todibo is taken as "about £34m", they tie for 9th. That doesn't change who is on the board.
- Kudus's Ajax fee (2023) is also on this board. He appears on the Spurs board too, as a sale from West Ham. That is fine.

---

## Everton

| Rank | Player | From | Year | Headline £m | Source | Confidence |
|---|---|---|---|---|---|---|
| 1 | Richarlison | Watford | 2018 | 50 | BBC Sport (cited by theScore): initial £35m plus £15m add-ons; SI "club-record £50m"; Eurosport "up to £50m" | High |
| 2 | Gylfi Sigurdsson | Swansea City | 2017 | 45 | TNT Sports (Eurosport): "£45m club-record deal"; SI £45m | High |
| 3 | Tyler Dibling | Southampton | 2025 | 42 | Sky Sports: "complete £42m deal" (includes £6m in add-ons that are easy to earn) | Medium (one outlet; Wikipedia says 35) |
| 4 | Moise Kean | Juventus | 2019 | 36.6 | Sky Sports: £27.5m that could rise to £36.6m | Low (Juventus confirmed EUR 27.5m plus 2.5m, about £27.6m to £29m) |
| 5 | Alex Iwobi | Arsenal | 2019 | 34 | BBC: initial £28m rising to £34m. Evening Standard (via Yahoo) said £35m | Medium |
| 6 | Amadou Onana | Lille | 2022 | 33.7 | £25.3m (EUR 30m) rising to £33.7m (EUR 40m); Wikipedia "£33m including add-ons" | Medium |
| =7 | Jordan Pickford | Sunderland | 2017 | 30 | BBC: "£25m, rising to £30m"; bein "£30m" | High |
| =7 | Michael Keane | Burnley | 2017 | 30 | Eurosport: "in £30m deal"; Goal £25m rising to £30m | High |
| =7 | Yannick Bolasie | Crystal Palace | 2016 | 30 | PA via The42 and Last Word on Sports: £25m rising to £30m | Medium |
| 10 | Kiernan Dewsbury-Hall | Chelsea | 2025 | 29 | Sky Sports News: initial £25m rising to about £29m | Medium |
| 11 | Yerry Mina | Barcelona | 2018 | 28.5 | Sky Sports: £27.2m rising to £28.5m | Medium |
| 12 | Romelu Lukaku | Chelsea | 2014 | 28 | PA via Irish News, ITV, Yahoo: club-record £28m | High |

How this differs from the doc (the biggest changes of the five clubs):
- Richarlison goes to 1st on the headline basis (BBC: £35m rising to £50m). Sigurdsson, at £45m, stays the "club record" on the initial basis only.
- Dibling goes up from =2 (35) to 3rd (42, Sky Sports). Onana's headline is 33.7.
- Moise Kean goes up from 7th (27.5) to 4th (36.6, Sky). This is the shakiest figure on any of the five boards. Juventus' own statement says EUR 27.5m plus 2.5m in bonuses, about £29m. If 36.6 is rejected, Kean sits at about 29. That ties him with Dewsbury-Hall for 10th, so there would be two names in 10th place.
- Iwobi goes up from 6th (28) to 5th (34, BBC).
- Pickford, Keane and Bolasie each go from 25 to 30 (=7th). Dewsbury-Hall goes from 25 to 29 and stays in at 10th.
- Out of the top ten: Lukaku (28, now 12th), Mina (28.5, 11th) and Thierno Barry. Barry was 27.5 initial plus appearance add-ons; reports say the deal "could eventually top £30m" and that the total package is EUR 38m, but I found no named UK pound figure. If an outlet gives him £30m or more, he goes into the =7 group. Ben Godfrey (£20m rising to £25m) is well short.
- Summer 2026: Everton's biggest buy was Brennan Johnson at about £22m (ReadEverton tracker). Nothing from 2026 makes the top ten. Several Football Faithful pages dated July 2026 are 2017 and 2018 stories reposted with new dates, so ignore them.

---

## Flags for Craig

1. Everton's board depends on Kean's £36.6m (Sky only, and Juventus' own figure conflicts with it) and on Barry's add-ons. Agree a ruling before building, or drop Kean's headline to about £29m and make 10th place a Kean and Dewsbury-Hall pool.
2. Two loans with obligations have not been met yet and are left out: Marmoush to Spurs (£50m) and Garnacho to Villa (about £43m). Both would make the top ten once completed.
3. Figures from one source only: Diaby 51.9 (TNT), Dibling 42 (Sky), Savinho 85 (PA), Kean 36.6 (Sky), Summerville 34 (PA), Todibo 34.2 (Sports Mole), Torres 31.5, Bruno 42.
4. The brief's figure for Tonali at Newcastle (up to £63m) and for Gordon (up to £55m) could not be found. Sky has them at £55m and £45m.
