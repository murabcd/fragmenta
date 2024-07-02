"use client";

import { FormEventHandler } from "react";

import { useCompletion } from "ai/react";

import {
  Plus,
  MessageCircleQuestion,
  LoaderCircle,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { QuestionType } from "@/types/canvas";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";

interface EmptyQuestionStateProps {
  formId: string;
}

export const EmptyQuestionState = ({ formId }: EmptyQuestionStateProps) => {
  const { mutate, pending } = useApiMutation(api.question.create);

  const { input, handleInputChange, handleSubmit } = useCompletion({
    api: "https://brilliant-cobra-27.convex.site/api/generate",
    body: { formId },
  });

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

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    try {
      await handleSubmit(event);
      toast.success("Questions generated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate questions");
    }
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
          {pending ? (
            <LoaderCircle className="animate-spin w-6 h-6 mb-2" />
          ) : (
            <Plus className="w-6 h-6 mb-2" />
          )}
          <p className="text-sm font-light">Start from scratch</p>
        </button>
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-40 h-40 border rounded-lg hover:bg-accent flex flex-col items-center justify-center py-6">
              <Sparkles className="w-6 h-6 mb-2" color="#8879d4" />
              <p className="text-sm font-light">Create with AI</p>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Generate custom questions with AI</DialogTitle>
              <DialogDescription>
                Describe the form you have in mind and AI will do the magic.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit}>
              <div className="grid gap-4 py-4">
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="E.g., feedback form about team building held in New York"
                  className="resize-none"
                  value={input}
                  onChange={handleInputChange}
                />
              </div>
              <span className="text-xs text-muted-foreground flex items-center">
                AI can make mistakes. Check important info.
              </span>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {pending ? (
                    <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
                  ) : (
                    <WandSparkles className="w-4 h-4 mr-2" />
                  )}
                  Generate
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
