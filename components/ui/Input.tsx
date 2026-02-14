import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full h-10 bg-gray-850 border border-border-default rounded-lg",
        "px-3 text-body leading-body tracking-body text-text-primary",
        "placeholder:text-text-tertiary",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:border-transparent",
        "disabled:opacity-50 disabled:pointer-events-none",
        "transition-colors",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };
