/**
 * Bundle the extension host entry point.
 *
 * `vscode` is provided by the editor at runtime and must stay external.
 * Output is CommonJS at `dist/extension.js`, which is what `main` points to.
 */

import { rm } from "node:fs/promises";

import { build, context } from "esbuild";

const options = {
  entryPoints: ["src/extension.ts"],
  outfile: "dist/extension.js",
  bundle: true,
  format: "cjs",
  platform: "node",
  target: ["node20"],
  external: ["vscode"],
  sourcemap: true,
  logLevel: "info",
};

await rm("dist", { recursive: true, force: true });

if (process.argv.includes("--watch")) {
  const ctx = await context(options);
  await ctx.watch();
  console.log("Watching src/ — press F5 to launch the Extension Development Host.");
} else {
  await build(options);
  console.log("Built dist/extension.js.");
}
