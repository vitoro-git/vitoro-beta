import { cn } from "@/lib/utils";
import { Flashcard } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { countClozeString, hiddenClozeString } from "../utils";

const CARD_WIDTH = "w-2xl";
const CARD_HEIGHT = "min-h-[400px]";
const CARD_STYLE = "rounded-md shadow-md border bg-card p-4";

type FlashcardViewProps = {
  card: Flashcard;
};

export default function FlashcardView({ card }: FlashcardViewProps) {
  function renderCard() {
    switch (card.type) {
      case "front-back":
        return <FrontBackView />;
      case "cloze":
        return <ClozeView />;
    }
  }

  return (
    <div className={cn(CARD_WIDTH, CARD_HEIGHT, "flex text-lg")}>
      <FlashcardProvider card={card}>{renderCard()}</FlashcardProvider>
    </div>
  );
}

// Flashcard Context

type FlashcardContextType = {
  card: { front: string; back: string | null };
  side: "front" | "back";
  onFlip: () => void;
};

const FlashcardContext = createContext<FlashcardContextType>({
  card: { front: "", back: "" },
  side: "front",
  onFlip: () => {},
});

type FlashcardProviderProps = {
  children: ReactNode;
  card: Flashcard;
};

function FlashcardProvider({ children, card }: FlashcardProviderProps) {
  const [side, setSide] = useState<"front" | "back">("front");

  function handleFlip() {
    setSide(side === "front" ? "back" : "front");
  }

  return (
    <FlashcardContext.Provider value={{ card: card, side, onFlip: handleFlip }}>
      {children}
    </FlashcardContext.Provider>
  );
}

function useFlashcard() {
  return useContext(FlashcardContext);
}

// Flip Container

type FlipContainerProps = {
  renderFront: (front: string) => ReactNode;
  renderBack: (back: string | null) => ReactNode;
};

function FlipContainer({ renderFront, renderBack }: FlipContainerProps) {
  const { card, side } = useFlashcard();

  return (
    <div
      className="relative flex-1 transition-transform duration-700 [transform-style:preserve-3d]"
      style={{
        transform: side === "back" ? "rotateY(180deg)" : "rotateY(0deg)",
      }}
    >
      <div
        className={cn(
          CARD_STYLE,
          "absolute inset-0 [backface-visibility:hidden]"
        )}
      >
        {renderFront(card.front)}
      </div>

      <div
        className={cn(
          CARD_STYLE,
          "absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-secondary"
        )}
      >
        {renderBack(card.back)}
      </div>
    </div>
  );
}

// Flashcard Types

function FrontBackView() {
  const { onFlip } = useFlashcard();

  return (
    <div className="flex flex-1 cursor-pointer" onClick={onFlip}>
      <FlipContainer
        renderFront={(front) => <ReactMarkdown>{front}</ReactMarkdown>}
        renderBack={(back) => <ReactMarkdown>{back}</ReactMarkdown>}
      />
    </div>
  );
}

function ClozeView() {
  const { card, side, onFlip } = useFlashcard();
  const [revealedCount, setRevealedCount] = useState(0);
  const blankCount = countClozeString(card[side]);

  function handleClick() {
    if (revealedCount < blankCount) return setRevealedCount((prev) => prev + 1);
    setRevealedCount(0);
    onFlip();
  }

  return (
    <div className="flex flex-1 cursor-pointer" onClick={handleClick}>
      <FlipContainer
        renderFront={(front) => (
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {hiddenClozeString(front, revealedCount)}
          </ReactMarkdown>
        )}
        renderBack={(back) => (
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {hiddenClozeString(back, revealedCount)}
          </ReactMarkdown>
        )}
      />
    </div>
  );
}
