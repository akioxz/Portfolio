"use client";

import { useState, useRef } from "react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { motion, AnimatePresence } from "motion/react";
import { VscCheck, VscError } from "react-icons/vsc";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const currentTurnstileToken = turnstileRef.current?.getResponse() || turnstileToken;

    if (siteKey && !currentTurnstileToken) {
      setErrorMessage("Please complete the verification below.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, turnstileToken: currentTurnstileToken }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Something went wrong.");
        setIsLoading(false);
        setTurnstileToken(null);
        turnstileRef.current?.reset();
        return;
      }

      setSuccessMessage(data.message || "Your message was received.");
      setIsLoading(false);
      setName("");
      setEmail("");
      setMessage("");
      
      // Reset success message after 5s
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch {
      setErrorMessage("Network error. Try emailing dev.akioxz@gmail.com directly.");
      setIsLoading(false);
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    }
  };

  return (
    <section id="contact" className="w-full flex flex-col items-center justify-center pt-12 sm:pt-24 pb-8 border-t border-black/5 dark:border-white/5 relative">
      <div className="w-full max-w-3xl rounded-2xl border border-black/5 dark:border-white/5 bg-[#fcfcfc] dark:bg-[#050505] p-6 sm:p-12 shadow-sm relative overflow-hidden">
        
        {/* Header */}
        <div className="mb-10">
          <p className="font-sans text-[11px] tracking-widest font-bold text-zinc-400 dark:text-zinc-500 uppercase mb-3">
            Collaboration Inquiry
          </p>
          <h2 className="font-sans text-2xl sm:text-[1.75rem] font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
            tell me about it
          </h2>
          <p className="font-sans text-[15px] text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
            Share the essentials and I'll reply with next steps. The more context you include, the more useful my first response can be.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {successMessage ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-12 flex flex-col items-center justify-center gap-4 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
                <VscCheck className="w-8 h-8" />
              </div>
              <p className="font-sans font-semibold text-neutral-900 dark:text-white text-lg">Inquiry Sent!</p>
              <p className="font-sans text-sm text-zinc-500">I'll get back to you within 24-48 hours.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-8"
            >
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex flex-col gap-2 font-sans">
                  <div className="flex items-start gap-2">
                    <VscError className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="font-sans text-[11px] tracking-widest font-bold text-zinc-500 uppercase">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name" type="text" required disabled={isLoading}
                    value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white font-sans text-base sm:text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-sans text-[11px] tracking-widest font-bold text-zinc-500 uppercase">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email" type="email" required disabled={isLoading}
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white font-sans text-base sm:text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-sans text-[11px] tracking-widest font-bold text-zinc-500 uppercase">
                  Project Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message" required disabled={isLoading}
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="What are you working on, who is it for, and what would a successful outcome look like?"
                  rows={4}
                  className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white font-sans text-base sm:text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors resize-none disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-2">
                <div className="flex flex-col gap-3">
                  {siteKey && (
                    <div className="flex items-start">
                      <Turnstile
                        ref={turnstileRef} siteKey={siteKey}
                        onSuccess={(token) => setTurnstileToken(token)}
                        onError={() => setTurnstileToken(null)} onExpire={() => setTurnstileToken(null)}
                        options={{ theme: "auto" }}
                      />
                    </div>
                  )}
                  <p className="font-sans text-[10px] text-zinc-500 tracking-wide">
                    Prefer email? <a href="mailto:dev.akioxz@gmail.com" className="underline hover:text-neutral-900 dark:hover:text-white transition-colors">dev.akioxz@gmail.com</a>
                  </p>
                </div>
                
                <button
                  type="submit" disabled={isLoading}
                  className="group flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 rounded-xl font-sans text-sm font-semibold hover:opacity-90 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 cursor-pointer w-full sm:w-auto shrink-0"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white dark:border-neutral-900 border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send inquiry</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
