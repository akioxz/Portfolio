"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import SplitText from "./react-bits/SplitText";
import DeckProjectCard from "./projects/DeckProjectCard";
import Magnetic from "./Magnetic";
import { ProjectData } from "./projects/StickyProjectCard";
import { useUISounds } from "@/hooks/useUISounds";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Projects({ projects }: { projects: ProjectData[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = projects.length;
  const { playHover, playClick } = useUISounds();
  const isMobile = useMediaQuery("(max-width: 640px)");

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
    <section id="projects" className="scroll-mt-24" aria-label="Projects">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-12">
        <SplitText
          text="Projects"
          tag="h2"
          className="text-2xl sm:text-[1.75rem] font-mono text-neutral-900 dark:text-cream"
          splitType="words"
          delay={40}
          duration={0.5}
          from={{ opacity: 0, y: 16 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.2}
        />
        
        <Magnetic>
          <Link 
            href="/projects" 
            className="group flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate hover:text-neutral-900 dark:hover:text-cream transition-colors"
            data-magnetic
          >
            ALL PROJECTS 
            <span className="transform transition-transform group-hover:translate-x-1">&#8594;</span>
          </Link>
        </Magnetic>
      </div>

      <div className="relative w-full h-[400px] flex items-center justify-center overflow-visible perspective-[2000px]">
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
              left: isMobile ? {
                x: "-15%", y: "0%", scale: 0.85, rotateY: 0, rotateZ: -4, zIndex: 10, opacity: 0
              } : { 
                x: "-65%", y: "5%", scale: 0.88, rotateY: 15, rotateZ: -6, zIndex: 10, opacity: 0.4 
              },
              right: isMobile ? {
                x: "15%", y: "0%", scale: 0.85, rotateY: 0, rotateZ: 4, zIndex: 20, opacity: 0
              } : { 
                x: "65%", y: "5%", scale: 0.88, rotateY: -15, rotateZ: 6, zIndex: 20, opacity: 0.4 
              },
              centerHover: { 
                y: isMobile ? "0%" : "-4%", scale: isMobile ? 1 : 1.02, opacity: 1 
              },
              leftHover: isMobile ? {
                x: "-15%", y: "0%", scale: 0.85, rotateY: 0, rotateZ: -4, zIndex: 10, opacity: 0
              } : { 
                x: "-72%", y: "2%", scale: 0.92, rotateY: 10, rotateZ: -8, opacity: 0.85 
              },
              rightHover: isMobile ? {
                x: "15%", y: "0%", scale: 0.85, rotateY: 0, rotateZ: 4, zIndex: 20, opacity: 0
              } : { 
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
                  else if (position === "right") handleNext();
                  else if (position === "center" && project.link) {
                    window.open(project.link, "_blank", "noopener,noreferrer");
                  }
                }}
                onMouseEnter={() => {
                  if (position !== "center") playHover();
                }}
                drag={position === "center" ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(e, { offset }) => {
                  if (offset.x < -50) handleNext();
                  else if (offset.x > 50) handlePrev();
                }}
                style={{ 
                  cursor: position === "center" ? (project.link ? "pointer" : "default") : "pointer",
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
