import { createDatabaseIfNotExists, migrateToLatest } from "./migrations.js";

await createDatabaseIfNotExists("dalibo");
await migrateToLatest();
