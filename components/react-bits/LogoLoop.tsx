"use client";

import React, { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';

export type LogoItem =
  | {
      node: React.ReactNode;
      href?: string;
      title?: string;
      ariaLabel?: string;
    }
  | {
      src: string;
      alt?: string;
      href?: string;
      title?: string;
      ariaLabel?: string;
      srcSet?: string;
      width?: number;
      height?: number;
    };

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right';
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

const LogoLoop: React.FC<LogoLoopProps> = ({
  logos,
  speed = 80,
  direction = 'left',
  width = '100%',
  logoHeight = 28,
  gap = 36,
  pauseOnHover = true,
  fadeOut = false,
  fadeOutColor = 'rgb(var(--bg))',
  scaleOnHover = false,
  ariaLabel = 'Logo loop',
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Duplicate items to ensure smooth infinite loop
  const repeatedLogos = [...logos, ...logos, ...logos, ...logos];

  const scrollerStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${gap}px`,
    alignItems: 'center',
    width: 'max-content',
    animation: prefersReduced
      ? 'none'
      : `logo-marquee-${direction} ${speed}s linear infinite`,
    animationPlayState: pauseOnHover && isHovered ? 'paused' : 'running',
  };

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={ariaLabel}
      className={`relative overflow-hidden w-full ${className}`}
      style={{
        ...style,
        width: typeof width === 'number' ? `${width}px` : width,
        height: `${logoHeight + 16}px`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Styles inject for the marquee keyframes dynamically */}
      <style jsx global>{`
        @keyframes logo-marquee-left {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes logo-marquee-right {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>

      {/* Fade out gradients */}
      {fadeOut && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${fadeOutColor}, transparent)`
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to left, ${fadeOutColor}, transparent)`
            }}
          />
        </>
      )}

      <div
        ref={scrollerRef}
        style={scrollerStyle}
        className="h-full py-2"
      >
        {repeatedLogos.map((logo, index) => {
          const isNode = 'node' in logo;
          const content = isNode ? (
            logo.node
          ) : (
            <NextImage
              src={logo.src}
              alt={logo.alt || ''}
              width={logo.width || 1}
              height={logo.height || 1}
              unoptimized
              style={{ height: `${logoHeight}px`, width: 'auto' }}
              className="object-contain"
            />
          );

          const wrapperClass = `flex items-center justify-center transition-transform duration-300 ${
            scaleOnHover ? 'hover:scale-110' : ''
          }`;

          if (logo.href) {
            return (
              <a
                key={index}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                title={logo.title}
                aria-label={logo.ariaLabel || logo.title}
                className={wrapperClass}
              >
                {content}
              </a>
            );
          }

          return (
            <div key={index} title={logo.title} className={wrapperClass}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LogoLoop;
