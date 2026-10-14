import { defineConfig } from "drizzle-kit";

/**
 * drizzle-kit talks to Neon over a regular Postgres connection (it needs the
 * full SQL wire protocol, which the HTTP driver doesn't offer), so point it at
 * the *unpooled* endpoint. The app itself uses the pooled HTTP driver — see
 * src/server/db/index.ts.
 *
 * Bun loads .env.local automatically when running these commands; plain node
 * (npx drizzle-kit) does not, so prefer `bun run db:*`.
 */

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL_UNPOOLED ??
      process.env.DATABASE_URL ??
      "postgres://user:pass@host/db?sslmode=require",
  },
  verbose: true,
  strict: true,
});
