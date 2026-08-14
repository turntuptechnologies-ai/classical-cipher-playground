const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export interface KeyRecoveryResult {
  valid: boolean;
  error: string | null;
  keyFragment: string;
  guessedKey: string;
}

// ヴィジュネル暗号は「暗号文 = 平文 + 鍵」(mod 26)で作られるため、平文の断片が分かれば
// その位置の鍵の文字は「暗号文 - 平文」でそのまま逆算できる（総当たりも頻度分析も不要）。
export function recoverKeyFragment(cipherFragment: string, plainFragment: string): KeyRecoveryResult {
  const cipher = cipherFragment.toUpperCase().replace(/[^A-Z]/g, "");
  const plain = plainFragment.toUpperCase().replace(/[^A-Z]/g, "");

  if (cipher.length === 0 || plain.length === 0) {
    return { valid: false, error: "暗号文の断片と、推測した平文の両方を入力してください", keyFragment: "", guessedKey: "" };
  }
  if (cipher.length !== plain.length) {
    return {
      valid: false,
      error: `文字数を揃えてください（暗号文${cipher.length}文字 / 平文${plain.length}文字）`,
      keyFragment: "",
      guessedKey: "",
    };
  }

  const keyFragment = [...cipher]
    .map((ch, i) => {
      const c = ALPHABET.indexOf(ch);
      const p = ALPHABET.indexOf(plain[i]);
      return ALPHABET[((c - p) % 26 + 26) % 26];
    })
    .join("");

  return { valid: true, error: null, keyFragment, guessedKey: shortestRepeatingUnit(keyFragment) };
}

// 復元できた鍵の断片が周期的に繰り返していれば、その最小の繰り返し単位が本当の鍵だと分かる。
export function shortestRepeatingUnit(fragment: string): string {
  for (let period = 1; period < fragment.length; period++) {
    if (fragment.length % period !== 0) continue;
    const unit = fragment.slice(0, period);
    const repeated = unit.repeat(fragment.length / period);
    if (repeated === fragment) return unit;
  }
  return fragment;
}
