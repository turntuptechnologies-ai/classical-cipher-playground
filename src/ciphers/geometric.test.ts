import { describe, expect, it } from "vitest";
import { geometricDecode, geometricEncode, type Route } from "./geometric";

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
