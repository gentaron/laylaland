#!/usr/bin/env python3
"""Original 'Pink Voltage' Layla illustration generator (vector / SVG).

Layla Virel Nova design cues (matched to existing gallery art):
  pink twin-tails, blue eyes, glossy blue leotard with a big yellow star,
  red flowing cape, blue gloves, red boots, electric pink 'voltage' theme.

Usage:
  pip install cairosvg
  python3 scripts/generate_layla_art.py gallery   # writes .svg + .png into gallery/
"""
import math, random

W, H = 1024, 1536
CX = W / 2


def bolt(x, y, scale=1.0, rot=0.0, color="#fff1a8"):
    """A lightning bolt polygon centred near (x,y)."""
    pts = [(0, -60), (18, -10), (4, -10), (26, 60),
           (-6, 6), (10, 6), (-20, -60)]
    a = math.radians(rot)
    out = []
    for px, py in pts:
        px *= scale; py *= scale
        rx = px * math.cos(a) - py * math.sin(a)
        ry = px * math.sin(a) + py * math.cos(a)
        out.append(f"{x+rx:.1f},{y+ry:.1f}")
    return f'<polygon points="{" ".join(out)}" fill="{color}"/>'


def sparkle(x, y, r, color="#ffffff"):
    return (f'<path d="M{x},{y-r} L{x+r*0.18:.1f},{y-r*0.18:.1f} '
            f'L{x+r},{y} L{x+r*0.18:.1f},{y+r*0.18:.1f} '
            f'L{x},{y+r} L{x-r*0.18:.1f},{y+r*0.18:.1f} '
            f'L{x-r},{y} L{x-r*0.18:.1f},{y-r*0.18:.1f} Z" '
            f'fill="{color}" opacity="0.9"/>')


def star(cx, cy, r, fill, rot=-90, inner=0.45):
    pts = []
    for i in range(10):
        ang = math.radians(rot + i * 36)
        rad = r if i % 2 == 0 else r * inner
        pts.append(f"{cx+rad*math.cos(ang):.1f},{cy+rad*math.sin(ang):.1f}")
    return f'<polygon points="{" ".join(pts)}" fill="{fill}"/>'


