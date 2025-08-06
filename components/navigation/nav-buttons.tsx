import { Button } from "@/components/ui/button";

import { ChevronUp, ChevronDown } from "lucide-react";

interface NavigationButtonsProps {
	onBack: () => void;
	onForward: () => void;
	isBackDisabled: boolean;
	isForwardDisabled: boolean;
}

export const NavigationButtons = ({
	onBack,
	onForward,
	isBackDisabled,
	isForwardDisabled,
}: NavigationButtonsProps) => (
	<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
		<Button
			onClick={onBack}
			disabled={isBackDisabled}
			variant="outline"
			size="lg"
			className="px-8 py-3"
		>
			<ChevronUp className="w-5 h-5 mr-2" />
			Back
		</Button>
		<Button
			onClick={onForward}
			disabled={isForwardDisabled}
			size="lg"
			className="px-8 py-3"
		>
			Next
			<ChevronDown className="w-5 h-5 ml-2" />
		</Button>
	</div>
);
