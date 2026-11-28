import { describe, expect, it } from "vitest";
import { scytaleDecode, scytaleEncode, scytaleGrid } from "./scytale";

describe("scytaleGrid", () => {
  it("counts a character outside the BMP as one cell", () => {
    expect(scytaleGrid("😀A", 2)).toEqual([["😀"], ["A"]]);
  });
});

describe("scytaleEncode", () => {
  it("matches a hand-computed example (faces=3, evenly divisible)", () => {
    expect(scytaleEncode("WEAREDISCOVERED", 3)).toBe("WDVEIEASRRCEEOD");
  });
});

describe("scytaleEncode / scytaleDecode", () => {
  it.each([
    ["ATTACKATDAWN", 4],
    ["HELLOCLASSICALCIPHER", 5],
    ["A", 3],
    ["THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG", 6],
    ["AB", 5],
  ] as const)("round-trips %s with %i faces", (text, faces) => {
    expect(scytaleDecode(scytaleEncode(text, faces), faces)).toBe(text);
  });

  // 絵文字などはサロゲートペアで表されるため、UTF-16単位で数えると升目の形が変わってしまう
  it.each([
    ["😀A", 2],
    ["ATTACK AT DAWN 😀 SEE YOU", 4],
    ["𠮷野家で🔑を受け取る", 3],
  ] as const)("round-trips %s with %i faces when it contains characters outside the BMP", (text, faces) => {
    const cipher = scytaleEncode(text, faces);
    expect(cipher).not.toMatch(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/);
    expect(scytaleDecode(cipher, faces)).toBe(text);
  });

  it("leaves text unchanged when faces < 2", () => {
    expect(scytaleEncode("HELLO", 1)).toBe("HELLO");
  });
});
