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
  }
>(({ className, label, children, ...props }, ref) => {
  return (
    <CheckboxCardsPrimitive.Checkbox
      ref={ref}
      className={cn(
        "p-2 w-[230px] rounded-lg cursor-pointer border bg-background/55 dark:border-primary/10 hover:bg-primary/10",
        className,
        props.checked && "bg-primary/10 text-primary font-medium"
      )}
      {...props}
    >
      <div className="flex justify-between items-center w-full">
        <span className="text-sm">{label}</span>
        {children}
      </div>
    </CheckboxCardsPrimitive.Checkbox>
  );
});
CheckboxCardItem.displayName = "CheckboxCardItem";

export { CheckboxCard, CheckboxCardItem };
