import { create } from "zustand";

interface PreviewSize {
	previewSize: string;
	setPreviewSize: (size: string) => void;
}

export const usePreviewSize = create<PreviewSize>((set) => ({
	previewSize: "max-w-[720px]",
	setPreviewSize: (size) => set({ previewSize: size }),
}));
