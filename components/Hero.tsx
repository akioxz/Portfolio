"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import SplitText from "./react-bits/SplitText";
import RotatingText from "./react-bits/RotatingText";
import PixelTransition from "./react-bits/PixelTransition";
import SpecularButton from "./react-bits/SpecularButton";
import { VscMail, VscGithub, VscArrowRight } from "react-icons/vsc";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function Badge({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-surface/80 border border-slate/25 rounded-sm px-2.5 py-0.5 text-[13px] font-mono font-medium text-cream whitespace-nowrap align-middle mx-0.5">
      {icon}
      {label}
    </span>
  );
}

const experienceData = [
  {
    year: "2026",
    role: "Full-Stack Developer",
    project: "Reson8",
    subtitle: "Multi-System Podcast Platform",
    description:
      "Architected a 4-tier podcast platform spanning Next.js (admin), Vue 3 (public), PHP (editor), and Express.js (API). Implemented JWT auth, RESTful API design, and security middleware (CORS, Helmet, rate limiting, CSRF protection).",
    tags: ["Next.js", "Vue 3", "PHP", "Express.js", "JWT"],
  },
  {
    year: "2026",
    role: "Backend & Data Engineer",
    project: "SCSAGA",
    subtitle: "Smart Campus Student Attendance & Gate Analytics",
    description:
      "Built a Flask-based analytics system integrated with Google BigQuery/GCP for real-time campus attendance and gate crowd-status tracking. Automated recurring data jobs via Windows Task Scheduler; built Looker Studio dashboards for stakeholders.",
    tags: ["Flask", "BigQuery", "GCP", "Looker Studio"],
  },
  {
    year: "2026",
    role: "Data & BI Engineer",
    project: "Water Station Dashboard",
    subtitle: "Sales Dashboard & ETL Pipeline",
    description:
      "Designed and implemented an ETL pipeline ingesting CSV sales data into Google BigQuery. Built unified SQL views to consolidate walk-in and delivery channels; developed a Looker Studio dashboard for real-time business reporting.",
    tags: ["BigQuery", "SQL", "ETL", "Looker Studio"],
  },
];

