import { useMemo } from "react";
import type { ContentSegment, IntelliParserOptions } from "../types";

interface CsvBlockProps {
  segment: ContentSegment;
  options?: IntelliParserOptions;
}

function parseCsv(raw: string): string[][] {
  return raw
    .split("\n")
    .filter((l) => l.trim())
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

export function CsvBlock({ segment, options: _options }: CsvBlockProps) {
  const rows = useMemo(() => parseCsv(segment.content), [segment.content]);

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
