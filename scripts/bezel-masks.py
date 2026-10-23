#!/usr/bin/env python3
"""
iPhone Duo の端末枠（PNG）から、画面のスクショを枠の外へ漏らさないためのマスクを作る。

  python3 scripts/bezel-masks.py public/store-bezels/duo

画面の四角（bezels.json の screen）は端末の角丸より大きいので、そのまま置くと角でスクショが枠の外に出る。
枠の外側の透けている所を塗りつぶしで求め、そこを透明、それ以外を不透明にした枠と同じ大きさの PNG を masks/ に書く。
/store/duo-announce はこれを CSS の mask-image に使う。枠と同じく gitignore で、コミットしない。
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

OPAQUE = 200


def mask_for(path, out_dir):
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    # 不透明な枠は 255、透けている所は 0。四隅から 0 の所を塗れば、残った 0 が画面の穴になる
    solid = img.getchannel("A").point(lambda a: 255 if a >= OPAQUE else 0)
    for corner in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        if solid.getpixel(corner) == 0:
            ImageDraw.floodfill(solid, corner, 128)
    # 外側（128）だけを隠す。枠の上は枠が覆うので、穴と枠の両方を見せてよい
    # CSS の mask-image は透明度で切るので、白に透明度として載せる
    mask = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    mask.putalpha(solid.point(lambda v: 0 if v == 128 else 255))
    out = out_dir / path.name
    mask.save(out)
    return out


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "public/store-bezels/duo")
    out_dir = root / "masks"
    out_dir.mkdir(exist_ok=True)
    for path in sorted(root.glob("*.png")):
        print(mask_for(path, out_dir))


if __name__ == "__main__":
    main()
