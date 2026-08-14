import { describe, expect, it } from "vitest";
import { adfgvxDecode, adfgvxEncode, buildAdfgvxSquare, fractionate } from "./adfgvx";

// Wikipediaに掲載されている完全な検証例(6x6方陣を直接指定して分数化・列転置の
// ロジック単体を検証する。方陣の構築アルゴリズム自体は独自の単純な規約のため対象外)
const WIKI_SQUARE = [..."NA1C3H8TB2OME5WRPD4F6G7I9J0KLQSUVXYZ"];

describe("fractionate", () => {
  it("matches the Wikipedia worked example (plaintext -> ADFGVX pairs)", () => {
    expect(fractionate("attack at 1200am", WIKI_SQUARE)).toBe("ADDDDDADAGVGADDDAFDGVFVFADDX");
  });
});

describe("adfgvxEncode end-to-end against the Wikipedia worked example", () => {
  it("reproduces the exact ciphertext when the square key IS the known 36-char square", () => {
    // buildAdfgvxSquare dedupes its input, so passing the full 36-char WIKI_SQUARE
    // string (all characters already unique) makes the square identical to it.
    const squareKeyThatYieldsWikiSquare = WIKI_SQUARE.join("");
    expect(adfgvxEncode("attack at 1200am", squareKeyThatYieldsWikiSquare, "PRIVACY")).toBe(
      "DGDDDAGDDGAFADDFDADVDVFAADVX",
    );
  });
});

describe("buildAdfgvxSquare", () => {
  it("produces 36 unique characters covering A-Z and 0-9", () => {
    const square = buildAdfgvxSquare("GERMANY");
    expect(square.length).toBe(36);
    expect(new Set(square).size).toBe(36);
    for (const ch of "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") {
      expect(square).toContain(ch);
    }
  });

  it("places the deduped keyword characters first", () => {
    expect(buildAdfgvxSquare("HELLO").slice(0, 4)).toEqual(["H", "E", "L", "O"]);
  });
});

describe("adfgvxEncode / adfgvxDecode round-trip", () => {
  it.each([
    ["ATTACK AT DAWN", "GERMANY", "SECRET"],
    ["SEND REINFORCEMENTS 1918", "KEYWORD", "CIPHER"],
    ["A", "X", "AB"],
    ["HELLO WORLD 123", "PASSWORD", "LONGKEYWORD"],
  ] as const)("round-trips %s (square key %s, transposition key %s)", (text, squareKey, transKey) => {
    const normalized = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const cipher = adfgvxEncode(text, squareKey, transKey);
    expect(cipher).toMatch(/^[ADFGVX]+$/);
    expect(adfgvxDecode(cipher, squareKey, transKey)).toBe(normalized);
  });
});
