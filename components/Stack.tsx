"use client";

import LogoLoop, { LogoItem } from "./react-bits/LogoLoop";
import SplitText from "./react-bits/SplitText";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiExpo,
  SiNextdotjs,
  SiFlutter,
  SiVuedotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiPhp,
  SiLaravel,
  SiPython,
  SiPrisma,
  SiMysql,
  SiPostgresql,
  SiSupabase,
  SiGit,
  SiGithub,
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";

const ICON_MAP: Record<string, any> = {
  SiHtml5, SiCss, SiJavascript, SiTypescript, SiReact, SiExpo,
  SiNextdotjs, SiFlutter, SiVuedotjs, SiTailwindcss, SiNodedotjs,
  SiExpress, SiPhp, SiLaravel, SiPython, SiPrisma, SiMysql,
  SiPostgresql, SiSupabase, SiGit, SiGithub, VscCode
};

interface StackItem {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export default function Stack({ stack = [] }: { stack?: StackItem[] }) {
  const getLogoItems = (
    items: StackItem[],
    accentColorClass: string,
  ): LogoItem[] => {
    return items.map((item) => {
      const Icon = ICON_MAP[item.icon] || VscCode;
      return {
        node: (
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-slate opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap">
            <Icon size={16} className={`transition-colors ${accentColorClass}`} />
            {item.name}
          </div>
        ),
      };
    });
  };

  const frontendItems = stack.filter((s) => s.category.toLowerCase() === "frontend");
  const backendItems = stack.filter((s) => s.category.toLowerCase() === "backend");
  const toolsItems = stack.filter((s) => s.category.toLowerCase() === "tools");

  if (stack.length === 0) return null;

  return (
    <section id="stack" className="mb-24 scroll-mt-24" aria-label="Tech Stack">
      <div className="mb-10">
        <SplitText
          text="Stack"
          tag="h2"
          className="text-xl font-mono text-cream font-medium"
          splitType="words"
          delay={40}
          duration={0.5}
          from={{ opacity: 0, y: 16 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.2}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none"></div>

        <div className="flex flex-col gap-5 sm:gap-6">
          {frontendItems.length > 0 && (
            <div className="flex items-center gap-4 group">
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-slate/40 min-w-[70px] sm:min-w-[80px] group-hover:text-teal/60 transition-colors">
                Frontend
              </span>
              <div className="flex-1 overflow-hidden mask-edges py-2 sm:py-3 border-y border-white/5 bg-white/[0.01]">
                <LogoLoop items={getLogoItems(frontendItems, "group-hover:text-teal")} speed={30} />
              </div>
            </div>
          )}

          {backendItems.length > 0 && (
            <div className="flex items-center gap-4 group">
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-slate/40 min-w-[70px] sm:min-w-[80px] group-hover:text-orange-400/60 transition-colors">
                Backend
              </span>
              <div className="flex-1 overflow-hidden mask-edges py-2 sm:py-3 border-y border-white/5 bg-white/[0.01]">
                <LogoLoop items={getLogoItems(backendItems, "group-hover:text-orange-400")} speed={25} direction="right" />
              </div>
            </div>
          )}

          {toolsItems.length > 0 && (
            <div className="flex items-center gap-4 group">
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-slate/40 min-w-[70px] sm:min-w-[80px] group-hover:text-purple-400/60 transition-colors">
                Tools
              </span>
              <div className="flex-1 overflow-hidden mask-edges py-2 sm:py-3 border-y border-white/5 bg-white/[0.01]">
                <LogoLoop items={getLogoItems(toolsItems, "group-hover:text-purple-400")} speed={35} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
