"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import SpotlightCard from "../react-bits/SpotlightCard";
import { getTagIcon, BuildingPreview, ProjectData } from "./StickyProjectCard";

export default function DeckProjectCard({
  project,
}: {
  project: ProjectData;
}) {
  return (
    <div className="w-full h-full bg-ink rounded-2xl border border-slate/10 p-6 shadow-xl sm:p-10 sm:shadow-2xl flex flex-col justify-between">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center h-full">
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
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate">{spec.label}</span>
                <span className="font-mono text-xs text-cream">{spec.value}</span>
              </div>
            ))}
          </div>
          <p className="text-slate text-sm sm:text-base leading-relaxed mb-8">{project.description}</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {project.tags.map((tag) => (
              <div key={tag} className="flex items-center gap-2 bg-surface/50 border border-slate/10 rounded-full px-3 py-1.5 text-xs text-slate">
                {getTagIcon(tag)}
                <span className="font-mono tracking-wide">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
