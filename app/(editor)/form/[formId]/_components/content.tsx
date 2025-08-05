"use client";

import type { Question } from "@/types/canvas";

import { QuestionContent } from "@/components/question-content";

import { EmptyQuestionState } from "@/components/empty-question-state";

import type { Id } from "@/convex/_generated/dataModel";

interface ContentProps {
	formId: Id<"forms">;
	questions: Question[];
	selectedQuestion: Question | null;
	newTitle: string;
	newDescription: string;
	newResponse: string | string[];
	onTitleChange: (id: string, title: string) => void;
	onDescriptionChange: (id: string, description: string) => void;
	onResponseChange: (id: string, response: string | string[]) => void;
	updateChoices: (choices: {
		id: Id<"questions">;
		choices: string[];
	}) => Promise<void>;
}

export const Content = ({
	formId,
	questions,
	selectedQuestion,
	newTitle,
	newDescription,
	newResponse,
	onTitleChange,
	onDescriptionChange,
	onResponseChange,
	updateChoices,
}: ContentProps) => {
	return (
		<div className="flex flex-1 flex-col items-center justify-center h-full p-4">
			{questions.length === 0 ? (
				<EmptyQuestionState formId={formId} />
			) : selectedQuestion ? (
				<QuestionContent
					question={selectedQuestion}
					newTitle={newTitle}
					newDescription={newDescription}
					newResponse={newResponse}
					onTitleChange={onTitleChange}
					onDescriptionChange={onDescriptionChange}
					onResponseChange={onResponseChange}
					updateChoices={updateChoices}
					isRequired={selectedQuestion.isRequired}
				/>
			) : (
				<p className="text-sm text-muted-foreground">
					Select a question to edit
				</p>
			)}
		</div>
	);
};
