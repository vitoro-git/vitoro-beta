import { capitalize } from "@/lib/utils";
import { Task, TASKS } from "@/types";
import TaskPrompt, { TaskTooltip } from "./task-prompt";
import Image from "next/image";

type EmptyViewProps = {
  onPromptWithTask: (task: Task) => Promise<void>;
};

export default function EmptyMessagesView({
  onPromptWithTask,
}: EmptyViewProps) {
  return (
    <div className="flex-1 place-items-center grid h-full">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col justify-center items-center gap-4">
          <Image
            src="/vito.png"
            alt="Vito AI"
            width={96}
            height={96}
            className="object-contain"
          />
          <div className="flex flex-col items-center">
            <p className="font-semibold text-lg">I&apos;m here to help!</p>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>Try asking</span>
              <TaskTooltip />
            </div>
          </div>
        </div>
        <div className="place-items-center gap-2 grid grid-cols-2">
          {TASKS.map((task) => (
            <TaskPrompt
              key={task}
              label={task.split("-").map(capitalize).join(" ")}
              onClick={() => onPromptWithTask(task)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
