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
  }
>(({ className, label, ...props }, ref) => {
  return (
    <CheckboxCardsPrimitive.Checkbox
      ref={ref}
      className={cn(
        "p-2 w-[200px] rounded-lg cursor-pointer border bg-background/55 dark:border-primary/10 hover:bg-primary/10",
        className,
        props.checked && "bg-primary/10 text-primary font-medium"
      )}
      {...props}
    >
      <div className="flex flex-col items-start gap-2">
        <span className="text-sm">{label}</span>
      </div>
    </CheckboxCardsPrimitive.Checkbox>
  );
});
CheckboxCardItem.displayName = "CheckboxCardItem";

export { CheckboxCard, CheckboxCardItem };
