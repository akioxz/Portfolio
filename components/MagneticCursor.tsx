"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Detect mobile device
    if (window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window) {
      cursor.style.display = 'none';
      dot.style.display = 'none';
      return;
    }

    // Set initial GSAP state
    gsap.set([cursor, dot], { xPercent: -50, yPercent: -50, opacity: 0 });

    // Track mouse coordinates
    const mouse = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };
    const dotPos = { x: 0, y: 0 };

    // Create QuickSetters for performance
    const xSetCursor = gsap.quickSetter(cursor, "x", "px");
    const ySetCursor = gsap.quickSetter(cursor, "y", "px");
    const xSetDot = gsap.quickSetter(dot, "x", "px");
    const ySetDot = gsap.quickSetter(dot, "y", "px");

    let isVisible = false;
    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      if (!isVisible) {
        gsap.to([cursor, dot], { opacity: 1, duration: 0.3 });
        isVisible = true;
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    // Ticker for smooth interpolation
    gsap.ticker.add(() => {
      // Fast follow for dot
      dotPos.x += (mouse.x - dotPos.x) * 0.5;
      dotPos.y += (mouse.y - dotPos.y) * 0.5;
      xSetDot(dotPos.x);
      ySetDot(dotPos.y);

      // Smooth lag for outer ring
      cursorPos.x += (mouse.x - cursorPos.x) * 0.15;
      cursorPos.y += (mouse.y - cursorPos.y) * 0.15;
      xSetCursor(cursorPos.x);
      ySetCursor(cursorPos.y);
    });

    // Magnetic effect on links/buttons
    const elements = document.querySelectorAll("a, button, [data-magnetic]");
    
    elements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        isHovering = true;
        gsap.to(cursor, { scale: 2.5, backgroundColor: "rgba(255,255,255,0.1)", duration: 0.3, ease: "power2.out" });
        gsap.to(dot, { scale: 0, duration: 0.2 });
      });
      el.addEventListener("mouseleave", () => {
        isHovering = false;
        gsap.to(cursor, { scale: 1, backgroundColor: "transparent", duration: 0.3, ease: "power2.out" });
        gsap.to(dot, { scale: 1, duration: 0.2 });
      });
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cream/30 pointer-events-none z-[9999] mix-blend-difference hidden md:block" 
      />
      <div 
        ref={dotRef} 
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-cream pointer-events-none z-[10000] mix-blend-difference hidden md:block" 
      />
    </>
  );
}
