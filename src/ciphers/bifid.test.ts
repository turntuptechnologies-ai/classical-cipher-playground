import { describe, expect, it } from "vitest";
import { bifidDecode, bifidEncode, bifidEncodeDetailed } from "./bifid";

describe("bifidEncode / bifidDecode", () => {
  it("round-trips arbitrary text with a keyword", () => {
    const original = "FLEEATONCE";
    const keyword = "GERMAN";
    expect(bifidDecode(bifidEncode(original, keyword), keyword)).toBe(original);
  });

  it("round-trips with no keyword (plain alphabet square)", () => {
    const original = "ATTACKATDAWN";
    expect(bifidDecode(bifidEncode(original, ""), "")).toBe(original);
  });

  it("treats J as I, matching the Polybius square convention", () => {
    expect(bifidEncode("JELLY", "")).toBe(bifidEncode("IELLY", ""));
  });

  it("strips non-alphabetic characters and spaces", () => {
    const cipher = bifidEncode("Attack, at dawn!", "SECRET");
    expect(bifidDecode(cipher, "SECRET")).toBe("ATTACKATDAWN");
  });

  it("changes the ciphertext when the keyword changes", () => {
    const a = bifidEncode("ATTACKATDAWN", "ALPHA");
    const b = bifidEncode("ATTACKATDAWN", "BRAVO");
    expect(a).not.toBe(b);
  });

  it("returns an empty string for input with no alphabetic characters", () => {
    expect(bifidEncode("123!!", "KEY")).toBe("");
    expect(bifidDecode("", "KEY")).toBe("");
  });
});

describe("bifidEncodeDetailed", () => {
  it("produces one row/col step per plaintext letter", () => {
    const detail = bifidEncodeDetailed("FLEE", "");
    expect(detail.steps).toHaveLength(4);
    expect(detail.regroupedRows).toHaveLength(4);
    expect(detail.regroupedCols).toHaveLength(4);
  });

  it("regroups rows-then-cols into new coordinate pairs that reproduce the ciphertext", () => {
    const detail = bifidEncodeDetailed("FLEEATONCE", "");
    const combined = [...detail.regroupedRows, ...detail.regroupedCols];
    const square = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // plain alphabet square (no keyword)
    const rebuilt = detail.steps
      .map((_, i) => {
        const row = combined[i * 2];
        const col = combined[i * 2 + 1];
        return square[row * 5 + col];
      })
      .join("");
    expect(rebuilt).toBe(detail.ciphertext);
  });
});
