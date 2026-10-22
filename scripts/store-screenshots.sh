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
# 出力は StoreImages/<app>/{iphone,ipad}/<lang>/01.png〜（gitignore）。

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

# Duo の公式の端末枠（Apple Design Resources）があれば画面の位置を測る。無ければ CSS の枠で撮れるが、ストアには出さない
if ls public/store-bezels/duo/*.png >/dev/null 2>&1; then
  python3 scripts/measure-bezels.py public/store-bezels/duo
else
  echo "Duo の端末枠が public/store-bezels/duo/ に無い（CSS で描いた枠になる）" >&2
fi

# スクショが欠けているとページは理由を出すだけの画面になるので、撮る前に止める
check_page() {
  local lang=$1 device=$2 page
  if ! page=$(curl -fsS "$BASE_URL/store/$APP?lang=$lang&device=$device"); then
    echo "$BASE_URL に繋がらない（先に pnpm dev を動かす）" >&2
    exit 1
  fi
  if grep -q data-store-missing <<<"$page"; then
    echo "$lang/$device: 実機のスクショが足りない（$BASE_URL/store/$APP?lang=$lang&device=$device を開くと一覧が出る）" >&2
    exit 1
  fi
}

for lang in $LANGS; do
  check_page "$lang" ipad
  # iPhone は 440x956 を 3 倍で 1320x2868（6.9"）、iPad は 1032x1376 を 2 倍で 2064x2752（13"）。
  # 枚数はページの FRAMES と合わせる
  python3 "$CAPTURE" "$BASE_URL/store/$APP?lang=$lang&device=iphone" \
    --frame 440x956 --count 6 --scale 3 --out "StoreImages/$APP/iphone/$lang"
  python3 "$CAPTURE" "$BASE_URL/store/$APP?lang=$lang&device=ipad" \
    --frame 1032x1376 --count 6 --scale 2 --out "StoreImages/$APP/ipad/$lang"
  # iPhone Duo は開いた横向き 1467x1032 を 1.94477 倍で 2853x2007 の 1 組だけ。
  # 帯の中に閉じた形も出るので、開いた形と閉じた形のスクショ（duo-open / duo-closed）が揃ったときだけ撮る
  if [ -d "$SHOTS/duo-open/$lang" ] && [ -d "$SHOTS/duo-closed/$lang" ]; then
    check_page "$lang" duoInner
    python3 "$CAPTURE" "$BASE_URL/store/$APP?lang=$lang&device=duoInner" \
      --frame 1467x1032 --count 6 --scale 1.94477 --out "StoreImages/$APP/duo-open/$lang"
  fi
  # Mac は 1440x900 を 2 倍で 2880x1800、Apple Vision Pro は 1920x1080 を 2 倍で 3840x2160。どちらも 3 枚
  if [ -d "$SHOTS/mac/$lang" ]; then
    check_page "$lang" mac
    python3 "$CAPTURE" "$BASE_URL/store/$APP?lang=$lang&device=mac" \
      --frame 1440x900 --count 3 --scale 2 --out "StoreImages/$APP/mac/$lang"
  fi
  if [ -d "$SHOTS/vision/$lang" ]; then
    check_page "$lang" vision
    python3 "$CAPTURE" "$BASE_URL/store/$APP?lang=$lang&device=vision" \
      --frame 1920x1080 --count 3 --scale 2 --out "StoreImages/$APP/vision/$lang"
  fi
  # iOS 27 のプロダクトページのヘッダー（21:9、3840x1646）と検索結果（3:2、3840x2560）
  python3 "$CAPTURE" "$BASE_URL/store/$APP?lang=$lang&device=header" \
    --frame 1920x823 --count 1 --scale 2 --names header.png --out "StoreImages/$APP/art/$lang"
  python3 "$CAPTURE" "$BASE_URL/store/$APP?lang=$lang&device=search" \
    --frame 1920x1280 --count 1 --scale 2 --names search.png --out "StoreImages/$APP/art/$lang"
done
