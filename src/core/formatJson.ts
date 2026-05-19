/** Pretty-prints a JSON string. Returns the original string on failure. */
export function formatJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw.trim()), null, 2);
  } catch {
    return raw;
  }
}
