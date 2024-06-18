import { useAutoResizeTextarea } from "@/hooks/use-auto-resize";

interface LongTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resizeTrigger: any;
}

export const LongText = ({
  value,
  onChange,
  placeholder = "Type your answer here...",
  resizeTrigger,
}: LongTextProps) => {
  const textRef = useAutoResizeTextarea(value, "32px", resizeTrigger);

  return (
    <textarea
      ref={textRef}
      className="bg-transparent border-b border-muted focus:border-b-1 focus:border-muted-foreground/30 text-sm w-full focus-visible:outline-none resize-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};
