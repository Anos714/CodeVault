/**
 * Drizzle client over Neon's HTTP driver.
 *
 * The HTTP (fetch-based) driver is what Neon recommends for serverless and
 * edge runtimes: no TCP pool to keep warm, no connection count pressure, and
 * it works identically in a route handler and in `next/og`.
 *
 * Import this only from server code — server components, server actions,
 * route handlers, and `scripts/`. Client components must never reach in here;
 * they get their data as props or through actions.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and fill in the Neon connection string.",
  );
}

export const db = drizzle(neon(connectionString), { schema });

export type Database = typeof db;
