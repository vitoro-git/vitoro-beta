"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { ArrowLeft, RefreshCcw, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resetProgress } from "../actions";
import { LoadingSwap } from "@/components/ui/loading-swap";

type CompletedPageProps = {
  shelf: string;
  userId: string;
};

export default function CompletedPage({ shelf, userId }: CompletedPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleResetProgress() {
    setIsLoading(true);
    await resetProgress(shelf, userId);
    setIsLoading(false);
    router.refresh();
  }

  return (
    <main className="place-items-center grid h-full">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Check />
          </EmptyMedia>
          <EmptyTitle>Completed All Questions for {shelf}</EmptyTitle>
          <EmptyDescription>
            You can go back to select a new category or reset your progress and
            try again.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button variant="outline">
              <Link
                href="/app/foundational"
                className="flex items-center gap-2"
              >
                <ArrowLeft />
                <span>Select Another</span>
              </Link>
            </Button>
            <Button onClick={handleResetProgress}>
              <LoadingSwap
                isLoading={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCcw />
                <span>Reset Progress</span>
              </LoadingSwap>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </main>
  );
}
