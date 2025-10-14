import { db } from "@/db/db";
import { flashcard, flashcardFolder } from "@/db/schema";
import FlashcardFolderPage from "@/features/flashcards/components/flashcard-folder-page";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type FolderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function FolderPage({ params }: FolderPageProps) {
  const { id } = await params;
  const [folder, flashcards] = await Promise.all([
    db.query.flashcardFolder.findFirst({ where: eq(flashcardFolder.id, id) }),
    db.query.flashcard.findMany({ where: eq(flashcard.folderId, id) }),
  ]);
  if (!folder) return notFound();

  return <FlashcardFolderPage folder={folder} cards={flashcards} />;
}
