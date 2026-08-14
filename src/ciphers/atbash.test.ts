import { describe, expect, it } from "vitest";
import { atbashTransform, REVERSED_ALPHABET } from "./atbash";

describe("atbashTransform", () => {
  it("maps A<->Z, B<->Y, ...", () => {
    expect(atbashTransform("ABCZYX")).toBe("ZYXABC");
  });

  it("reverses the whole alphabet", () => {
    expect(REVERSED_ALPHABET).toBe("ZYXWVUTSRQPONMLKJIHGFEDCBA");
  });

  it("preserves case", () => {
    expect(atbashTransform("Hello")).toBe("Svool");
  });

  it("leaves non-alphabetic characters untouched", () => {
    expect(atbashTransform("Hi! 123.")).toBe("Sr! 123.");
  });

  it("is its own inverse (self-reciprocal)", () => {
    const original = "The quick brown fox";
    expect(atbashTransform(atbashTransform(original))).toBe(original);
  });
});
