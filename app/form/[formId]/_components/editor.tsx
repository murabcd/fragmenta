"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { NewQuestionButton } from "./new-question-button";

import { QuestionItem } from "./form-elements/question-item";

import { Question } from "@/types/canvas";

import { cn } from "@/lib/utils";

interface EditorProps {
  formId: string;
  questions: Question[];
  onQuestionSelect: (question: Question) => void;
  selectedQuestion: Question | null;
  onDragEnd: (result: any) => void;
}

export const Editor = ({
  formId,
  questions,
  onQuestionSelect,
  selectedQuestion,
  onDragEnd,
}: EditorProps) => {
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
                  <Draggable key={question._id} draggableId={question._id} index={index}>
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
                          className={cn({
                            "text-primary bg-primary/10":
                              selectedQuestion && question._id === selectedQuestion._id,
                          })}
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
