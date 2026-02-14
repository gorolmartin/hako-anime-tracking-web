import * as React from "react";
import { cn } from "@/lib/utils";

export type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "body-sm"
  | "caption";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
}

const variantClasses: Record<TypographyVariant, string> = {
  display:
    "text-display leading-display tracking-display font-medium",
  h1: "text-h1 leading-h1 tracking-h1 font-medium",
  h2: "text-h2 leading-h2 tracking-h2 font-medium",
  h3: "text-h3 leading-h3 tracking-h3 font-medium",
  h4: "text-h4 leading-h4 tracking-h4 font-medium",
  body: "text-body leading-body tracking-body font-normal",
  "body-sm": "text-body-sm leading-body-sm tracking-body-sm font-normal",
  caption: "text-caption leading-caption tracking-caption font-normal",
};

const defaultTag: Record<TypographyVariant, React.ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  "body-sm": "p",
  caption: "span",
};

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "body", as, ...props }, ref) => {
    const Comp = as ?? defaultTag[variant];
    return (
      <Comp
        ref={ref as React.Ref<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>}
        className={cn("text-text-primary", variantClasses[variant], className)}
        {...props}
      />
    );
  }
);

Typography.displayName = "Typography";

export { Typography };
