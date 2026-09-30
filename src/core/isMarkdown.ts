const MARKDOWN_PATTERNS = [
  // Headings, lists, blockquotes, rules, and setext headings.
  /^ {0,3}(?:#{1,6}[\t ]+|[-*+][\t ]+|\d{1,9}[.)][\t ]+|>)/m,
  /^ {0,3}(?:(?:\*[\t ]*){3,}|(?:-[\t ]*){3,}|(?:_[\t ]*){3,})$/m,
  /\S[^\n]*\n {0,3}(?:=+|-+)[\t ]*$/m,
  // Paired inline markers, rather than an isolated '**' or identifier '_'.
  /(?<!\\)(\*\*|__)(?=\S)(?:[^\n]*?\S)?\1/,
  /(?<![\\*])\*(?!\*)\S(?:[^*\n]*?\S)?\*(?!\*)/,
  /(?<![\w\\_])_(?!_)\S(?:[^_\n]*?\S)?_(?![\w_])/,
  /(?<!\\)~~\S(?:[^\n]*?\S)?~~/,
  /(?<!\\)(`+)[^`\n]+\1/,
  /!?\[[^\]\n]*\]\([^\n)]+\)/,
  /^ {0,3}\[[^\]\n]+\]:[\t ]*\S/m,
  /<https?:\/\/[^\s<>]+>/i,
  /(?<!\\)\$\$[^$\n]+\$\$/,
  // A table header followed by a GFM delimiter row.
  /\|[^\n]*\n {0,3}\|?[\t ]*:?-{3,}:?[\t ]*(?:\|[\t ]*:?-{3,}:?[\t ]*)+\|?[\t ]*$/m,
  // Inline math; spaces next to '$' and a following digit prevent currency matches.
  /(?<![\\$])\$(?!\$)\S(?:[^$\n]*?\S)?\$(?![$\d])/,
];

/** Returns true if the text has Markdown-style markers. */
export function isMarkdown(text: string): boolean {
  return MARKDOWN_PATTERNS.some((pattern) => pattern.test(text));
}
