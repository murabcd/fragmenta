"use client";

import { Question } from "@/types/canvas";

import { QuestionContent } from "./form-elements/question-content";
import { EmptyQuestionState } from "@/components/empty-question-state";

interface ContentProps {
  formId: string;
  questions: Question[];
  selectedQuestion: Question | null;
  newTitle: string;
  newDescription: string;
  onTitleChange: (id: string, title: string) => void;
  onDescriptionChange: (id: string, description: string) => void;
  updateChoices: (choices: { id: string; choices: string[] }) => Promise<void>;
  previewSize: string;
}

export const Content = ({
  formId,
  questions,
  selectedQuestion,
  newTitle,
  newDescription,
  onTitleChange,
  onDescriptionChange,
  updateChoices,
  previewSize,
}: ContentProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center h-full p-4">
      {questions.length === 0 ? (
        <EmptyQuestionState formId={formId} />
      ) : selectedQuestion ? (
        <QuestionContent
          question={selectedQuestion}
          newTitle={newTitle}
          newDescription={newDescription}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          updateChoices={updateChoices}
          previewSize={previewSize}
        />
      ) : (
        <div className="text-muted-foreground">Select a question to edit</div>
      )}
    </div>
  );
};
