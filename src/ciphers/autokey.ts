// オートキー暗号: ヴィジュネル暗号のように鍵で毎回ずらし幅を変えるが、短い「初期鍵」を
// 使い切ったあとは、平文自身を鍵の続きとして使う。鍵が周期的に繰り返さないため、
// カシスキー試験で鍵の長さを推測することができない(1586年にブレーズ・ド・ヴィジュネルが
// 発表したのは、実はこちらの仕組みだった)。
import { indexToLetter, letterToIndex, normalizeKey } from "./alphabet";

export { normalizeKey };

export interface AutokeyStep {
  char: string;
  keyChar: string | null;
  result: string;
  isAlpha: boolean;
}

function transform(text: string, primer: string, direction: 1 | -1): AutokeyStep[] {
  const keyQueue = [...normalizeKey(primer)];
  const steps: AutokeyStep[] = [];

  for (const char of text) {
    const index = letterToIndex(char);
    if (index === null || keyQueue.length === 0) {
      steps.push({ char, keyChar: null, result: char, isAlpha: false });
      continue;
    }

    const keyChar = keyQueue.shift()!;
    const keyIndex = letterToIndex(keyChar)!;
    const isUpperCase = char === char.toUpperCase();
    const result = indexToLetter(direction === 1 ? index + keyIndex : index - keyIndex, isUpperCase);
    steps.push({ char, keyChar, result, isAlpha: true });

    // 鍵ストリームの続きに積むのは常に「平文の文字」。暗号化なら入力そのもの、
    // 復号ならいま復元できた結果を使う。
    const plainLetterForKey = direction === 1 ? char.toUpperCase() : result.toUpperCase();
    keyQueue.push(plainLetterForKey);
  }

  return steps;
}

export function autokeyEncode(text: string, primer: string): string {
  if (normalizeKey(primer).length === 0) return text;
  return transform(text, primer, 1)
    .map((s) => s.result)
    .join("");
}

export function autokeyDecode(text: string, primer: string): string {
  if (normalizeKey(primer).length === 0) return text;
  return transform(text, primer, -1)
    .map((s) => s.result)
    .join("");
}

export function autokeySteps(text: string, primer: string, direction: 1 | -1 = 1): AutokeyStep[] {
  return transform(text, primer, direction);
}
