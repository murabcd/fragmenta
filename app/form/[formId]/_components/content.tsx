"use client";

import { Question } from "@/types/canvas";

import { QuestionContent } from "./question-content";

interface ContentProps {
  selectedQuestion: Question | null;
}

export const Content = ({ selectedQuestion }: ContentProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center h-full p-4">
      {selectedQuestion ? (
        <QuestionContent question={selectedQuestion} />
      ) : (
        <p>Select a question</p>
      )}
    </div>
  );
};
