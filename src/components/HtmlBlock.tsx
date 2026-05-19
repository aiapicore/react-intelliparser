import { useMemo } from "react";
import { sanitizeHtml } from "../core/sanitizeHtml";
import type { ContentSegment, IntelliParserOptions } from "../types";

interface HtmlBlockProps {
  segment: ContentSegment;
  options?: IntelliParserOptions;
}

export function HtmlBlock({ segment, options }: HtmlBlockProps) {
  const sanitize = options?.sanitizeHtml !== false;

  const safeHtml = useMemo(() => {
    return sanitize ? sanitizeHtml(segment.content) : sanitizeHtml(segment.content);
    // We always sanitize – sanitizeHtml option only controls the rehype pipeline;
    // the raw HTML renderer here always strips dangerous constructs.
  }, [segment.content, sanitize]);

  return (
    <div
      className="intelliparser-html-block"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
