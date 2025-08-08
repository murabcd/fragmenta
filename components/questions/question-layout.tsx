"use client";

import type { ReactNode } from "react";
import { QuestionMedia } from "./question-media";
import { useImageLayout } from "@/hooks/use-image-layout";
import { cn } from "@/lib/utils";
import type { Doc } from "@/convex/_generated/dataModel";

interface QuestionLayoutProps {
	question: Doc<"questions">;
	children: ReactNode;
	previewSize?: string;
	isPreview?: boolean;
	isPublished?: boolean;
}

// Mobile-specific layout component
const MobileLayout = ({
	question,
	children,
	isPreview,
	isPublished,
}: {
	question: Doc<"questions">;
	children: ReactNode;
	isPreview: boolean;
	isPublished: boolean;
}) => {
	const { effectiveMobileLayout, shouldShowMobileImage } = useImageLayout({
		imageLayout: question.imageLayout,
		previewSize: "w-2/5",
		isPreview: true,
	});

	const containerClasses = cn(
		"flex flex-col items-center w-full min-h-[calc(100vh-120px)]",
		// Only use justify-start for fill-top, otherwise center
		effectiveMobileLayout === "fill-top" ? "justify-start" : "justify-center",
		isPreview ? "w-2/5" : "",
		isPublished
			? "border-none bg-transparent rounded-none px-0 py-0 w-full max-w-4xl"
			: "border px-0",
	);

	return (
		<div className={containerClasses}>
			{/* Mobile media layouts */}
			{shouldShowMobileImage("top") && (
				<QuestionMedia
					imageUrl={question.image}
					layout="top"
					focalPoint={
						question.imageFocalPoint as { x: number; y: number } | undefined
					}
					isMobilePreview={true}
					className={isPreview ? undefined : "sm:hidden"}
				/>
			)}
			{shouldShowMobileImage("fill-top") && (
				<QuestionMedia
					imageUrl={question.image}
					layout="fill-top"
					focalPoint={
						question.imageFocalPoint as { x: number; y: number } | undefined
					}
					isMobilePreview={true}
					className={isPreview ? undefined : "sm:hidden"}
				/>
			)}

			{/* Mobile content area */}
			<div
				className={cn(
					"flex flex-col items-start w-full",
					effectiveMobileLayout === "fill-top"
						? "justify-start pt-4"
						: "justify-center",
				)}
			>
				{children}
			</div>
		</div>
	);
};

// Desktop-specific layout component
const DesktopLayout = ({
	question,
	children,
	isPreview,
	isPublished,
}: {
	question: Doc<"questions">;
	children: ReactNode;
	isPreview: boolean;
	isPublished: boolean;
}) => {
	const { effectiveDesktopLayout, isDesktopFill, shouldShowDesktopImage } =
		useImageLayout({
			imageLayout: question.imageLayout,
			previewSize: "max-w-[720px]",
			isPreview: true,
		});

	const containerClasses = cn(
		"flex flex-col items-center justify-center w-full min-h-[calc(100vh-120px)]",
		isPreview ? "max-w-[720px]" : "",
		isPublished
			? "border-none bg-transparent rounded-none px-0 py-0 w-full max-w-4xl"
			: isDesktopFill
				? "border"
				: "border px-4",
		isDesktopFill ? "h-full" : "",
	);

	const desktopLayoutClasses = cn(
		"flex w-full",
		isDesktopFill ? "flex-1 items-stretch" : "items-start",
	);

	return (
		<div className={containerClasses}>
			{/* Desktop layout container */}
			<div className={desktopLayoutClasses}>
				{shouldShowDesktopImage("fill-left") && (
					<QuestionMedia
						imageUrl={question.image}
						layout="fill-left"
						focalPoint={
							question.imageFocalPoint as { x: number; y: number } | undefined
						}
						isMobilePreview={false}
						className={isPreview ? undefined : "hidden sm:block"}
					/>
				)}
				{shouldShowDesktopImage("left") && (
					<QuestionMedia
						imageUrl={question.image}
						layout="left"
						focalPoint={
							question.imageFocalPoint as { x: number; y: number } | undefined
						}
						isMobilePreview={false}
						className={isPreview ? undefined : "hidden sm:block"}
					/>
				)}

				{/* Main content area */}
				<div
					className={cn(
						"flex flex-col justify-center items-start",
						isDesktopFill
							? "flex-1 px-4"
							: effectiveDesktopLayout === "left" ||
									effectiveDesktopLayout === "right"
								? "flex-1"
								: "w-full",
					)}
				>
					{children}
				</div>

				{shouldShowDesktopImage("fill-right") && (
					<QuestionMedia
						imageUrl={question.image}
						layout="fill-right"
						focalPoint={
							question.imageFocalPoint as { x: number; y: number } | undefined
						}
						isMobilePreview={false}
						className={isPreview ? undefined : "hidden sm:block"}
					/>
				)}
				{shouldShowDesktopImage("right") && (
					<QuestionMedia
						imageUrl={question.image}
						layout="right"
						focalPoint={
							question.imageFocalPoint as { x: number; y: number } | undefined
						}
						isMobilePreview={false}
						className={isPreview ? undefined : "hidden sm:block"}
					/>
				)}
			</div>
		</div>
	);
};

