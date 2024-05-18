"use client";

import { Question } from "@/types/canvas";

import { QuestionContent } from "./question-content";

interface ContentProps {
  selectedQuestion: Question | null;
  newTitle: string;
  newDescription: string;
  onTitleChange: (id: string, title: string) => void;
  onDescriptionChange: (id: string, description: string) => void;
}

export const Content = ({
  selectedQuestion,
  newTitle,
  newDescription,
  onTitleChange,
  onDescriptionChange,
}: ContentProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center h-full p-4">
      {selectedQuestion ? (
        <QuestionContent
          question={selectedQuestion}
          newTitle={newTitle}
          newDescription={newDescription}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
        />
      ) : (
        <p>Select a question</p>
      )}
    </div>
  );
};
