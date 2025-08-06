"use client";

import { useState } from "react";

import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

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

	if (questions === undefined) {
		return <Canvas.Skeleton />;
	}

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

Canvas.Skeleton = function CanvasSkeleton() {
	return (
		<main className="h-screen w-full overflow-hidden relative touch-none flex flex-col">
			{/* Info skeleton - top bar */}
			<div className="flex flex-row items-center justify-between space-x-2 py-2 px-4 h-16">
				<div className="flex items-center space-x-2 flex-shrink-0">
					<Skeleton className="h-9 w-9" /> {/* Back button */}
					<div className="w-px h-4 bg-border mx-2" />
					<Skeleton className="h-8 w-32" /> {/* Form title */}
					<div className="w-px h-4 bg-border mx-2" />
					<div className="hidden sm:block">
						<Skeleton className="h-9 w-9" /> {/* Menu button */}
					</div>
				</div>
				<div className="flex items-center space-x-2 flex-shrink-0">
					<div className="sm:hidden">
						<Skeleton className="h-9 w-9" /> {/* Mobile menu */}
					</div>
					<div className="hidden sm:block">
						<Skeleton className="h-9 w-9" /> {/* Preview button */}
					</div>
					<Skeleton className="h-9 w-20" /> {/* Publish button */}
				</div>
			</div>

			<div className="flex flex-1 overflow-hidden">
				{/* Editor sidebar skeleton - left panel */}
				<div className="hidden sm:block">
					<div className="flex flex-col h-full w-64 border rounded-tr-md bg-sidebar">
						<div className="flex items-center justify-between p-2 border-b">
							<Skeleton className="h-5 w-16" /> {/* "Questions" title */}
							<Skeleton className="h-8 w-8 rounded" />{" "}
							{/* Add question button */}
						</div>
						<div className="flex-1 p-2 space-y-2">
							{Array.from({ length: 3 }, (_, i) => i).map((questionIndex) => (
								<div
									key={`skeleton-question-${questionIndex}`}
									className="p-2 rounded border"
								>
									<Skeleton className="h-4 w-24 mb-2" /> {/* Question type */}
									<Skeleton className="h-3 w-full mb-1" />{" "}
									{/* Question title */}
									<Skeleton className="h-3 w-3/4" />{" "}
									{/* Question description */}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Content skeleton - main center area */}
				<div className="flex flex-1 flex-col items-center justify-center h-full p-4">
					<div className="w-full max-w-2xl space-y-6">
						<div className="text-center space-y-4">
							<Skeleton className="h-8 w-64 mx-auto" /> {/* Question title */}
							<Skeleton className="h-4 w-96 mx-auto" />{" "}
							{/* Question description */}
						</div>
						<div className="space-y-3">
							<Skeleton className="h-10 w-full" /> {/* Input field */}
							<div className="flex gap-2">
								<Skeleton className="h-6 w-16" /> {/* Required label */}
								<Skeleton className="h-6 w-6" /> {/* Required toggle */}
							</div>
						</div>
					</div>
				</div>

				{/* Settings sidebar skeleton - right panel */}
				<div className="hidden sm:block">
					<div className="flex flex-col h-full w-64 ml-auto border rounded-tl-md bg-sidebar">
						<div className="flex items-center justify-between p-2 border-b">
							<Skeleton className="h-5 w-16" /> {/* "Settings" title */}
							<Skeleton className="h-8 w-8 rounded" /> {/* Hide button */}
						</div>
						<div className="flex-1 p-4 space-y-4">
							<div>
								<Skeleton className="h-4 w-20 mb-2" /> {/* Type label */}
								<Skeleton className="h-10 w-full" /> {/* Type selector */}
							</div>
							<div>
								<Skeleton className="h-4 w-16 mb-2" /> {/* Required label */}
								<Skeleton className="h-6 w-12" /> {/* Required switch */}
							</div>
							<div>
								<Skeleton className="h-4 w-24 mb-2" /> {/* Options label */}
								<div className="space-y-2">
									<Skeleton className="h-9 w-full" /> {/* Option input */}
									<Skeleton className="h-9 w-full" /> {/* Option input */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};