// Main layout component that chooses between mobile and desktop
export const QuestionLayout = ({
	question,
	children,
	previewSize = "max-w-[720px]",
	isPreview = false,
	isPublished = false,
}: QuestionLayoutProps) => {
	const isMobilePreview = previewSize === "w-2/5";

	// Always call hooks at the top level
	const {
		effectiveDesktopLayout,
		isDesktopFill,
		shouldShowMobileImage,
		shouldShowDesktopImage,
	} = useImageLayout({
		imageLayout: question.imageLayout,
		previewSize,
		isPreview,
	});

	// Choose the appropriate layout based on preview mode
	if (isPreview && isMobilePreview) {
		return (
			<MobileLayout
				question={question}
				isPreview={isPreview}
				isPublished={isPublished}
			>
				{children}
			</MobileLayout>
		);
	}

	if (isPreview && !isMobilePreview) {
		return (
			<DesktopLayout
				question={question}
				isPreview={isPreview}
				isPublished={isPublished}
			>
				{children}
			</DesktopLayout>
		);
	}

	const containerClasses = cn(
		"flex flex-col items-center justify-center w-full min-h-[calc(100vh-120px)]",
		isPublished
			? "border-none bg-transparent rounded-none px-0 py-0 w-full max-w-4xl"
			: isDesktopFill
				? "border"
				: "border px-4",
		isDesktopFill ? "h-full" : "",
	);

	const desktopLayoutClasses = cn(
		"flex w-full",
		isDesktopFill ? "flex-1 items-stretch" : "items-start",
	);

	return (
		<div className={containerClasses}>
			{/* Mobile-specific media layouts */}
			{shouldShowMobileImage("top") && (
				<QuestionMedia
					imageUrl={question.image}
					layout="top"
					focalPoint={
						question.imageFocalPoint as { x: number; y: number } | undefined
					}
					isMobilePreview={false}
					className="sm:hidden"
				/>
			)}
			{shouldShowMobileImage("fill-top") && (
				<QuestionMedia
					imageUrl={question.image}
					layout="fill-top"
					focalPoint={
						question.imageFocalPoint as { x: number; y: number } | undefined
					}
					isMobilePreview={false}
					className="sm:hidden"
				/>
			)}

			{/* Desktop layout container */}
			<div className={desktopLayoutClasses}>
				{shouldShowDesktopImage("fill-left") && (
					<QuestionMedia
						imageUrl={question.image}
						layout="fill-left"
						focalPoint={
							question.imageFocalPoint as { x: number; y: number } | undefined
						}
						isMobilePreview={false}
						className="hidden sm:block"
					/>
				)}
				{shouldShowDesktopImage("left") && (
					<QuestionMedia
						imageUrl={question.image}
						layout="left"
						focalPoint={
							question.imageFocalPoint as { x: number; y: number } | undefined
						}
						isMobilePreview={false}
						className="hidden sm:block"
					/>
				)}

				{/* Main content area */}
				<div
					className={cn(
						"flex flex-col justify-center items-start",
						isDesktopFill
							? "flex-1 px-4"
							: effectiveDesktopLayout === "left" ||
									effectiveDesktopLayout === "right"
								? "flex-1"
								: "w-full",
					)}
				>
					{children}
				</div>

				{shouldShowDesktopImage("fill-right") && (
					<QuestionMedia
						imageUrl={question.image}
						layout="fill-right"
						focalPoint={
							question.imageFocalPoint as { x: number; y: number } | undefined
						}
						isMobilePreview={false}
						className="hidden sm:block"
					/>
				)}
				{shouldShowDesktopImage("right") && (
					<QuestionMedia
						imageUrl={question.image}
						layout="right"
						focalPoint={
							question.imageFocalPoint as { x: number; y: number } | undefined
						}
						isMobilePreview={false}
						className="hidden sm:block"
					/>
				)}
			</div>
		</div>
	);
};
