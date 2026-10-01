"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { motion, AnimatePresence } from "motion/react";
import { VscMenu, VscClose, VscMail, VscGithub, VscSend } from "react-icons/vsc";
import { FaDiscord } from "react-icons/fa6";
import ThemeToggle from "./ThemeToggle";
import ContactModal from "./ContactModal";

const mainNavLinks = [
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Stack", href: "/#stack" },
  { label: "Certifications", href: "/#certifications" },
];

const extraLinks = [
  { label: "Uses", href: "/uses" },
];

export function Sidebar() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const isScrollingRef = useRef(false);
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleOpenModal = () => setIsContactModalOpen(true);
    window.addEventListener("openContactModal", handleOpenModal);
    return () => window.removeEventListener("openContactModal", handleOpenModal);
  }, []);

  useEffect(() => {
    const sectionsToObserve = ["hero", ...mainNavLinks.map(l => l.href.replace("/#", ""))];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isScrollingRef.current) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    sectionsToObserve.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activeSection || activeSection === "hero") {
      document.title = "Axel Villanueva | Full-Stack Developer";
    } else {
      const formattedName = activeSection.charAt(0).toUpperCase() + activeSection.slice(1);
      document.title = `${formattedName} - Axel Villanueva`;
    }
  }, [activeSection]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      
      const isHome = pathname === "/";
      const isAnchor = href.startsWith("/#");

      if (isAnchor) {
        const targetId = href.replace("/#", "");
        setActiveSection(targetId);
        if (isHome) {
          isScrollingRef.current = true;
          lenis?.scrollTo(`#${targetId}`, { duration: 1.2, offset: -96 });
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 1250);
        } else {
          router.push(href);
        }
      } else {
        router.push(href);
      }
    },
    [lenis, pathname, router]
  );

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 hidden lg:flex flex-col justify-between border-r border-slate/10 dark:border-white/[0.06] px-7 py-8 z-50 bg-white/50 dark:bg-[#0c0c0c]/80 backdrop-blur-xl">
      <div className="flex flex-col gap-10">
        <Link 
          href="/" 
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              setActiveSection("hero");
              isScrollingRef.current = true;
              lenis?.scrollTo(0, { duration: 1.2 });
              setTimeout(() => {
                isScrollingRef.current = false;
              }, 1250);
            }
          }}
          className="font-mono text-[15px] text-neutral-900 dark:text-white hover:opacity-70 transition-opacity"
        >
          Axel Villanueva
        </Link>
        
        <nav className="flex flex-col gap-4 font-mono text-[13px]">
          {mainNavLinks.map((link) => {
            const isActive = link.href.startsWith("/#")
              ? activeSection === link.href.replace("/#", "")
              : pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`group relative flex items-center hover:text-neutral-900 dark:hover:text-white transition-colors w-fit ${isActive ? "text-neutral-900 dark:text-white" : "text-zinc-500"}`}
              >
                <span className={`absolute -left-5 transition-all duration-300 font-mono text-neutral-900 dark:text-white ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
                  -&gt;
                </span>
                <span className={`transition-transform duration-300 ${isActive ? "translate-x-1" : ""}`}>
                  {link.label}
                </span>
              </a>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-6 mt-auto">
        {/* Separator */}
        <div className="w-full h-px bg-black/5 dark:bg-white/[0.06] mb-2" />

        {/* Extra Links (Gear) */}
        <div className="font-mono text-[13px]">
          {extraLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-neutral-900 dark:hover:text-white transition-colors w-fit ${pathname === link.href ? "text-neutral-900 dark:text-white" : "text-zinc-500"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Ask Anything (Alt+K) */}
        <button 
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', altKey: true }))}
          className="flex items-center gap-2 text-[12px] text-slate/50 hover:text-neutral-900 dark:hover:text-cream transition-colors group"
        >
          <span>Ask anything</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-slate/20 dark:border-white/10 bg-slate/5 dark:bg-white/5 font-mono text-[10px] text-slate/50 group-hover:text-neutral-900 dark:group-hover:text-cream transition-colors">Alt</kbd>
            <span className="text-[10px]">+</span>
            <kbd className="px-1.5 py-0.5 rounded border border-slate/20 dark:border-white/10 bg-slate/5 dark:bg-white/5 font-mono text-[10px] text-slate/50 group-hover:text-neutral-900 dark:group-hover:text-cream transition-colors">K</kbd>
          </span>
        </button>

        {/* Theme Toggle Pill */}
        <ThemeToggle />

        {/* Ethereal Glass Contact Button & Socials */}
        <div className="flex flex-col gap-4 mt-2">
          
          <div className="flex items-center gap-4 px-1">
            <a href="mailto:dev.akioxz@gmail.com" aria-label="Email" className="text-zinc-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <VscMail className="w-5 h-5" />
            </a>
            <a href="https://discordapp.com/users/your_discord_id_here" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="text-zinc-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <FaDiscord className="w-5 h-5" />
            </a>
            <a href="https://github.com/akioxz" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-zinc-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <VscGithub className="w-5 h-5" />
            </a>
            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              aria-label="Send a message"
              className="text-zinc-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <VscSend className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </aside>
  );
}

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsOpen(false);
      
      const isHome = pathname === "/";
      const isAnchor = href.startsWith("/#");

      setTimeout(() => {
        if (isAnchor) {
          const targetId = href.replace("/#", "");
          if (isHome) {
            lenis?.scrollTo(`#${targetId}`, { duration: 1.2, offset: -96 });
          } else {
            router.push(href);
          }
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
        className="lg:hidden fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border border-black/5 dark:border-white/10 flex items-center justify-center text-neutral-900 dark:text-white shadow-lg active:scale-95 transition-transform"
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
            className="fixed inset-0 z-[60] bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-2xl flex flex-col justify-between p-8"
          >
            <div className="flex items-center justify-between">
              <Link 
                href="/" 
                onClick={(e) => {
                  setIsOpen(false);
                  if (pathname === "/") {
                    e.preventDefault();
                    lenis?.scrollTo(0, { duration: 1.2 });
                  }
                }} 
                className="font-mono text-[15px] text-neutral-900 dark:text-white"
              >
                Axel Villanueva
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 rounded-full flex items-center justify-center text-neutral-900 dark:text-white active:scale-95 transition-transform bg-black/5 dark:bg-white/5"
                aria-label="Close menu"
              >
                <VscClose className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col items-center gap-8 font-sans font-bold tracking-tight text-2xl text-neutral-900 dark:text-white">
              {mainNavLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="hover:opacity-70 transition-opacity"
                >
                  {link.label}
                </motion.a>
              ))}

            </nav>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-6 pb-8 w-full max-w-sm mx-auto"
            >
              <div className="flex flex-col items-center gap-6">
                {/* Separator */}
                <div className="w-8 h-px bg-black/10 dark:bg-white/10" />

                {/* Extra Links (Gear) */}
                <div className="flex justify-center gap-6 font-mono text-sm">
                  {extraLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`transition-colors ${pathname === link.href ? "text-neutral-900 dark:text-white" : "text-zinc-500 hover:text-neutral-900 dark:hover:text-white"}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <ThemeToggle />
              </div>
              
              <div className="flex flex-col gap-4 mt-2">
                
                <div className="flex items-center justify-center gap-6">
                  <a href="mailto:dev.akioxz@gmail.com" aria-label="Email" className="text-zinc-500 hover:text-neutral-900 dark:hover:text-white transition-colors p-3 bg-neutral-100 dark:bg-white/5 rounded-full active:scale-95">
                    <VscMail className="w-5 h-5" />
                  </a>
                  <a href="https://discordapp.com/users/your_discord_id_here" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="text-zinc-500 hover:text-neutral-900 dark:hover:text-white transition-colors p-3 bg-neutral-100 dark:bg-white/5 rounded-full active:scale-95">
                    <FaDiscord className="w-5 h-5" />
                  </a>
                  <a href="https://github.com/akioxz" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-zinc-500 hover:text-neutral-900 dark:hover:text-white transition-colors p-3 bg-neutral-100 dark:bg-white/5 rounded-full active:scale-95">
                    <VscGithub className="w-5 h-5" />
                  </a>
                  <button onClick={() => setIsContactModalOpen(true)} aria-label="Message" className="text-zinc-500 hover:text-neutral-900 dark:hover:text-white transition-colors p-3 bg-neutral-100 dark:bg-white/5 rounded-full active:scale-95">
                    <VscSend className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  );
}
