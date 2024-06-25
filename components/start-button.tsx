import { Button } from "@/components/ui/button";

interface StartButtonProps {
  onClick: () => void;
}

export const StartButton = ({ onClick }: StartButtonProps) => (
  <Button size="lg" onClick={onClick}>
    Start
  </Button>
);
