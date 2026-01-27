import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import type { Database } from "./types";
import { config } from "../../src/config";

export async function ensureDatabase(databaseUrl: string) {
  if (!databaseUrl || databaseUrl === "") {
    throw "db url missing";
  }
  const url = new URL(databaseUrl);
  const dbName = url.pathname.slice(1);

  // Connect to default postgres DB
  url.pathname = "/postgres";

  const pool = new pg.Pool({
    connectionString: url.toString(),
  });

  try {
    const res = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName],
    );

    if (res.rowCount === 0) {
      console.log(`🗄️  Creating database: ${dbName}`);
      await pool.query(`CREATE DATABASE "${dbName}"`);
    } else {
      console.log(`✓ Database exists: ${dbName}`);
    }
  } finally {
    await pool.end();
  }
}

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: config.psql.url,
    }),
  }),
});
