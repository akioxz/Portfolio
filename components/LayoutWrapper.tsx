"use client";

import { usePathname } from "next/navigation";
import { Sidebar, MobileMenu } from "@/components/Navigation";
import ReactLenisWrapper from "@/components/ReactLenisWrapper";
import LogoSplash from "@/components/LogoSplash";
import FrozenRoute from "@/components/FrozenRoute";
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
      <LogoSplash />

      <ReactLenisWrapper>
        <Sidebar />
        <MobileMenu />
        <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="lg:pl-56 w-full max-w-full overflow-x-hidden min-h-screen flex flex-col"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, y: 15, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
        >
          <FrozenRoute>
            {children}
          </FrozenRoute>
        </motion.div>
        </AnimatePresence>
      </ReactLenisWrapper>
    </>
  );
}
