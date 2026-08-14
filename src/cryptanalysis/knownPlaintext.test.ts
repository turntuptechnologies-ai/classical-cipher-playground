import { describe, expect, it } from "vitest";
import { vigenereEncode } from "../ciphers/vigenere";
import { recoverKeyFragment, shortestRepeatingUnit } from "./knownPlaintext";

describe("recoverKeyFragment", () => {
  it("recovers the exact key when the guessed plaintext is correct", () => {
    const plaintext = "ATTACKATDAWN";
    const key = "LION";
    const cipher = vigenereEncode(plaintext, key);
    const result = recoverKeyFragment(cipher, plaintext);
    expect(result.valid).toBe(true);
    expect(result.keyFragment).toBe("LIONLIONLION");
  });

  it("reveals a wrong guess as a non-periodic fragment", () => {
    const cipher = vigenereEncode("ATTACKATDAWN", "LION");
    const result = recoverKeyFragment(cipher, "HELLOTHEREXX");
    expect(result.valid).toBe(true);
    expect(result.keyFragment).not.toBe("LIONLIONLION");
  });

  it("rejects mismatched fragment lengths", () => {
    const result = recoverKeyFragment("ABC", "AB");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/文字数/);
  });

  it("rejects empty input", () => {
    expect(recoverKeyFragment("", "ABC").valid).toBe(false);
    expect(recoverKeyFragment("ABC", "").valid).toBe(false);
  });

  it("ignores case and non-alphabetic characters", () => {
    const result = recoverKeyFragment("abc", "A,B.C");
    expect(result.valid).toBe(true);
  });
});

describe("shortestRepeatingUnit", () => {
  it("finds the minimal repeating unit", () => {
    expect(shortestRepeatingUnit("LIONLIONLION")).toBe("LION");
  });

  it("returns the whole string when there is no shorter repeat", () => {
    expect(shortestRepeatingUnit("ABCDE")).toBe("ABCDE");
  });

  it("handles a single repeated character", () => {
    expect(shortestRepeatingUnit("AAAA")).toBe("A");
  });
});
