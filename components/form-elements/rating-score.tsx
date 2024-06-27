import { RadioCard, RadioCardItem } from "@/components/ui/radio-card";

interface RatingScoreProps {
  value: string;
  onChange: (value: string) => void;
  isPublished: boolean;
}

export const RatingScore = ({ value, onChange, isPublished }: RatingScoreProps) => {
  const ratings = Array.from({ length: 11 }, (_, i) => i.toString());

  return (
    <div className="w-full">
      <RadioCard value={value} onValueChange={onChange} className="flex flex-wrap gap-2">
        {ratings.map((rating) => (
          <RadioCardItem
            key={rating}
            value={rating}
            label={rating}
            checked={isPublished && value === rating}
            className={`flex items-center justify-center h-10 w-10 ${
              isPublished
                ? "text-foreground hover:bg-accent hover:text-accent-foreground"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </RadioCard>
    </div>
  );
};
