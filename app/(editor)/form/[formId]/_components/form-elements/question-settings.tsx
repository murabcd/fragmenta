"use client";

import { TypeSelector } from "./type-selector";

import { Question, QuestionType } from "@/types/canvas";

interface QuestionSettingsProps {
  question: Question;
  newType: QuestionType;
  handleTypeChange: (id: string, newType: QuestionType) => void;
}

export const QuestionSettings = ({
  question,
  newType,
  handleTypeChange,
}: QuestionSettingsProps) => {
  return (
    <div>
      <TypeSelector question={question} type={newType} onTypeChange={handleTypeChange} />
    </div>
  );
};
