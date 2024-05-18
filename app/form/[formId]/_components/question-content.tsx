"use client";

import { useState, useEffect } from "react";

import { useDebouncedCallback } from "use-debounce";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ShortText } from "./form-elements/short-text";
import { LongText } from "./form-elements/long-text";
import { YesNoChoice } from "./form-elements/yes-no-choice";
import { MultipleChoice } from "./form-elements/multiple-choice";
import { RatingScore } from "./form-elements/rating-score";

import { Question, QuestionType } from "@/types/canvas";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";

interface QuestionContentProps {
  question: Question;
}

export const QuestionContent = ({ question }: QuestionContentProps) => {
  const { mutate: title } = useApiMutation(api.question.title);
  const { mutate: description } = useApiMutation(api.question.description);

  const [newTitle, setNewTitle] = useState<string>(question.title);
  const [newDescription, setNewDescription] = useState<string>(question.description!);

  useEffect(() => {
    setNewTitle(question.title);
    setNewDescription(question.description!);
  }, [question]);

  const debouncedSaveTitle = useDebouncedCallback((newTitle) => {
    title({ id: question._id, title: newTitle });
  }, 500);

  const debouncedSaveDescription = useDebouncedCallback((newDescription) => {
    description({ id: question._id, description: newDescription });
  }, 500);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    setNewTitle(newTitle);
    debouncedSaveTitle(newTitle);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = event.target.value;
    setNewDescription(newDescription);
    debouncedSaveDescription(newDescription);
  };

  const renderQuestionContent = () => {
    console.log("Rendering content for question type:", question.type);
    switch (question.type) {
      case QuestionType.Short:
        return <ShortText value={""} onChange={() => {}} />;
      case QuestionType.Long:
        return <LongText value={""} onChange={() => {}} />;
      case QuestionType.YesNo:
        return <YesNoChoice value={""} onChange={() => {}} />;
      case QuestionType.Multiple:
        return (
          <MultipleChoice
            values={[]}
            onChange={() => {}}
            options={[
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
              { label: "Option 3", value: "option3" },
            ]}
          />
        );
      case QuestionType.Rating:
        return <RatingScore value={""} onChange={() => {}} />;
      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-col items-center justify-center h-[600px] w-full max-w-4xl p-4 bg-secondary shadow-md rounded-lg space-y-4">
      <Input
        className="bg-primary-foreground text-lg hover:bg-primary/10"
        value={newTitle}
        placeholder="Title"
        onChange={handleTitleChange}
      />
      <Input
        className="bg-primary-foreground text-muted-foreground hover:bg-primary/10"
        value={newDescription}
        placeholder="Description (optional)"
        onChange={handleDescriptionChange}
      />
      {renderQuestionContent()}
    </Card>
  );
};
