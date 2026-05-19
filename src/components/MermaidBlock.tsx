import { useEffect, useRef, useState } from "react";
import type { ContentSegment, IntelliParserOptions } from "../types";

interface MermaidBlockProps {
  segment: ContentSegment;
  options?: IntelliParserOptions;
}

export function MermaidBlock({ segment, options }: MermaidBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!options?.enableMermaid) return;

    let cancelled = false;

    import("mermaid")
      .then((mod) => {
        const mermaid = mod.default;
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict" });

        if (containerRef.current && !cancelled) {
          const id = `mermaid-${Math.random().toString(36).slice(2)}`;
          mermaid
            .render(id, segment.content)
            .then(({ svg }) => {
              if (containerRef.current && !cancelled) {
                containerRef.current.innerHTML = svg;
              }
            })
            .catch((err: unknown) => {
              if (!cancelled) {
                setError(err instanceof Error ? err.message : "Mermaid render error");
              }
            });
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load mermaid");
      });

    return () => {
      cancelled = true;
    };
  }, [segment.content, options?.enableMermaid]);

  if (!options?.enableMermaid) {
    return (
      <div className="intelliparser-code-block">
        <div className="intelliparser-code-header">mermaid</div>
        <div className="intelliparser-code-body">
          <pre>
            <code>{segment.content}</code>
          </pre>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="intelliparser-error">Mermaid error: {error}</div>;
  }

  return <div className="intelliparser-mermaid-block" ref={containerRef} />;
}
