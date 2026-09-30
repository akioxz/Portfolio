"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { VscMail, VscCode, VscBriefcase, VscSignOut, VscHome, VscWorkspaceTrusted, VscLayers, VscRefresh } from "react-icons/vsc";
import { useState, useTransition } from "react";
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
      {/* Sidebar - Ethereal Glass */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-black/40 backdrop-blur-xl md:min-h-screen flex flex-col z-20">
        <div className="p-8 flex items-center justify-between md:block">
          <div>
            <h2 className="font-mono font-bold text-xl text-cream tracking-tighter">
              AJV
            </h2>
          </div>
          <Link href="/" className="md:hidden p-2 rounded-lg hover:bg-white/5 text-slate hover:text-cream transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]">
            <VscHome size={20} />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-2 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] whitespace-nowrap ${
                  isActive
                    ? "bg-white/10 text-cream font-medium shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5"
                    : "text-slate hover:bg-white/5 hover:text-cream border border-transparent"
                }`}
              >
                <item.icon size={16} className={isActive ? "text-cream" : "text-slate"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 hidden md:block">
          <button
            onClick={handleRefreshCache}
            disabled={isPending}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 mb-2 rounded-lg font-mono text-[11px] uppercase tracking-widest font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] border ${
              justRefreshed 
                ? "bg-teal/20 text-teal border-teal/30" 
                : "bg-teal/10 text-teal border-teal/20 hover:bg-teal/20 hover:border-teal/30"
            } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <VscRefresh className={isPending ? "animate-spin" : ""} size={16} />
            {isPending ? "Refreshing..." : justRefreshed ? "Refreshed!" : "Push to Live"}
          </button>

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg font-mono text-sm text-slate hover:text-cream hover:bg-white/5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] border border-transparent"
          >
            <VscHome size={16} />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono text-sm font-medium bg-white/5 text-slate hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:opacity-50"
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
