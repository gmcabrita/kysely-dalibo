import * as fs from "fs/promises";
import * as path from "path";

async function generateMigration() {
  const timestamp = new Date().getTime();
  const name = process.argv[2];

  if (!name) {
    console.error("Please provide a migration name");
    process.exit(1);
  }

  const filename = `${timestamp}_${name}.ts`;
  const migrationPath = path.join(process.cwd(), "db", "migrations", filename);

  const template = `
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Your migration code here
}

export async function down(db: Kysely<any>): Promise<void> {
  // Rollback code here
}
`;

  await fs.writeFile(migrationPath, template);
  console.log(`Generated migration: ${filename}`);
}

generateMigration().catch(console.error);
