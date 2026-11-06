import type { Metadata } from "next";

const CONTACT_EMAIL = "contact@touyou.dev";

/** Patchday のサポート。手順のボタン名はアプリの表記に合わせる。 */
export const metadata: Metadata = {
  title: "サポート — Patchday",
  description: "Patchday のよくある質問とお問い合わせ先。",
};

export default function PatchdaySupportPage() {
  return (
    <>
      <h1>Patchday サポート</h1>
      <p>
        Patchday は、CSIRT やセキュリティ担当のための、脆弱性の対応期限を見るアプリです。CISA KEV と JVN の脆弱性を期限ごとに並べ、アナウンスした・対応を話し合えた、を記録できます。
      </p>

      <h2>お問い合わせ</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> までご連絡ください。端末の機種、OS のバージョン、どの脆弱性（CVE 番号など）でどうなったかを書いていただけると助かります。
      </p>

      <h2>よくある質問</h2>

      <h3>期限はどう決まっていますか？</h3>
      <p>
        CISA KEV の脆弱性は、CISA が示す期限（due date）を使います。JVN と NVD の脆弱性は、公開日から深刻度ごとの日数（緊急 7 日・重要 14 日・警告 30 日・注意 90 日）で決めます。NVD は製品と公開日ごとのまとまりの中で、いちばん高い深刻度を使います。どちらも「設定」›「期限のルール」で変えられます。KEV を社内ルールで数えるときは、悪用が確認済みなので緊急として扱います。
      </p>

      <h3>関係ない製品ばかり出てきます</h3>
      <p>
        脆弱性の詳細の「この製品の表示」で、その製品やベンダーをミュートできます。逆に、見たい製品をウォッチすると、ウォッチしたものだけが表示されます。一覧は「設定」の「ウォッチ」「ミュート」で確かめ、左にスワイプして外せます。
      </p>

      <h3>何年も前の期限切れが出てきません</h3>
      <p>KEV には何年も前に期限を迎えたものが大量にあるため、期限切れは 30 日前までを表示しています。「設定」›「期限切れの表示」で変えられます。</p>

      <h3>NVD の「〇〇 の脆弱性 45 件」とは何ですか</h3>
      <p>
        Chrome や macOS などは、1 日に数十件の CVE が公開されることがあります。カレンダーが埋まらないように、NVD の分は製品と公開日ごとに 1 件にまとめています。深刻度はその中でいちばん高いものです。詳細を開くと、含まれる CVE を 1 件ずつ NVD のページで確かめられます。取る製品は「設定」›「情報源」の NVD で選べます。
      </p>

      <h3>JVN の深刻度が「深刻度不明」になっています</h3>
      <p>
        JVN iPedia が停止しているあいだは、JVN の新着情報（深刻度や製品の情報がないもの）を代わりに表示しています。「設定」の「情報源」に、そのことが表示されます。JVN iPedia が再開すると、深刻度つきの情報に戻ります。
      </p>

      <h3>記録はほかの端末と同期されますか？</h3>
      <p>進み具合とメモは、同じ Apple アカウントでサインインした iPhone・iPad・Mac の間で iCloud を通して同期されます。ウォッチ・ミュートなどの表示の設定は端末ごとです。</p>

      <h3>Siri やショートカットから使えますか？</h3>
      <p>「Patchday で今週の期限」と話しかけると、期限が近い脆弱性を答えます。ショートカット App からは、進み具合の記録、メモの書き足し、ウォッチ・ミュート、情報の更新ができます。</p>

      <h2>出典について</h2>
      <p>
        脆弱性の情報は、CISA Known Exploited Vulnerabilities Catalog と JVN（Japan Vulnerability Notes）・JVN iPedia（IPA・JPCERT/CC）、NIST の National Vulnerability Database（NVD）から取得しています。This product uses data from the NVD API but is not endorsed or certified by the NVD. リリースの予定は、Node.js のセキュリティリリースの予告（nodejs.org）と、Microsoft の月例更新（毎月第 2 火曜日）・Oracle の Critical Patch Update（1・4・7・10 月の第 3 火曜日）の暦から作っています。Patchday は個人が開発しているアプリで、CISA・IPA・JPCERT/CC・NIST・OpenJS Foundation・Microsoft・Oracle とは関係ありません。対応の要否や内容は、必ず各情報源と製品の提供元の情報で確かめてください。
      </p>

      <p>
        <a href="/patchday/privacy">プライバシーポリシー</a>
      </p>
    </>
  );
}
