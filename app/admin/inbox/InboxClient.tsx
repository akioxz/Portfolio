"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  VscMail,
  VscMailRead,
  VscChevronDown,
  VscChevronUp,
  VscSignOut,
  VscRefresh,
  VscError,
} from "react-icons/vsc";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface InboxClientProps {
  initialMessages: ContactMessage[];
}

export default function InboxClient({ initialMessages }: InboxClientProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const router = useRouter();

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const handleToggleExpand = async (id: string, currentlyRead: boolean) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(id);

    if (!currentlyRead) {
      const previousMessages = messages;
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, is_read: true } : msg))
      );

      try {
        const response = await fetch(`/api/admin/messages/${id}/read`, {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("The message could not be marked as read.");
        }
      } catch (err) {
        console.error("Failed to mark message as read:", err);
        setMessages(previousMessages);
        setActionError("Could not update the message. Please try again.");
      }
    }
  };

  const handleRefresh = async () => {
    setActionError(null);
    setIsRefreshing(true);
    try {
      router.refresh();
    } finally {
      window.setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleLogout = async () => {
    setActionError(null);
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error("Logout request failed.");
      }
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Failed to log out:", err);
      setActionError("Could not log out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-cream p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate/15">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-mono text-xl font-bold tracking-wider uppercase text-cream">
                Admin Inbox
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-teal/15 text-teal border border-teal/30 font-medium">
                {unreadCount} unread
              </span>
            </div>
            <p className="font-mono text-xs text-slate">
              Logged contact form submissions from Supabase
            </p>
          </div>

          <div className="flex items-center gap-3 select-none">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoggingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs text-slate border border-slate/20 hover:text-cream hover:border-slate/40 transition-colors cursor-pointer"
            >
              <VscRefresh className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut || isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs text-amber border border-amber/30 hover:bg-amber/10 transition-colors cursor-pointer"
            >
              <VscSignOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </div>

        {actionError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-2 rounded-lg border border-amber/30 bg-amber/10 p-3 font-mono text-xs text-amber"
          >
            <VscError className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Messages List */}
        {messages.length === 0 ? (
          <div className="p-12 text-center border border-slate/15 rounded-xl bg-surface/30 font-mono text-sm text-slate">
            No contact messages received yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg) => {
              const isExpanded = expandedId === msg.id;
              const formattedDate = new Date(msg.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <div
                  key={msg.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    !msg.is_read
                      ? "border-teal/40 bg-surface/80 shadow-md shadow-teal/5"
                      : "border-slate/15 bg-surface/40 hover:border-slate/30"
                  }`}
                >
                  {/* Summary Bar */}
                  <button
                    type="button"
                    onClick={() => handleToggleExpand(msg.id, msg.is_read)}
                    aria-expanded={isExpanded}
                    aria-controls={`message-${msg.id}`}
                    className="w-full text-left p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/70 focus-visible:ring-inset"
                  >
                    <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                      {/* Unread indicator icon */}
                      <div className="pt-0.5 sm:pt-0 shrink-0">
                        {!msg.is_read ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse" />
                        ) : (
                          <VscMailRead className="w-4 h-4 text-slate/50" />
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1 min-w-0">
                        <span
                          className={`font-mono text-sm shrink-0 truncate max-w-[180px] ${
                            !msg.is_read ? "font-bold text-cream" : "text-cream/80"
                          }`}
                        >
                          {msg.name}
                        </span>

                        <span className="font-mono text-xs text-slate shrink-0 truncate max-w-[200px]">
                          {msg.email}
                        </span>

                        <span className="font-sans text-xs text-slate/75 truncate flex-1">
                          {msg.message}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <span className="font-mono text-[10px] text-slate/60 whitespace-nowrap">
                        {formattedDate}
                      </span>
                      {isExpanded ? (
                        <VscChevronUp className="w-4 h-4 text-slate" />
                      ) : (
                        <VscChevronDown className="w-4 h-4 text-slate" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Full Message Content */}
                  {isExpanded && (
                    <div
                      id={`message-${msg.id}`}
                      className="px-5 pb-5 pt-2 border-t border-slate/10 bg-ink/40 flex flex-col gap-4"
                    >
                      <div className="flex flex-col gap-1 text-xs font-mono">
                        <div className="text-slate">
                          <strong className="text-cream">From:</strong> {msg.name} &lt;
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-teal underline hover:text-cream"
                          >
                            {msg.email}
                          </a>
                          &gt;
                        </div>
                        <div className="text-slate/70">
                          <strong className="text-cream">Date:</strong> {formattedDate}
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-surface/90 border border-slate/15 text-sm text-cream font-sans whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </div>

                      <div className="flex items-center gap-2 self-start">
                        <a
                          href={`mailto:${msg.email}?subject=${encodeURIComponent(
                            `Re: Portfolio Contact`
                          )}`}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal/15 text-teal border border-teal/30 font-mono text-xs hover:bg-teal/25 transition-colors"
                        >
                          <VscMail className="w-3.5 h-3.5" />
                          <span>Reply via Email</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
