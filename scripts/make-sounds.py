#!/usr/bin/env python3
"""Make the game's crowd and whistle sounds with ElevenLabs, then embed them in index.html.

How it works:
  1. Raw takes come from the ElevenLabs Sound Effects API and are kept in assets/sounds/raw/.
  2. Every raw take is measured and thrown away (and made again) if it fails a check:
     crowd takes must sound like one big wall of noise, not a few voices you can pick out
     (spectral flatness and peak checks, set from the cheers Craig approved); whistle takes
     must be exactly one blast of the right length.
  3. The finished takes in assets/sounds/ are built from the raw ones with ffmpeg: each crowd
     take layers three different raw takes with a little stadium echo, so it sounds like a
     60,000 crowd; each whistle take is one blast with the silence trimmed off, so the game
     can play them in time (two short and a long for full time).
  4. The finished takes are embedded in index.html between SOUNDS:BEGIN and SOUNDS:END.

The game plays a random take each time (never the same one twice running) and nudges its pitch
and level, so nothing sounds canned. A sound with no takes falls back to the synthesised one.

Usage, from the repo root (needs ffmpeg and numpy):
  ELEVENLABS_API_KEY=... python3 scripts/make-sounds.py           make missing raw takes, build, embed
  ELEVENLABS_API_KEY=... python3 scripts/make-sounds.py --redo groan   throw away one sound's raw takes and remake them
  python3 scripts/make-sounds.py --build-only                      rebuild and embed from the raw takes, no API calls

To drop a raw take you don't like, delete it from assets/sounds/raw/ and run the script again.
"""
import base64, itertools, json, os, re, shutil, subprocess, sys, time, urllib.error, urllib.request

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "sounds")
RAW = os.path.join(OUT, "raw")
HTML = os.path.join(ROOT, "index.html")
API = "https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_64"

# Prompts read like sound library labels. Words such as "ooh" make ElevenLabs hum a single note,
# and talk of what fans say brings out single voices, so keep to the size and feel of the crowd.
BIG = "tens of thousands of people in a packed 60,000 capacity football stadium, big reverberant stadium, wide stereo, no individual voices"
WHISTLE = "on a referee's metal pea whistle, high pitched and piercing with the pea trilling. No crowd, no voices."

# kind, finished takes, raw takes, seconds, prompt influence, prompt.
# Names must match the sample() calls in index.html.
SOUNDS = {
    "cheer":    ("crowd", 4, 6, 2.2, 0.45, "Sports stadium crowd reaction, short excited cheer and applause, " + BIG),
    "cheerBig": ("crowd", 3, 5, 3.5, 0.45, "Sports stadium crowd reaction, huge roar and applause as a goal goes in, then fading, " + BIG),
    "groan":    ("crowd", 5, 7, 2.5, 0.3, "Sports stadium crowd ambience, massive crowd groan of disappointment, " + BIG),
    "jeer":     ("crowd", 4, 6, 3.0, 0.3, "Sports stadium crowd ambience, massive crowd booing and jeering, " + BIG),
    "applause": ("crowd", 3, 5, 4.0, 0.4, "Sports stadium crowd ambience, warm applause and cheering at the final whistle, fading out, " + BIG),
    "roar":     ("crowd", 3, 5, 5.0, 0.4, "Sports stadium crowd ambience, huge celebration roar, cheering and clapping as the home team wins, then settling, " + BIG),
    # whistles: one blast per take; the game strings them together
    "whistleTweet": ("whistle", 5, 5, 1.0, 0.6, "A single short, sharp blast " + WHISTLE + " Exactly one blast, then silence."),
    "whistleLong":  ("whistle", 3, 3, 2.0, 0.6, "One long, hard, sustained blast held for about one and a half seconds " + WHISTLE + " Exactly one blast, then silence."),
}
BLAST = {"whistleTweet": (0.25, 0.7), "whistleLong": (0.9, 1.6)}   # allowed blast length in seconds
CROWD_MIN_FLAT, CROWD_MAX_PEAK = 0.15, 22.0                         # cheers Craig liked score about 0.25 and 18; the groans he rejected 0.02 to 0.13 and 22 to 38
TRIES = 4                                                           # attempts per raw take before giving up


def load(path, sr=22050):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32), sr


def frames(x, n, hop):
    if len(x) < n:
        x = np.pad(x, (0, n - len(x)))
    return np.lib.stride_tricks.sliding_window_view(x, n)[::hop] * np.hanning(n)


def crowd_score(path):
    """Spectral flatness (higher is a more even wall of noise) and median peak in dB (lower means no voice stands out)."""
    x, sr = load(path)
    sp = np.abs(np.fft.rfft(frames(x, 2048, 512), axis=1)) ** 2 + 1e-12
    fr = np.fft.rfftfreq(2048, 1 / sr)
    s = sp[:, (fr > 150) & (fr < 2500)]
    s = s[s.sum(1) > s.sum(1).max() * 0.05]
    flat = float((np.exp(np.log(s).mean(1)) / s.mean(1)).mean())
    peak = float(np.median(10 * np.log10(s.max(1) / np.median(s, 1))))
    return flat, peak


