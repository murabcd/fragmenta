import { useEffect, useRef } from "react";

export const useAutoResizeTextarea = (
	content: string,
	initialHeight: string = "auto",
	resizeTrigger: any,
) => {
	const ref = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		const resizeTextarea = () => {
			const textarea = ref.current;
			if (textarea) {
				textarea.style.height = initialHeight;
				textarea.style.height = `${textarea.scrollHeight}px`;
			}
		};

		const textarea = ref.current;
		if (textarea) {
			textarea.addEventListener("input", resizeTextarea);
			resizeTextarea();
		}

		return () => {
			if (textarea) {
				textarea.removeEventListener("input", resizeTextarea);
			}
		};
	}, [initialHeight]);

	return ref;
};
