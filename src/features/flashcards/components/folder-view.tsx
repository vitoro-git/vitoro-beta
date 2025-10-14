"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { FlashcardFolder } from "@/types";
import { ArrowRight, Ellipsis } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { deleteFolder, updateFolder } from "../actions";

type FolderViewProps = {
  folder: FlashcardFolder;
  cards: number;
};

export default function FolderView({ folder, cards }: FolderViewProps) {
  return (
    <Card className="h-fit">
      <CardHeader className="flex justify-between">
        <div className="space-y-2">
          <CardTitle>{folder.name}</CardTitle>
          <CardDescription>
            {cards} card{cards === 1 ? "" : "s"}
          </CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon-sm">
              <Ellipsis />
            </Button>
          </DialogTrigger>
          <EditMenu folder={folder} />
        </Dialog>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={`/app/flashcards/${folder.id}`}>
            <span className="text-background">Study</span>
            <ArrowRight className="text-background" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

type EditMenuProps = {
  folder: FlashcardFolder;
};

function EditMenu({ folder }: EditMenuProps) {
  const [name, setName] = useState(folder.name);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave() {
    setIsLoading(true);
    await updateFolder(folder.id, name);
    setIsLoading(false);
    window.location.reload();
  }

  async function handleDelete() {
    setIsLoading(true);
    await deleteFolder(folder.id);
    setIsLoading(false);
    window.location.reload();
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Folder</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-4">
          <Label htmlFor="name">Folder Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <Button
            onClick={handleSave}
            disabled={isLoading || !name || name === folder.name}
          >
            <LoadingSwap isLoading={isLoading}>
              <span>Save Changes</span>
            </LoadingSwap>
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <LoadingSwap isLoading={isLoading}>
              <span>Delete Folder</span>
            </LoadingSwap>
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
