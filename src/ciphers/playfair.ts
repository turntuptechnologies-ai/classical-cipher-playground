// プレイフェア暗号: 1854年イギリスで考案されたダイグラム(2文字ペア)換字式暗号。
// I/Jを同一視した5×5の表を使い、2文字ずつを「同じ行」「同じ列」「長方形」の
// 3ルールで一度に置き換える。ボア戦争・第一次/第二次世界大戦で実際に使われた。
const ALPHABET_NO_J = "ABCDEFGHIKLMNOPQRSTUVWXYZ";

export function buildPlayfairGrid(keyword: string): string[] {
  const clean = keyword.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  const seen = new Set<string>();
  const letters: string[] = [];

  for (const ch of clean) {
    if (!seen.has(ch)) {
      seen.add(ch);
      letters.push(ch);
    }
  }
  for (const ch of ALPHABET_NO_J) {
    if (!seen.has(ch)) {
      seen.add(ch);
      letters.push(ch);
    }
  }
  return letters;
}

function gridPosition(grid: string[], letter: string): [number, number] {
  const idx = grid.indexOf(letter);
  return [Math.floor(idx / 5), idx % 5];
}

function chooseFiller(letter: string): string {
  return letter === "X" ? "Q" : "X";
}

export function normalizeForPlayfair(text: string): string {
  return text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
}

export function buildDigraphs(letters: string): string[] {
  const digraphs: string[] = [];
  let i = 0;
  while (i < letters.length) {
    const a = letters[i];
    const b = letters[i + 1];
    if (b === undefined) {
      digraphs.push(a + chooseFiller(a));
      i += 1;
    } else if (a === b) {
      digraphs.push(a + chooseFiller(a));
      i += 1;
    } else {
      digraphs.push(a + b);
      i += 2;
    }
  }
  return digraphs;
}

function encodePair(pair: string, grid: string[]): string {
  const [r1, c1] = gridPosition(grid, pair[0]);
  const [r2, c2] = gridPosition(grid, pair[1]);

  if (r1 === r2) {
    return grid[r1 * 5 + ((c1 + 1) % 5)] + grid[r2 * 5 + ((c2 + 1) % 5)];
  }
  if (c1 === c2) {
    return grid[((r1 + 1) % 5) * 5 + c1] + grid[((r2 + 1) % 5) * 5 + c2];
  }
  return grid[r1 * 5 + c2] + grid[r2 * 5 + c1];
}

function decodePair(pair: string, grid: string[]): string {
  const [r1, c1] = gridPosition(grid, pair[0]);
  const [r2, c2] = gridPosition(grid, pair[1]);

  if (r1 === r2) {
    return grid[r1 * 5 + ((c1 + 4) % 5)] + grid[r2 * 5 + ((c2 + 4) % 5)];
  }
  if (c1 === c2) {
    return grid[((r1 + 4) % 5) * 5 + c1] + grid[((r2 + 4) % 5) * 5 + c2];
  }
  return grid[r1 * 5 + c2] + grid[r2 * 5 + c1];
}

export function playfairEncode(text: string, keyword: string): string {
  const grid = buildPlayfairGrid(keyword);
  const letters = normalizeForPlayfair(text);
  if (letters.length === 0) return "";
  const digraphs = buildDigraphs(letters);
  return digraphs.map((pair) => encodePair(pair, grid)).join(" ");
}

export function playfairDecode(text: string, keyword: string): string {
  const grid = buildPlayfairGrid(keyword);
  const letters = normalizeForPlayfair(text);
  const digraphs: string[] = [];
  for (let i = 0; i < letters.length; i += 2) {
    const pair = letters.slice(i, i + 2);
    if (pair.length === 2) digraphs.push(pair);
  }
  return digraphs.map((pair) => decodePair(pair, grid)).join("");
}
