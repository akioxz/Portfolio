"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiSearch, FiCommand, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle Keyboard Shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
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

  // Actions
  const handleAction = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("mailto:")) {
      window.location.href = href;
    } else if (href.startsWith("http")) {
      window.open(href, "_blank");
    } else {
      router.push(href);
    }
  };

  const quickLinks = [
    { label: "View Projects", href: "#projects" },
    { label: "View Experience", href: "#experience" },
    { label: "View Stack", href: "#stack" },
    { label: "Send an Email", href: "mailto:dev.akioxz@gmail.com" },
    { label: "GitHub Profile", href: "https://github.com/akioxz" },
    { label: "Admin Login", href: "/admin/login" },
  ];

  const filteredLinks = quickLinks.filter(link => 
    link.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[101] m-auto h-fit w-[90%] max-w-lg rounded-2xl border border-slate/10 dark:border-white/10 bg-white/80 dark:bg-[#111]/80 p-2 shadow-2xl backdrop-blur-2xl"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b border-slate/10 dark:border-white/10 px-3 pb-3 pt-2">
              <FiSearch className="text-slate/40" size={18} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything or search..."
                className="flex-1 bg-transparent text-sm font-medium text-neutral-900 dark:text-cream placeholder:text-slate/40 outline-none"
              />
              <div className="flex items-center gap-1 rounded bg-slate/10 dark:bg-white/10 px-1.5 py-0.5 text-[10px] text-slate/50 font-mono">
                ESC
              </div>
            </div>

            {/* AI Placeholder / Quick Links */}
            <div className="mt-2 max-h-[300px] overflow-y-auto px-2 pb-2">
              {query.length > 0 && filteredLinks.length === 0 ? (
                <div className="flex items-center justify-between rounded-lg px-3 py-3 bg-teal/5 dark:bg-teal/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal/20 text-teal">
                      <FiCommand size={12} />
                    </div>
                    <span className="text-sm font-medium text-neutral-900 dark:text-cream">Ask AI: "{query}"</span>
                  </div>
                  <span className="text-xs text-slate/40 font-mono">Coming Soon</span>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="px-2 pb-1 pt-2 text-[10px] font-mono font-medium tracking-wider text-slate/40 uppercase">
                    Quick Links
                  </div>
                  {filteredLinks.map((link, i) => (
                    <button
                      key={i}
                      onClick={() => handleAction(link.href)}
                      className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate hover:bg-slate/5 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-cream transition-colors text-left"
                    >
                      <span>{link.label}</span>
                      <FiArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate/40" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
