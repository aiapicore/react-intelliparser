import { describe, it, expect } from "vitest";
import { detectSegments } from "../src/core/detectSegments";
import { normalizeContent } from "../src/core/normalizeContent";

describe("detectSegments", () => {
  it("returns empty array for empty string", () => {
    expect(detectSegments("")).toEqual([]);
  });

  it("returns empty array for whitespace-only string", () => {
    expect(detectSegments("   \n  ")).toEqual([]);
  });

  it("detects plain text", () => {
    const result = detectSegments("Hello world");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("text");
    expect(result[0].content).toBe("Hello world");
  });

  it("detects markdown", () => {
    const result = detectSegments("# Title\n\nSome **bold** text.");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("markdown");
  });

  it("detects a fenced code block", () => {
    const input = "```tsx\nconst x = 1;\n```";
    const result = detectSegments(normalizeContent(input));
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("code");
    expect(result[0].language).toBe("tsx");
    expect(result[0].content).toBe("const x = 1;");
  });

  it("detects a fenced JSON block", () => {
    const input = '```json\n{"name":"Abbas"}\n```';
    const result = detectSegments(normalizeContent(input));
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("json");
    expect(result[0].language).toBe("json");
  });

  it("detects a fenced XML block", () => {
    const input = "```xml\n<user><name>Abbas</name></user>\n```";
    const result = detectSegments(normalizeContent(input));
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("xml");
    expect(result[0].language).toBe("xml");
  });

  it("detects a fenced HTML block", () => {
    const input = "```html\n<div>Hello</div>\n```";
    const result = detectSegments(normalizeContent(input));
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("html");
    expect(result[0].language).toBe("html");
  });

  it("detects a fenced mermaid block", () => {
    const input = "```mermaid\ngraph TD;\nA-->B;\n```";
    const result = detectSegments(normalizeContent(input));
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("mermaid");
  });

  it("detects multiple mixed segments in order", () => {
    const input = [
      "# Title",
      "",
      "Hello world.",
      "",
      "```tsx",
      'const name = "Abbas";',
      "```",
      "",
      "```json",
      '{"role":"developer"}',
      "```",
    ].join("\n");

    const result = detectSegments(normalizeContent(input));

    expect(result).toHaveLength(3);
    expect(result[0].type).toBe("markdown");
    expect(result[0].content).toContain("# Title");
    expect(result[1].type).toBe("code");
    expect(result[1].language).toBe("tsx");
    expect(result[2].type).toBe("json");
    expect(result[2].language).toBe("json");
  });

  it("preserves segment order with text before and after fenced blocks", () => {
    const input = [
      "Intro text",
      "",
      "```ts",
      "const a = 1;",
      "```",
      "",
      "Outro text",
    ].join("\n");

    const result = detectSegments(normalizeContent(input));
    expect(result[0].type).toBe("text");
    expect(result[1].type).toBe("code");
    expect(result[2].type).toBe("text");
  });

  it("detects inline JSON without fenced block", () => {
    const result = detectSegments('{"key":"value","count":42}');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("json");
  });

  it("detects inline XML without fenced block", () => {
    const result = detectSegments("<root><child>data</child></root>");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("xml");
  });

  it("handles invalid JSON gracefully as text", () => {
    const result = detectSegments("{ not valid json }");
    expect(result).toHaveLength(1);
    // Should not be classified as json (invalid JSON)
    expect(result[0].type).not.toBe("json");
  });

  it("detects a URL", () => {
    const result = detectSegments("https://example.com");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("url");
  });
});
