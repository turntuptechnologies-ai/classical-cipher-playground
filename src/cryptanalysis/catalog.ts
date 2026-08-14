export interface AppliesToCipher {
  name: string;
  path: string;
}

export interface CryptanalysisMethodInfo {
  id: string;
  path: string;
  name: string;
  tagline: string;
  appliesTo: AppliesToCipher[];
}

// 解読方法を紹介した順に並べている（今後の手法追加もここに追記していく）
export const CRYPTANALYSIS_CATALOG: CryptanalysisMethodInfo[] = [
  {
    id: "frequency",
    path: "/cryptanalysis/frequency",
    name: "頻度分析",
    tagline: "文字の出現頻度の偏りから、換字のルールを推測する解読の基本手法",
    appliesTo: [
      { name: "シーザー暗号", path: "/caesar" },
      { name: "単一換字式暗号", path: "/substitution" },
      { name: "アトバシュ暗号", path: "/atbash" },
      { name: "ピッグペン暗号", path: "/pigpen" },
      { name: "ポリュビオス暗号", path: "/polybius" },
      { name: "上杉暗号", path: "/uesugi" },
    ],
  },
  {
    id: "bruteforce",
    path: "/cryptanalysis/bruteforce",
    name: "総当たり攻撃",
    tagline: "鍵の候補が少ない暗号に対して、すべてのパターンを試して読める結果を探す手法",
    appliesTo: [
      { name: "シーザー暗号", path: "/caesar" },
      { name: "スキュタレー暗号", path: "/scytale" },
    ],
  },
  {
    id: "kasiski",
    path: "/cryptanalysis/kasiski",
    name: "カシスキー試験",
    tagline: "暗号文中に繰り返し現れる文字列の間隔から、鍵の長さを推測する手法",
    appliesTo: [{ name: "ヴィジュネル暗号", path: "/vigenere" }],
  },
  {
    id: "anagram",
    path: "/cryptanalysis/anagram",
    name: "アナグラム法",
    tagline: "文字の並び替えを疑い、読める並びが出るまで列数・並び順を試行錯誤する手法",
    appliesTo: [
      { name: "スキュタレー暗号", path: "/scytale" },
      { name: "レールフェンス暗号", path: "/railfence" },
      { name: "列転置暗号", path: "/columnar" },
      { name: "図形転置式暗号", path: "/geometric" },
    ],
  },
  {
    id: "known-plaintext",
    path: "/cryptanalysis/known-plaintext",
    name: "既知平文攻撃",
    tagline: "平文の一部が分かっている（推測できる）ときに、そこから鍵を逆算する手法",
    appliesTo: [
      { name: "ヴィジュネル暗号", path: "/vigenere" },
      { name: "プレイフェア暗号", path: "/playfair" },
      { name: "ADFGVX暗号", path: "/adfgvx" },
      { name: "エニグマ暗号", path: "/enigma" },
    ],
  },
];
