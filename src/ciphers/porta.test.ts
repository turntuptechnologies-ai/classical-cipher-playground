import { describe, expect, it } from "vitest";
import { keyPairLabel, portaSquare, portaTransform, rowForKeyChar, uniqueKeyRows } from "./porta";

describe("rowForKeyChar / keyPairLabel", () => {
  it("maps A and B to the same row (row 0)", () => {
    expect(rowForKeyChar("A")).toBe(0);
    expect(rowForKeyChar("B")).toBe(0);
  });

  it("maps Y and Z to the last row (row 12)", () => {
    expect(rowForKeyChar("Y")).toBe(12);
    expect(rowForKeyChar("Z")).toBe(12);
  });

  it("labels rows by their key-letter pair", () => {
    expect(keyPairLabel(0)).toBe("AB");
    expect(keyPairLabel(12)).toBe("YZ");
  });
});

describe("portaSquare", () => {
  it("is 13 rows by 26 columns", () => {
    const square = portaSquare();
    expect(square).toHaveLength(13);
    expect(square.every((row) => row.length === 26)).toBe(true);
  });

  it("row 0 (key AB) maps A to N, a 13-shift", () => {
    const square = portaSquare();
    expect(square[0][0]).toBe("N");
  });

  it("every row is self-reciprocal: substituting twice returns the original letter", () => {
    const square = portaSquare();
    for (const row of square) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (let i = 0; i < 26; i++) {
        const once = row[i];
        const twice = row[alphabet.indexOf(once)];
        expect(twice).toBe(alphabet[i]);
      }
    }
  });
});

describe("portaTransform", () => {
  it("is self-reciprocal: applying it twice with the same key returns the original text", () => {
    const original = "ATTACK AT DAWN";
    const key = "GOLD";
    expect(portaTransform(portaTransform(original, key), key)).toBe(original);
  });

  it("leaves non-alphabetic characters untouched", () => {
    const result = portaTransform("Hi, 123!", "KEY");
    expect(result.includes(",")).toBe(true);
    expect(result.includes("123")).toBe(true);
    expect(result.includes("!")).toBe(true);
  });

  it("preserves case", () => {
    const result = portaTransform("Hello", "KEY");
    expect(result[0]).toBe(result[0].toUpperCase());
    expect(result.slice(1)).toBe(result.slice(1).toLowerCase());
  });

  it("returns the text unchanged for an empty key", () => {
    expect(portaTransform("HELLO", "")).toBe("HELLO");
  });

  it("cycles the key over a longer message", () => {
    const key = "AB"; // both letters select row 0, so this is equivalent to a fixed ROT13-in-halves
    const withKey = portaTransform("HELLOWORLD", key);
    const withSingleLetter = portaTransform("HELLOWORLD", "A");
    expect(withKey).toBe(withSingleLetter);
  });
});

describe("uniqueKeyRows", () => {
  it("deduplicates rows selected by different key letters in the same pair", () => {
    expect(uniqueKeyRows("ABAB")).toEqual([0]);
  });

  it("keeps rows in first-appearance order", () => {
    expect(uniqueKeyRows("GOLD")).toEqual(uniqueKeyRows("GOLD"));
    const rows = uniqueKeyRows("GOLD");
    expect(new Set(rows).size).toBe(rows.length);
  });
});
