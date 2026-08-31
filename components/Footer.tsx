"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { VscMail, VscGithub, VscCommentDiscussion, VscChevronRight } from "react-icons/vsc";
import SplitText from "./react-bits/SplitText";
import GlareHover from "./react-bits/GlareHover";
import ContactModal from "./ContactModal";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import { useScrambleText } from "@/hooks/useScrambleText";

/* ─── Pointer capability check (client-only) ─── */
function useCanHover() {
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);
  return canHover;
}

/* ─── Magnetic + Scramble wrapper for each contact card ─── */
function MagneticCard({
  label,
  sublabel,
  icon: Icon,
  children,
  canHover,
  reducedMotion,
}: {
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  canHover: boolean;
  reducedMotion: boolean | null;
}) {
  const magnetic = useMagneticHover(0.3, 12, 0.4);
  const scramble = useScrambleText(sublabel, 500);

  const enableEffects = canHover && !reducedMotion;

  return (
    <motion.div
      ref={magnetic.ref}
      onPointerMove={enableEffects ? magnetic.handlePointerMove : undefined}
      onPointerLeave={enableEffects ? () => { magnetic.handlePointerLeave(); scramble.stop(); } : undefined}
      onPointerEnter={enableEffects ? () => scramble.start() : undefined}
      style={enableEffects ? { x: magnetic.x, y: magnetic.y } : undefined}
    >
      <GlareHover
        width="100%"
        height="auto"
        background="rgb(var(--surface))"
        borderRadius="8px"
        borderColor="rgba(var(--text), 0.15)"
        glareColor="#ffffff"
        glareOpacity={0.08}
        glareAngle={-30}
        glareSize={150}
        transitionDuration={500}
        className="p-4 hover:border-cream/40 transition-colors duration-300 cursor-pointer"
      >
        <div className="flex items-center justify-between w-full select-none group">
          <div className="flex items-center gap-3">
            <motion.div
              style={enableEffects ? { x: magnetic.iconX, y: magnetic.iconY } : undefined}
            >
              <Icon className="w-5 h-5 text-teal shrink-0" />
            </motion.div>
            <div className="text-left">
              <div className="font-mono text-[9px] text-slate tracking-wider">
                {label}
              </div>
              <div className="font-mono text-xs text-cream font-medium">
                {enableEffects ? scramble.displayText : sublabel}
              </div>
            </div>
          </div>
          <VscChevronRight className="w-4 h-4 text-slate group-hover:text-teal group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </GlareHover>
      {children}
    </motion.div>
  );
}

export default function Footer() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const canHover = useCanHover();
  const reducedMotion = useReducedMotion();

  return (
    <footer
      id="contact"
      className="border-t border-slate/15 pt-16 mt-16 pb-16 scroll-mt-24"
    >
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <div className="max-w-2xl flex flex-col items-center">
          <SplitText
            text="Let's build something."
            tag="h2"
            className="text-4xl sm:text-5xl font-mono text-cream mb-6 font-bold tracking-tighter"
            splitType="words"
            delay={40}
            duration={0.5}
            from={{ opacity: 0, y: 16 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
          />
          <p className="text-slate text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            I&apos;m always open to discussing new opportunities, full-stack
            projects, or mobile development collaborations. Feel free to reach
            out.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-16">
        {/* Message Card */}
        <button
          type="button"
          onClick={() => setIsContactModalOpen(true)}
          aria-label="Open contact message form"
          className="block w-full text-left rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-teal cursor-pointer"
        >
          <MagneticCard
            label="MESSAGE"
            sublabel="Send a message"
            icon={VscCommentDiscussion}
            canHover={canHover}
            reducedMotion={reducedMotion}
          >
            {null}
          </MagneticCard>
        </button>

        {/* Email Card */}
        <a
          href="mailto:dev.akioxz@gmail.com"
          aria-label="Send email to dev.akioxz@gmail.com"
          className="block rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-teal"
        >
          <MagneticCard
            label="EMAIL"
            sublabel="dev.akioxz@gmail.com"
            icon={VscMail}
            canHover={canHover}
            reducedMotion={reducedMotion}
          >
            {null}
          </MagneticCard>
        </a>

        {/* GitHub Card */}
        <a
          href="https://github.com/akioxz"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit GitHub profile @akioxz"
          className="block rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-teal"
        >
          <MagneticCard
            label="GITHUB"
            sublabel="@akioxz"
            icon={VscGithub}
            canHover={canHover}
            reducedMotion={reducedMotion}
          >
            {null}
          </MagneticCard>
        </a>
      </div>

      <div className="flex justify-center text-center font-mono text-[10px] text-slate/60 select-none border-t border-slate/10 pt-6">
        <p>
          © {new Date().getFullYear()} Axel Villanueva. All rights reserved.
        </p>
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </footer>
  );
}
