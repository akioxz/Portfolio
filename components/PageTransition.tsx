"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

export default function PageTransition() {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = (e: CustomEvent) => {
      const targetHref = e.detail.href;
      
      // If we are already on that page, ignore
      if (pathname === targetHref) return;

      setIsActive(true);

      // Allow the frosted glass to fully cover the screen (approx 500ms)
      // before telling Next.js to start loading the new route.
      setTimeout(() => {
        router.push(targetHref);
      }, 500);
    };

    window.addEventListener("page-transition-start", handleStart as EventListener);
    return () => window.removeEventListener("page-transition-start", handleStart as EventListener);
  }, [pathname, router]);

  // Once the route actually changes (meaning Next.js finished fetching the server component),
  // we remove the active state to slide the glass out.
  useEffect(() => {
    if (isActive) {
      // Add a tiny 100ms buffer to allow the browser to paint the new DOM nodes
      // before we pull the curtain away.
      const timer = setTimeout(() => {
        setIsActive(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1], // Cinematic Apple-grade easing
          }}
          // Ethereal glass effect: heavily blurred, semi-transparent, with subtle borders
          className="fixed inset-0 z-[99998] pointer-events-none bg-white/40 dark:bg-[#0c0c0c]/60 backdrop-blur-3xl shadow-2xl border-l border-r border-black/5 dark:border-white/10"
        />
      )}
    </AnimatePresence>
  );
}
