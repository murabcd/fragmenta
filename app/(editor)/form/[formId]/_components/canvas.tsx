"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Info } from "./info";
import { Editor } from "./editor";
import { Content } from "./content";
import { Settings } from "./settings";

import { type Question, QuestionType } from "@/types/canvas";

import { useQuery, useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface CanvasProps {
	formId: Id<"forms">;
}

export const Canvas = ({ formId }: CanvasProps) => {
	const questions = useQuery(api.questions.getQuestionsByForm, {
		formId,
	}) as Question[];

	const updateType = useMutation(
		api.questions.updateQuestionType,
	).withOptimisticUpdate((localStore, args) => {
		const currentQuestions = localStore.getQuery(
			api.questions.getQuestionsByForm,
			{ formId },
		);
		if (currentQuestions !== undefined) {
			const updatedQuestions = currentQuestions.map((question) =>
				question._id === args.id
					? { ...question, type: args.type, choices: [] }
					: question,
			);
			localStore.setQuery(
				api.questions.getQuestionsByForm,
				{ formId },
				updatedQuestions,
			);
		}
	});

	const updateTitle = useMutation(
		api.questions.updateQuestionTitle,
	).withOptimisticUpdate((localStore, args) => {
		const currentQuestions = localStore.getQuery(
			api.questions.getQuestionsByForm,
			{ formId },
		);
		if (currentQuestions !== undefined) {
			const updatedQuestions = currentQuestions.map((question) =>
				question._id === args.id
					? { ...question, title: args.title }
					: question,
			);
			localStore.setQuery(
				api.questions.getQuestionsByForm,
				{ formId },
				updatedQuestions,
			);
		}
	});

	const updateDescription = useMutation(
		api.questions.updateQuestionDescription,
	).withOptimisticUpdate((localStore, args) => {
		const currentQuestions = localStore.getQuery(
			api.questions.getQuestionsByForm,
			{ formId },
		);
		if (currentQuestions !== undefined) {
			const updatedQuestions = currentQuestions.map((question) =>
				question._id === args.id
					? { ...question, description: args.description }
					: question,
			);
			localStore.setQuery(
				api.questions.getQuestionsByForm,
				{ formId },
				updatedQuestions,
			);
		}
	});

	const updateChoices = useMutation(
		api.questions.updateQuestionChoices,
	).withOptimisticUpdate((localStore, args) => {
		const currentQuestions = localStore.getQuery(
			api.questions.getQuestionsByForm,
			{ formId },
		);
		if (currentQuestions !== undefined) {
			const updatedQuestions = currentQuestions.map((question) =>
				question._id === args.id
					? { ...question, choices: args.choices }
					: question,
			);
			localStore.setQuery(
				api.questions.getQuestionsByForm,
				{ formId },
				updatedQuestions,
			);
		}
	});

	const updateRequired = useMutation(
		api.questions.updateQuestionRequired,
	).withOptimisticUpdate((localStore, args) => {
		const currentQuestions = localStore.getQuery(
			api.questions.getQuestionsByForm,
			{ formId },
		);
		if (currentQuestions !== undefined) {
			const updatedQuestions = currentQuestions.map((question) =>
				question._id === args.id
					? { ...question, isRequired: args.isRequired }
					: question,
			);
			localStore.setQuery(
				api.questions.getQuestionsByForm,
				{ formId },
				updatedQuestions,
			);
		}
	});

	const handleUpdateChoices = async (choices: {
		id: Id<"questions">;
		choices: string[];
	}) => {
		await updateChoices({
			id: choices.id as Id<"questions">,
			choices: choices.choices,
		});
	};

	const [newTitle, setNewTitle] = useState<string>("");
	const [newDescription, setNewDescription] = useState<string>("");
	const [newResponse, setNewResponse] = useState<string | string[]>("");
	const [newType, setNewType] = useState<QuestionType>(QuestionType.Short);

	const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
		null,
	);

	const handleTitleChange = (id: string, title: string) => {
		setNewTitle(title);
		updateTitle({ id: id as Id<"questions">, title });
	};

	const handleDescriptionChange = (id: string, description: string) => {
		setNewDescription(description);
		updateDescription({ id: id as Id<"questions">, description });
	};

	const handleResponseChange = (_id: string, response: string | string[]) => {
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
				updateType({ id: id as Id<"questions">, type: newType }),
				updateChoices({ id: id as Id<"questions">, choices: [] }),
			]);

			toast.promise(promise, {
				loading: "Updating...",
				success: "Question type updated",
				error: "Failed to update question type",
			});

			try {
				await promise;
			} catch (_error) {
				setSelectedQuestion(previousQuestion);
			}
		}
	};

	if (!questions) return null;

	const handleRequiredChange = (id: string, isRequired: boolean) => {
		if (selectedQuestion) {
			const previousQuestion = { ...selectedQuestion };
			setSelectedQuestion({ ...selectedQuestion, isRequired });

			const promise = updateRequired({ id: id as Id<"questions">, isRequired });

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
					updateChoices={handleUpdateChoices}
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
