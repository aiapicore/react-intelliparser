import { describe, expect, it } from "vitest";
import { detectSegments } from "../src/core/detectSegments";
import { normalizeContent } from "../src/core/normalizeContent";
import type { ContentSegmentType } from "../src/types";

describe("supported content formats", () => {
  const examples: [string, string, ContentSegmentType][] = [
    ["JSON object", '{"name":"Alice","active":true}', "json"],
    ["JSON array", '[1,{"name":"Alice"}]', "json"],
    ["XML", '<root id="1"><child>data</child></root>', "xml"],
    ["XML declaration", '<?xml version="1.0"?><root/>', "xml"],
    [
      "SVG",
      '<svg xmlns="http://www.w3.org/2000/svg"><circle r="5"/></svg>',
      "xml",
    ],
    ["HTML fragment", "<div><p>Hello</p></div>", "html"],
    ["HTML document", "<!DOCTYPE html><html><body>Hello</body></html>", "html"],
    [
      "lowercase HTML doctype",
      "<!doctype html><html><body>Hello</body></html>",
      "html",
    ],
    ["HTML void element", '<img src="photo.png" alt="Photo">', "html"],
    ["HTML inline element", "<strong>Hello</strong>", "html"],
    ["heading", "# Title\n\nBody", "markdown"],
    ["bold", "Some **bold** text", "markdown"],
    ["italic", "Some *italic* text", "markdown"],
    ["underscore italic", "Some _italic_ text", "markdown"],
    ["strikethrough", "Some ~~deleted~~ text", "markdown"],
    ["unordered list", "- one\n- two", "markdown"],
    ["ordered list", "1. one\n2. two", "markdown"],
    ["task list", "- [x] one\n- [ ] two", "markdown"],
    ["blockquote", "> Quoted text", "markdown"],
    ["link", "[Example](https://example.com)", "markdown"],
    [
      "reference link",
      "[Example][site]\n\n[site]: https://example.com",
      "markdown",
    ],
    ["inline code", "Use `const x = 1` here.", "markdown"],
    [
      "GFM table",
      "| Name | Score |\n| --- | ---: |\n| Alice | 98 |",
      "markdown",
    ],
    ["setext heading", "Title\n=====", "markdown"],
    ["horizontal rule", "Before\n\n***\n\nAfter", "markdown"],
    ["inline math", "The area is $A = \\pi r^2$.", "markdown"],
    ["math within prose", "The formula is $$x^2$$.", "markdown"],
    ["display math", "$$\nx^2 + y^2 = z^2\n$$", "math"],
    ["single-line display math", "$$x^2 + y^2 = z^2$$", "math"],
    ["YAML mapping", "name: Alice\nactive: true", "yaml"],
    ["nested YAML", "settings:\n  enabled: true\n  count: 3", "yaml"],
    [
      "YAML block scalar",
      "description: |\n  A paragraph.\n  Another line.",
      "yaml",
    ],
    ["YAML document marker", "---\nname: Alice\nactive: true", "yaml"],
    ["CSV", "name,score\nAlice,98\nBob,87", "csv"],
    [
      "quoted CSV",
      'name,description\nAlice,"Hello, world"\nBob,"He said ""hi"""',
      "csv",
    ],
    [
      "CSV with Markdown-looking values",
      "name,description\nAlice,*special*\nBob,**bold**",
      "csv",
    ],
    [
      "CSV with links",
      "name,link\nAlice,[Example](https://example.com)",
      "csv",
    ],
    ["URL", "https://example.com/path?x=1&y=2#section", "url"],
    ["HTTP URL", "http://example.com", "url"],
    ["plain text", "Just an ordinary sentence.", "text"],
  ];

  it.each(examples)("detects %s", (_name, input, expected) => {
    const segments = detectSegments(normalizeContent(input));
    expect(segments).toHaveLength(1);
    expect(segments[0].type).toBe(expected);
  });

  it.each([
    ["json", "json"],
    ["xml", "xml"],
    ["svg", "xml"],
    ["html", "html"],
    ["yaml", "yaml"],
    ["yml", "yaml"],
    ["csv", "csv"],
    ["mermaid", "mermaid"],
    ["math", "math"],
    ["latex", "math"],
    ["ts", "code"],
    ["python", "code"],
    ["", "code"],
    ["markdown", "markdown"],
    ["md", "markdown"],
    ["text", "text"],
    ["txt", "text"],
    ["plaintext", "text"],
  ])("honors the %s fence hint", (language, expected) => {
    const input = `\`\`\`${language}\nexample\n\`\`\``;
    expect(detectSegments(input)[0]).toMatchObject({
      type: expected,
      content: "example",
    });
  });

  it.each([
    ["tilde fence", "~~~json\n{}\n~~~", "json", "{}"],
    [
      "long fence",
      "````ts\n```\nconst x = 1;\n````",
      "code",
      "```\nconst x = 1;",
    ],
    [
      "indented fence",
      "  ```ts\n  const x = 1;\n  ```",
      "code",
      "const x = 1;",
    ],
    ["hint with metadata", '```JSON title="record"\n{}\n```', "json", "{}"],
    ["unclosed streaming fence", "```ts\nconst x = 1;", "code", "const x = 1;"],
    ["CRLF fence", "```json\r\n{}\r\n```", "json", "{}"],
  ])("handles %s", (_name, input, expected, content) => {
    expect(detectSegments(normalizeContent(input))).toEqual([
      expect.objectContaining({ type: expected, content }),
    ]);
  });

  it("does not treat inherited property names as fence types", () => {
    expect(detectSegments("```constructor\nexample\n```")[0].type).toBe("code");
  });

  it("preserves mixed prose, data, math, diagram, and code in order", () => {
    const input = [
      "Intro text.",
      "",
      "```json",
      "{}",
      "```",
      "",
      "$$",
      "x^2",
      "$$",
      "",
      "```mermaid",
      "graph TD; A-->B;",
      "```",
      "",
      "~~~python",
      "print(1)",
      "~~~",
      "",
      "Outro text.",
    ].join("\n");
    expect(detectSegments(input).map(({ type }) => type)).toEqual([
      "text",
      "json",
      "math",
      "mermaid",
      "code",
      "text",
    ]);
  });
});

