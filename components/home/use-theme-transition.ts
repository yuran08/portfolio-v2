"use client";

import { useTheme } from "next-themes";
import { useCallback, useSyncExternalStore } from "react";

type ThemeToggleEvent = React.MouseEvent<HTMLButtonElement>;

function getEndRadius(x: number, y: number) {
  return Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
}

export function useThemeTransition() {
  const { setTheme, resolvedTheme } = useTheme();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const onToggle = useCallback(
    (event: ThemeToggleEvent) => {
      if (!resolvedTheme) return;

      const newTheme = resolvedTheme === "dark" ? "light" : "dark";
      const { clientX: x, clientY: y } = event;

      const supportsViewTransition =
        typeof document.startViewTransition === "function";
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!supportsViewTransition || prefersReducedMotion) {
        setTheme(newTheme);
        return;
      }

      const rootStyle = document.documentElement.style;
      rootStyle.viewTransitionName = "theme-transition";
      rootStyle.setProperty("--clip-x", `${x}px`);
      rootStyle.setProperty("--clip-y", `${y}px`);
      rootStyle.setProperty("--clip-radius-end", `${getEndRadius(x, y)}px`);

      const transition = document.startViewTransition(() => {
        setTheme(newTheme);
      });

      transition.finished.finally(() => {
        rootStyle.removeProperty("--clip-x");
        rootStyle.removeProperty("--clip-y");
        rootStyle.removeProperty("--clip-radius-end");
        rootStyle.viewTransitionName = "";
      });
    },
    [resolvedTheme, setTheme],
  );

  return {
    canRender: isClient && Boolean(resolvedTheme),
    resolvedTheme,
    onToggle,
    ariaLabel:
      resolvedTheme === "dark" ? "切换到亮色模式" : "切换到暗色模式",
  };
}
