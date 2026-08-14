export type RotorId = "I" | "II" | "III" | "IV" | "V";

interface RotorSpec {
  wiring: string;
  notch: string;
}

// 史実のドイツ軍エニグマI(Wehrmacht Enigma)のローター配線とノッチ位置。
// ノッチは「このローターがこの文字の位置から次に進むとき、左隣のローターも一緒に進む」位置。
export const ROTOR_SPECS: Record<RotorId, RotorSpec> = {
  I: { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: "Q" },
  II: { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: "E" },
  III: { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: "V" },
  IV: { wiring: "ESOVPZJAYQUIRHXLNFTGKDCMWB", notch: "J" },
  V: { wiring: "VZBRGITYUPSDNHLXAWMJQOFECK", notch: "Z" },
};

export const ROTOR_IDS: RotorId[] = ["I", "II", "III", "IV", "V"];

// リフレクターB(Wide B) — 最も一般的に使われた反転配線板
export const REFLECTOR_B = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

export interface EnigmaSettings {
  rotorIds: [RotorId, RotorId, RotorId]; // 左・中央・右の順
  ringSettings: [number, number, number]; // 0-25 (A-Z)
  positions: [number, number, number]; // 0-25 (A-Z) 初期位置
}

interface RotorState {
  wiring: string;
  inverseWiring: string;
  notch: number;
  ring: number;
  pos: number;
}

function invertWiring(wiring: string): string {
  const inverse = new Array(26);
  for (let i = 0; i < 26; i++) {
    inverse[wiring.charCodeAt(i) - 65] = String.fromCharCode(65 + i);
  }
  return inverse.join("");
}

function buildRotorState(id: RotorId, ring: number, pos: number): RotorState {
  const spec = ROTOR_SPECS[id];
  return {
    wiring: spec.wiring,
    inverseWiring: invertWiring(spec.wiring),
    notch: spec.notch.charCodeAt(0) - 65,
    ring,
    pos,
  };
}

function stepRotor(r: RotorState): void {
  r.pos = (r.pos + 1) % 26;
}

// 「二重ステップ」を含む正しいステッピング機構。
// 中央ローターがノッチ位置にあるときは、中央・左が両方進む(右も毎回進む)。
function stepRotors(left: RotorState, middle: RotorState, right: RotorState): void {
  const middleAtNotch = middle.pos === middle.notch;
  const rightAtNotch = right.pos === right.notch;

  if (middleAtNotch) {
    stepRotor(middle);
    stepRotor(left);
    stepRotor(right);
  } else if (rightAtNotch) {
    stepRotor(middle);
    stepRotor(right);
  } else {
    stepRotor(right);
  }
}

function rotorForward(c: number, r: RotorState): number {
  const shifted = (c + r.pos - r.ring + 26) % 26;
  const wired = r.wiring.charCodeAt(shifted) - 65;
  return (wired - r.pos + r.ring + 260) % 26;
}

function rotorBackward(c: number, r: RotorState): number {
  const shifted = (c + r.pos - r.ring + 26) % 26;
  const wired = r.inverseWiring.charCodeAt(shifted) - 65;
  return (wired - r.pos + r.ring + 260) % 26;
}

function reflect(c: number): number {
  return REFLECTOR_B.charCodeAt(c) - 65;
}

export interface PlugboardValidation {
  valid: boolean;
  message: string;
}

