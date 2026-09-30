"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import SplitText from "./react-bits/SplitText";
import Masonry from "./react-bits/Masonry";

const galleryItems = [
  { id: "photo3", img: "/photo3.jpg", alt: "Gaming setup with a monitor", aspectRatio: 0.6 },
  { id: "photo4", img: "/photo4.jpg", alt: "Personal photo in a room", aspectRatio: 0.7 },
  { id: "photo5", img: "/photo5.jpg", alt: "Historic church exterior", aspectRatio: 0.63 },
  { id: "photo6", img: "/photo6.jpg", alt: "Desktop gaming setup", aspectRatio: 0.53 },
  { id: "photo7", img: "/photo7.jpg", alt: "Anime figure collection", aspectRatio: 0.77 },
  { id: "photo8", img: "/photo8.jpeg", alt: "Personal photo outdoors", aspectRatio: 0.57 },
  { id: "photo9", img: "/photo9.jpeg", alt: "Anime figurines on display", aspectRatio: 0.67 },
  { id: "photo10", img: "/photo10.jpeg", alt: "Gaming setup with keyboard and monitor", aspectRatio: 0.6 },
  { id: "photo11", img: "/photo11.jpeg", alt: "Personal hobby photo", aspectRatio: 0.73 },
];

export default function BeyondTheCode() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Curated static images for the bento grid preview (no more auto-fading)
  const previewImages = [
    galleryItems[6].img, // Anime figurines (Tall slot)
    galleryItems[1].img, // Personal photo (Wide slot)
    galleryItems[2].img, // Church (Small slot)
    galleryItems[0].img, // Gaming setup (Small slot)
  ];

  // 3D Magnetic Hover Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsGalleryOpen(false);
        return;
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGalleryOpen]);

  return (
    <section ref={sectionRef} id="beyond" className="mb-24 scroll-mt-24" aria-label="Beyond the Code">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left: Typography */}
        <div className="w-full lg:w-[40%] flex flex-col justify-center">
          <SplitText
            text="Beyond the Code"
            tag="h2"
            className="text-3xl sm:text-4xl font-mono text-neutral-900 dark:text-cream mb-6 tracking-tight"
            splitType="words"
            delay={40}
            duration={0.5}
            from={{ opacity: 0, y: 16 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
          />
          <div className="flex flex-col gap-5 text-slate dark:text-slate/80 text-sm md:text-base leading-relaxed font-sans">
            <p>
              Beyond development, I spend my downtime with movies, anime, and
              online games {"\u2014"} and I collect anime figurines on the side. It
              keeps things balanced and gives me space to think outside the
              code.
            </p>
            <p>
              A lot of my best debugging happens away from the keyboard {"\u2014"}
              stepping back into something unrelated is usually what gets me
              unstuck.
            </p>
          </div>
        </div>

        {/* Right: Asymmetric Bento Gallery Preview with 3D Physics */}
        <div className="w-full lg:w-[60%] shrink-0" style={{ perspective: 1000 }}>
          <motion.div
            onClick={() => setIsGalleryOpen(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="w-full relative group cursor-pointer focus:outline-none"
            aria-label="View photo gallery"
          >
            {/* Bento Grid layout: 3 columns, 2 rows */}
            <div className="grid grid-cols-3 grid-rows-2 gap-3 sm:gap-4 h-[340px] sm:h-[460px] w-full" style={{ transform: "translateZ(30px)" }}>
              
              {/* Image 1: Tall (col-span-1, row-span-2) */}
              <div className="relative col-span-1 row-span-2 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-surface/30 shadow-lg">
                <Image
                  src={previewImages[0]}
                  alt="Gallery preview 1"
                  fill
                  sizes="(max-width: 768px) 33vw, 20vw"
                  className="object-cover transition-all duration-700 grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105"
                />
              </div>

              {/* Image 2: Wide (col-span-2, row-span-1) */}
              <div className="relative col-span-2 row-span-1 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-surface/30 shadow-lg">
                <Image
                  src={previewImages[1]}
                  alt="Gallery preview 2"
                  fill
                  sizes="(max-width: 768px) 66vw, 40vw"
                  className="object-cover transition-all duration-700 grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105"
                />
              </div>

              {/* Image 3: Small Square (col-span-1, row-span-1) */}
              <div className="relative col-span-1 row-span-1 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-surface/30 shadow-lg">
                <Image
                  src={previewImages[2]}
                  alt="Gallery preview 3"
                  fill
                  sizes="(max-width: 768px) 33vw, 20vw"
                  className="object-cover transition-all duration-700 grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105"
                />
              </div>

              {/* Image 4: Small Square (col-span-1, row-span-1) */}
              <div className="relative col-span-1 row-span-1 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-surface/30 shadow-lg">
                <Image
                  src={previewImages[3]}
                  alt="Gallery preview 4"
                  fill
                  sizes="(max-width: 768px) 33vw, 20vw"
                  className="object-cover transition-all duration-700 grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105"
                />
              </div>

            </div>
            
            {/* Hover Action Pill (lifted closer to user in 3D space) */}
            <div 
              className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
              style={{ transform: "translateZ(60px)" }}
            >
              <span className="px-5 py-2.5 rounded-full bg-neutral-900/90 dark:bg-ink/90 text-white dark:text-cream text-[10px] sm:text-xs font-mono tracking-widest uppercase border border-white/10 backdrop-blur-md shadow-2xl">
                View Gallery &#8599;
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {isGalleryOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-white/90 dark:bg-ink/85 p-4 sm:p-8 backdrop-blur-md"
            onClick={() => setIsGalleryOpen(false)}
          >
            <div
              ref={dialogRef}
              className="relative w-full max-w-5xl h-[80vh] min-h-[400px] overflow-hidden rounded-2xl border border-slate/10 dark:border-slate/20 bg-neutral-50/95 dark:bg-surface/95 p-4 sm:p-6 shadow-2xl flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-title"
              tabIndex={-1}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate/10 mb-3">
                <h2 id="gallery-title" className="font-mono text-xs text-neutral-900 dark:text-cream font-medium tracking-wider uppercase">
                  Gallery {"\u2014"} Beyond the Code
                </h2>
                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(false)}
                  className="rounded-full border border-slate/20 bg-white dark:bg-surface px-3 py-1 font-mono text-xs text-slate transition hover:text-neutral-900 dark:hover:text-cream hover:border-slate/40 cursor-pointer"
                  aria-label="Close gallery"
                >
                  Esc / Close {"\u2715"}
                </button>
              </div>
              <div className="flex-1 w-full relative overflow-y-auto">
                <Masonry items={galleryItems} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
