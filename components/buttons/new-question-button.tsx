"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { Plus } from "lucide-react";



import { useQuery, useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";

import type { Id } from "@/convex/_generated/dataModel";
import { useFormEditor } from "@/hooks/use-form-editor";

interface NewQuestionButtonProps {
	formId: Id<"forms">;
}

export const NewQuestionButton = ({ formId }: NewQuestionButtonProps) => {
	const data = useQuery(api.questions.getQuestionCount, { formId });
	const { selectQuestion, questions } = useFormEditor();
	const createQuestion = useMutation(
		api.questions.createQuestion,
	).withOptimisticUpdate((localStore, args) => {
		const currentQuestions = localStore.getQuery(
			api.questions.getQuestionsByForm,
			{ formId },
		);
		if (currentQuestions !== undefined) {
			const optimisticQuestion = {
				_id: `temp-${Date.now()}` as Id<"questions">,
				_creationTime: Date.now(),
				title: args.title,
				description: args.description,
				type: args.type,
				choices: args.choices,
				position: args.position,
				isRequired: args.isRequired,
				formId: args.formId,
			};
			localStore.setQuery(api.questions.getQuestionsByForm, { formId }, [
				...currentQuestions,
				optimisticQuestion,
			]);
		}
	});

	const onClick = () => {
		const position = data ?? 0;

		createQuestion({
			formId,
			title: "Untitled",
			description: "",
			type: "Short text",
			choices: [],
			position,
			isRequired: false,
		})
			.then((result) => {
				if (result && (!questions || questions.length === 0)) {
					// Only select the newly created question if it's the first one
					selectQuestion({
						_id: result,
						_creationTime: Date.now(),
						title: "Untitled",
						description: "",
						type: "Short text",
						choices: [],
						position,
						isRequired: false,
						formId,
					});
				}
				toast.success("Question created");
			})
			.catch(() => toast.error("Failed to create question"));
	};

	return (
		<div>
			<TooltipProvider>
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={onClick}
							className="cursor-pointer"
						>
							<Plus className="w-4 h-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom" sideOffset={10}>
						Add question
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
