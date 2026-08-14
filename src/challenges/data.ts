export type Difficulty = "easy" | "medium" | "hard";

export interface Challenge {
  id: string;
  cipherId: string;
  cipherName: string;
  cipherPath: string;
  difficulty: Difficulty;
  title: string;
  prompt: string;
  ciphertext: string;
  hints: string[];
  answer: string;
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "やさしい",
  medium: "ふつう",
  hard: "むずかしい",
};

export const CHALLENGES: Challenge[] = [
  {
    id: "caesar-1",
    cipherId: "caesar",
    cipherName: "シーザー暗号",
    cipherPath: "/caesar",
    difficulty: "easy",
    title: "明日の約束",
    prompt: "偵察部隊からの伝令文が届いた。ずらし数はわからないが、そう大きくはないはずだ。",
    ciphertext: "ZLL FVB AVTVYYVD",
    hints: ["ずらし数は 5〜10 のどこかです。シーザー暗号のページで総当たりしてみましょう。", "ずらし数は 7 です。"],
    answer: "SEE YOU TOMORROW",
  },
  {
    id: "railfence-1",
    cipherId: "railfence",
    cipherName: "レールフェンス暗号",
    cipherPath: "/railfence",
    difficulty: "easy",
    title: "深夜の会合",
    prompt: "文字はすべてそのまま、並び順だけが入れ替わっている。レール数を見つけよう。",
    ciphertext: "MAIEETNGEMMDHTIT",
    hints: ["レール数は 3〜5 のどこかです。", "レール数は 4 です。"],
    answer: "MEETMEATMIDNIGHT",
  },
  {
    id: "uesugi-1",
    cipherId: "uesugi",
    cipherName: "上杉暗号",
    cipherPath: "/uesugi",
    difficulty: "medium",
    title: "のろしの合図",
    prompt: "陣中から届いた短い合図。上杉暗号の表には秘密の鍵はなく、誰でも同じ表を引ける。",
    ciphertext: "4-5 1-2 6-7",
    hints: ["上杉暗号のページにある7×7の表で、行の数字→列の数字の順に文字を探しましょう。"],
    answer: "のろし",
  },
  {
    id: "substitution-1",
    cipherId: "substitution",
    cipherName: "単一換字式暗号",
    cipherPath: "/substitution",
    difficulty: "medium",
    title: "秘密の合言葉",
    prompt: "26文字がバラバラに置き換えられている。よく出てくる3文字の単語に注目してみよう。",
    ciphertext: "ZIT LTEKTZ VGKR OL GVS",
    hints: [
      "平文の最初の単語は英語で最も頻出する3文字の単語 THE です。",
      "換字表の鍵は QWERTYUIOPASDFGHJKLZXCVBNM です（単一換字式暗号のページに入力してみましょう）。",
    ],
    answer: "THE SECRET WORD IS OWL",
  },
  {
    id: "vigenere-1",
    cipherId: "vigenere",
    cipherName: "ヴィジュネル暗号",
    cipherPath: "/vigenere",
    difficulty: "medium",
    title: "城を守れ",
    prompt: "鍵は繰り返し使われる短い英単語。手がかりは鍵の長さだけ。",
    ciphertext: "JSQHTR EKK QLVZZP",
    hints: ["鍵は4文字の英単語です。", "鍵は GOLD です。"],
    answer: "DEFEND THE CASTLE",
  },
  {
    id: "enigma-1",
    cipherId: "enigma",
    cipherName: "エニグマ暗号",
    cipherPath: "/enigma",
    difficulty: "hard",
    title: "救援要請",
    prompt: "機械式暗号の設定は多岐にわたる。今日の鍵表（ローター配置・リング・初期位置・プラグボード）を手に入れた。",
    ciphertext: "LQZIVMZS",
    hints: [
      "ローター配置は 左から II, IV, V、リング設定は B, F, D、初期位置は X, Y, Z です。",
      "プラグボードは QW ER TY です。",
    ],
    answer: "SENDHELP",
  },
];

export function normalizeAnswer(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Zぁ-んァ-ヶ一-龠]/g, "");
}

export function isCorrectAnswer(challenge: Challenge, guess: string): boolean {
  if (normalizeAnswer(guess).length === 0) return false;
  return normalizeAnswer(guess) === normalizeAnswer(challenge.answer);
}
