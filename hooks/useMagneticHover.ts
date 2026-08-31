"use client";

import { useRef, useCallback } from "react";
import { useMotionValue, useSpring, type MotionValue } from "motion/react";

interface MagneticHoverResult {
  ref: React.RefObject<HTMLDivElement>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  iconX: MotionValue<number>;
  iconY: MotionValue<number>;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerLeave: () => void;
}

const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };

export function useMagneticHover(
  strength = 0.3,
  maxDisplacement = 12,
  iconRatio = 0.4
): MagneticHoverResult {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawIconX = useMotionValue(0);
  const rawIconY = useMotionValue(0);

  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);
  const iconX = useSpring(rawIconX, springConfig);
  const iconY = useSpring(rawIconY, springConfig);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      const clampedX =
        Math.sign(distX) * Math.min(Math.abs(distX * strength), maxDisplacement);
      const clampedY =
        Math.sign(distY) * Math.min(Math.abs(distY * strength), maxDisplacement);

      rawX.set(clampedX);
      rawY.set(clampedY);
      rawIconX.set(clampedX * iconRatio);
      rawIconY.set(clampedY * iconRatio);
    },
    [strength, maxDisplacement, iconRatio, rawX, rawY, rawIconX, rawIconY]
  );

  const handlePointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    rawIconX.set(0);
    rawIconY.set(0);
  }, [rawX, rawY, rawIconX, rawIconY]);

  return { ref, x, y, iconX, iconY, handlePointerMove, handlePointerLeave };
}
