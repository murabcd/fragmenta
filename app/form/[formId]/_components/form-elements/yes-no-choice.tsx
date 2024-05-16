import { RadioCard, RadioCardItem } from "@/components/ui/radio-card";

interface YesNoProps {
  value: string;
  onChange: (value: string) => void;
  options?: { yes: string; no: string };
}

export const YesNoChoice = ({ value, onChange, options }: YesNoProps) => {
  return (
    <div className="w-full">
      <RadioCard value={value} onValueChange={onChange}>
        <RadioCardItem
          value="yes"
          id="option-yes"
          label={options?.yes || "Yes"}
          checked={value === "yes"}
        />
        <RadioCardItem
          value="no"
          id="option-no"
          label={options?.no || "No"}
          checked={value === "no"}
        />
      </RadioCard>
    </div>
  );
};
