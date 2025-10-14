"use server";

import { FlashcardType, GeneratedFlashcard } from "@/types";
import { Gemini } from "@/ai/gemini";
import { stripAndParse } from "@/lib/utils";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { flashcard, flashcardFolder } from "@/db/schema";

export async function generateFlashcard(
  stem: string,
  answer: string,
  type: FlashcardType
) {
  const flashcardPrompt = getFlashcardSystemPrompt(stem, answer, type);

  const llm = new Gemini();
  const output = await llm.prompt([
    { role: "user", content: flashcardPrompt, type: "text" },
  ]);
  const card = stripAndParse<GeneratedFlashcard>(output.text);
  if (card === null)
    throw new Error(`No flashcard generated, ${output.text}, ${card}`);
  return card;
}

export async function fetchFolders(userId: string) {
  return await db
    .select()
    .from(flashcardFolder)
    .where(eq(flashcardFolder.userId, userId));
}

export async function createFolder(name: string, userId: string) {
  const [folder] = await db
    .insert(flashcardFolder)
    .values({ name, userId })
    .returning();
  return folder;
}

export async function createFlashcard(
  folderId: string,
  card: GeneratedFlashcard,
  type: FlashcardType
) {
  await db.insert(flashcard).values({
    front: card.front,
    back: card.back,
    type,
    folderId,
  });
}

function getFlashcardSystemPrompt(
  stem: string,
  answer: string,
  type: FlashcardType
) {
  const format = getFlashcardFormat(type);
  return `You are a medical education expert. Create high-yield flashcards based on key concept from this board question. The **back:** should include supplementary material related to the topic that helps provide more context for the student to review.

Question: ${stem}

Correct Answer: ${answer}

Instructions:
1. Identify the key concept being tested
2. Create one flashcard formatted for Anki import
3. Include supplementary context and high-yield details
4. Use clear, concise language suitable for spaced repetition
5. Format for readability:
   - Use bullet points for lists
   - Bold key terms and concepts
   - Use → for cause/effect relationships
   - Include relevant mnemonics or memory aids when helpful
   - Keep front cards concise, back cards comprehensive
   - Make sure to use UTF-8 and escape newline characters so that the output can be JSON.parsed
6. Do not exceed 40 words on each side

Respond with exactly this format:

${format}`;
}

function getFlashcardFormat(type: FlashcardType) {
  switch (type) {
    case "front-back":
      return `{
  "front": "[Focused question about the key concept]",
  "back": "[Answer with supplementary context, mechanisms, and high-yield details that help reinforce understanding]"
}`;
    case "cloze":
      return `{
  "front": "[Clinical statement with {{c1::key term}} cloze deletion format]",
  "back": "[Additional context and clinical pearls related to the cloze term]"
}`;
  }
}

export async function updateFolder(id: string, name: string) {
  await db
    .update(flashcardFolder)
    .set({ name })
    .where(eq(flashcardFolder.id, id));
}

export async function deleteFolder(id: string) {
  await db.delete(flashcardFolder).where(eq(flashcardFolder.id, id));
}

export async function deleteFlashcard(id: string) {
  await db.delete(flashcard).where(eq(flashcard.id, id));
}
