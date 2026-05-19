import { describe, it, expect } from "vitest";
import { formatJson } from "../src/core/formatJson";

describe("formatJson", () => {
  it("pretty-prints a valid JSON object", () => {
    const result = formatJson('{"name":"Abbas","role":"developer"}');
    expect(result).toBe(JSON.stringify({ name: "Abbas", role: "developer" }, null, 2));
  });

  it("pretty-prints a valid JSON array", () => {
    const result = formatJson('[1,2,3]');
    expect(result).toBe(JSON.stringify([1, 2, 3], null, 2));
  });

  it("returns the original string for invalid JSON", () => {
    const bad = "{ not: valid }";
    expect(formatJson(bad)).toBe(bad);
  });

  it("handles nested objects", () => {
    const input = '{"a":{"b":{"c":1}}}';
    const result = formatJson(input);
    expect(result).toContain('"c": 1');
  });
});
