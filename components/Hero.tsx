"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <motion.section
      id="hero"
      className="mb-12 flex flex-col md:flex-row gap-12 md:gap-16 items-center md:items-start justify-between min-h-[60vh] pt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left: Stylized Portrait */}
      <div className="w-full md:w-[45%] shrink-0">
        <div className="relative w-full aspect-square md:aspect-[4/5] rounded-lg overflow-hidden bg-neutral-100 dark:bg-surface/30">
          <Image
            src="/photo1.png"
            alt="Axel Villanueva"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover grayscale contrast-125 hover:grayscale-0 hover:contrast-100 transition-all duration-700"
          />
        </div>
      </div>

      {/* Right: Typography & Bio */}
      <div className="w-full md:w-[55%] flex flex-col justify-center md:pt-8">
        <h1 className="font-mono text-5xl md:text-6xl font-medium text-neutral-900 dark:text-cream mb-8 tracking-tight">
          Axel Villanueva
        </h1>
        
        <div className="flex flex-col gap-6 text-slate dark:text-slate/80 text-sm md:text-base leading-relaxed max-w-lg font-sans">
          <p>
            I'm a full-stack engineer and a 4th-year BSIT student. I build modern web & mobile apps, and these days I'm heavily focused on crafting clean, high-performance user interfaces and integrating generative AI.
          </p>
          <p>
            Right now, I'm building cool new stuff every day with React, Node, and Supabase. I love turning rough ideas into scalable software that people actually use.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6 font-mono text-xs text-slate">
          <a
            href="https://github.com/akioxz"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 hover:text-neutral-900 dark:hover:text-cream transition-colors"
          >
            github <span className="opacity-50 group-hover:opacity-100 transition-opacity">?</span>
          </a>
          <a
            href="https://linkedin.com/in/akioxz"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 hover:text-neutral-900 dark:hover:text-cream transition-colors"
          >
            linkedin <span className="opacity-50 group-hover:opacity-100 transition-opacity">?</span>
          </a>
          <a
            href="mailto:dev.akioxz@gmail.com"
            className="group flex items-center gap-1 hover:text-neutral-900 dark:hover:text-cream transition-colors"
          >
            email <span className="opacity-50 group-hover:opacity-100 transition-opacity">?</span>
          </a>
        </div>
      </div>
    </motion.section>
  );
}
