"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { VscMail, VscCode, VscBriefcase, VscSignOut, VscHome, VscWorkspaceTrusted, VscLayers, VscRefresh } from "react-icons/vsc";
import { useState, useTransition, useEffect } from "react";
import { refreshLiveSite } from "@/app/admin/actions";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [justRefreshed, setJustRefreshed] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      setIsLoggingOut(false);
    }
  };

  const handleRefreshCache = () => {
    startTransition(async () => {
      try {
        await refreshLiveSite();
        setJustRefreshed(true);
        setTimeout(() => setJustRefreshed(false), 2000);
      } catch (err) {
        console.error("Failed to refresh site cache", err);
      }
    });
  };

  const navItems = [
    { name: "Inbox", href: "/admin/inbox", icon: VscMail },
    { name: "Projects", href: "/admin/projects", icon: VscCode },
    { name: "Experience", href: "/admin/experience", icon: VscBriefcase },
    { name: "Certifications", href: "/admin/certifications", icon: VscWorkspaceTrusted },
    { name: "Stack", href: "/admin/stack", icon: VscLayers },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-ink flex flex-col md:flex-row font-sans text-neutral-900 dark:text-cream selection:bg-teal/30">
      {/* Sidebar */}
      <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r border-slate/10 dark:border-white/[0.06] bg-white/50 dark:bg-[#0c0c0c]/80 backdrop-blur-xl md:min-h-screen flex flex-col z-20">
        <div className="px-7 py-8">
          <Link href="/admin/inbox" className="font-mono font-medium text-lg text-neutral-900 dark:text-cream tracking-tight hover:opacity-60 transition-opacity">
            Axel Villanueva
          </Link>
        </div>

        <nav className="flex-1 px-4 py-2 flex flex-row md:flex-col gap-0.5 overflow-x-auto md:overflow-visible font-mono text-[13px]">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 active:scale-[0.98] whitespace-nowrap ${
                  isActive
                    ? "bg-neutral-100 dark:bg-white/[0.06] text-neutral-900 dark:text-cream font-medium"
                    : "text-neutral-500 dark:text-white/40 hover:text-neutral-900 dark:hover:text-cream"
                }`}
              >
                <item.icon size={15} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-4 hidden md:flex flex-col gap-0.5 mt-auto">
          <div className="border-t border-slate/10 dark:border-white/[0.06] pt-4 mb-2 flex flex-col gap-0.5">
            <button
              onClick={handleRefreshCache}
              disabled={isPending}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-[13px] transition-all duration-200 active:scale-[0.98] whitespace-nowrap text-neutral-500 dark:text-white/40 hover:text-neutral-900 dark:hover:text-cream ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <VscRefresh className={isPending ? "animate-spin" : ""} size={15} />
              {isPending ? "Refreshing..." : justRefreshed ? "Refreshed!" : "Push to Live"}
            </button>

            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-[13px] transition-all duration-200 active:scale-[0.98] whitespace-nowrap text-neutral-500 dark:text-white/40 hover:text-neutral-900 dark:hover:text-cream"
            >
              <VscHome size={15} />
              Back to Site
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-[13px] transition-all duration-200 active:scale-[0.98] whitespace-nowrap text-neutral-500 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50"
            >
              <VscSignOut size={15} />
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>

          {/* Theme Toggle - Bryl Lim style */}
          <div className="px-3 pt-2">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden relative bg-white dark:bg-ink">
        {children}
      </main>
    </div>
  );
}
