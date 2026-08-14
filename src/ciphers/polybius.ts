// ポリュビオス暗号: 紀元前2世紀ごろ古代ギリシャの歴史家ポリュビオスが考案したとされる、
// 現存する最古級の座標式の仕組み。もとは松明を使った通信法として考えられた。
// アルファベットを5×5の表(I/Jは同一マス)に並べ、各文字を「行-列」の座標で表す。
// キーワードなし(素のアルファベット順)が史実に近い運用だが、キーワードで表を混ぜれば
// 秘匿性を持つ暗号にもなる(上杉暗号・ADFGVX暗号の座標変換部分の元祖にあたる)。
const ALPHABET_NO_J = "ABCDEFGHIKLMNOPQRSTUVWXYZ";

export function buildPolybiusSquare(keyword: string): string[] {
  const clean = keyword.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  const seen = new Set<string>();
  const letters: string[] = [];

  for (const ch of clean) {
    if (!seen.has(ch)) {
      seen.add(ch);
      letters.push(ch);
    }
  }
  for (const ch of ALPHABET_NO_J) {
    if (!seen.has(ch)) {
      seen.add(ch);
      letters.push(ch);
    }
  }
  return letters;
}

export interface PolybiusToken {
  original: string;
  letter: string | null;
  row: number | null;
  col: number | null;
  code: string;
}

function isWhitespace(char: string): boolean {
  return /\s/.test(char);
}

export function polybiusEncodeTokens(text: string, keyword: string): PolybiusToken[] {
  const square = buildPolybiusSquare(keyword);
  const tokens: PolybiusToken[] = [];

  for (const char of text) {
    if (isWhitespace(char)) continue;
    const letter = char.toUpperCase() === "J" ? "I" : char.toUpperCase();
    const idx = square.indexOf(letter);
    if (idx === -1) {
      tokens.push({ original: char, letter: null, row: null, col: null, code: char });
    } else {
      const row = Math.floor(idx / 5) + 1;
      const col = (idx % 5) + 1;
      tokens.push({ original: char, letter, row, col, code: `${row}-${col}` });
    }
  }
  return tokens;
}

export function polybiusEncode(text: string, keyword: string): string {
  return polybiusEncodeTokens(text, keyword)
    .map((t) => t.code)
    .join(" ");
}

const CODE_PATTERN = /^([1-5])-([1-5])$/;

export function polybiusDecode(text: string, keyword: string): string {
  const square = buildPolybiusSquare(keyword);
  const tokens = text.trim().split(/\s+/).filter(Boolean);

  return tokens
    .map((token) => {
      const match = token.match(CODE_PATTERN);
      if (!match) return token;
      const row = Number(match[1]) - 1;
      const col = Number(match[2]) - 1;
      return square[row * 5 + col];
    })
    .join("");
}
