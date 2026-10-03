import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        cream: "rgb(var(--text) / <alpha-value>)",
        slate: "rgb(var(--text-secondary) / <alpha-value>)",
        amber: "rgb(var(--amber) / <alpha-value>)",
        teal: "rgb(var(--teal) / <alpha-value>)",
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "monospace"],
        sans: ["var(--font-inter)", "sans-serif"],
        pixel: ['"Geist Pixel"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
