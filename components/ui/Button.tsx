import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    const variantClasses = {
      primary:
        "btn-primary-gradient text-text-on-fill",
      secondary:
        "bg-bg-interactive hover:bg-bg-interactive-hover text-text-primary border border-border-default",
      ghost:
        "bg-transparent hover:bg-bg-interactive text-text-primary",
    };
    const sizeClasses = {
      sm: "text-body-sm leading-body-sm tracking-body-sm px-3 py-1.5",
      md: "text-body leading-body tracking-body h-10 px-4",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "font-medium rounded-lg transition-colors flex items-center justify-center",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app",
          variantClasses[variant],
          sizeClasses[size],
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
