"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { VscArrowLeft } from "react-icons/vsc";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Glitch / Reveal Animation
    tl.fromTo(
      textRef.current,
      { y: 100, opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
      { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power4.out" }
    )
    .fromTo(
      subRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    )
    .fromTo(
      buttonRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.4"
    );

    // Continuous floating animation
    gsap.to(textRef.current, {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-ink text-neutral-900 dark:text-cream relative overflow-hidden"
    >
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="z-10 flex flex-col items-center text-center px-4">
        <h1 
          ref={textRef}
          className="text-8xl md:text-[10rem] font-mono font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-neutral-800 to-neutral-400 dark:from-cream dark:to-neutral-600 drop-shadow-sm mb-6"
        >
          404
        </h1>
        
        <p 
          ref={subRef}
          className="text-lg md:text-xl font-mono text-slate mb-12 max-w-md"
        >
          Signal lost. The coordinate you're looking for doesn't exist in this sector.
        </p>

        <Link 
          ref={buttonRef}
          href="/"
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 dark:bg-cream text-white dark:text-ink rounded-full font-mono text-sm uppercase tracking-widest font-medium overflow-hidden transition-transform hover:scale-105 active:scale-95"
          data-magnetic
        >
          <span className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <VscArrowLeft className="w-4 h-4 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="relative z-10">Return to Base</span>
        </Link>
      </div>
    </div>
  );
}
