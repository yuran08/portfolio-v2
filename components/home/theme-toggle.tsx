"use client";
import { Moon, Sun } from "lucide-react";
import { useThemeTransition } from "@/components/home/use-theme-transition";

export default function ThemeToggle() {
  const { canRender, resolvedTheme, onToggle, ariaLabel } = useThemeTransition();

  if (!canRender || !resolvedTheme) return null;

  return (
    <header className="absolute top-4 right-4 z-10">
      <button
        onClick={onToggle}
        className="h-10 w-10 cursor-pointer rounded-full"
        aria-label={ariaLabel}
      >
        {resolvedTheme === "dark" ? (
          <Sun className="h-6 w-6" />
        ) : (
          <Moon className="h-6 w-6" />
        )}
      </button>
    </header>
  );
}
