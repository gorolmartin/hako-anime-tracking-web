"use client";

import { AnimatedSection } from "./AnimatedSection";
import { Card, Typography } from "@/components/ui";

const FEATURES = [
  {
    title: "Smart Tracking",
    description: "Auto-detect new episodes and sync your progress across devices so you never lose your place.",
    icon: (
      <svg className="w-6 h-6 text-accent-blue-text" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Push Notifications",
    description: "Never miss a release. Get alerts when new episodes drop for the shows you follow.",
    icon: (
      <svg className="w-6 h-6 text-accent-blue-text" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    title: "Community",
    description: "Share and discover lists with other fans. Find recommendations that match your taste.",
    icon: (
      <svg className="w-6 h-6 text-accent-blue-text" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Stats & Insights",
    description: "See your viewing habits at a glance. Track time spent, genres, and seasonal favorites.",
    icon: (
      <svg className="w-6 h-6 text-accent-blue-text" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <Typography variant="h2" className="mb-4">
            Everything you need to stay on top
          </Typography>
          <Typography variant="body" className="text-text-secondary max-w-xl mx-auto">
            Built for anime fans who want a simple, fast way to track what they watch.
          </Typography>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 0.1}>
              <Card className="h-full flex flex-col">
                <div className="mb-4">{feature.icon}</div>
                <Typography variant="h3" className="mb-2">
                  {feature.title}
                </Typography>
                <Typography variant="body" className="text-text-secondary">
                  {feature.description}
                </Typography>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
