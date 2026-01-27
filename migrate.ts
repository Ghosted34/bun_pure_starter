#!/usr/bin/env bun
import path from "path";

import { Migrator } from "./config/db/migrator";
import { db } from "./config/db";


const cmd = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];
const DATABASE_URL = process.env.DB_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL missing");
}

const migrator = new Migrator(
  db,
  path.resolve("migrations"),
  'users'
);
await migrator.init();

switch (cmd) {
      case "make":
        if (!arg1) {
          console.log("Usage: npm run migrate:make <migration_name>");
          console.log("Example: npm run migrate:make add_phone_to_users");
          process.exit(1);
        }
        await migrator.createMigration(arg1);
        break;

      case "up":
        if (arg1 === "all") {
          await migrator.runMigrations();
        } else if (arg1) {
          await migrator.runMigrations();
        } else {
          console.log("Usage: npm run migrate:up [database|all]");
          
          process.exit(1);
        }
        break;

      case "down":
        if (!arg1) {
          console.log("Usage: npm run migrate:down [database]");
         
          process.exit(1);
        }
        
        const steps = arg2 ? parseInt(arg2) : 1;
        await migrator.rollback( steps);
        break;

      case "status":
        if (arg1 === "all" || !arg1) {
          await migrator.status();
        } else {
      
          await migrator.status();
        }
        break;

      default:
        console.log("Migration Commands:");
        console.log("");
        console.log(
          "  npm run migrate:make <name>        - Create a new migration file",
        );
        console.log(
          "  npm run migrate:up [database|all]  - Run pending migrations",
        );
        console.log(
          "  npm run migrate:down [database]    - Rollback last batch",
        );
        console.log(
          "  npm run migrate:status [all]       - Check migration status",
        );
        console.log("");
        console.log("Examples:");
        console.log("  npm run migrate:make add_phone_to_users");
        console.log("  npm run migrate:up officers");
        console.log("  npm run migrate:up all");
        console.log("  npm run migrate:down officers");
        console.log("  npm run migrate:status all");
    }

process.exit(0);