def figure(skin="#ffd9c2", suit="#1f6 feb".replace(" ", ""), suit_dark="#1746b8",
           cape="#e0263a", cape_dark="#b01228", glove="#1f6feb",
           boot="#e0263a", hair="#ff8ad1", hair_dark="#ef5fb6",
           star_fill="#ffd23f"):
    """Build a stylised full-body Layla in a confident hands-on-hips stance."""
    s = []
    # ---- Cape (behind everything) ----
    s.append(f'<path d="M512,560 C360,600 300,820 250,1140 '
             f'C360,1100 440,1110 512,1150 C584,1110 664,1100 774,1140 '
             f'C724,820 664,600 512,560 Z" fill="{cape_dark}"/>')
    s.append(f'<path d="M512,575 C392,615 345,820 312,1090 '
             f'C400,1058 452,1066 512,1100 C572,1066 624,1058 712,1090 '
             f'C679,820 632,615 512,575 Z" fill="{cape}"/>')
    # cape inner fold highlight
    s.append(f'<path d="M512,585 C452,610 430,800 420,1040 '
             f'C470,1020 500,1030 512,1060 C524,1030 554,1020 604,1040 '
             f'C594,800 572,610 512,585 Z" fill="{cape_dark}" opacity="0.55"/>')

    # ---- Legs + boots ----
    for sx in (-1, 1):
        hipx = CX + sx * 60
        s.append(f'<path d="M{hipx-46},940 C{hipx-58},1060 {hipx-54},1180 {hipx-44},1250 '
                 f'L{hipx+30},1250 C{hipx+40},1170 {hipx+44},1050 {hipx+34},940 Z" '
                 f'fill="{skin}"/>')
        # boot
        s.append(f'<path d="M{hipx-46},1250 L{hipx+34},1250 '
                 f'L{hipx+40},1380 L{hipx+70},1400 L{hipx+70},1430 '
                 f'L{hipx-60},1430 L{hipx-58},1360 Z" fill="{boot}"/>')
        s.append(f'<path d="M{hipx-46},1250 L{hipx-10},1250 L{hipx-18},1360 '
                 f'L{hipx-58},1360 Z" fill="#ffffff" opacity="0.18"/>')

    # ---- Hips / briefs ----
    s.append(f'<path d="M422,900 C440,1000 584,1000 602,900 '
             f'C602,948 588,985 512,990 C436,985 422,948 422,900 Z" '
             f'fill="{boot}"/>')

    # ---- Torso leotard (hourglass) ----
    s.append(f'<path d="M430,560 C414,560 402,572 404,592 '
             f'C414,690 470,770 430,860 C470,915 554,915 594,860 '
             f'C554,770 610,690 620,592 C622,572 610,560 594,560 '
             f'C560,600 464,600 430,560 Z" fill="{suit}"/>')
    # torso shading
    s.append(f'<path d="M512,600 C500,700 500,800 512,880 '
             f'C470,900 444,880 440,855 C474,772 420,690 414,596 '
             f'C448,612 484,614 512,600 Z" fill="{suit_dark}" opacity="0.4"/>')
    s.append(f'<path d="M560,600 C572,690 540,772 574,855 '
             f'C570,880 552,900 512,880 C524,800 524,700 512,600 '
             f'C536,612 548,612 560,600 Z" fill="#ffffff" opacity="0.12"/>')

    # ---- Chest star emblem ----
    s.append(f'<circle cx="512" cy="688" r="60" fill="#ffffff" opacity="0.10"/>')
    s.append(star(512, 688, 58, "#ffffff", inner=0.46))
    s.append(star(512, 688, 50, star_fill, inner=0.46))

    # ---- Arms (hands on hips) ----
    for sx in (-1, 1):
        shx = CX + sx * 96
        s.append(f'<path d="M{shx},580 C{shx+sx*46},640 {shx+sx*70},760 {shx+sx*40},835 '
                 f'C{shx+sx*8},860 {shx-sx*18},850 {shx-sx*4},815 '
                 f'C{shx+sx*30},760 {shx+sx*14},650 {shx-sx*6},600 Z" '
                 f'fill="{skin}"/>')
        # glove
        s.append(f'<path d="M{shx+sx*40},835 C{shx+sx*8},862 {shx-sx*18},852 {shx-sx*6},812 '
                 f'C{shx+sx*2},800 {shx+sx*30},792 {shx+sx*46},800 '
                 f'C{shx+sx*52},820 {shx+sx*52},830 {shx+sx*40},835 Z" '
                 f'fill="{glove}"/>')

    # ---- Neck + head ----
    s.append(f'<rect x="486" y="498" width="52" height="60" rx="20" fill="{skin}"/>')
    # hair back
    s.append(f'<path d="M512,360 C404,360 360,452 372,540 '
             f'C300,560 300,700 332,760 C360,700 372,690 392,690 '
             f'C384,560 430,470 512,470 C594,470 640,560 632,690 '
             f'C652,690 664,700 692,760 C724,700 724,560 652,540 '
             f'C664,452 620,360 512,360 Z" fill="{hair_dark}"/>')
    # twin-tails
    for sx in (-1, 1):
        tx = CX + sx * 150
        s.append(f'<path d="M{CX+sx*120},470 C{tx+sx*40},520 {tx+sx*30},680 {tx-sx*4},800 '
                 f'C{tx-sx*60},700 {tx-sx*70},560 {CX+sx*70},478 Z" fill="{hair}"/>')
        s.append(f'<path d="M{CX+sx*120},470 C{tx+sx*30},520 {tx+sx*20},660 {tx-sx*10},770 '
                 f'C{tx-sx*40},690 {tx-sx*44},580 {CX+sx*82},488 Z" '
                 f'fill="{hair_dark}" opacity="0.5"/>')
    # face
    s.append(f'<ellipse cx="512" cy="452" rx="76" ry="84" fill="{skin}"/>')
    # bangs
    s.append(f'<path d="M436,452 C432,392 470,360 512,360 '
             f'C554,360 592,392 588,452 C566,418 540,452 512,448 '
             f'C484,452 458,418 436,452 Z" fill="{hair}"/>')
    s.append(f'<path d="M512,360 C470,360 432,392 436,452 '
             f'C452,424 470,414 486,420 C498,392 502,372 512,360 Z" '
             f'fill="{hair_dark}" opacity="0.45"/>')
    # eyes
    for sx in (-1, 1):
        ex = CX + sx * 30
        s.append(f'<ellipse cx="{ex}" cy="462" rx="16" ry="22" fill="#ffffff"/>')
        s.append(f'<ellipse cx="{ex}" cy="464" rx="12" ry="18" fill="#1f6feb"/>')
        s.append(f'<circle cx="{ex}" cy="466" r="6" fill="#0a2a6e"/>')
        s.append(f'<circle cx="{ex-4}" cy="458" r="4" fill="#ffffff"/>')
        s.append(f'<path d="M{ex-17},446 Q{ex},436 {ex+17},446" stroke="#5a2a3a" '
                 f'stroke-width="3" fill="none" stroke-linecap="round"/>')
    # blush + smile
    s.append(f'<ellipse cx="468" cy="492" rx="13" ry="7" fill="#ff9bb5" opacity="0.6"/>')
    s.append(f'<ellipse cx="556" cy="492" rx="13" ry="7" fill="#ff9bb5" opacity="0.6"/>')
    s.append(f'<path d="M496,500 Q512,514 528,500" stroke="#9c3b54" '
             f'stroke-width="3" fill="none" stroke-linecap="round"/>')
    return "\n".join(s)


