import { describe, expect, it } from "vitest";
import { PIGPEN_TABLE, pigpenDecode, pigpenEncode, symbolToCode } from "./pigpen";

describe("PIGPEN_TABLE", () => {
  it("assigns a unique code to every letter A-Z", () => {
    const codes = new Set(
      [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((letter) => symbolToCode(PIGPEN_TABLE[letter])),
    );
    expect(codes.size).toBe(26);
  });

  it("places A-I in the plain 3x3 grid, row-major", () => {
    expect(symbolToCode(PIGPEN_TABLE.A)).toBe("11");
    expect(symbolToCode(PIGPEN_TABLE.E)).toBe("22");
    expect(symbolToCode(PIGPEN_TABLE.I)).toBe("33");
  });

  it("places J-R in the same grid positions as A-I, but dotted", () => {
    expect(symbolToCode(PIGPEN_TABLE.J)).toBe("11.");
    expect(symbolToCode(PIGPEN_TABLE.R)).toBe("33.");
  });

  it("places S-V on the plain X (top/right/bottom/left)", () => {
    expect(symbolToCode(PIGPEN_TABLE.S)).toBe("T");
    expect(symbolToCode(PIGPEN_TABLE.T)).toBe("R");
    expect(symbolToCode(PIGPEN_TABLE.U)).toBe("B");
    expect(symbolToCode(PIGPEN_TABLE.V)).toBe("L");
  });

  it("places W-Z on the dotted X", () => {
    expect(symbolToCode(PIGPEN_TABLE.W)).toBe("T.");
    expect(symbolToCode(PIGPEN_TABLE.Z)).toBe("L.");
  });
});

describe("pigpenEncode / pigpenDecode", () => {
  it("round-trips the full alphabet", () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    expect(pigpenDecode(pigpenEncode(alphabet))).toBe(alphabet);
  });

  it("round-trips words, skipping whitespace (spacing is not preserved, like the Uesugi page)", () => {
    expect(pigpenDecode(pigpenEncode("HELLO WORLD"))).toBe("HELLOWORLD");
  });

  it("passes through characters outside A-Z as literal tokens", () => {
    expect(pigpenEncode("HI!")).toBe("32 33 !");
    expect(pigpenDecode("32 33 !")).toBe("HI!");
  });

  it("is case-insensitive on encode", () => {
    expect(pigpenEncode("hi")).toBe(pigpenEncode("HI"));
  });
});
