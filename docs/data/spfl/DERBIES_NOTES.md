# Old Firm and Edinburgh derby scorers, league matches 2000/01 to 2025/26

File: `derbies.csv`, one row per league match.

Columns: `derby` (oldfirm or edinburgh), `season`, `date` (ISO), `home`, `away`, `score` (home first), `scorers`, `sources`.

`scorers` is a semicolon list. Each entry is `Player (Club)`, with `xN` when the player scored more than once. The club is the club the goal counted for. Own goals are marked `og`, and the club shown is the club that benefited, so `Glenn Loovens (Rangers, og)` is a Celtic player's own goal that counted for Rangers. `sources` lists the pages used, space separated.

Only top-flight league matches are included (SPL to 2012/13, Premiership from 2013/14). Cup matches are left out, and so are the four Hearts v Hibs Championship matches of 2014/15. The 2026/27 derbies already played are left out (figures stop at the end of 2025/26).

## Match counts

Old Firm: 86 matches. None from 2012/13 to 2015/16 (Rangers outside the top flight). 2019/20 has two, because the season was stopped in March 2020.

| Season | Matches | Season | Matches |
|---|---|---|---|
| 2000/01 | 4 | 2016/17 | 4 |
| 2001/02 | 4 | 2017/18 | 4 |
| 2002/03 | 4 | 2018/19 | 4 |
| 2003/04 | 4 | 2019/20 | 2 |
| 2004/05 | 4 | 2020/21 | 4 |
| 2005/06 | 4 | 2021/22 | 4 |
| 2006/07 | 4 | 2022/23 | 4 |
| 2007/08 | 4 | 2023/24 | 4 |
| 2008/09 | 4 | 2024/25 | 4 |
| 2009/10 | 4 | 2025/26 | 4 |
| 2010/11 | 4 | | |
| 2011/12 | 4 | | |

Edinburgh derby: 78 matches. None in 2014/15 to 2016/17 (one or both clubs in the Championship) or 2020/21 (Hearts in the Championship). Seasons with three meetings are ones where the clubs were split apart after 33 games.

| Season | Matches | Season | Matches |
|---|---|---|---|
| 2000/01 | 4 | 2012/13 | 4 |
| 2001/02 | 3 | 2013/14 | 4 |
| 2002/03 | 3 | 2017/18 | 4 |
| 2003/04 | 3 | 2018/19 | 4 |
| 2004/05 | 4 | 2019/20 | 3 |
| 2005/06 | 4 | 2021/22 | 3 |
| 2006/07 | 4 | 2022/23 | 4 |
| 2007/08 | 3 | 2023/24 | 3 |
| 2008/09 | 4 | 2024/25 | 3 |
| 2009/10 | 4 | 2025/26 | 4 |
| 2010/11 | 3 | | |
| 2011/12 | 3 | | |

Goals: Old Firm 240 (3 own goals), Edinburgh 181 (9 own goals).

## Method

Raw pages are cached in the session scratchpad (`spfl_raw/derby/`); requests were spaced at least 1.6 seconds apart per site.

Old Firm

1. Fixture list and scores: FitbaStats results lists, Scottish League only, 2000/01 to 2025/26, from both the Celtic site (`fitbastats.com/celtic/team_results_list.php?opposition=7`) and the Rangers site (`fitbastats.com/rangers/...opposition=4`). Both give the same 86 matches with the same scores.
2. Scorers: each FitbaStats match page lists only its own club's line-up, goals and own goals in its favour, so Celtic scorers come from the Celtic page and Rangers scorers from the Rangers page. For every match the scorers plus own goals add up to the score on both pages.
3. Cross-check: Wikipedia season articles for both clubs (`2000–01 Celtic F.C. season` and so on, football boxes, `fb cm1 match` templates or results tables). Every club side of every match was checked against at least one Wikipedia article (142 of 172 against both clubs' articles). The BBC report links in the `sources` column come from those articles.

Edinburgh derby

1. Fixture list and scores: FitbaStats results lists from the Hearts and Hibs sites (Scottish League, Championship rows dropped), checked against londonhearts.com match pages and the Edinburgh derby article's league results table. All dates and scores agree between FitbaStats, londonhearts and the club season articles.
2. Scorers: FitbaStats Hearts match pages carry no player data, so Hearts scorers come from londonhearts.com (a Hearts statistics site whose match pages list both teams' scorers, own goals included). Hibs scorers come from londonhearts and from the FitbaStats Hibs match pages, which agree with each other on every match apart from one spelling (below).
3. Cross-check: Wikipedia season articles for Hearts and Hibs. Every club side of every match has londonhearts plus at least one more source (Hibs sides also have FitbaStats); 139 of 156 club sides were checked against both clubs' Wikipedia articles.

Names: the game-friendly spelling is the Wikipedia article name of the matched player where there is one, otherwise the source's own spelling, with a few fixes (Jota, Danilo, Pedro Mendes, Bobo Baldé, Stan Varga, Cammy Devlin, Kye Rowles, Warren O'Hora, Christian Doidge, Kevin Nisbet, Tam McManus).

## Discrepancies and how they were settled

- 7 November 2010, Hibernian 0-2 Hearts, 67th minute goal: the Hearts 2010–11 Wikipedia article credits Calum Elliot. londonhearts credits Stephen Elliott and its line-up shows Calum Elliot coming on for Stephen Elliott on 86 minutes, after the goal; the Hibs 2010–11 article also has Stephen Elliott. Settled as Stephen Elliott.
- 24 October 2010, Celtic 1-3 Rangers: the Rangers 2010–11 article lists Glenn Loovens among the Rangers scorers without marking it as an own goal. FitbaStats (Rangers page: one own goal) and the Celtic 2010–11 article (Loovens, o.g.) agree it was an own goal. Settled as a Loovens own goal for Rangers.
- 29 October 2005 and 15 October 2006: londonhearts spells Guillaume Beuzelin and Merouane Zemmama as "Buezelin" and "Zemamma". FitbaStats and Wikipedia have the usual spellings, which are used.
- FitbaStats shows Nikola Katić as "Katiæ" (a character-set fault); written as Nikola Katić.
- The Edinburgh derby Wikipedia article's league table has four wrong dates: 2 January 2004 (should be 2 January 2005), 19 October 2007 (should be 6 August 2007), 20 March 2009 (should be 14 March 2009) and 29 March 2014 (should be 30 March 2014). Scores match. FitbaStats, londonhearts and both clubs' season articles agree on the dates used here.
- Wikipedia has no "List of Old Firm matches" article (the suggested URL does not exist), so the Old Firm check used the club season articles only.
- The Hibs 2024–25 and 2025–26 season articles use a results-list template the check could not read, and the Hearts 2004–05 and 2017–18 articles and the Rangers 2006–07 and 2011–12 articles each miss one or two derbies. Those sides rest on the other club's article plus FitbaStats and/or londonhearts, all of which agree.
- BBC Sport's old `news.bbc.co.uk` pages are blocked from this machine, so BBC reports were not read directly. No match needed them as a tie-break: every scorer is backed by at least two sources that agree.

## Limits

- Wikipedia names were matched to FitbaStats and londonhearts by surname, so the check confirms the scorer counts and surnames; first names come from the club-specific sources (FitbaStats line-ups, londonhearts line-ups).
- Some early Wikipedia boxes give a player's goals in one template (for example Mark de Vries 4 on 11 August 2002); these were read as the right number of goals and agree with the other sources.
