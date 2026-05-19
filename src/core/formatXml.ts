import { XMLParser, XMLBuilder } from "fast-xml-parser";

/** Formats an XML string with indentation. Returns original on failure. */
export function formatXml(raw: string): string {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      preserveOrder: true,
    });
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      preserveOrder: true,
      format: true,
      indentBy: "  ",
    });
    const parsed = parser.parse(raw.trim());
    return builder.build(parsed) as string;
  } catch {
    return raw;
  }
}
