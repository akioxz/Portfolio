"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@wrksz/themes/client";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-[1px] p-[2px] rounded-full border border-slate/15 dark:border-white/10 bg-transparent h-[27px] w-[86px]"></div>
    );
  }

  const options = [
    { id: "system", icon: FiMonitor, label: "System theme" },
    { id: "light", icon: FiSun, label: "Light theme" },
    { id: "dark", icon: FiMoon, label: "Dark theme" },
  ] as const;

  return (
    <div className="flex items-center gap-[1px] p-[2px] rounded-full border border-slate/15 dark:border-white/10 bg-transparent w-fit relative">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.id;
        
        return (
          <button
            key={option.id}
            onClick={() => { if (!isActive) window.dispatchEvent(new CustomEvent('theme-transition-start', { detail: { theme: option.id } })); }}
            aria-label={option.label}
            title={option.label}
            className={`relative flex items-center justify-center w-[1.35rem] h-[1.35rem] rounded-full transition-colors duration-200 z-10 ${
              isActive
                ? "text-neutral-900 dark:text-cream"
                : "text-neutral-400 dark:text-white/30 hover:text-neutral-900 dark:hover:text-cream"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="theme-pill"
                className="absolute inset-0 bg-neutral-100 dark:bg-white/10 rounded-full -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
            )}
            <Icon style={{ width: 13, height: 13 }} />
          </button>
        );
      })}
    </div>
  );
}
