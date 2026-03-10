import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString =
  process.env.NEXT_PUBLIC_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing database connection string. Set NEXT_PUBLIC_DATABASE_URL (client) or DATABASE_URL (server)."
  );
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
