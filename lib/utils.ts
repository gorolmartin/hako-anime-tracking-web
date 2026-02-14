import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display", "h1", "h2", "h3", "h4", "body", "body-sm", "body-lg", "caption"] },
      ],
      leading: [
        { leading: ["display", "h1", "h2", "h3", "h4", "body", "body-sm", "body-lg", "caption"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
