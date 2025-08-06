"use client";

import { StartScreen } from "@/components/forms/form-elements/start-screen";
import { EndScreen } from "@/components/forms/form-elements/end-screen";

import { ShortText } from "@/components/forms/form-elements/short-text";
import { LongText } from "@/components/forms/form-elements/long-text";
import { YesNoChoice } from "@/components/forms/form-elements/yes-no-choice";
import { SingleChoice } from "@/components/forms/form-elements/single-choice";
import { MultipleChoice } from "@/components/forms/form-elements/multiple-choice";
import { RatingScore } from "@/components/forms/form-elements/rating-score";

import { StartButton } from "@/components/buttons/start-button";
import { CompleteButton } from "@/components/buttons/complete-button";
import { NavigationButtons } from "@/components/navigation/nav-buttons";

import { usePreviewSize } from "@/hooks/use-preview";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize";

import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";

import { type Question, QuestionType } from "@/types/canvas";
import { Card } from "@/components/ui/card";

interface QuestionContentProps {
	question: Question;
	newTitle: string;
	newDescription: string;
	newResponse: string | string[];
	onTitleChange: (id: string, title: string) => void;
	onDescriptionChange: (id: string, description: string) => void;
	onResponseChange: (id: string, response: string | string[]) => void;
	updateChoices: (choices: {
		id: Id<"questions">;
		choices: string[];
	}) => Promise<void>;
	onStart?: () => void;
	onComplete?: () => void;
	onBack?: () => void;
	onForward?: () => void;
	isBackDisabled?: boolean;
	isForwardDisabled?: boolean;
	isPreview?: boolean;
	isPublished?: boolean;
	isRequired?: boolean;
	error?: string | null;
}

export const QuestionContent = ({
	question,
	newTitle,
	newDescription,
	newResponse,
	onTitleChange,
	onDescriptionChange,
	onResponseChange,
	updateChoices,
	onStart,
	onComplete,
	onBack,
	onForward,
	isBackDisabled,
	isForwardDisabled,
	isPreview = false,
	isPublished,
	isRequired,
	error,
}: QuestionContentProps) => {
	const { previewSize } = usePreviewSize();

	const titleRef = useAutoResizeTextarea(newTitle, "32px", previewSize);
	const descriptionRef = useAutoResizeTextarea(
		newDescription,
		"32px",
		previewSize,
	);

	const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		onTitleChange(question._id, event.target.value);
	};

	const handleDescriptionChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		onDescriptionChange(question._id, event.target.value);
	};

	const handleResponseChange = (value: string | string[]) => {
		onResponseChange(question._id, value);
	};

	const renderQuestionContent = () => {
		switch (question.type) {
			case QuestionType.Start:
				return <StartScreen />;
			case QuestionType.End:
				return <EndScreen />;
			case QuestionType.Short:
				return (
					<ShortText
						value={newResponse as string}
						onChange={handleResponseChange}
						resizeTrigger={previewSize}
						isPublished={isPublished || false}
					/>
				);
			case QuestionType.Long:
				return (
					<LongText
						value={newResponse as string}
						onChange={handleResponseChange}
						resizeTrigger={previewSize}
						isPublished={isPublished || false}
					/>
				);
			case QuestionType.YesNo:
				return (
					<YesNoChoice
						id={question._id}
						key={question._id}
						value={newResponse as string}
						onChange={handleResponseChange}
						options={question.choices.map((choice) => ({
							label: choice,
							value: choice,
						}))}
						updateChoices={updateChoices}
						isPublished={isPublished || false}
					/>
				);
			case QuestionType.Single:
				return (
					<SingleChoice
						id={question._id}
						key={question._id}
						value={newResponse as string}
						onChange={handleResponseChange}
						options={question.choices.map((choice) => ({
							label: choice,
							value: choice,
						}))}
						updateChoices={updateChoices}
						isPublished={isPublished || false}
					/>
				);
			case QuestionType.Multiple:
				return (
					<MultipleChoice
						id={question._id}
						key={question._id}
						values={newResponse as string[]}
						onChange={handleResponseChange}
						options={question.choices.map((choice) => ({
							label: choice,
							value: choice,
						}))}
						updateChoices={updateChoices}
						isPublished={isPublished || false}
					/>
				);
			case QuestionType.Rating:
				return (
					<RatingScore
						value={newResponse as string}
						onChange={handleResponseChange}
						isPublished={isPublished || false}
					/>
				);
			default:
				return null;
		}
	};

	const renderButtons = () => {
		if (question.type === QuestionType.Start && onStart) {
			return <StartButton onClick={onStart} />;
		} else if (question.type === QuestionType.End && onComplete) {
			return <CompleteButton onClick={onComplete} />;
		} else if (onBack && onForward) {
			return (
				<NavigationButtons
					onBack={onBack}
					onForward={onForward}
					isBackDisabled={isBackDisabled || false}
					isForwardDisabled={isForwardDisabled || false}
				/>
			);
		}
		return null;
	};

	const isScreen =
		question.type === QuestionType.Start || question.type === QuestionType.End;

	return (
		<Card
			className={cn(
				"flex flex-col items-center justify-center w-full min-h-[calc(100vh-120px)] space-y-4",
				isPreview ? previewSize : "",
				isPublished
					? "border-none shadow-none bg-transparent rounded-none px-0 py-0 w-full max-w-2xl"
					: "border shadow-sm bg-muted/40 px-4",
			)}
		>
			<div className={cn("w-full", isScreen && "flex flex-col items-center")}>
				<div className="flex items-center">
					<textarea
						id="question-title"
						name="question-title"
						ref={titleRef}
						className={cn(
							"bg-transparent w-full focus-visible:outline-none resize-none",
							isScreen
								? "text-center text-4xl font-bold"
								: "text-3xl font-semibold",
							isPublished ? "text-4xl font-bold" : "text-2xl",
						)}
						value={newTitle}
						placeholder="Title"
						onChange={handleTitleChange}
						readOnly={isPublished}
					/>
					{isRequired && <span className="text-red-500 ml-1">*</span>}
				</div>
				{(!isPublished || newDescription) && (
					<textarea
						id="question-description"
						name="question-description"
						ref={descriptionRef}
						className={cn(
							"bg-transparent w-full text-sm text-muted-foreground focus-visible:outline-none resize-none",
							isScreen ? "text-center max-w-md" : "",
						)}
						value={newDescription}
						placeholder="Description (optional)"
						onChange={handleDescriptionChange}
						readOnly={isPublished}
					/>
				)}
			</div>
			{renderQuestionContent()}
			{error && (
				<div className="text-red-500 text-xs mt-2 w-full text-left">
					{error}
				</div>
			)}
			{renderButtons()}
		</Card>
	);
};
