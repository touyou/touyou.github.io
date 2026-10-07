import type { Metadata } from "next";

const CONTACT_EMAIL = "contact@touyou.dev";

/** Programming Quiz のサポート。答えはアプリの実装（QuizLiT リポジトリ）と、画面の日本語表記に合わせる */
export const metadata: Metadata = {
  title: "サポート — Programming Quiz",
  description: "Programming Quiz のよくある質問とお問い合わせ先。",
};

export default function ProgrammingQuizSupportPage() {
  return (
    <>
      <h1>Programming Quiz サポート</h1>
      <p>
        Programming Quiz は、プログラミング知識編・iPhoneアプリ開発編・アルゴリズム編の 3 つのジャンルから、3 択のクイズに挑戦できるアプリです。iPhone と iPad（iOS 26・iPadOS 26 以降）に対応しています。
      </p>

      <h2>お問い合わせ</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> までご連絡ください。端末の機種、OS のバージョン、起きたことと手順を書いていただけると助かります。問題の内容の誤りについてのご指摘も、こちらで受け付けています。
      </p>

      <h2>よくある質問</h2>

      <h3>遊び方は？</h3>
      <p>
        ホーム画面で挑戦したいジャンルを選び（いくつでも選べます）、「スタート」を押してください。選んだジャンルの問題が、毎回順番を入れ替えて出題されます。最後の問題に答えると「結果発表」で正解数が表示され、「もう一度チャレンジ」で同じ問題に挑戦し直せます。
      </p>

      <h3>「AIにおまかせ出題」が使えません</h3>
      <p>
        「AIにおまかせ出題」は、端末の中で動く Apple の言語モデル（Apple Intelligence）を使います。Apple Intelligence に対応した端末で、「設定」で Apple Intelligence をオンにしてお使いください。オンにした直後は、準備が終わるまで使えないことがあります。使えない端末では、ホーム画面に「この端末では AI 出題を利用できません。」と表示されます。
      </p>

      <h3>AI の問題の答えが間違っているようです</h3>
      <p>
        AI の問題は、問題文・選択肢・正誤をすべて自動で生成しているため、誤りを含むことがあります。正しさは保証できません。気になる問題があったときは、別の資料でも確かめてください。
      </p>

      <h3>Siri やショートカットから始めるには？</h3>
      <p>
        「Programming Quizでクイズを始める」「Programming Quizでアルゴリズム編のクイズを始める」「Programming QuizでAIクイズを始める」のように話しかけてください。ショートカット App では「カテゴリを指定してクイズを開始」と「AIクイズを開始」のアクションを使えます。
      </p>

      <h3>広告とトラッキングの確認について</h3>
      <p>
        Programming Quiz は無料で、ホーム画面の下に広告が表示されます。初めて開いたときに、広告のためにトラッキングを許可するかを確認します。許可しなくても、すべての機能を使えます。あとから変えるときは、iPhone の「設定」›「プライバシーとセキュリティ」›「トラッキング」で切り替えてください。
      </p>

      <h3>料金はかかりますか？</h3>
      <p>無料です。アプリ内課金はありません。</p>

      <h3>成績は記録されますか？</h3>
      <p>記録されません。結果はその場で表示するだけで、アプリを閉じると残りません。</p>

      <p>
        データの扱いについては<a href="/programming-quiz/privacy">プライバシーポリシー</a>をご覧ください。
      </p>
    </>
  );
}
