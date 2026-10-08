import type { Metadata } from "next";

const CONTACT_EMAIL = "contact@touyou.dev";
// 特商法では本名が要る（屋号やハンドルネームだけでは足りない）
const SELLER_NAME = "藤井陽介";

/**
 * Toreta（iOS アプリ）の特定商取引法に基づく表記。
 * Toreta Plus の価格や中身、対応 OS を変えたら、ここも直す。
 */
export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 — Toreta",
  description: "Toreta Plus の販売についての特定商取引法に基づく表記。",
};

export default function ToretaTokushohoPage() {
  return (
    <>
      <h1>特定商取引法に基づく表記</h1>
      <p>iPhone アプリ「Toreta」のアプリ内課金「Toreta Plus」の販売についての表記です。</p>

      <h2>販売事業者・運営責任者</h2>
      <p>{SELLER_NAME}</p>

      <h2>所在地・電話番号</h2>
      <p>請求があった場合には、遅滞なく電子メールで開示します。下記のメールアドレスまでご連絡ください。</p>

      <h2>メールアドレス</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>

      <h2>販売価格</h2>
      <p>Toreta Plus：480 円（税込）。App Store のアプリ内の購入画面に表示される価格が適用されます。</p>

      <h2>商品代金以外に必要な費用</h2>
      <p>アプリのダウンロードや利用にかかる通信料は、お客様のご負担となります。</p>

      <h2>支払方法・支払時期</h2>
      <p>App Store の決済でお支払いいただきます。お支払いの時期は、App Store で購入の手続きをしたときです。</p>

      <h2>引渡し時期</h2>
      <p>購入の手続きが終わると、すぐに使えるようになります。</p>

      <h2>返品・キャンセル</h2>
      <p>
        デジタルコンテンツの性質上、購入後の返品・キャンセルはお受けしていません。返金は Apple が対応します。
        <a href="https://reportaproblem.apple.com" target="_blank" rel="noreferrer">
          reportaproblem.apple.com
        </a>
        からお申し込みください。
      </p>

      <h2>動作環境</h2>
      <p>iOS 27 以降の iPhone</p>

      <h2>販売数量・契約の形態</h2>
      <p>Toreta Plus は買い切りで、自動更新される定期購入ではありません。一度の購入で、同じ Apple アカウントのデバイスすべてで使えます。</p>
    </>
  );
}
