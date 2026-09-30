const HTML_TAGS = new Set(
  (
    "a abbr address area article aside audio b base bdi bdo blockquote body br " +
    "button canvas caption cite code col colgroup data datalist dd del details " +
    "dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 " +
    "h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd label " +
    "legend li link main map mark menu meta meter nav noscript object ol optgroup " +
    "option output p picture pre progress q rp rt ruby s samp script search " +
    "section select slot small source span strong style sub summary sup table " +
    "tbody td template textarea tfoot th thead time title tr track u ul var video wbr"
  ).split(" "),
);

/** Returns true if the string starts with an HTML document or known HTML tag. */
export function isHtml(text: string): boolean {
  const trimmed = text.trim().replace(/^(?:<!--[\s\S]*?-->\s*)+/, "");
  if (/^<!doctype\s+html\b/i.test(trimmed)) return true;
  const tag = /^<([a-z][a-z0-9]*)(?=[\s/>])[^>]*>/i.exec(trimmed);
  return tag !== null && HTML_TAGS.has(tag[1].toLowerCase());
}
