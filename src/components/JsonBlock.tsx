import { useMemo } from "react";
import { formatJson } from "../core/formatJson";
import type { ContentSegment, IntelliParserOptions } from "../types";

interface JsonBlockProps {
  segment: ContentSegment;
  options?: IntelliParserOptions;
}

export function JsonBlock({ segment, options }: JsonBlockProps) {
  const pretty = options?.prettifyCode !== false;

  const displayed = useMemo(
    () => (pretty ? formatJson(segment.content) : segment.content),
    [segment.content, pretty]
  );

  return (
    <div className="intelliparser-json-block">
      <pre>
        <code>{displayed}</code>
      </pre>
    </div>
  );
}
