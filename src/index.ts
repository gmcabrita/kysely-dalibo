import { db } from "../db/database.js";
import { daliboExplain } from "../db/dalibo.js";

const query = db.selectFrom("users").where("id", "=", "1").select(["id", "email"]);
await daliboExplain(query);

db.destroy();
