import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-bg-surface border border-border-default rounded-2xl p-6",
        "transition-[background-color,border-color] duration-200 hover:bg-bg-surface-raised hover:border-border-strong",
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

export { Card };
