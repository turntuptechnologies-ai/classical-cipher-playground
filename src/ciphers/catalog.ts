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
  {
    id: "uesugi",
    path: "/uesugi",
    name: "上杉暗号",
    era: "戦国時代（伝）宇佐美定行考案説",
    tagline: "いろは48文字を7×7の表に並べ、行と列の番号の組で文字を表す日本の陣中暗号",
    type: "換字式",
  },
  {
    id: "enigma",
    path: "/enigma",
    name: "エニグマ暗号",
    era: "1920年代〜第二次世界大戦・ドイツ",
    tagline: "回転するローターで1文字ごとに換字表を切り替える機械式暗号。連合国が解読に成功したことで有名",
    type: "換字式",
  },
];
