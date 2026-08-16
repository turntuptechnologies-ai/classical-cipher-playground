// 複数の換字式暗号(ヴィジュネル・ポルタ・オートキーなど)で共通して使う、
// A〜Z(大文字・小文字とも)とインデックス(0〜25)の相互変換ヘルパー。
export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const CODE_A_UPPER = "A".charCodeAt(0);
const CODE_A_LOWER = "a".charCodeAt(0);

export function letterToIndex(char: string): number | null {
  const code = char.charCodeAt(0);
  if (code >= CODE_A_UPPER && code <= CODE_A_UPPER + 25) return code - CODE_A_UPPER;
  if (code >= CODE_A_LOWER && code <= CODE_A_LOWER + 25) return code - CODE_A_LOWER;
  return null;
}

export function indexToLetter(index: number, isUpperCase: boolean): string {
  const normalized = ((index % 26) + 26) % 26;
  return String.fromCharCode((isUpperCase ? CODE_A_UPPER : CODE_A_LOWER) + normalized);
}

export function normalizeKey(key: string): string {
  return key.replace(/[^a-zA-Z]/g, "").toUpperCase();
}
