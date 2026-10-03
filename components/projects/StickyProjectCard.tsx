"use client";

import React from "react";
import Image from "next/image";
import { motion, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import SpotlightCard from "../react-bits/SpotlightCard";
import { SiReact, SiExpo, SiTypescript, SiSupabase, SiNextdotjs } from "react-icons/si";
import { VscCode } from "react-icons/vsc";

export interface ProjectData {
  name: string;
  eyebrow: string;
  status: string | null;
  description: string;
  tags: string[];
  image: string | null;
  specs: { label: string; value: string }[];
  link?: string | null;
}

export function getTagIcon(tag: string) {
  switch (tag.toLowerCase()) {
    case "react native":
    case "react":
      return <SiReact key={tag} className="w-4 h-4 text-teal hover:text-teal/80 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" title="React Native" />;
    case "expo":
      return <SiExpo key={tag} className="w-4 h-4 text-cream hover:text-cream/80 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" title="Expo" />;
    case "next.js":
    case "nextjs":
      return <SiNextdotjs key={tag} className="w-4 h-4 text-cream hover:text-cream/80 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" title="Next.js" />;
    case "typescript":
      return <SiTypescript key={tag} className="w-4 h-4 text-[#3178c6] hover:text-[#3178c6]/80 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" title="TypeScript" />;
    case "supabase":
      return <SiSupabase key={tag} className="w-4 h-4 text-[#3ecf8e] hover:text-[#3ecf8e]/80 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" title="Supabase" />;
    case "zustand":
      return <VscCode key={tag} className="w-4 h-4 text-amber hover:text-amber/80 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" title="Zustand" />;
    default:
      return null;
  }
}

export function BuildingPreview({ name }: { name: string }) {
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-surface">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgb(var(--text-secondary)) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      {!isMobile && !reducedMotion && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(220px circle at var(--x) var(--y), rgba(var(--spotlight), 0.16), transparent 70%)",
          }}
          animate={{ "--x": ["10%", "90%", "10%"], "--y": ["20%", "80%", "20%"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-2">
        <span className="font-mono text-sm text-slate/70 select-none tracking-wide">{name}</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-amber/70">
          <span className="w-1.5 h-1.5 rounded-full bg-amber/70 animate-pulse" />
          upgrading
        </span>
      </div>
    </div>
  );
}

export default function StickyProjectCard({
  project,
  index,
  total,
  scrollYProgress,
}: {
  project: ProjectData;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const reducedMotion = useReducedMotion();
  const isLast = index === total - 1;

  const segmentStart = index / total;
  const segmentEnd = (index + 1) / total;
  const segmentLen = segmentEnd - segmentStart;

  const entryEnd = segmentStart + segmentLen * 0.25;
  const rawY = useTransform(scrollYProgress, [segmentStart, entryEnd], index > 0 && !reducedMotion ? [60, 0] : [0, 0]);
  const rawEntryOpacity = useTransform(scrollYProgress, [segmentStart, entryEnd], index > 0 ? [0, 1] : [1, 1]);

  const exitStart = segmentEnd - segmentLen * 0.4;
  const rawScale = useTransform(scrollYProgress, [exitStart, segmentEnd], !isLast && !reducedMotion ? [1, 0.93] : [1, 1]);
  const rawExitOpacity = useTransform(scrollYProgress, [exitStart, segmentEnd], !isLast && !reducedMotion ? [1, 0.5] : [1, 1]);

  const rawOpacity = useTransform(() => rawEntryOpacity.get() * rawExitOpacity.get());

  const stickyTop = `calc(6vh + ${index * 2.5}vh)`;

  return (
    <div
      className="sticky"
      style={{
        top: stickyTop,
        zIndex: index + 1,
        height: "100vh",
        paddingBottom: "10vh",
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <motion.div style={{ scale: rawScale, opacity: rawOpacity, y: rawY, willChange: "transform, opacity" }} className="w-full">
        <div className="bg-ink rounded-2xl border border-slate/10 p-6 shadow-xl sm:p-10 sm:shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center">
            <div className="w-full lg:w-7/12">
              <SpotlightCard className="rounded-2xl" spotlightColor="rgba(255, 255, 255, 0.05)">
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl border border-slate/10 overflow-hidden bg-surface transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-slate/25 group">
                  {project.image ? (
                    <Image src={project.image} alt={`${project.name} preview`} fill sizes="(min-width: 1024px) 58vw, 100vw" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  ) : (
                    <BuildingPreview name={project.name} />
                  )}
                </div>
              </SpotlightCard>
            </div>
            <div className="w-full lg:w-5/12 flex flex-col justify-center">
              <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-teal mb-3 sm:mb-4">{project.eyebrow}</span>
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <h3 className="text-2xl sm:text-3xl font-mono font-bold text-cream">{project.name}</h3>
                {project.status && (
                  <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-amber border border-amber/30 rounded px-2 py-1 whitespace-nowrap">{project.status}</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {project.specs.map((spec) => (
                  <div key={spec.label} className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">{spec.label}</span>
                    <span className="font-mono text-xs text-cream">{spec.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed mb-8">{project.description}</p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {project.tags.map((tag) => (
                  <div key={tag} className="flex items-center gap-2 bg-surface/50 border border-slate/10 rounded-full px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                    {getTagIcon(tag)}
                    <span className="font-mono tracking-wide">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {index === 0 && (
            <div className="hidden lg:flex items-center justify-center mt-8 opacity-40">
              <motion.span className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 dark:text-neutral-400" animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                ↓ scroll to explore
              </motion.span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}



