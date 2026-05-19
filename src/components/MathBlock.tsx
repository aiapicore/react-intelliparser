import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { ContentSegment, IntelliParserOptions } from "../types";

interface MathBlockProps {
  segment: ContentSegment;
  options?: IntelliParserOptions;
}

export function MathBlock({ segment, options }: MathBlockProps) {
  if (!options?.enableMath) {
    return (
      <div className="intelliparser-code-block">
        <div className="intelliparser-code-header">math</div>
        <div className="intelliparser-code-body">
          <pre>
            <code>{segment.content}</code>
          </pre>
        </div>
      </div>
    );
  }

  const wrapped = `$$\n${segment.content}\n$$`;

  return (
    <div className="intelliparser-math-block">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {wrapped}
      </ReactMarkdown>
    </div>
  );
}
