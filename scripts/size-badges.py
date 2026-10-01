"""Re-make the crests embedded in index.html (BADGE_IMG) so they all look the same size.

Each crest is taken from assets/badges/masters_128_plain, trimmed to the crest itself, then scaled so the
square root of its width times its height is the same for every crest (TARGET, in 128px terms), capped so
its long side fits (CAP), centred on a 72px canvas and saved as a 256-colour PNG.

Run from the repo root: pip install pillow && python3 scripts/size-badges.py
"""
import base64, io, json, math, re
from PIL import Image

TARGET, CAP, OUT = 100, 127, 72
# wide, solid crests still read heavier than the rest after sizing (Opus audit), so they are drawn a little smaller
TRIM = {"az-alkmaar": 0.9, "molde": 0.94}

src = open("index.html", encoding="utf-8").read()
m = re.search(r"const BADGE_IMG = (\{.*?\});", src)
keys = json.loads(m.group(1)).keys()
new = {}
for k in keys:
    im = Image.open(f"assets/badges/masters_128_plain/{k}.png").convert("RGBA")
    alpha = im.getchannel("A")
    x0, y0, x1, y1 = alpha.point(lambda v: 255 if v > 40 else 0).getbbox()  # the solid crest, for measuring
    w, h = x1 - x0, y1 - y0
    crop = im.crop(alpha.point(lambda v: 255 if v > 8 else 0).getbbox())  # keep soft edges
    s = min(TARGET / math.sqrt(w * h), CAP / max(w, h)) * OUT / 128 * TRIM.get(k, 1)
    nw, nh = max(1, round(crop.width * s)), max(1, round(crop.height * s))
    canvas = Image.new("RGBA", (OUT, OUT), (0, 0, 0, 0))
    canvas.alpha_composite(crop.resize((nw, nh), Image.LANCZOS), ((OUT - nw) // 2, (OUT - nh) // 2))
    buf = io.BytesIO()
    canvas.quantize(256, method=Image.Quantize.FASTOCTREE).save(buf, "PNG", optimize=True)
    new[k] = base64.b64encode(buf.getvalue()).decode()

out = src[: m.start(1)] + json.dumps(new, separators=(",", ":")) + src[m.end(1):]
open("index.html", "w", encoding="utf-8").write(out)
print(f"{len(new)} crests re-made")
