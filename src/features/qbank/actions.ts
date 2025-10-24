"use server";

import { db } from "@/db/db";
import { answeredQBank, qbankQuestion, qbankSession } from "@/db/schema";
import { ChoiceKey, Step } from "@/types";
import { and, eq, inArray, notInArray, sql } from "drizzle-orm";
import { CreateSessionForm } from "./components/create-session-form";
import { generateRandomName } from "@/lib/utils";
import { auth } from "../auth/config/server";
import { headers } from "next/headers";

export async function getQuestions(
  step: Step,
  systems: string[],
  limit: number,
  userId: string
) {
  const existing = await db
    .select({ ids: qbankSession.questionIds })
    .from(qbankSession)
    .where(eq(qbankSession.userId, userId));
  const excludedIds = existing.flatMap(({ ids }) => ids);

  const filters = [
    eq(qbankQuestion.step, step),
    notInArray(qbankQuestion.id, excludedIds),
  ];

  if (systems.length > 0) {
    const systemsLiteral = `{${systems.map((s) => `"${s}"`).join(",")}}`;
    filters.push(
      sql`${qbankQuestion.systems} && ${sql.raw(`'${systemsLiteral}'::text[]`)}`
    );
  }

  const questions = await db
    .select({ id: qbankQuestion.id })
    .from(qbankQuestion)
    .where(and(...filters))
    .limit(limit);

  return questions.map((q) => q.id);
}

export async function createSession(userId: string, data: CreateSessionForm) {
  const questionIds = await getQuestions(
    data.step,
    data.systems,
    data.size,
    userId
  );
  const [{ id }] = await db
    .insert(qbankSession)
    .values({
      name: generateRandomName(),
      mode: data.mode,
      step: data.step,
      questionIds,
      answers: Array.from({ length: questionIds.length }, () => ""),
      flaggedIds: [],
      userId: userId,
    })
    .returning({ id: qbankSession.id });
  return id;
}

export async function getSession(id: string, userId: string) {
  const session = await db.query.qbankSession.findFirst({
    where: and(eq(qbankSession.id, id), eq(qbankSession.userId, userId)),
  });
  if (!session) return { session: null, questions: null };
  const questions = await db.query.qbankQuestion.findMany({
    where: inArray(qbankQuestion.id, session.questionIds),
  });
  return { session, questions };
}

type UpdateSessionArgs = {
  name?: string;
  answers?: (ChoiceKey | "")[];
  flaggedIds?: string[];
  completedAt?: Date;
};

export async function answerQuestion(id: string, isCorrect: boolean) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  await db.insert(answeredQBank).values({
    userId: session.user.id,
    questionId: id,
    isCorrect,
  });
}

export async function updateSession(id: string, args: UpdateSessionArgs) {
  // Don't think this is necessary but I don't trust like that lol 👍😁👍
  const filteredArgs: typeof args = {};
  if (args.name) filteredArgs.name = args.name;
  if (args.answers) filteredArgs.answers = args.answers;
  if (args.flaggedIds) filteredArgs.flaggedIds = args.flaggedIds;
  if (args.completedAt) filteredArgs.completedAt = args.completedAt;

  await db
    .update(qbankSession)
    .set(filteredArgs)
    .where(eq(qbankSession.id, id));
}

export async function deleteSession(id: string) {
  await db.delete(qbankSession).where(eq(qbankSession.id, id));
}
