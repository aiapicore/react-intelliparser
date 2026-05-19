import { useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { ContentSegment, IntelliParserOptions } from "../types";

interface CodeBlockProps {
  segment: ContentSegment;
  options?: IntelliParserOptions;
}

export function CodeBlock({ segment, options }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lang = segment.language ?? "text";
  const showCopyButton = options?.enableCopyButton !== false;
  const highlightEnabled = options?.enableCodeHighlight !== false;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(segment.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Clipboard API not available – silently ignore
    });
  }, [segment.content]);

  return (
    <div className="intelliparser-code-block">
      <div className="intelliparser-code-header">
        <span>{lang}</span>
        {showCopyButton && (
          <button
            type="button"
            className={`intelliparser-copy-button${copied ? " copied" : ""}`}
            onClick={handleCopy}
            aria-label="Copy code"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
      <div className="intelliparser-code-body">
        {highlightEnabled ? (
          <SyntaxHighlighter
            language={lang}
            style={oneDark}
            PreTag="div"
            customStyle={{ margin: 0, background: "transparent" }}
          >
            {segment.content}
          </SyntaxHighlighter>
        ) : (
          <pre>
            <code>{segment.content}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
