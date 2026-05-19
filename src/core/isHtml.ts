/** Returns true if the string looks like an HTML document or fragment. */
export function isHtml(text: string): boolean {
  const trimmed = text.trim().toLowerCase();
  return (
    trimmed.startsWith("<!doctype html") ||
    trimmed.startsWith("<html") ||
    /^<(div|span|p|ul|ol|li|table|thead|tbody|tr|td|th|h[1-6]|form|input|button|section|article|main|header|footer|nav|aside)\b/i.test(
      trimmed
    )
  );
}
