import type { Metadata } from "next";

const CONTACT_EMAIL = "contact@touyou.dev";

/** Intento のサポート。操作の説明は App Store の説明文と、アプリの日本語表記に合わせる */
export const metadata: Metadata = {
  title: "サポート — Intento",
  description: "Intento のよくある質問とお問い合わせ先。",
};

export default function IntentoSupportPage() {
  return (
    <>
      <h1>Intento サポート</h1>
      <p>
        Intento は、Siri、ウィジェット、コントロールセンター、ロック画面、Apple Watch、Spotlight から使えるやることリストです。iPhone、iPad、Mac、Apple Watch、Apple Vision Pro に対応しています。
      </p>

      <h2>お問い合わせ</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> までご連絡ください。アプリのバージョン（「設定」に表示されます）、端末の機種、OS のバージョン、起きたことと手順を書いていただけると助かります。
      </p>

      <h2>よくある質問</h2>

      <h3>Siri から使うには？</h3>
      <p>
        「Intento でやることを追加」「Intento で〇〇を完了」のように話しかけてください。〇〇にはやることの名前をそのまま入れられます。ほかにも「Intento の〇〇をスヌーズ」「Intento のやることは何件」などが使えます。
      </p>

      <h3>ショートカットで使うには？</h3>
      <p>ショートカット App のアクションの一覧で Intento を探してください。やることの追加・完了・検索など、25 種類のアクションを使えます。</p>

      <h3>集中モードで表示を絞り込むには？</h3>
      <p>
        iPhone の「設定」›「集中モード」で使っているモードを選び、「集中モードフィルタ」の「フィルタを追加」から Intento を選びます。カテゴリで絞る、急ぎだけにする、完了したものを隠す、の中から選べます。一覧とウィジェットの両方に反映されます。
      </p>

      <h3>完了したやることはどこに行きましたか？</h3>
      <p>チェックしたやることは数秒表示されたあと、一覧から隠れます。「完了済み」で絞り込むと、いつでも見られます。</p>

      <h3>ほかのデバイスに同期されないときは？</h3>
      <p>
        どのデバイスも同じ Apple Account でサインインし、iCloud を使える状態になっているかを確かめてください。通信の状況によっては、反映まで少し時間がかかることがあります。
      </p>

      <h3>料金はかかりますか？</h3>
      <p>Intento は無料です。アプリ内課金もありません。</p>

      <h3>データを消すには？</h3>
      <p>
        アプリからやることを削除するか、デバイスからアプリを削除してください。iCloud 上のデータは「設定 → Apple Account → iCloud」から削除できます。詳しくは<a href="/intento/privacy">プライバシーポリシー</a>をご覧ください。
      </p>
    </>
  );
}
