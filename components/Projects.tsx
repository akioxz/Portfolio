"use client";

import React from "react";
import { useScroll } from "motion/react";
import SplitText from "./react-bits/SplitText";
import StickyProjectCard, { ProjectData } from "./projects/StickyProjectCard";



export default function Projects({ projects }: { projects: ProjectData[] }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const total = projects.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="projects" className="scroll-mt-24" aria-label="Projects">
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


