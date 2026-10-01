"use client";

import { motion } from "motion/react";
import SplitText from "./react-bits/SplitText";

export interface ExperienceData {
  id: string;
  year: string;
  role: string;
  project: string;
  subtitle: string;
  description: string;
  tags: string[];
}

export default function Experience({ experience }: { experience: ExperienceData[] }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" className="scroll-mt-24" aria-label="Experience">
      <div className="mb-16">
        
        <SplitText
          text="Experience & Education"
          tag="h2"
          className="text-2xl sm:text-[1.75rem] font-mono text-neutral-900 dark:text-cream tracking-tight"
          splitType="words"
          delay={40}
          duration={0.5}
          from={{ opacity: 0, y: 16 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.2}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-12">
        {/* Education Block (Left) */}
        <div className="w-full lg:w-1/3">
          
          <div className="flex flex-col gap-6">
            <div className="transition-opacity duration-300 hover:opacity-100">
              <p className="font-mono text-[11px] text-slate/60 mb-2">2023 {"\u2014"} Present</p>
              <h3 className="font-mono text-sm text-neutral-900 dark:text-cream font-medium leading-snug">
                B.S. Information Technology
              </h3>
              <p className="text-slate/80 text-sm mt-2 leading-relaxed">
                Wesleyan University {"\u2014"} Philippines<br />
                Cabanatuan City Campus
              </p>
            </div>
          </div>
        </div>

        {/* Experience Block (Right) - Focus Mode & Ledger Layout */}
        <div className="w-full lg:w-2/3">
          
          
          {/* FOCUS MODE: 'group/list' triggers dimming on children, while 'hover:!opacity-100' restores the active one */}
          <div className="group/list flex flex-col">
            {experience.map((item, i) => (
              <motion.div
                key={item.id || item.project}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
                className="py-8 first:pt-0 border-b border-slate/10 dark:border-white/5 last:border-0 transition-all duration-500 group-hover/list:opacity-20 hover:!opacity-100"
              >
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 md:gap-4 mb-3">
                  <h4 className="font-mono text-base text-neutral-900 dark:text-cream font-medium leading-snug">
                    {item.role} <span className="text-slate/30 mx-2">/</span> {item.project}
                  </h4>
                  <span className="font-mono text-[11px] text-slate/50 whitespace-nowrap">
                    {item.year}
                  </span>
                </div>
                
                <p className="font-mono text-[11px] text-teal/90 mb-4 tracking-wider uppercase">
                  {item.subtitle}
                </p>
                
                <p className="text-slate text-sm leading-relaxed mb-6 max-w-2xl">
                  {item.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-3 py-1 rounded-full bg-transparent border border-slate/20 dark:border-white/10 text-slate/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
