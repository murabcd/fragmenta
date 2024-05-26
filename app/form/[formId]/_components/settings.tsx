"use client";

import { Button } from "@/components/ui/button";

import { PanelRightClose } from "lucide-react";

import { Hint } from "@/components/hint";

import { QuestionSettings } from "./question-settings";

import { Question, QuestionType } from "@/types/canvas";

interface SettingsProps {
  selectedQuestion: Question | null;
  handleTypeChange: (id: string, newType: QuestionType) => void;
  newType: QuestionType;
}

export const Settings = ({
  selectedQuestion,
  handleTypeChange,
  newType,
}: SettingsProps) => {
  return (
    <div className="flex flex-col h-full w-64 ml-auto bg-secondary">
      <div className="flex items-center justify-between p-2">
        <div className="text-basic font-medium">Settings</div>
        <Hint label="Hide settings menu" side="bottom" sideOffset={10}>
          <Button variant="outline" size="icon">
            <PanelRightClose className="h-4 w-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex-1">
        {selectedQuestion && (
          <QuestionSettings
            question={selectedQuestion}
            newType={newType}
            handleTypeChange={handleTypeChange}
          />
        )}
      </div>
    </div>
  );
};
