import { RadioCard, RadioCardItem } from "@/components/ui/radio-card";

interface RatingScoreProps {
  value: string;
  onChange: (value: string) => void;
}

export const RatingScore = ({ value, onChange }: RatingScoreProps) => {
  const ratings = Array.from({ length: 11 }, (_, i) => i.toString());

  return (
    <div className="w-full">
      {/* TODO: Temporarily using flex-wrap, but should be grid */}
      <RadioCard
        value={value}
        onValueChange={onChange}
        className="flex flex-wrap justify-between"
      >
        {ratings.map((rating) => (
          <RadioCardItem
            key={rating}
            value={rating}
            label={rating}
            checked={value === rating}
            className="flex items-center justify-center h-10 w-10 text-muted-foreground hover:text-foreground"
          />
        ))}
      </RadioCard>
    </div>
  );
};
