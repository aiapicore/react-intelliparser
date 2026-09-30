import { describe, expect, it } from "vitest";
import { parseCsv } from "../src/core/parseCsv";

describe("parseCsv", () => {
  it("preserves empty fields and skips empty physical lines", () => {
    expect(parseCsv("name,score,comment\n\nAlice,98,\n,87,\n")).toEqual([
      ["name", "score", "comment"],
      ["Alice", "98", ""],
      ["", "87", ""],
    ]);
  });
  it("preserves whitespace and newlines inside quoted fields", () => {
    expect(parseCsv('name,comment\r\nAlice,"  hello\r\nworld  "')).toEqual([
      ["name", "comment"],
      ["Alice", "  hello\nworld  "],
    ]);
  });
  it("handles empty quoted fields and escaped quotes", () => {
    expect(parseCsv('"","a""b", "quoted" ')).toEqual([["", 'a"b', "quoted"]]);
  });
  it.each(['"unclosed', 'a"b,c', '"a"b,c'])(
    "rejects malformed quoting %s",
    (input) => {
      expect(parseCsv(input)).toBeNull();
    },
  );
});
