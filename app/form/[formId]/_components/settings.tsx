"use client";

import { Button } from "@/components/ui/button";

import { PanelRightClose } from "lucide-react";

import { Hint } from "@/components/hint";

import { TypeSelector } from "./type-selector";

import { QuestionType } from "@/types/canvas";

interface SettingsProps {
  type: QuestionType;
  onTypeChange: (newType: QuestionType) => void;
}

export const Settings = ({ type, onTypeChange }: SettingsProps) => {
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
        <TypeSelector type={type} onTypeChange={onTypeChange} />
      </div>
    </div>
  );
};
