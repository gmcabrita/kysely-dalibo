import { createDatabaseIfNotExists, rollbackMigration } from "./migrations.js";

await createDatabaseIfNotExists("dalibo");
await rollbackMigration();
