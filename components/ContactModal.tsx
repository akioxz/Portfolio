"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Turnstile } from "@marsidev/react-turnstile";
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

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

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

    if (siteKey && !turnstileToken) {
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
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.error ||
            "Something went wrong — try emailing me directly at dev.akioxz@gmail.com instead."
        );
        setIsLoading(false);
        setTurnstileToken(null);
        return;
      }

      setSuccessMessage(data.message || "Message sent! I'll get back to you soon.");
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
          <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center text-teal mb-2">
              <VscCheck className="w-6 h-6" />
            </div>
            <h3 className="font-mono text-base font-semibold text-cream">
              Message Received
            </h3>
            <p className="text-slate text-sm max-w-sm leading-relaxed font-sans">
              {successMessage}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-4 py-2 rounded-md font-mono text-xs text-slate border border-slate/20 hover:text-cream hover:border-slate/40 transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
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
            </div>

            {/* Cloudflare Turnstile Widget */}
            {siteKey && (
              <div className="my-1 flex justify-center">
                <Turnstile
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
