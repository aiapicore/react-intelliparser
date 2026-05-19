import { useMemo } from "react";
import { formatXml } from "../core/formatXml";
import type { ContentSegment, IntelliParserOptions } from "../types";

interface XmlBlockProps {
  segment: ContentSegment;
  options?: IntelliParserOptions;
}

export function XmlBlock({ segment, options }: XmlBlockProps) {
  const pretty = options?.prettifyCode !== false;

  const displayed = useMemo(
    () => (pretty ? formatXml(segment.content) : segment.content),
    [segment.content, pretty]
  );

  return (
    <div className="intelliparser-xml-block">
      <pre>
        <code>{displayed}</code>
      </pre>
    </div>
  );
}
