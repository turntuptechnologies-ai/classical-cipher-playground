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
];
