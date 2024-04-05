import {
  decimal,
  index,
  integer,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { projectTable } from "./_table";
import { users } from "./auth";

export const histories = projectTable(
  "history",
  {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 255 }),
    slug: varchar("slug", { length: 255 }).notNull(),
    pathname: varchar("pathname", { length: 255 }).notNull(),
    episodeNumber: integer("episode_number").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    image: varchar("image", { length: 255 }),
    progress: decimal("progress").notNull(),
    duration: decimal("duration").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  },
  (table) => {
    return {
      pathIdx: index("path_idx").on(table.pathname),
    };
  },
);

export const anime = projectTable(
  "anime",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    image: varchar("image", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
    episodes: integer("episodes").notNull(),
    anilistId: integer("anilist_id").notNull().unique(),
  },
  (table) => {
    return {
      slugIdx: index("slug_idx").on(table.slug),
      anilistIdx: index("anilist_idx").on(table.anilistId),
    };
  },
);

export type NewAnime = typeof anime.$inferInsert;

export const comments = projectTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    episodeNumber: integer("episode_number").notNull(),
    text: varchar("text", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  },
  (table) => {
    return {
      userIdx: index("user_idx").on(table.userId),
    };
  },
);

export type Comments = typeof comments.$inferSelect;
export type CommentsWithUser = Comments & {
  user: typeof users.$inferSelect | null;
};

export type InsertComments = typeof comments.$inferInsert;

export type InsertHistory = typeof histories.$inferInsert;
