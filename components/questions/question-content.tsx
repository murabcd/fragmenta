"use client";

import { StartScreen } from "@/components/forms/form-elements/start-screen";
import { EndScreen } from "@/components/forms/form-elements/end-screen";
import { ShortText } from "@/components/forms/form-elements/short-text";
import { LongText } from "@/components/forms/form-elements/long-text";
import { YesNoChoice } from "@/components/forms/form-elements/yes-no-choice";
import { SingleChoice } from "@/components/forms/form-elements/single-choice";
import { MultipleChoice } from "@/components/forms/form-elements/multiple-choice";
import { RatingScore } from "@/components/forms/form-elements/rating-score";

import { Button } from "@/components/ui/button";
import { NavigationButtons } from "@/components/navigation/nav-buttons";
import { QuestionLayout } from "./question-layout";
import { QuestionMedia } from "./question-media";
import { useImageLayout } from "@/hooks/use-image-layout";

import { useAutoResizeTextarea } from "@/hooks/use-auto-resize";
import { useFormEditor } from "@/hooks/use-form-editor";

import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";
import type { Doc } from "@/convex/_generated/dataModel";

interface QuestionContentProps {
	question: Doc<"questions">;
	// For published/preview contexts - override form editor state
	newTitle?: string;
	newDescription?: string;
	newResponse?: string | string[];
	onTitleChange?: (id: string, title: string) => void;
	onDescriptionChange?: (id: string, description: string) => void;
	onResponseChange?: (id: string, response: string | string[]) => void;
	updateChoices?: (choices: {
		id: Id<"questions">;
		choices: string[];
	}) => Promise<void>;
	// Navigation and state
	onStart?: () => void;
	onComplete?: () => void;
	onBack?: () => void;
	onForward?: () => void;
	isBackDisabled?: boolean;
	isForwardDisabled?: boolean;
	isPreview?: boolean;
	isPublished?: boolean;
	error?: string | null;
	previewSize?: string;
}

export const QuestionContent = ({
	question,
	newTitle: propsNewTitle,
	newDescription: propsNewDescription,
	newResponse: propsNewResponse,
	onTitleChange: propsOnTitleChange,
	onDescriptionChange: propsOnDescriptionChange,
	onResponseChange: propsOnResponseChange,
	updateChoices: propsUpdateChoices,
	onStart,
	onComplete,
	onBack,
	onForward,
	isBackDisabled,
	isForwardDisabled,
	isPreview = false,
	isPublished,
	error,
	previewSize = "max-w-[720px]",
}: QuestionContentProps) => {
	const {
		newTitle: storeNewTitle,
		newDescription: storeNewDescription,
		newResponse: storeNewResponse,
		handleTitleChange: storeHandleTitleChange,
		handleDescriptionChange: storeHandleDescriptionChange,
		handleResponseChange: storeHandleResponseChange,
		handleUpdateChoices: storeHandleUpdateChoices,
	} = useFormEditor();

	// Decide where to place the image for mobile/desktop
	const { effectiveMobileLayout, shouldShowMobileImage } = useImageLayout({
		imageLayout: question.imageLayout,
		previewSize,
		isPreview: !!isPreview,
	});

	// Use props if provided (published context), otherwise use store (editor context)
	const newTitle = propsNewTitle !== undefined ? propsNewTitle : storeNewTitle;
	const newDescription =
		propsNewDescription !== undefined
			? propsNewDescription
			: storeNewDescription;
	const newResponse =
		propsNewResponse !== undefined ? propsNewResponse : storeNewResponse;
	const onTitleChange = propsOnTitleChange || storeHandleTitleChange;
	const onDescriptionChange =
		propsOnDescriptionChange || storeHandleDescriptionChange;
	const onResponseChange = propsOnResponseChange || storeHandleResponseChange;
	const updateChoices = propsUpdateChoices || storeHandleUpdateChoices;

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
			case "Start screen":
				return <StartScreen />;
			case "End screen":
				return <EndScreen />;
			case "Short text":
				return (
					<ShortText
						value={newResponse as string}
						onChange={handleResponseChange}
						resizeTrigger={previewSize}
						isPublished={isPublished || false}
					/>
				);
			case "Long text":
				return (
					<LongText
						value={newResponse as string}
						onChange={handleResponseChange}
						resizeTrigger={previewSize}
						isPublished={isPublished || false}
					/>
				);
			case "Yes/no choice":
				return (
					<YesNoChoice
						id={question._id}
						key={question._id}
						value={newResponse as string}
						onChange={handleResponseChange}
						updateChoices={updateChoices}
						options={(question.choices || []).map((choice) => ({
							label: choice,
							value: choice,
						}))}
						isPublished={isPublished || false}
					/>
				);
			case "Single choice":
				return (
					<SingleChoice
						id={question._id}
						key={question._id}
						value={newResponse as string}
						onChange={handleResponseChange}
						updateChoices={updateChoices}
						options={(question.choices || []).map((choice) => ({
							label: choice,
							value: choice,
						}))}
						isPublished={isPublished || false}
					/>
				);
			case "Multiple choice":
				return (
					<MultipleChoice
						id={question._id}
						key={question._id}
						values={newResponse as string[]}
						onChange={handleResponseChange}
						updateChoices={updateChoices}
						options={(question.choices || []).map((choice) => ({
							label: choice,
							value: choice,
						}))}
						isPublished={isPublished || false}
					/>
				);
			case "Rating":
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
		if (question.type === "Start screen" && onStart) {
			return (
				<Button size="lg" onClick={onStart}>
					Start
				</Button>
			);
		}
		if (question.type === "End screen" && onComplete) {
			return (
				<Button size="lg" onClick={onComplete}>
					Complete
				</Button>
			);
		}
		if (onBack && onForward) {
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
		question.type === "Start screen" || question.type === "End screen";

	const questionContent = (
		<>
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
				{question.isRequired && <span className="text-red-500 ml-1">*</span>}
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
			{/* Mobile center image should appear between description and input */}
			{shouldShowMobileImage("center") &&
				effectiveMobileLayout !== "fill-top" && (
					<QuestionMedia
						imageUrl={question.image}
						layout="center"
						focalPoint={
							question.imageFocalPoint as { x: number; y: number } | undefined
						}
						isMobilePreview={previewSize === "w-2/5"}
						className={previewSize === "w-2/5" ? "mb-4" : "sm:hidden mb-4"}
					/>
				)}

			{renderQuestionContent()}
			{error && (
				<div className="text-red-500 text-xs mt-2 w-full text-left">
					{error}
				</div>
			)}
			{renderButtons()}
		</>
	);

	return (
		<QuestionLayout
			question={question}
			previewSize={previewSize}
			isPreview={isPreview}
			isPublished={isPublished}
		>
			<div
				className={cn(
					"flex flex-col justify-center w-full",
					isScreen ? "items-center" : "items-start",
				)}
			>
				{questionContent}
			</div>
		</QuestionLayout>
	);
};
