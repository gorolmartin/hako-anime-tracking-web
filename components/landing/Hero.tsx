"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { Button, Input, Typography } from "@/components/ui";

export function Hero() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  function setErrorAndShake(message: string) {
    setError(message);
    setShakeKey((k) => k + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorAndShake("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorAndShake("Invalid email format");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorAndShake(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch {
      setErrorAndShake("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[75vh] flex flex-col justify-center py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 w-full">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <AnimatedSection delay={0} className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-[24px] btn-primary-gradient flex items-center justify-center shrink-0">
              <Image
                src="/logo.svg"
                alt=""
                width={44}
                height={48}
                className="w-11 h-12"
                aria-hidden
              />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0}>
            <span className="text-overline leading-overline tracking-overline font-semibold uppercase text-accent-blue-text">
              Anime Tracking Reimagined
            </span>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <Typography variant="display" className="text-balance">
              Track every anime. Never miss an episode.
            </Typography>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <Typography variant="body" className="text-text-secondary text-balance">
              One place to follow your watchlist, get release alerts, and discover what to watch next.
            </Typography>
          </AnimatedSection>
          <AnimatedSection delay={0.3} className="w-full max-w-md">
            <div id="early-access" className="w-full">
              {success ? (
                <div className="flex items-center justify-between w-full h-10 bg-green-950 border border-green-400/20 rounded-lg px-4">
                  <span className="text-body-sm text-green-400 font-medium">
                    You&apos;re on the list!
                  </span>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    aria-label="Close"
                    className="shrink-0 p-1 -m-1 rounded hover:bg-green-900/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-green-950"
                  >
                    <Image
                      src="/icons/xmark.svg"
                      alt=""
                      width={16}
                      height={16}
                      aria-hidden
                    />
                  </button>
                </div>
              ) : (
                <form
                  className="flex flex-col sm:flex-row gap-3 w-full"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <motion.div
                    key={shakeKey}
                    className="flex-1 min-w-0 flex flex-col"
                    animate={
                      error && !prefersReducedMotion
                        ? { x: [0, -6, 6, -4, 4, -2, 2, 0] }
                        : { x: 0 }
                    }
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.4,
                      ease: "easeInOut",
                    }}
                  >
                    <Input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="Enter your email…"
                      spellCheck={false}
                      className="w-full"
                      aria-label="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                    {error && (
                      <p
                        className="mt-1.5 text-left text-[12px] text-red-400"
                        role="alert"
                      >
                        {error}
                      </p>
                    )}
                  </motion.div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="shrink-0"
                    disabled={loading}
                  >
                    {loading ? "Joining…" : "Get early access"}
                  </Button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
