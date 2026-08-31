"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const CHARS = "#%^&*_+-=/\\<>@!~";

interface ScrambleResult {
  displayText: string;
  start: () => void;
  stop: () => void;
}

export function useScrambleText(
  finalText: string,
  duration = 500
): ScrambleResult {
  const [displayText, setDisplayText] = useState(finalText);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef(0);

  const totalTicks = Math.max(Math.round(duration / 28), 8); // ~18 ticks at 500ms

  const cleanup = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    tickRef.current = 0;
  }, []);

  const stop = useCallback(() => {
    cleanup();
    setDisplayText(finalText);
  }, [cleanup, finalText]);

  const start = useCallback(() => {
    // Clear any existing animation first (prevents stacking)
    cleanup();
    tickRef.current = 0;

    intervalRef.current = setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;

      if (tick >= totalTicks) {
        cleanup();
        setDisplayText(finalText);
        return;
      }

      // Progressive left-to-right lock
      const lockedCount = Math.floor((tick / totalTicks) * finalText.length);
      let result = "";

      for (let i = 0; i < finalText.length; i++) {
        if (i < lockedCount) {
          result += finalText[i];
        } else if (finalText[i] === " ") {
          result += " "; // preserve spaces
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplayText(result);
    }, duration / totalTicks);
  }, [cleanup, finalText, totalTicks, duration]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { displayText, start, stop };
}
