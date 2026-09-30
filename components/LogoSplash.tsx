"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LogoSplashProps {
  onComplete?: () => void;
  holdDuration?: number;
}

export default function LogoSplash({
  onComplete,
  holdDuration = 550,
}: LogoSplashProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const holdTimer = setTimeout(() => {
      setVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 400);
      }
    }, holdDuration);
    return () => clearTimeout(holdTimer);
  }, [holdDuration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="logo-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono font-bold text-cream text-2xl tracking-[0.3em] select-none"
          >
            AXEL
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

