"use client";

import { useState, useRef, useEffect } from "react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { motion, AnimatePresence } from "motion/react";
import { VscCheck, VscError } from "react-icons/vsc";
import Magnetic from "@/components/Magnetic";
import WorldMap from "@/components/WorldMap";
import BackLink from "@/components/BackLink";

const PROJECT_TYPES = [
  "Web Application",
  "Landing Page",
  "MVP / Prototype",
  "Full-Stack Dev",
  "Consulting",
];

const BUDGET_RANGES = [
  { label: "< $5,000", value: "<$5k" },
  { label: "$5,000 – $10,000", value: "$5k-$10k" },
  { label: "$10,000 – $25,000", value: "$10k-$25k" },
  { label: "$25,000+", value: "$25k+" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [campaign, setCampaign] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [details, setDetails] = useState("");
  
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Live Cabanatuan City Local Time Ticker (PHT / UTC+8)
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);
      setTimeString(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

    const compiledMessage = `
**Company:** ${company || "N/A"}
**Campaign/Project:** ${campaign}
**Budget Range:** ${budget || "N/A"}
**Ideal Timeline:** ${timeline || "N/A"}

**Project Details:**
${details}
`.trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          message: compiledMessage, 
          turnstileToken: currentTurnstileToken 
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Something went wrong.");
        setIsLoading(false);
        setTurnstileToken(null);
        turnstileRef.current?.reset();
        return;
      }

      setSuccessMessage(data.message || "Inquiry sent successfully.");
      setName("");
      setEmail("");
      setCompany("");
      setCampaign("");
      setBudget("");
      setTimeline("");
      setDetails("");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-start relative z-10 overflow-x-hidden bg-white dark:bg-[#000000]">
      
      <div className="w-full max-w-[800px]">
        <BackLink />
      </div>

      {/* HEADER SECTION (Strict Left-Aligned Stacked) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[800px] flex flex-col items-start text-left mb-10"
      >
        <h1 className="font-pixel text-2xl leading-none text-neutral-900 dark:text-white mb-6">
          contact
        </h1>
        <p className="text-neutral-500 dark:text-[#888] text-[13px] sm:text-[14px] font-sans font-light leading-relaxed max-w-[500px]">
          Scalable web applications fast. From pixel-perfect frontends to secure, high-performance backends.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-[800px] relative flex flex-col items-center mb-10 text-neutral-800 dark:text-neutral-200"
      >
        <div className="w-full mx-auto">
          <WorldMap className="w-full h-auto aspect-[146/68]" />
        </div>

        {/* CABANATUAN CITY COORDINATES & TIME TELEMETRY (Plain Text, Centered) */}
        <div className="w-full mt-3 flex flex-col items-center justify-center text-center gap-1 text-[11px] sm:text-[12px] font-mono text-neutral-400 dark:text-neutral-500 select-none">
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-neutral-700 dark:text-neutral-300">
              15°29&apos;N, 120°58&apos;E
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="text-neutral-500 dark:text-neutral-400">
              Cabanatuan City, PH
            </span>
          </div>

          <div className="tabular-nums text-neutral-400 dark:text-neutral-500 text-[10px] sm:text-[11px]">
            {timeString ? `${timeString} PHT` : "04:00 AM PHT"}{" "}
            <span>(UTC+8)</span>
          </div>
        </div>
      </motion.div>

      {/* FORM SECTION (Widened for better proportions and alignment) */}
      <div className="w-full max-w-[800px] flex flex-col items-center">
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full overflow-hidden rounded-2xl border border-black/10 dark:border-[#222] bg-neutral-50 dark:bg-[#0c0c0c] relative z-20"
        >
          {/* Header Block inside Card */}
          <div className="border-b border-black/10 dark:border-[#222] bg-neutral-100 dark:bg-[#141414] px-6 py-6 sm:px-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h2 className="text-xl font-sans font-normal text-neutral-900 dark:text-white tracking-tight">
                  tell me about it
                </h2>
                <p className="mt-2 max-w-xl text-[13px] font-sans font-light leading-relaxed text-neutral-500 dark:text-[#888]">
                  Let&apos;s build something great. Share your project essentials, tech stack, and timeline, and I&apos;ll follow up with the next steps.
                </p>
              </div>
              <svg aria-hidden="true" className="mt-1 h-8 w-8 shrink-0 text-neutral-500 dark:text-[#444]" viewBox="0 0 32 32" fill="none">
                <path d="M5 8.5h22v15H14l-6 5v-5H5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M10 13h12M10 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Form Block */}
          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              
              {/* Name Field */}
              <div className="col-span-1">
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-[#666]">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full min-h-[44px] rounded-lg border border-black/10 dark:border-[#222] bg-white dark:bg-[#050505] px-3.5 py-2.5 text-base sm:text-[13px] font-sans font-light text-neutral-900 dark:text-white outline-none transition placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400/20 dark:focus:ring-neutral-500/20"
                />
              </div>

              {/* Email Field */}
              <div className="col-span-1">
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-[#666]">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full min-h-[44px] rounded-lg border border-black/10 dark:border-[#222] bg-white dark:bg-[#050505] px-3.5 py-2.5 text-base sm:text-[13px] font-sans font-light text-neutral-900 dark:text-white outline-none transition placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400/20 dark:focus:ring-neutral-500/20"
                />
              </div>

              {/* Company Field */}
              <div className="col-span-1">
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-[#666]">
                  Company / Organization
                </label>
                <input
                  type="text"
                  autoComplete="organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Optional"
                  className="w-full min-h-[44px] rounded-lg border border-black/10 dark:border-[#222] bg-white dark:bg-[#050505] px-3.5 py-2.5 text-base sm:text-[13px] font-sans font-light text-neutral-900 dark:text-white outline-none transition placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400/20 dark:focus:ring-neutral-500/20"
                />
              </div>

              {/* Ideal Timeline Field */}
              <div className="col-span-1">
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-[#666]">
                  Ideal Timeline
                </label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g. Next month, Q4, Flexible"
                  className="w-full min-h-[44px] rounded-lg border border-black/10 dark:border-[#222] bg-white dark:bg-[#050505] px-3.5 py-2.5 text-base sm:text-[13px] font-sans font-light text-neutral-900 dark:text-white outline-none transition placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400/20 dark:focus:ring-neutral-500/20"
                />
              </div>

              {/* Campaign / Project Field with Quick Suggested Chips */}
              <div className="col-span-full">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-[#666]">
                    Campaign or Project <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 hidden sm:inline">
                    Tap a suggestion or type your own
                  </span>
                </div>
                <input
                  required
                  type="text"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="e.g. Next.js SaaS, Mobile App MVP, Full-Stack Redesign"
                  className="w-full min-h-[44px] rounded-lg border border-black/10 dark:border-[#222] bg-white dark:bg-[#050505] px-3.5 py-2.5 text-base sm:text-[13px] font-sans font-light text-neutral-900 dark:text-white outline-none transition placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400/20 dark:focus:ring-neutral-500/20"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {PROJECT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCampaign(type)}
                      className={`text-[11px] font-sans px-2.5 py-1 rounded-md border transition cursor-pointer active:scale-95 ${
                        campaign === type
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-black border-neutral-900 dark:border-white font-medium"
                          : "bg-white dark:bg-[#111] text-neutral-600 dark:text-neutral-400 border-black/10 dark:border-[#222] hover:border-neutral-400 dark:hover:border-neutral-500"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tactile Budget Range Selector Pills + Custom Type Input */}
              <div className="col-span-full">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-[#666]">
                    Budget Range (USD)
                  </label>
                  {budget && (
                    <button
                      type="button"
                      onClick={() => setBudget("")}
                      className="text-[10px] font-mono text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Preset Bracket Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5">
                  {BUDGET_RANGES.map((range) => {
                    const isSelected = budget === range.value;
                    return (
                      <button
                        key={range.value}
                        type="button"
                        onClick={() => setBudget(isSelected ? "" : range.value)}
                        className={`min-h-[44px] px-3 py-2.5 rounded-lg text-[12px] font-sans transition-all text-center border flex items-center justify-center active:scale-[0.98] cursor-pointer ${
                          isSelected
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-black border-neutral-900 dark:border-white font-medium shadow-sm"
                            : "bg-white dark:bg-[#050505] text-neutral-700 dark:text-neutral-300 border-black/10 dark:border-[#222] hover:bg-neutral-50 dark:hover:bg-[#111] hover:border-neutral-300 dark:hover:border-[#333]"
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Budget Text Input */}
                <input
                  type="text"
                  value={BUDGET_RANGES.some((r) => r.value === budget) ? "" : budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Or type custom budget (e.g. $7,500, flexible, equity, monthly)"
                  className="w-full min-h-[44px] rounded-lg border border-black/10 dark:border-[#222] bg-white dark:bg-[#050505] px-3.5 py-2.5 text-base sm:text-[13px] font-sans font-light text-neutral-900 dark:text-white outline-none transition placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400/20 dark:focus:ring-neutral-500/20"
                />
              </div>

              {/* Project Details */}
              <div className="col-span-full">
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-[#666]">
                  Project Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="What are you working on, who is it for, and what would a successful outcome look like?"
                  rows={4}
                  className="w-full min-h-[110px] rounded-lg border border-black/10 dark:border-[#222] bg-white dark:bg-[#050505] px-3.5 py-2.5 text-base sm:text-[13px] font-sans font-light text-neutral-900 dark:text-white outline-none transition placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400/20 dark:focus:ring-neutral-500/20 resize-y"
                />
              </div>

              <div className="col-span-full">
                <p className="text-neutral-500 dark:text-[#555] text-[11px] font-sans font-light leading-relaxed">
                  Please don't include passwords, API keys, or other sensitive information.
                </p>
              </div>

              <div className="col-span-full">
                <AnimatePresence>
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-[13px] flex items-center gap-2 overflow-hidden mb-4"
                    >
                      <VscError className="w-4 h-4 shrink-0" />
                      <p>{errorMessage}</p>
                    </motion.div>
                  )}
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-lg text-[13px] flex items-center gap-2 overflow-hidden mb-4"
                    >
                      <VscCheck className="w-4 h-4 shrink-0" />
                      <p>{successMessage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {siteKey && !successMessage && (
                <div className="col-span-full flex justify-center sm:justify-start">
                  <Turnstile
                    siteKey={siteKey}
                    ref={turnstileRef}
                    onSuccess={(token) => setTurnstileToken(token)}
                    options={{ theme: "auto", appearance: "interaction-only" }}
                  />
                </div>
              )}

              {/* FOOTER ROW */}
              <div className="col-span-full pt-4 mt-2 border-t border-black/5 dark:border-[#1a1a1a]">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <p className="text-[12px] text-neutral-500 dark:text-[#666] font-sans font-light">
                    Prefer email? <a href="mailto:dev.akioxz@gmail.com" className="font-medium text-neutral-600 dark:text-[#ccc] hover:text-neutral-900 dark:hover:text-white transition">dev.akioxz@gmail.com</a>
                  </p>
                  
                  <Magnetic>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2 rounded-lg bg-neutral-900 dark:bg-white px-6 py-2.5 text-[13px] font-sans font-medium text-white dark:text-black transition hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      <span>{isLoading ? "Sending..." : "Send inquiry"}</span>
                      {!isLoading && (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5">
                          <path d="M3.33331 8H12.6666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 3.33331L12.6667 7.99998L8 12.6666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </Magnetic>
                </div>
              </div>

            </form>
          </div>
        </motion.section>

      </div>
    </main>
  );
}