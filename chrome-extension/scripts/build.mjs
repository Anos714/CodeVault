/**
 * Bundle the four extension surfaces into `dist/`.
 *
 * The manifest, HTML, and CSS stay at the folder root so Chrome can load the
 * whole folder unpacked. `npm run build` then `Load unpacked` is the local
 * workflow; `npm run watch` rebuilds on save.
 */

import { rm } from "node:fs/promises";

import { build, context } from "esbuild";

const options = {
  entryPoints: {
    background: "src/background.ts",
    popup: "src/popup.ts",
    options: "src/options.ts",
    save: "src/save.ts",
  },
  outdir: "dist",
  bundle: true,
  format: "esm",
  target: ["chrome114"],
  sourcemap: true,
  logLevel: "info",
};

await rm("dist", { recursive: true, force: true });

if (process.argv.includes("--watch")) {
  const ctx = await context(options);
  await ctx.watch();
  console.log("Watching src/ — reload the extension after changes.");
} else {
  await build(options);
  console.log("Built dist/ — load this folder unpacked in chrome://extensions.");
}
