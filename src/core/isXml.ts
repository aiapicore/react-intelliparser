import { XMLParser } from "fast-xml-parser";

/** Returns true if the string is well-formed XML (but not HTML). */
export function isXml(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed.startsWith("<") || trimmed.startsWith("<!DOCTYPE html")) {
    return false;
  }
  // Must have at least one tag
  if (!/^<[a-zA-Z?!]/.test(trimmed)) return false;

  try {
    const parser = new XMLParser({ ignoreAttributes: false });
    const result = parser.parse(trimmed);
    // If parsing yields a non-empty object it's likely valid XML
    return result !== null && typeof result === "object" && Object.keys(result).length > 0;
  } catch {
    return false;
  }
}
