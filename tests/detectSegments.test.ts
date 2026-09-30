import { describe, it, expect } from "vitest";
import { detectSegments } from "../src/core/detectSegments";
import { normalizeContent } from "../src/core/normalizeContent";

describe("detectSegments", () => {
  it("keeps climate prose with citations and sentence colons as text", () => {
    const input = `No source identifies a single safest European country for climate change. Most organizations explicitly say a ranking is not provided [Copernicus-1] [Climate-Central-2] [FAO-2] [WMO-1] [IPBES-3] [OECD-1] [UNEP-3] [The-Lancet-1].

There is partial agreement that northern or higher-latitude Europe tends to fare relatively better in some metrics: Copernicus notes lower warming or localized cooling in Iceland, Norway, the UK, Sweden, Finland, and Scandinavia [Copernicus-1] [Copernicus-3]; WMO reports Iceland’s localized cooling and Fennoscandia’s lower warming trend [WMO-3]; OECD says Sweden, Finland, Norway, Iceland, Ireland, Luxembourg, Lithuania, Estonia, Denmark, and others show “little to no change” in some hazards [Oecd-3].

But other sources highlight that these same regions are still affected by heat, storm, or flood risks: WMO and Copernicus report record-warm years in Norway, Iceland, Sweden, Finland, and the UK [Copernicus-1] [Copernicus-3] [WMO-4]; OECD says the Netherlands, Belgium, and Denmark are among the most exposed to coastal flooding [Oecd-1] [Oecd-2] [Oecd-5].

A few sources suggest likely “safer” candidates from limited evidence: Germanwatch points to Austria as the lowest listed European CRI score in its excerpt [Germanwatch-1]; GGGI points to Montenegro as lowest among the European countries shown [Gggi-1]; UNU highlights Switzerland among lower-carbon-footprint countries [Unu-1]. Evidence is incomplete, and these are not Europe-wide safety rankings.`;
    expect(detectSegments(normalizeContent(input))).toEqual([
      { type: "text", content: input },
    ]);
  });

  it("detects valid unfenced YAML mappings", () => {
    const input = "name: Abbas\nsettings:\n  enabled: true";
    expect(detectSegments(input)).toEqual([
      { type: "yaml", content: input, language: "yaml" },
    ]);
  });

  it("does not classify a YAML document marker followed by prose as YAML", () => {
    expect(detectSegments("---\nJust an ordinary sentence.")[0].type).not.toBe(
      "yaml",
    );
  });

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
