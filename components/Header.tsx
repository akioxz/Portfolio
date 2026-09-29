"use client";

import { useState, useCallback } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import { useLenis } from "lenis/react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const lenis = useLenis();

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsOpen(false);

      if (href === "#hero") {
        lenis?.scrollTo(0, { duration: 1.2 });
      } else {
        lenis?.scrollTo(href, { duration: 1.2, offset: -96 });
      }
    },
    [lenis],
  );

  const navLinks = [
    { label: "projects", href: "#projects" },
    { label: "stack", href: "#stack" },
    { label: "contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-ink/60 backdrop-blur-xl border-b border-slate/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="font-mono font-bold text-cream text-sm tracking-widest select-none hover:text-teal transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            AJV
          </a>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-[0.1em] text-slate">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="hover:text-teal transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 pl-2 md:border-l md:border-slate/20">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex items-center justify-center w-8 h-8 text-slate hover:text-teal transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <IoClose className="w-5 h-5" />
                ) : (
                  <IoMenu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-slate/10 pt-4 flex flex-col gap-4 font-mono text-xs uppercase tracking-[0.1em] text-slate">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="hover:text-teal transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
