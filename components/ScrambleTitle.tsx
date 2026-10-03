"use client";

import { useScrambleText } from "@/hooks/useScrambleText";
import { useEffect, useRef } from "react";
import { useInView } from "motion/react";

export default function ScrambleTitle({ 
  text, 
  as: Tag = "h2", 
  className = "text-2xl sm:text-[1.75rem] font-mono text-neutral-900 dark:text-cream" 
}: { 
  text: string; 
  as?: any; 
  className?: string; 
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scramble = useScrambleText(text, 600);

  useEffect(() => {
    if (isInView) {
      scramble.start();
    }
  }, [isInView]); // Removed scramble.start from dependency array to prevent infinite loops

  return (
    <Tag ref={ref} className={className}>
      {scramble.displayText}
    </Tag>
  );
}
