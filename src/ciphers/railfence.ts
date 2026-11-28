function railPattern(length: number, rails: number): number[] {
  const pattern: number[] = [];
  let rail = 0;
  let direction = 1;

  for (let i = 0; i < length; i++) {
    pattern.push(rail);
    if (rails > 1) {
      if (rail === 0) direction = 1;
      else if (rail === rails - 1) direction = -1;
      rail += direction;
    }
  }

  return pattern;
}

export function railFenceEncode(text: string, rails: number): string {
  if (rails < 2) return text;

  const chars = [...text];
  const pattern = railPattern(chars.length, rails);
  const rows: string[] = Array.from({ length: rails }, () => "");

  chars.forEach((char, i) => {
    rows[pattern[i]] += char;
  });

  return rows.join("");
}

export function railFenceDecode(text: string, rails: number): string {
  if (rails < 2) return text;

  // 絵文字などサロゲートペアの文字も1文字として数える(暗号化側の[...text]とそろえる)
  const chars = [...text];
  const pattern = railPattern(chars.length, rails);
  const rowLengths = Array.from({ length: rails }, (_, r) => pattern.filter((p) => p === r).length);

  let pos = 0;
  const rows: string[][] = rowLengths.map((len) => {
    const chunk = chars.slice(pos, pos + len);
    pos += len;
    return chunk;
  });

  const rowPointers = new Array(rails).fill(0);
  return pattern
    .map((r) => {
      const char = rows[r][rowPointers[r]];
      rowPointers[r] += 1;
      return char;
    })
    .join("");
}

export function railFenceGrid(text: string, rails: number): (string | null)[][] {
  const clampedRails = Math.max(2, rails);
  const chars = [...text];
  const pattern = railPattern(chars.length, clampedRails);
  const grid: (string | null)[][] = Array.from({ length: clampedRails }, () => new Array(chars.length).fill(null));

  chars.forEach((char, col) => {
    grid[pattern[col]][col] = char;
  });

  return grid;
}
