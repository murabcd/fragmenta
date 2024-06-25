"use client";

import { StartScreen } from "./form-elements/start-screen";
import { EndScreen } from "./form-elements/end-screen";

import { ShortText } from "./form-elements/short-text";
import { LongText } from "./form-elements/long-text";
import { YesNoChoice } from "./form-elements/yes-no-choice";
import { SingleChoice } from "./form-elements/single-choice";
import { MultipleChoice } from "./form-elements/multiple-choice";
import { RatingScore } from "./form-elements/rating-score";

import { StartButton } from "./start-button";
import { CompleteButton } from "./complete-button";
import { NavigationButtons } from "./nav-button";

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
  onStart?: () => void;
  onComplete?: () => void;
  onBack?: () => void;
  onForward?: () => void;
  isBackDisabled?: boolean;
  isForwardDisabled?: boolean;
  isPreviewMode?: boolean;
}

export const QuestionContent = ({
  question,
  newTitle,
  newDescription,
  onTitleChange,
  onDescriptionChange,
  updateChoices,
  onStart,
  onComplete,
  onBack,
  onForward,
  isBackDisabled,
  isForwardDisabled,
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
      case QuestionType.Start:
        return <StartScreen />;
      case QuestionType.End:
        return <EndScreen />;
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

  const renderButtons = () => {
    if (question.type === QuestionType.Start && onStart) {
      return <StartButton onClick={onStart} />;
    } else if (question.type === QuestionType.End && onComplete) {
      return <CompleteButton onClick={onComplete} />;
    } else if (onBack && onForward) {
      return (
        <NavigationButtons
          onBack={onBack}
          onForward={onForward}
          isBackDisabled={isBackDisabled || false}
          isForwardDisabled={isForwardDisabled || false}
        />
      );
    }
    return null;
  };

  const isScreen =
    question.type === QuestionType.Start || question.type === QuestionType.End;

  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center w-full min-h-[600px] px-4 bg-background border-none shadow-none space-y-4",
        isPreviewMode ? previewSize : ""
      )}
    >
      <div className={cn("w-full", isScreen && "flex flex-col items-center space-y-6")}>
        <textarea
          ref={titleRef}
          className={cn(
            "bg-transparent w-full focus-visible:outline-none resize-none",
            isScreen ? "text-3xl text-center" : "text-2xl"
          )}
          value={newTitle}
          placeholder="Title"
          onChange={handleTitleChange}
        />
        <textarea
          ref={descriptionRef}
          className={cn(
            "bg-transparent w-full text-muted-foreground focus-visible:outline-none resize-none",
            isScreen ? "text-lg text-center max-w-md" : "text-sm"
          )}
          value={newDescription}
          placeholder="Description (optional)"
          onChange={handleDescriptionChange}
        />
      </div>
      {renderQuestionContent()}
      {renderButtons()}
    </Card>
  );
};
