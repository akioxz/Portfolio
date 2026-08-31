"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "motion/react";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  minWidth?: string;
}

function AnimatedNumber({
  value,
  suffix = "",
  minWidth = "1ch",
}: Omit<StatProps, "label">) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) {
      if (prefersReducedMotion) {
        count.set(value);
      } else {
        animate(count, value, {
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
        });
      }
    }
  }, [isInView, value, prefersReducedMotion, count]);

  return (
    <span ref={ref} className="inline-flex items-baseline justify-center lg:justify-start" style={{ minWidth }}>
      {/* Screen reader only sees this final static value */}
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      {/* Visual only counter */}
      <motion.span aria-hidden="true">{rounded}</motion.span>
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  );
}

export default function StatsStrip() {
  const stats: StatProps[] = [
    { value: 3, label: "Academic Projects", minWidth: "1ch" },
    { value: 2, label: "Personal Projects", minWidth: "1ch" },
    { value: 4, label: "Years in School", minWidth: "1ch" },
    { value: 10, suffix: "+", label: "Technologies", minWidth: "3ch" },
  ];

  return (
    <section aria-label="Quick statistics" className="w-full mb-8 sm:mb-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 items-center py-10 sm:py-12 border-y border-slate/10 bg-surface/20">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center lg:items-start lg:pl-12 text-center lg:text-left gap-1 ${
              i !== 0 ? "lg:border-l lg:border-slate/10" : ""
            }`}
          >
            <div className="font-mono text-4xl sm:text-5xl font-bold text-cream tracking-tighter">
              <AnimatedNumber
                value={stat.value}
                suffix={stat.suffix}
                minWidth={stat.minWidth}
              />
            </div>
            <span className="font-mono text-[10px] sm:text-[11px] text-slate/80 uppercase tracking-widest mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
