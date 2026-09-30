import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const examples = [
  ["text", "An ordinary sentence."],
  ["markdown", "Some *italic* text."],
  ["json", '{"name":"Alice"}'],
  ["xml", "<root>data</root>"],
  ["html", "<div>Hello</div>"],
  ["yaml", "name: Alice\nactive: true"],
  ["csv", 'name,comment\nAlice,"Hello, world"'],
  ["code", "```ts\nconst x = 1;\n```"],
  ["mermaid", "```mermaid\ngraph TD; A-->B;\n```"],
  ["math", "$$x^2$$"],
  ["url", "https://example.com"],
];

for (const [format, lib] of [
  ["ESM", await import("../dist/index.js")],
  ["CJS", require("../dist/index.cjs")],
]) {
  for (const [type, content] of examples) {
    assert.equal(
      lib.detectSegments(content)[0].type,
      type,
      `${format}: ${type}`,
    );
    assert.ok(
      renderToStaticMarkup(
        createElement(lib.IntelliParser, {
          content,
          options: { enableCodeHighlight: false },
        }),
      ).includes("intelliparser"),
    );
  }
  // Exercise the bundled theme as well as renderer routing.
  assert.ok(
    renderToStaticMarkup(
      createElement(lib.IntelliParser, {
        content: "```ts\nconst x = 1;\n```",
      }),
    ).includes("const"),
  );
  assert.ok(
    renderToStaticMarkup(createElement(lib.IntelliParser, {
      content: "$$x^2$$", options: { enableMath: true },
    })).includes('class="katex"'),
  );
  console.log(`${format}: all 11 formats detect and render successfully`);
}
