"use client";

import { usePathname } from "next/navigation";
import { Sidebar, MobileMenu } from "@/components/Navigation";
import ReactLenisWrapper from "@/components/ReactLenisWrapper";

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
      <div className="lg:pl-56 w-full min-h-screen flex flex-col relative z-10">
        {children}
      </div>
    </ReactLenisWrapper>
  );
}
