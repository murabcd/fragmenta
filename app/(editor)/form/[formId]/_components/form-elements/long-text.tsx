import { Textarea } from "@/components/ui/textarea";

interface LongTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export const LongText = ({
  value,
  onChange,
  placeholder = "Type your answer here...",
  maxLength = 300,
}: LongTextProps) => {
  return (
    <Textarea
      className="bg-primary-foreground hover:bg-primary/10 resize-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
    />
  );
};
