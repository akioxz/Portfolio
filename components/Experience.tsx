"use client";

import { motion } from "motion/react";
import ScrambleTitle from "./ScrambleTitle";

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
    <section id="experience" className="scroll-mt-24 mb-16" aria-label="Experience and Education">
      <div className="mb-6">
        <ScrambleTitle
          text="Experience & Education"
          as="h2"
          className="text-2xl sm:text-[1.75rem] font-mono text-neutral-900 dark:text-cream"
        />
      </div>

      <p className="font-sans text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 mb-12 leading-relaxed max-w-2xl text-pretty">
        Academic projects and roles where I designed, built, and shipped real systems — from multi-tier platforms to data pipelines.
      </p>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-12">
        {/* Education Block (Left) */}
        <div className="w-full lg:w-1/3">
          
          <h3 className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-slate/70 dark:text-neutral-500 mb-6">
            Education
          </h3>

          <div className="flex flex-col gap-6">
            <div className="transition-opacity duration-300 hover:opacity-100">
              <p className="font-mono text-[11px] text-slate/50 mb-2">2023 {"\u2014"} Present</p>
              <h4 className="font-mono text-sm text-neutral-900 dark:text-cream font-medium leading-snug">
                B.S. Information Technology
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2 leading-relaxed">
                Wesleyan University {"\u2014"} Philippines<br />
                Cabanatuan City Campus
              </p>
            </div>
          </div>
        </div>

        {/* Experience Block (Right) - Focus Mode & Ledger Layout */}
        <div className="w-full lg:w-2/3">
          
          <h3 className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-slate/70 dark:text-neutral-500 mb-6">
            Projects & Roles
          </h3>
          
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
                
                {item.subtitle && (
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-slate/50 mb-4">
                    {item.subtitle}
                  </p>
                )}
                
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6 max-w-2xl">
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
