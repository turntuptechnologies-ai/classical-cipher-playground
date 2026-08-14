import { describe, expect, it } from "vitest";
import { railFenceDecode, railFenceEncode } from "./railfence";

describe("railFenceEncode / railFenceDecode", () => {
  it.each([
    ["WEAREDISCOVEREDFLEEATONCE", 3],
    ["HELLOWORLD", 4],
    ["A", 5],
    ["THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG", 2],
  ] as const)("round-trips %s with %i rails", (text, rails) => {
    expect(railFenceDecode(railFenceEncode(text, rails), rails)).toBe(text);
  });

  it("matches the classic 3-rail example", () => {
    expect(railFenceEncode("WEAREDISCOVEREDFLEEATONCE", 3)).toBe("WECRLTEERDSOEEFEAOCAIVDEN");
  });
});
