import type { Metadata } from "next";

/**
 * Intento のプライバシーポリシー。IntentTodo リポジトリの PRIVACY.md（日本語の節）と同じ内容にする。
 * どちらかを直したら、もう一方も直す。
 */
const LAST_UPDATED = "2026-09-10";

export const metadata: Metadata = {
  title: "プライバシーポリシー — Intento",
  description: "Intento が保存するものと、その場所。",
};

export default function IntentoPrivacyPage() {
  return (
    <>
      <h1>Intento プライバシーポリシー</h1>
      <p>最終更新：{LAST_UPDATED}</p>

      <p>
        Intento は、あなたが入力したやることを、お使いの Apple デバイスと、あなた自身の iCloud プライベートデータベースにのみ保存します。開発者はその内容を取得も閲覧もしません。
      </p>
      <ul>
        <li>アカウント登録はありません</li>
        <li>解析ツール、広告、トラッキングは一切組み込んでいません</li>
        <li>第三者へ提供するデータはありません</li>
      </ul>

      <h2>アプリの設定値</h2>
      <p>アプリの設定値（集中モードの絞り込み条件など）は、アプリと Extension だけがアクセスできる App Group の内部に保存されます。</p>

      <h2>データの削除</h2>
      <p>
        データを削除したい場合は、アプリからやることを削除するか、デバイスからアプリを削除してください。iCloud 上のデータは「設定 → Apple Account → iCloud」から削除できます。
      </p>

      <h2>お問い合わせ</h2>
      <p>
        <a href="/intento/support">サポート</a>のページをご覧ください。
      </p>
    </>
  );
}
