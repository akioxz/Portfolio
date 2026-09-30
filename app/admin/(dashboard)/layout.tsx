"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { VscMail, VscCode, VscBriefcase, VscSignOut, VscHome, VscWorkspaceTrusted, VscLayers, VscRefresh } from "react-icons/vsc";
import { FiSun, FiMoon } from "react-icons/fi";
import { useState, useTransition, useEffect } from "react";
import { useTheme } from "next-themes";
import { refreshLiveSite } from "@/app/admin/actions";

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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
    <div className="min-h-screen bg-ink flex flex-col md:flex-row font-sans text-cream selection:bg-teal/30">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-cream/5 bg-surface/50 backdrop-blur-xl md:min-h-screen flex flex-col z-20">
        <div className="p-8 flex items-center justify-between">
          <h2 className="font-mono font-bold text-xl text-cream tracking-tighter">
            AJV
          </h2>
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="p-2 rounded-lg text-slate hover:text-cream hover:bg-cream/5 transition-all duration-300 active:scale-90"
              >
                {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
              </button>
            )}
            <Link href="/" className="md:hidden p-2 rounded-lg hover:bg-cream/5 text-slate hover:text-cream transition-all duration-300 active:scale-[0.98]">
              <VscHome size={20} />
            </Link>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-all duration-300 active:scale-[0.98] whitespace-nowrap ${
                  isActive
                    ? "bg-cream/10 text-cream font-medium"
                    : "text-slate hover:bg-cream/5 hover:text-cream"
                }`}
              >
                <item.icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 hidden md:flex flex-col gap-1 border-t border-cream/5 mt-auto">
          <button
            onClick={handleRefreshCache}
            disabled={isPending}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-all duration-300 active:scale-[0.98] whitespace-nowrap text-slate hover:bg-cream/5 hover:text-cream ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <VscRefresh className={isPending ? "animate-spin" : ""} size={16} />
            {isPending ? "Refreshing..." : justRefreshed ? "Refreshed!" : "Push to Live"}
          </button>

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-all duration-300 active:scale-[0.98] whitespace-nowrap text-slate hover:bg-cream/5 hover:text-cream"
          >
            <VscHome size={16} />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-all duration-300 active:scale-[0.98] whitespace-nowrap text-slate hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          >
            <VscSignOut size={16} />
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden relative">
        {children}
      </main>
    </div>
  );
}
