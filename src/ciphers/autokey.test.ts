import { describe, expect, it } from "vitest";
import { autokeyDecode, autokeyEncode, autokeySteps } from "./autokey";

describe("autokeyEncode / autokeyDecode", () => {
  it("round-trips arbitrary text with a short primer", () => {
    const original = "ATTACKATDAWN";
    const primer = "K";
    expect(autokeyDecode(autokeyEncode(original, primer), primer)).toBe(original);
  });

  it("round-trips with a multi-letter primer", () => {
    const original = "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG";
    const primer = "LION";
    expect(autokeyDecode(autokeyEncode(original, primer), primer)).toBe(original);
  });

  it("computes the first letter from the primer alone, matching a plain Vigenere step", () => {
    // keystream[0] = primer[0] = 'K' (index 10). plaintext[0] = 'A' (index 0).
    // ciphertext[0] = A(0) + K(10) = K(10).
    const cipher = autokeyEncode("ATTACKATDAWN", "K");
    expect(cipher[0]).toBe("K");
    expect(cipher).toHaveLength(12);
  });

  it("leaves non-alphabetic characters untouched and does not consume a key letter for them", () => {
    const original = "HI, THERE!";
    const primer = "GO";
    const cipher = autokeyEncode(original, primer);
    expect(cipher.includes(",")).toBe(true);
    expect(cipher.includes("!")).toBe(true);
    expect(autokeyDecode(cipher, primer)).toBe(original);
  });

  it("preserves case", () => {
    const cipher = autokeyEncode("Hello", "KEY");
    expect(cipher[0]).toBe(cipher[0].toUpperCase());
    expect(cipher.slice(1)).toBe(cipher.slice(1).toLowerCase());
  });

  it("returns the text unchanged for an empty primer", () => {
    expect(autokeyEncode("HELLO", "")).toBe("HELLO");
    expect(autokeyDecode("HELLO", "")).toBe("HELLO");
  });

  it("autokeySteps in decode direction reconstructs the same key stream as encoding", () => {
    const primer = "K";
    const cipher = autokeyEncode("ATTACKATDAWN", primer);
    const decodeSteps = autokeySteps(cipher, primer, -1);
    const encodeSteps = autokeySteps("ATTACKATDAWN", primer, 1);
    expect(decodeSteps.map((s) => s.keyChar)).toEqual(encodeSteps.map((s) => s.keyChar));
    expect(decodeSteps.map((s) => s.result).join("")).toBe("ATTACKATDAWN");
  });

  it("produces different ciphertext than a repeating-key Vigenere for longer messages", () => {
    // The whole point of autokey: the key never repeats, unlike a short repeating key.
    // A message longer than the primer should encrypt differently past the primer length.
    const original = "AAAAAAAAAAAAAAAAAAAA";
    const cipher = autokeyEncode(original, "B");
    // With a repeating 1-letter key every output char would be identical; autokey should vary.
    const uniqueChars = new Set(cipher.split(""));
    expect(uniqueChars.size).toBeGreaterThan(1);
  });
});
