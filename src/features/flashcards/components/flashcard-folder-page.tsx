"use client";

import { Flashcard, FlashcardFolder } from "@/types";
import { useState } from "react";
import FlashcardView from "./flashcard-view";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowLeft, ArrowRight, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

type FlashcardFolderPageProps = {
  folder: FlashcardFolder;
  cards: Flashcard[];
};

export default function FlashcardFolderPage({
  folder,
  cards,
}: FlashcardFolderPageProps) {
  const [index, setIndex] = useState(0);
  const currentCard = cards[index];

  function handleBack() {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }

  function handleNext() {
    setIndex((prev) => (prev + 1) % cards.length);
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-center p-4 border-b">
        <p className="place-self-center font-semibold text-primary text-lg">
          {folder.name}
        </p>
      </header>

      <main className="flex-1 place-items-center grid">
        {cards.length === 0 ? (
          <EmptyView folderName={folder.name} />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <FlashcardView key={currentCard.id} card={currentCard} />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon-sm" onClick={handleBack}>
                <ArrowLeft />
              </Button>
              <p className="text-muted-foreground text-sm">
                {index + 1}/{cards.length}
              </p>
              <Button variant="outline" size="icon-sm" onClick={handleNext}>
                <ArrowRight />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyView({ folderName }: { folderName: string }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CreditCard />
        </EmptyMedia>
        <EmptyTitle>Flashcards</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t added any flashcards to {folderName} yet.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
