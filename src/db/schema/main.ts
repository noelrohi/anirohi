import { float, int, serial, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";

export const histories = mySqlTable("history", {
  id: serial("id").primaryKey(),
  imageUrl: varchar("imageUrl", { length: 255 }),
  title: varchar("title", { length: 255 }),
  episodeNumber: int("episodeNumber").notNull(),
  progress: float("progress").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});
