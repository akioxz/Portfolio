"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import SplitText from "./react-bits/SplitText";
import Masonry from "./react-bits/Masonry";
import SpotlightCard from "./react-bits/SpotlightCard";

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
  const [previewImages, setPreviewImages] = useState<string[]>(
    galleryItems.slice(0, 4).map((item) => item.img),
  );
  const [isFading, setIsFading] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const galleryButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsGalleryOpen(false);
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      galleryButtonRef.current?.focus();
    };
  }, [isGalleryOpen]);

  const pickPreviewImages = () => {
    const shuffled = [...galleryItems];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [
        shuffled[swapIndex],
        shuffled[index],
      ];
    }

    return shuffled.slice(0, 4).map((item) => item.img);
  };

  useEffect(() => {
    setPreviewImages(pickPreviewImages());
  }, [galleryItems]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let isVisible = false;
    let timeoutId: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "200px" },
    );
    observer.observe(section);

    const intervalId = window.setInterval(() => {
      if (!isVisible || document.hidden) return;
      setIsFading(true);
      timeoutId = window.setTimeout(() => {
        setPreviewImages(pickPreviewImages());
        setIsFading(false);
      }, 250);
    }, 4500);

    return () => {
      observer.disconnect();
      window.clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section ref={sectionRef} id="beyond" className="mb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10 sm:gap-12">
        <div className="max-w-sm leading-relaxed text-slate">
          <SplitText
            text="Beyond the Code"
            tag="h2"
            className="text-xl font-mono text-cream mb-4"
            splitType="words"
            delay={40}
            duration={0.5}
            from={{ opacity: 0, y: 16 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
          />
          <p className="text-cream text-sm mb-4">
            Beyond development, I spend my downtime with movies, anime, and
            online games — and I collect anime figurines on the side. It
            keeps things balanced and gives me space to think outside the
            code.
          </p>
          <p className="text-slate text-sm">
            A lot of my best debugging happens away from the keyboard —
            stepping back into something unrelated is usually what gets me
            unstuck.
          </p>
        </div>

        <SpotlightCard
          className="rounded-xl w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] self-center sm:self-auto"
          spotlightColor="rgba(255, 255, 255, 0.1)"
        >
          <button
            ref={galleryButtonRef}
            type="button"
            onClick={() => setIsGalleryOpen(true)}
            className="group w-full h-full overflow-hidden rounded-xl border border-slate/10 bg-surface/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate/25 cursor-pointer"
            aria-label="View photo gallery"
          >
            <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-full h-full">
              {previewImages.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className={`relative overflow-hidden bg-slate/10 transition-opacity duration-500 ${isFading ? "opacity-0" : "opacity-100"}`}
                >
                  <Image
                    src={src}
                    alt={galleryItems.find((item) => item.img === src)?.alt ?? "Hobby photo preview"}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </button>
        </SpotlightCard>
      </div>

      {isGalleryOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/85 p-4 sm:p-8 backdrop-blur-md"
            onClick={() => setIsGalleryOpen(false)}
          >
            <div
              ref={dialogRef}
              className="relative w-full max-w-5xl h-[80vh] min-h-[400px] overflow-hidden rounded-2xl border border-slate/20 bg-surface/95 p-4 sm:p-6 shadow-2xl flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-title"
              tabIndex={-1}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate/10 mb-3">
                <h2 id="gallery-title" className="font-mono text-xs text-cream font-medium tracking-wider uppercase">
                  Gallery — Beyond the Code
                </h2>
                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(false)}
                  className="rounded-full border border-slate/20 bg-surface px-3 py-1 font-mono text-xs text-slate transition hover:text-cream hover:border-slate/40 cursor-pointer"
                  aria-label="Close gallery"
                >
                  Esc / Close ✕
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