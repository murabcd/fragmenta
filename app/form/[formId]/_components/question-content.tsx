"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ShortText } from "./form-elements/short-text";
import { LongText } from "./form-elements/long-text";
import { YesNoChoice } from "./form-elements/yes-no-choice";
import { MultipleChoice } from "./form-elements/multiple-choice";

import { Question, QuestionType } from "@/types/canvas";

interface QuestionContentProps {
  question: Question;
}

export const QuestionContent = ({ question }: QuestionContentProps) => {
  const [shortTextResponse, setShortTextResponse] = useState<string>("");
  const [longTextResponse, setLongTextResponse] = useState<string>("");
  const [yesNoResponse, setYesNoResponse] = useState<string>("");
  const [multipleChoiceResponse, setMultipleChoiceResponse] = useState<string[]>([]);

  console.log("Question received in QuestionContent:", question);

  const handleShortTextChange = (newResponse: string) => {
    setShortTextResponse(newResponse);
  };

  const handleLongTextChange = (newResponse: string) => {
    setLongTextResponse(newResponse);
  };

  const handleYesNoChange = (newResponse: string) => {
    setYesNoResponse(newResponse);
  };

  const handleMultipleChoiceChange = (newResponse: string[]) => {
    setMultipleChoiceResponse(newResponse);
  };

  const renderQuestionContent = () => {
    console.log("Rendering content for question type:", question.type);
    switch (question.type) {
      case QuestionType.Short:
        return <ShortText value={shortTextResponse} onChange={handleShortTextChange} />;
      case QuestionType.Long:
        return <LongText value={longTextResponse} onChange={handleLongTextChange} />;
      case QuestionType.YesNo:
        return <YesNoChoice value={yesNoResponse} onChange={handleYesNoChange} />;
      case QuestionType.Multiple:
        return (
          <MultipleChoice
            values={multipleChoiceResponse}
            onChange={handleMultipleChoiceChange}
            options={[
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
              { label: "Option 3", value: "option3" },
            ]}
          />
        );
      default:
        // console.warn(`Unsupported question type: ${question.type}`);
        return null;
    }
  };

  return (
    <Card className="flex flex-col items-center justify-center h-[600px] w-full max-w-4xl p-4 bg-secondary shadow-md rounded-lg space-y-4">
      <Input
        className="bg-primary-foreground hover:bg-primary/10"
        value={question.title}
      />
      <Input
        className="bg-primary-foreground hover:bg-primary/10"
        value={question.description}
      />
      {renderQuestionContent()}
    </Card>
  );
};
