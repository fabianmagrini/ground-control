import "@tanstack/react-start/server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5432/intelligence_ops";

const sql = postgres(databaseUrl, {
  max: 5,
  prepare: false,
});

export const db = drizzle(sql, { schema });
export { sql };
