"use client";

import { useEffect, useRef } from "react";

import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

import { Info } from "./info";
import { Editor } from "./editor";
import { QuestionContent } from "@/components/questions/question-content";
import { EmptyQuestionState } from "@/components/questions/empty-question-state";
import { QuestionSettings } from "@/components/questions/question-settings";
import { Button } from "@/components/ui/button";

import type { Doc } from "@/convex/_generated/dataModel";
import { useFormEditor } from "@/hooks/use-form-editor";

import { useQuery, useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface CanvasProps {
	formId: Id<"forms">;
}

export const Canvas = ({ formId }: CanvasProps) => {
	const questions = useQuery(api.questions.getQuestionsByForm, {
		formId,
	}) as Doc<"questions">[];

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

	const updateImage = useMutation(
		api.questions.updateQuestionImage,
	).withOptimisticUpdate((localStore, args) => {
		const currentQuestions = localStore.getQuery(
			api.questions.getQuestionsByForm,
			{ formId },
		);
		if (currentQuestions !== undefined) {
			const updatedQuestions = currentQuestions.map((question) =>
				question._id === args.id
					? { ...question, image: args.image }
					: question,
			);
			localStore.setQuery(
				api.questions.getQuestionsByForm,
				{ formId },
				updatedQuestions,
			);
		}
	});

	const updateImageLayout = useMutation(
		api.questions.updateQuestionImageLayout,
	).withOptimisticUpdate((localStore, args) => {
		const currentQuestions = localStore.getQuery(
			api.questions.getQuestionsByForm,
			{ formId },
		);
		if (currentQuestions !== undefined) {
			const updatedQuestions = currentQuestions.map((question) =>
				question._id === args.id
					? { ...question, imageLayout: args.imageLayout }
					: question,
			);
			localStore.setQuery(
				api.questions.getQuestionsByForm,
				{ formId },
				updatedQuestions,
			);
		}
	});

	const updateImageFocalPoint = useMutation(
		api.questions.updateQuestionImageFocalPoint,
	).withOptimisticUpdate((localStore, args) => {
		const currentQuestions = localStore.getQuery(
			api.questions.getQuestionsByForm,
			{ formId },
		);
		if (currentQuestions !== undefined) {
			const updatedQuestions = currentQuestions.map((question) =>
				question._id === args.id
					? { ...question, imageFocalPoint: args.focalPoint }
					: question,
			);
			localStore.setQuery(
				api.questions.getQuestionsByForm,
				{ formId },
				updatedQuestions,
			);
		}
	});

	// Use Zustand store
	const {
		selectedQuestion,
		questions: storeQuestions,
		setFormId,
		setQuestions,
		setMutations,
		selectQuestion,
		handleTypeChange: storeHandleTypeChange,
		handleRequiredChange: storeHandleRequiredChange,
		handleImageChange: storeHandleImageChange,
		handleLayoutChange: storeHandleLayoutChange,
	} = useFormEditor();

	// Use refs to track if we've already initialized to prevent infinite loops
	const initializedFormId = useRef<string | null>(null);
	const initializedQuestions = useRef<boolean>(false);

	// Initialize store when formId changes
	useEffect(() => {
		if (initializedFormId.current !== formId) {
			setFormId(formId);
			initializedFormId.current = formId;
			initializedQuestions.current = false; // Reset questions flag when form changes
		}
	}, [formId, setFormId]);

	// Initialize questions when they load and keep them synced
	useEffect(() => {
		if (questions) {
			setQuestions(questions);
			if (!initializedQuestions.current) {
				initializedQuestions.current = true;
			}
		}
	}, [questions, setQuestions]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Convex mutations change reference on every render, causing infinite loops
	useEffect(() => {
		setMutations({
			updateTitle,
			updateDescription,
			updateChoices,
			updateType,
			updateRequired,
			updateImage,
			updateImageLayout,
			updateImageFocalPoint,
		});
	}, [setMutations]);

	// Wrapper handlers that add toast notifications
	const handleQuestionSelect = (question: Doc<"questions">) => {
		selectQuestion(question);
	};

	const handleTypeChangeWithToast = async (
		id: string,
		newTypeValue: string,
	) => {
		try {
			const promise = storeHandleTypeChange(id, newTypeValue);
			toast.promise(promise, {
				loading: "Updating...",
				success: "Question type updated",
				error: "Failed to update question type",
			});
			await promise;
		} catch (_error) {
			// Error already handled by store
		}
	};

	const handleRequiredChangeWithToast = async (
		id: string,
		isRequired: boolean,
	) => {
		try {
			const promise = storeHandleRequiredChange(id, isRequired);
			toast.promise(promise, {
				loading: "Updating...",
				success: isRequired ? "Question required" : "Question optional",
				error: "Failed to update question requirement",
			});
			await promise;
		} catch (_error) {
			// Error already handled by store
		}
	};

	const handleImageChangeWithToast = async (id: string, imageUrl: string) => {
		try {
			const promise = storeHandleImageChange(id, imageUrl);
			toast.promise(promise, {
				loading: "Updating image...",
				success: "Image updated successfully",
				error: "Failed to update image",
			});
			await promise;
		} catch (_error) {
			// Error already handled by store
		}
	};

	const handleLayoutChangeWithToast = async (
		id: string,
		layout: { mobile: string; desktop: string },
	) => {
		try {
			const promise = storeHandleLayoutChange(id, layout);
			toast.promise(promise, {
				loading: "Updating layout...",
				success: "Layout updated",
				error: "Failed to update layout",
			});
			await promise;
		} catch (_error) {
			// Error already handled by store
		}
	};

	if (questions === undefined) {
		return <Canvas.Skeleton />;
	}

	return (
		<main className="h-screen w-full overflow-hidden relative touch-none flex flex-col">
			<Info formId={formId} />
			<div className="flex flex-1 overflow-hidden">
				<div className="hidden sm:block pl-2 pb-2">
					<Editor formId={formId} onQuestionSelect={handleQuestionSelect} />
				</div>
				{/* Content area - no more wrapper component */}
				<div className="flex flex-1 flex-col items-center justify-center h-full p-4">
					{!storeQuestions || storeQuestions.length === 0 ? (
						<EmptyQuestionState formId={formId} />
					) : selectedQuestion ? (
						<QuestionContent
							key={`${selectedQuestion._id}-${selectedQuestion.image || "no-image"}`}
							question={selectedQuestion}
						/>
					) : (
						<p className="text-sm text-muted-foreground">
							Select a question to edit
						</p>
					)}
				</div>

				<div className="hidden sm:block pr-2 pb-2">
					<div className="flex flex-col h-full w-64 ml-auto border rounded-xl bg-sidebar">
						<div className="flex items-center justify-between p-2 py-4">
							<div className="font-semibold">Settings</div>
						</div>
						<div className="flex-1">
							{selectedQuestion && (
								<QuestionSettings
									question={selectedQuestion}
									handleTypeChange={handleTypeChangeWithToast}
									handleRequiredChange={handleRequiredChangeWithToast}
									onImageChange={handleImageChangeWithToast}
									onLayoutChange={handleLayoutChangeWithToast}
								/>
							)}
						</div>
					</div>
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
						<div className="flex items-center justify-between p-2">
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
								<Skeleton className="h-6 w-16" />
								<Skeleton className="h-6 w-6" />
							</div>
						</div>
					</div>
				</div>

				{/* Settings sidebar skeleton - right panel */}
				<div className="hidden sm:block">
					<div className="flex flex-col h-full w-64 ml-auto border rounded-tl-md bg-sidebar">
						<div className="flex items-center justify-between p-2">
							<Skeleton className="h-5 w-16" /> {/* "Settings" title */}
							<Skeleton className="h-8 w-8 rounded" /> {/* Hide button */}
						</div>
						<div className="flex-1 p-4 space-y-4">
							<div>
								<Skeleton className="h-4 w-20 mb-2" /> {/* Type label */}
								<Skeleton className="h-10 w-full" /> {/* Type selector */}
							</div>
							<div>
								<Skeleton className="h-4 w-16 mb-2" />
								<Skeleton className="h-6 w-12" />
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
