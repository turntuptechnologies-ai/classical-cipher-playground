import { ALPHABET, indexToLetter, letterToIndex, normalizeKey } from "./alphabet";

export { normalizeKey };

/**
 * ヴィジュネル方陣（tabula recta）。行 = 鍵の文字、列 = 平文の文字。
 * square[r][c] は「行の文字を鍵として列の文字を暗号化した結果」。
 */
export function tabulaRecta(): string[][] {
  return ALPHABET.split("").map((_, r) => ALPHABET.split("").map((_, c) => ALPHABET[(r + c) % 26]));
}

export function uniqueKeyLetters(key: string): string[] {
  const cleanKey = normalizeKey(key);
  const seen = new Set<string>();
  const order: string[] = [];
  for (const char of cleanKey) {
    if (!seen.has(char)) {
      seen.add(char);
      order.push(char);
    }
  }
  return order;
}

function transform(text: string, key: string, direction: 1 | -1): string {
  const cleanKey = normalizeKey(key);
  if (cleanKey.length === 0) return text;

  let keyPos = 0;
  return [...text]
    .map((char) => {
      const plainIndex = letterToIndex(char);
      if (plainIndex === null) return char;

      const keyIndex = letterToIndex(cleanKey[keyPos % cleanKey.length]) ?? 0;
      keyPos += 1;

      const isUpperCase = char === char.toUpperCase();
      return indexToLetter(plainIndex + direction * keyIndex, isUpperCase);
    })
    .join("");
}

export function vigenereEncode(text: string, key: string): string {
  return transform(text, key, 1);
}

export function vigenereDecode(text: string, key: string): string {
  return transform(text, key, -1);
}

export interface VigenereStep {
  char: string;
  keyChar: string | null;
  result: string;
  isAlpha: boolean;
}

export function vigenereSteps(text: string, key: string, direction: 1 | -1 = 1): VigenereStep[] {
  const cleanKey = normalizeKey(key);
  let keyPos = 0;

  return [...text].map((char) => {
    const plainIndex = letterToIndex(char);
    if (plainIndex === null || cleanKey.length === 0) {
      return { char, keyChar: null, result: char, isAlpha: false };
    }

    const keyChar = cleanKey[keyPos % cleanKey.length];
    const keyIndex = letterToIndex(keyChar) ?? 0;
    keyPos += 1;

    const isUpperCase = char === char.toUpperCase();
    const result = indexToLetter(plainIndex + direction * keyIndex, isUpperCase);
    return { char, keyChar, result, isAlpha: true };
  });
}
