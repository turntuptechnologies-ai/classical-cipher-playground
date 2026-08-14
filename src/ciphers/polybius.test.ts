import { describe, expect, it } from "vitest";
import { buildPolybiusSquare, polybiusDecode, polybiusEncode } from "./polybius";

describe("buildPolybiusSquare", () => {
  it("with no keyword, is the plain alphabet with I/J merged", () => {
    expect(buildPolybiusSquare("").join("")).toBe("ABCDEFGHIKLMNOPQRSTUVWXYZ");
  });

  it("dedupes the keyword and appends the remaining alphabet", () => {
    expect(buildPolybiusSquare("MONARCHY").join("")).toBe("MONARCHYBDEFGIKLPQSTUVWXZ");
  });
});

describe("polybiusEncode (no keyword)", () => {
  it("places A at 1-1 and Z at 5-5", () => {
    expect(polybiusEncode("A", "")).toBe("1-1");
    expect(polybiusEncode("Z", "")).toBe("5-5");
  });

  it("merges I and J onto the same coordinate", () => {
    expect(polybiusEncode("I", "")).toBe(polybiusEncode("J", ""));
    expect(polybiusEncode("I", "")).toBe("2-4");
  });

  it("skips whitespace and passes through other characters literally", () => {
    expect(polybiusEncode("HI THERE!", "")).toBe("2-3 2-4 4-4 2-3 1-5 4-2 1-5 !");
  });
});

describe("polybiusEncode / polybiusDecode round-trip", () => {
  it("round-trips the full alphabet (I/J merge is lossy, matching the Playfair page's convention)", () => {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    expect(polybiusDecode(polybiusEncode(alphabet, ""), "")).toBe(alphabet);
  });

  it("round-trips with a keyword", () => {
    const text = "HELLO WORLD";
    const cipher = polybiusEncode(text, "MONARCHY");
    expect(polybiusDecode(cipher, "MONARCHY")).toBe("HELLOWORLD");
  });
});
