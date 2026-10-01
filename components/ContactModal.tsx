"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { VscClose, VscSend, VscCheck, VscError, VscMail } from "react-icons/vsc";
import { useContactForm } from "@/hooks/useContactForm";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [mounted, setMounted] = useState(false);
  const [showTurnstile, setShowTurnstile] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const {
    name, setName,
    email, setEmail,
    message, setMessage,
    setTurnstileToken,
    turnstileRef,
    isLoading,
    errorMessage,
    fieldErrors,
    successMessage,
    handleSubmit
  } = useContactForm(isOpen, onClose);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setShowTurnstile(true), 300);
      return () => clearTimeout(t);
    } else {
      setShowTurnstile(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 sm:p-6 backdrop-blur-md transform-gpu will-change-opacity"
      style={{ WebkitBackfaceVisibility: "hidden" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#0A0A0A] p-6 shadow-2xl flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <VscSend className="w-5 h-5 text-neutral-900 dark:text-white" />
            <h2 id="contact-modal-title" className="font-sans text-lg text-neutral-900 dark:text-white font-semibold tracking-tight">
              Send a Message
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/5 text-zinc-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/10 transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Close modal"
          >
            <VscClose className="w-5 h-5" />
          </button>
        </div>

        {successMessage ? (
          <AnimatePresence mode="wait">
            <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
              <motion.svg
                viewBox="0 0 160 100"
                aria-hidden="true"
                className="mb-2 h-24 w-36 text-neutral-900 dark:text-white"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              >
                <rect x="10" y="25" width="140" height="65" rx="8" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
                <motion.path
                  d="M10 29 L80 67 L150 29"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.5"
                  strokeWidth="2"
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 1, transform: "rotate(0deg)" }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, transform: "rotate(7deg)" }}
                  transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.4, duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                  style={{ transformOrigin: "80px 29px" }}
                />
                <motion.path
                  d="M31 8 H129 V43 H31 Z"
                  fill="currentColor"
                  className="dark:fill-[#0A0A0A] fill-white"
                  stroke="currentColor"
                  strokeOpacity="0.4"
                  strokeWidth="2"
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 1, transform: "translate(0px, 0px) scale(0.96)" }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, transform: "translate(0px, 30px) scale(0.88)" }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.77, 0, 0.175, 1] }}
                  style={{ transformOrigin: "80px 38px" }}
                />
                <motion.path
                  d="M10 25 L80 65 L150 25"
                  fill="currentColor"
                  className="dark:fill-[#0A0A0A] fill-white"
                  stroke="currentColor"
                  strokeOpacity="0.5"
                  strokeWidth="2"
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 1, transform: "rotate(0deg)" }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, transform: "rotate(7deg)" }}
                  transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.4, duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                  style={{ transformOrigin: "80px 25px" }}
                />
              </motion.svg>
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(8px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.58, duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 text-green-500">
                  <VscCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-sans text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">Message Received</h3>
                <p className="mx-auto mt-2 max-w-sm font-sans text-sm leading-relaxed text-zinc-500">{successMessage}</p>
              </motion.div>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-5 py-2.5 rounded-full font-sans text-sm font-medium text-neutral-900 dark:text-white bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </AnimatePresence>
        ) : (
          <form onSubmit={(e) => handleSubmit(e, siteKey)} className="flex flex-col gap-5">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex flex-col gap-2 font-sans">
                <div className="flex items-start gap-2">
                  <VscError className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
                {errorMessage.includes("emailing me directly") && (
                  <a href="mailto:dev.akioxz@gmail.com" className="flex items-center gap-1.5 font-sans text-sm font-medium underline pl-7 hover:text-neutral-900 dark:hover:text-white transition-colors duration-300">
                    <VscMail className="w-4 h-4" />
                    <span>Email dev.akioxz@gmail.com</span>
                  </a>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2 text-left">
              <label htmlFor="contact-name" className="font-sans text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-name" name="name" type="text" required disabled={isLoading}
                value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                className="w-full bg-neutral-100/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-shadow duration-300 disabled:opacity-50"
              />
              {fieldErrors?.name && <span className="font-sans text-xs text-red-500">{fieldErrors.name[0]}</span>}
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label htmlFor="contact-email" className="font-sans text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-email" name="email" type="email" required disabled={isLoading}
                value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full bg-neutral-100/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-shadow duration-300 disabled:opacity-50"
              />
              {fieldErrors?.email && <span className="font-sans text-xs text-red-500">{fieldErrors.email[0]}</span>}
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label htmlFor="contact-message" className="font-sans text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="contact-message" name="message" required rows={4} disabled={isLoading}
                value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hi Axel, I'd like to collaborate on..."
                className="w-full bg-neutral-100/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-shadow duration-300 resize-none disabled:opacity-50"
              />
              {fieldErrors?.message && <span className="font-sans text-xs text-red-500">{fieldErrors.message[0]}</span>}
            </div>

            {siteKey && showTurnstile && (
              <div className="my-2 flex justify-center">
                <Turnstile
                  ref={turnstileRef} siteKey={siteKey}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setTurnstileToken(null)} onExpire={() => setTurnstileToken(null)}
                  options={{ theme: "auto" }}
                />
              </div>
            )}

            <button type="submit" disabled={isLoading} className="mt-4 group flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-3 rounded-xl font-sans text-sm font-semibold hover:opacity-90 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 cursor-pointer">
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white dark:border-neutral-900 border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <VscSend className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );

}

