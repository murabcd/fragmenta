"use client";

import { useState, useEffect, useRef } from "react";

import { CheckboxCard, CheckboxCardItem } from "@/components/ui/checkbox-card";

import { X } from "lucide-react";

import { toast } from "sonner";
import { useFormEditor } from "@/hooks/use-form-editor";
import type { Id } from "@/convex/_generated/dataModel";

interface MultipleChoiceProps {
	id: Id<"questions">;
	values: string[];
	options: { label: string; value: string }[];
	onChange: (value: string[]) => void;
	updateChoices?: (choices: { id: Id<"questions">; choices: string[]; }) => Promise<void>;
	isPublished: boolean;
}

export const MultipleChoice = ({
	id,
	values,
	options: initialOptions,
	onChange,
	updateChoices: propsUpdateChoices,
	isPublished,
}: MultipleChoiceProps) => {
	const defaultOptions =
		initialOptions.length > 0
			? initialOptions
			: [
					{ label: "Choice 1", value: "choice-1" },
					{ label: "Choice 2", value: "choice-2" },
					{ label: "Choice 3", value: "choice-3" },
				];

	const [editingOption, setEditingOption] = useState<string | null>(null);
	const [options, setOptions] = useState(defaultOptions);
	const [isOverflowing, setIsOverflowing] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	
	const { handleUpdateChoices: storeHandleUpdateChoices } = useFormEditor();
	const handleUpdateChoices = propsUpdateChoices || storeHandleUpdateChoices;

	const handleLabelChange = (value: string, index: number) => {
		setOptions((currentOptions) => {
			const newOptions = [...currentOptions];
			newOptions[index].label = value;

			// Call handleUpdateChoices immediately for optimistic updates
			handleUpdateChoices({
				id,
				choices: newOptions.map((option) => option.label),
			});

			return newOptions;
		});
	};

	const handleOptionClick = (optionValue: string) => {
		if (isPublished) {
			onChange(
				values.includes(optionValue)
					? values.filter((v) => v !== optionValue)
					: [...values, optionValue],
			);
			return;
		}

		if (editingOption !== null) {
			// Flush any pending updates
		}
		setEditingOption(optionValue);

		onChange(
			values.includes(optionValue)
				? values.filter((v) => v !== optionValue)
				: [...values, optionValue],
		);
	};

	const handleAddChoice = () => {
		if (isPublished) return;

		const newChoiceLabel = "New choice";
		const newChoice = { label: newChoiceLabel, value: `new-${Date.now()}` };
		const updatedOptions = [...options, newChoice];

		setOptions(updatedOptions);
		handleUpdateChoices({
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
		handleUpdateChoices({
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

	useEffect(() => {
		if (editingOption && inputRef.current) {
			inputRef.current.focus();
		}
	}, [editingOption]);

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
				<CheckboxCard>
					{options.map((option, index) => (
						<CheckboxCardItem
							key={option.value}
							value={option.value}
							label={
								editingOption === option.value && !isPublished ? (
									<input
										id="multiple-choice"
										name="multiple-choice"
										type="text"
										value={option.label}
										onChange={(e) => handleLabelChange(e.target.value, index)}
										onBlur={handleBlur}
										className="bg-transparent border-none focus:outline-none"
										ref={inputRef}
									/>
								) : (
									option.label
								)
							}
							checked={isPublished && values.includes(option.value)}
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
						</CheckboxCardItem>
					))}
				</CheckboxCard>
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
