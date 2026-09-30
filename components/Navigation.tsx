"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { motion, AnimatePresence } from "motion/react";
import { VscMenu, VscClose } from "react-icons/vsc";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Stack", href: "/#stack" },
  { label: "Certifications", href: "/#certifications" },
  { label: "Contact", href: "/#contact" },
];

export function Sidebar() {
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      
      const isHome = pathname === "/";
      const targetId = href.replace("/#", "");

      if (isHome) {
        lenis?.scrollTo(`#${targetId}`, { duration: 1.2, offset: -96 });
      } else {
        router.push(href);
      }
    },
    [lenis, pathname, router]
  );

  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] hidden lg:flex flex-col justify-between border-r border-slate/10 p-10 z-50 bg-white/50 dark:bg-ink/50 backdrop-blur-xl">
      <div className="flex flex-col gap-12">
        <Link href="/" className="font-mono font-bold text-neutral-900 dark:text-cream text-xl hover:text-teal transition-colors">
          AJV
        </Link>
        
        <nav className="flex flex-col gap-5 font-mono text-sm text-slate">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-teal transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsOpen(false);
      
      const isHome = pathname === "/";
      const targetId = href.replace("/#", "");

      // Slight delay to allow menu animation to finish
      setTimeout(() => {
        if (isHome) {
          lenis?.scrollTo(`#${targetId}`, { duration: 1.2, offset: -96 });
        } else {
          router.push(href);
        }
      }, 300);
    },
    [lenis, pathname, router]
  );

  return (
    <>
      {/* Floating Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/80 dark:bg-ink/80 backdrop-blur-md border border-slate/10 flex items-center justify-center text-neutral-900 dark:text-cream shadow-lg active:scale-95 transition-transform"
        aria-label="Open menu"
      >
        <VscMenu className="w-5 h-5" />
      </button>

      {/* Full Screen Blur Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-white/90 dark:bg-ink/90 backdrop-blur-2xl flex flex-col justify-between p-8"
          >
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setIsOpen(false)} className="font-mono font-bold text-neutral-900 dark:text-cream text-xl">
                AJV
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 rounded-full flex items-center justify-center text-neutral-900 dark:text-cream active:scale-95 transition-transform"
                aria-label="Close menu"
              >
                <VscClose className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col items-center gap-8 font-mono text-2xl text-neutral-900 dark:text-cream">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="hover:text-teal transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-6 pb-12"
            >
              <ThemeToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
