"use client";

import { useEffect } from "react";

import {
	DndContext,
	type DragEndEvent,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { NewQuestionButton } from "@/components/buttons/new-question-button";

import { QuestionItem } from "@/components/questions/question-item";

import type { Question } from "@/types/canvas";

import { cn } from "@/lib/utils";

import { toast } from "sonner";

import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface EditorProps {
	formId: Id<"forms">;
	questions: Question[];
	onQuestionSelect: (question: Question) => void;
	selectedQuestion: Question | null;
}

export const Editor = ({
	formId,
	questions,
	onQuestionSelect,
	selectedQuestion,
}: EditorProps) => {
	const reorderQuestion = useMutation(
		api.questions.updateQuestionPosition,
	).withOptimisticUpdate((localStore, { id, formId, position }) => {
		const currentQuestions = localStore.getQuery(
			api.questions.getQuestionsByForm,
			{ formId },
		);

		if (currentQuestions) {
			const reorderedQuestions = arrayMove(
				currentQuestions,
				currentQuestions.findIndex((question) => question._id === id),
				position,
			);

			localStore.setQuery(
				api.questions.getQuestionsByForm,
				{ formId },
				reorderedQuestions,
			);
		}
	});

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = questions.findIndex((q) => q._id === active.id);
		const newIndex = questions.findIndex((q) => q._id === over.id);

		if (oldIndex === -1 || newIndex === -1) {
			return;
		}

		const reorderPromise = Promise.all(
			arrayMove(questions, oldIndex, newIndex).map((question, index) =>
				reorderQuestion({
					id: question._id as Id<"questions">,
					formId: formId,
					position: index,
				}),
			),
		);

		toast.promise(reorderPromise, {
			loading: "Reordering...",
			success: "Questions reordered",
			error: "Failed to reorder questions",
		});
	};

	useEffect(() => {
		if (questions.length > 0 && !selectedQuestion) {
			onQuestionSelect(questions[0]);
		}
	}, [questions, selectedQuestion, onQuestionSelect]);

	return (
		<div className="flex flex-col h-full w-64 border rounded-tr-md bg-sidebar">
			<div className="flex items-center justify-between p-2">
				<div className="font-semibold">Questions</div>
				<NewQuestionButton formId={formId} />
			</div>
			<div className="flex-1 text-sm text-muted-foreground overflow-y-auto">
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={questions.map((q) => q._id)}
						strategy={verticalListSortingStrategy}
					>
						<ol>
							{questions.map((question) => (
								<QuestionItem
									key={question._id}
									question={question}
									formId={formId}
									onClick={() => onQuestionSelect(question)}
									className={cn({
										"text-foreground bg-primary/10":
											selectedQuestion && question._id === selectedQuestion._id,
									})}
								/>
							))}
						</ol>
					</SortableContext>
				</DndContext>
			</div>
		</div>
	);
};
