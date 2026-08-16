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
    id: "atbash-1",
    cipherId: "atbash",
    cipherName: "アトバシュ暗号",
    cipherPath: "/atbash",
    difficulty: "easy",
    title: "門を開けよ",
    prompt: "この暗号には鍵がない。アルファベットの並びをよく見て、規則を見抜こう。",
    ciphertext: "LKVM GSV TZGV",
    hints: ["A↔Z, B↔Yのように、アルファベットを先頭と末尾から向かい合わせに入れ替える暗号です。鍵は要りません。"],
    answer: "OPEN THE GATE",
  },
  {
    id: "scytale-1",
    cipherId: "scytale",
    cipherName: "スキュタレー暗号",
    cipherPath: "/scytale",
    difficulty: "easy",
    title: "即時撤退命令",
    prompt: "文字はすべてそのまま、並び順だけが入れ替わっている。棒の面数を見つけよう。",
    ciphertext: "RETEEAOTTNRAC",
    hints: ["面数は 3〜5 のどこかです。", "面数は 4 です。"],
    answer: "RETREATATONCE",
  },
  {
    id: "polybius-1",
    cipherId: "polybius",
    cipherName: "ポリュビオス暗号",
    cipherPath: "/polybius",
    difficulty: "medium",
    title: "進軍の報",
    prompt: "「行-列」の座標で書かれた伝令文。表の並びは素のアルファベット順ではなさそうだ。",
    ciphertext: "3-3 1-5 1-2 1-4 2-4 1-5 4-4 2-2 1-5 5-2 3-4",
    hints: ["鍵は6文字の英単語です。", "鍵は GREECE です。"],
    answer: "MARCH AT DAWN",
  },
  {
    id: "geometric-1",
    cipherId: "geometric",
    cipherName: "図形転置式暗号",
    cipherPath: "/geometric",
    difficulty: "medium",
    title: "正午の補給",
    prompt: "升目に書き込んだあと、列読みではない少し変わったルートで読み出されている。",
    ciphertext: "BRINGLTNOONISUPPASE",
    hints: ["行数は4です。", "読み出しルートは「渦巻き読み」です。"],
    answer: "BRINGSUPPLIESATNOON",
  },
  {
    id: "columnar-1",
    cipherId: "columnar",
    cipherName: "列転置暗号",
    cipherPath: "/columnar",
    difficulty: "medium",
    title: "深夜零時の集合",
    prompt: "文字はすべてそのまま、キーワードの並び順で列を読み出す順番が決まっている。",
    ciphertext: "TGTNEITEDAIMMH",
    hints: ["鍵は6文字の英単語です。", "鍵は SHIELD です。"],
    answer: "MEET AT MIDNIGHT",
  },
  {
    id: "playfair-1",
    cipherId: "playfair",
    cipherName: "プレイフェア暗号",
    cipherPath: "/playfair",
    difficulty: "medium",
    title: "橋のたもとで",
    prompt: "1文字ずつではなく、2文字のペアがまるごと置き換えられている。鍵となる単語を見つけよう。",
    ciphertext: "IT CS GS SM BI EL FA CW",
    hints: ["鍵は6文字の英単語です。", "鍵は SECRET です。"],
    answer: "MEET AT THE BRIDGE",
  },
  {
    id: "pigpen-1",
    cipherId: "pigpen",
    cipherName: "ピッグペン暗号",
    cipherPath: "/pigpen",
    difficulty: "medium",
    title: "結社の合言葉",
    prompt: "この暗号に秘密の鍵はない。記号の形そのものが手がかりだ。座標表記で届いた合言葉を読み解こう。",
    ciphertext: "21. 11 T 23. 22.",
    hints: ["ピッグペン暗号のページにある記号対応表と照らし合わせながら、復号モードに座標をそのまま入力してみましょう。"],
    answer: "MASON",
  },
  {
    id: "adfgvx-1",
    cipherId: "adfgvx",
    cipherName: "ADFGVX暗号",
    cipherPath: "/adfgvx",
    difficulty: "hard",
    title: "補給要請",
    prompt: "座標変換のあとに列転置がかかった2段階の暗号文。2つの鍵が必要だ。",
    ciphertext: "VDGFFAFAXAVGAGGXAGAVFGAAAVFXAV",
    hints: [
      "方陣の鍵は9文字の単語、転置の鍵は5文字の単語です。",
      "方陣の鍵は OFFENSIVE、転置の鍵は PARIS です。",
    ],
    answer: "SEND SUPPLIES NOW",
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
  {
    id: "homophonic-1",
    cipherId: "homophonic",
    cipherName: "ホモフォニック換字式暗号",
    cipherPath: "/homophonic",
    difficulty: "medium",
    title: "集合場所",
    prompt: "同じ文字でも違うコードで書かれていることがある。鍵の並び順どおりに00からコードが割り振られている。",
    ciphertext: "64 01 01 82 20 82 66 72 72 66",
    hints: [
      "鍵は ZEBRASCDFGHIJKLMNOPQTUVWXY です（ホモフォニック換字式暗号のページに入力してみましょう）。",
      "コード割り当て表と照らし合わせると、64→M, 01→E, 20→A, 82→T, 66→N, 72→O です。",
    ],
    answer: "MEET AT NOON",
  },
  {
    id: "porta-1",
    cipherId: "porta",
    cipherName: "ポルタ暗号",
    cipherPath: "/porta",
    difficulty: "medium",
    title: "港での落ち合い",
    prompt: "この暗号は暗号化と復号がまったく同じ操作。鍵が分かれば、暗号文をそのまま同じ操作に通すだけでいい。",
    ciphertext: "SRYB PK AUY ZPIUBK",
    hints: [
      "鍵は6文字の英単語です。",
      "鍵は NAPLES です（ポルタ暗号のページの入力欄に暗号文と鍵をそのまま入れてみましょう）。",
    ],
    answer: "MEET AT THE HARBOR",
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
