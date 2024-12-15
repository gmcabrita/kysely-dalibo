import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "bigint", (col) => col.primaryKey().generatedAlwaysAsIdentity())
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(db.fn("now")))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(db.fn("now")))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("users").execute();
}
