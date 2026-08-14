import { describe, expect, it } from "vitest";
import { computeFrequency, sortByFrequencyDesc } from "./frequency";

describe("computeFrequency", () => {
  it("counts each letter's occurrences", () => {
    const result = computeFrequency("AAB");
    expect(result.find((e) => e.letter === "A")).toMatchObject({ count: 2 });
    expect(result.find((e) => e.letter === "B")).toMatchObject({ count: 1 });
    expect(result.find((e) => e.letter === "C")).toMatchObject({ count: 0 });
  });

  it("is case-insensitive", () => {
    const result = computeFrequency("aA");
    expect(result.find((e) => e.letter === "A")).toMatchObject({ count: 2 });
  });

  it("ignores non-alphabetic characters", () => {
    const result = computeFrequency("A, B! 123");
    const total = result.reduce((sum, e) => sum + e.count, 0);
    expect(total).toBe(2);
  });

  it("returns all 26 letters even when unused", () => {
    const result = computeFrequency("A");
    expect(result).toHaveLength(26);
  });

  it("computes percentages that sum to 100", () => {
    const result = computeFrequency("AAAB");
    const total = result.reduce((sum, e) => sum + e.percent, 0);
    expect(total).toBeCloseTo(100);
  });

  it("returns 0 percent for every letter on empty input", () => {
    const result = computeFrequency("");
    expect(result.every((e) => e.percent === 0)).toBe(true);
  });
});

describe("sortByFrequencyDesc", () => {
  it("orders entries from most to least frequent", () => {
    const sorted = sortByFrequencyDesc(computeFrequency("AAABBC"));
    expect(sorted[0].letter).toBe("A");
    expect(sorted[1].letter).toBe("B");
    expect(sorted[2].letter).toBe("C");
  });

  it("breaks ties alphabetically", () => {
    const sorted = sortByFrequencyDesc(computeFrequency("BA"));
    expect(sorted[0].letter).toBe("A");
    expect(sorted[1].letter).toBe("B");
  });
});
