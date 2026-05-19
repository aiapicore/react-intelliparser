import type { ContentSegment, IntelliParserOptions } from "../types";

interface TextBlockProps {
  segment: ContentSegment;
  options?: IntelliParserOptions;
}

export function TextBlock({ segment, options: _options }: TextBlockProps) {
  return <p className="intelliparser-text-block">{segment.content}</p>;
}
