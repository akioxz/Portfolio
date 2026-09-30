"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import SplitText from "./react-bits/SplitText";
import { VscChevronLeft, VscChevronRight, VscClose } from "react-icons/vsc";

const galleryItems = [
  { id: "photo3", img: "/photo3.jpg", alt: "Gaming setup with a monitor" },
  { id: "photo4", img: "/photo4.jpg", alt: "Personal photo in a room" },
  { id: "photo5", img: "/photo5.jpg", alt: "Historic church exterior" },
  { id: "photo6", img: "/photo6.jpg", alt: "Desktop gaming setup" },
  { id: "photo7", img: "/photo7.jpg", alt: "Anime figure collection" },
  { id: "photo8", img: "/photo8.jpeg", alt: "Personal photo outdoors" },
  { id: "photo9", img: "/photo9.jpeg", alt: "Anime figurines on display" },
  { id: "photo10", img: "/photo10.jpeg", alt: "Gaming setup with keyboard and monitor" },
  { id: "photo11", img: "/photo11.jpeg", alt: "Personal hobby photo" },
];

export default function BeyondTheCode() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const sectionRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const previewImages = [
    galleryItems[6].img,
    galleryItems[1].img,
    galleryItems[2].img,
    galleryItems[0].img,
  ];

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

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setGalleryIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = galleryItems.length - 1;
      if (nextIndex >= galleryItems.length) nextIndex = 0;
      return nextIndex;
    });
  }, []);

  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsGalleryOpen(false);
      } else if (event.key === "ArrowRight") {
        paginate(1);
      } else if (event.key === "ArrowLeft") {
        paginate(-1);
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
  }, [isGalleryOpen, paginate]);

  const sliderVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section ref={sectionRef} id="beyond" className="mb-24 scroll-mt-24" aria-label="Beyond the Code">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
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

        <div className="w-full lg:w-[60%] shrink-0" style={{ perspective: 1000 }}>
          <motion.div
            onClick={() => {
              setGalleryIndex(0);
              setDirection(0);
              setIsGalleryOpen(true);
            }}
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
            <div className="grid grid-cols-3 grid-rows-2 gap-3 sm:gap-4 h-[340px] sm:h-[460px] w-full" style={{ transform: "translateZ(30px)" }}>
              
              <div className="relative col-span-1 row-span-2 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-surface/30 shadow-lg">
                <Image
                  src={previewImages[0]}
                  alt="Gallery preview 1"
                  fill
                  sizes="(max-width: 768px) 33vw, 20vw"
                  className="object-cover transition-all duration-700 grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105"
                />
              </div>

              <div className="relative col-span-2 row-span-1 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-surface/30 shadow-lg">
                <Image
                  src={previewImages[1]}
                  alt="Gallery preview 2"
                  fill
                  sizes="(max-width: 768px) 66vw, 40vw"
                  className="object-cover transition-all duration-700 grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105"
                />
              </div>

              <div className="relative col-span-1 row-span-1 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-surface/30 shadow-lg">
                <Image
                  src={previewImages[2]}
                  alt="Gallery preview 3"
                  fill
                  sizes="(max-width: 768px) 33vw, 20vw"
                  className="object-cover transition-all duration-700 grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105"
                />
              </div>

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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/95 dark:bg-ink/95 backdrop-blur-xl"
            onClick={() => setIsGalleryOpen(false)}
          >
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
              <div className="font-mono text-xs text-white/70 tracking-widest pointer-events-auto select-none">
                {String(galleryIndex + 1).padStart(2, "0")} / {String(galleryItems.length).padStart(2, "0")}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsGalleryOpen(false);
                }}
                className="pointer-events-auto rounded-full bg-white/10 hover:bg-white/20 p-3 text-white backdrop-blur-md transition-all active:scale-90"
                aria-label="Close gallery"
              >
                <VscClose className="w-6 h-6" />
              </button>
            </div>

            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 hover:bg-white/20 p-3 text-white backdrop-blur-md transition-all active:scale-90 hidden sm:block"
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
            >
              <VscChevronLeft className="w-8 h-8" />
            </button>
            
            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 hover:bg-white/20 p-3 text-white backdrop-blur-md transition-all active:scale-90 hidden sm:block"
              onClick={(e) => {
                e.stopPropagation();
                paginate(1);
              }}
            >
              <VscChevronRight className="w-8 h-8" />
            </button>

            <div 
              ref={dialogRef}
              className="relative w-full h-full flex items-center justify-center overflow-hidden outline-none"
              tabIndex={-1}
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={galleryIndex}
                  custom={direction}
                  variants={sliderVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.4 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute w-full max-w-5xl h-[70vh] md:h-[85vh] p-4 cursor-grab active:cursor-grabbing flex items-center justify-center"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={galleryItems[galleryIndex].img}
                      alt={galleryItems[galleryIndex].alt}
                      fill
                      sizes="100vw"
                      className="object-contain drop-shadow-2xl select-none"
                      draggable={false}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="absolute bottom-8 left-0 w-full text-center z-50 pointer-events-none">
              <motion.p
                key={galleryIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/80 font-mono text-sm tracking-wide bg-black/30 inline-block px-4 py-1.5 rounded-full backdrop-blur-md"
              >
                {galleryItems[galleryIndex].alt}
              </motion.p>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
