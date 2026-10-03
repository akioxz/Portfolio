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
      className="relative w-full h-full overflow-hidden cursor-crosshair bg-transparent dark:bg-white rounded-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Layer: Dithered Photo (Always visible, seamlessly blends with transparent background) */}
      <img
        src={imageSrc}
        alt="Profile"
        className="absolute inset-0 w-full h-full object-cover object-[center_calc(100%+32px)]"
      />

      {/* Top Layer: Anime Video or GIF (Wipes IN to cover the photo on hover) */}
      <motion.div
        initial={false}
        animate={{
          clipPath: isHovered 
            ? "polygon(-5% -5%, 105% -5%, 105% 105%, -5% 105%)" // Fully visible
            : "polygon(-5% -5%, -5% -5%, -5% 105%, -5% 105%)" // Hidden (zero width on left)
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full z-10"
      >
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
      </motion.div>
    </div>
  );
}
