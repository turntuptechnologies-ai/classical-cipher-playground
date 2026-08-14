const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export interface FrequencyEntry {
  letter: string;
  count: number;
  percent: number;
}

// 英文における文字出現頻度の一般的な目安（%）。標準的な頻度分析の教材で使われる値。
export const ENGLISH_REFERENCE_FREQUENCY: Record<string, number> = {
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

export const ENGLISH_REFERENCE_ENTRIES: FrequencyEntry[] = ALPHABET.split("").map((letter) => ({
  letter,
  count: 0,
  percent: ENGLISH_REFERENCE_FREQUENCY[letter],
}));

export function computeFrequency(text: string): FrequencyEntry[] {
  const counts = new Map<string, number>();
  let total = 0;

  for (const char of text.toUpperCase()) {
    if (!ALPHABET.includes(char)) continue;
    counts.set(char, (counts.get(char) ?? 0) + 1);
    total += 1;
  }

  return ALPHABET.split("").map((letter) => {
    const count = counts.get(letter) ?? 0;
    return { letter, count, percent: total === 0 ? 0 : (count / total) * 100 };
  });
}

export function sortByFrequencyDesc(entries: FrequencyEntry[]): FrequencyEntry[] {
  return [...entries].sort((a, b) => b.percent - a.percent || a.letter.localeCompare(b.letter));
}
