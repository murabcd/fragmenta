import { useAutoResizeTextarea } from "@/hooks/use-auto-resize";

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
  const textRef = useAutoResizeTextarea(value, "32px");

  return (
    <textarea
      ref={textRef}
      value={value}
      className="bg-transparent text-sm w-full focus-visible:outline-none resize-none"
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};
