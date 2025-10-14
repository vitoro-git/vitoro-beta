import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { capitalize, cn } from "@/lib/utils";
import {
  CARD_TYPES,
  FlashcardFolder,
  FlashcardType,
  GeneratedFlashcard,
} from "@/types";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import {
  fetchFolders,
  createFolder,
  createFlashcard,
  generateFlashcard,
} from "../actions";
import { Button } from "@/components/ui/button";
import { useSession } from "@/features/auth/session-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { LoadingSwap } from "@/components/ui/loading-swap";

type CreateFlashcardFormProps = {
  stem: string;
  answer: string;
};

export default function CreateFlashcardForm({
  stem,
  answer,
}: CreateFlashcardFormProps) {
  const { user } = useSession();
  const [cardType, setCardType] = useState<FlashcardType>("front-back");
  const [card, setCard] = useState<GeneratedFlashcard | null>(null);
  const [folders, setFolders] = useState<FlashcardFolder[]>([]);

  function handleGenerate(card: GeneratedFlashcard, type: FlashcardType) {
    setCard(card);
    setCardType(type);
  }

  useEffect(() => {
    if (!user.id) return;
    fetchFolders(user.id).then(setFolders);
  }, [user.id]);

  return (
    <DialogContent className="flex flex-col p-0 min-w-2/3 h-2/3">
      <DialogHeader className="px-4 py-4">
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogDescription>
          Choose or create a folder to save your flashcards
        </DialogDescription>
      </DialogHeader>
      {card ? (
        <CreateForm
          card={card}
          cardType={cardType}
          folders={folders}
          setCard={setCard}
          setFolders={setFolders}
        />
      ) : (
        <GenerateForm stem={stem} answer={answer} onGenerate={handleGenerate} />
      )}
    </DialogContent>
  );
}

type GenerateFormProps = {
  stem: string;
  answer: string;
  onGenerate: (card: GeneratedFlashcard, type: FlashcardType) => void;
};

function GenerateForm({ stem, answer, onGenerate }: GenerateFormProps) {
  const [cardType, setCardType] = useState<FlashcardType>("front-back");
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    setIsLoading(true);
    const card = await generateFlashcard(stem, answer, cardType);
    onGenerate(card, cardType);
    setIsLoading(false);
  }

  return (
    <div className="space-y-8 px-8">
      <div className="space-y-4">
        <p className="font-semibold">Question Stem</p>
        <p className="text-muted-foreground text-sm">{stem}</p>
      </div>
      <div className="space-y-4">
        <p className="font-semibold">Answer</p>
        <p className="text-muted-foreground text-sm">{answer}</p>
      </div>
      <div className="space-y-4">
        <p className="font-semibold">Flashcard Type</p>
        <Select
          value={cardType}
          onValueChange={(t) => setCardType(t as FlashcardType)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {CARD_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t.split("-").map(capitalize).join(" ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button disabled={isLoading} onClick={handleGenerate}>
        <LoadingSwap isLoading={isLoading} className="flex items-center gap-2">
          <Sparkles />
          <span>Generate</span>
        </LoadingSwap>
      </Button>
    </div>
  );
}

type CreateFormProps = {
  card: GeneratedFlashcard;
  cardType: FlashcardType;
  folders: FlashcardFolder[];
  setCard: Dispatch<SetStateAction<GeneratedFlashcard | null>>;
  setFolders: Dispatch<SetStateAction<FlashcardFolder[]>>;
};

function CreateForm({
  card,
  cardType,
  folders,
  setCard,
  setFolders,
}: CreateFormProps) {
  const { user } = useSession();
  const [target, setTarget] = useState<FlashcardFolder | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateFolder() {
    if (!newFolderName.trim()) return;
    if (folders.some((f) => f.name === newFolderName.trim())) return;

    setIsLoading(true);
    const folder = await createFolder(newFolderName.trim(), user.id);
    setFolders((prev) => [...prev, folder]);
    setTarget(folder);
    setNewFolderName("");
    setIsLoading(false);
  }

  async function handleCreateFlashcard() {
    if (!target || !card) return;
    setIsLoading(true);
    await createFlashcard(target.id, card, cardType);
    setIsLoading(false);
    toast.success(`Successfully saved flashcard to ${target.name}`, {
      richColors: true,
    });
  }

  return (
    <div className="flex-1 gap-6 grid grid-cols-[1fr_3fr] overflow-y-hidden">
      <div className="flex flex-col flex-1 px-4 border-r">
        <div className="flex gap-2 mb-4">
          <input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder name"
            className="flex-1 px-2 py-1 border rounded-md text-sm"
          />
          <Button onClick={handleCreateFolder} disabled={isLoading}>
            Create
          </Button>
        </div>

        <div className="flex-1 space-y-2 pb-4 overscroll-y-auto">
          {folders.map((f) => (
            <div
              key={f.id}
              onClick={() => setTarget(f)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer",
                target?.id === f.id
                  ? "border-primary bg-secondary"
                  : "hover:bg-muted"
              )}
            >
              <span
                className={cn(
                  "font-black text-muted-foreground",
                  target?.id === f.id && "text-primary"
                )}
              >
                •
              </span>
              <span
                className={cn(
                  target?.id === f.id ? "text-primary" : "text-muted-foreground"
                )}
              >
                {f.name}
              </span>
            </div>
          ))}
          {folders.length === 0 && (
            <p className="text-muted-foreground text-sm italic">
              No folders yet
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 px-4 pb-4 overflow-y-auto">
        <h3 className="mb-2 font-semibold text-sm">Preview</h3>
        <div className="flex-1 space-y-3 p-3 border rounded-md">
          <div className="flex flex-col p-2 border rounded-md">
            <ReactMarkdown>{card.front}</ReactMarkdown>
            <div className="my-4 bg-border w-full h-px" />
            <ReactMarkdown>{card.back}</ReactMarkdown>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="destructive" onClick={() => setCard(null)}>
            Discard
          </Button>
          <Button
            onClick={handleCreateFlashcard}
            disabled={!target || isLoading}
          >
            Save to {target?.name ?? "Folder"}
          </Button>
        </div>
      </div>
    </div>
  );
}
