export const DEMO_CONTENT = `
# @aiapicore/react-intelliparser

**react-intelliparser** is a smart React + TypeScript library that *automatically detects*, parses, sanitizes, and renders mixed content — exactly what LLMs produce. Drop any raw string in and get beautifully formatted output.

---

## How it works

Pass raw content to \`<IntelliParser>\` and it splits the string into typed segments, each rendered by its dedicated component.

\`\`\`tsx
import { IntelliParser } from '@aiapicore/react-intelliparser';
import '@aiapicore/react-intelliparser/styles.css';

export function Chat({ message }: { message: string }) {
  return (
    <IntelliParser
      content={message}
      options={{
        enableMermaid: true,
        enableMath: true,
        sanitizeHtml: true,
        prettifyCode: true,
      }}
    />
  );
}
\`\`\`

You can also work with segments directly:

\`\`\`ts
import { detectSegments, normalizeContent } from '@aiapicore/react-intelliparser';

const segments = detectSegments(normalizeContent(rawString));
// [{ type: 'markdown', content: '...' }, { type: 'json', content: '...' }, ...]
\`\`\`

---

## Detection pipeline

Content is scanned in priority order. The first detector that matches wins:

\`\`\`mermaid
flowchart TD
  A[Raw string] --> B{Fenced block?}
  B -- yes --> C[Use language hint\n e.g. json / xml / mermaid]
  B -- no --> D{isJson?}
  D -- yes --> E[JsonBlock]
  D -- no --> F{isXml?}
  F -- yes --> G[XmlBlock]
  F -- no --> H{isHtml?}
  H -- yes --> I[HtmlBlock]
  H -- no --> J{isMarkdown?}
  J -- yes --> K[MarkdownBlock]
  J -- no --> L{isYaml?}
  L -- yes --> M[YamlBlock]
  L -- no --> N{isUrl?}
  N -- yes --> O[UrlBlock]
  N -- no --> P[TextBlock]
\`\`\`

---

## Supported content types

| Type | Detector | Renderer | Notes |
|---|---|---|---|
| Markdown | \`isMarkdown()\` | \`MarkdownBlock\` | GFM, tables, blockquotes |
| JSON | \`isJson()\` | \`JsonBlock\` | Auto pretty-prints |
| XML | \`isXml()\` | \`XmlBlock\` | Indented via fast-xml-parser |
| HTML | \`isHtml()\` | \`HtmlBlock\` | Sanitized before render |
| YAML | fenced hint | \`YamlBlock\` | Monospace display |
| CSV | fenced hint | \`CsvBlock\` | Renders as \`<table>\` |
| Code | fenced hint | \`CodeBlock\` | Prism syntax highlighting |
| Mermaid | fenced hint | \`MermaidBlock\` | SVG via mermaid.js |
| Math | fenced hint / \`$$\` | \`MathBlock\` | KaTeX rendering |
| URL | regex | \`UrlBlock\` | Clickable anchor |
| Plain text | fallback | \`TextBlock\` | Wrapped in \`<p>\` |

---

## Package manifest

\`\`\`json
{
  "name": "@aiapicore/react-intelliparser",
  "version": "0.1.0",
  "description": "Smart React renderer for mixed LLM content",
  "keywords": ["react", "llm", "ai", "openai", "markdown", "parser", "mermaid", "katex"],
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  },
  "exports": {
    ".": "./dist/index.js",
    "./styles.css": "./dist/styles/intelliparser.css"
  }
}
\`\`\`

---

## Configuration reference

\`\`\`yaml
enableMarkdown: true       # Render Markdown via react-markdown
enableHtml: true           # Render sanitized HTML blocks
enableXml: true            # Format and display XML
enableJson: true           # Pretty-print JSON
enableYaml: true           # Display YAML in monospace
enableCsv: true            # Render CSV as HTML table
enableCodeHighlight: true  # Prism syntax highlighting
enableMermaid: true        # Mermaid diagram rendering
enableMath: true           # KaTeX math equations
sanitizeHtml: true         # Strip dangerous HTML tags & attrs
prettifyCode: true         # Auto-format code blocks
enableCopyButton: true     # Show copy button on code blocks
\`\`\`

---

## CSV data example

\`\`\`csv
Type, Detector, Renderer, Auto-format
Markdown, isMarkdown(), MarkdownBlock, No
JSON, isJson(), JsonBlock, Yes
XML, isXml(), XmlBlock, Yes
HTML, isHtml(), HtmlBlock, Sanitized
Mermaid, fenced hint, MermaidBlock, SVG
Math, fenced / $$, MathBlock, KaTeX
\`\`\`

---

## HTML snippet

\`\`\`html
<div class="feature-card">
  <h3>Zero-config rendering</h3>
  <p>Drop any raw string — <strong>react-intelliparser</strong> figures out the rest.</p>
  <ul>
    <li>No manual type hints needed</li>
    <li>Works with any LLM output</li>
    <li>Fully customizable via <code>renderers</code> prop</li>
  </ul>
</div>
\`\`\`

---

## Math support

The detection score for a segment of length $n$ with $k$ matched patterns is:

$$
\\text{score}(s) = \\sum_{i=1}^{k} w_i \\cdot \\mathbb{1}[p_i \\in s]
$$

Where $w_i$ is the weight of pattern $p_i$. The segment type with the highest score wins.

Inline math also works: the area of a circle is $A = \\pi r^2$.

You can also use fenced math blocks:

\`\`\`math
f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}
\`\`\`

---

## Blockquote

> LLMs output a chaotic mix of Markdown, JSON, code, and prose.  
> **react-intelliparser** turns that chaos into clean, structured UI — automatically.

---

## URL

https://github.com/aiapicore/react-intelliparser
`;

