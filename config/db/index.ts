import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import type { Database } from "./types";


export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});
