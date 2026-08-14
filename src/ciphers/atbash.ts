// アトバシュ暗号: アルファベットを反転させるだけの固定的な換字式暗号(A↔Z, B↔Yのように)。
// 鍵が存在せず、暗号化と復号はまったく同じ操作になる(自己逆変換)。
const CODE_A_UPPER = "A".charCodeAt(0);
const CODE_A_LOWER = "a".charCodeAt(0);

function reverseChar(char: string): string {
  const code = char.charCodeAt(0);

  if (code >= CODE_A_UPPER && code <= CODE_A_UPPER + 25) {
    return String.fromCharCode(CODE_A_UPPER + (25 - (code - CODE_A_UPPER)));
  }
  if (code >= CODE_A_LOWER && code <= CODE_A_LOWER + 25) {
    return String.fromCharCode(CODE_A_LOWER + (25 - (code - CODE_A_LOWER)));
  }
  return char;
}

export function atbashTransform(text: string): string {
  return [...text].map(reverseChar).join("");
}

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const REVERSED_ALPHABET = atbashTransform(ALPHABET);
