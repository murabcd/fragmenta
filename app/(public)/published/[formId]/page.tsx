"use client";

import { useState } from "react";

import { Progress } from "@/components/ui/progress";

import { useDebounce } from "use-debounce";

import { QuestionContent } from "@/components/question-content";

import { NotFoundState } from "./_components/not-found-state";

import { Question } from "@/types/canvas";

import { cn } from "@/lib/utils";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface FormIdPagePublishedProps {
  params: {
    formId: string;
  };
}

const FormIdPagePublished = ({ params }: FormIdPagePublishedProps) => {
  const [positionIndex, setPositionIndex] = useState(0);
  const [debouncedPositionIndex] = useDebounce(positionIndex, 300);

  const form = useQuery(api.form.get, {
    id: params.formId as Id<"forms">,
  });

  const questions = useQuery(api.questions.getById, {
    formId: params.formId as Id<"forms">,
  }) as Question[];

  const handleBack = () => {
    if (questions && positionIndex > 0) {
      setPositionIndex(positionIndex - 1);
    }
  };

  const handleForward = () => {
    if (questions && positionIndex < questions.length - 1) {
      setPositionIndex(positionIndex + 1);
    }
  };

  const handleComplete = () => {
    // Handle form submission logic here
    console.log("Form completed");
  };

  const progress =
    questions && questions.length > 0
      ? ((positionIndex + 1) / questions.length) * 100
      : 0;

  if (!form || !questions) {
    return null;
  }

  if (!form.isPublished) {
    return (
      <div>
        <NotFoundState />
      </div>
    );
  }

  return (
    <div>
      <div className="w-full h-2.5 p-3">
        <Progress
          className="h-2.5 rounded-full transition-all duration-300"
          value={progress}
        />
      </div>
      <div className="max-w-[720px] mx-auto">
        <div
          className={cn(
            "transition-opacity duration-300",
            debouncedPositionIndex !== positionIndex ? "opacity-0" : "opacity-100"
          )}
        >
          <QuestionContent
            question={questions[debouncedPositionIndex]}
            key={questions[debouncedPositionIndex]._id}
            newTitle={questions[debouncedPositionIndex].title}
            newDescription={questions[debouncedPositionIndex].description || ""}
            onTitleChange={() => {}}
            onDescriptionChange={() => {}}
            updateChoices={() => Promise.resolve()}
            onStart={handleForward}
            onComplete={handleComplete}
            onBack={handleBack}
            onForward={handleForward}
            isBackDisabled={positionIndex === 0}
            isForwardDisabled={positionIndex === questions.length - 1}
            isPreviewMode={true}
          />
        </div>
      </div>
    </div>
  );
};

export default FormIdPagePublished;
