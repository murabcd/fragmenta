"use client";

import { toast } from "sonner";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useFormEditor } from "@/hooks/use-form-editor";

interface QuestionActionsProps {
	children: React.ReactNode;
	align?: "start" | "center" | "end";
	side?: DropdownMenuContentProps["side"];
	sideOffset?: DropdownMenuContentProps["sideOffset"];
	id: Id<"questions">;
	title: string;
}

export const QuestionActions = ({
	children,
	align,
	side,
	sideOffset,
	id,
}: QuestionActionsProps) => {
	const { formId } = useFormEditor();
	const removeQuestion = useMutation(
		api.questions.deleteQuestion,
	).withOptimisticUpdate((localStore, args) => {
		const currentQuestions = formId
			? localStore.getQuery(api.questions.getQuestionsByForm, { formId })
			: undefined;
		if (currentQuestions !== undefined) {
			const updatedQuestions = currentQuestions.filter(
				(question) => question._id !== args.id,
			);
			if (formId) {
				localStore.setQuery(
					api.questions.getQuestionsByForm,
					{ formId },
					updatedQuestions,
				);
			}
		}
	});

	const duplicateQuestion = useMutation(
		api.questions.duplicateQuestion,
	).withOptimisticUpdate((localStore, _args) => {
		const currentQuestions = formId
			? localStore.getQuery(api.questions.getQuestionsByForm, { formId })
			: undefined;
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
				if (formId) {
					localStore.setQuery(api.questions.getQuestionsByForm, { formId }, [
						...currentQuestions,
						optimisticDuplicate,
					]);
				}
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
				className="w-[160px] bg-background border-border"
			>
				<DropdownMenuItem onClick={onDuplicate} className="hover:bg-accent/50">
					Duplicate
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive" onClick={onDelete}>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
