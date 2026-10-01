"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import SplitText from "./react-bits/SplitText";
import Magnetic from "./Magnetic";
import { ProjectData } from "./projects/StickyProjectCard";

export default function Projects({ projects }: { projects: ProjectData[] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="scroll-mt-24" aria-label="Projects">
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

      <div className="flex flex-col border-t border-black/10 dark:border-white/5">
        {projects.map((project, i) => (
          <motion.a
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            key={project.id || project.name}
            href={project.link || project.github || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-black/10 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors relative"
          >
            <div className="flex flex-col gap-2 md:w-1/2">
              <h3 className="font-mono text-lg text-neutral-900 dark:text-white font-medium group-hover:text-teal transition-colors">
                {project.name}
              </h3>
              <p className="text-slate text-[15px] leading-relaxed line-clamp-2 md:line-clamp-none pr-4">
                {project.description}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-6 md:mt-0 md:justify-end md:w-1/2">
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
