import type { Metadata } from "next";

/**
 * チェケラのプライバシーポリシー。書いてあることは、すべて iOS 版の実装（CheckItOut リポジトリ）で確かめたもの。
 * - マイク：Checkitout/Audio/AudioEngine.swift の Recorder（録音は一時フォルダの temp.wav → 保存で Documents/<UUID>.wav に移す）
 * - 一覧：Checkitout/Model/SoundData.swift（SwiftData。entitlements がなく CloudKit 同期はしない）
 * - 削除：Checkitout/Views/ContentView.swift の delete（録音ファイルも消す）
 * - 外部ライブラリは、旧版のデータを移すためだけの RealmSwift のみ（Services/Migration.swift）。通信するコードはない。
 * アプリの実装を変えたら、ここも直す。
 *
 * TODO(Android): Android 版（dev.touyou.checkitoutandroid）のソースはこのポリシーを書いた時点で確認できていない。
 * Android 版の挙動（録音の保存先・通信・広告や解析の SDK の有無）を確かめてから、Android 版の節を足し、対象の範囲の文も直す。
 */
const EFFECTIVE_DATE = "2026-10-08";
const CONTACT_EMAIL = "contact@touyou.dev";

export const metadata: Metadata = {
  title: "プライバシーポリシー — チェケラ",
  description: "チェケラが扱う情報と、その保存場所。",
};

export default function CheckitoutPrivacyPage() {
  return (
    <>
      <h1>
        {/* 語の途中で折り返さないよう、まとまりごとに区切る */}
        <span className="inline-block">チェケラ</span> <span className="inline-block">プライバシーポリシー</span>
      </h1>
      <p>施行日：{EFFECTIVE_DATE}</p>

      <p>このポリシーは、App Store で配信している iPhone・iPad 版のチェケラを対象としています。</p>
      <p>
        チェケラは、あなたが録音した音と、その名前・パッドへの割り当てを、お使いの端末の中にのみ保存します。開発者がその内容を受け取ったり、閲覧したりすることはありません。
      </p>
      <ul>
        <li>アカウント登録はありません</li>
        <li>広告、アクセス解析、トラッキングの仕組みは組み込んでいません</li>
        <li>録音した音や一覧を、開発者のサーバーや第三者へ送信することはありません</li>
      </ul>

      <h2>マイクの使用</h2>
      <p>
        チェケラは、音を録音してパッドに割り当てるためにマイクを使います。マイクの使用の許可は、録音パネルを開いたときに求めます。マイクを使うのは、録音パネルで「REC」を押してから「STOP」を押すまでの間だけです。
      </p>
      <p>録音中に表示する波形は、そのときの音量から作るもので、保存しません。</p>
      <p>
        マイクの許可は、iPhone・iPad の「設定」›「プライバシーとセキュリティ」›「マイク」から、いつでも取り消せます。取り消しても、録音以外の機能はそのまま使えます。
      </p>

      <h2>端末に保存するもの</h2>
      <ul>
        <li>「SAVE」で保存した録音（音声ファイル）</li>
        <li>音の名前、割り当てたパッド、一覧での並び順</li>
      </ul>
      <p>
        これらはアプリの領域の中に保存され、iCloud などで同期することはありません。ただし、iOS・iPadOS の仕組みにより、端末の iCloud バックアップやコンピュータへのバックアップに含まれることがあります。
      </p>
      <p>録音したあと「SAVE」を押さなかった音は、アプリの一時フォルダに残ることがあります。この音は、次に録音したときに上書きされます。</p>
      <p>以前のバージョンから更新した場合は、最初の起動時に、それまでの一覧を端末の中で新しい形式に移し、古い形式のデータを削除します。</p>

      <h2>データの削除</h2>
      <p>
        一覧で音を左にスワイプして削除すると、その音の録音ファイルも端末から削除されます。アプリを端末から削除すると、録音した音と一覧はすべて削除されます。
      </p>

      <h2>このポリシーの変更</h2>
      <p>内容を変更するときは、このページを更新し、施行日を改めます。</p>

      <h2>お問い合わせ</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> までご連絡ください。<a href="/checkitout/support">サポート</a>のページもあわせてご覧ください。
      </p>
    </>
  );
}
