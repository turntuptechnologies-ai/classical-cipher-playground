export interface ColumnOrderResult {
  valid: boolean;
  order: number[];
  error: string | null;
}

// 「3,1,4,2」のような1始まりの列番号の並びを受け取り、decodeColumnsに渡せる
// 0始まりの並びに変換する。列数と個数が合わない/重複がある場合はエラーを返す。
export function parseColumnOrder(input: string, columns: number): ColumnOrderResult {
  const parts = input
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (parts.length !== columns) {
    return { valid: false, order: [], error: `列数（${columns}）と同じ個数の番号をカンマ区切りで入力してください` };
  }

  const numbers = parts.map(Number);
  if (numbers.some((n) => !Number.isInteger(n) || n < 1 || n > columns)) {
    return { valid: false, order: [], error: `1〜${columns}の数字で入力してください` };
  }

  if (new Set(numbers).size !== columns) {
    return { valid: false, order: [], error: "同じ番号を重複させずに、1回ずつ使ってください" };
  }

  return { valid: true, order: numbers.map((n) => n - 1), error: null };
}
