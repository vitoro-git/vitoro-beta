"use client";

import { Button } from "@/components/ui/button";
import { ChoiceKey, QBankQuestion, QBankSession } from "@/types";
import { useEffect, useState } from "react";
import { answerQuestion, updateSession } from "../actions";
import { ButtonGroup } from "@/components/ui/button-group";
import QuestionView from "./question/question-view";
import { LoadingSwap } from "@/components/ui/loading-swap";
import QuestionNavigator from "./question/question-navigator";
import { useRouter } from "next/navigation";
import { getRemainingSeconds } from "../utils";
import { cn, formatSeconds } from "@/lib/utils";
import ChatQBank from "@/features/chat/components/qbank/chat-qbank";

type InProgressSessionProps = {
  session: QBankSession;
  questions: QBankQuestion[];
};

export default function InProgressSession({
  session,
  questions,
}: InProgressSessionProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState(session.answers);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const currentQuestion = questions.find(
    (q) => q.id === session.questionIds[index]
  );
  if (!currentQuestion) throw Error("No current question");

  async function handleSubmit(answer: ChoiceKey) {
    if (isSubmitLoading || !currentQuestion) return;
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    const completedAt = newAnswers.every((a) => a !== "")
      ? new Date()
      : undefined;
    setIsSubmitLoading(true);
    await Promise.all([
      updateSession(session.id, { answers: newAnswers, completedAt }),
      answerQuestion(currentQuestion.id, answer === currentQuestion.answer),
    ]);
    // Will refresh and switch to completed session component
    if (completedAt !== undefined) return router.refresh();
    setAnswers(newAnswers);
    setIsSubmitLoading(false);
    if (session.mode === "timed") handleNext();
  }

  function handleNext() {
    setIndex((prev) => (prev + 1) % questions.length);
  }

  function handleBack() {
    setIndex((prev) => (prev - 1 + questions.length) % questions.length);
  }

  useEffect(() => {
    const startIndex = session.answers.findIndex((a) => a === "");
    setIndex(startIndex);
  }, [session.answers]);

  return (
    <div className="flex flex-col h-full overflow-y-hidden">
      <Header
        index={index}
        currentQuestion={currentQuestion}
        questions={questions}
        answers={answers}
        session={session}
        setIndex={setIndex}
      />
      <main className="flex flex-1 overflow-y-hidden">
        <div className="flex-1 justify-center grid p-4 h-full overflow-y-auto">
          <QuestionView
            key={currentQuestion.id}
            mode={session.mode}
            question={currentQuestion}
            onSubmit={handleSubmit}
            isLoading={isSubmitLoading}
            onNext={handleNext}
            onBack={handleBack}
            answer={answers[index] === "" ? undefined : answers[index]}
          />
        </div>
        {session.mode === "tutor" && answers[index] !== "" && (
          <div className="flex-1 px-4 border-l h-full overflow-y-auto">
            <ChatQBank
              key={currentQuestion.id}
              question={currentQuestion}
              choice={answers[index]}
            />
          </div>
        )}
      </main>
    </div>
  );
}

type HeaderProps = {
  index: number;
  currentQuestion: QBankQuestion;
  questions: QBankQuestion[];
  answers: (ChoiceKey | "")[];
  session: QBankSession;
  setIndex: (index: number) => void;
};

function Header({
  index,
  currentQuestion,
  questions,
  answers,
  session,
  setIndex,
}: HeaderProps) {
  const [timeRemaining, setTimeRemaining] = useState(
    getRemainingSeconds(session)
  );
  const [flagged, setFlagged] = useState(session.flaggedIds);
  const [isFlagLoading, setIsFlagLoading] = useState(false);
  const isFlagged = flagged.includes(currentQuestion.id);

  async function handleToggleFlag() {
    if (isFlagLoading || !currentQuestion) return;
    let newFlagged = [...flagged];
    if (isFlagged) {
      newFlagged = newFlagged.filter((id) => id !== currentQuestion.id);
    } else {
      newFlagged.push(currentQuestion.id);
    }
    setIsFlagLoading(true);
    await updateSession(session.id, { flaggedIds: newFlagged });
    setFlagged(newFlagged);
    setIsFlagLoading(false);
  }

  async function handleTimeUp() {
    if (session.mode !== "timed") throw Error("Not timed mode");
    await updateSession(session.id, { completedAt: new Date() });
    window.location.reload();
  }

  useEffect(() => {
    if (session.mode === "timed") {
      const interval = setInterval(() => {
        const remaining = getRemainingSeconds(session);
        if (remaining <= 0) return handleTimeUp();
        setTimeRemaining(remaining);
      }, 1000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="grid grid-cols-3 p-4 border-b">
      <span className={cn(timeRemaining <= 60 && "text-destructive")}>
        {session.mode === "timed" ? formatSeconds(timeRemaining) : ""}
      </span>
      <p className="place-self-center font-semibold text-primary text-lg">
        Question {index + 1} of {questions.length}
      </p>
      <ButtonGroup className="place-self-end">
        <Button
          variant="light"
          disabled={isFlagLoading}
          onClick={handleToggleFlag}
        >
          <LoadingSwap isLoading={isFlagLoading}>
            {isFlagged ? "Unflag" : "Flag"}
          </LoadingSwap>
        </Button>
        {session.mode === "tutor" && (
          <QuestionNavigator
            mode={session.mode}
            activeQuestion={currentQuestion}
            questions={questions}
            answers={answers}
            flaggedIds={flagged}
            onSelect={(_, i) => setIndex(i)}
          />
        )}
      </ButtonGroup>
    </header>
  );
}
