"use client";

import { ShortText } from "./form-elements/short-text";
import { LongText } from "./form-elements/long-text";
import { YesNoChoice } from "./form-elements/yes-no-choice";
import { SingleChoice } from "./form-elements/single-choice";
import { MultipleChoice } from "./form-elements/multiple-choice";
import { RatingScore } from "./form-elements/rating-score";

import { usePreviewSize } from "@/hooks/use-preview";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize";

import { cn } from "@/lib/utils";

import { Question, QuestionType } from "@/types/canvas";
import { Card } from "@/components/ui/card";

interface QuestionContentProps {
  question: Question;
  newTitle: string;
  newDescription: string;
  onTitleChange: (id: string, title: string) => void;
  onDescriptionChange: (id: string, description: string) => void;
  updateChoices: (choices: { id: string; choices: string[] }) => Promise<void>;
  isPreviewMode?: boolean;
}

export const QuestionContent = ({
  question,
  newTitle,
  newDescription,
  onTitleChange,
  onDescriptionChange,
  updateChoices,
  isPreviewMode = false,
}: QuestionContentProps) => {
  const { previewSize } = usePreviewSize();

  const titleRef = useAutoResizeTextarea(newTitle, "32px", previewSize);
  const descriptionRef = useAutoResizeTextarea(newDescription, "32px", previewSize);

  const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTitleChange(question._id, event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onDescriptionChange(question._id, event.target.value);
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case QuestionType.Short:
        return <ShortText value={""} onChange={() => {}} resizeTrigger={previewSize} />;
      case QuestionType.Long:
        return <LongText value={""} onChange={() => {}} resizeTrigger={previewSize} />;
      case QuestionType.YesNo:
        return (
          <YesNoChoice
            id={question._id}
            key={question._id}
            value={""}
            onChange={() => {}}
            options={question.choices.map((choice) => ({ label: choice, value: choice }))}
            updateChoices={updateChoices}
          />
        );
      case QuestionType.Single:
        return (
          <SingleChoice
            id={question._id}
            key={question._id}
            value={""}
            onChange={() => {}}
            options={question.choices.map((choice) => ({ label: choice, value: choice }))}
            updateChoices={updateChoices}
          />
        );
      case QuestionType.Multiple:
        return (
          <MultipleChoice
            id={question._id}
            key={question._id}
            values={[]}
            onChange={() => {}}
            options={question.choices.map((choice) => ({ label: choice, value: choice }))}
            updateChoices={updateChoices}
          />
        );
      case QuestionType.Rating:
        return <RatingScore value={""} onChange={() => {}} />;
      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center w-full min-h-[600px] px-4 bg-background border-none shadow-none space-y-4",
        isPreviewMode ? previewSize : ""
      )}
    >
      <textarea
        ref={titleRef}
        className="bg-transparent text-2xl w-full focus-visible:outline-none resize-none"
        value={newTitle}
        placeholder="Title"
        onChange={handleTitleChange}
      />
      <textarea
        ref={descriptionRef}
        className="bg-transparent text-sm text-muted-foreground w-full focus-visible:outline-none resize-none"
        value={newDescription}
        placeholder="Description (optional)"
        onChange={handleDescriptionChange}
      />
      {renderQuestionContent()}
    </Card>
  );
};
