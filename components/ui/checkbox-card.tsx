"use client";

import * as React from "react";
import * as CheckboxCardsPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";

const CheckboxCard = React.forwardRef<
  React.ElementRef<typeof CheckboxCardsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxCardsPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <CheckboxCardsPrimitive.Root
      className={cn("grid gap-4", className)}
      {...props}
      ref={ref}
    />
  );
});
CheckboxCard.displayName = "CheckboxCard";

const CheckboxCardItem = React.forwardRef<
  React.ElementRef<typeof CheckboxCardsPrimitive.Checkbox>,
  React.ComponentPropsWithoutRef<typeof CheckboxCardsPrimitive.Checkbox> & {
    label: React.ReactNode;
    children: React.ReactNode;
    onClick?: () => void;
  }
>(({ className, label, children, onClick, ...props }, ref) => {
  return (
    <CheckboxCardsPrimitive.Checkbox
      ref={ref}
      className={cn(
        "p-2 w-[230px] rounded-md cursor-pointer border hover:bg-accent text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
        props.checked && "bg-accent font-medium"
      )}
      {...props}
      onClick={onClick}
    >
      <div className="flex justify-between items-center w-full">
        <span className="text-sm break-words">{label}</span>
        {children}
      </div>
    </CheckboxCardsPrimitive.Checkbox>
  );
});
CheckboxCardItem.displayName = "CheckboxCardItem";

export { CheckboxCard, CheckboxCardItem };
