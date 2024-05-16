import { RadioCard, RadioCardItem } from "@/components/ui/radio-card";

interface RatingScoreProps {
  value: string;
  onChange: (value: string) => void;
  minLabel?: string;
  maxLabel?: string;
}

export const RatingScore = ({
  value,
  onChange,
  minLabel = "Not likely at all",
  maxLabel = "Extremely likely",
}: RatingScoreProps) => {
  const ratings = Array.from({ length: 11 }, (_, i) => i.toString());

  return (
    <div className="w-full">
      <RadioCard value={value} onValueChange={onChange} className="flex justify-between">
        {ratings.map((rating) => (
          <RadioCardItem
            key={rating}
            value={rating}
            id={`option-${rating}`}
            label={rating}
            checked={value === rating}
            className="flex items-center justify-center h-10 w-10"
          />
        ))}
      </RadioCard>
      <div className="flex justify-between text-xs font-light mt-2">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};
