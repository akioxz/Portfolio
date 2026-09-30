"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

export default function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle Keyboard Shortcut (Alt+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && e.altKey) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // For now, let's just close it or route somewhere. 
    // You can hook this up to your actual AI backend later.
    console.log("Asking AI:", query);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col justify-center pl-[clamp(1.5rem,9vw,8rem)] pr-6 bg-white/80 dark:bg-[#0c0c0c]/85 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="w-full max-w-[760px] flex flex-col gap-6">
            <motion.h2 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[clamp(1.9rem,5.5vw,3.4rem)] leading-[1.05] text-neutral-900 dark:text-cream tracking-tight font-normal lowercase"
            >
              what do you want to ask?
            </motion.h2>
            
            <motion.form 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSubmit}
              className="relative w-full"
            >
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent font-mono text-[clamp(1.9rem,5.5vw,3.4rem)] leading-[1.05] text-neutral-900 dark:text-cream outline-none placeholder:text-transparent caret-neutral-900 dark:caret-cream font-normal lowercase"
                spellCheck={false}
                autoComplete="off"
              />
            </motion.form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
