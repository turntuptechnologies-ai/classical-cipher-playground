// いろは47音 + ん の48文字を7×7(49マス)の表に、いろは順で左上から右へ詰めて並べる。
// 例: 「て」(35番目, 0-indexed 34) は 5行7列、「き」(38番目)は6行3列 という史料に伝わる例と一致する。
export const IROHA_48 =
  "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせすん";

export const GRID_SIZE = 7;

export function uesugiGrid(): string[][] {
  const grid: string[][] = Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(""));
  [...IROHA_48].forEach((char, i) => {
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;
    grid[row][col] = char;
  });
  return grid;
}

const POSITION_BY_CHAR = new Map<string, [number, number]>();
[...IROHA_48].forEach((char, i) => {
  POSITION_BY_CHAR.set(char, [Math.floor(i / GRID_SIZE) + 1, (i % GRID_SIZE) + 1]);
});

// 濁点・半濁点・小書き文字は清音・通常の大きさの仮名に変換してから表を引く
const NORMALIZE_MAP: Record<string, string> = {
  が: "か", ぎ: "き", ぐ: "く", げ: "け", ご: "こ",
  ざ: "さ", じ: "し", ず: "す", ぜ: "せ", ぞ: "そ",
  だ: "た", ぢ: "ち", づ: "つ", で: "て", ど: "と",
  ば: "は", び: "ひ", ぶ: "ふ", べ: "へ", ぼ: "ほ",
  ぱ: "は", ぴ: "ひ", ぷ: "ふ", ぺ: "へ", ぽ: "ほ",
  ゔ: "う",
  っ: "つ", ゃ: "や", ゅ: "ゆ", ょ: "よ",
  ぁ: "あ", ぃ: "い", ぅ: "う", ぇ: "え", ぉ: "お", ゎ: "わ",
};

// 全角カタカナ → ひらがな
function katakanaToHiragana(char: string): string {
  const code = char.charCodeAt(0);
  if (code >= 0x30a1 && code <= 0x30f6) {
    return String.fromCharCode(code - 0x60);
  }
  return char;
}

export function normalizeKana(char: string): string {
  const hira = katakanaToHiragana(char);
  return NORMALIZE_MAP[hira] ?? hira;
}

function isWhitespace(char: string): boolean {
  return /\s/.test(char);
}

export interface UesugiToken {
  original: string;
  normalized: string;
  row: number | null;
  col: number | null;
  code: string;
}

export function uesugiEncodeTokens(text: string): UesugiToken[] {
  const tokens: UesugiToken[] = [];
  for (const char of text) {
    if (isWhitespace(char)) continue;
    const normalized = normalizeKana(char);
    const pos = POSITION_BY_CHAR.get(normalized);
    if (pos) {
      tokens.push({ original: char, normalized, row: pos[0], col: pos[1], code: `${pos[0]}-${pos[1]}` });
    } else {
      tokens.push({ original: char, normalized: char, row: null, col: null, code: char });
    }
  }
  return tokens;
}

export function uesugiEncode(text: string): string {
  return uesugiEncodeTokens(text)
    .map((t) => t.code)
    .join(" ");
}

const CODE_PATTERN = /^([1-7])-([1-7])$/;

export function uesugiDecode(text: string): string {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  const grid = uesugiGrid();

  return tokens
    .map((token) => {
      const match = token.match(CODE_PATTERN);
      if (!match) return token;
      const row = Number(match[1]);
      const col = Number(match[2]);
      return grid[row - 1][col - 1] || token;
    })
    .join("");
}
