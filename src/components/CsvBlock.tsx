import { useMemo } from "react";
import type { ContentSegment, IntelliParserOptions } from "../types";
import { parseCsv } from "../core/parseCsv";

interface CsvBlockProps {
  segment: ContentSegment;
  options?: IntelliParserOptions;
}

export function CsvBlock({ segment }: CsvBlockProps) {
  const rows = useMemo(() => parseCsv(segment.content), [segment.content]);

  if (rows === null) {
    return <pre className="intelliparser-text-block">{segment.content}</pre>;
  }
  if (rows.length === 0) return null;

  const [header, ...body] = rows;

  return (
    <div className="intelliparser-csv-block">
      <table className="intelliparser-table">
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th key={i}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
