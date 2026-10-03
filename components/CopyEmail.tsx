"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function CopyEmail({ 
  email = "dev.akioxz@gmail.com",
  className = "font-medium text-neutral-600 dark:text-[#ccc] hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
}: { 
  email?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button 
      type="button" 
      onClick={handleCopy} 
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-emerald-500 dark:text-emerald-400 font-mono text-[11px] tracking-wider"
          >
            COPIED! ✓
          </motion.span>
        ) : (
          <motion.span
            key="email"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {email}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
