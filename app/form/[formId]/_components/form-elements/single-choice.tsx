"use client";

import { useState } from "react";

import { useDebouncedCallback } from "use-debounce";

import { RadioCard, RadioCardItem } from "@/components/ui/radio-card";

interface SingleChoiceProps {
  id: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  updateChoices: (choices: { id: string; choices: string[] }) => Promise<void>;
}

export const SingleChoice = ({
  id,
  value,
  options: initialOptions,
  onChange,
  updateChoices,
}: SingleChoiceProps) => {
  const defaultOptions =
    initialOptions.length > 0
      ? initialOptions
      : [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ];

  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [options, setOptions] = useState(defaultOptions);

  const debouncedUpdateLabel = useDebouncedCallback(
    (updatedOptions: { label: string; value: string }[]) => {
      updateChoices({
        id,
        choices: updatedOptions.map((option) => option.label),
      });
    },
    500
  );

  const handleLabelChange = (value: string, index: number) => {
    setOptions((currentOptions) => {
      const newOptions = [...currentOptions];
      newOptions[index].label = value;
      debouncedUpdateLabel(newOptions);
      return newOptions;
    });
  };

  const handleOptionClick = (optionValue: string) => {
    if (editingOption !== null) {
      debouncedUpdateLabel.flush();
    }
    setEditingOption(optionValue);
  };

  return (
    <div className="w-full">
      <RadioCard value={value} onValueChange={onChange}>
        {options.map((option, index) => (
          <RadioCardItem
            key={option.value}
            value={option.value}
            label={
              editingOption === option.value ? (
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => handleLabelChange(e.target.value, index)}
                  className="bg-transparent border-none focus:outline-none"
                  autoFocus
                />
              ) : (
                <span onClick={() => handleOptionClick(option.value)}>
                  {option.label}
                </span>
              )
            }
            checked={value === option.value}
          />
        ))}
      </RadioCard>
    </div>
  );
};
