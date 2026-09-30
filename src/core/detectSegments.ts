import type { ContentSegment, ContentSegmentType } from "../types";
import { isJson } from "./isJson";
import { isXml } from "./isXml";
import { isHtml } from "./isHtml";
import { isMarkdown } from "./isMarkdown";
import { load } from "js-yaml";
import { parseCsv } from "./parseCsv";

/** Languages that map fenced block hints to a specific segment type. */
const TYPED_LANGUAGES = new Map<string, ContentSegmentType>([
  ["json", "json"],
  ["xml", "xml"],
  ["html", "html"],
  ["svg", "xml"],
  ["yaml", "yaml"],
  ["yml", "yaml"],
  ["csv", "csv"],
  ["mermaid", "mermaid"],
  ["math", "math"],
  ["latex", "math"],
  ["markdown", "markdown"],
  ["md", "markdown"],
  ["text", "text"],
  ["txt", "text"],
  ["plaintext", "text"],
]);

/**
 * Splits raw (normalized) content into ordered ContentSegment entries.
 *
 * Priority:
 *   1. Fenced blocks and display math (``` … ```, ~~~ … ~~~, $$ … $$)
 *   2. JSON
 *   3. HTML
 *   4. XML
 *   5. YAML
 *   6. CSV
 *   7. Markdown
 *   8. URL
 *   9. Plain text
 */
export function detectSegments(content: string): ContentSegment[] {
  if (!content.trim()) return [];

  const segments: ContentSegment[] = [];
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  let pending: string[] = [];

  function flushText() {
    const text = pending.join("\n").trim();
    if (text) classifyText(text, segments);
    pending = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const fence = /^( {0,3})(`{3,}|~{3,})([^\n]*)$/.exec(lines[i]);
    // A backtick fence's info string may not itself contain a backtick.
    if (fence && !(fence[2][0] === "`" && fence[3].includes("`"))) {
      flushText();
      const indent = fence[1].length;
      const marker = fence[2];
      const lang = fence[3].trim().split(/\s+/)[0].toLowerCase();
      const closing = new RegExp(
        `^ {0,3}${marker[0]}{${marker.length},}[\\t ]*$`,
      );
      const indentation = new RegExp(`^ {0,${indent}}`);
      const body: string[] = [];
      for (i++; i < lines.length && !closing.test(lines[i]); i++) {
        // Remove up to the opener's indentation, preserving code indentation.
        body.push(lines[i].replace(indentation, ""));
      }
      segments.push({
        type: TYPED_LANGUAGES.get(lang) ?? "code",
        content: body.join("\n").trimEnd(),
        language: lang || undefined,
      });
      continue;
    }

    const singleLineMath = /^ {0,3}\$\$(.+?)\$\$[\t ]*$/.exec(lines[i]);
    if (singleLineMath) {
      flushText();
      segments.push({
        type: "math",
        content: singleLineMath[1].trim(),
        language: "math",
      });
      continue;
    }
    if (/^ {0,3}\$\$[\t ]*$/.test(lines[i])) {
      let end = i + 1;
      while (end < lines.length && !/^ {0,3}\$\$[\t ]*$/.test(lines[end]))
        end++;
      if (end < lines.length) {
        flushText();
        segments.push({
          type: "math",
          content: lines
            .slice(i + 1, end)
            .join("\n")
            .trim(),
          language: "math",
        });
        i = end;
        continue;
      }
    }
    pending.push(lines[i]);
  }
  flushText();
  return segments;
}

/**
 * Classifies a plain-text chunk (no fenced blocks) and appends to segments.
 */
function classifyText(text: string, segments: ContentSegment[]): void {
  if (isJson(text)) {
    segments.push({ type: "json", content: text, language: "json" });
  } else if (isHtml(text)) {
    segments.push({ type: "html", content: text, language: "html" });
  } else if (isXml(text)) {
    segments.push({ type: "xml", content: text, language: "xml" });
  } else if (isYaml(text)) {
    segments.push({ type: "yaml", content: text, language: "yaml" });
  } else if (isCsv(text)) {
    segments.push({ type: "csv", content: text });
  } else if (isMarkdown(text)) {
    segments.push({ type: "markdown", content: text });
  } else if (isUrl(text)) {
    segments.push({ type: "url", content: text });
  } else {
    segments.push({ type: "text", content: text });
  }
}

// ─── Heuristic classifiers ────────────────────────────────────────────────────

function isYaml(text: string): boolean {
  // Require a document marker or a compact mapping key at the start. Long
  // sentence-shaped keys are ambiguous and should use an explicit YAML fence.
  const firstLine = text
    .split("\n")
    .find((line) => line.trim() && !/^\s*#/.test(line));
  if (
    !firstLine ||
    !/^(?:---[\t ]*$|[a-zA-Z_][a-zA-Z0-9_-]*:(?:[\t ]|$)|["'][^"']+["']:(?:[\t ]|$))/.test(
      firstLine,
    )
  ) {
    return false;
  }
  try {
    const value: unknown = load(text);
    return (
      value !== null && typeof value === "object" && !(value instanceof Date)
    );
  } catch {
    return false;
  }
}

function isCsv(text: string): boolean {
  const rows = parseCsv(text);
  if (!rows || rows.length < 2 || rows[0].length < 2) return false;
  // Inspect every row, and require compact labels in the header. Sentence
  // punctuation and paragraph breaks are weak evidence for a data table.
  return (
    !/\n[\t ]*\n/.test(text) &&
    rows.every((row) => row.length === rows[0].length) &&
    rows[0].every(
      (cell) =>
        /^[\p{L}\p{N}_][\p{L}\p{N}_ /().%$-]*$/u.test(cell) &&
        !/[.!?]$/.test(cell),
    )
  );
}

function isUrl(text: string): boolean {
  const trimmed = text.trim();
  if (/\s/.test(trimmed)) return false;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
