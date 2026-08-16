// ポルタ暗号: 鍵の1文字ごとに、A〜Mの前半とN〜Zの後半を入れ替える13種類の表を切り替える
// 多表式暗号。鍵文字はAB・CD・EF...YZという13組のペアのどちらかで表(行)を選ぶため、
// 例えば鍵がAでもBでも同じ表になる。各表は「2回かければ元に戻る」自己逆変換になっており、
// 暗号化と復号がまったく同じ操作という珍しい性質を持つ。

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CODE_A_UPPER = "A".charCodeAt(0);
const CODE_A_LOWER = "a".charCodeAt(0);

export function normalizeKey(key: string): string {
  return key.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

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

// 鍵文字1つから、どの表(0〜12)を使うかを求める。AB→0, CD→1, ..., YZ→12。
export function rowForKeyChar(keyChar: string): number {
  const idx = letterToIndex(keyChar.toUpperCase()) ?? 0;
  return Math.floor(idx / 2);
}

export function keyPairLabel(row: number): string {
  return ALPHABET[row * 2] + ALPHABET[row * 2 + 1];
}

function substituteAtRow(index: number, row: number): number {
  if (index < 13) return 13 + ((index + row) % 13);
  const q = index - 13;
  return ((((q - row) % 13) + 13) % 13);
}

// 13行×26列のポルタ方陣。row[r] は表r(鍵ペア keyPairLabel(r))での置き換え結果。
export function portaSquare(): string[][] {
  return Array.from({ length: 13 }, (_, row) =>
    Array.from({ length: 26 }, (_, index) => ALPHABET[substituteAtRow(index, row)]),
  );
}

// 暗号化と復号はまったく同じ操作(自己逆変換)なので、1つの関数で両方をまかなう。
export function portaTransform(text: string, key: string): string {
  const cleanKey = normalizeKey(key);
  if (cleanKey.length === 0) return text;

  let keyPos = 0;
  return [...text]
    .map((char) => {
      const idx = letterToIndex(char);
      if (idx === null) return char;

      const keyChar = cleanKey[keyPos % cleanKey.length];
      keyPos++;
      const row = rowForKeyChar(keyChar);
      const isUpperCase = char === char.toUpperCase();
      return indexToLetter(substituteAtRow(idx, row), isUpperCase);
    })
    .join("");
}

export function portaEncode(text: string, key: string): string {
  return portaTransform(text, key);
}

export function portaDecode(text: string, key: string): string {
  return portaTransform(text, key);
}

export function uniqueKeyRows(key: string): number[] {
  const cleanKey = normalizeKey(key);
  const seen = new Set<number>();
  const order: number[] = [];
  for (const char of cleanKey) {
    const row = rowForKeyChar(char);
    if (!seen.has(row)) {
      seen.add(row);
      order.push(row);
    }
  }
  return order;
}
