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
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};
