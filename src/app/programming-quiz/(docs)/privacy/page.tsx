import type { Metadata } from "next";

/**
 * Programming Quiz のプライバシーポリシー。
 * 内容はアプリの実装（QuizLiT リポジトリ）だけを根拠にする。外部と通信するのは Google Mobile Ads SDK だけで、
 * アプリ自身は UserDefaults・ファイル・サーバーへの保存や送信をしていない。実装を変えたらここも直す。
 */
const EFFECTIVE_DATE = "2026-10-08";
const CONTACT_EMAIL = "contact@touyou.dev";

export const metadata: Metadata = {
  title: "プライバシーポリシー — Programming Quiz",
  description: "Programming Quiz が扱う情報と、広告・AI 出題でのデータの扱い。",
};

export default function ProgrammingQuizPrivacyPage() {
  return (
    <>
      <h1>Programming Quiz プライバシーポリシー</h1>
      <p>制定日：{EFFECTIVE_DATE}</p>

      <p>
        このポリシーは、touyou（以下「開発者」）が提供する iOS・iPadOS アプリ「Programming Quiz」（以下「本アプリ」）での情報の扱いを説明するものです。
      </p>
      <ul>
        <li>アカウント登録はありません</li>
        <li>開発者は、本アプリの利用者の情報を収集するサーバーを持っておらず、情報を受け取りません</li>
        <li>外部と通信するのは、広告を表示するための Google Mobile Ads SDK だけです</li>
      </ul>

      <h2>広告（Google AdMob）</h2>
      <p>
        本アプリは、ホーム画面に Google LLC の広告配信サービス「Google AdMob」の広告を表示します。広告の表示のため、Google Mobile Ads SDK が端末やアプリに関する情報（IP アドレス、端末の種類、OS のバージョン、広告の表示やタップの記録など）を Google に送信することがあります。
      </p>
      <p>
        本アプリを初めて開いたときに、App Tracking Transparency の仕組みで、広告識別子（IDFA）の利用を許可するかを確認します。
      </p>
      <ul>
        <li>許可した場合は、広告識別子を使って、興味により合った広告が表示されることがあります</li>
        <li>許可しない場合は、広告識別子を使わずに広告を表示します。本アプリの機能はすべて使えます</li>
      </ul>
      <p>
        選んだ内容は、iPhone・iPad の「設定」›「プライバシーとセキュリティ」›「トラッキング」でいつでも変えられます。広告の効果測定には、利用者を特定しない Apple の SKAdNetwork が使われることがあります。
      </p>
      <p>
        Google によるデータの扱いは、<a href="https://policies.google.com/privacy">Google のプライバシーポリシー</a>と
        <a href="https://policies.google.com/technologies/partner-sites">Google のサービスを使用するサイトやアプリから収集した情報の Google による使用</a>
        をご覧ください。
      </p>

      <h2>AI 出題（オンデバイス AI）</h2>
      <p>
        「AIにおまかせ出題」に入力したテーマは、端末の中で動く Apple の言語モデル（Foundation Models フレームワーク）だけに渡され、問題の生成に使われます。入力したテーマと生成された問題を、本アプリが開発者や第三者に送信することはありません。また、本アプリはこれらを保存しません。
      </p>

      <h2>端末に保存する情報</h2>
      <p>
        本アプリ自身は、選んだジャンル、回答、結果、AI 出題のテーマを端末に保存しません。アプリを閉じると残りません。トラッキングの許可の選択は iOS・iPadOS が管理します。Google Mobile Ads SDK は、広告の表示のために端末内にデータを保存することがあります。
      </p>

      <h2>解析ツール</h2>
      <p>本アプリには、利用状況を解析するツールは組み込んでいません。</p>

      <h2>このポリシーの変更</h2>
      <p>本アプリの機能の変更にあわせて、このポリシーを改めることがあります。改めたときは、このページで内容と日付を更新します。</p>

      <h2>お問い合わせ</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> までご連絡ください。<a href="/programming-quiz/support">サポート</a>のページもご覧ください。
      </p>
    </>
  );
}