def build(theme):
    bg1, bg2, glow = theme["bg1"], theme["bg2"], theme["glow"]
    title = theme["title"]
    rnd = random.Random(theme["seed"])
    defs = f'''
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="80%">
      <stop offset="0%" stop-color="{bg1}"/>
      <stop offset="100%" stop-color="{bg2}"/>
    </radialGradient>
    <radialGradient id="halo" cx="50%" cy="42%" r="50%">
      <stop offset="0%" stop-color="{glow}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="{glow}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
    <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{glow}" stop-opacity="0.0"/>
      <stop offset="50%" stop-color="{glow}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="{glow}" stop-opacity="0.0"/>
    </linearGradient>
  </defs>'''

    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
             f'viewBox="0 0 {W} {H}">', defs]
    parts.append(f'<rect width="{W}" height="{H}" fill="url(#bg)"/>')

    # radiating light rays from centre
    parts.append('<g opacity="0.7">')
    for i in range(16):
        ang = i * (360 / 16) + rnd.uniform(-4, 4)
        parts.append(f'<g transform="translate({CX},620) rotate({ang})">'
                     f'<rect x="-26" y="0" width="52" height="900" fill="url(#ray)"/></g>')
    parts.append('</g>')

    # halftone dots
    parts.append('<g opacity="0.18">')
    for _ in range(120):
        x = rnd.uniform(0, W); y = rnd.uniform(0, H)
        r = rnd.uniform(1.5, 5)
        parts.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.1f}" fill="#ffffff"/>')
    parts.append('</g>')

    # central halo
    parts.append(f'<rect width="{W}" height="{H}" fill="url(#halo)"/>')

    # background lightning
    parts.append('<g opacity="0.85">')
    for _ in range(7):
        x = rnd.uniform(120, W - 120); y = rnd.uniform(200, 1200)
        parts.append(bolt(x, y, scale=rnd.uniform(0.8, 1.7),
                           rot=rnd.uniform(-25, 25), color=theme["boltbg"]))
    parts.append('</g>')

    # ground glow
    parts.append(f'<ellipse cx="{CX}" cy="1430" rx="300" ry="60" '
                 f'fill="{glow}" opacity="0.5" filter="url(#soft)"/>')

    # the hero
    parts.append('<g filter="url(#soft)" opacity="0.45">'
                 + figure(**theme.get("fig", {})) + '</g>')  # glow shadow
    parts.append(figure(**theme.get("fig", {})))

    # foreground sparkles + bolts
    parts.append('<g>')
    for _ in range(10):
        x = rnd.uniform(80, W - 80); y = rnd.uniform(140, 1300)
        parts.append(sparkle(x, y, rnd.uniform(6, 16),
                             color=rnd.choice(["#ffffff", theme["glow"]])))
    for _ in range(3):
        x = rnd.uniform(120, W - 120); y = rnd.uniform(300, 1100)
        parts.append(bolt(x, y, scale=rnd.uniform(0.6, 1.0),
                           rot=rnd.uniform(-30, 30), color="#fff7c2"))
    parts.append('</g>')

    # title plate
    parts.append(f'''
    <g>
      <text x="{CX}" y="1486" text-anchor="middle"
            font-family="Arial Black, Arial, sans-serif" font-weight="900"
            font-size="84" fill="#ffffff" letter-spacing="2"
            stroke="{bg2}" stroke-width="6" paint-order="stroke">{title}</text>
      <text x="{CX}" y="1520" text-anchor="middle"
            font-family="Arial, sans-serif" font-weight="700"
            font-size="26" fill="{glow}" letter-spacing="10">{theme["sub"]}</text>
    </g>''')

    parts.append('</svg>')
    return "\n".join(parts)


