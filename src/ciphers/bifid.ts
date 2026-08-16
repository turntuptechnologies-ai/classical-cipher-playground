// バイフィッド暗号: ポリュビオス方陣(5×5、I/Jは同一マス)で各文字を「行・列」の座標に分解し、
// 行の並びと列の並びをいったんバラバラにしてから読み直す(＝分別・fractionation)ことで、
// 文字どうしの座標を混ぜ合わせる換字式暗号。1901年、フランスのフェリックス・ドラステルが考案。
import { buildPolybiusSquare } from "./polybius";

export { buildPolybiusSquare };

function squareCoords(square: string[], letter: string): { row: number; col: number } | null {
  const idx = square.indexOf(letter);
  if (idx === -1) return null;
  return { row: Math.floor(idx / 5), col: idx % 5 };
}

function cleanLetters(text: string): string[] {
  return [...text.toUpperCase()]
    .map((ch) => (ch === "J" ? "I" : ch))
    .filter((ch) => ch >= "A" && ch <= "Z");
}

export interface BifidStep {
  letter: string;
  row: number;
  col: number;
}

export interface BifidResult {
  steps: BifidStep[];
  regroupedRows: number[];
  regroupedCols: number[];
  ciphertext: string;
}

// 平文の各文字を座標に分解し、「行の並び→列の並び」の順に読み直して新しいペアを作る過程を
// すべて返す。暗号化過程の可視化にも使う。
export function bifidEncodeDetailed(text: string, keyword: string): BifidResult {
  const square = buildPolybiusSquare(keyword);
  const letters = cleanLetters(text);

  const steps: BifidStep[] = [];
  const rows: number[] = [];
  const cols: number[] = [];
  for (const letter of letters) {
    const coords = squareCoords(square, letter);
    if (!coords) continue;
    steps.push({ letter, row: coords.row, col: coords.col });
    rows.push(coords.row);
    cols.push(coords.col);
  }

  const combined = [...rows, ...cols];
  const cipherLetters: string[] = [];
  for (let i = 0; i < steps.length; i++) {
    const row = combined[i * 2];
    const col = combined[i * 2 + 1];
    cipherLetters.push(square[row * 5 + col]);
  }

  return { steps, regroupedRows: rows, regroupedCols: cols, ciphertext: cipherLetters.join("") };
}

export function bifidEncode(text: string, keyword: string): string {
  return bifidEncodeDetailed(text, keyword).ciphertext;
}

export function bifidDecode(text: string, keyword: string): string {
  const square = buildPolybiusSquare(keyword);
  const letters = cleanLetters(text);

  const flat: number[] = [];
  for (const letter of letters) {
    const coords = squareCoords(square, letter);
    if (!coords) continue;
    flat.push(coords.row, coords.col);
  }

  const n = letters.length;
  const rows = flat.slice(0, n);
  const cols = flat.slice(n);

  return rows.map((row, i) => square[row * 5 + cols[i]]).join("");
}
