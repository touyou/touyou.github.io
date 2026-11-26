import type { Metadata } from "next";
import type { ReactNode } from "react";

const CONTACT_EMAIL = "contact@touyou.dev";
// 氏名は省略せずに載せる（App Store の販売元にも出ている）。住所と電話番号だけ特商法11条但し書きで請求時の開示にする
const SELLER_NAME = "藤井陽介";
const EFFECTIVE_DATE = "2026-11-27";

type Product = { name: string; price: string; kind: string };
type App = { id: string; name: string; products: Product[]; environment: string; detail?: ReactNode };

const TIP_KIND = "チップ・消耗型";
const tips = (names: [string, string, string]): Product[] => [
  { name: names[0], price: "150 円", kind: TIP_KIND },
  { name: names[1], price: "500 円", kind: TIP_KIND },
  { name: names[2], price: "1,000 円", kind: TIP_KIND },
];

/**
 * 課金のあるアプリの一覧。価格は日本の App Store の税込価格。
 * 商品や価格、対応する端末を変えたら、ここも直す。
 */
const apps: App[] = [
  {
    id: "toreta",
    name: "Toreta",
    products: [{ name: "Toreta Plus", price: "480 円", kind: "買い切り" }],
    environment: "iOS / iPadOS 27 以降の iPhone / iPad",
  },
  {
    id: "tsukibyobu",
    name: "月屏風",
    products: [
      { name: "音の箱", price: "300 円", kind: "買い切り" },
      { name: "屏風の棚", price: "300 円", kind: "買い切り" },
    ],
    environment: "iOS / iPadOS 27 以降の iPhone（iPhone Duo を含む）/ iPad",
  },
  {
    id: "playground",
    name: "Graphica Playground",
    products: [
      { name: "Pro（月額）", price: "400 円 / 月", kind: "自動更新サブスクリプション（1 か月ごと）" },
      { name: "Pro（年額）", price: "3,000 円 / 年", kind: "自動更新サブスクリプション（1 年ごと）" },
      { name: "Pro（買い切り）", price: "4,800 円", kind: "買い切り" },
    ],
    environment: "iOS / iPadOS 26 以降の iPhone / iPad",
    detail: (
      <>
        無料トライアルの条件やアプリ内からの解約の手順など、サブスクリプションについての詳しい表記は
        <a href="https://graphica.touyou.dev/playground/legal-notice">Graphica Playground の表記</a>
        にあります。
      </>
    ),
  },
  {
    id: "graphica",
    name: "Graphica",
    products: tips(["コーヒー一杯", "ケーキも添えて", "お昼ごはん"]),
    environment: "iOS / iPadOS / macOS / visionOS 26 以降の iPhone / iPad / Mac / Apple Vision Pro",
  },
  {
    id: "intento",
    name: "Intento",
    products: tips(["コーヒー一杯", "ケーキも添えて", "お昼ごはん"]),
    environment: "iOS / iPadOS / macOS / visionOS 27 以降の iPhone / iPad / Mac / Apple Vision Pro",
  },
  {
    id: "patchday",
    name: "Patchday",
    products: tips(["支援（コーヒー一杯分）", "支援（ケーキ付き）", "支援（ランチ一回分）"]),
    environment: "iOS / iPadOS / macOS 27 以降の iPhone / iPad / Mac",
  },
  {
    id: "checkitout",
    name: "チェケラ",
    products: tips(["コーヒー一杯", "ケーキも添えて", "お昼ごはん"]),
    environment: "iOS / iPadOS 26 以降の iPhone / iPad",
  },
];

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 — touyou.dev",
  description: "touyou が個人で開発しているアプリのアプリ内課金についての、特定商取引法に基づく表記。",
};

export default function LegalPage() {
  return (
    <>
      <h1>特定商取引法に基づく表記</h1>
      <p>
        touyou が個人で開発しているアプリの、アプリ内課金の販売についての表記です。どのアプリも決済は App Store で行います。
        （{EFFECTIVE_DATE} 更新）
      </p>

      <h2>販売事業者・運営責任者</h2>
      <p>{SELLER_NAME}（個人）</p>

      <h2>所在地・電話番号</h2>
      <p>請求があった場合には、遅滞なく電子メールで開示します。下記のメールアドレスまでご連絡ください。</p>

      <h2>メールアドレス</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>

      <h2>販売価格</h2>
      <p>
        アプリごとの商品と価格（税込）は、下の「アプリごとの販売内容」のとおりです。実際には、App Store
        のアプリ内の購入画面に表示される価格が適用されます。
      </p>
      <p>チップは開発を応援していただくためのもので、購入しても使える機能は増えません。何度でも購入できます。</p>

      <h2>商品代金以外に必要な費用</h2>
      <p>アプリのダウンロードや利用にかかるインターネット接続料金・通信料金は、お客様のご負担となります。</p>

      <h2>支払方法</h2>
      <p>App Store の決済（お客様の Apple Account に登録された支払い方法）です。</p>

      <h2>支払時期</h2>
      <ul>
        <li>購入を確定した時点で、Apple Account に請求されます。</li>
        <li>
          自動更新サブスクリプションは、現在の期間が終わる 24 時間前までに自動更新をオフにしない限り、期間が終わる前の 24
          時間以内に次の期間の料金が請求されます。
        </li>
      </ul>

      <h2>引渡し時期</h2>
      <p>購入の手続きが終わると、すぐに使えるようになります。チップは、購入の手続きが終わった時点で完了します。</p>

      <h2>契約期間と解約方法（自動更新サブスクリプション）</h2>
      <ul>
        <li>自動更新サブスクリプションは、商品ごとに決まった期間（1 か月または 1 年）で自動更新されます。</li>
        <li>
          解約は、iPhone / iPad の「設定」› 自分の名前（Apple Account）›「サブスクリプション」から行えます。現在の期間が終わる 24
          時間前までに解約すると、次の期間の料金は請求されません。解約後も期間が終わるまでは使えます。
        </li>
        <li>買い切りとチップは更新されないので、解約の手続きはありません。</li>
      </ul>

      <h2>返品・キャンセル</h2>
      <p>
        デジタルコンテンツの性質上、購入後の返品・キャンセルはお受けしていません。決済は Apple が行うため、返金は Apple
        の規定に従い、
        <a href="https://reportaproblem.apple.com" target="_blank" rel="noreferrer">
          reportaproblem.apple.com
        </a>
        から申請できます。
      </p>

      <h2>動作環境</h2>
      <p>アプリごとの対応 OS と端末は下のとおりです。App Store の各アプリのページにも記載しています。</p>

      <h2>アプリごとの販売内容</h2>
      {apps.map((app) => (
        <section key={app.id} id={app.id} className="scroll-mt-16">
          <h3>{app.name}</h3>
          <ul>
            {app.products.map((product) => (
              <li key={product.name}>
                {product.name}：{product.price}（{product.kind}）
              </li>
            ))}
          </ul>
          <p>動作環境：{app.environment}</p>
          {app.detail && <p>{app.detail}</p>}
        </section>
      ))}
    </>
  );
}
