"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export default function SplashController() {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  
  const [splashState, setSplashState] = useState<{
    show: boolean;
    text: string;
  }>({ show: false, text: "" });

  useEffect(() => {
    const current = pathname;
    const prev = prevPathRef.current;

    if (current === "/uses" && prev !== "/uses") {
      // Entering Uses
      setSplashState({ show: true, text: "> INITIALIZING_GEAR_PROFILE..." });
    } else if (prev === "/uses" && current !== "/uses") {
      // Leaving Uses
      setSplashState({ show: true, text: "> UNMOUNTING_DEVICES..." });
    }

    prevPathRef.current = current;
  }, [pathname]);

  // Handle auto-hide
  useEffect(() => {
    if (splashState.show) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        setSplashState({ show: false, text: "" });
        document.body.style.overflow = "";
      }, 800); // Overlay visible time

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
  }, [splashState.show]);

  return (
    <AnimatePresence>
      {splashState.show && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-ink flex flex-col items-center justify-center pointer-events-none"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ delay: 0.4, duration: 0.2 }}
            className="font-pixel text-cream text-lg md:text-xl tracking-widest text-center px-4"
          >
            {splashState.text}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
