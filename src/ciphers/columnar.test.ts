import { describe, expect, it } from "vitest";
import { columnarDecode, columnarEncode, columnarGrid, transpositionOrder, transpositionRanks } from "./columnar";

describe("transpositionOrder / transpositionRanks", () => {
  it("orders columns alphabetically by keyword letter (PRIVACY -> A C I P R V Y)", () => {
    // PRIVACY: P(0) R(1) I(2) V(3) A(4) C(5) Y(6)
    // alphabetical: A(4) C(5) I(2) P(0) R(1) V(3) Y(6)
    expect(transpositionOrder("PRIVACY")).toEqual([4, 5, 2, 0, 1, 3, 6]);
  });

  it("breaks ties between repeated letters by leftmost position first", () => {
    // AABC: both A's tie -> leftmost(index0) read before index1
    expect(transpositionOrder("AABC")).toEqual([0, 1, 2, 3]);
  });

  it("ranks are the inverse of the read order (1-indexed)", () => {
    expect(transpositionRanks("PRIVACY")).toEqual([4, 5, 3, 6, 1, 2, 7]);
  });
});

describe("columnarEncode", () => {
  it("matches the Wikipedia ADFGVX worked example's transposition stage", () => {
    // Wikipedia's fractionated intermediate text for "attack at 1200am" with a known square,
    // transposed with keyword PRIVACY, yields this exact ciphertext.
    const fractionated = "ADDDDDADAGVGADDDAFDGVFVFADDX";
    expect(columnarEncode(fractionated, "PRIVACY")).toBe("DGDDDAGDDGAFADDFDADVDVFAADVX");
  });

  it("returns the text unchanged for a 1-letter (or empty) keyword", () => {
    expect(columnarEncode("HELLO", "A")).toBe("HELLO");
    expect(columnarEncode("HELLO", "")).toBe("HELLO");
  });
});

describe("columnarEncode / columnarDecode round-trip", () => {
  it.each([
    ["ATTACKATDAWN", "SECRET"],
    ["THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG", "KEYWORD"],
    ["A", "AB"],
    ["HELLOWORLD", "ZEBRA"],
  ] as const)("round-trips %s with keyword %s", (text, keyword) => {
    expect(columnarDecode(columnarEncode(text, keyword), keyword)).toBe(text);
  });
});

describe("columnarGrid", () => {
  it("writes text row-major into a grid sized by the keyword length", () => {
    expect(columnarGrid("HELLOWORLD", "ABC")).toEqual([
      ["H", "E", "L"],
      ["L", "O", "W"],
      ["O", "R", "L"],
      ["D", null, null],
    ]);
  });
});
