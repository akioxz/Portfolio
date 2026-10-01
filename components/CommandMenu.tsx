"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

export default function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
      setAnswer("");
      setIsTyping(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q || isTyping) return;
    
    setAnswer("");
    setIsTyping(true);

    let responseText = "";
    let action: (() => void) | null = null;

    // Simple Command / Keyword Matching
    if (["experience", "work", "job", "history"].some(k => q.includes(k))) {
      responseText = "navigating to experience...";
      action = () => { router.push("/"); setTimeout(() => document.getElementById("experience")?.scrollIntoView({behavior: 'smooth'}), 100) };
    } else if (["projects", "portfolio", "builds"].some(k => q.includes(k))) {
      responseText = "navigating to projects...";
      action = () => { router.push("/"); setTimeout(() => document.getElementById("projects")?.scrollIntoView({behavior: 'smooth'}), 100) };
    } else if (["stack", "skills", "tech"].some(k => q.includes(k))) {
      responseText = "navigating to tech stack...";
      action = () => { router.push("/"); setTimeout(() => document.getElementById("stack")?.scrollIntoView({behavior: 'smooth'}), 100) };
    } else if (["certifications", "certs"].some(k => q.includes(k))) {
      responseText = "navigating to certifications...";
      action = () => { router.push("/"); setTimeout(() => document.getElementById("certifications")?.scrollIntoView({behavior: 'smooth'}), 100) };
    } else if (["uses", "gear", "setup", "equipment"].some(k => q.includes(k))) {
      responseText = "opening my workspace & gear setup...";
      action = () => router.push("/uses");
    } else if (["contact", "email", "message", "chat"].some(k => q.includes(k))) {
      responseText = "opening contact modal...";
      action = () => window.dispatchEvent(new CustomEvent('openContactModal'));
    } else if (["admin", "login"].some(k => q.includes(k))) {
      responseText = "initiating admin protocol...";
      action = () => router.push("/admin/login");
    } else if (q.includes("hire") || q.includes("freelance")) {
      responseText = "i'm open to interesting projects. type 'contact' to send me a message.";
    } else if (q.includes("who are you") || q.includes("about")) {
      responseText = "i am axel villanueva, a full-stack developer specializing in react, next.js, and scalable web apps.";
    } else if (q.includes("hello") || q.includes("hi")) {
      responseText = "hello there. what can i help you find today?";
    } else {
      responseText = "i don't have an automated answer for that yet. try asking about my 'projects', 'stack', 'uses', or 'contact'.";
    }

    // Typewriter effect
    let i = 0;
    const interval = setInterval(() => {
      setAnswer(responseText.slice(0, i + 1));
      i++;
      if (i >= responseText.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (action) {
          setTimeout(() => {
            action();
            setIsOpen(false);
          }, 600);
        }
      }
    }, 25); // typing speed
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
              className="font-pixel text-[clamp(1.9rem,5.5vw,3.4rem)] leading-[1.05] text-neutral-900 dark:text-cream tracking-tight font-normal lowercase"
            >
              what do you want to ask?
            </motion.h2>
            
            <motion.form 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSubmit}
              className="relative w-full flex flex-col gap-4"
            >
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  if (!isTyping) setQuery(e.target.value);
                }}
                disabled={isTyping}
                className="w-full bg-transparent font-pixel text-[clamp(1.9rem,5.5vw,3.4rem)] leading-[1.05] text-neutral-900 dark:text-cream outline-none placeholder:text-transparent caret-neutral-900 dark:caret-cream font-normal lowercase disabled:opacity-50"
                spellCheck={false}
                autoComplete="off"
              />
              
              <AnimatePresence>
                {answer && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="font-mono text-sm md:text-base text-zinc-500 dark:text-zinc-400 lowercase"
                  >
                    {'>'} {answer}
                    {isTyping && <span className="animate-pulse">_</span>}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
