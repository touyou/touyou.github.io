#!/bin/bash
#
# App Store のスクリーンショットを、ストア画像用のページ（/store/<app>）から撮って 1 枚ずつに切る。
# 先に別のターミナルで `pnpm dev` を動かしておく。切り分けは touyou/skills の store-screenshot-composer。
#
#   ./scripts/store-screenshots.sh intento            # ja と en
#   LANGS=ja ./scripts/store-screenshots.sh intento
#
# 出力は StoreImages/<app>/iphone/<lang>/01.png〜（gitignore）。

set -euo pipefail

cd "$(dirname "$0")/.."
APP="${1:?usage: $0 <app>}"
LANGS="${LANGS:-ja en}"
BASE_URL="${BASE_URL:-http://localhost:3000}"
CAPTURE="${CAPTURE:-$HOME/.agents/skills/store-screenshot-composer/scripts/capture_web.py}"

if [ ! -f "$CAPTURE" ]; then
  echo "capture_web.py が見つからない: $CAPTURE（CAPTURE で場所を指定する）" >&2
  exit 1
fi

for lang in $LANGS; do
  # 440x956 を 3 倍で撮ると 1320x2868（iPhone 6.9"）。枚数はページの FRAMES と合わせる
  python3 "$CAPTURE" "$BASE_URL/store/$APP?lang=$lang" \
    --frame 440x956 --count 6 --scale 3 --out "StoreImages/$APP/iphone/$lang"
done
