"use client";

import { useState, useEffect, useRef } from "react";

import { RadioCard, RadioCardItem } from "@/components/ui/radio-card";

import { X } from "lucide-react";

import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

interface SingleChoiceProps {
	id: Id<"questions">;
	value: string;
	options: { label: string; value: string }[];
	onChange: (value: string) => void;
	updateChoices: (choices: {
		id: Id<"questions">;
		choices: string[];
	}) => Promise<void>;
	isPublished: boolean;
}

export const SingleChoice = ({
	id,
	value,
	options: initialOptions,
	onChange,
	updateChoices,
	isPublished,
}: SingleChoiceProps) => {
	const defaultOptions =
		initialOptions.length > 0
			? initialOptions
			: [
					{ label: "Choice 1", value: "choice-1" },
					{ label: "Choice 2", value: "choice-2" },
				];

	const [editingOption, setEditingOption] = useState<string | null>(null);
	const [options, setOptions] = useState(defaultOptions);
	const [isOverflowing, setIsOverflowing] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleLabelChange = (value: string, index: number) => {
		if (isPublished) return;

		setOptions((currentOptions) => {
			const newOptions = [...currentOptions];
			newOptions[index].label = value;

			// Call updateChoices immediately for optimistic updates
			updateChoices({
				id,
				choices: newOptions.map((option) => option.label),
			});

			return newOptions;
		});
	};

	const handleOptionClick = (optionValue: string) => {
		if (isPublished) {
			onChange(optionValue);
			return;
		}

		if (editingOption !== null) {
			// Flush any pending updates
		}
		setEditingOption(optionValue);
		onChange(optionValue);
	};

	const handleAddChoice = () => {
		if (isPublished) return;

		const newChoiceLabel = "New choice";
		const newChoice = { label: newChoiceLabel, value: `new-${Date.now()}` };
		const updatedOptions = [...options, newChoice];

		setOptions(updatedOptions);
		updateChoices({
			id,
			choices: updatedOptions.map((option) => option.label),
		})
			.then(() => {
				toast.success("Choice created");
			})
			.catch(() => {
				toast.error("Failed to create choice");
			});
	};

	const handleDeleteChoice = (index: number) => {
		if (isPublished) return;

		const updatedOptions = options.filter((_, i) => i !== index);
		setOptions(updatedOptions);
		updateChoices({
			id,
			choices: updatedOptions.map((option) => option.label),
		})
			.then(() => {
				toast.success("Choice deleted");
			})
			.catch(() => {
				toast.error("Failed to delete choice");
			});
	};

	const handleBlur = () => {
		if (isPublished) return;

		if (editingOption !== null) {
			setEditingOption(null);
		}
	};

	useEffect(() => {
		const checkOverflow = () => {
			if (containerRef.current) {
				setIsOverflowing(
					containerRef.current.scrollHeight > containerRef.current.clientHeight,
				);
			}
		};

		checkOverflow();
	}, []);

	const handleScroll = () => {
		if (containerRef.current) {
			const isAtBottom =
				containerRef.current.scrollHeight - containerRef.current.scrollTop ===
				containerRef.current.clientHeight;
			setIsOverflowing(!isAtBottom);
		}
	};

	return (
		<div className="w-full relative">
			<div
				ref={containerRef}
				className="max-h-64 overflow-y-auto"
				onScroll={handleScroll}
			>
				<RadioCard>
					{options.map((option, index) => (
						<RadioCardItem
							key={option.value}
							value={option.value}
							label={
								editingOption === option.value && !isPublished ? (
									<input
										id="single-choice"
										name="single-choice"
										type="text"
										value={option.label}
										onChange={(e) => handleLabelChange(e.target.value, index)}
										onBlur={handleBlur}
										className="bg-transparent border-none focus:outline-none"
									/>
								) : (
									option.label
								)
							}
							checked={isPublished && value === option.value}
							onClick={() => handleOptionClick(option.value)}
						>
							{!isPublished && (
								// biome-ignore lint/a11y/useSemanticElements: Cannot use button due to nested button structure
								<div
									role="button"
									tabIndex={0}
									onClick={(e) => {
										e.stopPropagation();
										handleDeleteChoice(index);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											e.stopPropagation();
											handleDeleteChoice(index);
										}
									}}
									className="cursor-pointer p-1 rounded hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
									aria-label="Delete choice"
								>
									<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
								</div>
							)}
						</RadioCardItem>
					))}
				</RadioCard>
			</div>
			{isOverflowing && (
				<div
					className={`absolute left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none ${
						isPublished ? "bottom-0" : "bottom-8"
					}`}
				></div>
			)}
			{!isPublished && (
				<div className="mt-4 ml-2 text-xs font-light text-muted-foreground hover:text-foreground">
					<button type="button" onClick={handleAddChoice}>
						Add new choice
					</button>
				</div>
			)}
		</div>
	);
};
