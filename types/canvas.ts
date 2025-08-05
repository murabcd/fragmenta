import type { Id } from "@/convex/_generated/dataModel";

export interface Question {
	_id: Id<"questions">;
	title: string;
	description?: string;
	type: QuestionType;
	choices: string[];
	position: number;
	response?: string | string[];
	formId: Id<"forms">;
	isRequired: boolean;
}

export enum QuestionType {
	Start = "Start screen",
	End = "End screen",
	Short = "Short text",
	Long = "Long text",
	YesNo = "Yes/no choice",
	Single = "Single choice",
	Multiple = "Multiple choice",
	Rating = "Rating",
}
