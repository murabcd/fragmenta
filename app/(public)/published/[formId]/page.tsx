"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Progress } from "@/components/ui/progress";

import { useDebounce, useDebouncedCallback } from "use-debounce";

import { QuestionContent } from "@/components/question-content";

import { NotFoundState } from "./_components/not-found-state";

import { Question } from "@/types/canvas";

import { cn } from "@/lib/utils";

import { useQuery } from "convex/react";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface FormIdPagePublishedProps {
  params: {
    formId: string;
  };
}

const FormIdPagePublished = ({ params }: FormIdPagePublishedProps) => {
  const { mutate: updateResponse } = useApiMutation(api.question.response);

  const router = useRouter();

  const [positionIndex, setPositionIndex] = useState(0);
  const [debouncedPositionIndex] = useDebounce(positionIndex, 300);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});

  const form = useQuery(api.form.get, {
    id: params.formId as Id<"forms">,
  });

  const questions = useQuery(api.questions.published, {
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
    router.push("/");
  };

  const debouncedUpdateResponse = useDebouncedCallback(
    (questionId: Id<"questions">, formId: Id<"forms">, response: string | string[]) => {
      updateResponse({
        questionId,
        formId,
        response,
      });
    },
    500
  );

  const handleResponseChange = (id: string, response: string | string[]) => {
    setResponses((prev) => ({ ...prev, [id]: response }));

    debouncedUpdateResponse(
      id as Id<"questions">,
      params.formId as Id<"forms">,
      response
    );
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
          className="h-2 rounded-full transition-all duration-300"
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
            newResponse={responses[questions[debouncedPositionIndex]._id] || ""}
            onTitleChange={() => {}}
            onDescriptionChange={() => {}}
            onResponseChange={handleResponseChange}
            updateChoices={() => Promise.resolve()}
            onStart={handleForward}
            onComplete={handleComplete}
            onBack={handleBack}
            onForward={handleForward}
            isBackDisabled={positionIndex === 0}
            isForwardDisabled={positionIndex === questions.length - 1}
            isPreviewMode={true}
            isPublished={true}
          />
        </div>
      </div>
    </div>
  );
};

export default FormIdPagePublished;
