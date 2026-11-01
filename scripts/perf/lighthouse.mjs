/**
 * ローカルの `pnpm start` に Lighthouse(モバイル既定)を当てて、性能の点数を JSON で出す。
 * 点数は対象ページの performance の平均(0〜100)。整合性チェック(ステータス・本文の文字列・
 * accessibility / best-practices / SEO で落ちる項目が増えない)に落ちたら 0 点。
 * カテゴリの点数で比べないのは、合格していた項目が対象外になる(iframe を消すと frame-title が消える)だけで下がるため。
 * 使い方: node scripts/perf/lighthouse.mjs [--record]  (LIGHTHOUSE_BIN で lighthouse の実行ファイルを指定)
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.PERF_BASE ?? "http://127.0.0.1:3100";
const host = new URL(BASE).hostname;
if (!["127.0.0.1", "localhost"].includes(host)) {
  console.error(`ローカル以外(${host})には当てない。本番の計測はしない`);
  process.exit(2);
}
const LH = process.env.LIGHTHOUSE_BIN ?? "lighthouse";
const here = dirname(fileURLToPath(import.meta.url));
const expectedPath = join(here, "expected.json");
const record = process.argv.includes("--record");

// ページと、本文に必ず含まれるべき文字列(壊れたページで点を取らないため)
const PAGES = [
  { path: "/", mustContain: ["touyou"] },
  { path: "/bento", mustContain: ["touyou"] },
  { path: "/tsukibyobu", mustContain: ["月屏風"] },
];
const GUARDED = ["accessibility", "best-practices", "seo"];

const failures = [];
const out = { scenarios: {} };
const perf = [];
const dir = mkdtempSync(join(tmpdir(), "lh-"));
const got = {};

// 本文の確認を先に済ませる(Lighthouse の実行中に keep-alive の接続が切れて fetch が落ちるため)。
for (const { path, mustContain } of PAGES) {
  const res = await fetch(BASE + path);
  const html = await res.text();
  if (res.status !== 200) failures.push(`${path}: status ${res.status}`);
  for (const s of mustContain) if (!html.includes(s)) failures.push(`${path}: "${s}" が無い`);
}

for (const { path } of PAGES) {
  const file = join(dir, `${path.replaceAll("/", "_") || "_"}.json`);
  execFileSync(
    LH,
    [BASE + path, "--quiet", "--output=json", `--output-path=${file}`, "--chrome-flags=--headless=new --no-sandbox"],
    { stdio: "ignore", timeout: 180_000 }
  );
  const r = JSON.parse(readFileSync(file, "utf8"));
  const a = r.audits;
  perf.push(r.categories.performance.score * 100);
  // 落ちている項目と、その件数(同じ項目で落ちる要素が増えたのも悪化として拾う)
  got[path] = {};
  for (const k of GUARDED) {
    for (const { id } of r.categories[k].auditRefs) {
      const au = a[id];
      if (au.score === null || au.score >= 1 || au.scoreDisplayMode === "informative") continue;
      got[path][id] = au.details?.items?.length ?? 1;
    }
  }
  out.scenarios[path] = {
    performance: Math.round(r.categories.performance.score * 100),
    lcp_ms: Math.round(a["largest-contentful-paint"].numericValue),
    tbt_ms: Math.round(a["total-blocking-time"].numericValue),
    fcp_ms: Math.round(a["first-contentful-paint"].numericValue),
    cls_x1000_errors: Math.round(a["cumulative-layout-shift"].numericValue * 1000),
    // 計測環境では外部(YouTube など)への通信がプロキシで止まり、その重さは点数に出ない。
    // 本番で効く外部の読み込みは件数で数える。
    ext_req_count: (a["network-requests"].details?.items ?? []).filter(
      (i) => !new URL(i.url).hostname.match(/^(127\.0\.0\.1|localhost)$/) && !i.url.startsWith("data:")
    ).length,
    js_kb: Math.round(
      (a["network-requests"].details?.items ?? [])
        .filter((i) => i.resourceType === "Script")
        .reduce((s, i) => s + (i.transferSize ?? 0), 0) / 1024
    ),
  };
}

rmSync(dir, { recursive: true, force: true });

if (record || !existsSync(expectedPath)) {
  writeFileSync(expectedPath, JSON.stringify(got, null, 2) + "\n");
  console.error(`期待値を記録しました: ${expectedPath}`);
}
const expected = JSON.parse(readFileSync(expectedPath, "utf8"));
for (const [path, now] of Object.entries(got)) {
  for (const [id, n] of Object.entries(now)) {
    const before = expected[path]?.[id] ?? 0;
    if (n > before) failures.push(`${path}: ${id} の不合格が ${before} -> ${n} 件`);
  }
}

const valid = failures.length === 0;
const mean = perf.reduce((s, x) => s + x, 0) / perf.length;
console.log(JSON.stringify({ score: valid ? Math.round(mean * 10) / 10 : 0, valid, failures, ...out }, null, 2));
