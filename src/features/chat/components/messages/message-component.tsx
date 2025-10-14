import Image from "next/image";
import TutorResponse from "./tutor-response";
import { cn } from "@/lib/utils";
import AccountIcon from "@/components/account-icon";

type MessageComponentProps = {
  content: string;
  role: "user" | "assistant";
};

export default function MessageComponent({
  content,
  role,
}: MessageComponentProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex mb-4", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex items-start gap-2 max-w-4xl",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <RoleIcon isUser={isUser} />
        <div
          className={cn(
            "px-4 py-3 rounded-md max-w-[600px]",
            isUser ? "bg-secondary" : "bg-muted/60"
          )}
        >
          {isUser ? content : <TutorResponse content={content} />}
        </div>
      </div>
    </div>
  );
}

export function TypingMessage() {
  return (
    <div className="flex items-center space-x-1 py-1">
      <div className="bg-muted-foreground rounded-full w-2 h-2 animate-bounce" />
      <div
        className="bg-muted-foreground rounded-full w-2 h-2 animate-bounce"
        style={{ animationDelay: "0.15s" }}
      />
      <div
        className="bg-muted-foreground rounded-full w-2 h-2 animate-bounce"
        style={{ animationDelay: "0.3s" }}
      />
    </div>
  );
}

function RoleIcon({ isUser }: { isUser: boolean }) {
  if (isUser) return <AccountIcon size={24} className="text-xs" />;
  return (
    <div className="bg-muted/60 p-1 rounded-full aspect-square">
      <Image
        src="/vito.png"
        alt="Vito AI"
        width={24}
        height={24}
        className="rounded-full object-cover"
      />
    </div>
  );
}
