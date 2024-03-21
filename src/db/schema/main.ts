import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
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
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => {
    return {
      pathIdx: index("path_idx").on(table.pathname),
      slugIdx: index("slug_idx").on(table.slug),
    };
  },
);

export const anime = mySqlTable(
  "anime",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    image: varchar("image", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
    episodes: int("episodes").notNull(),
    anilistId: int("anilist_id").notNull().unique(),
  },
  (table) => {
    return {
      slugIdx: index("slug_idx").on(table.slug),
      anilistIdx: index("anilist_idx").on(table.anilistId),
    };
  },
);

export type NewAnime = typeof anime.$inferInsert;

export const comments = mySqlTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    episodeNumber: int("episode_number").notNull(),
    text: varchar("text", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => {
    return {
      slugIdx: index("slug_idx").on(table.slug),
      userIdx: index("user_idx").on(table.userId),
    };
  },
);

export type Comments = InferSelectModel<typeof comments>;
export type CommentsWithUser = Comments & {
  user: InferSelectModel<typeof users> | null;
};

export type InsertComments = InferInsertModel<typeof comments>;

export const commentRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }),
}));

export type InsertHistory = InferInsertModel<typeof histories>;

export const watchListRelations = relations(histories, ({ one }) => ({
  user: one(users, { fields: [histories.userId], references: [users.id] }),
}));
