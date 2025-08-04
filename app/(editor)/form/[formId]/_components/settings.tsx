"use client";

import { Button } from "@/components/ui/button";

import { PanelRightClose } from "lucide-react";

import { Hint } from "@/components/hint";

import { QuestionSettings } from "@/components/question-settings";

import type { Question, QuestionType } from "@/types/canvas";

interface SettingsProps {
	selectedQuestion: Question | null;
	newType: QuestionType;
	handleTypeChange: (id: string, newType: QuestionType) => void;
	handleRequiredChange: (id: string, isRequired: boolean) => void;
}

export const Settings = ({
	selectedQuestion,
	newType,
	handleTypeChange,
	handleRequiredChange,
}: SettingsProps) => {
	return (
		<div className="flex flex-col h-full w-64 ml-auto border rounded-tl-md bg-sidebar">
			<div className="flex items-center justify-between p-2">
				<div className="font-semibold">Settings</div>
				<Hint label="Hide settings" side="bottom" sideOffset={10}>
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
						handleRequiredChange={handleRequiredChange}
					/>
				)}
			</div>
		</div>
	);
};
