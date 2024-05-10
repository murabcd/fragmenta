"use client";

import { useState } from "react";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { NewQuestionButton } from "./new-question-button";

import { QuestionItem } from "./question-card/question-item";

import { Question } from "@/types/canvas";

interface EditorProps {
  formId: string;
  questions: Question[];
  onQuestionSelect: (question: Question) => void;
}

function reorder<T>(questions: T[], startIndex: number, endIndex: number) {
  const result = Array.from(questions);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const Editor = ({
  formId,
  questions,
  onQuestionSelect,
}: EditorProps) => {
  const [orderQuestion, setOrderQuestion] = useState(questions);

  const onDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    const newOrderedQuestion = reorder(
      orderQuestion,
      source.index,
      destination.index
    );

    setOrderQuestion(newOrderedQuestion);
  };

  return (
    <div className="flex flex-col h-full w-64 bg-secondary">
      <div className="flex items-center justify-between p-2">
        <div className="text-basic font-medium">Questions</div>
        <NewQuestionButton formId={formId} />
      </div>
      <div className="flex flex-col text-sm font-medium text-muted-foreground overflow-y-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questionsDroppable">
            {(provided) => (
              <ol {...provided.droppableProps} ref={provided.innerRef}>
                {questions.map((question, index) => (
                  <Draggable
                    key={question._id}
                    draggableId={question._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex flex-col"
                      >
                        <QuestionItem
                          question={question}
                          onClick={() => onQuestionSelect(question)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ol>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};
