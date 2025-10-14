export type Table = "qbank" | "foundational" | "foundational-followup";

export type UploadedQBank = {
  systems: string[];
  categories: string[];
  subcategory: string | null; // step-2 only
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
  explanations: {
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
};

export type UploadedFoundational = {
  id: string;
  topic: string;
  subtopic: string | null; // step-1 only
  shelf: string; // step-1 = subject
  system: string | null; // step-2 only

  stem: string;
  expectedAnswer: string; // step-1 = diagnosis

  step: "step-1" | "step-2";
};

export type UploadedFoundationalFollowup = {
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
};
