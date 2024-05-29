"use client";

import { Input } from "@/components/ui/input";

import { ShortText } from "./short-text";
import { LongText } from "./long-text";
import { YesNoChoice } from "./yes-no-choice";
import { SingleChoice } from "./single-choice";
import { MultipleChoice } from "./multiple-choice";
import { RatingScore } from "./rating-score";

import { usePreviewSize } from "@/hooks/use-preview";

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

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(question._id, event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDescriptionChange(question._id, event.target.value);
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case QuestionType.Short:
        return <ShortText value={""} onChange={() => {}} />;
      case QuestionType.Long:
        return <LongText value={""} onChange={() => {}} />;
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
      className={`flex flex-col items-center justify-center w-full h-[600px] px-4 bg-background shadow-none space-y-4 ${isPreviewMode ? previewSize : ""}`}
    >
      <Input
        className="border-none text-lg"
        value={newTitle}
        placeholder="Title"
        onChange={handleTitleChange}
      />
      <Input
        className="border-none text-muted-foreground"
        value={newDescription}
        placeholder="Description (optional)"
        onChange={handleDescriptionChange}
      />
      {renderQuestionContent()}
    </Card>
  );
};
