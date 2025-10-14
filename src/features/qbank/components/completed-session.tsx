"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QBankQuestion, QBankSession } from "@/types";
import { ChartArea, List } from "lucide-react";
import QuestionNavigator from "./question/question-navigator";
import { useState } from "react";
import QuestionView from "./question/question-view";
import ChatQBank from "@/features/chat/components/qbank/chat-qbank";
import SessionSummary from "./session-summary";

type CompletedSessionProps = {
  session: QBankSession;
  questions: QBankQuestion[];
};

export default function CompletedSession({
  session,
  questions,
}: CompletedSessionProps) {
  return (
    <Tabs
      defaultValue="summary"
      className="flex flex-col h-full overflow-y-hidden"
    >
      <TabsList
        className="grid grid-cols-2 mx-auto mt-4"
        style={{ width: "calc(100% - 32px)" }}
      >
        <TabsTrigger value="summary">
          <ChartArea />
          <span>Summary</span>
        </TabsTrigger>
        <TabsTrigger value="questions">
          <List />
          <span>Questions</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="flex-1 overflow-y-auto">
        <SessionSummary session={session} questions={questions} />
      </TabsContent>

      <TabsContent
        value="questions"
        className="flex flex-col flex-1 overflow-y-hidden"
      >
        <QuestionsView session={session} questions={questions} />
      </TabsContent>
    </Tabs>
  );
}

function QuestionsView({ session, questions }: CompletedSessionProps) {
  const [index, setIndex] = useState(0);
  const currentQuestion = questions.find(
    (q) => q.id === session.questionIds[index]
  );
  if (!currentQuestion) throw Error("No current question");

  function handleNext() {
    setIndex((prev) => (prev + 1) % questions.length);
  }

  function handleBack() {
    setIndex((prev) => (prev - 1 + questions.length) % questions.length);
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-hidden">
      <header className="grid grid-cols-3 p-2 px-4 border-b">
        <span />
        <span className="place-self-center font-semibold text-primary text-lg">
          Question {index + 1} of {questions.length}
        </span>
        <ButtonGroup className="place-self-end">
          <Button variant="light">Flag</Button>
          <QuestionNavigator
            mode="tutor"
            activeQuestion={currentQuestion}
            questions={questions}
            answers={session.answers}
            flaggedIds={session.flaggedIds}
            onSelect={(_, i) => setIndex(i)}
          />
        </ButtonGroup>
      </header>
      <main className="flex flex-1 overflow-y-hidden">
        <div className="flex-1 justify-center grid p-4 h-full overflow-y-auto">
          <QuestionView
            key={currentQuestion.id}
            mode="tutor"
            question={currentQuestion}
            answer={session.answers[index]}
            isLoading={false}
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>
        <div className="flex-1 px-4 border-l h-full overflow-y-auto">
          <ChatQBank
            key={currentQuestion.id}
            question={currentQuestion}
            choice={session.answers[index]}
          />
        </div>
      </main>
    </div>
  );
}
