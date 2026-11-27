import { describe, expect, it } from "vitest";
import { geometricDecode, geometricEncode, geometricGrid, type Route } from "./geometric";

describe("geometricGrid", () => {
  it("counts a character outside the BMP as one cell", () => {
    expect(geometricGrid("😀A", 2)).toEqual([["😀"], ["A"]]);
  });
});

describe("geometricEncode", () => {
  it("column route matches the scytale mechanism (write horizontal, read vertical)", () => {
    expect(geometricEncode("WEAREDISCOVERED", 3, "column")).toBe("WDVEIEASRRCEEOD");
  });

  it("diagonal route matches a hand-computed 3x3 example", () => {
    // A B C / D E F / G H I -> anti-diagonals: A | B D | C E G | F H | I
    expect(geometricEncode("ABCDEFGHI", 3, "diagonal")).toBe("ABDCEGFHI");
  });

  it("spiral route matches a hand-computed 3x3 example", () => {
    // A B C / D E F / G H I -> clockwise spiral from top-left
    expect(geometricEncode("ABCDEFGHI", 3, "spiral")).toBe("ABCFIHGDE");
  });
});

describe("geometricEncode / geometricDecode round-trip", () => {
  const routes: Route[] = ["column", "diagonal", "spiral"];
  const cases: Array<[string, number]> = [
    ["ATTACKATDAWN", 4],
    ["HELLOCLASSICALCIPHER", 5],
    ["A", 3],
    ["ABCDEFGHIJ", 3],
    ["ABCDEFGHIJKL", 4],
  ];

  for (const route of routes) {
    it.each(cases)(`round-trips %s with rows=%i on the ${route} route`, (text, rows) => {
      expect(geometricDecode(geometricEncode(text, rows, route), rows, route)).toBe(text);
    });
  }
});

describe("geometricEncode / geometricDecode with characters outside the BMP", () => {
  // 絵文字などはサロゲートペアで表されるため、UTF-16単位で読み出すと暗号文の中でペアが分断される
  const routes: Route[] = ["column", "diagonal", "spiral"];
  const cases: Array<[string, number]> = [
    ["A😀A", 2],
    ["ATTACK AT DAWN 😀 SEE YOU", 4],
    ["𠮷野家で🔑を受け取る", 3],
  ];

  for (const route of routes) {
    it.each(cases)(`keeps surrogate pairs intact for %s with rows=%i on the ${route} route`, (text, rows) => {
      const cipher = geometricEncode(text, rows, route);
      expect(cipher).not.toMatch(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/);
      expect([...cipher].sort()).toEqual([...text].sort());
      expect(geometricDecode(cipher, rows, route)).toBe(text);
    });
  }
});
