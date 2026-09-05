"use client";

import React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import SplitText from "./react-bits/SplitText";
import SpotlightCard from "./react-bits/SpotlightCard";
import {
  SiReact,
  SiExpo,
  SiTypescript,
  SiSupabase,
  SiNextdotjs,
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";

/* ─── Project Data ─── */

interface ProjectData {
  name: string;
  eyebrow: string;
  status: string | null;
  description: string;
  tags: string[];
  image: string | null;
  specs: { label: string; value: string }[];
}

const projects: ProjectData[] = [
  {
    name: "Atelier Carven",
    eyebrow: "FULL-STACK E-COMMERCE",
    status: null,
    description:
      "A luxury furniture e-commerce platform designed with an emphasis on minimalist aesthetics and seamless purchasing flows. Features a role-based architecture separating the customer storefront from a comprehensive admin dashboard. Powered by a Supabase RLS-secured data layer ensuring strict spec-compliance and data integrity across all user boundaries.",
    tags: ["React Native", "Expo", "TypeScript", "Supabase"],
    image: null,
    specs: [
      { label: "Role", value: "Full-Stack Dev" },
      { label: "Timeline", value: "6 Weeks" },
      { label: "Platform", value: "iOS / Android" },
    ],
  },
  {
    name: "Quorin",
    eyebrow: "INVENTORY MANAGEMENT",
    status: null,
    description:
      "A robust PC parts e-commerce and inventory platform built for high-performance filtering and specification comparisons. Includes a dedicated category-based catalog, real-time stock synchronization, and a role-based admin suite for managing products. Backed by a high-availability Supabase database and Zustand for localized state management.",
    tags: ["Next.js", "TypeScript", "Supabase", "Zustand"],
    image: null,
    specs: [
      { label: "Role", value: "Frontend Lead" },
      { label: "Timeline", value: "4 Weeks" },
      { label: "Platform", value: "Web App" },
    ],
  },
];

/* ─── Tag Icon Helper ─── */

function getTagIcon(tag: string) {
  switch (tag.toLowerCase()) {
    case "react native":
    case "react":
      return (
        <SiReact
          key={tag}
          className="w-4 h-4 text-teal hover:text-teal/80 transition-colors"
          title="React Native"
        />
      );
    case "expo":
      return (
        <SiExpo
          key={tag}
          className="w-4 h-4 text-cream hover:text-cream/80 transition-colors"
          title="Expo"
        />
      );
    case "next.js":
    case "nextjs":
      return (
        <SiNextdotjs
          key={tag}
          className="w-4 h-4 text-cream hover:text-cream/80 transition-colors"
          title="Next.js"
        />
      );
    case "typescript":
      return (
        <SiTypescript
          key={tag}
          className="w-4 h-4 text-[#3178c6] hover:text-[#3178c6]/80 transition-colors"
          title="TypeScript"
        />
      );
    case "supabase":
      return (
        <SiSupabase
          key={tag}
          className="w-4 h-4 text-[#3ecf8e] hover:text-[#3ecf8e]/80 transition-colors"
          title="Supabase"
        />
      );
    case "zustand":
      return (
        <VscCode
          key={tag}
          className="w-4 h-4 text-amber hover:text-amber/80 transition-colors"
          title="Zustand"
        />
      );
    default:
      return null;
  }
}

/* ─── Building Preview (for projects without images) ─── */

function BuildingPreview({ name }: { name: string }) {
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
          backgroundImage:
            "radial-gradient(rgb(var(--text-secondary)) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {!isMobile && !reducedMotion && (
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(220px circle at var(--x) var(--y), rgba(var(--spotlight), 0.16), transparent 70%)",
          }}
          animate={{
            "--x": ["10%", "90%", "10%"],
            "--y": ["20%", "80%", "20%"],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      <div className="relative w-full h-full flex flex-col items-center justify-center gap-2">
        <span className="font-mono text-sm text-slate/70 select-none tracking-wide">
          {name}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-amber/70">
          <span className="w-1.5 h-1.5 rounded-full bg-amber/70 animate-pulse" />
          upgrading
        </span>
      </div>
    </div>
  );
}

/* ─── Sticky Project Card ─── */

