import { Input } from "@/components/ui/input";

interface ShortTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ShortText = ({
  value,
  onChange,
  placeholder = "Type your answer here...",
}: ShortTextProps) => {
  return (
    <Input
      className="bg-primary-foreground hover:bg-primary/10"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};
