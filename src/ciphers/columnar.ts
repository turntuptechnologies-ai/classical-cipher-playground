// 列転置式暗号: 平文を升目に行優先で書き込み、キーワードのアルファベット順で決まる
// 列の読み出し順に並べ替える転置式暗号。同じ文字が複数ある場合は左にあるものを先に読む。
// ADFGVX暗号の第2段階もこの仕組みを使っている。
export function transpositionOrder(keyword: string): number[] {
  const letters = [...keyword.toUpperCase().replace(/[^A-Z]/g, "")];
  return letters
    .map((ch, i) => ({ ch, i }))
    .sort((a, b) => (a.ch === b.ch ? a.i - b.i : a.ch < b.ch ? -1 : 1))
    .map((x) => x.i);
}

// キーワードの各列が読み出し順で何番目かを示す(1始まり)
export function transpositionRanks(keyword: string): number[] {
  const order = transpositionOrder(keyword);
  const ranks = new Array(order.length).fill(0);
  order.forEach((colIdx, rank) => {
    ranks[colIdx] = rank + 1;
  });
  return ranks;
}

export function columnarEncode(text: string, keyword: string): string {
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

// 列数と「読み出し順」を直接指定して復号する。キーワードを知らず、列数と並び順の
// 候補を試行錯誤する解読（アナグラム法）から呼べるように、キーワード解決とは切り離してある。
export function decodeColumns(text: string, cols: number, order: number[]): string {
  if (cols < 2 || text.length === 0) return text;
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

export function columnarDecode(text: string, keyword: string): string {
  const cols = keyword.replace(/[^A-Za-z]/g, "").length;
  if (cols < 2 || text.length === 0) return text;
  return decodeColumns(text, cols, transpositionOrder(keyword));
}

export function columnarGrid(text: string, keyword: string): (string | null)[][] {
  const cols = Math.max(1, keyword.replace(/[^A-Za-z]/g, "").length);
  const rows = Math.ceil(text.length / cols) || 1;
  const grid: (string | null)[][] = Array.from({ length: rows }, () => new Array(cols).fill(null));

  [...text].forEach((ch, i) => {
    grid[Math.floor(i / cols)][i % cols] = ch;
  });

  return grid;
}
