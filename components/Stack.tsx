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

const frontendIcons = [
  { name: "HTML", icon: SiHtml5 },
  { name: "CSS", icon: SiCss },
  { name: "JavaScript", icon: SiJavascript },
  { name: "TypeScript", icon: SiTypescript },
  { name: "React", icon: SiReact },
  { name: "React Native", icon: SiReact },
  { name: "Flutter", icon: SiFlutter },
  { name: "Expo", icon: SiExpo },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Vue", icon: SiVuedotjs },
  { name: "Tailwind", icon: SiTailwindcss },
];

const backendIcons = [
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Express", icon: SiExpress },
  { name: "PHP", icon: SiPhp },
  { name: "Laravel", icon: SiLaravel },
  { name: "Python", icon: SiPython },
  { name: "Prisma", icon: SiPrisma },
  { name: "MySQL", icon: SiMysql },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "Supabase", icon: SiSupabase },
];

const toolsIcons = [
  { name: "Git", icon: SiGit },
  { name: "GitHub", icon: SiGithub },
  { name: "VS Code", icon: VscCode },
];

export default function Stack() {
  const getLogoItems = (
    items: { name: string; icon: any }[],
    accentColorClass: string,
  ): LogoItem[] => {
    return items.map((item) => {
      const Icon = item.icon;
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

  return (
    <section id="stack" className="mb-20 scroll-mt-24">
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
        <div>
          <p className="font-mono text-xs text-slate mb-3">frontend</p>
          <LogoLoop
            logos={getLogoItems(frontendIcons, "text-teal")}
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

        <div>
          <p className="font-mono text-xs text-slate mb-3">backend</p>
          <LogoLoop
            logos={getLogoItems(backendIcons, "text-amber")}
            speed={80}
            direction="left"
            logoHeight={32}
            gap={12}
            fadeOut
            fadeOutColor="rgb(var(--bg))"
            scaleOnHover
            ariaLabel="Backend stack"
          />
        </div>

        <div>
          <p className="font-mono text-xs text-slate mb-3">tools</p>
          <LogoLoop
            logos={getLogoItems(toolsIcons, "text-slate")}
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
      </div>
    </section>
  );
}
