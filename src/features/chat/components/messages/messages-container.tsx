import { Message } from "@/types";
import { ReactNode, RefObject } from "react";
import MessageComponent, { TypingMessage } from "./message-component";

type MessagesContainerProps = {
  messages: Message[];
  endRef: RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  emptyView: ReactNode;
};

export default function MessagesContainer({
  messages,
  endRef,
  isLoading,
  emptyView,
}: MessagesContainerProps) {
  if (messages.length === 0 && !isLoading) return emptyView;

  return (
    <div className="flex-1 px-4 pt-16 pb-40 min-h-full">
      {messages.map((message) => (
        <MessageComponent
          key={message.id}
          content={message.content}
          role={message.role}
        />
      ))}
      {isLoading && <TypingMessage />}
      <div ref={endRef} />
    </div>
  );
}
