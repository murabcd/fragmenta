import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface HintProps {
  label: string;
  children: React.ReactNode;
  asChild?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  variant?: "default" | "ghost";
}

export const Hint = React.forwardRef<HTMLDivElement, HintProps>(
  ({ label, children, asChild, side, align, sideOffset, alignOffset }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild={asChild}>
            <div ref={ref}>{children}</div>
          </TooltipTrigger>
          <TooltipContent
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
          >
            <p className="text-sm">{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

Hint.displayName = "Hint";
