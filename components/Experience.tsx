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
    <section id="experience" className="scroll-mt-24 mb-32" aria-label="Experience">
      <div className="mb-12">
        <SplitText
          text="Experience & Education"
          tag="h2"
          className="text-[2rem] font-mono text-neutral-900 dark:text-cream"
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
          <span className="block font-mono text-[10px] tracking-[0.2em] uppercase text-teal mb-6">
            Education
          </span>
          <div className="border-l border-slate/10 pl-6">
            <p className="font-mono text-xs text-slate mb-1">2023 {"\u2013"} Present</p>
            <h3 className="font-mono text-sm text-neutral-900 dark:text-cream font-medium leading-snug">
              B.S. Information Technology
            </h3>
            <p className="text-slate text-xs mt-1 leading-relaxed">
              Wesleyan University {"\u2013"} Philippines<br />
              Cabanatuan City Campus
            </p>
          </div>
        </div>

        {/* Experience Block (Right) */}
        <div className="w-full lg:w-2/3">
          <span className="block font-mono text-[10px] tracking-[0.2em] uppercase text-teal mb-6">
            Experience
          </span>
          <div className="flex flex-col gap-10">
            {experience.map((item, i) => (
              <motion.div
                key={item.id || item.project}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
                className="border-l border-slate/10 pl-6 hover:border-teal/40 transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-slate/60">
                    {item.year}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate/30" />
                  <span className="font-mono text-xs text-teal font-medium tracking-wide">
                    {item.role}
                  </span>
                </div>
                <h4 className="font-mono text-base text-neutral-900 dark:text-cream font-semibold leading-snug mb-1">
                  {item.project}
                </h4>
                <p className="font-mono text-[11px] text-slate/70 mb-3">
                  {item.subtitle}
                </p>
                <p className="text-slate text-sm leading-relaxed mb-4 max-w-2xl">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2 py-1 rounded bg-surface border border-slate/10 text-slate/80"
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
