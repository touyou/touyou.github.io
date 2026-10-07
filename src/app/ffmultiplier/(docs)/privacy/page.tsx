import type { Metadata } from "next";

/**
 * FFMultiplier のプライバシーポリシー。
 * FFMultiply リポジトリの docs/privacy_policy.html（広告を入れる前の版）を、いまのアプリの実装に合わせて書き直したもの。
 * 根拠: Services/RankingService.swift（ランキングに送るもの）、Services/AdManager.swift と App/FFMultiplyApp.swift（広告・ATT）、
 * Services/ScoreStore.swift と Model/ScoreEntry.swift（端末内の記録）、Views/*.swift の UserDefaults（名前など）。
 * アプリで扱うデータを変えたら、ここも直す。
 */
const EFFECTIVE_DATE = "2026-10-08";
const CONTACT_EMAIL = "contact@touyou.dev";

export const metadata: Metadata = {
  title: "プライバシーポリシー — FFMultiplier",
  description: "FFMultiplier が扱う情報と、その使い道。",
};

export default function FFMultiplierPrivacyPage() {
  return (
    <>
      <h1>FFMultiplier プライバシーポリシー</h1>
      <p>最終更新：{EFFECTIVE_DATE}</p>

      <p>
        個人でアプリを開発している touyou（以下「開発者」）は、iPhone アプリ「FFMultiplier」（以下「本アプリ」）で扱う情報について、次のとおり定めます。
      </p>
      <ul>
        <li>アカウント登録はありません。メールアドレスや電話番号を入力する場面もありません</li>
        <li>アクセス解析のツールは組み込んでいません</li>
        <li>端末の外に送るのは、オンラインランキングに登録する情報と、広告の配信に使われる情報だけです（自分でシェアを選んだときを除きます）</li>
      </ul>

      <h2>端末の中にだけ保存する情報</h2>
      <p>次の情報は iPhone の中に保存し、開発者を含め、端末の外へは送りません。</p>
      <ul>
        <li>遊んだ結果の点数と、遊んだ日時（「local score」に表示する記録）</li>
        <li>「settings」で入力したユーザー名</li>
        <li>遊び方の説明を表示したかどうか</li>
      </ul>
      <p>ただし、点数とユーザー名は、次のオンラインランキングに登録するときに送ります。</p>

      <h2>オンラインランキング</h2>
      <p>
        ユーザー名を決めたあとにハイスコアを出したとき、または「REGISTER MY SCORE」を押したときに、次の情報を Google が提供する Firebase Realtime Database に送り、保存します。
      </p>
      <ul>
        <li>ユーザー名</li>
        <li>点数（ハイスコア）</li>
        <li>この iPhone で本アプリを区別するための識別子（Apple が提供する「ベンダー識別子」。同じ iPhone からの登録を 1 件にまとめ、自分の順位を見つけるために使います）</li>
      </ul>
      <p>
        ランキングの名前と点数は、本アプリを使うほかの利用者にも表示されます。本名など、知られたくない情報をユーザー名にしないでください。ランキングを表示するとき、ほかの利用者の本アプリには上記の識別子もあわせて送られますが、画面には表示しません。
      </p>
      <p>これらの情報は、オンラインランキングを提供するためだけに使います。</p>

      <h2>広告</h2>
      <p>本アプリは Google が提供する Google AdMob を使い、バナー広告と全画面の広告を表示しています。</p>
      <p>
        初めて起動したとき、App Tracking Transparency の仕組みでトラッキングの許可を求めます。許可した場合は、広告識別子（IDFA）をもとに選ばれた広告が表示されることがあります。許可しなかった場合、広告識別子は使われません。どちらを選んでも、本アプリの機能はすべて使えます。あとから変えるときは、iPhone の「設定」›「プライバシーとセキュリティ」›「トラッキング」で切り替えてください。
      </p>
      <p>
        広告の表示や効果の測定、不正の防止のため、Google AdMob は端末や通信に関する情報（IP アドレス、OS の種類など）と、広告の表示やタップの記録を取得することがあります。Google による情報の扱いは、
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
          Google のパートナーのサイトやアプリでの情報の使用について
        </a>
        をご覧ください。
      </p>

      <h2>シェア</h2>
      <p>結果やランキングの画面でシェアを選ぶと、点数または順位の文と App Store のリンクを、あなたが選んだアプリに渡します。開発者には送られません。</p>

      <h2>第三者への提供</h2>
      <p>上記の Google のサービスを除き、本アプリで扱う情報を第三者に提供することはありません。ただし、法令に基づいて開示を求められた場合は除きます。</p>

      <h2>データの削除</h2>
      <ul>
        <li>「local score」の画面のゴミ箱のボタンから、端末に残っている点数をすべて削除できます。ユーザー名を設定している場合は、オンラインランキングの点数も 0 になります（名前は残ります）</li>
        <li>本アプリを削除すると、端末に保存した情報はすべて消えます。オンラインランキングの情報は残ります</li>
        <li>
          オンラインランキングの情報を名前ごと削除したい場合は、登録した名前を添えて <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> までご連絡ください
        </li>
      </ul>

      <h2>このポリシーの変更</h2>
      <p>本アプリの機能や法令の変更にあわせて、このポリシーを改めることがあります。改めたときは、このページの内容と最終更新日を更新します。</p>

      <h2>お問い合わせ</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> までご連絡ください。<a href="/ffmultiplier/support">サポート</a>のページもあわせてご覧ください。
      </p>
    </>
  );
}
