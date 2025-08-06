"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { ChevronLeft, Eye, Menu } from "lucide-react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { FormActions } from "@/components/forms/form-actions";
import { RenameModal } from "@/components/modals/rename-modal";

import { FormPreview } from "@/components/forms/form-preview";
import { Publish } from "@/components/forms/publish";
import { QuestionDrawer } from "@/components/questions/question-drawer";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface InfoProps {
	formId: Id<"forms">;
}

interface Question {
	_id: Id<"questions">;
}

const TabSeparator = () => {
	return <div className="w-px h-4 bg-border mx-2" />;
};

export const Info = ({ formId }: InfoProps) => {
	const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

	const data = useQuery(api.forms.getFormById, {
		id: formId as Id<"forms">,
	});

	const questions = useQuery(api.questions.getQuestionsByForm, {
		formId,
	}) as Question[];

	if (!data) return;

	const hasQuestions = questions && questions.length > 0;

	return (
		<>
			<div className="flex flex-row items-center justify-between space-x-2 py-2 px-4 h-16">
				<div className="flex items-center space-x-2 flex-shrink-0">
					<TooltipProvider>
						<Tooltip delayDuration={0}>
							<TooltipTrigger asChild>
								<Link href="/forms">
									<Button
										variant="outline"
										size="icon"
										className="cursor-pointer"
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="bottom" sideOffset={10}>
								Back to forms
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TabSeparator />
					<TooltipProvider>
						<Tooltip delayDuration={0}>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									className="text-base font-medium px-1 max-w-[150px] sm:max-w-[300px] cursor-text"
									onClick={() => setIsRenameModalOpen(true)}
								>
									<span className="truncate">{data.title}</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom" sideOffset={10}>
								Rename
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TabSeparator />
					<div className="hidden sm:block">
						<FormActions
							id={data._id}
							title={data.title}
							side="bottom"
							sideOffset={10}
						>
							<div>
								<TooltipProvider>
									<Tooltip delayDuration={0}>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="icon"
												className="cursor-pointer"
											>
												<Menu className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent align="end" side="bottom" sideOffset={10}>
											Main menu
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</FormActions>
					</div>
				</div>
				<div className="flex items-center space-x-2 flex-shrink-0">
					<div className="sm:hidden">
						<QuestionDrawer formId={formId} />
					</div>
					<div className="hidden sm:block">
						{hasQuestions ? (
							<FormPreview formId={formId} />
						) : (
							<TooltipProvider>
								<Tooltip delayDuration={0}>
									<TooltipTrigger asChild>
										<Button variant="outline" size="icon" disabled>
											<Eye className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="bottom" sideOffset={10}>
										Preview
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
					<Publish formId={data._id} />
				</div>
			</div>
			<RenameModal
				isOpen={isRenameModalOpen}
				onClose={() => setIsRenameModalOpen(false)}
				id={data._id}
				title={data.title}
			/>
		</>
	);
};
