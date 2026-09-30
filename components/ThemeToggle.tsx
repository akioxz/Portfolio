"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@wrksz/themes/client";
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

  const handleToggle = (newTheme: "light" | "dark" | "system", e: React.MouseEvent<HTMLButtonElement>) => {
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
    <div className="flex items-center gap-[1px] p-[2px] rounded-full border border-slate/15 dark:border-white/10 bg-transparent w-fit">
      <button
        onClick={(e) => handleToggle("system", e)}
        aria-busy={isSwitching}
        aria-label="System theme"
        className={`flex items-center justify-center w-[1.35rem] h-[1.35rem] rounded-full transition-all duration-200 ${
          theme === "system"
            ? "bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-cream"
            : "text-neutral-400 dark:text-white/30 hover:text-neutral-900 dark:hover:text-cream"
        }`}
        title="System theme"
      >
        <FiMonitor style={{ width: 13, height: 13 }} />
      </button>
      
      <button
        onClick={(e) => handleToggle("light", e)}
        aria-busy={isSwitching}
        aria-label="Light theme"
        className={`flex items-center justify-center w-[1.35rem] h-[1.35rem] rounded-full transition-all duration-200 ${
          theme === "light"
            ? "bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-cream"
            : "text-neutral-400 dark:text-white/30 hover:text-neutral-900 dark:hover:text-cream"
        }`}
        title="Light theme"
      >
        <FiSun style={{ width: 13, height: 13 }} />
      </button>

      <button
        onClick={(e) => handleToggle("dark", e)}
        aria-busy={isSwitching}
        aria-label="Dark theme"
        className={`flex items-center justify-center w-[1.35rem] h-[1.35rem] rounded-full transition-all duration-200 ${
          theme === "dark"
            ? "bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-cream"
            : "text-neutral-400 dark:text-white/30 hover:text-neutral-900 dark:hover:text-cream"
        }`}
        title="Dark theme"
      >
        <FiMoon style={{ width: 13, height: 13 }} />
      </button>
    </div>
  );
}
