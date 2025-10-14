import GradientTitle from "@/components/gradient-title";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { db } from "@/db/db";
import { flashcard, flashcardFolder } from "@/db/schema";
import FolderView from "@/features/flashcards/components/folder-view";
import { countDistinct, eq } from "drizzle-orm";
import { Folder } from "lucide-react";

export default async function FlashcardsPage() {
  const folders = await db
    .select({
      folder: flashcardFolder,
      count: countDistinct(flashcard.id),
    })
    .from(flashcardFolder)
    .leftJoin(flashcard, eq(flashcard.folderId, flashcardFolder.id))
    .groupBy(flashcardFolder.id);

  return (
    <main className="flex flex-col items-center gap-8 p-8 h-full">
      <GradientTitle text="Flashcards" className="font-black text-4xl" />
      {folders.length === 0 ? (
        <EmptyView />
      ) : (
        <div className="flex-1 grid grid-cols-4 w-full">
          {folders.map((f) => (
            <FolderView key={f.folder.id} folder={f.folder} cards={f.count} />
          ))}
        </div>
      )}
    </main>
  );
}

function EmptyView() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Folder />
        </EmptyMedia>
        <EmptyTitle>Flashcard Folders</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any flashcard folders yet.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
