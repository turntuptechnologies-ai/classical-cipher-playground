import { describe, expect, it } from "vitest";
import { railFenceDecode, railFenceEncode, railFenceGrid } from "./railfence";

describe("railFenceGrid", () => {
  it("counts a character outside the BMP as one column", () => {
    expect(railFenceGrid("😀A", 2)).toEqual([
      ["😀", null],
      [null, "A"],
    ]);
  });
});

describe("railFenceEncode / railFenceDecode", () => {
  it.each([
    ["WEAREDISCOVEREDFLEEATONCE", 3],
    ["HELLOWORLD", 4],
    ["A", 5],
    ["THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG", 2],
  ] as const)("round-trips %s with %i rails", (text, rails) => {
    expect(railFenceDecode(railFenceEncode(text, rails), rails)).toBe(text);
  });

  // 絵文字などはサロゲートペアで表されるため、UTF-16単位で数えると段の長さが変わってしまう
  it.each([
    ["😀A", 2],
    ["ATTACK AT DAWN 😀 SEE YOU", 3],
    ["𠮷野家で🔑を受け取る", 4],
  ] as const)("round-trips %s with %i rails when it contains characters outside the BMP", (text, rails) => {
    const cipher = railFenceEncode(text, rails);
    expect(cipher).not.toMatch(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/);
    expect(railFenceDecode(cipher, rails)).toBe(text);
  });

  it("matches the classic 3-rail example", () => {
    expect(railFenceEncode("WEAREDISCOVEREDFLEEATONCE", 3)).toBe("WECRLTEERDSOEEFEAOCAIVDEN");
  });
});
