"""Embed the crowd clips (assets/sounds/crowd/*.mp3, Craig's 22 takes) in index.html as CROWD_MP3.

Files are named <kind><take>.mp3: cheer, bigcheer, groan, boos, applause, roar.
Run from the repo root: python3 scripts/embed-crowd.py
"""
import base64, glob, json, os, re
kinds = {}
for f in sorted(glob.glob("assets/sounds/crowd/*.mp3")):
    kind = re.match(r"([a-z]+)\d+\.mp3", os.path.basename(f)).group(1)
    kinds.setdefault(kind, []).append(base64.b64encode(open(f, "rb").read()).decode())
data = json.dumps(kinds, separators=(",", ":"))
src = open("index.html", encoding="utf-8").read()
src, n = re.subn(r"const CROWD_MP3 = \{.*?\};", lambda m: f"const CROWD_MP3 = {data};", src, count=1, flags=re.S)
assert n == 1, "CROWD_MP3 not found"
open("index.html", "w", encoding="utf-8").write(src)
print({k: len(v) for k, v in kinds.items()})
