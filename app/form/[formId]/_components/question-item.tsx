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
      className={`flex items-center justify-between m-2 p-3 font-medium cursor-pointer border bg-background/55 dark:border-primary/10 hover:text-primary hover:bg-primary/10 rounded-lg transition ${className}`}
    >
      {question.title}
      <QuestionActions id={question._id} title={question.title} align="end" side="right">
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </QuestionActions>
    </ul>
  );
};
