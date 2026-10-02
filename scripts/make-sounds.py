#!/usr/bin/env python3
"""Make the game's crowd and whistle sounds with ElevenLabs, then embed them in index.html.

Each sound has several takes. The game picks a random take each time (never the same one twice
running) and nudges its pitch and level, so cheers and groans never sound canned.

Usage, from the repo root:
  ELEVENLABS_API_KEY=... python3 scripts/make-sounds.py            make any takes that are missing, then embed
  ELEVENLABS_API_KEY=... python3 scripts/make-sounds.py --redo groan   remake every take of one sound
  python3 scripts/make-sounds.py --embed-only                       embed what is in assets/sounds/

Takes are saved as assets/sounds/<name>-<n>.mp3. To drop a take you don't like, delete its file,
run the script again (it makes a fresh one) and it re-embeds. A sound with no takes falls back to
the game's synthesised sound, so nothing breaks if a sound is missing.
"""
import base64, json, os, re, sys, time, urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "sounds")
HTML = os.path.join(ROOT, "index.html")
API = "https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_64"

NO_EXTRAS = "No music, no commentary, no announcer."
# name: (takes, seconds, prompt). Names must match the sample() calls in index.html.
SOUNDS = {
    "cheer": (4, 2.2, "An English football stadium crowd gives a short, excited cheer and a burst of applause when "
                      "their team does something good. Quick rise, then dies down. " + NO_EXTRAS),
    "cheerBig": (3, 3.5, "A packed English football stadium erupts with a big roar and applause, like a goal "
                         "being scored, then fades away. " + NO_EXTRAS),
    "groan": (5, 2.0, "An English football stadium crowd lets out a disappointed groan, a falling 'ooh' after a "
                      "near miss, then grumbling. " + NO_EXTRAS),
    "jeer": (3, 2.8, "An English football crowd boos and jeers loudly, with angry whistles, as a player is sent "
                     "off. " + NO_EXTRAS),
    "applause": (2, 4.0, "An English football stadium crowd applauds at the final whistle, warm clapping with "
                         "scattered cheers, fading out. " + NO_EXTRAS),
    "roar": (2, 5.0, "A huge English football stadium celebration: the crowd roars, cheers and claps as their "
                     "team wins, then slowly settles. " + NO_EXTRAS),
    "whistleShort": (3, 0.8, "One short, sharp blast on a referee's metal pea whistle, close up, outdoors. "
                             "No crowd, no other sounds."),
    "whistleRed": (2, 1.6, "A referee blows two quick blasts then one long blast on a metal pea whistle, close up, "
                           "outdoors. No crowd, no other sounds."),
    "whistleFull": (2, 2.4, "A football referee blows the full time whistle: two short blasts then one long blast "
                            "on a metal pea whistle, close up. No crowd, no other sounds."),
}


def takes(name):
    return sorted(f for f in os.listdir(OUT) if re.fullmatch(re.escape(name) + r"-\d+\.mp3", f))


def generate(key, name, n, seconds, prompt):
    body = json.dumps({"text": prompt, "duration_seconds": seconds, "prompt_influence": 0.45}).encode()
    for attempt in range(4):
        req = urllib.request.Request(API, data=body, method="POST",
                                     headers={"xi-api-key": key, "Content-Type": "application/json",
                                              "Accept": "audio/mpeg"})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data = r.read()
            path = os.path.join(OUT, f"{name}-{n}.mp3")
            with open(path, "wb") as f:
                f.write(data)
            print(f"  made {name}-{n}.mp3 ({len(data) // 1024} KB)")
            return
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:300]
            if e.code in (429, 500, 502, 503) and attempt < 3:
                time.sleep(2 ** (attempt + 1)); continue
            sys.exit(f"ElevenLabs refused {name}-{n}: {e.code} {msg}")


def embed():
    data = {}
    for name in SOUNDS:
        files = takes(name)
        if files:
            data[name] = [base64.b64encode(open(os.path.join(OUT, f), "rb").read()).decode() for f in files]
    html = open(HTML, encoding="utf-8").read()
    block = "/* SOUNDS:BEGIN */const SOUND_MP3 = " + json.dumps(data, separators=(",", ":")) + ";/* SOUNDS:END */"
    new, count = re.subn(r"/\* SOUNDS:BEGIN \*/.*?/\* SOUNDS:END \*/", lambda m: block, html, flags=re.S)
    if count != 1:
        sys.exit("Couldn't find the SOUNDS:BEGIN / SOUNDS:END block in index.html")
    open(HTML, "w", encoding="utf-8").write(new)
    total = sum(len(t) for v in data.values() for t in v)
    print(f"Embedded {sum(len(v) for v in data.values())} takes of {len(data)} sounds ({total // 1024} KB) in index.html")


def main():
    os.makedirs(OUT, exist_ok=True)
    args = sys.argv[1:]
    if "--embed-only" not in args:
        key = os.environ.get("ELEVENLABS_API_KEY")
        if not key:
            sys.exit("Set ELEVENLABS_API_KEY first (ElevenLabs, Developers, API keys; it needs Sound Effects access).")
        redo = args[args.index("--redo") + 1:] if "--redo" in args else []
        for name, (n, seconds, prompt) in SOUNDS.items():
            if name in redo:
                for f in takes(name):
                    os.remove(os.path.join(OUT, f))
            for i in range(1, n + 1):
                if not os.path.exists(os.path.join(OUT, f"{name}-{i}.mp3")):
                    generate(key, name, i, seconds, prompt)
    embed()


if __name__ == "__main__":
    main()
