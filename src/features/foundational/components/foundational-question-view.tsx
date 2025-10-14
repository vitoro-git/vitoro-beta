"use client";

import HighlightableText from "@/components/highlightable-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { LoadingSwap } from "@/components/ui/loading-swap";
import QuestionChoiceView from "@/features/qbank/components/question/question-choice-view";
import {
  ChoiceKey,
  FoundationalFollowup,
  FoundationalQuestion,
  FoundationalSession,
} from "@/types";
import { useEffect, useRef, useState } from "react";
import { updateFoundationalSession } from "../actions";

type FoundationalQuestionViewProps = {
  session: FoundationalSession;
  question: FoundationalQuestion;
  followups: FoundationalFollowup[];
};

export default function FoundationalQuestionView({
  session,
  question,
  followups,
}: FoundationalQuestionViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [answers, setAnswers] = useState(session.answers);
  const [answeredCount, setAnsweredCount] = useState(
    (session.shortResponse ? 1 : 0) +
      session.answers.filter((a) => a !== "").length
  );

  async function handleBaseSubmit(shortResponse: string) {
    await updateFoundationalSession(session.id, { shortResponse });
    setAnsweredCount((prev) => prev + 1);
  }

  async function handleFollowupSubmit(choice: ChoiceKey) {
    const newAnswers = [...answers];
    newAnswers[answeredCount - 1] = choice;
    await updateFoundationalSession(session.id, {
      answers: newAnswers,
      isComplete: !newAnswers.some((a) => a === ""),
    });
    setAnsweredCount((prev) => prev + 1);
    setAnswers(newAnswers);
  }

  function handleNext() {
    if (!containerRef.current) return;
    if (answeredCount === followups.length + 1) {
      // Fetch new question if all are answered
      // router and redirect don't fetch fresh data from the page for some reason
      window.location.reload();
    } else {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
    });
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-hidden">
      <header className="grid grid-cols-3 p-4 border-b">
        <span />
        <p className="place-self-center font-semibold text-primary text-lg">
          Question {Math.min(answeredCount + 1, followups.length + 1)} of{" "}
          {1 + followups.length}
        </p>
        <span />
      </header>
      <main
        className="flex-1 space-y-16 p-8 overflow-y-auto"
        ref={containerRef}
      >
        <FoundationalBaseView
          question={question}
          answer={session.shortResponse}
          onSubmit={handleBaseSubmit}
          onNext={handleNext}
        />
        {followups.slice(0, answeredCount).map((f, i) => (
          <FoundationalFollowupView
            key={f.id}
            question={f}
            answer={answers[i]}
            onSubmit={handleFollowupSubmit}
            onNext={handleNext}
          />
        ))}
      </main>
    </div>
  );
}

type FoundationalBaseViewProps = {
  question: FoundationalQuestion;
  answer: string | null;
  onSubmit: (shortResponse: string) => Promise<void>;
  onNext: () => void;
};

function FoundationalBaseView({
  question,
  answer,
  onSubmit,
  onNext,
}: FoundationalBaseViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(answer !== null);
  const [input, setInput] = useState(answer ?? "");

  async function handleSubmit() {
    if (isLoading || !input) return;
    setIsLoading(true);
    await onSubmit(input);
    setIsLoading(false);
    setIsSubmitted(true);
  }

  function handleKeydown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <Card className="flex flex-col mx-auto w-2/3 max-w-2xl min-h-full">
      <CardContent className="flex flex-col flex-1 gap-8">
        <HighlightableText text={question.stem} />
        {!isSubmitted && (
          <InputGroup className="mt-auto">
            <InputGroupTextarea
              placeholder="Type your answer here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeydown}
            />
            <InputGroupAddon align="block-end">
              <InputGroupButton
                className="ml-auto"
                variant="default"
                size="sm"
                onClick={handleSubmit}
                disabled={isLoading || !input}
              >
                <LoadingSwap isLoading={isLoading}>Submit</LoadingSwap>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        )}
        {isSubmitted && (
          <>
            <div>
              <p className="text-muted-foreground text-sm">Expected Answer</p>
              <p className="ml-4">{question.expectedAnswer}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Your Answer</p>
              <p className="ml-4">{input}</p>
            </div>
            <Button className="mt-auto ml-auto" onClick={onNext}>
              Next
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

type FoundationalFollowupViewProps = {
  question: FoundationalFollowup;
  answer: ChoiceKey | "";
  onSubmit: (choice: ChoiceKey) => Promise<void>;
  onNext: () => void;
};

function FoundationalFollowupView({
  question,
  answer,
  onSubmit,
  onNext,
}: FoundationalFollowupViewProps) {
  const [isSubmitted, setIsSubmitted] = useState(answer !== "");
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<ChoiceKey | "">(answer ?? "");

  async function handleSubmit() {
    if (isLoading || selected === "") return;
    setIsLoading(true);
    await onSubmit(selected);
    setIsLoading(false);
    setIsSubmitted(true);
  }

  return (
    <Card className="flex flex-col mx-auto w-2/3 max-w-2xl min-h-full">
      <CardContent className="flex flex-col flex-1 justify-between gap-8">
        <HighlightableText text={question.stem} />
        <div className="flex flex-col gap-2">
          {Object.entries(question.choices).map(([key, value]) => (
            <QuestionChoiceView
              key={key + value}
              letter={key as ChoiceKey}
              choice={value}
              explanation={question.explanations[key as ChoiceKey]}
              isCorrect={question.answer === key}
              isSelected={selected === key}
              isChecked={isSubmitted}
              mode="tutor"
              isLoading={isLoading}
              select={(q) => setSelected(q as ChoiceKey)}
            />
          ))}
          {!isSubmitted && (
            <Button
              className="ml-auto"
              onClick={handleSubmit}
              disabled={isLoading || selected === ""}
            >
              <LoadingSwap isLoading={isLoading}>Submit</LoadingSwap>
            </Button>
          )}
          {isSubmitted && (
            <Button className="ml-auto" onClick={onNext}>
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
