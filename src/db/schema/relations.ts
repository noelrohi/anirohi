import { relations } from "drizzle-orm";
import { users } from "./auth";
import { comments, histories } from "./main";

export const watchListRelations = relations(histories, ({ one }) => ({
  user: one(users, { fields: [histories.userId], references: [users.id] }),
}));

export const commentRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }),
}));
