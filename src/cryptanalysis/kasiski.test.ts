import { describe, expect, it } from "vitest";
import { findRepeatedSequences, suggestKeyLengths } from "./kasiski";

describe("findRepeatedSequences", () => {
  it("finds a 3-letter sequence that repeats and records its positions", () => {
    const repeats = findRepeatedSequences("ABCXYZABC");
    const abc = repeats.find((r) => r.sequence === "ABC");
    expect(abc).toBeDefined();
    expect(abc!.positions).toEqual([0, 6]);
    expect(abc!.distances).toEqual([6]);
  });

  it("ignores sequences that appear only once", () => {
    const repeats = findRepeatedSequences("ABCDEFGH");
    expect(repeats).toHaveLength(0);
  });

  it("is case-insensitive and ignores non-alphabetic characters", () => {
    const repeats = findRepeatedSequences("abc, xyz! ABC.");
    const abc = repeats.find((r) => r.sequence === "ABC");
    expect(abc).toBeDefined();
    expect(abc!.positions).toEqual([0, 6]);
  });

  it("records every prior position when a sequence repeats more than twice", () => {
    const repeats = findRepeatedSequences("ABCXABCYABC");
    const abc = repeats.find((r) => r.sequence === "ABC");
    expect(abc!.positions).toEqual([0, 4, 8]);
    expect(abc!.distances).toEqual([4, 8]);
  });
});

describe("suggestKeyLengths", () => {
  it("votes for every divisor of each distance up to maxLength", () => {
    const repeats = [{ sequence: "ABC", positions: [0, 6], distances: [6] }];
    const candidates = suggestKeyLengths(repeats, 12);
    const lengths = candidates.map((c) => c.length).sort((a, b) => a - b);
    expect(lengths).toEqual([2, 3, 6]);
  });

  it("ranks a length voted for by multiple distances above the rest", () => {
    const repeats = [
      { sequence: "ABC", positions: [0, 9], distances: [9] },
      { sequence: "XYZ", positions: [0, 6], distances: [6] },
    ];
    const candidates = suggestKeyLengths(repeats, 12);
    expect(candidates[0].length).toBe(3);
    expect(candidates[0].votes).toBe(2);
  });

  it("returns an empty list when there are no repeats", () => {
    expect(suggestKeyLengths([], 12)).toEqual([]);
  });
});
