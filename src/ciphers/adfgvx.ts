// ADFGVX暗号: 第一次世界大戦でドイツ軍が使用した2段階暗号。
// 1) 36文字(A-Z・0-9)を6×6のポリュビオス方陣に配置し、各文字をADFGVXの2文字座標に変換(分数化)
// 2) その結果を、転置鍵(キーワード)のアルファベット順で列を並べ替える鍵付き列転置にかける
// ADFGVXの6文字はモールス信号で聞き間違えにくいという理由で選ばれた。
const SQUARE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const LABELS = ["A", "D", "F", "G", "V", "X"];

export function buildAdfgvxSquare(keyword: string): string[] {
  const clean = keyword.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const seen = new Set<string>();
  const chars: string[] = [];

  for (const ch of clean) {
    if (!seen.has(ch)) {
      seen.add(ch);
      chars.push(ch);
    }
  }
  for (const ch of SQUARE_ALPHABET) {
    if (!seen.has(ch)) {
      seen.add(ch);
      chars.push(ch);
    }
  }
  return chars;
}

function squarePosition(square: string[], ch: string): [number, number] | null {
  const idx = square.indexOf(ch);
  if (idx === -1) return null;
  return [Math.floor(idx / 6), idx % 6];
}

export function fractionate(text: string, square: string[]): string {
  const clean = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
  let out = "";
  for (const ch of clean) {
    const pos = squarePosition(square, ch);
    if (!pos) continue;
    out += LABELS[pos[0]] + LABELS[pos[1]];
  }
  return out;
}

function defractionate(adfgvxText: string, square: string[]): string {
  let out = "";
  for (let i = 0; i + 1 < adfgvxText.length; i += 2) {
    const r = LABELS.indexOf(adfgvxText[i]);
    const c = LABELS.indexOf(adfgvxText[i + 1]);
    if (r === -1 || c === -1) continue;
    out += square[r * 6 + c];
  }
  return out;
}

function transpositionOrder(keyword: string): number[] {
  const letters = [...keyword.toUpperCase().replace(/[^A-Z]/g, "")];
  return letters
    .map((ch, i) => ({ ch, i }))
    .sort((a, b) => (a.ch === b.ch ? a.i - b.i : a.ch < b.ch ? -1 : 1))
    .map((x) => x.i);
}

function columnarEncode(text: string, keyword: string): string {
  const cols = keyword.replace(/[^A-Za-z]/g, "").length;
  if (cols < 2 || text.length === 0) return text;
  const order = transpositionOrder(keyword);
  const rows = Math.ceil(text.length / cols);
  const grid: (string | null)[][] = Array.from({ length: rows }, () => new Array(cols).fill(null));

  [...text].forEach((ch, i) => {
    grid[Math.floor(i / cols)][i % cols] = ch;
  });

  let out = "";
  for (const colIdx of order) {
    for (let r = 0; r < rows; r++) {
      if (grid[r][colIdx] !== null) out += grid[r][colIdx];
    }
  }
  return out;
}

function columnarDecode(text: string, keyword: string): string {
  const cols = keyword.replace(/[^A-Za-z]/g, "").length;
  if (cols < 2 || text.length === 0) return text;
  const order = transpositionOrder(keyword);
  const n = text.length;
  const rows = Math.ceil(n / cols);

  const filled: boolean[][] = Array.from({ length: rows }, () => new Array(cols).fill(false));
  for (let i = 0; i < n; i++) {
    filled[Math.floor(i / cols)][i % cols] = true;
  }

  const grid: (string | null)[][] = Array.from({ length: rows }, () => new Array(cols).fill(null));
  let idx = 0;
  for (const colIdx of order) {
    for (let r = 0; r < rows; r++) {
      if (filled[r][colIdx]) {
        grid[r][colIdx] = text[idx];
        idx++;
      }
    }
  }

  let out = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== null) out += grid[r][c];
    }
  }
  return out;
}

export function adfgvxEncode(text: string, squareKey: string, transKey: string): string {
  const square = buildAdfgvxSquare(squareKey);
  const fractionated = fractionate(text, square);
  return columnarEncode(fractionated, transKey);
}

export function adfgvxDecode(text: string, squareKey: string, transKey: string): string {
  const square = buildAdfgvxSquare(squareKey);
  const clean = text.toUpperCase().replace(/[^ADFGVX]/g, "");
  const fractionated = columnarDecode(clean, transKey);
  return defractionate(fractionated, square);
}

export function adfgvxEncodeSteps(text: string, squareKey: string, transKey: string) {
  const square = buildAdfgvxSquare(squareKey);
  const fractionated = fractionate(text, square);
  const ciphertext = columnarEncode(fractionated, transKey);
  return { square, fractionated, ciphertext };
}
