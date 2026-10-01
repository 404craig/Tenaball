"""Draw the Top 5 Leagues watermark: the five league countries' flags in a ring around a football.

Run from the repo root: python3 scripts/top5-watermark.py  (writes assets/watermarks/top5.png, 512 by 512)
Then re-embed it as WATERMARK.top5 in index.html (256px, 256 colours).
"""
from PIL import Image, ImageDraw
import math

S = 4  # drawn 4x larger, then scaled down for smooth edges

def disc(D):
    m = Image.new("L", (D, D)); ImageDraw.Draw(m).ellipse([0, 0, D - 1, D - 1], fill=255); return m

def flag(code, d):
    D = d * S; im = Image.new("RGBA", (D, D)); g = ImageDraw.Draw(im)
    if code == "eng":
        g.rectangle([0, 0, D, D], fill="#ffffff"); w = D * 0.2
        g.rectangle([0, D / 2 - w / 2, D, D / 2 + w / 2], fill="#ce1124"); g.rectangle([D / 2 - w / 2, 0, D / 2 + w / 2, D], fill="#ce1124")
    elif code == "es":
        g.rectangle([0, 0, D, D], fill="#c60b1e"); g.rectangle([0, D / 4, D, 3 * D / 4], fill="#ffc400")
    elif code == "de":
        for i, c in enumerate(["#000000", "#dd0000", "#ffce00"]): g.rectangle([0, i * D / 3, D, (i + 1) * D / 3], fill=c)
    elif code == "it":
        for i, c in enumerate(["#009246", "#ffffff", "#ce2b37"]): g.rectangle([i * D / 3, 0, (i + 1) * D / 3, D], fill=c)
    elif code == "fr":
        for i, c in enumerate(["#0055a4", "#ffffff", "#ef4135"]): g.rectangle([i * D / 3, 0, (i + 1) * D / 3, D], fill=c)
    out = Image.new("RGBA", (D, D)); out.paste(im, (0, 0), disc(D))
    ImageDraw.Draw(out).ellipse([0, 0, D - 1, D - 1], outline="#ffffff", width=int(D * 0.045))
    return out

def ball(d):
    D = d * S; b = Image.new("RGBA", (D, D)); g = ImageDraw.Draw(b)
    g.ellipse([0, 0, D - 1, D - 1], fill="#ffffff"); c = D / 2; r = D * 0.2
    pent = [(c + r * math.cos(-math.pi / 2 + k * 2 * math.pi / 5), c + r * math.sin(-math.pi / 2 + k * 2 * math.pi / 5)) for k in range(5)]
    g.polygon(pent, fill="#1b1b1b")
    for px, py in pent:
        g.line([(px, py), (c + (px - c) * 2.25, c + (py - c) * 2.25)], fill="#1b1b1b", width=int(D * 0.035))
        a = math.atan2(py - c, px - c); ox, oy = c + math.cos(a) * D * 0.5, c + math.sin(a) * D * 0.5
        g.polygon([(ox + D * 0.13 * math.cos(a + math.pi + k * 2 * math.pi / 5), oy + D * 0.13 * math.sin(a + math.pi + k * 2 * math.pi / 5)) for k in range(5)], fill="#1b1b1b")
    out = Image.new("RGBA", (D, D)); out.paste(b, (0, 0), disc(D)); return out

c = Image.new("RGBA", (512 * S, 512 * S))
def put(im, cx, cy): c.alpha_composite(im, (int(cx * S - im.width / 2), int(cy * S - im.height / 2)))
R, d = 118, 104  # the ring sits inside the watermark's clear middle, so the fade doesn't swallow the outer flags
for i, f in enumerate(["eng", "es", "de", "it", "fr"]):
    a = -math.pi / 2 + i * 2 * math.pi / 5; put(flag(f, d), 256 + R * math.cos(a), 256 + R * math.sin(a))
put(ball(112), 256, 256)
c.resize((512, 512), Image.LANCZOS).save("assets/watermarks/top5.png")
print("assets/watermarks/top5.png")
