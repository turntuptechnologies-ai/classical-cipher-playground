export interface CipherInfo {
  id: string;
  path: string;
  name: string;
  era: string;
  tagline: string;
  type: "換字式" | "転置式";
}

export const CIPHER_CATALOG: CipherInfo[] = [
  {
    id: "caesar",
    path: "/caesar",
    name: "シーザー暗号",
    era: "紀元前1世紀 古代ローマ",
    tagline: "アルファベットを一定数だけずらすだけの、暗号史上もっとも有名な暗号",
    type: "換字式",
  },
  {
    id: "substitution",
    path: "/substitution",
    name: "単一換字式暗号",
    era: "9世紀ごろ アラビア〜中世ヨーロッパ",
    tagline: "26文字それぞれを別の文字に置き換える、シーザー暗号の拡張版",
    type: "換字式",
  },
  {
    id: "vigenere",
    path: "/vigenere",
    name: "ヴィジュネル暗号",
    era: "16世紀 フランス",
    tagline: "鍵となる単語で毎回ずらし幅を変える、300年間解読不能と言われた暗号",
    type: "換字式",
  },
  {
    id: "railfence",
    path: "/railfence",
    name: "レールフェンス暗号",
    era: "古代〜 スキュタレー暗号の系譜",
    tagline: "文字の並び替え（転置）で読めなくする、線路のようにジグザグに書く暗号",
    type: "転置式",
  },
];
