"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { VscClose, VscSend, VscCheck, VscError, VscMail } from "react-icons/vsc";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setFieldErrors(null);
      setSuccessMessage(null);
      setIsLoading(false);
      setTurnstileToken(null);
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setFieldErrors(null);

    const currentTurnstileToken =
      turnstileRef.current?.getResponse() || turnstileToken;

    if (siteKey && !currentTurnstileToken) {
      setErrorMessage("Please complete the verification below.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          turnstileToken: currentTurnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.error ||
            "Something went wrong — try emailing me directly at dev.akioxz@gmail.com instead."
        );
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setIsLoading(false);
        setTurnstileToken(null);
        return;
      }

      setSuccessMessage(data.message || "Your message was received.");
      setIsLoading(false);

      setTimeout(() => {
        onClose();
      }, 2500);
    } catch {
      setErrorMessage(
        "Network error occurred — try emailing me directly at dev.akioxz@gmail.com instead."
      );
      setIsLoading(false);
      setTurnstileToken(null);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/85 p-4 sm:p-6 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate/20 bg-surface/95 p-6 shadow-2xl flex flex-col transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate/15 mb-6">
          <div className="flex items-center gap-2">
            <VscSend className="w-4 h-4 text-teal" />
            <h2
              id="contact-modal-title"
              className="font-mono text-sm text-cream font-semibold tracking-wider uppercase"
            >
              Send a Message
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-full border border-slate/20 bg-surface text-slate hover:text-cream hover:border-slate/40 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <VscClose className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {successMessage ? (
          <AnimatePresence mode="wait">
            <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
              <motion.svg
                viewBox="0 0 160 100"
                aria-hidden="true"
                className="mb-2 h-24 w-36 text-teal"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              >
                <rect
                  x="10"
                  y="25"
                  width="140"
                  height="65"
                  rx="8"
                  fill="currentColor"
                  fillOpacity="0.08"
                  stroke="currentColor"
                  strokeOpacity="0.45"
                  strokeWidth="2"
                />
                <motion.path
                  d="M10 29 L80 67 L150 29"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.75"
                  strokeWidth="2"
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 1, transform: "rotate(0deg)" }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : {
                          opacity: 1,
                          transform: "rotate(7deg)",
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { delay: 0.4, duration: 0.15, ease: [0.23, 1, 0.32, 1] }
                  }
                  style={{ transformOrigin: "80px 29px" }}
                />
                <motion.path
                  d="M31 8 H129 V43 H31 Z"
                  fill="rgb(var(--surface))"
                  stroke="currentColor"
                  strokeOpacity="0.65"
                  strokeWidth="2"
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 1,
                          transform: "translate(0px, 0px) scale(0.96)",
                        }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : {
                          opacity: 0,
                          transform: "translate(0px, 30px) scale(0.88)",
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.4, ease: [0.77, 0, 0.175, 1] }
                  }
                  style={{ transformOrigin: "80px 38px" }}
                />
                <motion.path
                  d="M10 25 L80 65 L150 25"
                  fill="rgb(var(--surface))"
                  stroke="currentColor"
                  strokeOpacity="0.75"
                  strokeWidth="2"
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 1, transform: "rotate(0deg)" }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : {
                          opacity: 1,
                          transform: "rotate(7deg)",
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { delay: 0.4, duration: 0.15, ease: [0.23, 1, 0.32, 1] }
                  }
                  style={{ transformOrigin: "80px 25px" }}
                />
              </motion.svg>
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, transform: "translateY(8px)" }
                }
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : {
                        delay: 0.58,
                        duration: 0.22,
                        ease: [0.23, 1, 0.32, 1],
                      }
                }
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-teal/30 bg-teal/10 text-teal">
                  <VscCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-mono text-base font-semibold text-cream">
                  Message Received
                </h3>
                <p className="mx-auto mt-1 max-w-sm font-sans text-sm leading-relaxed text-slate">
                  {successMessage}
                </p>
              </motion.div>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-md font-mono text-xs text-slate border border-slate/20 hover:text-cream hover:border-slate/40 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </AnimatePresence>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-md bg-amber/10 border border-amber/30 text-amber text-xs flex flex-col gap-1.5 font-sans">
                <div className="flex items-start gap-2">
                  <VscError className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
                {errorMessage.includes("emailing me directly") && (
                  <a
                    href="mailto:dev.akioxz@gmail.com"
                    className="flex items-center gap-1.5 font-mono text-xs text-teal underline font-medium pl-6 hover:text-cream transition-colors"
                  >
                    <VscMail className="w-3.5 h-3.5" />
                    <span>Email dev.akioxz@gmail.com</span>
                  </a>
                )}
              </div>
            )}

            {/* Name Input */}
            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="contact-name"
                className="font-mono text-xs text-slate uppercase tracking-wider"
              >
                Name <span className="text-amber">*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                disabled={isLoading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-ink/70 border border-slate/20 rounded-md px-3 py-2 text-cream font-sans text-sm focus:outline-none focus:border-teal transition-colors disabled:opacity-50"
              />
              {fieldErrors?.name && (
                <span className="font-mono text-[10px] text-amber">
                  {fieldErrors.name[0]}
                </span>
              )}
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="contact-email"
                className="font-mono text-xs text-slate uppercase tracking-wider"
              >
                Email <span className="text-amber">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-ink/70 border border-slate/20 rounded-md px-3 py-2 text-cream font-sans text-sm focus:outline-none focus:border-teal transition-colors disabled:opacity-50"
              />
              {fieldErrors?.email && (
                <span className="font-mono text-[10px] text-amber">
                  {fieldErrors.email[0]}
                </span>
              )}
            </div>

            {/* Message Input */}
            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="contact-message"
                className="font-mono text-xs text-slate uppercase tracking-wider"
              >
                Message <span className="text-amber">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                disabled={isLoading}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi Axel, I'd like to collaborate on..."
                className="w-full bg-ink/70 border border-slate/20 rounded-md px-3 py-2 text-cream font-sans text-sm focus:outline-none focus:border-teal transition-colors resize-none disabled:opacity-50"
              />
              {fieldErrors?.message && (
                <span className="font-mono text-[10px] text-amber">
                  {fieldErrors.message[0]}
                </span>
              )}
            </div>

            {/* Cloudflare Turnstile Widget */}
            {siteKey && (
              <div className="my-1 flex justify-center">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={siteKey}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setTurnstileToken(null)}
                  onExpire={() => setTurnstileToken(null)}
                  options={{ theme: "dark" }}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 group flex items-center justify-center gap-2 bg-cream text-ink px-4 py-2.5 rounded-md font-mono text-xs font-semibold hover:bg-cream/90 transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <VscSend className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
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
