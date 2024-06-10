import { useAutoResizeTextarea } from "@/hooks/use-auto-resize";

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
}: LongTextProps) => {
  const textRef = useAutoResizeTextarea(value, "32px");

  return (
    <textarea
      ref={textRef}
      className="bg-transparent text-sm w-full focus-visible:outline-none resize-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};
