"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { VscMail, VscCode, VscBriefcase, VscSignOut, VscHome } from "react-icons/vsc";
import { useState } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const navItems = [
    { name: "Inbox", href: "/admin/inbox", icon: VscMail },
    { name: "Projects", href: "/admin/projects", icon: VscCode },
    { name: "Experience", href: "/admin/experience", icon: VscBriefcase },
  ];

  return (
    <div className="min-h-screen bg-ink flex flex-col md:flex-row font-sans text-cream">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate/15 bg-surface/30 md:min-h-screen flex flex-col">
        <div className="p-6 border-b border-slate/15 flex items-center justify-between md:block">
          <div>
            <h2 className="font-mono font-bold text-lg text-cream uppercase tracking-widest">
              AJV Admin
            </h2>
            <p className="font-mono text-xs text-slate mt-1">Supabase CMS</p>
          </div>
          <Link href="/" className="md:hidden p-2 rounded hover:bg-slate/10 text-slate hover:text-cream transition-colors">
            <VscHome size={20} />
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-teal/10 text-teal font-medium"
                    : "text-slate hover:bg-surface hover:text-cream"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-teal" : ""} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate/15 hidden md:block">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 mb-2 rounded-lg font-mono text-sm text-slate hover:text-cream hover:bg-surface transition-colors"
          >
            <VscHome size={18} />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-medium bg-surface/50 text-slate hover:bg-red-500/10 hover:text-red-400 border border-slate/15 hover:border-red-500/30 transition-all disabled:opacity-50"
          >
            <VscSignOut size={16} />
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
