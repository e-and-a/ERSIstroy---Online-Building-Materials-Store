"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme =
      stored === "dark" || stored === "light" ? (stored as Theme) : prefersDark ? "dark" : "light";

    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  function handleToggle() {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
      return next;
    });
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label="Переключить тему"
      className="theme-toggle h-10 w-10 rounded-full border border-[var(--border)] bg-[var(--card)] text-base shadow-sm hover:border-slate-300 hover:bg-white dark:hover:bg-slate-800"
      onClick={handleToggle}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </Button>
  );
}
