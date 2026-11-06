import type { Metadata } from "next";
import Link from "next/link";

import { AppNav, AppPage, Band, Heading, Phrases, Tile } from "@/components/app-lp";
import { PatchdayIcon } from "@/components/patchday/PatchdayIcon";

/**
 * Patchday（iOS / iPadOS / macOS アプリ）の紹介ページ。
 * 機能の説明はアプリの実装（Patchday リポジトリの docs/PLAN.md）に合わせる。機能を変えたらここも直す。
 */
export const metadata: Metadata = {
  title: "Patchday — 脆弱性の対応期限を、チームの手元に",
  description:
    "CISA KEV と JVN の脆弱性を対応期限のカレンダーで見て、アナウンスした・話し合えた、を記録できる iPhone・iPad・Mac アプリ。",
};

const features = [
  {
    title: "期限のカレンダー",
    body: "KEV は CISA の期限、JVN は深刻度ごとの日数で期限を決め、カレンダーと一覧に並べます。",
  },
  {
    title: "関係あるものだけ",
    body: "ベンダーや製品をウォッチ・ミュート。詳細からその場で切り替えられます。深刻度や分類でも絞り込めます。",
  },
  {
    title: "チームの進み具合",
    body: "アナウンス済み・対応協議済みなどの状態と、日付つきのメモ。iCloud で iPhone・iPad・Mac に同期します。",
  },
  {
    title: "ウィジェットと Siri",
    body: "ホーム画面とロック画面に今週の件数。「Patchday で今週の期限」と聞けば答えます。",
  },
];

export default function PatchdayPage() {
  return (
    <AppPage>
      <AppNav icon={<PatchdayIcon className="h-6 w-6 shadow-none" />} name="Patchday" home="/patchday">
        <Link href="/patchday/support" className="hover:text-neutral-900">
          サポート
        </Link>
        <Link href="/patchday/privacy" className="hover:text-neutral-900">
          プライバシー
        </Link>
      </AppNav>
      <main>
        <Band className="items-center text-center">
          <PatchdayIcon className="h-28 w-28" />
          <h1 className="text-[clamp(36px,7vw,64px)] font-bold leading-[1.15] tracking-[-0.02em] [font-feature-settings:'palt']">
            <Phrases phrases={["脆弱性の", "対応期限を、", "チームの手元に。"]} />
          </h1>
          <p className="max-w-2xl text-[clamp(17px,2.2vw,21px)] leading-[1.8] text-neutral-600">
            CISA KEV と JVN の脆弱性を、対応期限のカレンダーで。関係のある製品だけをウォッチして、アナウンスした・話し合えた、を記録できます。
          </p>
          <p className="text-sm text-neutral-500">iPhone・iPad・Mac 向け。App Store で近日公開。</p>
        </Band>
        <Band tone="gray">
          <Heading title={["見るべきものを、", "期限の順に。"]} />
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <Tile key={feature.title} title={feature.title} body={feature.body} className="bg-white" />
            ))}
          </div>
        </Band>
        <Band>
          <Heading title={["サーバーなし、", "アカウントなし。"]}>
            情報を取りに行くのは CISA・JVN と、Node.js のリリース予告だけ。記録はあなたの iCloud に保存され、開発者には送られません。
          </Heading>
          <p className="text-center text-sm text-neutral-500">
            出典: CISA Known Exploited Vulnerabilities Catalog ／ JVN・JVN iPedia（IPA・JPCERT/CC）／ Node.js Security Releases。Patchday は CISA・IPA・JPCERT/CC・OpenJS Foundation とは関係のない個人のアプリです。
          </p>
        </Band>
      </main>
    </AppPage>
  );
}
