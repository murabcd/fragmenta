"use client";

import { NewQuestionButton } from "./new-question-buttom";

import { QuestionItem } from "./question-card/question-item";

import { Question } from "@/types/canvas";

interface EditorProps {
  formId: string;
  questions: Question[];
  onQuestionSelect: (question: Question) => void;
}

export const Editor = ({
  formId,
  questions,
  onQuestionSelect,
}: EditorProps) => {
  return (
    <div className="flex flex-col h-full w-64 bg-secondary">
      <div className="flex items-center justify-between p-2">
        <div className="text-basic font-medium">Questions</div>
        <NewQuestionButton formId={formId} />
      </div>
      <div className="flex flex-col text-sm font-medium text-muted-foreground">
        {questions?.map((question) => (
          <QuestionItem
            key={question._id}
            question={question}
            onClick={() => onQuestionSelect(question)}
          />
        ))}
      </div>
    </div>
  );
};
