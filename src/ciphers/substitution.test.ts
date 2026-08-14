import { describe, expect, it } from "vitest";
import { randomKey, substitutionDecode, substitutionEncode, validateKey } from "./substitution";

const KEY = "QWERTYUIOPASDFGHJKLZXCVBNM";

describe("substitutionEncode / substitutionDecode", () => {
  it("round-trips arbitrary text", () => {
    const original = "The Quick Brown Fox";
    expect(substitutionDecode(substitutionEncode(original, KEY), KEY)).toBe(original);
  });

  it("leaves non-alphabetic characters untouched", () => {
    expect(substitutionEncode("Hi! 123.", KEY)).toBe("Io! 123.");
  });
});

describe("validateKey", () => {
  it("accepts a valid 26-letter permutation", () => {
    expect(validateKey(KEY).valid).toBe(true);
  });

  it("rejects a key with the wrong length", () => {
    expect(validateKey("ABC").valid).toBe(false);
  });

  it("rejects a key with duplicate letters", () => {
    expect(validateKey("A".repeat(26)).valid).toBe(false);
  });
});

describe("randomKey", () => {
  it("always produces a valid permutation", () => {
    for (let i = 0; i < 20; i++) {
      expect(validateKey(randomKey()).valid).toBe(true);
    }
  });
});
