import { Button } from "@/components/ui/button";

interface CompleteButtonProps {
	onClick: () => void;
}

export const CompleteButton = ({ onClick }: CompleteButtonProps) => (
	<Button size="lg" onClick={onClick}>
		Complete
	</Button>
);
