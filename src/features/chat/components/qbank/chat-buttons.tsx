import { Button } from "@/components/ui/button";
import { List, CreditCard } from "lucide-react";
import ChatSettings from "../chat-settings";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreateFlashcardForm from "@/features/flashcards/components/create-flashcard-form";

type ChatButtonsProps = {
  stem: string;
  answer: string;
  tone: string;
  setTone: (tone: string) => void;
  onShowPromptOptions: () => void;
};

export default function ChatButtons({
  stem,
  answer,
  tone,
  setTone,
  onShowPromptOptions,
}: ChatButtonsProps) {
  return (
    <>
      <ChatSettings tone={tone} setTone={setTone} />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onShowPromptOptions}
          >
            <List />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Show Prompt Options</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon-sm">
                <CreditCard />
              </Button>
            </DialogTrigger>
            <CreateFlashcardForm stem={stem} answer={answer} />
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>Generate Flashcard</TooltipContent>
      </Tooltip>
    </>
  );
}
