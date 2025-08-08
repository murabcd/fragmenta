"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { QuestionContent } from "@/components/questions/question-content";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useFormEditor } from "@/hooks/use-form-editor";
import type { Id, Doc } from "@/convex/_generated/dataModel";

interface FormPreviewProps {
	formId: Id<"forms">;
}

export const FormPreview = ({ formId }: FormPreviewProps) => {
	const questionsFromDb = useQuery(api.questions.getQuestionsByForm, {
		formId,
	}) as Doc<"questions">[];
	const { selectedQuestion } = useFormEditor();

	// Use store's selectedQuestion if available, otherwise use database questions
	const questions =
		questionsFromDb?.map((q) =>
			selectedQuestion?._id === q._id ? selectedQuestion : q,
		) || [];

	const [previewSize, setPreviewSize] = useState("max-w-[720px]");

	return (
		<TooltipProvider>
			<Dialog>
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<DialogTrigger asChild>
							<Button variant="outline" size="icon" className="cursor-pointer">
								<Eye className="h-4 w-4" />
							</Button>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom" sideOffset={10}>
						Preview
					</TooltipContent>
				</Tooltip>
				<DialogContent className="sm:max-w-[1024px] max-h-[768px] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Preview</DialogTitle>
						<DialogDescription>
							View your form as respondents will see it.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-center">
						<ToggleGroup
							variant="outline"
							size="sm"
							type="single"
							value={previewSize}
							onValueChange={setPreviewSize}
						>
							<ToggleGroupItem value="max-w-[720px]" aria-label="Desktop view">
								<span>Desktop</span>
							</ToggleGroupItem>
							<ToggleGroupItem value="w-2/5" aria-label="Mobile view">
								<span>Mobile</span>
							</ToggleGroupItem>
						</ToggleGroup>
					</div>
					<div className="flex flex-col items-center w-full space-y-4">
						{questions.map((question) => (
							<QuestionContent
								key={question._id}
								question={question}
								newTitle={question.title}
								newDescription={question.description || ""}
								newResponse={""}
								onTitleChange={() => {}}
								onDescriptionChange={() => {}}
								onResponseChange={() => {}}
								updateChoices={() => Promise.resolve()}
								isPreview={true}
								isPublished={false}
								previewSize={previewSize}
							/>
						))}
					</div>
				</DialogContent>
			</Dialog>
		</TooltipProvider>
	);
};
