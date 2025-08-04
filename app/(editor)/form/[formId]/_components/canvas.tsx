"use client";

import { useState } from "react";

import { useDebouncedCallback } from "use-debounce";

import { toast } from "sonner";

import { Info } from "./info";
import { Editor } from "./editor";
import { Content } from "./content";
import { Settings } from "./settings";

import { type Question, QuestionType } from "@/types/canvas";

import { useQuery } from "convex/react";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";

interface CanvasProps {
	formId: string;
}

export const Canvas = ({ formId }: CanvasProps) => {
	const questions = useQuery(api.questions.get, { formId }) as Question[];

	const { mutate: updateType } = useApiMutation(api.questions.type);
	const { mutate: updateTitle } = useApiMutation(api.questions.title);
	const { mutate: updateDescription } = useApiMutation(
		api.questions.description,
	);
	const { mutate: updateChoices } = useApiMutation(api.questions.choices);
	const { mutate: updateRequired } = useApiMutation(api.questions.required);

	const [newTitle, setNewTitle] = useState<string>("");
	const [newDescription, setNewDescription] = useState<string>("");
	const [newResponse, setNewResponse] = useState<string | string[]>("");
	const [newType, setNewType] = useState<QuestionType>(QuestionType.Short);

	const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
		null,
	);

	const debouncedSaveTitle = useDebouncedCallback((id, newTitle) => {
		updateTitle({ id, title: newTitle });
	}, 500);

	const debouncedSaveDescription = useDebouncedCallback(
		(id, newDescription) => {
			updateDescription({ id, description: newDescription });
		},
		500,
	);

	const handleTitleChange = (id: string, title: string) => {
		setNewTitle(title);
		debouncedSaveTitle(id, title);
	};

	const handleDescriptionChange = (id: string, description: string) => {
		setNewDescription(description);
		debouncedSaveDescription(id, description);
	};

	const handleResponseChange = (id: string, response: string | string[]) => {
		setNewResponse(response);
	};

	const handleQuestionSelect = (question: Question) => {
		setSelectedQuestion(question);
		setNewTitle(question.title);
		setNewDescription(question.description || "");
		setNewType(question.type);
	};

	const handleTypeChange = async (id: string, newType: QuestionType) => {
		if (selectedQuestion) {
			const previousQuestion = { ...selectedQuestion };
			setSelectedQuestion({ ...selectedQuestion, type: newType, choices: [] });
			setNewType(newType);

			const promise = Promise.all([
				updateType({ id, type: newType }),
				updateChoices({ id, choices: [] }),
			]);

			toast.promise(promise, {
				loading: "Updating...",
				success: "Question type updated",
				error: "Failed to update question type",
			});

			try {
				await promise;
			} catch (error) {
				setSelectedQuestion(previousQuestion);
			}
		}
	};

	if (!questions) return null;

	const handleRequiredChange = (id: string, isRequired: boolean) => {
		if (selectedQuestion) {
			const previousQuestion = { ...selectedQuestion };
			setSelectedQuestion({ ...selectedQuestion, isRequired });

			const promise = updateRequired({ id, isRequired });

			toast.promise(promise, {
				loading: "Updating...",
				success: isRequired ? "Question required" : "Question optional",
				error: "Failed to update question requirement",
			});

			promise.catch(() => {
				setSelectedQuestion(previousQuestion);
			});
		}
	};

	return (
		<main className="h-screen w-full overflow-hidden relative touch-none flex flex-col">
			<Info formId={formId} />
			<div className="flex flex-1 overflow-hidden">
				<div className="hidden sm:block">
					<Editor
						formId={formId}
						questions={questions}
						onQuestionSelect={handleQuestionSelect}
						selectedQuestion={selectedQuestion}
					/>
				</div>
				<Content
					formId={formId}
					questions={questions}
					selectedQuestion={selectedQuestion}
					newTitle={newTitle}
					newDescription={newDescription}
					newResponse={newResponse}
					onTitleChange={handleTitleChange}
					onDescriptionChange={handleDescriptionChange}
					onResponseChange={handleResponseChange}
					updateChoices={updateChoices}
				/>
				<div className="hidden sm:block">
					<Settings
						selectedQuestion={selectedQuestion}
						newType={newType}
						handleTypeChange={handleTypeChange}
						handleRequiredChange={handleRequiredChange}
					/>
				</div>
			</div>
		</main>
	);
};
