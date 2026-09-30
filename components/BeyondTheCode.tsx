"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import SplitText from "./react-bits/SplitText";

const galleryItems = [
  { id: "photo3", img: "/photo3.jpg", alt: "Dual-monitor gaming setup with anime wallpaper" },
  { id: "photo4", img: "/photo4.jpg", alt: "Casual selfie in a room" },
  { id: "photo5", img: "/photo5.jpg", alt: "Genshin Impact Cafe cups and merchandise" },
  { id: "photo6", img: "/photo6.jpg", alt: "Desktop gaming setup with glowing keyboard" },
  { id: "photo7", img: "/photo7.jpg", alt: "Anime figure collection (Date A Live)" },
  { id: "photo8", img: "/photo8.jpeg", alt: "Casual selfie" },
  { id: "photo9", img: "/photo9.jpeg", alt: "Anime figurines on display (Demon Slayer, Lycoris Recoil)" },
  { id: "photo10", img: "/photo10.jpeg", alt: "National Museum of Natural History, Manila" },
  { id: "photo11", img: "/photo11.jpeg", alt: "PC gaming setup" },
];

export default function BeyondTheCode() {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const marqueeItems = [...galleryItems, ...galleryItems];

  return (
    <section ref={sectionRef} id="afk" className="mb-24 scroll-mt-24 overflow-hidden w-full" aria-label="AFK / Beyond the Code">
      <div className="flex flex-col gap-10">
        
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="max-w-xl">
            <SplitText
              text="AFK"
              tag="h2"
              className="text-3xl sm:text-4xl font-mono text-neutral-900 dark:text-cream mb-4 tracking-tight"
              splitType="words"
              delay={40}
              duration={0.5}
              from={{ opacity: 0, y: 16 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
            />
            <p className="text-slate dark:text-slate/80 text-sm md:text-base leading-relaxed font-sans">
              A lot of my best debugging happens when I step away. Here's what keeps me balanced outside of the code - anime, gaming setups, and a bit of exploring.
            </p>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 border border-black/5 dark:border-white/10 text-neutral-900 dark:text-white text-xs font-mono tracking-widest uppercase backdrop-blur-md transition-all duration-300 flex-shrink-0"
          >
            <span>{isExpanded ? "Collapse" : "View All"}</span>
            <motion.span 
              animate={{ rotate: isExpanded ? -90 : 0 }} 
              className="inline-block transition-transform duration-300"
            >
              &#8594;
            </motion.span>
          </button>
        </div>

        <div className="w-full relative">
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.div 
                key="marquee"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full -mx-4 px-4 sm:-mx-8 sm:px-8 md:mx-0 md:px-0 relative"
              >
                <motion.div
                  className="flex gap-4 md:gap-6 w-max"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ ease: "linear", duration: 40, repeat: Infinity }}
                >
                  {marqueeItems.map((item, index) => (
                    <div
                      key={item.id + "-" + index}
                      className="relative flex-none h-[280px] md:h-[320px] rounded-[1.5rem] overflow-hidden bg-[#0A0A0A] ring-1 ring-white/10"
                    >
                      <Image 
                        src={item.img} 
                        alt={item.alt} 
                        width={0} 
                        height={0} 
                        sizes="(max-width: 640px) 100vw, 50vw" 
                        quality={50}
                        style={{ height: '100%', width: 'auto', display: 'block' }}
                        className="grayscale-[0.8] brightness-75 hover:grayscale-0 hover:brightness-110 hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                      />
                    </div>
                  ))}
                </motion.div>
                
                <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-neutral-50 dark:from-[#0F1115] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-neutral-50 dark:from-[#0F1115] to-transparent pointer-events-none z-10" />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 w-full space-y-3 sm:space-y-4 pt-4"
              >
                {galleryItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="break-inside-avoid relative rounded-[1.25rem] overflow-hidden bg-[#0A0A0A] ring-1 ring-white/10 group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
                  >
                    <Image 
                      src={item.img} 
                      alt={item.alt} 
                      width={0} 
                      height={0} 
                      sizes="(max-width: 640px) 50vw, 33vw" 
                      quality={75}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                      className="grayscale-[0.8] brightness-75 hover:grayscale-0 hover:brightness-110 hover:scale-105 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]" 
                    />
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] pointer-events-none transition-opacity duration-700 group-hover:opacity-0" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}