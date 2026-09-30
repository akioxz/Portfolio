"use client";

import { usePathname } from "next/navigation";
import { Sidebar, MobileMenu } from "@/components/Navigation";
import ReactLenisWrapper from "@/components/ReactLenisWrapper";
import { AnimatePresence, motion } from "motion/react";

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
    <ReactLenisWrapper>
      <Sidebar />
      <MobileMenu />
      <AnimatePresence mode="wait">
        <motion.div 
          key={pathname}
          className="lg:pl-56 w-full min-h-screen flex flex-col"
          initial={{ opacity: 0, filter: "blur(4px)", y: 8 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(4px)", y: -8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ReactLenisWrapper>
  );
}
