"use client";

import { useState } from "react";

import { Info } from "./info";
import { Editor } from "./editor";
import { Content } from "./content";
import { Settings } from "./settings";

import { Question, QuestionType } from "@/types/canvas";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

interface CanvasProps {
  formId: string;
}

export const Canvas = ({ formId }: CanvasProps) => {
  const questions = useQuery(api.questions.get, { formId }) as Question[];
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [currentType, setCurrentType] = useState<QuestionType>(
    QuestionType.ShortText
  );

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
  };

  const handleTypeChange = (newType: QuestionType) => {
    setCurrentType(newType);
  };

  if (!questions) return null;

  return (
    <main className="h-full w-full overflow-hidden relative bg-mute touch-none">
      <Info formId={formId} />
      <div className="flex h-[750px]">
        <Editor
          formId={formId}
          questions={questions}
          onQuestionSelect={handleQuestionSelect}
        />
        <Content selectedQuestion={selectedQuestion} />
        <Settings type={currentType} onTypeChange={handleTypeChange} />
      </div>
    </main>
  );
};
