// ピッグペン暗号（豚小屋暗号）: フリーメイソンで使われたとされる記号ベースの換字式暗号。
// 3×3の格子2枚(A〜I、点つきでJ〜R)とX字2枚(S〜V、点つきでW〜Z)の位置で26文字を表す。
// 「グリッド・グリッド・X・X」型は最も広く紹介される構成だが、歴史的には複数の亜種が存在する。
export type XSide = "top" | "right" | "bottom" | "left";

export type PigpenSymbol =
  | { kind: "grid"; row: 0 | 1 | 2; col: 0 | 1 | 2; dotted: boolean }
  | { kind: "x"; side: XSide; dotted: boolean };

const GRID_LETTERS = ["ABC", "DEF", "GHI"];
const GRID_LETTERS_DOTTED = ["JKL", "MNO", "PQR"];
const X_ORDER: XSide[] = ["top", "right", "bottom", "left"];
const X_LETTERS = ["S", "T", "U", "V"];
const X_LETTERS_DOTTED = ["W", "X", "Y", "Z"];

export const PIGPEN_TABLE: Record<string, PigpenSymbol> = {};

GRID_LETTERS.forEach((rowLetters, row) => {
  [...rowLetters].forEach((letter, col) => {
    PIGPEN_TABLE[letter] = { kind: "grid", row: row as 0 | 1 | 2, col: col as 0 | 1 | 2, dotted: false };
  });
});
GRID_LETTERS_DOTTED.forEach((rowLetters, row) => {
  [...rowLetters].forEach((letter, col) => {
    PIGPEN_TABLE[letter] = { kind: "grid", row: row as 0 | 1 | 2, col: col as 0 | 1 | 2, dotted: true };
  });
});
X_LETTERS.forEach((letter, i) => {
  PIGPEN_TABLE[letter] = { kind: "x", side: X_ORDER[i], dotted: false };
});
X_LETTERS_DOTTED.forEach((letter, i) => {
  PIGPEN_TABLE[letter] = { kind: "x", side: X_ORDER[i], dotted: true };
});

const SIDE_CODE: Record<XSide, string> = { top: "T", right: "R", bottom: "B", left: "L" };
const CODE_SIDE: Record<string, XSide> = { T: "top", R: "right", B: "bottom", L: "left" };

export function symbolToCode(symbol: PigpenSymbol): string {
  if (symbol.kind === "grid") {
    return `${symbol.row + 1}${symbol.col + 1}${symbol.dotted ? "." : ""}`;
  }
  return `${SIDE_CODE[symbol.side]}${symbol.dotted ? "." : ""}`;
}

const GRID_CODE_PATTERN = /^([1-3])([1-3])(\.?)$/;
const X_CODE_PATTERN = /^([TRBL])(\.?)$/;

function codeToLetter(code: string): string | null {
  const gridMatch = code.match(GRID_CODE_PATTERN);
  if (gridMatch) {
    const row = Number(gridMatch[1]) - 1;
    const col = Number(gridMatch[2]) - 1;
    const dotted = gridMatch[3] === ".";
    const letters = dotted ? GRID_LETTERS_DOTTED : GRID_LETTERS;
    return letters[row][col];
  }
  const xMatch = code.match(X_CODE_PATTERN);
  if (xMatch) {
    const side = CODE_SIDE[xMatch[1]];
    const dotted = xMatch[2] === ".";
    const letters = dotted ? X_LETTERS_DOTTED : X_LETTERS;
    return letters[X_ORDER.indexOf(side)];
  }
  return null;
}

function isWhitespace(char: string): boolean {
  return /\s/.test(char);
}

export interface PigpenToken {
  original: string;
  letter: string | null;
  symbol: PigpenSymbol | null;
  code: string;
}

export function pigpenEncodeTokens(text: string): PigpenToken[] {
  const tokens: PigpenToken[] = [];
  for (const char of text) {
    if (isWhitespace(char)) continue;
    const letter = char.toUpperCase();
    const symbol = PIGPEN_TABLE[letter];
    if (symbol) {
      tokens.push({ original: char, letter, symbol, code: symbolToCode(symbol) });
    } else {
      tokens.push({ original: char, letter: null, symbol: null, code: char });
    }
  }
  return tokens;
}

export function pigpenEncode(text: string): string {
  return pigpenEncodeTokens(text)
    .map((t) => t.code)
    .join(" ");
}

export function pigpenDecode(text: string): string {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  return tokens
    .map((token) => codeToLetter(token) ?? token)
    .join("");
}

export function pigpenDecodeTokens(text: string): PigpenToken[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((code) => {
      const letter = codeToLetter(code);
      return { original: code, letter, symbol: letter ? PIGPEN_TABLE[letter] : null, code };
    });
}
