import { describe, expect, it } from "vitest";
import { caesarDecode, caesarEncode } from "./caesar";

describe("caesarEncode", () => {
  it("shifts letters by the given amount", () => {
    expect(caesarEncode("HELLO WORLD", 3)).toBe("KHOOR ZRUOG");
  });

  it("wraps around the alphabet", () => {
    expect(caesarEncode("ABC", -1)).toBe("ZAB");
  });

  it("leaves non-alphabetic characters untouched", () => {
    expect(caesarEncode("Hello, World! 123", 0)).toBe("Hello, World! 123");
  });

  it("preserves case", () => {
    expect(caesarEncode("Hello", 1)).toBe("Ifmmp");
  });
});

describe("caesarDecode", () => {
  it("round-trips with caesarEncode", () => {
    const original = "Hello, World! 123";
    expect(caesarDecode(caesarEncode(original, 7), 7)).toBe(original);
  });
});
