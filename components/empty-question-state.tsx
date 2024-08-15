"use client";

import { Plus, MessageCircleQuestion } from "lucide-react";

import { toast } from "sonner";

import { QuestionType } from "@/types/canvas";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";
import { GenerateQuestions } from "./question-generate";

interface EmptyQuestionStateProps {
  formId: string;
}

export const EmptyQuestionState = ({ formId }: EmptyQuestionStateProps) => {
  const { mutate, pending } = useApiMutation(api.questions.create);

  const onClick = () => {
    mutate({
      formId,
      title: "Untitled",
      description: "",
      type: QuestionType.Short,
      choices: [],
      position: 0,
      isRequired: false,
    })
      .then(() => {
        toast.success("Question created");
      })
      .catch(() => {
        toast.error("Failed to create question");
      });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <MessageCircleQuestion className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-semibold mt-6">Add your first question</h2>
      <p className="text-muted-foreground text-sm mt-2">
        You haven&apos;t created any questions yet.
      </p>
      <div className="flex gap-4 mt-6">
        <button
          onClick={onClick}
          disabled={pending}
          className="w-40 h-40 border rounded-lg hover:bg-accent flex flex-col items-center justify-center py-6"
        >
          <Plus className="w-6 h-6 mb-2" />
          <p className="text-sm font-light">Start from scratch</p>
        </button>
        <GenerateQuestions formId={formId} />
      </div>
    </div>
  );
};
