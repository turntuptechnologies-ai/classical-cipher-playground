import { describe, expect, it } from "vitest";
import { buildCodeTable, computeQuotas, homophonicDecode, homophonicEncode, randomKey } from "./homophonic";

const KEY = "QWERTYUIOPASDFGHJKLZXCVBNM";

describe("computeQuotas", () => {
  it("assigns a quota to all 26 letters that sums to exactly 100", () => {
    const quotas = computeQuotas();
    expect(Object.keys(quotas)).toHaveLength(26);
    expect(Object.values(quotas).reduce((a, b) => a + b, 0)).toBe(100);
  });

  it("gives every letter at least one code", () => {
    const quotas = computeQuotas();
    expect(Object.values(quotas).every((q) => q >= 1)).toBe(true);
  });

  it("gives a common letter like E more codes than a rare letter like Z", () => {
    const quotas = computeQuotas();
    expect(quotas.E).toBeGreaterThan(quotas.Z);
  });
});

describe("buildCodeTable", () => {
  it("assigns exactly the codes 00-99 across the alphabet with no overlap", () => {
    const table = buildCodeTable(KEY);
    const allCodes = table.flatMap((entry) => entry.codes);
    expect(allCodes).toHaveLength(100);
    expect(new Set(allCodes).size).toBe(100);
  });

  it("orders code assignment by the key's letter order", () => {
    const table = buildCodeTable(KEY);
    expect(table[0].letter).toBe("Q");
    expect(table[0].codes[0]).toBe("00");
  });
});

describe("homophonicEncode / homophonicDecode", () => {
  it("round-trips arbitrary text (encode is randomized, decode must still recover it)", () => {
    for (let i = 0; i < 20; i++) {
      const original = "THE QUICK BROWN FOX";
      const stripped = original.replace(/[^A-Z]/g, "");
      expect(homophonicDecode(homophonicEncode(original, KEY), KEY)).toBe(stripped);
    }
  });

  it("produces different ciphertext across encodes of the same message (homophones vary)", () => {
    const original = "AAAAAAAAAAAAAAAAAAAA";
    const outputs = new Set(Array.from({ length: 10 }, () => homophonicEncode(original, KEY)));
    expect(outputs.size).toBeGreaterThan(1);
  });

  it("returns an empty string for an invalid key", () => {
    expect(homophonicEncode("HELLO", "TOOSHORT")).toBe("");
    expect(homophonicDecode("00 01", "TOOSHORT")).toBe("");
  });

  it("ignores non-alphabetic characters when encoding", () => {
    const decoded = homophonicDecode(homophonicEncode("Hi, 123!", KEY), KEY);
    expect(decoded).toBe("HI");
  });
});

describe("randomKey", () => {
  it("always produces a key homophonicEncode can use", () => {
    for (let i = 0; i < 10; i++) {
      const key = randomKey();
      expect(() => homophonicEncode("TEST", key)).not.toThrow();
    }
  });
});
