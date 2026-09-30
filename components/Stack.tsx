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
          <div className="flex items-center gap-2 text-cream font-mono text-xs border border-slate/15 bg-surface/40 rounded-md px-3 py-2 select-none">
            <Icon aria-hidden="true" className={`w-4 h-4 ${accentColorClass}`} />
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
              logos={getLogoItems(frontendItems, "text-teal")}
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
              logos={getLogoItems(backendItems, "text-orange-400")}
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
              logos={getLogoItems(toolsItems, "text-purple-400")}
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
