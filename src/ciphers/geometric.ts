// 図形転置式暗号: 升目に平文を横方向(行優先)で書き込み、指定したルートで読み出すことで並べ替える転置式暗号。
// キーワードは使わず、読み出しのルート自体が鍵になる(スキュタレー暗号は「列読み」の特殊ケース)。
export type Route = "column" | "diagonal" | "spiral";

export const ROUTE_LABEL: Record<Route, string> = {
  column: "列読み（縦方向）",
  diagonal: "斜め読み",
  spiral: "渦巻き読み",
};

type Cell = [number, number];

function columnOrder(rows: number, cols: number): Cell[] {
  const order: Cell[] = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) order.push([r, c]);
  }
  return order;
}

function diagonalOrder(rows: number, cols: number): Cell[] {
  const order: Cell[] = [];
  for (let d = 0; d < rows + cols - 1; d++) {
    for (let r = 0; r < rows; r++) {
      const c = d - r;
      if (c >= 0 && c < cols) order.push([r, c]);
    }
  }
  return order;
}

function spiralOrder(rows: number, cols: number): Cell[] {
  const order: Cell[] = [];
  let top = 0;
  let bottom = rows - 1;
  let left = 0;
  let right = cols - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) order.push([top, c]);
    top++;
    for (let r = top; r <= bottom; r++) order.push([r, right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) order.push([bottom, c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) order.push([r, left]);
      left++;
    }
  }
  return order;
}

function getRouteOrder(rows: number, cols: number, route: Route): Cell[] {
  if (route === "column") return columnOrder(rows, cols);
  if (route === "diagonal") return diagonalOrder(rows, cols);
  return spiralOrder(rows, cols);
}

function buildIndexGrid(n: number, rows: number, cols: number): (number | null)[][] {
  const grid: (number | null)[][] = Array.from({ length: rows }, () => new Array(cols).fill(null));
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    grid[r][c] = i;
  }
  return grid;
}

export function geometricEncode(text: string, rows: number, route: Route): string {
  if (rows < 2 || text.length === 0) return text;
  const cols = Math.ceil(text.length / rows);
  const grid = buildIndexGrid(text.length, rows, cols);
  const order = getRouteOrder(rows, cols, route);

  let output = "";
  for (const [r, c] of order) {
    const idx = grid[r][c];
    if (idx !== null) output += text[idx];
  }
  return output;
}

export function geometricDecode(text: string, rows: number, route: Route): string {
  if (rows < 2 || text.length === 0) return text;
  const n = text.length;
  const cols = Math.ceil(n / rows);
  const grid = buildIndexGrid(n, rows, cols);
  const order = getRouteOrder(rows, cols, route);

  const result: string[] = new Array(n).fill("");
  let k = 0;
  for (const [r, c] of order) {
    const idx = grid[r][c];
    if (idx !== null) {
      result[idx] = text[k];
      k++;
    }
  }
  return result.join("");
}

export function geometricGrid(text: string, rows: number): (string | null)[][] {
  const clampedRows = Math.max(2, rows);
  const cols = Math.ceil(text.length / clampedRows) || 1;
  const grid: (string | null)[][] = Array.from({ length: clampedRows }, () => new Array(cols).fill(null));

  [...text].forEach((char, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    grid[r][c] = char;
  });

  return grid;
}

// 読み出し順を可視化するための、各マスに訪問順の番号を振ったグリッド(1始まり)
export function routeOrderGrid(rows: number, cols: number, route: Route): number[][] {
  const clampedRows = Math.max(2, rows);
  const clampedCols = Math.max(1, cols);
  const order = getRouteOrder(clampedRows, clampedCols, route);
  const grid: number[][] = Array.from({ length: clampedRows }, () => new Array(clampedCols).fill(0));
  order.forEach(([r, c], i) => {
    grid[r][c] = i + 1;
  });
  return grid;
}
