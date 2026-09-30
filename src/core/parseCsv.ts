/** Parses comma-separated rows, including escaped quotes and multiline cells. */
export function parseCsv(raw: string): string[][] | null {
  const text = raw.replace(/\r\n?/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let quoted = false;
  let afterQuote = false;

  function finishCell() {
    row.push(quoted ? cell : cell.trim());
    cell = "";
    quoted = false;
    afterQuote = false;
  }

  function finishRow() {
    if (row.length > 0 || cell.trim() || quoted) {
      finishCell();
      rows.push(row);
      row = [];
    } else {
      cell = "";
    }
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
          afterQuote = true;
        }
      } else {
        cell += char;
      }
    } else if (char === ",") {
      finishCell();
    } else if (char === "\n") {
      finishRow();
    } else if (afterQuote) {
      if (char !== " " && char !== "\t") return null;
    } else if (char === '"') {
      if (cell.trim()) return null;
      cell = "";
      inQuotes = true;
      quoted = true;
    } else {
      cell += char;
    }
  }

  if (inQuotes) return null;
  finishRow();
  return rows;
}
