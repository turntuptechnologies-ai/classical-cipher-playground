// スキュタレー暗号: 棒に紙を巻きつけて文字を書き、ほどいて送る古代スパルタの転置式暗号。
// 「面数」(1周で書き込める文字数)を行数として、平文を行優先で書き込み、列優先で読み出すと暗号文になる。
function buildFilledGrid(length: number, faces: number): boolean[][] {
  const cols = Math.ceil(length / faces);
  const filled: boolean[][] = Array.from({ length: faces }, () => new Array(cols).fill(false));
  for (let i = 0; i < length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    filled[row][col] = true;
  }
  return filled;
}

export function scytaleEncode(text: string, faces: number): string {
  if (faces < 2 || text.length === 0) return text;
  const chars = [...text];
  const cols = Math.ceil(chars.length / faces);
  const grid: (string | null)[][] = Array.from({ length: faces }, () => new Array(cols).fill(null));

  chars.forEach((char, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    grid[row][col] = char;
  });

  let output = "";
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < faces; row++) {
      if (grid[row][col] !== null) output += grid[row][col];
    }
  }
  return output;
}

export function scytaleDecode(text: string, faces: number): string {
  if (faces < 2 || text.length === 0) return text;
  // 絵文字などサロゲートペアの文字も1マスとして数える(暗号化側の[...text]とそろえる)
  const chars = [...text];
  const filled = buildFilledGrid(chars.length, faces);
  const cols = filled[0]?.length ?? 0;

  const grid: (string | null)[][] = Array.from({ length: faces }, () => new Array(cols).fill(null));
  let idx = 0;
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < faces; row++) {
      if (filled[row][col]) {
        grid[row][col] = chars[idx];
        idx++;
      }
    }
  }

  let output = "";
  for (let row = 0; row < faces; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] !== null) output += grid[row][col];
    }
  }
  return output;
}

export function scytaleGrid(text: string, faces: number): (string | null)[][] {
  const clampedFaces = Math.max(2, faces);
  const chars = [...text];
  const cols = Math.ceil(chars.length / clampedFaces) || 1;
  const grid: (string | null)[][] = Array.from({ length: clampedFaces }, () => new Array(cols).fill(null));

  chars.forEach((char, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    grid[row][col] = char;
  });

  return grid;
}
