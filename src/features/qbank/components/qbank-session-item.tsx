"use client";

import EditableText from "@/components/editable-text";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { capitalize } from "@/lib/utils";
import { QBankSession } from "@/types";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteSession, updateSession } from "../actions";
import Link from "next/link";
import { getRemainingSeconds } from "../utils";

type QBankSessionItemProps = {
  session: QBankSession;
};

export default function QBankSessionItem({
  session: s,
}: QBankSessionItemProps) {
  const [name, setName] = useState(s.name);
  const isCompleted =
    s.completedAt !== null ||
    (s.mode === "timed" && getRemainingSeconds(s) <= 0);

  async function handleChangeName(newName: string) {
    setName(newName);
    await updateSession(s.id, { name: newName });
  }

  return (
    <div className="flex justify-between items-center gap-2 px-4 py-2 border rounded-md">
      <div>
        <EditableText value={name} onChange={handleChangeName} />
        <p className="text-muted-foreground text-sm">
          {capitalize(s.mode)} • {s.questionIds.length}Q&apos;s •{" "}
          {capitalize(s.step.replace("-", " "))} •{" "}
          {s.createdAt.toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/app/qbank/${s.id}`}>
            {isCompleted ? "Review" : "Continue"}
          </Link>
        </Button>
        <DeleteQBankSessionButton
          sessionId={s.id}
          name={s.name}
          reloadOnSuccess
        />
      </div>
    </div>
  );
}

type DeleteQBankSessionButtonProps = {
  sessionId: string;
  name: string;
  reloadOnSuccess?: boolean;
};

function DeleteQBankSessionButton({
  sessionId,
  name,
  reloadOnSuccess = false,
}: DeleteQBankSessionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    await deleteSession(sessionId);
    setIsLoading(false);
    if (reloadOnSuccess) window.location.reload();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <span>Delete</span>
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {name}?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {name}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <DialogClose disabled={isLoading}>Cancel</DialogClose>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <LoadingSwap isLoading={isLoading}>Delete</LoadingSwap>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
