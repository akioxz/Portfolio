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

const ICON_MAP: Record<string, { component: any; color: string }> = {
  SiHtml5: { component: SiHtml5, color: "#E34F26" },
  SiCss: { component: SiCss, color: "#1572B6" },
  SiJavascript: { component: SiJavascript, color: "#F7DF1E" },
  SiTypescript: { component: SiTypescript, color: "#3178C6" },
  SiReact: { component: SiReact, color: "#61DAFB" },
  SiExpo: { component: SiExpo, color: "#ffffff" },
  SiNextdotjs: { component: SiNextdotjs, color: "#ffffff" },
  SiFlutter: { component: SiFlutter, color: "#02569B" },
  SiVuedotjs: { component: SiVuedotjs, color: "#4FC08D" },
  SiTailwindcss: { component: SiTailwindcss, color: "#06B6D4" },
  SiNodedotjs: { component: SiNodedotjs, color: "#339933" },
  SiExpress: { component: SiExpress, color: "#ffffff" },
  SiPhp: { component: SiPhp, color: "#777BB4" },
  SiLaravel: { component: SiLaravel, color: "#FF2D20" },
  SiPython: { component: SiPython, color: "#3776AB" },
  SiPrisma: { component: SiPrisma, color: "#ffffff" },
  SiMysql: { component: SiMysql, color: "#4479A1" },
  SiPostgresql: { component: SiPostgresql, color: "#4169E1" },
  SiSupabase: { component: SiSupabase, color: "#3ECF8E" },
  SiGit: { component: SiGit, color: "#F05032" },
  SiGithub: { component: SiGithub, color: "#ffffff" },
  VscCode: { component: VscCode, color: "#007ACC" }
};

interface StackItem {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export default function Stack({ stack = [] }: { stack?: StackItem[] }) {
  const getLogoItems = (items: StackItem[]): LogoItem[] => {
    return items.map((item) => {
      const mappedIcon = ICON_MAP[item.icon] || ICON_MAP["VscCode"];
      const Icon = mappedIcon.component;
      const brandColor = mappedIcon.color;
      return {
        node: (
          <div className="flex items-center gap-2 text-cream font-mono text-xs border border-slate/15 bg-surface/40 rounded-md px-3 py-2 select-none group transition-colors hover:border-slate/30">
            <Icon 
              aria-hidden="true" 
              className="w-4 h-4 transition-transform group-hover:scale-110" 
              style={{ color: brandColor }}
            />
            <span>{item.name}</span>
          </div>
        ),
        title: item.name,
      };
    });
  };

  const frontendItems = stack.filter((s) => s.category.toLowerCase() === "frontend");
  const backendItems = stack.filter((s) => s.category.toLowerCase() === "backend");
  const toolsItems = stack.filter((s) => s.category.toLowerCase() === "tools");

  if (stack.length === 0) return null;

  return (
    <section id="stack" className="mb-20 scroll-mt-24" aria-label="Technology Stack">
      <SplitText
        text="Stack"
        tag="h2"
        className="text-xl font-mono text-cream mb-6"
        splitType="words"
        delay={40}
        duration={0.5}
        from={{ opacity: 0, y: 16 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.2}
      />

      <div className="flex flex-col gap-6">
        {frontendItems.length > 0 && (
          <div>
            <p className="font-mono text-xs text-slate mb-3">frontend</p>
            <LogoLoop
              logos={getLogoItems(frontendItems)}
              speed={80}
              direction="left"
              logoHeight={32}
              gap={12}
              fadeOut
              fadeOutColor="rgb(var(--bg))"
              scaleOnHover
              ariaLabel="Frontend stack"
            />
          </div>
        )}
        
        {backendItems.length > 0 && (
          <div>
            <p className="font-mono text-xs text-slate mb-3">backend</p>
            <LogoLoop
              logos={getLogoItems(backendItems)}
              speed={80}
              direction="right"
              logoHeight={32}
              gap={12}
              fadeOut
              fadeOutColor="rgb(var(--bg))"
              scaleOnHover
              ariaLabel="Backend stack"
            />
          </div>
        )}

        {toolsItems.length > 0 && (
          <div>
            <p className="font-mono text-xs text-slate mb-3">tools</p>
            <LogoLoop
              logos={getLogoItems(toolsItems)}
              speed={80}
              direction="left"
              logoHeight={32}
              gap={12}
              fadeOut
              fadeOutColor="rgb(var(--bg))"
              scaleOnHover
              ariaLabel="Tools stack"
            />
          </div>
        )}
      </div>
    </section>
  );
}
