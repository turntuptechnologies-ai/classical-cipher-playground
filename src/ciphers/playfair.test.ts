import { describe, expect, it } from "vitest";
import { buildDigraphs, buildPlayfairGrid, playfairDecode, playfairEncode } from "./playfair";

describe("buildPlayfairGrid", () => {
  it("dedupes the keyword and appends the remaining alphabet (I/J merged)", () => {
    expect(buildPlayfairGrid("PLAYFAIR EXAMPLE").join("")).toBe("PLAYFIREXMBCDGHKNOQSTUVWZ");
  });
});

describe("buildDigraphs", () => {
  it("inserts a filler between repeated letters (BALLOON -> BA LX LO ON)", () => {
    expect(buildDigraphs("BALLOON")).toEqual(["BA", "LX", "LO", "ON"]);
  });

  it("pads a trailing lone letter with a filler", () => {
    expect(buildDigraphs("ABX")).toEqual(["AB", "XQ"]);
  });

  it("uses Q as the filler when the repeated/lone letter is itself X", () => {
    expect(buildDigraphs("TAXXI")).toEqual(["TA", "XQ", "XI"]);
  });
});

describe("playfairEncode", () => {
  it("matches the canonical PLAYFAIR EXAMPLE / HIDE THE GOLD... worked example", () => {
    expect(playfairEncode("HIDE THE GOLD IN THE TREE STUMP", "PLAYFAIR EXAMPLE")).toBe(
      "BM OD ZB XD NA BE KU DM UI XM MO UV IF",
    );
  });
});

describe("playfairEncode / playfairDecode round-trip", () => {
  it("decoding the ciphertext reconstructs the digraph-expanded plaintext", () => {
    const plain = "HIDE THE GOLD IN THE TREE STUMP";
    const keyword = "PLAYFAIR EXAMPLE";
    const cipher = playfairEncode(plain, keyword);
    expect(playfairDecode(cipher, keyword)).toBe("HIDETHEGOLDINTHETREXESTUMP");
  });

  it("round-trips text with no repeated letters or odd length quirks", () => {
    const plain = "ATTACKATDAWN";
    const keyword = "MONARCHY";
    const cipher = playfairEncode(plain, keyword);
    expect(playfairDecode(cipher, keyword)).toBe(plain);
  });
});
