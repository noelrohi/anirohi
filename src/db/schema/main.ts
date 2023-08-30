import { json, serial, varchar } from "drizzle-orm/mysql-core";

import { HistoryItem } from "@/types";
import { mySqlTable } from "./_table";

export const histories = mySqlTable("history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }),
  medias: json("medias").$type<HistoryItem[] | null>().default(null),
});
