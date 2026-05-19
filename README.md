# @aiapicore/react-intelliparser

> Drop any string from an LLM, API, or CMS — get clean, structured React UI.

[![npm](https://img.shields.io/npm/v/@aiapicore/react-intelliparser)](https://www.npmjs.com/package/@aiapicore/react-intelliparser)
[![license](https://img.shields.io/npm/l/@aiapicore/react-intelliparser)](./LICENSE)
[![types](https://img.shields.io/npm/types/@aiapicore/react-intelliparser)](https://www.npmjs.com/package/@aiapicore/react-intelliparser)

**react-intelliparser** is a React + TypeScript component purpose-built for rendering AI and LLM responses. It automatically detects what kind of content each part of a raw string is — Markdown, JSON, XML, HTML, YAML, CSV, code, Mermaid diagrams, math equations, plain URLs, or plain text — then renders it with the right component. Zero configuration required.

---

## The problem it solves

LLM APIs (OpenAI, Anthropic, Gemini, etc.) return raw strings that mix multiple content types in a single response:

```
Here's the data you asked for:

\`\`\`json
{"user": "Alice", "score": 98}
\`\`\`

And here's the flow:

\`\`\`mermaid
flowchart LR
  A[Client] --> B[API] --> C[DB]
\`\`\`
```

Without react-intelliparser, you write custom parsing logic for every project. With it, you pass the raw string and get properly rendered output — automatically.

---

## Features

- **Auto-detection** of 11 content types from a single raw string, no hints needed
- **Serialized string support** — handles `\n` / `\"` escaped strings direct from LLM streaming APIs without pre-processing
- Markdown with full GFM support (tables, task lists, strikethrough, blockquotes)
- Syntax-highlighted code blocks with a one-click copy button
- Pretty-printed JSON and XML with proper indentation
- Sanitized HTML rendering (strips `<script>`, `on*` handlers, `javascript:` URLs)
- YAML display and CSV-to-table rendering
- Mermaid diagrams rendered as SVG (opt-in)
- Math equations via KaTeX (opt-in)
- Custom renderer override for any content type
- Secure by default — XSS protection on all HTML paths
- Full TypeScript support — ships type declarations
- Dual ESM + CJS build, tree-shakeable

---

## Installation

```bash
npm install @aiapicore/react-intelliparser
```

> **Peer dependencies:** `react >= 18`, `react-dom >= 18`

---

## Quick Start

```tsx
import { IntelliParser } from "@aiapicore/react-intelliparser";
import "@aiapicore/react-intelliparser/styles.css";

export function ChatMessage({ content }: { content: string }) {
  return <IntelliParser content={content} />;
}
```

That's it. Pass any raw string — the library figures out the rest.

---

## Real-world example: rendering an LLM response

```tsx
import { IntelliParser } from "@aiapicore/react-intelliparser";
import "@aiapicore/react-intelliparser/styles.css";

// Raw string exactly as returned from an OpenAI / Anthropic API call
const llmResponse = `
Here's the user record you asked for:

\`\`\`json
{
  "id": 42,
  "name": "Alice",
  "role": "admin",
  "active": true
}
\`\`\`

The system architecture looks like this:

\`\`\`mermaid
flowchart LR
  Client --> API --> Database
\`\`\`

You can read more at https://docs.example.com
`;

export function App() {
  return (
    <IntelliParser
      content={llmResponse}
      options={{ enableMermaid: true, enableMath: true }}
    />
  );
}
```

---

## Serialized API responses

LLM streaming APIs sometimes deliver content as a JSON-escaped string — newlines as literal `\n`, quotes as `\"` — rather than a parsed string with real newlines. react-intelliparser detects this automatically and unescapes it before parsing, so you can pass the raw API payload directly:

```ts
// Content straight from an API response body — no pre-processing needed
const raw = "The result is:\\n\\n\`\`\`json\\n{\"score\": 98}\\n\`\`\`\\n\\nSee https://example.com";

<IntelliParser content={raw} />
// Renders: paragraph → JSON code block → URL link
```

---

## All options

```tsx
<IntelliParser
  content={content}
  options={{
    sanitizeHtml: true,        // Sanitize HTML output (default: true)
    enableMarkdown: true,      // Render Markdown (default: true)
    enableHtml: true,          // Render HTML blocks (default: true)
    enableXml: true,           // Render XML blocks (default: true)
    enableJson: true,          // Render JSON blocks (default: true)
    enableYaml: true,          // Render YAML blocks (default: true)
    enableCsv: true,           // Render CSV as tables (default: true)
    enableCodeHighlight: true, // Syntax-highlight code blocks (default: true)
    enableMermaid: false,      // Render Mermaid diagrams (default: false)
    enableMath: false,         // Render math with KaTeX (default: false)
    enableCopyButton: true,    // Show copy button on code blocks (default: true)
    prettifyCode: true,        // Auto-indent JSON and XML (default: true)
  }}
/>
```

| Option | Default | Description |
|---|---|---|
| `sanitizeHtml` | `true` | Strip dangerous tags and attributes from HTML |
| `enableMarkdown` | `true` | Render Markdown with remark-gfm |
| `enableHtml` | `true` | Render HTML blocks |
| `enableXml` | `true` | Format and render XML |
| `enableJson` | `true` | Pretty-print and render JSON |
| `enableYaml` | `true` | Display YAML in monospace |
| `enableCsv` | `true` | Render CSV as an HTML table |
| `enableCodeHighlight` | `true` | Prism syntax highlighting |
| `enableMermaid` | `false` | Render Mermaid diagrams as SVG |
| `enableMath` | `false` | Render math expressions with KaTeX |
| `enableCopyButton` | `true` | Copy button on code blocks |
| `prettifyCode` | `true` | Auto-indent JSON and XML |

---

## Supported content types

| Type | How it's detected | Renderer |
|---|---|---|
| Markdown | headings, bold, lists, links, blockquotes | `MarkdownBlock` |
| JSON | `{…}` or `[…]` that parses successfully | `JsonBlock` |
| XML | well-formed XML that isn't HTML | `XmlBlock` |
| HTML | `<html>`, `<!DOCTYPE html>`, or common block tags | `HtmlBlock` |
| YAML | fenced ` ```yaml ` block | `YamlBlock` |
| CSV | fenced ` ```csv ` block | `CsvBlock` → `<table>` |
| Code | fenced ` ``` ` with any language hint | `CodeBlock` |
| Mermaid | fenced ` ```mermaid ` | `MermaidBlock` |
| Math | fenced ` ```math ` / ` ```latex ` or `$$…$$` | `MathBlock` |
| URL | bare `https://` or `http://` link | `UrlBlock` |
| Plain text | everything else | `TextBlock` |

Detection priority: **Fenced blocks → JSON → XML → HTML → Markdown → YAML → CSV → URL → Text**

---

## Custom renderers

Override the component for any content type:

```tsx
import { IntelliParser } from "@aiapicore/react-intelliparser";

<IntelliParser
  content={content}
  renderers={{
    json: ({ segment }) => (
      <pre style={{ background: "#0f172a", color: "#7dd3fc", padding: "1rem" }}>
        {JSON.stringify(JSON.parse(segment.content), null, 2)}
      </pre>
    ),
    code: ({ segment }) => (
      <div className="my-code-block">
        <span className="lang">{segment.language}</span>
        <pre><code>{segment.content}</code></pre>
      </div>
    ),
  }}
/>
```

---

## Using `detectSegments` directly

```ts
import { detectSegments, normalizeContent } from "@aiapicore/react-intelliparser";

const segments = detectSegments(normalizeContent(rawString));
// [
//   { type: "markdown", content: "# Title\n\nHello." },
//   { type: "code", language: "tsx", content: "const x = 1;" },
//   { type: "json", content: '{"key":"value"}' },
// ]
```

`normalizeContent` handles line-ending normalization and automatic deserialization of JSON-escaped strings.

---

## TypeScript types

```ts
import type {
  ContentSegment,
  ContentSegmentType,
  IntelliParserOptions,
  IntelliParserProps,
} from "@aiapicore/react-intelliparser";

// ContentSegmentType:
// "text" | "markdown" | "html" | "xml" | "json"
// | "yaml" | "csv" | "code" | "mermaid" | "math" | "url"
```

---

## Security

- HTML is always sanitized before rendering — `<script>`, `<iframe>`, `on*` event attributes, and `javascript:` URLs are stripped.
- The `sanitizeHtml` option additionally enables `rehype-sanitize` in the Markdown pipeline.
- `dangerouslySetInnerHTML` is used only in `HtmlBlock`, after sanitization.
- Mermaid runs with `securityLevel: "strict"` to prevent XSS in diagrams.

---

## Development

```bash
# Install dependencies
npm install

# Start live playground (split-pane editor + live preview)
npm run dev

# Run tests
npm test

# Build for publishing (ESM + CJS + types)
npm run build
```

---

## Publishing

```bash
# Log in to npm with org access
npm login

# Build
npm run build

# Publish scoped package publicly
npm publish --access public
```

---

## License

[MIT](./LICENSE) — © [mirmashhouri](https://github.com/mirmashhouri) / [aiapicore](https://github.com/aiapicore)
