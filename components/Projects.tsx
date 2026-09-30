"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import SplitText from "./react-bits/SplitText";
import DeckProjectCard from "./projects/DeckProjectCard";
import { ProjectData } from "./projects/StickyProjectCard";
import { useUISounds } from "@/hooks/useUISounds";

export default function Projects({ projects }: { projects: ProjectData[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = projects.length;
  const { playHover, playClick } = useUISounds();

  if (total === 0) return null;

  const handleNext = () => {
    playClick();
    setActiveIndex((prev) => (prev + 1) % total);
  };
  
  const handlePrev = () => {
    playClick();
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  return (
    <section id="projects" className="scroll-mt-24 mb-32" aria-label="Projects">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-12">
        <SplitText
          text="Projects"
          tag="h2"
          className="text-[2rem] font-mono text-neutral-900 dark:text-cream"
          splitType="words"
          delay={40}
          duration={0.5}
          from={{ opacity: 0, y: 16 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.2}
        />
        
        <Link 
          href="/projects" 
          className="group flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate hover:text-neutral-900 dark:hover:text-cream transition-colors"
          data-magnetic
        >
          ALL PROJECTS 
          <span className="transform transition-transform group-hover:translate-x-1">?</span>
        </Link>
      </div>

      <div className="relative w-full h-[380px] flex items-center justify-center overflow-visible perspective-[2000px]">
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => {
            let position = "hidden";
            if (index === activeIndex) position = "center";
            else if (index === (activeIndex - 1 + total) % total) position = "left";
            else if (index === (activeIndex + 1) % total) position = "right";

            if (position === "hidden") return null;

            const variants = {
              center: { 
                x: "0%", y: "0%", scale: 1, rotateY: 0, rotateZ: 0, zIndex: 30, opacity: 1 
              },
              left: { 
                x: "-65%", y: "5%", scale: 0.88, rotateY: 15, rotateZ: -6, zIndex: 10, opacity: 0.4 
              },
              right: { 
                x: "65%", y: "5%", scale: 0.88, rotateY: -15, rotateZ: 6, zIndex: 20, opacity: 0.4 
              },
              centerHover: { 
                y: "-4%", scale: 1.02, opacity: 1 
              },
              leftHover: { 
                x: "-72%", y: "2%", scale: 0.92, rotateY: 10, rotateZ: -8, opacity: 0.85 
              },
              rightHover: { 
                x: "72%", y: "2%", scale: 0.92, rotateY: -10, rotateZ: 8, opacity: 0.85 
              },
            };

            return (
              <motion.div
                key={project.name}
                className="absolute w-full max-w-sm origin-bottom"
                variants={variants}
                initial={false}
                animate={position}
                whileHover={`${position}Hover`}
                transition={{ type: "spring", stiffness: 260, damping: 25, mass: 1.2 }}
                onClick={() => {
                  if (position === "left") handlePrev();
                  if (position === "right") handleNext();
                }}
                onMouseEnter={() => {
                  if (position !== "center") playHover();
                }}
                style={{ 
                  cursor: position === "center" ? "default" : "pointer",
                }}
              >
                <DeckProjectCard project={project} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
