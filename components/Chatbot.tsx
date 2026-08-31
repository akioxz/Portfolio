"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

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
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
              transition: { duration: 0.2 },
            }}
            className="w-[calc(100vw-3rem)] sm:w-[340px] mb-4 bg-surface/95 backdrop-blur-md border border-slate/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "450px", maxHeight: "calc(100vh - 120px)" }}
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
                className="text-slate hover:text-cream transition-colors cursor-pointer"
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
                      className="text-left bg-surface/50 border border-slate/15 text-slate hover:text-teal hover:border-teal/30 px-3 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer"
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
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about my projects..."
                  className="w-full bg-surface border border-slate/20 rounded-full pl-4 pr-10 py-2.5 text-sm text-cream focus:outline-none focus:border-teal transition-colors"
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
        className="relative flex items-center justify-center w-14 h-14 bg-teal rounded-full shadow-[0_0_20px_rgba(var(--teal),0.3)] hover:scale-105 transition-transform duration-300 z-10 cursor-pointer"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <VscClose className="w-6 h-6 text-ink" />
        ) : (
          <>
            <span className="absolute inset-0 rounded-full animate-ping bg-teal opacity-40"></span>
            <VscComment className="w-6 h-6 text-ink" />
          </>
        )}
      </button>
    </div>
  );
}
