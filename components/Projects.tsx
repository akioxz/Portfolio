"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SplitText from "./react-bits/SplitText";
import DeckProjectCard from "./projects/DeckProjectCard";
import { ProjectData } from "./projects/StickyProjectCard";
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";
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
        
        {total > 1 && (
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrev}
              onMouseEnter={playHover}
              className="p-3 rounded-full border border-slate/20 text-slate hover:text-neutral-900 dark:hover:text-cream hover:bg-neutral-100 dark:hover:bg-surface transition-all active:scale-95"
              data-magnetic
              aria-label="Previous project"
            >
              <VscChevronLeft className="w-5 h-5" />
            </button>
            <div className="font-mono text-xs text-slate px-2">
              <span className="text-neutral-900 dark:text-cream font-medium">0{activeIndex + 1}</span> / 0{total}
            </div>
            <button 
              onClick={handleNext}
              onMouseEnter={playHover}
              className="p-3 rounded-full border border-slate/20 text-slate hover:text-neutral-900 dark:hover:text-cream hover:bg-neutral-100 dark:hover:bg-surface transition-all active:scale-95"
              data-magnetic
              aria-label="Next project"
            >
              <VscChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="relative w-full h-[380px] flex items-center justify-center overflow-visible perspective-[2000px]">
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => {
            let position = "hidden";
            if (index === activeIndex) position = "center";
            else if (index === (activeIndex - 1 + total) % total) position = "left";
            else if (index === (activeIndex + 1) % total) position = "right";

            if (position === "hidden") return null;

            // X offsets are relative to the card's width (max-w-sm is ~384px)
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
            };

            return (
              <motion.div
                key={project.name}
                className="absolute w-full max-w-sm origin-bottom"
                variants={variants}
                initial={false}
                animate={position}
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
                {/* Dimming overlay for background cards */}
                <motion.div 
                  className="absolute inset-0 z-50 bg-neutral-900 dark:bg-ink rounded-3xl pointer-events-none"
                  initial={false}
                  animate={{ opacity: position === "center" ? 0 : 0.6 }}
                  transition={{ duration: 0.4 }}
                />
                <DeckProjectCard project={project} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
