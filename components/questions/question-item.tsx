"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";

import {
	ListStart,
	ListEnd,
	Text,
	ListMinus,
	CheckCheck,
	ListTodo,
	ListChecks,
	BarChart,
	MoreHorizontal,
	GripVertical,
} from "lucide-react";

import { QuestionActions } from "./question-actions";

import { type Question, QuestionType } from "@/types/canvas";
import type { Id } from "@/convex/_generated/dataModel";

interface QuestionItemProps {
	question: Question;
	formId: Id<"forms">;
	className?: string;
	onClick: () => void;
}

const questionTypelcons = {
	[QuestionType.Start]: ListStart,
	[QuestionType.End]: ListEnd,
	[QuestionType.Short]: Text,
	[QuestionType.Long]: ListMinus,
	[QuestionType.YesNo]: CheckCheck,
	[QuestionType.Single]: ListTodo,
	[QuestionType.Multiple]: ListChecks,
	[QuestionType.Rating]: BarChart,
};

export const QuestionItem = ({
	question,
	formId,
	className,
	onClick,
}: QuestionItemProps) => {
	const Icon = questionTypelcons[question.type];

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: question._id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} className="flex flex-col">
			<div
				className={`group flex items-center justify-between m-2 p-3 hover:text-foreground rounded-lg transition ${className}`}
			>
				<div className="flex items-center truncate max-w-[80%] flex-1">
					<div
						{...attributes}
						{...listeners}
						className="flex items-center justify-center w-6 h-6 mr-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
					>
						<GripVertical className="h-4 w-4" />
					</div>
					<button
						type="button"
						onClick={onClick}
						className="flex items-center truncate cursor-pointer text-left bg-transparent border-none p-0 hover:text-foreground focus:outline-none"
					>
						{Icon && <Icon className="h-4 w-4 mr-2 flex-shrink-0" />}
						<span className="truncate">{question.title}</span>
					</button>
				</div>
				<QuestionActions
					id={question._id}
					title={question.title}
					formId={formId}
					align="end"
					side="right"
				>
					<Button
						variant="ghost"
						size="icon"
						className="opacity-0 group-hover:opacity-100 transition-opacity"
						onClick={(e) => e.stopPropagation()}
					>
						<MoreHorizontal className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</QuestionActions>
			</div>
		</div>
	);
};
