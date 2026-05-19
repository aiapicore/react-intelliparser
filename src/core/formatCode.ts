/** Basic code formatter – delegates to prettier when available at runtime. */
export async function formatCode(code: string, language: string): Promise<string> {
  try {
    // Dynamic import so the heavy prettier bundle is tree-shaken in environments
    // that do not need it.
    const prettier = await import("prettier/standalone");
    const plugins: unknown[] = [];

    if (["ts", "tsx", "typescript"].includes(language)) {
      const ts = await import("prettier/plugins/typescript");
      const babel = await import("prettier/plugins/babel");
      const estree = await import("prettier/plugins/estree");
      plugins.push(babel.default, estree.default, ts.default);
    } else if (["js", "jsx", "javascript"].includes(language)) {
      const babel = await import("prettier/plugins/babel");
      const estree = await import("prettier/plugins/estree");
      plugins.push(babel.default, estree.default);
    } else if (language === "css") {
      const css = await import("prettier/plugins/postcss");
      plugins.push(css.default);
    } else if (["html", "xml"].includes(language)) {
      const html = await import("prettier/plugins/html");
      plugins.push(html.default);
    } else if (language === "markdown" || language === "md") {
      const md = await import("prettier/plugins/markdown");
      plugins.push(md.default);
    } else {
      return code;
    }

    const parser = getParser(language);
    if (!parser) return code;

    return await (prettier as { format: (code: string, opts: object) => Promise<string> }).format(
      code,
      { parser, plugins }
    );
  } catch {
    return code;
  }
}

function getParser(language: string): string | null {
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    typescript: "typescript",
    js: "babel",
    jsx: "babel",
    javascript: "babel",
    css: "css",
    html: "html",
    xml: "html",
    markdown: "markdown",
    md: "markdown",
  };
  return map[language] ?? null;
}
