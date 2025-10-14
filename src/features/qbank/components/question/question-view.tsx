import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QBankQuestion, ChoiceKey, Mode } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import QuestionChoiceView from "./question-choice-view";
import HighlightableText from "@/components/highlightable-text";

type QuestionViewProps = {
  mode: Mode;
  question: QBankQuestion;
  answer?: ChoiceKey | "";
  isLoading?: boolean;
  onSubmit?: (answer: ChoiceKey) => Promise<void>;
  onNext: () => void;
  onBack: () => void;
};

export default function QuestionView({
  mode,
  question,
  answer,
  isLoading,
  onSubmit,
  onNext,
  onBack,
}: QuestionViewProps) {
  const [selectedChoice, setSelectedChoice] = useState<ChoiceKey | "" | null>(
    answer ?? null
  );
  const [isSubmitted, setIsSubmitted] = useState(answer !== undefined);

  async function handleSubmit() {
    if (!selectedChoice || !onSubmit) return;
    await onSubmit(selectedChoice);
    setIsSubmitted(true);
  }

  return (
    <Card className="max-w-[700px]">
      <CardContent className="flex flex-col gap-4">
        <HighlightableText text={question.stem} className="mb-auto" />
        <div className="space-y-2">
          {Object.entries(question.choices).map(([key, value]) => (
            <QuestionChoiceView
              key={key + value}
              letter={key as ChoiceKey}
              choice={value}
              explanation={question.explanations[key as ChoiceKey]}
              isCorrect={question.answer === key}
              isSelected={selectedChoice === key}
              isChecked={isSubmitted}
              mode={mode}
              isLoading={false}
              select={setSelectedChoice}
            />
          ))}
        </div>
        <NavigationButtons
          mode={mode}
          isSubmitted={isSubmitted}
          isLoading={isLoading ?? false}
          hasSelection={selectedChoice !== null}
          onNext={onNext}
          onBack={onBack}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
}

type NavigationButtonsProps = {
  mode: Mode;
  isSubmitted: boolean;
  isLoading: boolean;
  hasSelection: boolean;
  onNext: () => void;
  onBack: () => void;
  onSubmit?: () => Promise<void>;
};

function NavigationButtons({
  mode,
  isSubmitted,
  isLoading,
  hasSelection,
  onNext,
  onBack,
  onSubmit,
}: NavigationButtonsProps) {
  if (mode === "timed" && onSubmit) {
    return (
      <Button onClick={onSubmit} disabled={isLoading || !hasSelection}>
        <span>Submit</span>
      </Button>
    );
  }

  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} disabled={isLoading}>
        <ArrowLeft />
        <span>Back</span>
      </Button>
      {!isSubmitted && onSubmit && (
        <Button onClick={onSubmit} disabled={isLoading || !hasSelection}>
          <span>Submit</span>
        </Button>
      )}
      <Button variant="outline" onClick={onNext} disabled={isLoading}>
        <span>Next</span>
        <ArrowRight />
      </Button>
    </div>
  );
}
