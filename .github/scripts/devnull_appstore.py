"""App Store で直近に配信されたアップデートを dev-null.sh 用の投稿に組み立てる。

iTunes Lookup API の currentVersionReleaseDate が直近 HOURS 時間以内のアプリだけを拾う。
状態を持たないので、定期実行の間隔と HOURS を揃えておく(ずれると二重投稿か取りこぼしになる)。
"""

import json
import os
import urllib.request
import uuid
from datetime import datetime, timedelta, timezone

LOOKUP = "https://itunes.apple.com/lookup?id={id}&country=jp&lang=ja_jp"
MAX_NOTES = 1200


def lookup(app_id: int) -> dict | None:
    with urllib.request.urlopen(LOOKUP.format(id=app_id), timeout=20) as res:
        results = json.load(res).get("results") or []
    return results[0] if results else None


def released_at(info: dict) -> datetime | None:
    raw = info.get("currentVersionReleaseDate")
    if not raw:
        return None
    return datetime.fromisoformat(raw.replace("Z", "+00:00"))


def truncate(text: str, limit: int) -> str:
    if len(text) <= limit:
        return text
    cut = text[:limit]
    end = max(cut.rfind("\n"), cut.rfind("。"))
    return cut[: end + 1].rstrip() if end >= limit // 3 else cut.rstrip() + "…"


def build(app: dict, info: dict) -> dict:
    name = app.get("name") or info.get("trackName")
    lines = [f"{name} {info['version']} を配信しました", ""]
    notes = (info.get("releaseNotes") or "").strip().replace("\r\n", "\n")
    if notes:
        lines += [truncate(notes, MAX_NOTES), ""]
    lines.append(info["trackViewUrl"].split("?")[0])
    shots = info.get("screenshotUrls") or info.get("ipadScreenshotUrls") or []
    return {"name": name, "body": "\n".join(lines), "image": shots[0] if shots else ""}


def main() -> None:
    hours = float(os.environ.get("HOURS") or 24)
    since = datetime.now(timezone.utc) - timedelta(hours=hours)
    with open(os.environ["APPS_FILE"], encoding="utf-8") as f:
        apps = json.load(f)

    posts = []
    for app in apps:
        try:
            info = lookup(app["id"])
        except Exception as error:  # 1 アプリの失敗で他の告知を止めない
            print(f"::warning::{app['id']} の取得に失敗: {error}")
            continue
        when = info and released_at(info)
        if not when or when < since:
            continue
        post = build(app, info)
        print(f"--- {post['name']} ({when.isoformat()})\n{post['body']}\n")
        posts.append(post)

    if not posts:
        print(f"直近 {hours:g} 時間に配信されたアップデートは無い")
    if os.environ.get("HAS_KEY") != "true":
        if posts:
            print("DEVNULL_SSH_KEY が無いので投稿しない")
        posts = []
    delimiter = uuid.uuid4().hex
    with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as out:
        out.write(f"posts<<{delimiter}\n{json.dumps(posts, ensure_ascii=False)}\n{delimiter}\n")


if __name__ == "__main__":
    main()
