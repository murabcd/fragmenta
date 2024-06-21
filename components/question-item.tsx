"use client";

import { Draggable } from "@hello-pangea/dnd";

import { Button } from "@/components/ui/button";

import {
  Text,
  ListMinus,
  CheckCheck,
  ListTodo,
  ListChecks,
  BarChart,
  MoreHorizontal,
} from "lucide-react";

import { QuestionActions } from "./question-actions";

import { Question, QuestionType } from "@/types/canvas";

interface QuestionItemProps {
  index: number;
  question: Question;
  className?: string;
  onClick: () => void;
}

const questionTypelcons = {
  [QuestionType.Short]: Text,
  [QuestionType.Long]: ListMinus,
  [QuestionType.YesNo]: CheckCheck,
  [QuestionType.Single]: ListTodo,
  [QuestionType.Multiple]: ListChecks,
  [QuestionType.Rating]: BarChart,
};

export const QuestionItem = ({
  index,
  question,
  className,
  onClick,
}: QuestionItemProps) => {
  const Icon = questionTypelcons[question.type];

  return (
    <Draggable draggableId={question._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="flex flex-col"
        >
          <div
            onClick={onClick}
            className={`group flex items-center justify-between m-2 p-3 cursor-pointer hover:text-foreground rounded-lg transition ${className}`}
          >
            <div className="flex items-center truncate max-w-[80%]">
              {Icon && <Icon className="h-4 w-4 mr-2 flex-shrink-0" />}
              <span className="truncate">{question.title}</span>
            </div>
            <QuestionActions
              id={question._id}
              title={question.title}
              align="end"
              side="right"
            >
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </QuestionActions>
          </div>
        </div>
      )}
    </Draggable>
  );
};
