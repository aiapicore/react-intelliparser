import type { ContentSegment, IntelliParserOptions } from "../types";

interface YamlBlockProps {
  segment: ContentSegment;
  options?: IntelliParserOptions;
}

export function YamlBlock({ segment, options: _options }: YamlBlockProps) {
  return (
    <div className="intelliparser-yaml-block">
      <pre>
        <code>{segment.content}</code>
      </pre>
    </div>
  );
}
