"use client";

import { usePathname } from "next/navigation";
import { Sidebar, MobileMenu } from "@/components/Navigation";
import ReactLenisWrapper from "@/components/ReactLenisWrapper";
import LogoSplash from "@/components/LogoSplash";
import SplashController from "@/components/SplashController";
import { motion, AnimatePresence } from "motion/react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <ReactLenisWrapper>
        {children}
      </ReactLenisWrapper>
    );
  }

  return (
    <>
      {/* LogoSplash sits OUTSIDE ReactLenisWrapper and motion so it's never affected by route transitions */}
      <LogoSplash />
      <SplashController />

      <ReactLenisWrapper>
        <Sidebar />
        <MobileMenu />
        <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="lg:pl-56 w-full max-w-full overflow-x-hidden min-h-screen flex flex-col"
          initial={pathname === "/uses" ? "usesInitial" : "initial"}
          animate={pathname === "/uses" ? "usesAnimate" : "animate"}
          exit={pathname === "/uses" ? "usesExit" : "exit"}
          variants={{
            initial: { opacity: 0, y: 20, scale: 1, filter: "blur(0px)" },
            animate: { 
              opacity: 1, y: 0, scale: 1, filter: "blur(0px)", 
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
            },
            exit: { 
              opacity: 0, y: 20, scale: 1, filter: "blur(0px)", 
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
            },
            usesInitial: { opacity: 0, scale: 0.95, filter: "blur(8px)" },
            usesAnimate: { 
              opacity: 1, scale: 1, filter: "blur(0px)", 
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
            },
            usesExit: { 
              opacity: 0, scale: 1.05, filter: "blur(8px)", 
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
            }
          }}
        >
          {children}
        </motion.div>
        </AnimatePresence>
      </ReactLenisWrapper>
    </>
  );
}
