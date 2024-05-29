"use client";

import * as React from "react";
import * as RadioCardsPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioCardsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioCardsPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioCardsPrimitive.Root
      className={cn("grid gap-4", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioCard.displayName = "RadioCards";

const RadioCardItem = React.forwardRef<
  React.ElementRef<typeof RadioCardsPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioCardsPrimitive.Item> & {
    label: React.ReactNode;
    children?: React.ReactNode;
  }
>(({ className, label, children, ...props }, ref) => {
  return (
    <RadioCardsPrimitive.Item
      ref={ref}
      className={cn(
        "p-2 w-[230px] rounded-lg cursor-pointer border hover:bg-accent text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
        props.checked && "bg-accent font-medium"
      )}
      {...props}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm">{label}</span>
        {children}
      </div>
    </RadioCardsPrimitive.Item>
  );
});
RadioCardItem.displayName = "RadioCardItem";

export { RadioCard, RadioCardItem };
