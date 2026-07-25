"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VscLock, VscArrowRight } from "react-icons/vsc";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed.");
        setIsLoading(false);
        return;
      }

      router.push("/admin/inbox");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate/20 bg-surface/90 p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate/15">
          <VscLock className="w-5 h-5 text-teal shrink-0" />
          <h1 className="font-mono text-sm text-cream font-semibold tracking-wider uppercase">
            Admin Inbox Auth
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-md bg-amber/10 border border-amber/30 text-amber text-xs font-mono">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5 text-left">
            <label
              htmlFor="admin-password"
              className="font-mono text-xs text-slate uppercase tracking-wider"
            >
              Master Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full bg-ink/80 border border-slate/20 rounded-md px-3 py-2 text-cream font-mono text-sm focus:outline-none focus:border-teal transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex items-center justify-center gap-2 bg-cream text-ink px-4 py-2.5 rounded-md font-mono text-xs font-semibold hover:bg-cream/90 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Inbox</span>
                <VscArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