def blasts(path):
    """Start and length (seconds) of each whistle blast, found from the energy between 1.8 and 5 kHz."""
    x, sr = load(path)
    n, hop = 512, 256
    sp = np.abs(np.fft.rfft(frames(x, n, hop), axis=1))
    fr = np.fft.rfftfreq(n, 1 / sr)
    e = sp[:, (fr > 1800) & (fr < 5000)].sum(1)
    on = (e > e.max() * 0.25) & (e / (sp.sum(1) + 1e-9) > 0.35)
    t, out, i = hop / sr, [], 0
    while i < len(on):
        if on[i]:
            j = i
            while j < len(on) and on[j]:
                j += 1
            if out and i * t - (out[-1][0] + out[-1][1]) < 0.06:
                out[-1] = (out[-1][0], j * t - out[-1][0])
            elif (j - i) * t > 0.06:
                out.append((i * t, (j - i) * t))
            i = j
        else:
            i += 1
    return out


def check(name, path):
    kind = SOUNDS[name][0]
    if kind == "crowd":
        flat, peak = crowd_score(path)
        return flat >= CROWD_MIN_FLAT and peak <= CROWD_MAX_PEAK, f"flatness {flat:.2f}, peak {peak:.1f} dB"
    b = blasts(path)
    lo, hi = BLAST[name]
    return len(b) == 1 and lo <= b[0][1] <= hi, f"{len(b)} blast(s) " + ", ".join(f"{d:.2f}s" for _, d in b)


def generate(key, name, path):
    _, _, _, seconds, influence, prompt = SOUNDS[name]
    body = json.dumps({"text": prompt, "duration_seconds": seconds, "prompt_influence": influence}).encode()
    for attempt in range(5):
        req = urllib.request.Request(API, data=body, method="POST",
                                     headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                open(path, "wb").write(r.read())
            return
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:300]
            if e.code in (429, 500, 502, 503) and attempt < 4:
                time.sleep(2 ** (attempt + 1))
                continue
            sys.exit(f"ElevenLabs refused {os.path.basename(path)}: {e.code} {msg}")


def raws(name):
    return sorted(os.path.join(RAW, f) for f in os.listdir(RAW) if re.fullmatch(re.escape(name) + r"-\d+\.mp3", f))


def make_raw(key, name):
    need = SOUNDS[name][2]
    n = 1
    while len(raws(name)) < need:
        path = os.path.join(RAW, f"{name}-{n}.mp3")
        n += 1
        if os.path.exists(path):
            continue
        for attempt in range(TRIES):
            generate(key, name, path)
            ok, why = check(name, path)
            print(f"  {os.path.basename(path)}: {why}{'' if ok else ', rejected'}")
            if ok:
                break
            os.remove(path)
        else:
            print(f"  gave up on {os.path.basename(path)} after {TRIES} tries")


def ff(args):
    subprocess.run(["ffmpeg", "-v", "error", "-y"] + args, check=True)


def build(name):
    kind, count = SOUNDS[name][0], SOUNDS[name][1]
    src = raws(name)
    for f in os.listdir(OUT):
        if re.fullmatch(re.escape(name) + r"-\d+\.mp3", f):
            os.remove(os.path.join(OUT, f))
    if not src:
        return
    trim = "silenceremove=start_periods=1:start_threshold=-40dB"
    if kind == "whistle":
        for i, path in enumerate(src[:count], 1):
            start, length = blasts(path)[0]
            end = start + length + 0.25
            ff(["-i", path, "-af", f"atrim=start={max(0, start - 0.01):.3f}:end={end:.3f},asetpts=PTS-STARTPTS,"
                f"afade=t=out:st={end - start - 0.15:.3f}:d=0.15", "-b:a", "64k", os.path.join(OUT, f"{name}-{i}.mp3")])
        return
    # crowd: each finished take layers three different raw takes, lined up and a few milliseconds apart
    combos = list(itertools.combinations(range(len(src)), min(3, len(src))))
    step = max(1, len(combos) // count)
    for i in range(count):
        pick = combos[(i * step) % len(combos)]
        ins, chains = [], []
        for k, j in enumerate(pick):
            ins += ["-i", src[j]]
            delay = [0, 45, 95][k]
            chains.append(f"[{k}]{trim},adelay={delay}|{delay}[s{k}]")
        mix = "".join(f"[s{k}]" for k in range(len(pick)))
        graph = ";".join(chains) + f";{mix}amix=inputs={len(pick)}:normalize=0,aecho=0.8:0.6:60|110:0.25|0.15,alimiter=limit=0.9"
        ff(ins + ["-filter_complex", graph, "-b:a", "64k", os.path.join(OUT, f"{name}-{i + 1}.mp3")])


def embed():
    data = {}
    for name in SOUNDS:
        files = sorted(f for f in os.listdir(OUT) if re.fullmatch(re.escape(name) + r"-\d+\.mp3", f))
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
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg is needed to build the sounds")
    os.makedirs(RAW, exist_ok=True)
    args = sys.argv[1:]
    if "--build-only" not in args:
        key = os.environ.get("ELEVENLABS_API_KEY")
        if not key:
            sys.exit("Set ELEVENLABS_API_KEY first (ElevenLabs, Developers, API keys; it needs Sound Effects access).")
        redo = args[args.index("--redo") + 1:] if "--redo" in args else []
        for name in SOUNDS:
            if name in redo:
                for f in raws(name):
                    os.remove(f)
            make_raw(key, name)
    # takes for sounds no longer in the list are cleared out
    for f in os.listdir(OUT):
        m = re.fullmatch(r"(.+)-\d+\.mp3", f)
        if m and m.group(1) not in SOUNDS:
            os.remove(os.path.join(OUT, f))
    for name in SOUNDS:
        build(name)
    embed()


if __name__ == "__main__":
    main()
