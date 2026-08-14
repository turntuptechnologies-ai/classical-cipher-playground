const ALPHABET_SIZE = 26;
const CODE_A_UPPER = "A".charCodeAt(0);
const CODE_A_LOWER = "a".charCodeAt(0);

function shiftChar(char: string, shift: number): string {
  const code = char.charCodeAt(0);

  if (code >= CODE_A_UPPER && code <= CODE_A_UPPER + 25) {
    const shifted = (((code - CODE_A_UPPER + shift) % ALPHABET_SIZE) + ALPHABET_SIZE) % ALPHABET_SIZE;
    return String.fromCharCode(CODE_A_UPPER + shifted);
  }

  if (code >= CODE_A_LOWER && code <= CODE_A_LOWER + 25) {
    const shifted = (((code - CODE_A_LOWER + shift) % ALPHABET_SIZE) + ALPHABET_SIZE) % ALPHABET_SIZE;
    return String.fromCharCode(CODE_A_LOWER + shifted);
  }

  return char;
}

export function caesarEncode(text: string, shift: number): string {
  return [...text].map((char) => shiftChar(char, shift)).join("");
}

export function caesarDecode(text: string, shift: number): string {
  return caesarEncode(text, -shift);
}

export interface CaesarStep {
  char: string;
  result: string;
  isAlpha: boolean;
}

export function caesarSteps(text: string, shift: number): CaesarStep[] {
  return [...text].map((char) => {
    const result = shiftChar(char, shift);
    return { char, result, isAlpha: /[a-zA-Z]/.test(char) };
  });
}
