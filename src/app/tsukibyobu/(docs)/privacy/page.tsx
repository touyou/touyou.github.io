import type { Metadata } from "next";

/**
 * 月屏風のプライバシーポリシー。Tsukibyobu リポジトリの PRIVACY.md と同じ内容にする。
 * どちらかを直したら、もう一方も直す。
 */
const LAST_UPDATED = "2026-10-24";

export const metadata: Metadata = {
  title: "プライバシーポリシー — 月屏風",
  description: "月屏風が保存するものと、その場所。",
};

export default function TsukibyobuPrivacyPage() {
  return (
    <>
      <h1>月屏風 プライバシーポリシー</h1>
      <p>最終更新：{LAST_UPDATED}</p>

      <p>
        月屏風は、あなたについての情報を一切集めません。開発者が取得するデータはなく、送信先となるサーバもありません。
      </p>
      <ul>
        <li>アカウント登録はありません</li>
        <li>解析ツール、広告、トラッキングは一切組み込んでいません</li>
        <li>第三者へ提供するデータはありません</li>
        <li>通信を行う機能がありません</li>
      </ul>

      <h2>アプリの設定値</h2>
      <p>
        選んだ場所・季節・音の入り切りだけを、端末の中のアプリ専用の領域に保存します。端末の外に出ることはありません。
      </p>

      <h2>データの削除</h2>
      <p>端末からアプリを削除すると、上記の設定値も一緒に消えます。</p>

      <h2>お問い合わせ</h2>
      <p>
        <a href="/tsukibyobu/support">サポート</a>のページをご覧ください。
      </p>
    </>
  );
}
