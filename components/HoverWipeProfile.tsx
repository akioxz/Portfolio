"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

interface HoverWipeProfileProps {
  imageSrc: string;
  videoSrc: string;
}

export default function HoverWipeProfile({ imageSrc, videoSrc }: HoverWipeProfileProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-full h-full overflow-hidden cursor-crosshair bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Layer (Anime Video or GIF) */}
      {videoSrc.endsWith('.mp4') || videoSrc.endsWith('.webm') ? (
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-right scale-105"
        />
      ) : (
        <Image
          src={videoSrc}
          alt="Anime Wallpaper"
          fill
          unoptimized
          className="object-cover object-right scale-105"
        />
      )}

      {/* Foreground Layer (Dithered Photo) with Wipe Transition */}
      <motion.div
        initial={false}
        animate={{
          // Pushed boundaries to -5% and 105% to avoid browser 1px rendering artifacts
          clipPath: isHovered 
            ? "polygon(105% -5%, 105% -5%, 105% 105%, 105% 105%)" 
            : "polygon(-5% -5%, 105% -5%, 105% 105%, -5% 105%)"
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full bg-white dark:bg-ink"
      >
        <Image
          src={imageSrc}
          alt="Profile"
          fill
          priority
          sizes="(max-width: 768px) 200px, 240px"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
