import { CARD_TYPES, CHOICE_KEYS, MODES, STEPS } from "@/types";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { foundationalQuestion, qbankQuestion } from "./questions";

export const qbankSession = pgTable("qbank_session", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  name: text("name").notNull(),
  mode: text("mode", { enum: MODES }).notNull(),
  step: text("step", { enum: STEPS }).notNull(),

  questionIds: uuid("question_ids").array().notNull(),
  answers: text("answers", { enum: [...CHOICE_KEYS, ""] })
    .array()
    .notNull(),
  flaggedIds: uuid("flagged_ids").array().notNull(),

  completedAt: timestamp("completed_at"),
});

export const answeredQBank = pgTable("answered_qbank_question", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  questionId: uuid("question_id")
    .notNull()
    .references(() => qbankQuestion.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isCorrect: boolean("is_correct"),
});

export const foundationalSession = pgTable("foundational_session", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  baseId: uuid("base_id")
    .references(() => foundationalQuestion.id, { onDelete: "cascade" })
    .notNull(),

  shortResponse: text("short_response"),
  answers: text("answers", { enum: [...CHOICE_KEYS, ""] })
    .array()
    .notNull(),

  completedAt: timestamp("completed_at"),
});

export const flashcardFolder = pgTable("flashcard_folder", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
});

export const flashcard = pgTable("flashcard", {
  id: uuid("id").primaryKey().defaultRandom(),
  folderId: uuid("folder_id")
    .notNull()
    .references(() => flashcardFolder.id, { onDelete: "cascade" }),
  front: text("front").notNull(),
  back: text("back"),
  type: text("type", { enum: CARD_TYPES }).notNull(),
});
