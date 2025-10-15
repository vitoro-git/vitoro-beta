import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const chatLog = pgTable("chat_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
  iTokens: integer("i_tokens").notNull(),
  oTokens: integer("o_tokens").notNull(),
});
