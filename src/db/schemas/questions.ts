import {
  CHOICE_KEYS,
  DIFFICULTIES,
  LabValue,
  QuestionChoices,
  RATINGS,
  STEPS,
  YIELDS,
} from "@/types";
import { boolean, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const qbankQuestion = pgTable("qbank_question", {
  id: uuid("id").primaryKey().defaultRandom(),

  systems: text("systems").array().notNull(),
  shelf: text("shelf"), // step-2 only
  organ: text("organ"), // step-2 only
  clinicalSetting: text("clinical_setting"), // step-2 only
  topic: text("topic").notNull(),
  competency: text("competency"), // step-1 only
  concept: text("concept"), // step-1 only
  type: text("type"), // step-2 only

  stem: text("question").notNull(),
  answer: text("answer", { enum: CHOICE_KEYS }).notNull(),
  choices: jsonb("choices").$type<QuestionChoices>().notNull(),
  explanations: jsonb("explanations").$type<QuestionChoices>().notNull(),
  labValues: jsonb("lab_values").$type<LabValue>().array(),

  difficulty: text("difficulty", { enum: DIFFICULTIES }).notNull(),
  yield: text("yield", { enum: YIELDS }).notNull(),
  rating: text("rating", { enum: RATINGS }).notNull(),
  step: text("step", { enum: STEPS }).notNull(),
});

export const foundationalQuestion = pgTable("foundational_question", {
  id: uuid("id").primaryKey().defaultRandom(),

  topic: text("topic").notNull(),
  subtopic: text("subtopic"), // step-1 only
  shelf: text("shelf").notNull(), // step-1 = subject
  system: text("system"), // step-2 only

  stem: text("stem").notNull(),
  expectedAnswer: text("expected_answer").notNull(), // step-1 = diagnosis

  step: text("step", { enum: STEPS }).notNull(),
});

export const foundationalFollowup = pgTable("foundational_followup", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => foundationalQuestion.id, { onDelete: "cascade" }),

  stem: text("stem").notNull(),
  answer: text("answer", { enum: CHOICE_KEYS }).notNull(),
  choices: jsonb("choices").$type<QuestionChoices>().notNull(),
  explanations: jsonb("explanations").$type<QuestionChoices>().notNull(),

  axis: text("axis").notNull(),

  isIntegration: boolean("is_integration"), // step-1
});

// Upload

export const uploadedQBank = pgTable("uploaded_qbank_question", {
  id: uuid("id").primaryKey().defaultRandom(),

  systems: text("systems").array().notNull(),
  categories: text("categories").array().notNull(),
  subcategory: text("subcategory"), // step-2 only
  topic: text("topic").notNull(),
  competency: text("competency"), // step-1 only
  concept: text("concept"), // step-1 only
  type: text("type"), // step-2 only

  stem: text("question").notNull(),
  answer: text("answer", { enum: CHOICE_KEYS }).notNull(),
  choices: jsonb("choices").$type<QuestionChoices>().notNull(),
  explanations: jsonb("explanations").$type<QuestionChoices>().notNull(),
  labValues: jsonb("lab_values").$type<LabValue>().array(),

  difficulty: text("difficulty", { enum: DIFFICULTIES }).notNull(),
  yield: text("yield", { enum: YIELDS }).notNull(),
  rating: text("rating", { enum: RATINGS }).notNull(),
  step: text("step", { enum: STEPS }).notNull(),
});

export const uploadedFoundational = pgTable("uploaded_foundational_question", {
  id: uuid("id").primaryKey().defaultRandom(),

  topic: text("topic").notNull(),
  subtopic: text("subtopic"), // step-1 only
  shelf: text("shelf").notNull(), // step-1 = subject
  system: text("system"), // step-2 only

  stem: text("stem").notNull(),
  expectedAnswer: text("expected_answer").notNull(), // step-1 = diagnosis

  step: text("step", { enum: STEPS }).notNull(),
});

export const uploadedFoundationalFollowup = pgTable(
  "uploaded_foundational_followup",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => foundationalQuestion.id, { onDelete: "cascade" }),

    stem: text("stem").notNull(),
    answer: text("answer", { enum: CHOICE_KEYS }).notNull(),
    choices: jsonb("choices").$type<QuestionChoices>().notNull(),
    explanations: jsonb("explanations").$type<QuestionChoices>().notNull(),

    axis: text("axis").notNull(),

    isIntegration: boolean("is_integration"), // step-1
  }
);
