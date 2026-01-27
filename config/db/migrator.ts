import { Kysely, sql } from "kysely";
import { mkdir, writeFile, access, readdir, readFile } from "fs/promises";
import path from "path";
import { config } from "../../src/config";
import { ensureDatabase } from ".";

export interface MigrationRow {
  id: number;
  name: string;
  batch: number;
  executed_at: Date;
}

export interface DatabaseConfig {
  name: string;
  url: string;
}

export class Migrator {
  private initialized = false;
  constructor(
    private db: Kysely<any>,
    private migrationsDir: string,
    private databaseName: string,
  ) {
  
  }
   async init() {
    if (this.initialized) return;

    await ensureDatabase(config.psql.url||'');
    this.initialized = true;
  }

  /* ---------------------------------- */
  /* Internal helpers                    */
  /* ---------------------------------- */

  private async ensureMigrationsTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        batch INT NOT NULL,
        executed_at TIMESTAMP DEFAULT now()
      )
    `.execute(this.db);
  }

  private async getLastBatch(): Promise<number> {
    const row = await this.db
      .selectFrom("migrations")
      .select(sql<number>`max(batch)`.as("b"))
      .executeTakeFirst();
    return row?.b ?? 0;
  }

  private async getExecutedMigrations(): Promise<MigrationRow[]> {
    return (await this.db
      .selectFrom("migrations")
      .selectAll()
      .orderBy("id")
      .execute()) as MigrationRow[];
  }

  private async getMigrationFiles(): Promise<string[]> {
    return (await readdir(this.migrationsDir))
      .filter((f) => f.endsWith(".sql"))
      .sort();
  }

  private async parseMigration(file: string) {
    const content = await readFile(path.join(this.migrationsDir, file), "utf8");

    const up =
      content.match(/-- UP\s*([\s\S]*?)(-- DOWN|$)/i)?.[1]?.trim() ?? "";
    const down = content.match(/-- DOWN\s*([\s\S]*?)$/i)?.[1]?.trim() ?? "";

    if (!up) {
      throw new Error(`❌ Migration ${file} missing -- UP section`);
    }

    return { up, down };
  }

  /* ---------------------------------- */
  /* Public API                          */
  /* ---------------------------------- */

  async runMigrations() {
    await this.ensureMigrationsTable();

    const files = await this.getMigrationFiles();
    const executed = await this.getExecutedMigrations();
    const executedNames = new Set(executed.map((m) => m.name));

    const pending = files.filter((f) => !executedNames.has(f));

    if (!pending.length) {
      console.log(`✅ ${this.databaseName}: No pending migrations`);
      return;
    }

    const batch = (await this.getLastBatch()) + 1;

    console.log(
      `📋 ${this.databaseName}: Running ${pending.length} migration(s) (Batch ${batch})`,
    );

    for (const file of pending) {
      await this.executeMigration(file, batch);
    }

    console.log(`✅ ${this.databaseName}: Batch ${batch} completed`);
  }

  async executeMigration(file: string, batch: number) {
    const { up } = await this.parseMigration(file);

    await this.db.transaction().execute(async (trx) => {
      await sql.raw(up).execute(trx);

      await trx
        .insertInto("migrations")
        .values({ name: file, batch })
        .execute();
    });

    console.log(`  ✓ ${file}`);
  }

  async rollback(steps = 1) {
    await this.ensureMigrationsTable();

    const executed = await this.getExecutedMigrations();
    if (!executed.length) {
      console.log("✅ No migrations to rollback");
      return;
    }

    const lastBatch = await this.getLastBatch();
    const toRollback = executed
      .filter((m) => m.batch === lastBatch)
      .slice(0, steps)
      .reverse();

    if (!toRollback.length) {
      console.log("✅ No migrations in last batch");
      return;
    }

    console.log(
      `⚠️  ${this.databaseName}: Rolling back ${toRollback.length} migration(s)`,
    );

    for (const migration of toRollback) {
      await this.rollbackMigration(migration);
    }

    console.log(`✅ ${this.databaseName}: Rollback complete`);
  }

  async rollbackMigration(migration: MigrationRow) {
    const { down } = await this.parseMigration(migration.name);

    if (!down) {
      throw new Error(`❌ Migration ${migration.name} missing -- DOWN section`);
    }

    await this.db.transaction().execute(async (trx) => {
      await sql.raw(down).execute(trx);

      await trx
        .deleteFrom("migrations")
        .where("name", "=", migration.name)
        .execute();
    });

    console.log(`  ↩ ${migration.name}`);
  }

  async status() {
    await this.ensureMigrationsTable();

    const executed = await this.getExecutedMigrations();
    const files = await this.getMigrationFiles();

    const executedNames = new Set(executed.map((m) => m.name));
    const pending = files.filter((f) => !executedNames.has(f));

    console.log("\n" + "=".repeat(50));
    console.log(`📊 MIGRATION STATUS - ${this.databaseName}`);
    console.log("=".repeat(50));

    console.log(`\n✓ Executed (${executed.length}):`);
    if (!executed.length) console.log("  (none)");

    const batches: Record<number, string[]> = {};
    for (const m of executed) {
      batches[m.batch] ??= [];
      batches[m.batch]?.push(m.name);
    }

    Object.entries(batches).forEach(([batch, migrations]) => {
      console.log(`\n  Batch ${batch}:`);
      migrations.forEach((m) => console.log(`    ✓ ${m}`));
    });

    console.log(`\n⧗ Pending (${pending.length}):`);
    if (!pending.length) console.log("  (none)");
    pending.forEach((m) => console.log(`  - ${m}`));

    console.log("");
  }

  async createMigration(name: string) {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\..+/, "")
      .replace("T", "_");

    const filename = `${timestamp}_${name}.sql`;
    const filepath = path.join(this.migrationsDir, filename);

    // Ensure migrations directory exists
    await mkdir(this.migrationsDir, { recursive: true });

    // Prevent accidental overwrite
    try {
      await access(filepath);
      throw new Error(`Migration already exists: ${filename}`);
    } catch {
      // file does not exist → safe to continue
    }

    const template = `-- Migration: ${name}
-- Created: ${new Date().toISOString()}

-- UP
-- Write schema changes here


-- DOWN
-- Write rollback logic here
`;

    await writeFile(filepath, template, { encoding: "utf8", flag: "wx" });

    console.log(`✓ Created migration: ${filename}`);
    console.log(`📝 Location: ${filepath}`);
  }
}
