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
  <div className="fixed bottom-3 right-3 flex items-center gap-2">
    <Button onClick={onBack} disabled={isBackDisabled}>
      <ChevronUp className="w-4 h-4 mr-2" />
      Back
    </Button>
    <Button onClick={onForward} disabled={isForwardDisabled}>
      <ChevronDown className="w-4 h-4 mr-2" />
      Next
    </Button>
  </div>
);
