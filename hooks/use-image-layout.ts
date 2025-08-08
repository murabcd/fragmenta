import { useMemo } from "react";

interface ImageLayoutConfig {
	mobile?: string;
	desktop?: string;
}

interface UseImageLayoutProps {
	imageLayout?: ImageLayoutConfig;
	previewSize?: string;
	isPreview?: boolean;
}

export const useImageLayout = ({
	imageLayout,
	previewSize = "max-w-[720px]",
	isPreview = false,
}: UseImageLayoutProps) => {
	return useMemo(() => {
		// Determine if we're in mobile or desktop preview mode
		const isMobilePreview = previewSize === "w-2/5";
		const isDesktopPreview = previewSize === "max-w-[720px]";

		// Get effective layouts based on preview mode or actual device
		const effectiveMobileLayout =
			isMobilePreview || !isPreview
				? imageLayout?.mobile || "center"
				: "center";

		const effectiveDesktopLayout =
			isDesktopPreview || !isPreview ? imageLayout?.desktop || "left" : "left";

		// Helper functions to determine layout types
		const isMobileFill = effectiveMobileLayout === "fill-top";
		const isDesktopFill =
			effectiveDesktopLayout === "fill-left" ||
			effectiveDesktopLayout === "fill-right";
		const isDesktopSide =
			effectiveDesktopLayout === "left" || effectiveDesktopLayout === "right";

		// Determine which images to show based on current context
		const shouldShowMobileImage = (layout: string) => {
			if (isPreview) {
				return isMobilePreview && effectiveMobileLayout === layout;
			}
			return effectiveMobileLayout === layout;
		};

		const shouldShowDesktopImage = (layout: string) => {
			if (isPreview) {
				return isDesktopPreview && effectiveDesktopLayout === layout;
			}
			return effectiveDesktopLayout === layout;
		};

		return {
			effectiveMobileLayout,
			effectiveDesktopLayout,
			isMobileFill,
			isDesktopFill,
			isDesktopSide,
			shouldShowMobileImage,
			shouldShowDesktopImage,
			isMobilePreview,
			isDesktopPreview,
		};
	}, [imageLayout, previewSize, isPreview]);
};
