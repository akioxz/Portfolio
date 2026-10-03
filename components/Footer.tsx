"use client";

import { useState } from "react";
import { useScrambleText } from "@/hooks/useScrambleText";
import CopyEmail from "@/components/CopyEmail";

export default function Footer() {
  const [isHovered, setIsHovered] = useState(false);
  const scramble = useScrambleText("Let's build something", 600);

  const handlePointerEnter = () => {
    setIsHovered(true);
    scramble.start();
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    scramble.stop();
  };

  const openContact = () => {
    window.location.href = "/contact";
  };

  return (
    <footer id="footer" className="w-full flex flex-col items-center justify-center pt-24 pb-8 mt-12 border-t border-black/5 dark:border-white/5 relative">
      <button
        onClick={openContact}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className="group relative flex flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white rounded-2xl p-4 w-full"
      >
        <span className="font-sans text-xs font-semibold text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Next Steps
        </span>
        
        <div className="flex items-center justify-center gap-4 w-full overflow-hidden px-4 py-4">
          <h2 className="font-sans text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-neutral-900 dark:text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-active:scale-95 group-hover:-translate-y-2 whitespace-nowrap">
            {scramble.displayText}
          </h2>
          <div className="hidden sm:flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/10 group-hover:bg-neutral-200 dark:group-hover:bg-white/10 group-hover:-translate-y-2 group-active:scale-95 transition-all duration-500">
            <svg 
              className="w-5 h-5 md:w-6 md:h-6 text-neutral-900 dark:text-white group-hover:rotate-45 transition-transform duration-500" 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </div>
        </div>
      </button>

      <div className="w-full flex flex-col sm:flex-row items-center justify-between text-zinc-400 font-sans text-xs font-medium mt-32 px-4 gap-6 sm:gap-0">
        <p>&copy; {new Date().getFullYear()} Axel Villanueva.</p>
        <div className="flex items-center gap-6">
          <CopyEmail className="hover:text-neutral-900 dark:hover:text-white transition-colors" />
          <a href="https://discordapp.com/users/your_discord_id_here" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Discord</a>
          <a href="https://github.com/akioxz" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
