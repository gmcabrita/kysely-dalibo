import * as path from "path";
import { promises as fs } from "fs";
import pg from "pg";
const { Pool } = pg;
import { db } from "./database.js";
import { Kysely, PostgresDialect, Migrator, CamelCasePlugin, FileMigrationProvider } from "kysely";

interface DefaultDatabase {}

export const defaultDb = new Kysely<DefaultDatabase>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: "localhost",
      database: "postgres", // Connect to default database
      user: "postgres",
      port: 5432,
    }),
  }),
  plugins: [new CamelCasePlugin()],
});

export async function createDatabaseIfNotExists(databaseName: string) {
  try {
    await defaultDb.executeQuery({
      sql: `CREATE DATABASE "${databaseName}" WITH ENCODING 'UTF8'`,
      parameters: [],
      query: {
        kind: "RawNode",
        sqlFragments: [`CREATE DATABASE "${databaseName}" WITH ENCODING 'UTF8'`],
        parameters: [],
      },
    });
    console.log(`Database '${databaseName}' created successfully`);
  } catch (error: any) {
    if (error.code === "42P04") {
      // PostgreSQL error code for duplicate database
      console.log(`Database '${databaseName}' already exists`);
    } else {
      throw error;
    }
  } finally {
    // Don't forget to destroy the connection pool
    await defaultDb.destroy();
  }
}

export function getMigrator() {
  return new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(process.cwd(), "dist", "db", "migrations"),
    }),
  });
}

export async function migrateToLatest() {
  const migrator = getMigrator();

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

export async function rollbackMigration() {
  const migrator = getMigrator();

  const { error, results } = await migrator.migrateDown();

  if (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }

  results?.forEach((migration) => {
    console.log(`Rolled back: ${migration.migrationName}`);
  });

  await db.destroy();
}
