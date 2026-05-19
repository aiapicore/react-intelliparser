import type React from "react";

export type ContentSegmentType =
  | "text"
  | "markdown"
  | "html"
  | "xml"
  | "json"
  | "yaml"
  | "csv"
  | "code"
  | "mermaid"
  | "math"
  | "url";

export interface ContentSegment {
  type: ContentSegmentType;
  content: string;
  language?: string;
}

export interface IntelliParserOptions {
  sanitizeHtml?: boolean;
  enableMarkdown?: boolean;
  enableHtml?: boolean;
  enableXml?: boolean;
  enableJson?: boolean;
  enableYaml?: boolean;
  enableCsv?: boolean;
  enableCodeHighlight?: boolean;
  enableMermaid?: boolean;
  enableMath?: boolean;
  enableCopyButton?: boolean;
  prettifyCode?: boolean;
}

export interface IntelliParserProps {
  content: string;
  options?: IntelliParserOptions;
  className?: string;
  renderers?: Partial<
    Record<
      ContentSegmentType,
      React.ComponentType<{
        segment: ContentSegment;
        options?: IntelliParserOptions;
      }>
    >
  >;
}

export const defaultOptions: Required<IntelliParserOptions> = {
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
};
