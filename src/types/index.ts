export * from "./systems";

import {
  flashcard,
  flashcardFolder,
  foundationalFollowup,
  foundationalQuestion,
  foundationalSession,
  qbankQuestion,
  qbankSession,
  user,
} from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

// Database

export type QBankSession = InferSelectModel<typeof qbankSession>;
export type QBankQuestion = InferSelectModel<typeof qbankQuestion>;
export type FoundationalSession = InferSelectModel<typeof foundationalSession>;
export type FoundationalQuestion = InferSelectModel<
  typeof foundationalQuestion
>;
export type FoundationalFollowup = InferSelectModel<
  typeof foundationalFollowup
>;
export type FlashcardFolder = InferSelectModel<typeof flashcardFolder>;
export type Flashcard = InferSelectModel<typeof flashcard>;

export type FullUser = InferSelectModel<typeof user> & {
  school: string;
  gradYear: string;
  exam: string;
};

export type QuestionChoices = {
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
};

export type LabValue = {
  analyte: string;
  value: number | null;
  unit: string | null;
  qual: string | null;
  panel: string;
};

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];
export const YIELDS = ["low", "medium", "high"] as const;
export type Yield = (typeof YIELDS)[number];
export const RATINGS = ["approved", "pending", "passed"] as const;
export type Rating = (typeof RATINGS)[number];
export const MODES = ["timed", "tutor"] as const;
export type Mode = (typeof MODES)[number];
export const STEPS = ["step-1", "step-2"] as const;
export type Step = (typeof STEPS)[number];
export const CHOICE_KEYS = ["a", "b", "c", "d", "e"] as const;
export type ChoiceKey = (typeof CHOICE_KEYS)[number];

// Chat

export type Task =
  | "breakdown"
  | "distractor"
  | "gap-finder"
  | "strategy"
  | "pattern"
  | "memory"
  | "pimp-mode";

export const TASKS: Task[] = [
  "breakdown",
  "distractor",
  "gap-finder",
  "strategy",
  "pattern",
  "memory",
  "pimp-mode",
];

// Chat

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  type: "text";
};

export type SectionType =
  | "concept"
  | "example"
  | "equation"
  | "practice"
  | "summary";

export type Section = {
  id: string;
  title: string;
  content: string;
  type: SectionType;
  defaultExpanded?: boolean;
  icon?: string;
};

export type AIResponse = {
  id: string;
  sections: Section[];
  timestamp: Date;
  hasExpandableSections: boolean;
};

export const CARD_TYPES = ["front-back", "cloze"] as const;

export type FlashcardType = (typeof CARD_TYPES)[number];

export type GeneratedFlashcard = {
  front: string;
  back: string | null;
};
