"use client";

import { Button } from "@/components/ui/button";

import { MoreHorizontal } from "lucide-react";

import { QuestionActions } from "./question-actions";

import { Question } from "@/types/canvas";

interface QuestionItemProps {
  question: Question;
  className?: string;
  onClick: () => void;
}

export const QuestionItem = ({ question, className, onClick }: QuestionItemProps) => {
  return (
    <ul
      onClick={onClick}
      className={`flex items-center justify-between m-2 p-3 cursor-pointer hover:text-foreground rounded-lg transition ${className}`}
    >
      <span className="truncate max-w-[calc(100%-40px)]">{question.title}</span>
      <QuestionActions id={question._id} title={question.title} align="end" side="right">
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </QuestionActions>
    </ul>
  );
};
