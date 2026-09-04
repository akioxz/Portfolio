"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { VscComment, VscClose, VscSend, VscRobot } from "react-icons/vsc";
import {
  chatbotKnowledge,
  fallbackResponse,
  suggestedPrompts,
} from "@/data/chatbot-knowledge";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-0",
      sender: "bot",
      text: "Hi! I'm Axel's portfolio bot. What would you like to know?",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  }, [messages, isOpen, prefersReducedMotion]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    inputRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Keyword matching logic
    const lowerInput = text.toLowerCase();
    let bestMatch = null;
    let maxMatches = 0;

    for (const entry of chatbotKnowledge) {
      let matches = 0;
      for (const keyword of entry.keywords) {
        // use regex word boundary if possible, or simple includes
        if (new RegExp(`\\b${keyword}\\b`, "i").test(lowerInput)) {
          matches++;
        } else if (lowerInput.includes(keyword) && keyword.length > 3) {
           // fallback for non-boundary matches for longer keywords
           matches += 0.5;
        }
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = entry;
      }
    }

    const responseText = bestMatch ? bestMatch.response : fallbackResponse;
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      text: responseText,
    };

    // Simulate slight delay for typing indicator feel
    setTimeout(() => {
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  return (
    <div
      data-testid="chatbot-shell"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[100] flex flex-col items-end sm:bottom-6 sm:right-6"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 1 } : {
              opacity: 0,
              y: 20,
              scale: 0.95,
              transition: { duration: 0.2 },
            }}
            transition={prefersReducedMotion ? { duration: 0 } : undefined}
            className="mb-3 flex h-[min(300px,calc(100dvh-9rem))] w-[min(calc(100vw-2rem),320px)] flex-col overflow-hidden rounded-2xl border border-slate/20 bg-surface/95 shadow-2xl backdrop-blur-md sm:mb-4 sm:h-[450px] sm:max-h-[calc(100dvh-120px)] sm:w-[340px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate/15 bg-ink/50">
              <div className="flex items-center gap-2">
                <VscRobot className="w-5 h-5 text-teal" />
                <span className="font-mono text-xs font-semibold tracking-wider text-cream uppercase">
                  Akio 
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 text-slate transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/70"
                aria-label="Close chat"
              >
                <VscClose className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-teal/20 text-cream border border-teal/30 rounded-br-sm"
                        : "bg-slate/10 text-slate border border-slate/15 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Suggestion Chips */}
              {messages.length === 1 && (
                <div className="flex flex-col gap-2 mt-2">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="rounded-lg border border-slate/15 bg-surface/50 px-3 py-2 text-left text-xs font-mono text-slate transition-colors hover:border-teal/30 hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/70"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} className="shrink-0 h-1" />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-slate/15 bg-ink/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="relative flex items-center"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about my projects..."
                  className="w-full rounded-full border border-slate/20 bg-surface py-2.5 pl-4 pr-10 text-sm text-cream transition-colors placeholder:text-slate/70 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 p-1.5 text-slate hover:text-teal disabled:opacity-50 disabled:hover:text-slate transition-colors cursor-pointer"
                  aria-label="Send message"
                >
                  <VscSend className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-teal shadow-[0_0_20px_rgba(var(--teal),0.3)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        aria-label="Toggle chat"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <VscClose className="w-6 h-6 text-ink" />
        ) : (
          <>
            {!prefersReducedMotion && (
              <span className="absolute inset-0 rounded-full animate-ping bg-teal opacity-40"></span>
            )}
            <VscComment className="w-6 h-6 text-ink" />
          </>
        )}
      </button>
    </div>
  );
}
