"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

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
    document.documentElement.style.setProperty(
      "--theme-transition-color",
      isDark ? "rgb(0 0 0)" : "rgb(255 255 255)",
    );
    document.documentElement.classList.add("theme-switching");
    setTheme(isDark ? "light" : "dark");
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-switching");
      setIsSwitching(false);
    }, 260);
  };

  return (
    <button
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
