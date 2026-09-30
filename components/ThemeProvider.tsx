"use client";

import { ThemeProvider as NextThemesProvider } from "@wrksz/themes/next";
import type { ThemeProviderProps } from "@wrksz/themes/next";

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Force cache bust: 1790785313655