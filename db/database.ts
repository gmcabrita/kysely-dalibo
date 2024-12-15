import type { DB } from "./types.js";
import pg from "pg";
const { Pool } = pg;
import { Kysely, PostgresDialect, CamelCasePlugin } from "kysely";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: "dalibo",
    host: "localhost",
    user: "postgres",
    port: 5432,
    max: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
  plugins: [new CamelCasePlugin()],
  log: ["query", "error"],
});
