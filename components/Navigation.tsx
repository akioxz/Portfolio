"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { VscMenu, VscClose } from "react-icons/vsc";
import ThemeToggle from "./ThemeToggle";

const mainNavLinks = [
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Stack", href: "/stack" },
  { label: "Certifications", href: "/certifications" },
  { label: "Contact", href: "/contact" },
  { label: "Uses", href: "/uses" },
];

export function Sidebar() {
  const pathname = usePathname();

  useEffect(() => {
    let title = "Axel Villanueva | Full-Stack Developer";
    if (pathname !== "/") {
      const pageName = pathname.split("/")[1];
      if (pageName) {
        title = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - Axel Villanueva`;
      }
    }
    document.title = title;
  }, [pathname]);

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 hidden lg:flex flex-col justify-between border-r border-slate/10 dark:border-white/[0.06] px-7 py-8 z-50 bg-white/50 dark:bg-[#0c0c0c]/80 backdrop-blur-xl">
      <div className="flex flex-col gap-8">
        <Link 
          href="/" 
          className="font-mono text-[15px] text-neutral-900 dark:text-white hover:opacity-70 transition-opacity"
        >
          Axel Villanueva
        </Link>
        
        <nav className="flex flex-col gap-[14px] font-mono text-[13px]">
          {mainNavLinks.map((link) => {
            // For active state, check if pathname matches the link exactly
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex items-center hover:text-neutral-900 dark:hover:text-white transition-colors w-fit ${isActive ? "text-neutral-900 dark:text-white font-bold" : "text-neutral-500 dark:text-neutral-400"}`}
              >
                <span className={`absolute -left-5 transition-all duration-300 font-mono text-neutral-900 dark:text-white ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
                  {"->"}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', altKey: true }))}
            className="flex items-center gap-2 text-[12px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-cream transition-colors group"
          >
            <span>Ask anything</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 font-mono text-[10px] text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-cream transition-colors">Alt</kbd>
              <span className="text-[10px]">+</span>
              <kbd className="px-1.5 py-0.5 rounded border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 font-mono text-[10px] text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-cream transition-colors">K</kbd>
            </span>
          </button>
          <ThemeToggle />

          <p className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed mt-2 pt-8 border-t border-slate/10 dark:border-white/[0.06]">
            For work, collabs & everything else, reach me at
          </p>
          
          <div className="flex flex-col gap-3">
            <a href="mailto:dev.akioxz@gmail.com" className="font-mono text-[12px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-cream transition-colors">
              dev.akioxz@gmail.com
            </a>
            <a href="https://discordapp.com/users/359218967990599682" target="_blank" rel="noopener noreferrer" className="font-mono text-[12px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-cream transition-colors">
              akioxz
            </a>
            <a href="https://github.com/akioxz" target="_blank" rel="noopener noreferrer" className="font-mono text-[12px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-cream transition-colors">
              github.com/akioxz
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-50 p-2.5 bg-white/50 dark:bg-black/50 backdrop-blur-xl border border-slate/10 dark:border-white/10 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all"
        aria-label="Open menu"
      >
        <VscMenu className="w-5 h-5 text-neutral-900 dark:text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-white/90 dark:bg-[#0c0c0c]/90 flex flex-col"
          >
            <div className="flex justify-end p-6">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 bg-black/5 dark:bg-white/5 rounded-full hover:scale-105 active:scale-95 transition-all"
                aria-label="Close menu"
              >
                <VscClose className="w-5 h-5 text-neutral-900 dark:text-white" />
              </button>
            </div>

            <div className="flex-1 flex flex-col px-8 py-4 justify-between h-full overflow-y-auto pb-12">
              <div className="flex flex-col gap-10">
                <Link 
                  href="/" 
                  onClick={() => setIsOpen(false)}
                  className="font-mono text-lg text-neutral-900 dark:text-white"
                >
                  Axel Villanueva
                </Link>

                <nav className="flex flex-col gap-6 font-mono text-xl">
                  {mainNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`transition-colors ${pathname === link.href || pathname.startsWith(link.href + "/") ? "text-neutral-900 dark:text-white font-bold" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="flex flex-col gap-6 mt-12 pt-8 border-t border-slate/10 dark:border-white/[0.06]">
                <ThemeToggle />
                
                <p className="font-mono text-sm text-neutral-400 dark:text-neutral-500 leading-relaxed">
                  For work, collabs & everything else, reach me at
                </p>

                <div className="flex flex-col gap-4">
                  <a href="mailto:dev.akioxz@gmail.com" className="font-mono text-sm font-medium tracking-tight text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-cream transition-colors duration-200">
                    dev.akioxz@gmail.com
                  </a>
                  <a href="https://discordapp.com/users/359218967990599682" target="_blank" rel="noopener noreferrer" className="font-mono text-sm font-medium tracking-tight text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-cream transition-colors duration-200">
                    akioxz
                  </a>
                  <a href="https://github.com/akioxz" target="_blank" rel="noopener noreferrer" className="font-mono text-sm font-medium tracking-tight text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-cream transition-colors duration-200">
                    github.com/akioxz
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
