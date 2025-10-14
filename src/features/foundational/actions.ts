"use server";

import { db } from "@/db/db";
import {
  foundationalFollowup,
  foundationalQuestion,
  foundationalSession,
} from "@/db/schema";
import { ChoiceKey } from "@/types";
import {
  and,
  countDistinct,
  eq,
  isNotNull,
  isNull,
  asc,
  inArray,
} from "drizzle-orm";

export async function fetchFoundationals(userId: string) {
  return await db
    .select({
      availableCount: countDistinct(foundationalQuestion.id),
      answeredCount: countDistinct(foundationalSession.baseId),
      shelf: foundationalQuestion.shelf,
      step: foundationalQuestion.step,
    })
    .from(foundationalQuestion)
    .leftJoin(
      foundationalSession,
      and(
        eq(foundationalQuestion.id, foundationalSession.baseId),
        eq(foundationalSession.userId, userId),
        isNotNull(foundationalSession.completedAt)
      )
    )
    .groupBy(foundationalQuestion.shelf, foundationalQuestion.step);
}

export async function fetchFoundationalSession(shelf: string, userId: string) {
  const [existing] = await db
    .select({
      session: foundationalSession,
      question: foundationalQuestion,
    })
    .from(foundationalSession)
    .innerJoin(
      foundationalQuestion,
      eq(foundationalQuestion.id, foundationalSession.baseId)
    )
    .where(
      and(
        eq(foundationalQuestion.shelf, shelf),
        eq(foundationalSession.userId, userId),
        isNull(foundationalSession.completedAt)
      )
    )
    .limit(1);

  if (existing) {
    const followups = await db
      .select()
      .from(foundationalFollowup)
      .where(eq(foundationalFollowup.questionId, existing.question.id));
    return { ...existing, followups };
  }

  const [fresh] = await db
    .select({
      question: foundationalQuestion,
    })
    .from(foundationalQuestion)
    .leftJoin(
      foundationalSession,
      and(
        eq(foundationalSession.baseId, foundationalQuestion.id),
        eq(foundationalSession.userId, userId)
      )
    )
    .where(
      and(eq(foundationalQuestion.shelf, shelf), isNull(foundationalSession.id))
    )
    .orderBy(asc(foundationalQuestion.id))
    .limit(1);

  if (!fresh) return null;

  const followups = await db
    .select()
    .from(foundationalFollowup)
    .where(eq(foundationalFollowup.questionId, fresh.question.id));

  const [session] = await db
    .insert(foundationalSession)
    .values({
      userId,
      baseId: fresh.question.id,
      answers: followups.map(() => ""),
    })
    .returning();
  return { session, question: fresh.question, followups };
}

type UpdateFoundationalSessionArgs = {
  shortResponse?: string;
  answers?: (ChoiceKey | "")[];
  isComplete?: boolean;
};

export async function updateFoundationalSession(
  id: string,
  args: UpdateFoundationalSessionArgs
) {
  const parsedArgs: typeof args = {};
  if (args.answers) parsedArgs.answers = args.answers;
  if (args.shortResponse) parsedArgs.shortResponse = args.shortResponse;

  await db
    .update(foundationalSession)
    .set({
      shortResponse: parsedArgs.shortResponse,
      answers: parsedArgs.answers,
      completedAt: args.isComplete ? new Date() : null,
    })
    .where(eq(foundationalSession.id, id));
}

export async function resetProgress(shelf: string, userId: string) {
  const questions = await db
    .select({ id: foundationalQuestion.id })
    .from(foundationalQuestion)
    .where(eq(foundationalQuestion.shelf, shelf));
  const ids = questions.map((q) => q.id);
  await db
    .delete(foundationalSession)
    .where(
      and(
        eq(foundationalSession.userId, userId),
        inArray(foundationalSession.baseId, ids)
      )
    );
}
