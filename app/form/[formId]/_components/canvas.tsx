"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Info } from "./info";
import { Editor } from "./editor";
import { Content } from "./content";
import { Settings } from "./settings";

import { Question, QuestionType } from "@/types/canvas";

import { useQuery } from "convex/react";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";

interface CanvasProps {
  formId: string;
}

export const Canvas = ({ formId }: CanvasProps) => {
  const questions = useQuery(api.questions.get, { formId }) as Question[];
  const { mutate } = useApiMutation(api.question.type);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState(QuestionType.Short);

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
    setSelectedQuestionType(question.type);
  };

  const handleTypeChange = async (newType: QuestionType) => {
    if (selectedQuestion) {
      try {
        await mutate({ id: selectedQuestion._id, type: newType });
        setSelectedQuestion({ ...selectedQuestion, type: newType });
        setSelectedQuestionType(newType);
        toast.success("Type updated");
      } catch (error) {
        toast.error("Failed to update type");
      }
    }
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
          selectedQuestion={selectedQuestion}
        />
        <Content selectedQuestion={selectedQuestion} />
        <Settings type={selectedQuestionType} onTypeChange={handleTypeChange} />
      </div>
    </main>
  );
};
