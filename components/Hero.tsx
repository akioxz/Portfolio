"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <motion.section
      id="hero"
      className="mb-12 flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start max-w-4xl pt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left: Stylized Portrait */}
      <div className="shrink-0">
        <div className="relative w-[200px] h-[240px] md:w-[240px] md:h-[300px] rounded-lg overflow-hidden bg-neutral-100 dark:bg-surface/30">
          <Image
            src="/photo1.png"
            alt="Axel Villanueva"
            fill
            priority
            sizes="(max-width: 768px) 200px, 240px"
            className="object-cover grayscale contrast-125 hover:grayscale-0 hover:contrast-100 transition-all duration-700"
          />
        </div>
      </div>

      {/* Right: Typography & Bio */}
      <div className="flex-1 flex flex-col justify-center pt-4 md:pt-2">
        <h1 className="font-mono text-5xl md:text-6xl font-medium text-neutral-900 dark:text-cream mb-8 tracking-tight">
          Axel Villanueva
        </h1>
        
        <div className="flex flex-col gap-6 text-slate dark:text-slate/80 text-sm md:text-base leading-relaxed max-w-lg font-sans">
          <p>
            4th-year IT student building production-grade web &amp; mobile software. Still learning every day {"\u2014"} currently deep into high-performance interfaces and generative AI.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6 font-mono text-xs text-slate">
          <a
            href="https://github.com/akioxz"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 hover:text-neutral-900 dark:hover:text-cream transition-colors"
          >
            github <span className="opacity-50 group-hover:opacity-100 transition-opacity">&#8599;</span>
          </a>
          <a
            href="https://linkedin.com/in/akioxz"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 hover:text-neutral-900 dark:hover:text-cream transition-colors"
          >
            linkedin <span className="opacity-50 group-hover:opacity-100 transition-opacity">&#8599;</span>
          </a>
          <a
            href="mailto:dev.akioxz@gmail.com"
            className="group flex items-center gap-1 hover:text-neutral-900 dark:hover:text-cream transition-colors"
          >
            email <span className="opacity-50 group-hover:opacity-100 transition-opacity">&#8599;</span>
          </a>
        </div>
      </div>
    </motion.section>
  );
}
