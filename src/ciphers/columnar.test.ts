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

describe("columnarEncode / columnarDecode with characters outside the BMP", () => {
  // 絵文字などはサロゲートペアで表されるため、UTF-16単位で数えると升目の形が変わってしまう
  const LONE_SURROGATE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;

  it.each([
    ["😀", "DA"],
    ["ATTACK AT DAWN 😀 SEE YOU", "SECRET"],
    ["𠮷野家で🔑を受け取る", "KEYWORD"],
  ] as const)("round-trips %s with keyword %s", (text, keyword) => {
    const cipher = columnarEncode(text, keyword);
    expect(cipher).not.toMatch(LONE_SURROGATE);
    expect(columnarDecode(cipher, keyword)).toBe(text);
  });
});

describe("keywords containing letters that change length when uppercased", () => {
  // ßは大文字化するとSSになる。列数と読み出し順を同じ正規化から作らないと、存在しない列を読みにいく
  const sorted = (s: string) => [...s].sort().join("");

  it("treats ß as SS (Straße -> STRASSE, 7 columns)", () => {
    const cipher = columnarEncode("ATTACKATDAWN", "Straße");
    expect(cipher).not.toContain("undefined");
    expect(sorted(cipher)).toBe(sorted("ATTACKATDAWN"));
    expect(cipher).toBe(columnarEncode("ATTACKATDAWN", "STRASSE"));
    expect(columnarDecode(cipher, "Straße")).toBe("ATTACKATDAWN");
  });

  // 大文字化で文字数か文字の種類が変わり、列数と読み出し順の長さがずれていた17文字
  it.each([..."ßıŉſǰẖẗẘẙẚﬀﬁﬂﬃﬄﬅﬆ"])("round-trips with %s in the keyword", (ch) => {
    const keyword = `KEY${ch}WORD`;
    const cipher = columnarEncode("THEQUICKBROWNFOX", keyword);
    expect(sorted(cipher)).toBe(sorted("THEQUICKBROWNFOX"));
    expect(columnarDecode(cipher, keyword)).toBe("THEQUICKBROWNFOX");
  });

  it("sizes the grid by the same letters the page displays as column headers", () => {
    // ColumnarPage は toUpperCase() してから A-Z を残した文字を列の見出しにしている
    expect(columnarGrid("ABCDEFG", "Straße")[0]).toHaveLength(7);
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

  it("counts a character outside the BMP as one cell", () => {
    expect(columnarGrid("😀AB", "ABC")).toEqual([["😀", "A", "B"]]);
  });
});
