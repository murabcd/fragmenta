"use client";

import { Question } from "@/types/canvas";

import { Eye, Monitor, Smartphone, Tablet } from "lucide-react";

import { Hint } from "@/components/hint";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { usePreviewSize } from "@/hooks/use-preview";

import { QuestionContent } from "@/components/question-content";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

interface FormPreviewProps {
  formId: string;
}

export const FormPreview = ({ formId }: FormPreviewProps) => {
  const questions = useQuery(api.questions.get, { formId }) as Question[];

  const { previewSize, setPreviewSize } = usePreviewSize();

  return (
    <Dialog>
      <DialogTrigger>
        <Hint label="Preview" side="bottom" sideOffset={10}>
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </Hint>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1024px] max-h-[768px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Form preview</DialogTitle>
          <DialogDescription>
            View your form as respondents will see it. Use device icons to check different
            screen sizes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <div className="h-[28px] items-center justify-center gap-1.5 rounded-md border p-[2px] shadow-sm md:flex">
            <ToggleGroup type="single" value={previewSize} onValueChange={setPreviewSize}>
              <ToggleGroupItem
                value="max-w-[720px]"
                className="h-[22px] w-[22px] rounded-sm p-0"
              >
                <Monitor className="h-3.5 w-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="w-3/5" className="h-[22px] w-[22px] rounded-sm p-0">
                <Tablet className="h-3.5 w-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="w-2/5" className="h-[22px] w-[22px] rounded-sm p-0">
                <Smartphone className="h-3.5 w-3.5" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div className="flex flex-col items-center w-full space-y-4">
          {questions.map((question) => (
            <QuestionContent
              key={question._id}
              question={question}
              newTitle={question.title}
              newDescription={question.description || ""}
              newResponse={""}
              onTitleChange={() => {}}
              onDescriptionChange={() => {}}
              onResponseChange={() => {}}
              updateChoices={() => Promise.resolve()}
              isPreviewMode={true}
              isPublished={true}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