function HeroSidebar() {
  return (
    <motion.div
      variants={itemVariants}
      className="hidden lg:flex w-full lg:w-[42%] flex-col gap-8"
    >
      {/* Education Block */}
      <div>
        <span className="block font-mono text-[10px] tracking-[0.2em] uppercase text-teal mb-4">
          Education
        </span>
        <div className="border-l-2 border-teal/20 pl-4">
          <p className="font-mono text-xs text-slate mb-0.5">2023 – Present</p>
          <h3 className="font-mono text-sm text-cream font-medium leading-snug">
            B.S. Information Technology
          </h3>
          <p className="text-slate text-xs mt-0.5">
            Wesleyan University – Philippines · Cabanatuan City Campus
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate/10" />

      {/* Experience Block */}
      <div>
        <span className="block font-mono text-[10px] tracking-[0.2em] uppercase text-teal mb-4">
          Experience
        </span>
        <div className="flex flex-col gap-6">
          {experienceData.map((item, i) => (
            <motion.div
              key={item.project}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.1 }}
              className="border-l-2 border-slate/15 pl-4 group hover:border-teal/40 transition-colors duration-300"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] text-slate/60">{item.year}</span>
                <span className="w-1 h-1 rounded-full bg-slate/30" />
                <span className="font-mono text-[10px] text-teal font-medium tracking-wide">
                  {item.role}
                </span>
              </div>
              <h4 className="font-mono text-sm text-cream font-semibold leading-snug">
                {item.project}
              </h4>
              <p className="font-mono text-[11px] text-slate/70 mb-1.5">{item.subtitle}</p>
              <p className="text-slate text-xs leading-relaxed">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface border border-slate/10 text-slate/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const [step, setStep] = useState(0);
  const rotatingTextRef = useRef<any>(null);

  const rotatingTexts = useMemo(
    () => [
      "View Resume",
      "Still polishing this",
      "Almost there",
      "Thanks for your patience",
    ],
    [],
  );

  const handleButtonClick = () => {
    if (step >= rotatingTexts.length - 1) {
      setStep(0);
      rotatingTextRef.current?.reset();
      return;
    }

    const nextStep = step + 1;
    setStep(nextStep);
    rotatingTextRef.current?.next();
  };

  return (
    <motion.section
      id="hero"
      className="mb-4 flex flex-col lg:flex-row gap-16 lg:gap-12 items-start justify-between"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Left: Bio */}
      <div className="flex-1 max-w-2xl">
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-5 mb-6"
        >
          <div
            className="w-[130px] h-[130px] shrink-0"
            style={{ transform: "translateZ(0)", willChange: "transform" }}
          >
            <PixelTransition
              firstContent={
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src="/photo1.png"
                    alt="Axel Villanueva"
                    fill
                    priority
                    sizes="130px"
                    className="object-cover"
                  />
                </div>
              }
              secondContent={
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src="/photo2.png"
                    alt="Axel Villanueva"
                    fill
                    priority
                    sizes="130px"
                    className="object-cover"
                  />
                </div>
              }
              gridSize={8}
              pixelColor="rgb(var(--teal))"
              animationStepDuration={0.35}
              aspectRatio="100%"
              className="!w-[130px] !h-[130px] !rounded-full !border-slate/20 !bg-surface"
            />
          </div>

          <div style={{ transform: "translateZ(0)", willChange: "transform" }}>
            <h1 className="font-mono text-[2rem] font-semibold text-cream leading-none mb-2">
              Axel Villanueva
            </h1>
            <div className="flex items-center gap-3 text-slate">
              <a
                href="https://github.com/akioxz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal transition-colors duration-200"
                aria-label="GitHub"
              >
                <VscGithub className="w-5 h-5" />
              </a>
              <a
                href="mailto:dev.akioxz@gmail.com"
                className="hover:text-teal transition-colors duration-200"
                aria-label="Email"
              >
                <VscMail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap items-baseline gap-2 mb-6">
          <SplitText
            text="Freelance Web Developer"
            tag="h2"
            className="font-mono text-[1.35rem] font-normal text-cream tracking-tight leading-tight inline-flex items-baseline"
            splitType="words"
            delay={40}
            duration={0.6}
            ease="power3.out"
            from={{ opacity: 0, y: 24 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="left"
            threshold={0}
            rootMargin="0px"
          />
          <span className="inline-flex items-baseline font-mono text-[1.35rem] font-normal tracking-tight leading-tight">
            <span className="text-cream">—</span>
            <span className="text-slate">&nbsp;React &amp; Mobile</span>
          </span>
        </div>

        <motion.p
          variants={itemVariants}
          className="text-slate text-base leading-[1.85] mb-8 max-w-2xl"
        >
          4th-year BSIT student passionate about full-stack software engineering —
          building web and mobile applications with <Badge label="React" />{" "}
          and <Badge label="Supabase" />. Lately diving into AI integration and
          generative AI, exploring how these tools can be applied to real-world
          software development. Still learning, but actively building and shipping
          projects along the way.
        </motion.p>

        <motion.div variants={itemVariants}>
          <SpecularButton
            size="md"
            onClick={handleButtonClick}
            textColor="rgb(var(--text))"
            lineColor="rgb(var(--text))"
            baseColor="rgb(var(--text-secondary))"
            radius={8}
            className="group select-none"
          >
            <RotatingText
              ref={rotatingTextRef}
              texts={rotatingTexts}
              auto={false}
              loop={false}
              splitBy="words"
              transition={{ type: "spring", damping: 28, stiffness: 380 }}
              staggerDuration={0.02}
              mainClassName="inline-flex items-center"
              elementLevelClassName="inline-block"
            />
            <VscArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
          </SpecularButton>
        </motion.div>
      </div>

      {/* Right: Education + Experience Sidebar */}
      <HeroSidebar />
    </motion.section>
  );
}
