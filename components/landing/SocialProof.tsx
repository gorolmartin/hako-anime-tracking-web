"use client";

import { useRef, useState, useEffect } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

const WAITLIST_COUNT = 1247;

/* Replace with real Twitter/X handle when available */
const TWITTER_URL = "https://x.com/GetHako";

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SocialProof() {
  const [displayCount, setDisplayCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setDisplayCount(WAITLIST_COUNT);
      return;
    }
    const controls = animate(0, WAITLIST_COUNT, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, prefersReducedMotion]);

  return (
    <section ref={ref} className="bg-bg-app py-24">
      <AnimatedSection className="max-w-[600px] mx-auto px-6">
        <div className="flex flex-col items-center gap-6">
          <Card className="w-full flex flex-col md:flex-row md:flex-wrap md:items-center gap-4 md:gap-6">
            <div className="flex flex-row flex-wrap items-center gap-4 md:gap-6">
              <span className="text-display leading-display tracking-display font-medium text-text-primary shrink-0">
                {displayCount.toLocaleString()}
              </span>
              <p className="text-body-lg leading-body-lg tracking-body-lg text-text-secondary flex-1 min-w-0">
                anime fans waiting
              </p>
            </div>
            <a
              href="#early-access"
              className={cn(
                "font-medium rounded-lg transition-colors w-full md:w-auto md:shrink-0 md:ml-auto",
                "btn-primary-gradient text-text-on-fill",
                "text-body leading-body tracking-body px-4 py-2",
                "inline-flex items-center justify-center",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app"
              )}
            >
              Join the waitlist
            </a>
          </Card>

          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
            <span className="text-overline leading-overline tracking-overline font-semibold uppercase text-accent-blue-text">
              built by anime fans, for anime fans
            </span>
            <span className="text-overline leading-overline tracking-overline font-semibold uppercase text-accent-blue-text">
              ⋅
            </span>
            <span className="text-overline leading-overline tracking-overline font-semibold uppercase text-accent-blue-text">
              follow our journey on
            </span>
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex p-1 rounded text-accent-blue-text transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app"
              aria-label="Twitter / X"
            >
              <TwitterXIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
