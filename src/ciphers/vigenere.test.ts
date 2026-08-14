import { describe, expect, it } from "vitest";
import { tabulaRecta, uniqueKeyLetters, vigenereDecode, vigenereEncode } from "./vigenere";

describe("vigenereEncode", () => {
  it("matches the textbook ATTACKATDAWN / LEMON example", () => {
    expect(vigenereEncode("ATTACKATDAWN", "LEMON")).toBe("LXFOPVEFRNHR");
  });

  it("preserves case", () => {
    expect(vigenereEncode("hello", "abc")).toBe(vigenereEncode("HELLO", "ABC").toLowerCase());
  });
});

describe("vigenereDecode", () => {
  it("round-trips with vigenereEncode", () => {
    const original = "Attack at Dawn!";
    expect(vigenereDecode(vigenereEncode(original, "Lemon"), "Lemon")).toBe(original);
  });
});

describe("tabulaRecta", () => {
  it("produces a 26x26 square consistent with vigenereEncode for every letter pair", () => {
    const square = tabulaRecta();
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (const keyChar of alphabet) {
      for (const plainChar of alphabet) {
        const row = keyChar.charCodeAt(0) - 65;
        const col = plainChar.charCodeAt(0) - 65;
        expect(square[row][col]).toBe(vigenereEncode(plainChar, keyChar));
      }
    }
  });
});

describe("uniqueKeyLetters", () => {
  it("returns unique letters in order of first appearance", () => {
    expect(uniqueKeyLetters("banana")).toEqual(["B", "A", "N"]);
  });
});
