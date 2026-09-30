import { XMLValidator } from "fast-xml-parser";
import { isHtml } from "./isHtml";

/** Returns true if the string is well-formed XML (but not HTML). */
export function isXml(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed.startsWith("<") || isHtml(trimmed)) {
    return false;
  }
  // Must have at least one tag
  if (!/^<[a-zA-Z?!]/.test(trimmed)) return false;

  try {
    // Parsing alone accepts malformed markup; validate before choosing XML.
    return XMLValidator.validate(trimmed) === true;
  } catch {
    return false;
  }
}
