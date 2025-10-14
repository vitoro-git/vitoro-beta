import { ButtonGroup } from "@/components/ui/button-group";
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { ArrowUp } from "lucide-react";
import { useRef } from "react";

type ChatInputProps = {
  submitKeys?: string[];
  isLoading: boolean;
  onSubmit: (message: string) => Promise<void>;
  buttons?: React.ReactNode;
};

export default function ChatInput({
  submitKeys = [],
  isLoading,
  onSubmit,
  buttons,
}: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit() {
    if (!inputRef.current) return;
    const inputValue = inputRef.current.value;
    if (!inputValue) return;
    inputRef.current.value = "";
    await onSubmit(inputValue);
  }

  async function handleKeydown(event: React.KeyboardEvent) {
    if (submitKeys.includes(event.key)) {
      event.preventDefault();
      await handleSubmit();
    }
  }

  return (
    <InputGroup className="right-0 bottom-4 left-0 sticky backdrop-blur-md -mt-30">
      <InputGroupTextarea
        placeholder="Ask a question..."
        onKeyDown={handleKeydown}
        ref={inputRef}
      />
      <InputGroupAddon align="block-end">
        {buttons && <ButtonGroup>{buttons}</ButtonGroup>}

        <InputGroupButton
          variant="default"
          className="ml-auto rounded-full"
          size="icon-sm"
          onClick={handleSubmit}
          disabled={isLoading || !inputRef.current}
        >
          <LoadingSwap isLoading={isLoading}>
            <ArrowUp />
          </LoadingSwap>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
