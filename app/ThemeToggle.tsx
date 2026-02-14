"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const root = document.documentElement;
    const current = root.classList.contains("light") ? "light" : "dark";
    setTheme(current);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = theme === "dark" ? "light" : "dark";
    root.classList.remove("dark", "light");
    root.classList.add(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="bg-bg-interactive hover:bg-bg-interactive-hover text-text-primary border border-border-default rounded-lg px-4 py-2 text-body leading-body tracking-body font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
