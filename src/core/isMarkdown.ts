/** Returns true if the text has Markdown-style markers. */
export function isMarkdown(text: string): boolean {
  // Headings, bold, italic, lists, blockquotes, links, inline-code, horizontal rules
  return /^#{1,6}\s|^\s*[-*+]\s|\*\*|__|\[.+]\(.+\)|^>\s|`[^`]|^\s*\d+\.\s|^---\s*$|^===\s*$/m.test(
    text
  );
}
