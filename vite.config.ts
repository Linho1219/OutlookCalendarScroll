import { defineConfig } from "vite";
import { resolve } from "path";
import { metadata } from "./userscript.meta";
import fs from "node:fs";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "OutlookScrollNav",
      formats: ["iife"],
      fileName: () => `outlook-calendar-scroll.user.js`,
    },
    outDir: "dist",
    minify: false,
    sourcemap: false,
    target: "es2020",
  },
  plugins: [
    {
      name: "userscript-metadata",
      writeBundle(_, bundle) {
        for (const fileName of Object.keys(bundle)) {
          if (fileName.endsWith(".user.js")) {
            const filePath = resolve(__dirname, "dist", fileName);
            const code = fs.readFileSync(filePath, "utf-8");
            if (!code.startsWith("// ==UserScript==")) {
              const newCode = `${metadata}\n\n${code}`;
              fs.writeFileSync(filePath, newCode, "utf-8");
              console.log(`· Injected metadata into ${fileName}`);
            }
          }
        }
      },
    },
  ],
});
