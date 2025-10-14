import z from "zod";

export const uploadedQBankSchema = z.array(
  z.object({
    systems: z.array(z.string()),
    categories: z.array(z.string()),
    subcategory: z.string().nullable(),
    topic: z.string(),
    competency: z.string().nullable(),
    concept: z.string().nullable(),
    type: z.string().nullable(),

    stem: z.string(),
    answer: z.enum(["a", "b", "c", "d", "e"]),
    choices: z.object({
      a: z.string(),
      b: z.string(),
      c: z.string(),
      d: z.string(),
      e: z.string(),
    }),
    explanations: z.object({
      a: z.string(),
      b: z.string(),
      c: z.string(),
      d: z.string(),
      e: z.string(),
    }),
    labValues: z.array(
      z.object({
        analyte: z.string(),
        value: z.number().nullable(),
        unit: z.string().nullable(),
        qual: z.string().nullable(),
        panel: z.string(),
      })
    ),
    step: z.enum(["step-1", "step-2"]),
  })
);

export const uploadedFoundationalSchema = z.array(
  z.object({
    id: z.string(),
    topic: z.string(),
    subtopic: z.string().nullable(),
    shelf: z.string(),
    system: z.string().nullable(),

    stem: z.string(),
    expectedAnswer: z.string(),

    step: z.enum(["step-1", "step-2"]),
  })
);

export const uploadedFoundationalFollowupSchema = z.array(
  z.object({
    questionId: z.string(),
    stem: z.string(),
    answer: z.enum(["a", "b", "c", "d", "e"]),
    choices: z.object({
      a: z.string(),
      b: z.string(),
      c: z.string(),
      d: z.string(),
      e: z.string(),
    }),
    explanations: z.object({
      a: z.string(),
      b: z.string(),
      c: z.string(),
      d: z.string(),
      e: z.string(),
    }),
    axis: z.string(),
    isIntegration: z.boolean(),
  })
);
