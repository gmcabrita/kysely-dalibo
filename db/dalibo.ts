import type { SelectQueryBuilder } from "kysely";
import { sql } from "kysely";

export async function daliboExplain<DB, TB extends keyof DB, O>(query: SelectQueryBuilder<DB, TB, O>) {
  const rawSqlQuery = query.compile();
  const explainResults = await query.explain("json", sql`analyze, costs, verbose, buffers`);

  const response = await fetch("https://explain.dalibo.com/new", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      plan: JSON.stringify((explainResults as any)[0]["QUERY PLAN"]),
      query: rawSqlQuery.sql,
      title: `${new Date().getTime()}`,
    }),
    redirect: "manual",
  });

  if (response.status == 302) {
    process.stdout.write(`https://explain.dalibo.com${response.headers.get("location")}\n`);
  } else {
    process.stderr.write(`${await response.text()}\n`);
    throw new Error("Failed to upload to Dalibo!");
  }
}
