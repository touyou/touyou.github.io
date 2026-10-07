/**
 * LP に載せる架空のトレカ「Starlight Chronicle」。
 * 実在するカードゲームの名前・画像は権利の都合で使えないので、画面の例はすべてこの架空カードで描く。
 * 名前の組み立てはアプリのサンプルサイト（Toreta/SampleSites/cards.py）に合わせてある。
 */

export type DummyCard = {
  number: string;
  name: string;
  rarity: "N" | "R" | "SR" | "PR";
  /** カードの地の色（グラデーションの始点・終点） */
  colors: [string, string];
  /** 所持枚数。0 は未所持 */
  owned: number;
  wanted?: boolean;
};

const CHARACTERS = ["アリア", "ベル", "シオン", "ルカ", "ミナ", "ノア", "カイ", "レイ", "ユナ", "セナ", "リオ", "ハル"];
const EPITHETS = ["星詠みの", "灯火の", "風渡りの", "白銀の", "夜明けの", "深海の", "森番の", "時計塔の", "雪原の", "琥珀の", "雷鳴の", "花冠の"];
const RARITIES: DummyCard["rarity"][] = ["N", "N", "R", "N", "R", "SR"];
const PALETTES: [string, string][] = [
  ["#7FA7F5", "#3D6FE0"],
  ["#F3A6C4", "#D9578F"],
  ["#9DD9C6", "#2E9C82"],
  ["#F6C987", "#D98A1E"],
  ["#B9A6F2", "#6E4FD6"],
  ["#9FCBE6", "#2F86B8"],
];
const OWNED = [2, 1, 0, 3, 1, 1, 0, 2, 1, 0, 1, 4];

export const dummyCards: DummyCard[] = Array.from({ length: 12 }, (_, i) => {
  const seed = i + 1;
  return {
    number: `SC1-${String(seed).padStart(3, "0")}`,
    name: `${EPITHETS[(seed * 7) % EPITHETS.length]}${CHARACTERS[seed % CHARACTERS.length]}`,
    rarity: RARITIES[i % RARITIES.length],
    colors: PALETTES[i % PALETTES.length],
    owned: OWNED[i],
    wanted: OWNED[i] === 0 && i !== 9,
  };
});
