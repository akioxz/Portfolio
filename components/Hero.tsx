"use client";

import React from "react";
import { motion } from "motion/react";
import HoverWipeProfile from "./HoverWipeProfile";

export default function Hero() {
  const [isFirstLoad, setIsFirstLoad] = React.useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("splashShown");
    }
    return true;
  });
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.section
      id="hero"
      className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start max-w-4xl"
      initial={isMounted ? "hidden" : false}
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: isFirstLoad ? 1.5 : 0.1,
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {/* Left: Interactive Pixel Portrait */}
      <motion.div 
        className="shrink-0"
        variants={{
          hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
        }}
      >
        <div className="relative w-[200px] h-[240px] md:w-[240px] md:h-[300px]">
          <HoverWipeProfile 
            imageSrc="/profile.png" 
            videoSrc="/profile-anime.gif" 
          />
        </div>
      </motion.div>

      {/* Right: Typography & Bio */}
      <div className="flex-1 flex flex-col justify-center pt-4 md:pt-2">
        <motion.h1 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="font-mono text-[2.5rem] sm:text-[2.75rem] leading-none font-medium text-neutral-900 dark:text-white mb-6 tracking-tight"
        >
          Axel Villanueva
        </motion.h1>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="flex flex-col gap-6 text-zinc-500 text-[15px] leading-relaxed max-w-lg font-sans font-medium"
        >
          <p>
            4th-year IT student building production-grade web &amp; mobile software. Still learning every day {"\u2014"} currently deep into high-performance interfaces and generative AI.
          </p>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="mt-10 flex flex-wrap items-center gap-6 font-mono text-xs text-zinc-500"
        >
          {[
            { name: "email", url: "mailto:dev.akioxz@gmail.com" },
            { name: "discord", url: "https://discordapp.com/users/your_discord_id_here" },
            { name: "github", url: "https://github.com/akioxz" },
          ].map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, color: "var(--cream)" }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-1 hover:text-neutral-900 dark:hover:text-cream transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              {link.name} <span className="opacity-50 group-hover:opacity-100 transition-opacity">&#8599;</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
