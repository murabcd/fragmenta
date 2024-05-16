import { CheckboxCard, CheckboxCardItem } from "@/components/ui/checkbox-card";

interface MultipleChoiceProps {
  values: string[];
  onChange: (value: string[]) => void;
  options: { label: string; value: string }[];
}

export const MultipleChoice = ({ values, onChange, options }: MultipleChoiceProps) => {
  const handleCheckedChange = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div className="w-full">
      <CheckboxCard>
        {options.map((option) => (
          <CheckboxCardItem
            key={option.value}
            value={option.value}
            label={option.label}
            checked={values.includes(option.value)}
            onCheckedChange={() => handleCheckedChange(option.value)}
          />
        ))}
      </CheckboxCard>
    </div>
  );
};
