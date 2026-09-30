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
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
        >
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="block font-pixel text-cream text-2xl md:text-3xl tracking-[0.2em] select-none"
            >
              {text}
            </motion.span>
          </div>

          {/* Minimalist 1px progress line */}
          <motion.div 
            className="absolute bottom-12 left-1/2 -translate-x-1/2 h-[1px] w-24 md:w-32 bg-white/10 overflow-hidden"
          >
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: (holdDuration - 200) / 1000, ease: "linear" }}
              className="h-full w-full bg-cream"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

