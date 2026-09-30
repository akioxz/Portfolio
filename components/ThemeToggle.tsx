"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 rounded-full border border-slate/10 bg-transparent h-10 w-[104px]"></div>
    );
  }

  const handleToggle = (newTheme: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isSwitching || theme === newTheme) {
      if (theme !== newTheme) setTheme(newTheme);
      return;
    }

    setIsSwitching(true);
    const root = document.documentElement;
    const documentWithTransition = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };

    if (typeof documentWithTransition.startViewTransition === "function") {
      const button = e.currentTarget;
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
        setTheme(newTheme);
      });
    } else {
      setTheme(newTheme);
    }

    window.setTimeout(() => {
      setIsSwitching(false);
    }, 440);
  };

  return (
    <div className="flex items-center gap-1 p-1 rounded-full border border-slate/20 dark:border-white/10 bg-transparent w-fit">
      <button
        onClick={(e) => handleToggle("system", e)}
        aria-busy={isSwitching}
        aria-label="System theme"
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
          theme === "system"
            ? "bg-slate/10 dark:bg-white/10 text-neutral-900 dark:text-cream"
            : "text-slate/50 hover:text-neutral-900 dark:hover:text-cream"
        }`}
        title="System theme"
      >
        <FiMonitor className="w-3.5 h-3.5" />
      </button>
      
      <button
        onClick={(e) => handleToggle("light", e)}
        aria-busy={isSwitching}
        aria-label="Light theme"
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
          theme === "light"
            ? "bg-slate/10 dark:bg-white/10 text-neutral-900 dark:text-cream"
            : "text-slate/50 hover:text-neutral-900 dark:hover:text-cream"
        }`}
        title="Light theme"
      >
        <FiSun className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={(e) => handleToggle("dark", e)}
        aria-busy={isSwitching}
        aria-label="Dark theme"
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
          theme === "dark"
            ? "bg-slate/10 dark:bg-white/10 text-neutral-900 dark:text-cream"
            : "text-slate/50 hover:text-neutral-900 dark:hover:text-cream"
        }`}
        title="Dark theme"
      >
        <FiMoon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
