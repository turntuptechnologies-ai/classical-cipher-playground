import { describe, expect, it } from "vitest";
import { scytaleDecode, scytaleEncode } from "./scytale";

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

  it("leaves text unchanged when faces < 2", () => {
    expect(scytaleEncode("HELLO", 1)).toBe("HELLO");
  });
});
