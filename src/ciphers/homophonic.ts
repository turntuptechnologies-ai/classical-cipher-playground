// ホモフォニック換字式暗号: 1文字を複数の「同音記号」(2桁のコード)に対応させることで、
// 暗号文中のコードの出現頻度を均一に近づけ、頻度分析を無効化する。各文字に割り当てる
// コードの個数は、英文での出現頻度に比例させる(頻度の高いE・T・Aほど多くのコードを持つ)。
// 00〜99の100個のコードをどの文字に割り振るかの「並び順」が鍵になる。
export { validateKey, randomKey, type KeyValidation } from "./substitution";
import { validateKey } from "./substitution";

// 英文における文字出現頻度の一般的な目安(%)
const FREQUENCY_PERCENT: Record<string, number> = {
  E: 12.7,
  T: 9.1,
  A: 8.2,
  O: 7.5,
  I: 7.0,
  N: 6.7,
  S: 6.3,
  H: 6.1,
  R: 6.0,
  D: 4.3,
  L: 4.0,
  C: 2.8,
  U: 2.8,
  M: 2.4,
  W: 2.4,
  F: 2.2,
  G: 2.0,
  Y: 2.0,
  P: 1.9,
  B: 1.5,
  V: 1.0,
  K: 0.8,
  J: 0.15,
  X: 0.15,
  Q: 0.1,
  Z: 0.07,
};

// 100個のコードを頻度に比例した個数だけ各文字に配分する(最低1個保証、合計が100になるよう
// 端数の大きい文字から優先的に繰り上げる)
export function computeQuotas(): Record<string, number> {
  const letters = Object.keys(FREQUENCY_PERCENT);
  const total = Object.values(FREQUENCY_PERCENT).reduce((sum, v) => sum + v, 0);
  const raw = letters.map((l) => (FREQUENCY_PERCENT[l] / total) * 100);
  const floors = raw.map((v) => Math.max(1, Math.floor(v)));

  let remainder = 100 - floors.reduce((sum, v) => sum + v, 0);
  const byFraction = letters
    .map((l, i) => ({ letter: l, fraction: raw[i] - Math.floor(raw[i]) }))
    .sort((a, b) => b.fraction - a.fraction);

  const quotas: Record<string, number> = {};
  letters.forEach((l, i) => {
    quotas[l] = floors[i];
  });
  for (let i = 0; remainder > 0 && i < byFraction.length; i++) {
    quotas[byFraction[i].letter] += 1;
    remainder--;
  }
  return quotas;
}

export interface CodeAssignment {
  letter: string;
  codes: string[];
}

// 鍵(26文字の並び)の順番どおりに、頻度に応じたコード数を先頭から割り当てていく。
// どの文字がどのコード範囲を持つかは鍵によって変わるが、コードの個数(割り当て枠)自体は
// 頻度によって決まっている固定値。
export function buildCodeTable(key: string): CodeAssignment[] {
  const quotas = computeQuotas();
  const normalizedKey = key.toUpperCase();
  let cursor = 0;

  return [...normalizedKey].map((letter) => {
    const quota = quotas[letter] ?? 0;
    const codes = Array.from({ length: quota }, () => {
      const code = String(cursor).padStart(2, "0");
      cursor++;
      return code;
    });
    return { letter, codes };
  });
}

function letterToCodesMap(table: CodeAssignment[]): Map<string, string[]> {
  return new Map(table.map((entry) => [entry.letter, entry.codes]));
}

function codeToLetterMap(table: CodeAssignment[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const entry of table) {
    for (const code of entry.codes) map.set(code, entry.letter);
  }
  return map;
}

export function homophonicEncode(text: string, key: string): string {
  if (!validateKey(key).valid) return "";
  const table = letterToCodesMap(buildCodeTable(key));

  const codes = [...text.toUpperCase()]
    .filter((char) => table.has(char))
    .map((char) => {
      const options = table.get(char)!;
      return options[Math.floor(Math.random() * options.length)];
    });

  return codes.join(" ");
}

export function homophonicDecode(text: string, key: string): string {
  if (!validateKey(key).valid) return "";
  const reverse = codeToLetterMap(buildCodeTable(key));

  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => reverse.get(token) ?? "")
    .join("");
}
