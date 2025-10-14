import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ChoiceKey, Mode, QBankQuestion } from "@/types";
import { Check, Flag, Menu, X } from "lucide-react";

type QuestionNavigatorProps = {
  mode: Mode;
  activeQuestion: QBankQuestion;
  questions: QBankQuestion[];
  answers: (ChoiceKey | "")[];
  flaggedIds: string[];
  onSelect: (question: QBankQuestion, index: number) => void;
};

export default function QuestionNavigator({
  mode,
  activeQuestion,
  questions,
  answers,
  flaggedIds,
  onSelect,
}: QuestionNavigatorProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Question Navigator</SheetTitle>
          <SheetDescription>
            {answers.filter((a) => a !== "").length} of {questions.length}{" "}
            answered
          </SheetDescription>

          <nav className="flex flex-col gap-2 h-full overflow-y-auto">
            {questions.map((question, index) => {
              const answer = answers[index];
              const isActive = question.id === activeQuestion.id;
              const isAnswered = answer !== "";
              const isCorrect = isAnswered && answer === question.answer;

              return (
                <div
                  key={question.id}
                  className={cn(
                    "p-3 border rounded-md transition-all cursor-pointer",
                    isActive
                      ? "bg-primary/20 border-primary"
                      : "bg-secondary hover:bg-secondary/80 border-border"
                  )}
                  onClick={() => onSelect(question, index)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Q{index + 1}</span>
                      {isAnswered && mode === "tutor" && (
                        <div
                          className={cn(
                            "flex justify-center items-center rounded-full w-5 h-5 text-xs",
                            isCorrect
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          )}
                        >
                          {isCorrect ? <Check size={12} /> : <X size={12} />}
                        </div>
                      )}
                      {flaggedIds.includes(question.id) && (
                        <Flag size={16} className="text-primary" />
                      )}
                    </div>
                    {isAnswered && (
                      <span className="text-muted-foreground text-xs">
                        {answer?.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </nav>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