function StickyProjectCard({
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

  /*
   * Scroll math:
   * Each card gets an equal slice of the total scroll progress.
   * Card i occupies [i/total, (i+1)/total].
   *
   * Within that slice:
   * - First 25%: card enters (slides up, fades in) — skipped for card 0
   * - Last 40%: card exits (scales down, dims) — skipped for last card
   * - Middle: card is fully visible at rest
   */
  const segmentStart = index / total;
  const segmentEnd = (index + 1) / total;
  const segmentLen = segmentEnd - segmentStart;

  // --- Entry animation (cards after the first) ---
  const entryEnd = segmentStart + segmentLen * 0.25;
  const rawY = useTransform(
    scrollYProgress,
    [segmentStart, entryEnd],
    index > 0 && !reducedMotion ? [60, 0] : [0, 0]
  );
  const rawEntryOpacity = useTransform(
    scrollYProgress,
    [segmentStart, entryEnd],
    index > 0 ? [0, 1] : [1, 1]
  );

  // --- Exit animation (all cards except the last) ---
  const exitStart = segmentEnd - segmentLen * 0.4;
  const rawScale = useTransform(
    scrollYProgress,
    [exitStart, segmentEnd],
    !isLast && !reducedMotion ? [1, 0.93] : [1, 1]
  );
  const rawExitOpacity = useTransform(
    scrollYProgress,
    [exitStart, segmentEnd],
    !isLast && !reducedMotion ? [1, 0.5] : [1, 1]
  );

  // --- Merge entry and exit opacity into one value ---
  // Entry controls [0→1] during first 25%, exit controls [1→0.5] during last 40%
  // We multiply them so both can work independently
  const rawOpacity = useTransform(
    () => rawEntryOpacity.get() * rawExitOpacity.get()
  );

  // Stagger the sticky offset for physical depth
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
      <motion.div
        style={{ scale: rawScale, opacity: rawOpacity, y: rawY, willChange: "transform, opacity" }}
        className="w-full"
      >
        <div className="bg-ink rounded-2xl border border-slate/10 p-6 shadow-xl sm:p-10 sm:shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center">
            {/* Image Column */}
            <div className="w-full lg:w-7/12">
              <SpotlightCard
                className="rounded-2xl"
                spotlightColor="rgba(255, 255, 255, 0.05)"
              >
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl border border-slate/10 overflow-hidden bg-surface transition-all duration-500 hover:border-slate/25 group">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={`${project.name} preview`}
                      fill
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <BuildingPreview name={project.name} />
                  )}
                </div>
              </SpotlightCard>
            </div>

            {/* Text Column */}
            <div className="w-full lg:w-5/12 flex flex-col justify-center">
              <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-teal mb-3 sm:mb-4">
                {project.eyebrow}
              </span>

              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <h3 className="text-2xl sm:text-3xl font-mono font-bold text-cream">
                  {project.name}
                </h3>
                {project.status && (
                  <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-amber border border-amber/30 rounded px-2 py-1 whitespace-nowrap">
                    {project.status}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {project.specs.map((spec) => (
                  <div key={spec.label} className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate">
                      {spec.label}
                    </span>
                    <span className="font-mono text-xs text-cream">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-slate text-sm sm:text-base leading-relaxed mb-8">
                {project.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {project.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 bg-surface/50 border border-slate/10 rounded-full px-3 py-1.5 text-xs text-slate"
                  >
                    {getTagIcon(tag)}
                    <span className="font-mono tracking-wide">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll affordance — first card only */}
          {index === 0 && (
            <div className="hidden lg:flex items-center justify-center mt-8 opacity-40">
              <motion.span
                className="font-mono text-[10px] uppercase tracking-widest text-slate"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ↓ scroll to explore
              </motion.span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Projects Section (Single Scroll Source) ─── */

export default function Projects() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const total = projects.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="projects" className="scroll-mt-24">
      <SplitText
        text="Projects"
        tag="h2"
        className="text-[2rem] font-mono text-cream mb-6 sm:mb-8"
        splitType="words"
        delay={40}
        duration={0.5}
        from={{ opacity: 0, y: 16 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.2}
      />

      <div
        ref={containerRef}
        className="relative mt-8 sm:mt-12"
        style={{ height: `${(total + 0.5) * 100}vh` }}
      >
        {projects.map((project, index) => (
          <StickyProjectCard
            key={project.name}
            project={project}
            index={index}
            total={total}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}
