"use client";

import { useState, useEffect } from "react";

import { toast } from "sonner";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { NewQuestionButton } from "./new-question-button";

import { QuestionItem } from "./question-item";

import { Question } from "@/types/canvas";

import { cn } from "@/lib/utils";

import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface EditorProps {
  formId: string;
  questions: Question[];
  onQuestionSelect: (question: Question) => void;
  selectedQuestion: Question | null;
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
  selectedQuestion,
}: EditorProps) => {
  const [orderQuestion, setOrderQuestion] = useState(questions);

  const reorderQuestion = useMutation(api.question.position).withOptimisticUpdate(
    (localStore, { id, position }) => {
      const currentQuestions = localStore.getQuery(api.questions.get, { formId });

      if (currentQuestions) {
        const reorderedQuestions = reorder(
          currentQuestions,
          currentQuestions.findIndex((q) => q._id === id),
          position
        );

        localStore.setQuery(api.questions.get, { formId }, reorderedQuestions);
      }
    }
  );

  useEffect(() => {
    setOrderQuestion(questions);
  }, [questions]);

  const onDragEnd = async (result: any) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    const newOrderedQuestion = reorder(orderQuestion, source.index, destination.index);

    setOrderQuestion(newOrderedQuestion);

    try {
      await Promise.all(
        newOrderedQuestion.map((question, index) =>
          reorderQuestion({
            id: question._id as Id<"questions">,
            position: index,
          })
        )
      );
      toast.success("Question reordered");
    } catch (error) {
      toast.error("Failed to reorder question");

      setOrderQuestion(questions);
    }
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
                {orderQuestion.map((question, index) => (
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
