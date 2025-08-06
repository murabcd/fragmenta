"use client";

import { Button } from "@/components/ui/button";

import { PanelRightClose } from "lucide-react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { QuestionSettings } from "@/components/questions/question-settings";

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
				<TooltipProvider>
					<Tooltip delayDuration={0}>
						<TooltipTrigger asChild>
							<Button variant="outline" size="icon" className="cursor-pointer">
								<PanelRightClose className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom" sideOffset={10}>
							Hide settings
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
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
