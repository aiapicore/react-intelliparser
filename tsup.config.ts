import { build, defineConfig, type Options } from "tsup";
import { copyFileSync, mkdirSync } from "fs";
import { join } from "path";

const sharedOptions: Options = {
  entry: ["src/index.ts"],
  dts: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  tsconfig: "tsconfig.build.json",
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
};

// Bundle the theme so native ESM consumers do not encounter extensionless
// deep imports from react-syntax-highlighter's styles directory.
const themeModules = /react-syntax-highlighter\/dist\/esm\/styles\/prism/;

export default defineConfig({
  ...sharedOptions,
  format: ["esm"],
  clean: true,
  noExternal: [themeModules],
  async onSuccess() {
    // Build CJS after ESM has cleaned dist. Compile ESM-only dependencies for
    // require() consumers while keeping the ESM entry small and tree-shakeable.
    await build({
      ...sharedOptions,
      config: false,
      format: ["cjs"],
      clean: false,
      noExternal: [
        themeModules,
        "react-markdown",
        "remark-gfm",
        "remark-math",
        "rehype-raw",
        "rehype-sanitize",
        "rehype-katex",
      ],
    });
    mkdirSync(join("dist", "styles"), { recursive: true });
    copyFileSync(
      join("src", "styles", "intelliparser.css"),
      join("dist", "styles", "intelliparser.css"),
    );
    console.log("CSS copied to dist/styles/intelliparser.css");
  },
});
