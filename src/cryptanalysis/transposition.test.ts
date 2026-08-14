import { describe, expect, it } from "vitest";
import { parseColumnOrder } from "./transposition";

describe("parseColumnOrder", () => {
  it("parses a comma-separated 1-indexed permutation into a 0-indexed order", () => {
    const result = parseColumnOrder("3,1,2", 3);
    expect(result).toEqual({ valid: true, order: [2, 0, 1], error: null });
  });

  it("accepts space-separated input too", () => {
    const result = parseColumnOrder("2 1", 2);
    expect(result.valid).toBe(true);
    expect(result.order).toEqual([1, 0]);
  });

  it("rejects an input with the wrong number of columns", () => {
    const result = parseColumnOrder("1,2", 3);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/列数/);
  });

  it("rejects numbers outside the valid range", () => {
    const result = parseColumnOrder("1,2,5", 3);
    expect(result.valid).toBe(false);
  });

  it("rejects duplicate numbers", () => {
    const result = parseColumnOrder("1,1,2", 3);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/重複/);
  });

  it("rejects non-numeric input", () => {
    const result = parseColumnOrder("a,b,c", 3);
    expect(result.valid).toBe(false);
  });
});
