/**
 * Normalizes raw content: unified line endings and trims trailing whitespace.
 * Also detects serialized/escaped strings (e.g. LLM API responses where
 * newlines are literal \n and quotes are \") and unescapes them first.
 */
export function normalizeContent(content: string): string {
  // Detect serialized content: has literal \n (backslash+n) but no real newlines.
  // This happens when an API response is stored/transmitted as a JSON-escaped string.
  const hasEscapedNewlines = content.includes("\\n");
  const hasRealNewlines = content.includes("\n");

  if (hasEscapedNewlines && !hasRealNewlines) {
    content = content
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\r/g, "\r")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }

  return content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trimEnd();
}
