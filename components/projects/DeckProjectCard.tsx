"use client";

import React from "react";
import Image from "next/image";
import SpotlightCard from "../react-bits/SpotlightCard";
import { getTagIcon, BuildingPreview, ProjectData } from "./StickyProjectCard";

export default function DeckProjectCard({
  project,
}: {
  project: ProjectData;
}) {
  return (
    <div className="w-full max-w-sm mx-auto h-[480px] bg-white dark:bg-ink rounded-3xl border border-slate/10 dark:border-slate/20 p-5 shadow-2xl flex flex-col transition-colors">
      <SpotlightCard className="rounded-2xl shrink-0" spotlightColor="rgba(255, 255, 255, 0.05)">
        <div className="relative aspect-[16/10] w-full rounded-2xl border border-slate/10 overflow-hidden bg-surface group">
          {project.image ? (
            <Image 
              src={project.image} 
              alt={`${project.name} preview`} 
              fill 
              sizes="(min-width: 640px) 400px, 100vw" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]" 
            />
          ) : (
            <BuildingPreview name={project.name} />
          )}
        </div>
      </SpotlightCard>
      
      <div className="flex flex-col flex-1 mt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-teal">
            {project.eyebrow}
          </span>
          {project.status && (
            <span className="font-mono text-[9px] font-semibold tracking-wider uppercase text-amber border border-amber/30 rounded-full px-2 py-0.5">
              {project.status}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-mono font-bold text-neutral-900 dark:text-cream mb-2">
          {project.name}
        </h3>
        
        <p className="text-slate text-sm leading-relaxed line-clamp-3 mb-4">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <div key={tag} className="flex items-center gap-1.5 bg-neutral-100 dark:bg-surface/50 border border-slate/10 rounded-full px-2.5 py-1 text-[10px] text-slate">
              {getTagIcon(tag)}
              <span className="font-mono tracking-wide">{tag}</span>
            </div>
          ))}
          {project.tags.length > 3 && (
            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-surface/50 border border-slate/10 rounded-full px-2.5 py-1 text-[10px] text-slate">
              <span className="font-mono tracking-wide">+{project.tags.length - 3}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
