import { IntelliParser } from "../../src";
import "../../src/styles/intelliparser.css";

const content = `
# Hello Abbas

This is a response from an LLM.

\`\`\`tsx
const message = "Hello world";
console.log(message);
\`\`\`

\`\`\`json
{"name":"Abbas","role":"developer"}
\`\`\`

\`\`\`xml
<user>
  <name>Abbas</name>
  <role>developer</role>
</user>
\`\`\`

Here is a CSV table:

Name, Age, Role
Abbas, 30, Developer
Jane, 25, Designer

> This is a blockquote from the LLM.

Visit https://example.com for more info.
`;

export default function App() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      <h1>react-intelliparser demo</h1>
      <IntelliParser
        content={content}
        options={{
          sanitizeHtml: true,
          enableMarkdown: true,
          enableHtml: true,
          enableXml: true,
          enableJson: true,
          enableYaml: true,
          enableCsv: true,
          enableCodeHighlight: true,
          enableMermaid: false,
          enableMath: false,
          enableCopyButton: true,
          prettifyCode: true,
        }}
      />
    </div>
  );
}
