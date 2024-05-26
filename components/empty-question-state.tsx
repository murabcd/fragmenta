"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { Plus, MessageCircleQuestion, LoaderCircle, Sparkles } from "lucide-react";

import { QuestionType } from "@/types/canvas";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";

export const EmptyQuestionState = ({ formId }: { formId: string }) => {
  const { mutate, pending } = useApiMutation(api.question.create);

  const onClick = () => {
    mutate({
      formId,
      title: "Untitled",
      description: "",
      type: QuestionType.Short,
      choices: [],
      position: 0,
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
          className="w-40 h-40 border rounded-lg hover:bg-primary/10 flex flex-col items-center justify-center py-6"
        >
          {pending ? (
            <LoaderCircle className="animate-spin w-6 h-6 mb-2" />
          ) : (
            <Plus className="w-6 h-6 mb-2" />
          )}
          <p className="text-sm font-light">Start from scratch</p>
        </button>
        <button
          onClick={() => {}}
          disabled={pending}
          className="w-40 h-40 border rounded-lg hover:bg-primary/10 flex flex-col items-center justify-center py-6"
        >
          <Sparkles className="w-6 h-6 mb-2" color="#8879d4" />
          <p className="text-sm font-light">Create with AI</p>
        </button>
      </div>
    </div>
  );
};
