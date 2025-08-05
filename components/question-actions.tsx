"use client";

import { toast } from "sonner";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface QuestionActionsProps {
	children: React.ReactNode;
	align?: "start" | "center" | "end";
	side?: DropdownMenuContentProps["side"];
	sideOffset?: DropdownMenuContentProps["sideOffset"];
	id: Id<"questions">;
	title: string;
	formId: Id<"forms">;
}

export const QuestionActions = ({
	children,
	align,
	side,
	sideOffset,
	id,
	formId,
}: QuestionActionsProps) => {
	const removeQuestion = useMutation(
		api.questions.deleteQuestion,
	).withOptimisticUpdate((localStore, args) => {
		const currentQuestions = localStore.getQuery(
			api.questions.getQuestionsByForm,
			{ formId },
		);
		if (currentQuestions !== undefined) {
			const updatedQuestions = currentQuestions.filter(
				(question) => question._id !== args.id,
			);
			localStore.setQuery(
				api.questions.getQuestionsByForm,
				{ formId },
				updatedQuestions,
			);
		}
	});

	const duplicateQuestion = useMutation(
		api.questions.duplicateQuestion,
	).withOptimisticUpdate((localStore, args) => {
		const currentQuestions = localStore.getQuery(
			api.questions.getQuestionsByForm,
			{ formId },
		);
		if (currentQuestions !== undefined) {
			// We can't create the exact duplicate optimistically since we don't have the new ID
			// But we can show that something is happening
			const lastQuestion = currentQuestions[currentQuestions.length - 1];
			if (lastQuestion) {
				const optimisticDuplicate = {
					...lastQuestion,
					_id: `temp-${Date.now()}` as Id<"questions">,
					title: `${lastQuestion.title} (copy)`,
					position: lastQuestion.position + 1,
				};
				localStore.setQuery(api.questions.getQuestionsByForm, { formId }, [
					...currentQuestions,
					optimisticDuplicate,
				]);
			}
		}
	});

	const onDuplicate = () => {
		const promise = duplicateQuestion({ id: id as Id<"questions"> });
		toast.promise(promise, {
			loading: "Duplicating...",
			success: "Question duplicated",
			error: "Failed to duplicate question",
		});
	};

	const onDelete = () => {
		const promise = removeQuestion({ id: id as Id<"questions"> });
		toast.promise(promise, {
			loading: "Deleting...",
			success: "Question deleted",
			error: "Failed to delete question",
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent
				onClick={(event) => event.stopPropagation()}
				align={align}
				side={side}
				sideOffset={sideOffset}
				className="w-[160px]"
			>
				<DropdownMenuItem onClick={onDuplicate}>Duplicate</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
