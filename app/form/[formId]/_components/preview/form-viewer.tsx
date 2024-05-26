"use client";

import { Question } from "@/types/canvas";

import { Button } from "@/components/ui/button";

import { Eye } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { QuestionContent } from "../form-elements/question-content";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

interface FormViewerProps {
  formId: string;
}

export const FormViewer = ({ formId }: FormViewerProps) => {
  const questions = useQuery(api.questions.get, { formId }) as Question[];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview mode</DialogTitle>
          <DialogDescription>View your form in preview mode.</DialogDescription>
        </DialogHeader>
        {questions.map((question) => (
          <QuestionContent
            key={question._id}
            question={question}
            newTitle={question.title}
            newDescription={question.description || " "}
            onTitleChange={() => {}}
            onDescriptionChange={() => {}}
            updateChoices={() => Promise.resolve()}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
};