describe("ambiguous and invalid content", () => {
  it.each([
    ["malformed JSON", '{"key":}'],
    ["unclosed XML", "<root><child>data</root>"],
    ["tag-shaped prose", "<user> is a placeholder in this sentence."],
    ["citations", "Sources [Copernicus-1] [WMO-3] agree on this point."],
    ["underscores in identifiers", "Use snake_case_name for this field."],
    ["unmatched emphasis", "Please add ** before the word."],
    [
      "sentence colon",
      "These regions fare better in some metrics: lower warming is reported.",
    ],
    [
      "colon prose across paragraphs",
      "Summary: This is prose.\n\nAnother ordinary paragraph.",
    ],
    ["comma prose", "Hello, world.\nToday, we are discussing the weather."],
    [
      "inconsistent CSV after row three",
      "name,score\nAlice,98\nBob,87\nCharlie,86,extra",
    ],
    ["malformed quoted CSV", 'name,score\n"Alice,98'],
    ["multiline URL prose", "https://example.com\nMore text"],
    ["currency", "Prices are $5 and $10."],
  ])("keeps %s as text", (_name, input) => {
    expect(detectSegments(input)).toEqual([{ type: "text", content: input }]);
  });

  it("does not split fence-like strings inside code", () => {
    const input =
      "```ts\nconst value = 1;\n``` trailing text\nconst next = 2;\n```";
    expect(detectSegments(input)).toEqual([
      {
        type: "code",
        language: "ts",
        content: "const value = 1;\n``` trailing text\nconst next = 2;",
      },
    ]);
  });
});
