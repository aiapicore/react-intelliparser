import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { IntelliParser } from "../src/components/IntelliParser";
import type { IntelliParserOptions } from "../src/types";

function render(content: string, options: IntelliParserOptions = {}) {
  return renderToStaticMarkup(
    <IntelliParser content={content} options={options} />,
  );
}

describe("detected formats reach the correct renderer", () => {
  it.each([
    ["plain text", "A normal paragraph.", "intelliparser-text-block"],
    ["Markdown", "Some *italic* text", "intelliparser-markdown"],
    ["JSON", '{"name":"Alice"}', "intelliparser-json-block"],
    ["XML", "<root><value>1</value></root>", "intelliparser-xml-block"],
    ["HTML", "<div><strong>Hello</strong></div>", "intelliparser-html-block"],
    ["YAML", "name: Alice\nactive: true", "intelliparser-yaml-block"],
    ["CSV", "name,score\nAlice,98", "intelliparser-csv-block"],
    ["code", "```ts\nconst x = 1;\n```", "intelliparser-code-block"],
    [
      "Mermaid fallback",
      "```mermaid\ngraph TD; A-->B;\n```",
      "intelliparser-code-block",
    ],
    ["math fallback", "$$x^2$$", "intelliparser-code-block"],
    ["URL", "https://example.com", "intelliparser-url-block"],
  ])("renders %s", (_name, content, className) => {
    expect(render(content, { enableCodeHighlight: false })).toContain(
      `class="${className}"`,
    );
  });

  it("renders italic, strikethrough, and GFM tables", () => {
    const output = render(
      "*Italic* and ~~removed~~\n\n| Name | Score |\n| --- | --- |\n| Alice | 98 |",
    );
    expect(output).toContain("<em>Italic</em>");
    expect(output).toContain("<del>removed</del>");
    expect(output).toContain("<table>");
    expect(output).toContain("<td>Alice</td>");
  });

  it("renders quoted commas, escaped quotes, and multiline CSV cells", () => {
    const output = render(
      '```csv\nname,description\nAlice,"Hello, world"\nBob,"He said ""hi""\nand left"\n```',
    );
    expect(output).toContain("<td>Hello, world</td>");
    expect(output).toContain("<td>He said &quot;hi&quot;\nand left</td>");
    expect(output.match(/<td>/g)).toHaveLength(4);
  });

  it("keeps malformed fenced CSV visible", () => {
    const output = render('```csv\nname,score\n"Alice,98\n```');
    expect(output).toContain("&quot;Alice,98");
    expect(output).not.toContain("<table");
  });

  it("renders display math with KaTeX when enabled", () => {
    expect(render("$$x^2$$", { enableMath: true })).toContain('class="katex"');
  });

  it("renders inline math with KaTeX when enabled", () => {
    expect(
      render("The area is $A = \\pi r^2$.", { enableMath: true }),
    ).toContain('class="katex"');
  });

  it.each([
    ["# Heading", "enableMarkdown"],
    ["<div>Hello</div>", "enableHtml"],
    ["<root>data</root>", "enableXml"],
    ['{"name":"Alice"}', "enableJson"],
    ["name: Alice\nactive: true", "enableYaml"],
    ["name,score\nAlice,98", "enableCsv"],
  ] as const)("respects %s renderer disable option", (content, option) => {
    expect(render(content, { [option]: false })).toContain(
      'class="intelliparser-text-block"',
    );
  });

  it("continues to honor custom renderers", () => {
    const output = renderToStaticMarkup(
      <IntelliParser
        content="<div>Hello</div>"
        renderers={{
          html: ({ segment }) => <aside>{segment.type}</aside>,
        }}
      />,
    );
    expect(output).toContain("<aside>html</aside>");
  });
});
