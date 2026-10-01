"use client";

import { usePathname } from "next/navigation";
import { Sidebar, MobileMenu } from "@/components/Navigation";
import ReactLenisWrapper from "@/components/ReactLenisWrapper";
import LogoSplash from "@/components/LogoSplash";
import { motion } from "motion/react";

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

      <ReactLenisWrapper>
        <Sidebar />
        <MobileMenu />
        <motion.div
          key={pathname}
          className="lg:pl-56 w-full max-w-full overflow-x-hidden min-h-screen flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </ReactLenisWrapper>
    </>
  );
}
