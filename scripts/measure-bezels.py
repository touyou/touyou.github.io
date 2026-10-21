#!/usr/bin/env python3
"""
Apple Design Resources の iPhone Duo の端末枠（PNG）から画面の穴の位置を測り、ストア画像のページが読む JSON に書く。

  python3 scripts/measure-bezels.py public/store-bezels/duo

開いた横向き（Inner Open Landscape）と閉じた縦向き（Outer Closed Portrait）だけを使う。色は Night Sky を優先する。
枠の PNG は Apple の利用規約で再配布できないので、置き場ごと gitignore して JSON もコミットしない。
"""

import json
import sys
from pathlib import Path

from PIL import Image

OPAQUE = 200


def edge(alpha, w, h, x, y, dx, dy):
    """画面の穴の中の (x, y) から、枠に当たるまで (dx, dy) の向きに進んだ最後の位置"""
    while 0 <= x + dx < w and 0 <= y + dy < h and alpha[x + dx, y + dy] < OPAQUE:
        x += dx
        y += dy
    return x, y


def measure(path):
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    alpha = img.getchannel("A").load()
    # 開いた端末は中央に折り目が描かれていることがあるので、縦は左寄りの列で測る
    cx, cy = w // 4, h // 2
    rx = w - 1 - cx
    if alpha[cx, cy] >= OPAQUE or alpha[rx, cy] >= OPAQUE:
        raise SystemExit(f"{path.name}: 画面の位置が透けていない（枠の PNG ではない？）")
    # 横も折り目をまたがないよう、左右それぞれ透けている列から外へ測る
    left, _ = edge(alpha, w, h, cx, cy, -1, 0)
    right, _ = edge(alpha, w, h, rx, cy, 1, 0)
    _, top = edge(alpha, w, h, cx, cy, 0, -1)
    _, bottom = edge(alpha, w, h, cx, cy, 0, 1)
    return {
        "src": f"/store-bezels/duo/{path.name}",
        "w": w,
        "h": h,
        "screen": {"x": left / w, "y": top / h, "w": (right - left + 1) / w, "h": (bottom - top + 1) / h},
    }


def pick(files, *words):
    hits = [f for f in files if all(word in f.name.lower() for word in words)]
    hits.sort(key=lambda f: "night" not in f.name.lower())
    return hits[0] if hits else None


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "public/store-bezels/duo")
    files = sorted(root.glob("*.png"))
    roles = {"open": ("inner", "landscape"), "closed": ("outer", "closed", "portrait")}
    out = {}
    for role, words in roles.items():
        found = pick(files, *words)
        if found is None:
            raise SystemExit(f"{root}: {' '.join(words)} の PNG が無い")
        out[role] = measure(found)
        print(f"{role}: {found.name} {out[role]['screen']}")
    (root / "bezels.json").write_text(json.dumps(out, indent=2) + "\n")


if __name__ == "__main__":
    main()
