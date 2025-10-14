import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Settings } from "lucide-react";
import { useState } from "react";

const TONES = [
  "Clear and concise",
  "Encouraging and empathetic",
  "Sarcastic and witty",
] as const;

export type Tone = (typeof TONES)[number];

type ChatSettingsProps = {
  tone: string;
  setTone: (tone: string) => void;
};

export default function ChatSettings({ tone, setTone }: ChatSettingsProps) {
  const [isCustom, setIsCustom] = useState(false);

  function handleSelect(tone: string) {
    setTone(tone);
    setIsCustom(false);
  }

  function handleCustom() {
    setTone("");
    setIsCustom(true);
  }

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon-sm">
              <Settings size={16} />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Chat Settings</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <p className="font-semibold">AI Tone</p>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <Button
                variant={t === tone ? "default" : "outline"}
                key={t}
                onClick={() => handleSelect(t)}
                size="sm"
              >
                {t}
              </Button>
            ))}
            <Button
              variant={isCustom ? "default" : "outline"}
              size="sm"
              onClick={handleCustom}
            >
              Custom
            </Button>
          </div>
          {isCustom && (
            <Input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="Custom tone"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
