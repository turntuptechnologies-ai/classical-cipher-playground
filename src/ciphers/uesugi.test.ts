import { describe, expect, it } from "vitest";
import { IROHA_48, uesugiDecode, uesugiEncode } from "./uesugi";

describe("uesugiEncode", () => {
  it("matches the historical example てきみゆ -> 5-7 6-3 6-6 6-4", () => {
    expect(uesugiEncode("てきみゆ")).toBe("5-7 6-3 6-6 6-4");
  });

  it("places い (first letter) at 1-1 and ん (last letter) at 7-6", () => {
    expect(uesugiEncode("い")).toBe("1-1");
    expect(uesugiEncode("ん")).toBe("7-6");
  });

  it("normalizes dakuten/handakuten/small kana before lookup", () => {
    expect(uesugiEncode("が")).toBe(uesugiEncode("か"));
    expect(uesugiEncode("ぱ")).toBe(uesugiEncode("は"));
    expect(uesugiEncode("っ")).toBe(uesugiEncode("つ"));
  });

  it("passes through characters outside the table and skips whitespace", () => {
    expect(uesugiEncode("い a")).toBe("1-1 a");
  });
});

describe("uesugiDecode", () => {
  it("round-trips the full iroha-48 sequence", () => {
    expect(uesugiDecode(uesugiEncode(IROHA_48))).toBe(IROHA_48);
  });
});
