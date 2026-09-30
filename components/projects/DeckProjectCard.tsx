"use client";

import React from "react";
import { getTagIcon, ProjectData } from "./StickyProjectCard";

export default function DeckProjectCard({
  project,
}: {
  project: ProjectData;
}) {
  return (
    <div className="w-full max-w-[20rem] mx-auto h-[320px] bg-white dark:bg-[#0a0a0a] rounded-[24px] border border-slate/10 dark:border-white/10 p-6 shadow-2xl flex flex-col transition-colors">
      
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          {/* Minimalist Logo */}
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-slate/10 dark:border-white/5 flex items-center justify-center shadow-sm shrink-0">
            <span className="font-mono text-xl font-bold text-neutral-800 dark:text-cream">
              {project.name.charAt(0)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] font-semibold tracking-[0.2em] uppercase text-teal">
              {project.eyebrow}
            </span>
            <h3 className="text-lg font-mono font-bold text-neutral-900 dark:text-cream leading-none">
              {project.name}
            </h3>
          </div>
        </div>
        
        {project.status && (
          <span className="font-mono text-[9px] font-semibold tracking-wider uppercase text-amber border border-amber/30 rounded-full px-2 py-0.5 shrink-0">
            {project.status}
          </span>
        )}
      </div>
      
      <p className="text-slate text-sm leading-relaxed text-pretty line-clamp-3 mb-4 flex-1">
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
  );
}
