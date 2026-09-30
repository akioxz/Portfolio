"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { motion, AnimatePresence } from "motion/react";
import { VscMenu, VscClose, VscMail } from "react-icons/vsc";
import ThemeToggle from "./ThemeToggle";

const mainNavLinks = [
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Stack", href: "/#stack" },
  { label: "Certifications", href: "/#certifications" },
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
    <aside className="fixed top-0 left-0 h-screen w-56 hidden lg:flex flex-col justify-between border-r border-slate/10 dark:border-white/[0.06] px-7 py-8 z-50 bg-white/50 dark:bg-[#0c0c0c]/80 backdrop-blur-xl">
      <div className="flex flex-col gap-10">
        <Link href="/" className="font-mono font-medium text-neutral-900 dark:text-cream text-lg hover:text-teal transition-colors tracking-tight">
          Axel Villanueva
        </Link>
        
        <nav className="flex flex-col gap-4 font-mono text-[13px] text-slate/70">
          {mainNavLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-neutral-900 dark:hover:text-cream transition-colors w-fit"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Theme Toggle Pill */}
        <ThemeToggle />

        {/* Ask Anything (Command K) */}
        <button 
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="flex items-center gap-2 text-[12px] text-slate/50 hover:text-neutral-900 dark:hover:text-cream transition-colors group mb-2"
        >
          <span>Ask anything</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-slate/20 dark:border-white/10 bg-slate/5 dark:bg-white/5 font-mono text-[10px] text-slate/50 group-hover:text-neutral-900 dark:group-hover:text-cream transition-colors">⌘</kbd>
            <span className="text-[10px]">+</span>
            <kbd className="px-1.5 py-0.5 rounded border border-slate/20 dark:border-white/10 bg-slate/5 dark:bg-white/5 font-mono text-[10px] text-slate/50 group-hover:text-neutral-900 dark:group-hover:text-cream transition-colors">K</kbd>
          </span>
        </button>

        {/* Contact Info */}
        <div className="flex flex-col gap-3 font-mono text-[11px] text-slate/50">
          <p className="leading-relaxed pr-2">
            Got an idea? Let's build it together.
          </p>
          <a
            href="mailto:dev.akioxz@gmail.com"
            className="flex items-center gap-2 text-neutral-900 dark:text-cream hover:text-teal transition-colors group w-fit font-medium"
          >
            <VscMail className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            dev.akioxz@gmail.com
          </a>
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
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/80 dark:bg-ink/80 backdrop-blur-md border border-slate/10 flex items-center justify-center text-neutral-900 dark:text-cream shadow-lg active:scale-95 transition-transform"
        aria-label="Open menu"
      >
        <VscMenu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-white/95 dark:bg-ink/95 backdrop-blur-2xl flex flex-col justify-between p-8"
          >
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setIsOpen(false)} className="font-mono font-medium text-neutral-900 dark:text-cream text-lg tracking-tight">
                Axel Villanueva
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 rounded-full flex items-center justify-center text-neutral-900 dark:text-cream active:scale-95 transition-transform bg-black/5 dark:bg-white/5"
                aria-label="Close menu"
              >
                <VscClose className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col items-center gap-8 font-mono text-xl text-neutral-900 dark:text-cream">
              {mainNavLinks.map((link, i) => (
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
              className="flex flex-col items-center gap-8 pb-8"
            >
              <ThemeToggle />
              <div className="flex flex-col items-center gap-2 font-mono text-xs text-slate/60 text-center">
                <p>Got an idea? Let's build it.</p>
                <a
                  href="mailto:dev.akioxz@gmail.com"
                  className="text-neutral-900 dark:text-cream font-medium"
                >
                  dev.akioxz@gmail.com
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
