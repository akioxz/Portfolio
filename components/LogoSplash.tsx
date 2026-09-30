"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LogoSplashProps {
  onComplete?: () => void;
  holdDuration?: number;
}

export default function LogoSplash({
  onComplete,
  holdDuration = 1400, // A bit longer to appreciate the scramble
}: LogoSplashProps) {
  const [visible, setVisible] = useState(true);
  const [text, setText] = useState("____");

  // Scramble effect
  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("splashShown")) {
      setVisible(false);
      if (onComplete) onComplete();
      return;
    }

    const target = "AXEL";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%*";
    let iterations = 0;

    const interval = setInterval(() => {
      setText(target.split("").map((letter, index) => {
        if (index < iterations) return target[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));

      if (iterations >= target.length) clearInterval(interval);
      iterations += 1 / 3; // speed of decipher
    }, 40);

    const holdTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("splashShown", "true");
      if (onComplete) {
        setTimeout(onComplete, 800); // Wait for slide up animation
      }
    }, holdDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(holdTimer);
    };
  }, [holdDuration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="logo-splash"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.85, 0, 0.15, 1] }} // Apple Spring / Cinematic ease
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
        >
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "100%", letterSpacing: "0.8em", opacity: 0, scale: 0.95 }}
              animate={{ y: 0, letterSpacing: "0.2em", opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="block font-pixel text-cream text-3xl md:text-4xl select-none"
            >
              {text}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

