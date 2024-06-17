import { useAutoResizeTextarea } from "@/hooks/use-auto-resize";

interface ShortTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resizeTrigger: any;
}

export const ShortText = ({
  value,
  onChange,
  placeholder = "Type your answer here...",
  resizeTrigger,
}: ShortTextProps) => {
  const textRef = useAutoResizeTextarea(value, "32px", resizeTrigger);

  return (
    <textarea
      ref={textRef}
      value={value}
      className="bg-transparent border-b border-muted focus:border-b-1 focus:border-muted-foreground/30 text-sm w-full focus-visible:outline-none resize-none"
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};
