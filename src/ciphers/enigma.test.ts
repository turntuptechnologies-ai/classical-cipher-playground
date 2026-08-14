import { describe, expect, it } from "vitest";
import {
  buildPlugboardMap,
  enigmaProcess,
  validatePlugboard,
  validateRotorSelection,
  type EnigmaSettings,
} from "./enigma";

const CANONICAL_SETTINGS: EnigmaSettings = {
  rotorIds: ["I", "II", "III"],
  ringSettings: [0, 0, 0],
  positions: [0, 0, 0],
};

describe("enigmaProcess", () => {
  it("matches the canonical AAAAA -> BDZGO test vector (rotors I,II,III, reflector B, AAA/AAA)", () => {
    expect(enigmaProcess("AAAAA", CANONICAL_SETTINGS, "").output).toBe("BDZGO");
  });

  it("is reciprocal: encoding the ciphertext with the same settings restores the plaintext", () => {
    const plain = "HELLOWORLD";
    const cipher = enigmaProcess(plain, CANONICAL_SETTINGS, "").output;
    expect(cipher).not.toBe(plain);
    expect(enigmaProcess(cipher, CANONICAL_SETTINGS, "").output).toBe(plain);
  });

  it("is reciprocal with non-default rotors, rings, positions, and a plugboard", () => {
    const settings: EnigmaSettings = {
      rotorIds: ["III", "I", "V"],
      ringSettings: [3, 17, 5],
      positions: [10, 2, 25],
    };
    const plugboard = "AB CD EF GH";
    const plain = "THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG";
    const cipher = enigmaProcess(plain, settings, plugboard).output;
    expect(enigmaProcess(cipher, settings, plugboard).output).toBe(plain);
  });

  it("passes non-alphabetic characters through without stepping the rotors", () => {
    const result = enigmaProcess("A A", CANONICAL_SETTINGS, "");
    expect(result.output[1]).toBe(" ");
    // 空白を挟んでも2文字目のAは、1文字目のAとは異なるローター位置で暗号化される
    expect(result.output[0]).not.toBe(result.output[2]);
  });

  it("reproduces the double-stepping anomaly", () => {
    // 右(III, notch V=21)をU(20)、中央(II, notch E=4)をD(3)に置く。
    // 3打鍵で中央は 3(不動) -> 4(右のnotch到達で連動) -> 5(中央自身がnotchで二重ステップ) と進む。
    const settings: EnigmaSettings = { rotorIds: ["I", "II", "III"], ringSettings: [0, 0, 0], positions: [0, 3, 20] };
    const { steps } = enigmaProcess("AAA", settings, "");
    const middlePositions = steps.map((s) => s.positions[1]);
    expect(middlePositions).toEqual(["D", "E", "F"]);
  });
});

describe("validateRotorSelection", () => {
  it("rejects duplicate rotors", () => {
    expect(validateRotorSelection(["I", "I", "III"]).valid).toBe(false);
  });

  it("accepts three distinct rotors", () => {
    expect(validateRotorSelection(["I", "II", "III"]).valid).toBe(true);
  });
});

describe("validatePlugboard / buildPlugboardMap", () => {
  it("accepts well-formed pairs", () => {
    expect(validatePlugboard("AB CD").valid).toBe(true);
  });

  it("rejects a letter used twice", () => {
    expect(validatePlugboard("AB AC").valid).toBe(false);
  });

  it("swaps letters symmetrically", () => {
    const map = buildPlugboardMap("AB CD");
    expect(map[0]).toBe(1); // A -> B
    expect(map[1]).toBe(0); // B -> A
    expect(map[25]).toBe(25); // Z untouched
  });
});
