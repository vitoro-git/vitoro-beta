"use client";

import { useEffect, useRef } from "react";
import MessagesContainer from "../messages/messages-container";
import useChatHistory from "../../use-chat-history";
import { getGeneralSystemPrompt, getTaskSystemPrompt } from "../../prompts";
import ChatInput from "../chat-input";
import { ChoiceKey, QBankQuestion, Task } from "@/types";
import ChatButtons from "./chat-buttons";
import EmptyMessagesView from "./empty-messages";
import useLocalStorage from "@/hooks/use-local-storage";
import { CHAT_TONE_KEY, DEFAULT_CHAT_TONE } from "../../constants";

type ChatQBankProps = {
  question: QBankQuestion;
  choice: ChoiceKey | "";
};

export default function ChatQBank({ question, choice }: ChatQBankProps) {
  const [tone, setTone] = useLocalStorage<string>(
    CHAT_TONE_KEY,
    DEFAULT_CHAT_TONE
  );
  const { messages, isLoading, chat, clearHistory } = useChatHistory();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handlePromptGeneral(message: string) {
    const basePrompt = getGeneralSystemPrompt(question, choice, tone);
    await chat(message, { basePrompt });
  }

  async function handlePromptWithTask(task: Task) {
    const basePrompt = getTaskSystemPrompt(task, question, choice, tone);
    await chat(undefined, { basePrompt, useHistory: false });
  }

  return (
    <>
      <MessagesContainer
        messages={messages}
        endRef={endRef}
        isLoading={isLoading}
        emptyView={
          <EmptyMessagesView onPromptWithTask={handlePromptWithTask} />
        }
      />
      <ChatInput
        submitKeys={["Enter"]}
        isLoading={isLoading}
        onSubmit={handlePromptGeneral}
        buttons={
          <ChatButtons
            stem={question.stem}
            answer={question.choices[question.answer]}
            tone={tone}
            setTone={setTone}
            onShowPromptOptions={clearHistory}
          />
        }
      />
    </>
  );
}
