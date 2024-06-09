"use client";

import { useState } from "react";

import { useDebouncedCallback } from "use-debounce";

import { CheckboxCard, CheckboxCardItem } from "@/components/ui/checkbox-card";

import { X } from "lucide-react";

import { toast } from "sonner";

interface MultipleChoiceProps {
  id: string;
  values: string[];
  options: { label: string; value: string }[];
  onChange: (value: string[]) => void;
  updateChoices: (choices: { id: string; choices: string[] }) => Promise<void>;
}

export const MultipleChoice = ({
  id,
  values,
  options: initialOptions,
  onChange,
  updateChoices,
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

  const handleAddChoice = () => {
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
    if (editingOption !== null) {
      debouncedUpdateLabel.flush();
      setEditingOption(null);
    }
  };

  return (
    <div className="w-full">
      <div className="max-h-64 overflow-y-auto">
        <CheckboxCard>
          {options.map((option, index) => (
            <CheckboxCardItem
              key={option.value}
              value={option.value}
              label={
                editingOption === option.value ? (
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => handleLabelChange(e.target.value, index)}
                    onBlur={handleBlur}
                    className="bg-transparent border-none focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span onClick={() => handleOptionClick(option.value)}>
                    {option.label}
                  </span>
                )
              }
              checked={values.includes(option.value)}
            >
              <button onClick={() => handleDeleteChoice(index)}>
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </CheckboxCardItem>
          ))}
        </CheckboxCard>
      </div>
      <div className="mt-4 text-xs font-light text-muted-foreground hover:text-foreground">
        <button onClick={handleAddChoice}>Add new choice</button>
      </div>
    </div>
  );
};
