"use client";

import { useState } from "react";

import { RadioCard, RadioCardItem } from "@/components/ui/radio-card";
import type { Id } from "@/convex/_generated/dataModel";

interface YesNoChoiceProps {
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

export const YesNoChoice = ({
	id,
	value,
	options: initialOptions,
	onChange,
	updateChoices,
	isPublished,
}: YesNoChoiceProps) => {
	const defaultOptions =
		initialOptions.length > 0
			? initialOptions
			: [
					{ label: "Yes", value: "yes" },
					{ label: "No", value: "no" },
				];

	const [editingOption, setEditingOption] = useState<string | null>(null);
	const [options, setOptions] = useState(defaultOptions);

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

	const handleBlur = () => {
		if (isPublished) return;

		if (editingOption !== null) {
			setEditingOption(null);
		}
	};

	return (
		<div className="w-full">
			<div className="max-h-64 overflow-y-auto">
				<RadioCard>
					{options.map((option, index) => (
						<RadioCardItem
							key={option.value}
							value={option.value}
							label={
								editingOption === option.value && !isPublished ? (
									<input
										id="yes-no-choice"
										name="yes-no-choice"
										type="text"
										value={option.label}
										onChange={(e) => handleLabelChange(e.target.value, index)}
										onBlur={handleBlur}
										className="bg-transparent border-none focus:outline-none"
									/>
								) : (
									<button
										type="button"
										onClick={() => handleOptionClick(option.value)}
										className="text-left w-full"
									>
										{option.label}
									</button>
								)
							}
							checked={isPublished && value === option.value}
							onClick={() => handleOptionClick(option.value)}
						></RadioCardItem>
					))}
				</RadioCard>
			</div>
		</div>
	);
};
