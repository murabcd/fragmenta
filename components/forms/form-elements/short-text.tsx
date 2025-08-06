import { useAutoResizeTextarea } from "@/hooks/use-auto-resize";

interface ShortTextProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	resizeTrigger: any;
	isPublished: boolean;
}

export const ShortText = ({
	value,
	onChange,
	placeholder = "Type your answer here...",
	resizeTrigger,
	isPublished,
}: ShortTextProps) => {
	const textRef = useAutoResizeTextarea(value, "32px", resizeTrigger);

	if (!isPublished) {
		return (
			<div className="w-full border-b border-muted py-2 text-sm text-muted-foreground">
				{placeholder}
			</div>
		);
	}

	return (
		<textarea
			id="short-text"
			name="short-text"
			ref={textRef}
			value={value}
			className="bg-transparent border-b-2 border-muted focus:border-b-2 focus:border-primary text-lg w-full focus-visible:outline-none resize-none py-2 transition-colors duration-200"
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
		/>
	);
};