def build_crest():
    """Square 'Pink Voltage' emblem / badge."""
    S = 1024
    c = S / 2
    rnd = random.Random(99)
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" viewBox="0 0 {S} {S}">']
    p.append('''<defs>
      <radialGradient id="cb" cx="50%" cy="42%" r="62%">
        <stop offset="0%" stop-color="#46104f"/>
        <stop offset="100%" stop-color="#0c0414"/>
      </radialGradient>
      <linearGradient id="ring" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ff8ad1"/>
        <stop offset="100%" stop-color="#b81a86"/>
      </linearGradient>
    </defs>''')
    p.append(f'<rect width="{S}" height="{S}" fill="url(#cb)"/>')
    # rays
    p.append('<g opacity="0.5">')
    for i in range(24):
        p.append(f'<g transform="translate({c},{c}) rotate({i*15})">'
                 f'<polygon points="-14,0 14,0 0,520" fill="#ff5fc8" opacity="0.10"/></g>')
    p.append('</g>')
    # outer ring
    p.append(f'<circle cx="{c}" cy="{c}" r="360" fill="none" stroke="url(#ring)" stroke-width="26"/>')
    p.append(f'<circle cx="{c}" cy="{c}" r="332" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.4"/>')
    p.append(f'<circle cx="{c}" cy="{c}" r="300" fill="#1f6feb"/>')
    p.append(f'<circle cx="{c}" cy="{c}" r="300" fill="none" stroke="#9be7ff" stroke-width="4" opacity="0.5"/>')
    # crossed lightning behind star
    for sx in (-1, 1):
        p.append(bolt(c + sx * 150, c - 10, scale=2.7, rot=sx * 18, color="#fff1a8"))
    # central star
    p.append(star(c, c, 175, "#ffffff", inner=0.46))
    p.append(star(c, c, 150, "#ffd23f", inner=0.46))
    # small bolt inside star
    p.append(bolt(c, c, scale=1.5, rot=0, color="#b81a86"))
    # sparkles
    for _ in range(26):
        ang = rnd.uniform(0, 2*math.pi); rad = rnd.uniform(370, 500)
        p.append(sparkle(c+rad*math.cos(ang), c+rad*math.sin(ang), rnd.uniform(5, 14), "#ff8ad1"))
    # wordmark
    p.append(f'<path d="M{c-300},{c} a300,300 0 0,0 600,0" id="arc" fill="none"/>')
    p.append(f'<text font-family="Arial Black, Arial, sans-serif" font-weight="900" '
             f'font-size="62" fill="#ffffff" letter-spacing="8">'
             f'<textPath href="#arc" startOffset="50%" text-anchor="middle">'
             f'PINK VOLTAGE</textPath></text>')
    p.append('</svg>')
    return "\n".join(p), S


THEMES = {
    "layla-pink-voltage": dict(
        seed=7, title="PINK VOLTAGE", sub="LAYLA VIREL NOVA",
        bg1="#3a0d4a", bg2="#11041c", glow="#ff5fc8", boltbg="#ff8ad1"),
    "layla-electric-blue": dict(
        seed=21, title="OVERCHARGE", sub="AURALIS COLLECTIVE",
        bg1="#0d2a5a", bg2="#040a1c", glow="#3fd0ff", boltbg="#9be7ff",
        fig=dict(cape="#ff3b6b", cape_dark="#c01048")),
    "layla-nova-storm": dict(
        seed=44, title="NOVA STORM", sub="SYMPHONY OF STARS",
        bg1="#52123a", bg2="#160416", glow="#ffb03f", boltbg="#ffd98a"),
}

if __name__ == "__main__":
    import sys
    import cairosvg
    out_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    for name, theme in THEMES.items():
        svg = build(theme)
        with open(f"{out_dir}/{name}.svg", "w") as f:
            f.write(svg)
        cairosvg.svg2png(bytestring=svg.encode(), write_to=f"{out_dir}/{name}.png",
                         output_width=W, output_height=H)
        print("wrote", name)
    csvg, cs = build_crest()
    with open(f"{out_dir}/layla-voltage-crest.svg", "w") as f:
        f.write(csvg)
    cairosvg.svg2png(bytestring=csvg.encode(), write_to=f"{out_dir}/layla-voltage-crest.png",
                     output_width=cs, output_height=cs)
    print("wrote layla-voltage-crest")
