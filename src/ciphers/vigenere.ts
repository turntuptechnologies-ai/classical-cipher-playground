const CODE_A_UPPER = "A".charCodeAt(0);
const CODE_A_LOWER = "a".charCodeAt(0);

function letterToIndex(char: string): number | null {
  const code = char.charCodeAt(0);
  if (code >= CODE_A_UPPER && code <= CODE_A_UPPER + 25) return code - CODE_A_UPPER;
  if (code >= CODE_A_LOWER && code <= CODE_A_LOWER + 25) return code - CODE_A_LOWER;
  return null;
}

function indexToLetter(index: number, isUpperCase: boolean): string {
  const normalized = ((index % 26) + 26) % 26;
  return String.fromCharCode((isUpperCase ? CODE_A_UPPER : CODE_A_LOWER) + normalized);
}

export function normalizeKey(key: string): string {
  return key.replace(/[^a-zA-Z]/g, "").toUpperCase();
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
