import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import type { Components } from "react-markdown";
import type { ContentSegment, IntelliParserOptions } from "../types";

interface MarkdownBlockProps {
  segment: ContentSegment;
  options?: IntelliParserOptions;
}

export function MarkdownBlock({ segment, options }: MarkdownBlockProps) {
  const enableMath = options?.enableMath === true;
  const enableHtml = options?.enableHtml !== false;
  const sanitize = options?.sanitizeHtml !== false;
  const highlight = options?.enableCodeHighlight !== false;

  const remarkPlugins = [remarkGfm, ...(enableMath ? [remarkMath] : [])];

  const rehypePlugins = [
    ...(enableHtml ? [rehypeRaw] : []),
    ...(sanitize
      ? [
          [
            rehypeSanitize,
            {
              ...defaultSchema,
              attributes: {
                ...defaultSchema.attributes,
                // Allow className for syntax highlighting spans
                "*": ["className"],
                code: ["className"],
              },
            },
          ] as [typeof rehypeSanitize, object],
        ]
      : []),
    ...(enableMath ? [rehypeKatex] : []),
  ];

  const components: Components = {
    code({ className, children, ...rest }) {
      const match = /language-(\w+)/.exec(className ?? "");
      const lang = match ? match[1] : "";
      const isBlock = "\n" in rest || String(children).includes("\n");

      if (isBlock && highlight && lang) {
        return (
          <SyntaxHighlighter language={lang} style={oneDark} PreTag="div">
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        );
      }
      return (
        <code className={className} {...rest}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="intelliparser-markdown">
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {segment.content}
      </ReactMarkdown>
    </div>
  );
}
