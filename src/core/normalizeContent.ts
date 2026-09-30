/**
 * Normalizes raw content: unified line endings and trims trailing whitespace.
 * Also detects serialized/escaped strings (e.g. LLM API responses where
 * newlines are literal \n and quotes are \") and unescapes them first.
 */
export function normalizeContent(content: string): string {
  let parsedJson = false;
  try {
    const parsed: unknown = JSON.parse(content);
    parsedJson = true;
    // Decode serialized strings once; preserve escape sequences inside objects
    // and arrays, where '\n' belongs to the data rather than the transport.
    if (typeof parsed === "string") content = parsed;
  } catch {
    // Most inputs are prose or bare escaped API strings rather than JSON.
  }
  // Detect serialized content: has literal \n (backslash+n) but no real newlines.
  // This happens when an API response is stored/transmitted as a JSON-escaped string.
  const hasEscapedNewlines = content.includes("\\n");
  const hasRealNewlines = content.includes("\n");

  if (!parsedJson && hasEscapedNewlines && !hasRealNewlines) {
    // Decode complete escape tokens in one pass. Sequential replacements turn
    // an escaped backslash followed by 'n' into a newline inside source code.
    content = content.replace(
      /\\(?:["\\/bfnrt]|u[\da-fA-F]{4})/g,
      (token) => JSON.parse(`"${token}"`) as string,
    );
  }

  return content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trimEnd();
}
