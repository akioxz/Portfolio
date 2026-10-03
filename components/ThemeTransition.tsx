"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@wrksz/themes/client";

export default function ThemeTransition() {
  const [isActive, setIsActive] = useState(false);
  const [targetTheme, setTargetTheme] = useState<"light" | "dark" | "system" | null>(null);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const handleStart = (e: CustomEvent) => {
      setTargetTheme(e.detail.theme);
      setIsActive(true);

      // Total enter animation: 0.4s duration + (4 * 0.05s) delay = 0.6s
      setTimeout(() => {
        setTheme(e.detail.theme);
        
        // Wait a tiny bit for React to render the new theme under the curtain
        setTimeout(() => {
          setIsActive(false); 
        }, 50);
      }, 600);
    };

    window.addEventListener("theme-transition-start", handleStart as EventListener);
    return () => window.removeEventListener("theme-transition-start", handleStart as EventListener);
  }, [setTheme]);

  const slices = [0, 1, 2, 3, 4];
  const overlayColor = 
    targetTheme === "dark" 
      ? "bg-ink" 
      : targetTheme === "light" 
        ? "bg-white" 
        : "bg-zinc-900"; 

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 z-[99999] pointer-events-none flex">
          {slices.map((i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1.02, originX: 0 }}
              exit={{ scaleX: 0, originX: 1 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.05,
              }}
              className={`flex-1 h-full ${overlayColor}`}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
