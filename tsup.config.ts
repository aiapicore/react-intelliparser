import { defineConfig } from "tsup";
import { copyFileSync, mkdirSync } from "fs";
import { join } from "path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  tsconfig: "tsconfig.build.json",
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
  async onSuccess() {
    mkdirSync(join("dist", "styles"), { recursive: true });
    copyFileSync(
      join("src", "styles", "intelliparser.css"),
      join("dist", "styles", "intelliparser.css")
    );
    console.log("CSS copied to dist/styles/intelliparser.css");
  },
});
