"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  const isDark = theme === "dark";

  const handleToggle = () => {
    if (isSwitching) return;

    setIsSwitching(true);
    const root = document.documentElement;
    const documentWithTransition = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };
    const button = buttonRef.current;

    if (
      typeof documentWithTransition.startViewTransition === "function" &&
      button
    ) {
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      root.style.setProperty("--theme-reveal-x", `${x}px`);
      root.style.setProperty("--theme-reveal-y", `${y}px`);
      root.style.setProperty("--theme-reveal-radius", `${radius}px`);

      documentWithTransition.startViewTransition(() => {
        setTheme(isDark ? "light" : "dark");
      });
    } else {
      setTheme(isDark ? "light" : "dark");
    }

    window.setTimeout(() => {
      setIsSwitching(false);
    }, 380);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      aria-busy={isSwitching}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center justify-center w-8 h-8 text-slate hover:text-teal transition-colors"
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
    </button>
  );
}
