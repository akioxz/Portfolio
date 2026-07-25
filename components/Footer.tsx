"use client";

import React, { useState } from "react";
import { VscMail, VscGithub, VscCommentDiscussion, VscChevronRight } from "react-icons/vsc";
import SplitText from "./react-bits/SplitText";
import GlareHover from "./react-bits/GlareHover";
import ContactModal from "./ContactModal";

export default function Footer() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <footer
      id="contact"
      className="border-t border-slate/15 pt-12 mt-12 pb-16 scroll-mt-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 md:gap-12 items-start mb-12">
        <div className="max-w-md">
          <SplitText
            text="Let's work together."
            tag="h2"
            className="text-2xl font-mono text-cream mb-4 font-medium"
            splitType="words"
            delay={40}
            duration={0.5}
            from={{ opacity: 0, y: 16 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
          />
          <p className="text-slate text-sm leading-relaxed">
            I'm always open to discussing new opportunities, full-stack
            projects, or mobile development collaborations. Feel free to reach
            out.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <button
            type="button"
            onClick={() => setIsContactModalOpen(true)}
            aria-label="Open contact message form"
            className="block w-full text-left rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-teal cursor-pointer"
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
                  <VscCommentDiscussion className="w-5 h-5 text-teal shrink-0" />
                  <div className="text-left">
                    <div className="font-mono text-[9px] text-slate tracking-wider">
                      MESSAGE
                    </div>
                    <div className="font-mono text-xs text-cream font-medium">
                      Send a message
                    </div>
                  </div>
                </div>
                <VscChevronRight className="w-4 h-4 text-slate group-hover:text-teal group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </GlareHover>
          </button>

          <a
            href="mailto:dev.akioxz@gmail.com"
            aria-label="Send email to dev.akioxz@gmail.com"
            className="block rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-teal"
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
                  <VscMail className="w-5 h-5 text-teal shrink-0" />
                  <div className="text-left">
                    <div className="font-mono text-[9px] text-slate tracking-wider">
                      EMAIL
                    </div>
                    <div className="font-mono text-xs text-cream font-medium">
                      dev.akioxz@gmail.com
                    </div>
                  </div>
                </div>
                <VscChevronRight className="w-4 h-4 text-slate group-hover:text-teal group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </GlareHover>
          </a>

          <a
            href="https://github.com/akioxz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit GitHub profile @akioxz"
            className="block rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-teal"
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
                  <VscGithub className="w-5 h-5 text-teal shrink-0" />
                  <div className="text-left">
                    <div className="font-mono text-[9px] text-slate tracking-wider">
                      GITHUB
                    </div>
                    <div className="font-mono text-xs text-cream font-medium">
                      @akioxz
                    </div>
                  </div>
                </div>
                <VscChevronRight className="w-4 h-4 text-slate group-hover:text-teal group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </GlareHover>
          </a>
        </div>
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


