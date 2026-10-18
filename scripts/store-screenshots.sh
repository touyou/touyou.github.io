#!/bin/bash
#
# App Store のスクリーンショットを、ストア画像用のページ（/store/<app>）から撮って 1 枚ずつに切る。
# 先に別のターミナルで `pnpm dev` を動かしておく。切り分けは touyou/skills の store-screenshot-composer。
#
#   ./scripts/store-screenshots.sh intento            # ja と en
#   LANGS=ja ./scripts/store-screenshots.sh intento
#
# アプリの画面は実機のスクショを使う。IntentTodo なら先に Mac で ./scripts/capture_screenshots.sh を回し、
# その Screenshots/ を SHOTS で渡す（既定は隣にクローンした ../IntentTodo/Screenshots）。
# 出力は StoreImages/<app>/iphone/<lang>/01.png〜（gitignore）。

set -euo pipefail

cd "$(dirname "$0")/.."
APP="${1:?usage: $0 <app>}"
LANGS="${LANGS:-ja en}"
BASE_URL="${BASE_URL:-http://localhost:3000}"
SHOTS="${SHOTS:-../IntentTodo/Screenshots}"
CAPTURE="${CAPTURE:-$HOME/.agents/skills/store-screenshot-composer/scripts/capture_web.py}"

if [ ! -f "$CAPTURE" ]; then
  echo "capture_web.py が見つからない: $CAPTURE（CAPTURE で場所を指定する）" >&2
  exit 1
fi

if [ ! -d "$SHOTS" ]; then
  echo "実機のスクショが見つからない: $SHOTS（SHOTS で場所を指定する）" >&2
  exit 1
fi
rm -rf "public/store-shots/$APP"
mkdir -p "public/store-shots/$APP"
cp -R "$SHOTS"/. "public/store-shots/$APP/"

for lang in $LANGS; do
  # スクショが欠けているとページは理由を出すだけの画面になるので、撮る前に止める
  if curl -fsS "$BASE_URL/store/$APP?lang=$lang" | grep -q data-store-missing; then
    echo "$lang: 実機のスクショが足りない（$BASE_URL/store/$APP?lang=$lang を開くと一覧が出る）" >&2
    exit 1
  fi
  # 440x956 を 3 倍で撮ると 1320x2868（iPhone 6.9"）。枚数はページの FRAMES と合わせる
  python3 "$CAPTURE" "$BASE_URL/store/$APP?lang=$lang" \
    --frame 440x956 --count 6 --scale 3 --out "StoreImages/$APP/iphone/$lang"
done
