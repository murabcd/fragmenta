"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";

interface QuestionMediaProps {
	imageUrl?: string;
	layout:
		| "left"
		| "right"
		| "center"
		| "fill-left"
		| "fill-right"
		| "top"
		| "fill-top";
	className?: string;
	isMobilePreview?: boolean;
	focalPoint?: { x: number; y: number };
}

export const QuestionMedia = ({
	imageUrl,
	layout,
	className,
	isMobilePreview = false,
	focalPoint,
}: QuestionMediaProps) => {
	// Fetch image URL if it looks like a storage ID
	const resolvedImageUrl = useQuery(
		api.files.getQuestionImageUrl,
		imageUrl && (imageUrl.startsWith("storage:") || imageUrl.length > 20)
			? { storageId: imageUrl as Id<"_storage"> }
			: "skip",
	);

	const imageSrc =
		imageUrl?.startsWith("storage:") || (imageUrl && imageUrl.length > 20)
			? resolvedImageUrl || ""
			: imageUrl || "";

	if (!imageSrc) return null;

	const isFill = layout.includes("fill");
	const isTop = layout === "top" || layout === "fill-top";
	const objectPosition = focalPoint
		? `${Math.round(focalPoint.x)}% ${Math.round(focalPoint.y)}%`
		: undefined;

	// Standardized aspect ratio across all contexts
	const aspectRatio = 16 / 9;

	return (
		<div
			className={cn(
				"w-full",
				{
					"mb-4": isTop,
					"sm:mr-4": layout === "left",
					"sm:ml-4": layout === "right",
					// Conditional flex behavior - only use flex-1 on desktop
					"flex-1 min-h-[400px]": isFill && !isMobilePreview,
					"min-h-[300px]": isFill && isMobilePreview,
					"w-1/2": layout === "left" || layout === "right",
					// Optimized heights for mobile
					"min-h-[200px]": isMobilePreview && layout === "fill-top",
					"min-h-[300px] sm:min-h-[400px]":
						!isMobilePreview && layout === "fill-top",
				},
				className,
			)}
		>
			{isFill ? (
				<Image
					src={imageSrc}
					alt="Question media"
					width={1000}
					height={1000}
					className="w-full h-full object-cover"
					style={objectPosition ? { objectPosition } : undefined}
					priority
				/>
			) : (
				<AspectRatio
					ratio={aspectRatio}
					className={cn(
						// Improved max widths for better visibility
						isMobilePreview
							? "max-w-[320px] mx-auto"
							: layout === "center"
								? "max-w-lg mx-auto"
								: "max-w-md mx-auto",
					)}
				>
					<Image
						src={imageSrc}
						alt="Question media"
						fill
						className="object-cover"
						style={objectPosition ? { objectPosition } : undefined}
						priority
					/>
				</AspectRatio>
			)}
		</div>
	);
};
