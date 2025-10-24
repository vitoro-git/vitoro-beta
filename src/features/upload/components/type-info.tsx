"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table } from "../types";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function TypeInfo({ table }: { table: Table }) {
  const [isCopied, setIsCopied] = useState(false);
  const text = getTypeString(table);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  }

  return (
    <Card className="relative w-[440px] text-sm">
      <CardContent>
        <pre>
          <code>{text}</code>
        </pre>
        <Button
          variant="outline"
          className="top-2 right-2 absolute"
          onClick={handleCopy}
        >
          {isCopied ? <Check /> : <Copy />}
        </Button>
      </CardContent>
    </Card>
  );
}

function getTypeString(table: Table) {
  switch (table) {
    case "qbank":
      return `type QBankQuestion = {
  systems: string[];
  shelf: string; // step-2 only
  organ: string; // step-2 only
  clinicalSetting: string; // step-2 only
  topic: string;
  competency: string | null; // step-1 only
  concept: string | null; // step-1 only
  type: string | null; // step-1 only

  stem: string;
  answer: "a" | "b" | "c" | "d" | "e";
  choices: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
  };
  explanation: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
  };
  labValues: {
    analyte: string;
    value: number | null;
    unit: string | null;
    qual: string | null;
    panel: string;
  }[];

  step: "step-1" | "step-2";
};`;

    case "foundational":
      return `type FoundationalQuestion = {
  id: string;
  topic: string;
  subtopic: string | null; // step-1 only
  shelf: string; // step-1 = subject
  system: string | null; // step-2 only

  stem: string;
  expectedAnswer: string; // step-1 = diagnosis

  step: "step-1" | "step-2";
};`;
    case "foundational-followup":
      return `type FoundationalFollowupQuestion = {
  questionId: string;
  stem: string;
  answer: "a" | "b" | "c" | "d" | "e";
  choices: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
  };
  explanations: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
  };
  axis: string;
  isIntegration: boolean;
};`;
  }
}