// Serialized string as it arrives from an LLM API response —
// newlines are literal \n, quotes are \", no actual newline characters.
export const SERIALIZED_CONTENT = "The database provides an **example CAP XML update message for an earthquake** (speculative example). Here is the exact XML sample shown in the provided text:\\n\\n```xml\\n<?xml version = \\\"1.0\\\" encoding = \\\"UTF-8\\\"?>\\n<alert xmlns = \\\"urn:oasis:names:tc:emergency:cap:1.2\\\">\\n  <identifier>TRI13970876.2</identifier>\\n  <sender>trinet@caltech.edu</sender>\\n  <sent>2003-06-11T20:56:00-07:00</sent>\\n  <status>Actual</status>\\n  <msgType>Update</msgType>\\n  <scope>Public</scope>\\n  <references>trinet@caltech.edu,TRI13970876.1,2003-06-11T20:30:00-07:00</references>\\n  <info>\\n    <category>Geo</category>\\n    <event>Earthquake</event>\\n    <urgency>Past</urgency>\\n    <severity>Minor</severity>\\n    <certainty>Observed</certainty>\\n    <senderName>Southern California Seismic Network (TriNet) operated by Caltech and USGS</senderName>\\n    <headline>EQ 3.4 Imperial County CA</headline>\\n    <description>A minor earthquake measuring 3.4 on the Richter scale occurred near Brawley, California at 8:30 PM Pacific Daylight Time on Wednesday, June 11, 2003.</description>\\n    <web>http://www.trinet.org/scsn/scsn.html</web>\\n    <parameter>\\n      <valueName>EventID</valueName>\\n      <value>13970876</value>\\n    </parameter>\\n    <parameter>\\n      <valueName>Magnitude</valueName>\\n      <value>3.4 Ml</value>\\n    </parameter>\\n    <parameter>\\n      <valueName>Depth</valueName>\\n      <value>11.8 mi.</value>\\n    </parameter>\\n    <area>\\n      <areaDesc>1 mi. WSW of Brawley, CA; 11 mi. N of El Centro, CA</areaDesc>\\n      <circle>32.9525,-115.5527 0</circle>\\n    </area>\\n  </info>\\n</alert>\\n```\\n\\nSource citation: CAP-v1.2-os (earthquake example) page 42;";