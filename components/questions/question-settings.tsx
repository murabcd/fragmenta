"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { TypeSelector } from "@/components/forms/type-selector";

import type { Question, QuestionType } from "@/types/canvas";

interface QuestionSettingsProps {
	question: Question;
	newType: QuestionType;
	handleTypeChange: (id: string, newType: QuestionType) => void;
	handleRequiredChange: (id: string, isRequired: boolean) => void;
}

export const QuestionSettings = ({
	question,
	newType,
	handleTypeChange,
	handleRequiredChange,
}: QuestionSettingsProps) => {
	return (
		<div className="space-y-8 px-3 mt-5">
			<TypeSelector
				question={question}
				type={newType}
				onTypeChange={handleTypeChange}
			/>
			<div className="flex items-center justify-between">
				<Label htmlFor="required-mode">Required</Label>
				<Switch
					id="required-mode"
					aria-label="Required"
					checked={question.isRequired}
					onCheckedChange={(checked) =>
						handleRequiredChange(question._id, checked)
					}
				/>
			</div>
		</div>
	);
};
