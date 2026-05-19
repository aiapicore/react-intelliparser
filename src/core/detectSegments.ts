import type { ContentSegment, ContentSegmentType } from "../types";
import { isJson } from "./isJson";
import { isXml } from "./isXml";
import { isHtml } from "./isHtml";
import { isMarkdown } from "./isMarkdown";

/** Languages that map fenced block hints to a specific segment type. */
const TYPED_LANGUAGES: Record<string, ContentSegmentType> = {
  json: "json",
  xml: "xml",
  html: "html",
  svg: "xml",
  yaml: "yaml",
  yml: "yaml",
  csv: "csv",
  mermaid: "mermaid",
  math: "math",
  latex: "math",
};

const FENCED_BLOCK_RE = /^```([^\n]*)\n([\s\S]*?)^```/gm;

/**
 * Splits raw (normalized) content into ordered ContentSegment entries.
 *
 * Priority:
 *   1. Fenced code blocks  (``` … ```)
 *   2. JSON
 *   3. XML
 *   4. HTML
 *   5. YAML
 *   6. CSV / table-like
 *   7. Markdown
 *   8. URL
 *   9. Plain text
 */
export function detectSegments(content: string): ContentSegment[] {
  if (!content.trim()) return [];

  const segments: ContentSegment[] = [];
  let lastIndex = 0;

  // Reset regex state
  FENCED_BLOCK_RE.lastIndex = 0;

  let match: RegExpExecArray | null;

  while ((match = FENCED_BLOCK_RE.exec(content)) !== null) {
    const [fullMatch, rawLang, codeContent] = match;
    const matchStart = match.index;

    // Text before this fenced block
    if (matchStart > lastIndex) {
      const before = content.slice(lastIndex, matchStart).trimEnd();
      if (before.trim()) {
        classifyText(before.trim(), segments);
      }
    }

    const lang = rawLang.trim().toLowerCase();
    const code = codeContent.trimEnd();

    const segType: ContentSegmentType = TYPED_LANGUAGES[lang] ?? "code";

    segments.push({
      type: segType,
      content: code,
      language: lang || undefined,
    });

    lastIndex = matchStart + fullMatch.length;
  }

  // Remaining text after all fenced blocks
  if (lastIndex < content.length) {
    const remaining = content.slice(lastIndex).trimEnd();
    if (remaining.trim()) {
      classifyText(remaining.trim(), segments);
    }
  }

  return segments;
}

/**
 * Classifies a plain-text chunk (no fenced blocks) and appends to segments.
 */
function classifyText(text: string, segments: ContentSegment[]): void {
  if (isJson(text)) {
    segments.push({ type: "json", content: text, language: "json" });
  } else if (isXml(text)) {
    segments.push({ type: "xml", content: text, language: "xml" });
  } else if (isHtml(text)) {
    segments.push({ type: "html", content: text, language: "html" });
  } else if (isMarkdown(text)) {
    // Check Markdown before YAML: content with headings / emphasis / links is
    // almost certainly Markdown even if it contains "---" or "key: value" lines.
    segments.push({ type: "markdown", content: text });
  } else if (isYaml(text)) {
    segments.push({ type: "yaml", content: text, language: "yaml" });
  } else if (isCsv(text)) {
    segments.push({ type: "csv", content: text });
  } else if (isUrl(text)) {
    segments.push({ type: "url", content: text });
  } else {
    segments.push({ type: "text", content: text });
  }
}

// ─── Heuristic classifiers ────────────────────────────────────────────────────

function isYaml(text: string): boolean {
  // YAML: key: value pairs, --- separator, or list items with - prefix
  return /^---(\s|$)|^[a-zA-Z_][a-zA-Z0-9_\- ]*:\s+\S/m.test(text);
}

function isCsv(text: string): boolean {
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return false;

  // Check consistent comma-count across first 3 lines
  const counts = lines.slice(0, 3).map((l) => (l.match(/,/g) ?? []).length);
  return counts[0] > 0 && counts.every((c) => c === counts[0]);
}

function isUrl(text: string): boolean {
  const trimmed = text.trim();
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
