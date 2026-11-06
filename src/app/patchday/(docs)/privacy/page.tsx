import type { Metadata } from "next";

const EFFECTIVE_DATE = "2026-11-06";
const CONTACT_EMAIL = "contact@touyou.dev";

/**
 * Patchday（iOS / iPadOS / macOS アプリ）のプライバシーポリシー。記載はアプリのコードに合わせる。
 * 通信先や保存するものを変えたら、ここも直す（Patchday の AGENTS.md の規則 15）。
 */
export const metadata: Metadata = {
  title: "プライバシーポリシー — Patchday",
  description: "Patchday が保存するものと、通信する先。",
};

export default function PatchdayPrivacyPage() {
  return (
    <>
      <h1>Patchday プライバシーポリシー</h1>
      <p>施行日：{EFFECTIVE_DATE}</p>

      <p>
        このポリシーは、個人開発者 touyou（以下「開発者」）が提供する iPhone・iPad・Mac アプリ「Patchday」（以下「本アプリ」）に適用されます。
      </p>

      <h2>1. 概要</h2>
      <ul>
        <li>本アプリにアカウントやログインはありません。</li>
        <li>開発者は本アプリのためのサーバーを運営していません。利用者が記録した内容が開発者に送られることはありません。</li>
        <li>広告、アクセス解析、クラッシュレポートなどの第三者の SDK は含まれておらず、アプリやウェブサイトをまたいだトラッキングも行いません。</li>
      </ul>

      <h2>2. 保存するもの</h2>
      <ul>
        <li>
          <strong>脆弱性の情報</strong>：公開されている脆弱性情報（CISA Known Exploited Vulnerabilities Catalog・JVN・NVD）と、Node.js のセキュリティリリースの予告から取得した内容を、表示のために端末内に保存します。
        </li>
        <li>
          <strong>進み具合とメモ</strong>：利用者が記録した脆弱性ごとの状態（未着手・アナウンス済み・対応協議済み・完了・対象外）、日付つきのメモ、更新日時。
          利用者の iCloud のプライベートデータベース（Apple の CloudKit）に保存し、同じ Apple アカウントの端末の間で同期します。開発者はこの内容を見ることができません。
        </li>
        <li>
          <strong>表示の設定</strong>：ウォッチ・ミュートしたベンダーと製品、深刻度などの絞り込み、期限のルール。端末内にだけ保存し、同期しません。
        </li>
      </ul>
      <p>
        ウィジェットに表示するため、これらの写しを端末内でアプリとウィジェットが共有する領域（App Group）にも置きます。端末の外には出ません。
        iPhone・iPad ではアプリを削除すると端末内のデータも消えます。Mac ではアプリをゴミ箱に入れても、端末内のデータ（~/Library/Containers と ~/Library/Group Containers の中）が残ることがあります。iCloud に保存された進み具合とメモは、iOS / macOS の設定の「iCloud」› 「アカウントのストレージを管理」から削除できます。
      </p>

      <h2>3. 通信する先</h2>
      <p>本アプリが通信するのは、次の公開された情報源だけです。通信は端末から直接行い、開発者を経由しません。</p>
      <ul>
        <li>CISA（米国サイバーセキュリティ・社会基盤安全保障庁）：www.cisa.gov の Known Exploited Vulnerabilities Catalog</li>
        <li>JVN（IPA・JPCERT/CC）：jvndb.jvn.jp の JVN iPedia 新着情報、および jvn.jp の新着情報</li>
        <li>Node.js：nodejs.org のセキュリティリリースの予告</li>
        <li>NIST（米国国立標準技術研究所）：services.nvd.nist.gov の National Vulnerability Database（NVD）。問い合わせるのは、アプリに組み込んだ決まった製品（Chrome・Firefox・iOS など）の名前と期間だけです</li>
      </ul>
      <p>
        これらのサイトは、一般的なウェブブラウザでの閲覧と同様に、IP アドレスや端末の種類などの情報を受け取ることがあります。その取り扱いは各サイトのプライバシーポリシーに従います。
        詳細画面の「情報源で詳しく見る」を押したときは、ブラウザで情報源のページ（jvn.jp、jvndb.jvn.jp、www.cisa.gov、nvd.nist.gov、nodejs.org）を開きます。
      </p>
      <p>iCloud との同期は Apple が行い、Apple のプライバシーポリシーに従います。</p>

      <h2>4. お子さまの利用</h2>
      <p>本アプリは個人情報を収集しないため、年齢にかかわらず個人情報を取得することはありません。</p>

      <h2>5. このポリシーの変更</h2>
      <p>本アプリの機能の変更などに合わせて、このポリシーを改めることがあります。重要な変更がある場合は、このページでお知らせします。</p>

      <h2>6. お問い合わせ</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </>
  );
}
