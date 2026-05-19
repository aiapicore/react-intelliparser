/**
 * Strips dangerous constructs from an HTML string without relying on the DOM.
 * For full server-side use; in browser contexts rehype-sanitize handles this.
 */
export function sanitizeHtml(html: string): string {
  return html
    // Remove script elements and their content
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    // Remove style elements
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    // Remove iframes
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    // Remove on* event attributes
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    // Remove javascript: URLs
    .replace(/href\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, 'href="#"')
    // Remove src with javascript
    .replace(/src\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, "");
}
