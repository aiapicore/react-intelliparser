import { useMemo } from "react";
import { detectSegments } from "../core/detectSegments";
import { normalizeContent } from "../core/normalizeContent";
import { defaultOptions, type IntelliParserProps } from "../types";
import { CodeBlock } from "./CodeBlock";
import { HtmlBlock } from "./HtmlBlock";
import { XmlBlock } from "./XmlBlock";
import { JsonBlock } from "./JsonBlock";
import { YamlBlock } from "./YamlBlock";
import { CsvBlock } from "./CsvBlock";
import { MermaidBlock } from "./MermaidBlock";
import { MathBlock } from "./MathBlock";
import { TextBlock } from "./TextBlock";
import { MarkdownBlock } from "./MarkdownBlock";

export function IntelliParser({ content, options, className, renderers }: IntelliParserProps) {
  const mergedOptions = useMemo(
    () => ({ ...defaultOptions, ...options }),
    [options]
  );

  const segments = useMemo(
    () => detectSegments(normalizeContent(content)),
    [content]
  );

  return (
    <div className={`intelliparser${className ? ` ${className}` : ""}`}>
      {segments.map((segment, index) => {
        const CustomRenderer = renderers?.[segment.type];

        if (CustomRenderer) {
          return (
            <CustomRenderer key={index} segment={segment} options={mergedOptions} />
          );
        }

        switch (segment.type) {
          case "markdown":
            return (
              <MarkdownBlock key={index} segment={segment} options={mergedOptions} />
            );
          case "html":
            return mergedOptions.enableHtml ? (
              <HtmlBlock key={index} segment={segment} options={mergedOptions} />
            ) : (
              <TextBlock key={index} segment={segment} options={mergedOptions} />
            );
          case "xml":
            return mergedOptions.enableXml ? (
              <XmlBlock key={index} segment={segment} options={mergedOptions} />
            ) : (
              <TextBlock key={index} segment={segment} options={mergedOptions} />
            );
          case "json":
            return mergedOptions.enableJson ? (
              <JsonBlock key={index} segment={segment} options={mergedOptions} />
            ) : (
              <TextBlock key={index} segment={segment} options={mergedOptions} />
            );
          case "yaml":
            return mergedOptions.enableYaml ? (
              <YamlBlock key={index} segment={segment} options={mergedOptions} />
            ) : (
              <TextBlock key={index} segment={segment} options={mergedOptions} />
            );
          case "csv":
            return mergedOptions.enableCsv ? (
              <CsvBlock key={index} segment={segment} options={mergedOptions} />
            ) : (
              <TextBlock key={index} segment={segment} options={mergedOptions} />
            );
          case "code":
            return (
              <CodeBlock key={index} segment={segment} options={mergedOptions} />
            );
          case "mermaid":
            return (
              <MermaidBlock key={index} segment={segment} options={mergedOptions} />
            );
          case "math":
            return (
              <MathBlock key={index} segment={segment} options={mergedOptions} />
            );
          case "url":
            return (
              <p key={index} className="intelliparser-url-block">
                <a href={segment.content} target="_blank" rel="noopener noreferrer">
                  {segment.content}
                </a>
              </p>
            );
          default:
            return <TextBlock key={index} segment={segment} options={mergedOptions} />;
        }
      })}
    </div>
  );
}
