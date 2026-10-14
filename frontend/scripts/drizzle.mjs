/**
 * Run drizzle-kit under Node with `.env.local` preloaded.
 *
 * Why this wrapper exists:
 * - drizzle-kit breaks silently under the Bun runtime (`migrate`/`push`
 *   exit 1 or report success without touching the database).
 * - plain `node` does not read `.env.local`, so drizzle.config.ts would fall
 *   back to its placeholder URL.
 *
 * Usage: `node scripts/drizzle.mjs <migrate|push|studio|generate|check> [...]`
 * If `.env.local` is absent (e.g. CI with real env vars), the process
 * environment is used as-is.
 */

import { existsSync } from "node:fs";
import { spawn } from "node:child_process";

if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

const child = spawn("drizzle-kit", process.argv.slice(2), {
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code) => process.exit(code ?? 1));