function parsePlugboardPairs(pairs: string): string[] {
  return pairs
    .toUpperCase()
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function validatePlugboard(pairs: string): PlugboardValidation {
  const tokens = parsePlugboardPairs(pairs);
  const seen = new Set<string>();

  for (const token of tokens) {
    if (!/^[A-Z]{2}$/.test(token)) {
      return { valid: false, message: `"${token}" は2文字のアルファベットのペアで指定してください（例: AB）` };
    }
    if (token[0] === token[1]) {
      return { valid: false, message: `"${token}" は同じ文字同士のペアです` };
    }
    for (const char of token) {
      if (seen.has(char)) {
        return { valid: false, message: `文字 "${char}" が複数のペアで使われています` };
      }
      seen.add(char);
    }
  }

  if (tokens.length > 10) {
    return { valid: false, message: "プラグボードのペアは最大10組までです" };
  }

  return { valid: true, message: tokens.length === 0 ? "プラグボード配線なし" : `${tokens.length}組の配線` };
}

export function buildPlugboardMap(pairs: string): number[] {
  const map = Array.from({ length: 26 }, (_, i) => i);
  for (const token of parsePlugboardPairs(pairs)) {
    if (!/^[A-Z]{2}$/.test(token) || token[0] === token[1]) continue;
    const a = token.charCodeAt(0) - 65;
    const b = token.charCodeAt(1) - 65;
    map[a] = b;
    map[b] = a;
  }
  return map;
}

export function validateRotorSelection(rotorIds: [RotorId, RotorId, RotorId]): PlugboardValidation {
  const unique = new Set(rotorIds);
  if (unique.size !== 3) {
    return { valid: false, message: "3枚のローターにはそれぞれ異なる種類を選んでください" };
  }
  return { valid: true, message: "" };
}

export interface EnigmaStep {
  char: string;
  positions: string;
  result: string;
}

export interface EnigmaResult {
  output: string;
  steps: EnigmaStep[];
  finalPositions: [number, number, number];
}

export function enigmaProcess(text: string, settings: EnigmaSettings, plugboardPairs: string): EnigmaResult {
  const left = buildRotorState(settings.rotorIds[0], settings.ringSettings[0], settings.positions[0]);
  const middle = buildRotorState(settings.rotorIds[1], settings.ringSettings[1], settings.positions[1]);
  const right = buildRotorState(settings.rotorIds[2], settings.ringSettings[2], settings.positions[2]);
  const plugMap = buildPlugboardMap(plugboardPairs);

  const steps: EnigmaStep[] = [];
  let output = "";

  for (const rawChar of text) {
    const upper = rawChar.toUpperCase();
    if (!/^[A-Z]$/.test(upper)) {
      output += rawChar;
      continue;
    }

    stepRotors(left, middle, right);

    let c = upper.charCodeAt(0) - 65;
    c = plugMap[c];
    c = rotorForward(c, right);
    c = rotorForward(c, middle);
    c = rotorForward(c, left);
    c = reflect(c);
    c = rotorBackward(c, left);
    c = rotorBackward(c, middle);
    c = rotorBackward(c, right);
    c = plugMap[c];

    const resultChar = String.fromCharCode(65 + c);
    const positions = `${String.fromCharCode(65 + left.pos)}${String.fromCharCode(65 + middle.pos)}${String.fromCharCode(65 + right.pos)}`;
    steps.push({ char: upper, positions, result: resultChar });
    output += rawChar === upper ? resultChar : resultChar.toLowerCase();
  }

  return { output, steps, finalPositions: [left.pos, middle.pos, right.pos] };
}

// エニグマは可逆(自己反転)な暗号なので、同じ設定であれば暗号化と復号は同一の操作になる。
export function enigmaEncode(text: string, settings: EnigmaSettings, plugboardPairs: string): string {
  return enigmaProcess(text, settings, plugboardPairs).output;
}

export function enigmaDecode(text: string, settings: EnigmaSettings, plugboardPairs: string): string {
  return enigmaProcess(text, settings, plugboardPairs).output;
}

export function positionsToLetters(positions: [number, number, number]): string {
  return positions.map((p) => String.fromCharCode(65 + p)).join("");
}

export function letterToIndex(letter: string): number {
  return letter.toUpperCase().charCodeAt(0) - 65;
}

export const DEFAULT_SETTINGS: EnigmaSettings = {
  rotorIds: ["I", "II", "III"],
  ringSettings: [0, 0, 0],
  positions: [0, 0, 0],
};
