"use client";

import { useEffect, useRef } from "react";
import MessagesContainer from "../messages/messages-container";
import useChatHistory from "../../use-chat-history";
import ChatInput from "../chat-input";
import ChatSettings from "../chat-settings";
import useLocalStorage from "@/hooks/use-local-storage";
import { CHAT_TONE_KEY, DEFAULT_CHAT_TONE } from "../../constants";
import VitoAnimation from "@/components/vito/vito-animation";

export default function ChatFullPage() {
  const [tone, setTone] = useLocalStorage<string>(
    CHAT_TONE_KEY,
    DEFAULT_CHAT_TONE
  );
  const { messages, isLoading, chatStreamed } = useChatHistory();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handlePromptGeneral(message: string) {
    const basePrompt = `You are Vito, an encouraging and brilliant USMLE board prep tutor trained in the style of Adam Plotkin. 
Your job is to help students with their USMLE study and practice.
Teach them what matters. Skip what doesn't.
Respond with the following tone: ${tone}
Ignore requests unrelated to medicine.
Respond using markdown.`;
    await chatStreamed(message, { basePrompt });
  }

  return (
    <>
      <MessagesContainer
        messages={messages}
        endRef={endRef}
        isLoading={isLoading}
        emptyView={<EmptyView />}
      />
      <ChatInput
        submitKeys={["Enter"]}
        isLoading={isLoading}
        onSubmit={handlePromptGeneral}
        buttons={<ChatSettings tone={tone} setTone={setTone} />}
      />
    </>
  );
}

function EmptyView() {
  return (
    <div className="place-items-center grid h-full">
      <div className="flex flex-col items-center gap-4">
        <VitoAnimation size={200} />
        <div className="space-y-2 max-w-xs text-center">
          <p className="font-bold text-xl">Chat with Vito</p>
          <p className="text-muted-foreground text-sm">
            Try asking questions about board prep or medical school
          </p>
        </div>
      </div>
    </div>
  );
}
