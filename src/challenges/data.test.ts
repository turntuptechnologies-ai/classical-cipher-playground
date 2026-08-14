import { describe, expect, it } from "vitest";
import { adfgvxDecode } from "../ciphers/adfgvx";
import { atbashTransform } from "../ciphers/atbash";
import { caesarDecode } from "../ciphers/caesar";
import { enigmaProcess, type EnigmaSettings } from "../ciphers/enigma";
import { columnarDecode } from "../ciphers/columnar";
import { geometricDecode } from "../ciphers/geometric";
import { pigpenDecode } from "../ciphers/pigpen";
import { playfairDecode } from "../ciphers/playfair";
import { polybiusDecode } from "../ciphers/polybius";
import { railFenceDecode } from "../ciphers/railfence";
import { scytaleDecode } from "../ciphers/scytale";
import { substitutionDecode } from "../ciphers/substitution";
import { uesugiDecode } from "../ciphers/uesugi";
import { vigenereDecode } from "../ciphers/vigenere";
import { CHALLENGES, isCorrectAnswer, normalizeAnswer } from "./data";

describe("challenge ciphertexts decode to their stated answer with the hinted parameters", () => {
  it("caesar-1 (shift 7, matches the hint)", () => {
    const c = CHALLENGES.find((x) => x.id === "caesar-1")!;
    expect(caesarDecode(c.ciphertext, 7)).toBe(c.answer);
  });

  it("railfence-1 (4 rails, matches the hint)", () => {
    const c = CHALLENGES.find((x) => x.id === "railfence-1")!;
    expect(railFenceDecode(c.ciphertext, 4)).toBe(c.answer);
  });

  it("uesugi-1 (no key needed)", () => {
    const c = CHALLENGES.find((x) => x.id === "uesugi-1")!;
    expect(uesugiDecode(c.ciphertext)).toBe(c.answer);
  });

  it("substitution-1 (key from the hint)", () => {
    const c = CHALLENGES.find((x) => x.id === "substitution-1")!;
    expect(substitutionDecode(c.ciphertext, "QWERTYUIOPASDFGHJKLZXCVBNM")).toBe(c.answer);
  });

  it("vigenere-1 (key GOLD from the hint)", () => {
    const c = CHALLENGES.find((x) => x.id === "vigenere-1")!;
    expect(vigenereDecode(c.ciphertext, "GOLD")).toBe(c.answer);
  });

  it("atbash-1 (no key needed, self-reciprocal)", () => {
    const c = CHALLENGES.find((x) => x.id === "atbash-1")!;
    expect(atbashTransform(c.ciphertext)).toBe(c.answer);
  });

  it("scytale-1 (4 faces, matches the hint)", () => {
    const c = CHALLENGES.find((x) => x.id === "scytale-1")!;
    expect(scytaleDecode(c.ciphertext, 4)).toBe(c.answer);
  });

  it("geometric-1 (4 rows, spiral route, matches the hint)", () => {
    const c = CHALLENGES.find((x) => x.id === "geometric-1")!;
    expect(geometricDecode(c.ciphertext, 4, "spiral")).toBe(c.answer);
  });

  it("pigpen-1 (coordinate notation, no key needed)", () => {
    const c = CHALLENGES.find((x) => x.id === "pigpen-1")!;
    expect(pigpenDecode(c.ciphertext)).toBe(c.answer);
  });

  it("polybius-1 (key GREECE from the hint)", () => {
    const c = CHALLENGES.find((x) => x.id === "polybius-1")!;
    expect(polybiusDecode(c.ciphertext, "GREECE")).toBe(normalizeAnswer(c.answer));
  });

  it("columnar-1 (key SHIELD from the hint)", () => {
    const c = CHALLENGES.find((x) => x.id === "columnar-1")!;
    expect(columnarDecode(c.ciphertext, "SHIELD")).toBe(normalizeAnswer(c.answer));
  });

  it("playfair-1 (key SECRET from the hint; decode reconstructs the answer plus a trailing filler X)", () => {
    const c = CHALLENGES.find((x) => x.id === "playfair-1")!;
    // Playfair pads an odd-length message with a trailing filler, so the raw decode
    // output is the normalized answer with an extra "X" appended.
    expect(playfairDecode(c.ciphertext, "SECRET")).toBe(`${normalizeAnswer(c.answer)}X`);
  });

  it("adfgvx-1 (both keys from the hint)", () => {
    const c = CHALLENGES.find((x) => x.id === "adfgvx-1")!;
    expect(adfgvxDecode(c.ciphertext, "OFFENSIVE", "PARIS")).toBe(normalizeAnswer(c.answer));
  });

  it("enigma-1 (settings from the hint)", () => {
    const c = CHALLENGES.find((x) => x.id === "enigma-1")!;
    const settings: EnigmaSettings = {
      rotorIds: ["II", "IV", "V"],
      ringSettings: [1, 5, 3], // B, F, D
      positions: [23, 24, 25], // X, Y, Z
    };
    expect(enigmaProcess(c.ciphertext, settings, "QW ER TY").output).toBe(c.answer);
  });

  it("every challenge has at least one hint and a non-empty answer", () => {
    for (const c of CHALLENGES) {
      expect(c.hints.length).toBeGreaterThan(0);
      expect(c.answer.length).toBeGreaterThan(0);
      expect(c.ciphertext.length).toBeGreaterThan(0);
    }
  });

  it("challenge ids are unique", () => {
    const ids = CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("isCorrectAnswer", () => {
  const challenge = CHALLENGES[0];

  it("accepts the exact answer", () => {
    expect(isCorrectAnswer(challenge, challenge.answer)).toBe(true);
  });

  it("is case-insensitive and ignores spacing", () => {
    expect(isCorrectAnswer(challenge, challenge.answer.toLowerCase().split(" ").join("  "))).toBe(true);
  });

  it("rejects an empty guess", () => {
    expect(isCorrectAnswer(challenge, "   ")).toBe(false);
  });

  it("rejects a wrong guess", () => {
    expect(isCorrectAnswer(challenge, "totally wrong")).toBe(false);
  });
});

describe("normalizeAnswer", () => {
  it("keeps kana and kanji", () => {
    expect(normalizeAnswer("のろし！")).toBe("のろし");
  });
});
