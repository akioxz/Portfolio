"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useVelocity, useTransform } from "motion/react";
import SplitText from "./react-bits/SplitText";
import Magnetic from "./Magnetic";
import { ProjectData } from "./projects/StickyProjectCard";

export default function Projects({ projects }: { projects: ProjectData[] }) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  // Mouse tracking for floating image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Extremely responsive but buttery spring
  const springX = useSpring(mouseX, { stiffness: 400, damping: 28, mass: 0.1 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 28, mass: 0.1 });

  // Velocity-based rotation for that 3D spatial feel
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);
  const rotateY = useTransform(velocityX, [-1000, 1000], [-15, 15]);
  const rotateX = useTransform(velocityY, [-1000, 1000], [15, -15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="scroll-mt-24 relative" aria-label="Projects">
      
      {/* Floating Image Portal (Hidden on mobile) */}
      <AnimatePresence>
        {hoveredImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed top-0 left-0 w-[300px] h-[360px] rounded-xl overflow-hidden pointer-events-none z-[100] shadow-2xl hidden lg:block"
            style={{
              x: springX,
              y: springY,
              translateX: "-50%",
              translateY: "-50%",
              rotateX,
              rotateY,
              transformPerspective: 1000
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={hoveredImage} 
              alt="Project Preview" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-12">
        <p className="font-pixel text-xs text-slate mb-2 uppercase tracking-wider">01 - projects</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
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
              className="group flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-slate hover:text-neutral-900 dark:hover:text-cream transition-colors"
              data-magnetic
            >
              ALL PROJECTS 
              <span className="transform transition-transform group-hover:translate-x-1">&#8594;</span>
            </Link>
          </Magnetic>
        </div>
      </div>

      <div className="flex flex-col border-t border-black/10 dark:border-white/5 relative z-10">
        {projects.map((project, i) => (
          <motion.a
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            key={project.name}
            href={project.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => {
              if (project.image) setHoveredImage(project.image);
            }}
            onMouseLeave={() => {
              setHoveredImage(null);
            }}
            className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-black/10 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors relative"
          >
            <div className="flex flex-col gap-2 md:w-1/2 pointer-events-none">
              <h3 className="font-mono text-lg text-neutral-900 dark:text-white font-medium group-hover:text-teal transition-colors">
                {project.name}
              </h3>
              <p className="text-slate text-[15px] leading-relaxed line-clamp-2 md:line-clamp-none pr-4">
                {project.description}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-6 md:mt-0 md:justify-end md:w-1/2 pointer-events-none">
              {project.tags?.slice(0, 3).map(tag => (
                <span key={tag} className="font-mono text-[11px] px-2.5 py-1 bg-black/5 dark:bg-white/5 text-slate rounded-sm uppercase tracking-widest">
                  {tag}
                </span>
              ))}
              {project.tags && project.tags.length > 3 && (
                <span className="font-mono text-[11px] px-2.5 py-1 text-slate/50 rounded-sm uppercase tracking-widest">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}