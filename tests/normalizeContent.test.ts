import { describe, expect, it } from "vitest";
import { normalizeContent } from "../src/core/normalizeContent";
import { detectSegments } from "../src/core/detectSegments";
import { SERIALIZED_CONTENT } from "../src/consts";

describe("normalizeContent", () => {
  it("normalizes line endings", () => {
    expect(normalizeContent("one\r\ntwo\rthree\n")).toBe("one\ntwo\nthree");
  });
  it("decodes a JSON-serialized content string", () => {
    const input = '```json\n{"name":"Alice"}\n```';
    expect(normalizeContent(JSON.stringify(input))).toBe(input);
    expect(
      detectSegments(normalizeContent(JSON.stringify(input)))[0].type,
    ).toBe("json");
  });
  it("preserves escapes inside already-valid JSON", () => {
    const input = '{"message":"hello\\nworld","path":"C:\\\\new\\\\notes"}';
    expect(normalizeContent(input)).toBe(input);
    expect(detectSegments(normalizeContent(input))[0].type).toBe("json");
  });
  it("preserves literal backslash sequences in serialized code", () => {
    const input = '```js\nconst newline = "\\n";\nconst tab = "\\t";\n```';
    const bareSerialized = JSON.stringify(input).slice(1, -1);
    expect(normalizeContent(bareSerialized)).toBe(input);
  });
  it("preserves literal escapes when content already has real newlines", () => {
    const input = '```js\nconst newline = "\\n";\n```';
    expect(normalizeContent(input)).toBe(input);
  });
  it("still handles the serialized XML demo", () => {
    expect(
      detectSegments(normalizeContent(SERIALIZED_CONTENT)).map(
        ({ type }) => type,
      ),
    ).toEqual(["markdown", "xml", "text"]);
  });
});
