import { relations, type InferInsertModel } from "drizzle-orm";
import {
  float,
  index,
  int,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { mySqlTable } from "./_table";
import { users } from "./auth";

export const histories = mySqlTable(
  "history",
  {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 255 }),
    slug: varchar("slug", { length: 255 }).notNull(),
    pathname: varchar("pathname", { length: 255 }).notNull(),
    episodeNumber: int("episode_number").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    image: varchar("image", { length: 255 }),
    progress: float("progress").notNull(),
    duration: float("duration").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      pathIdx: index("path_idx").on(table.pathname),
      slugIdx: index("slug_idx").on(table.slug),
    };
  }
);

export type InsertHistory = InferInsertModel<typeof histories>;

export const watchListRelations = relations(histories, ({ one }) => ({
  user: one(users, { fields: [histories.userId], references: [users.id] }),
}));
