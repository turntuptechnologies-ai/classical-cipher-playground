export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const CODE_A_UPPER = "A".charCodeAt(0);
const CODE_A_LOWER = "a".charCodeAt(0);

export interface KeyValidation {
  valid: boolean;
  message: string;
}

export function validateKey(key: string): KeyValidation {
  const normalized = key.toUpperCase();

  if (normalized.length !== 26) {
    return { valid: false, message: `鍵は26文字である必要があります（現在 ${normalized.length} 文字）` };
  }

  const seen = new Set<string>();
  for (const char of normalized) {
    if (char < "A" || char > "Z") {
      return { valid: false, message: `A〜Z以外の文字が含まれています: "${char}"` };
    }
    if (seen.has(char)) {
      return { valid: false, message: `文字 "${char}" が重複しています` };
    }
    seen.add(char);
  }

  return { valid: true, message: "有効な換字表です" };
}

export function randomKey(): string {
  const letters = ALPHABET.split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.join("");
}

function transform(text: string, key: string, encode: boolean): string {
  const normalizedKey = key.toUpperCase();
  const from = encode ? ALPHABET : normalizedKey;
  const to = encode ? normalizedKey : ALPHABET;

  return [...text]
    .map((char) => {
      const code = char.charCodeAt(0);
      const isUpper = code >= CODE_A_UPPER && code <= CODE_A_UPPER + 25;
      const isLower = code >= CODE_A_LOWER && code <= CODE_A_LOWER + 25;
      if (!isUpper && !isLower) return char;

      const upperChar = char.toUpperCase();
      const idx = from.indexOf(upperChar);
      if (idx === -1) return char;

      const mapped = to[idx];
      return isLower ? mapped.toLowerCase() : mapped;
    })
    .join("");
}

export function substitutionEncode(text: string, key: string): string {
  return transform(text, key, true);
}

export function substitutionDecode(text: string, key: string): string {
  return transform(text, key, false);
}
