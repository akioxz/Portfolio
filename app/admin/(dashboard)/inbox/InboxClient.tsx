"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  VscMail,
  VscMailRead,
  VscChevronDown,
  VscChevronUp,
  VscSignOut,
  VscRefresh,
  VscError,
  VscArchive,
  VscSearch,
} from "react-icons/vsc";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
  archived_at?: string | null;
}

interface InboxClientProps {
  initialMessages: ContactMessage[];
}

export default function InboxClient({ initialMessages }: InboxClientProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"active" | "unread" | "archived">("active");
  const [pendingArchive, setPendingArchive] = useState<{
    id: string;
    isArchived: boolean;
  } | null>(null);
  const cancelArchiveRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const getCsrfToken = () =>
    document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${CSRF_COOKIE_NAME}=`))
      ?.slice(CSRF_COOKIE_NAME.length + 1) || "";

  useEffect(() => {
    if (!pendingArchive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPendingArchive(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    cancelArchiveRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pendingArchive]);

  const unreadCount = messages.filter((m) => !m.archived_at && !m.is_read).length;
  const visibleMessages = messages.filter((message) => {
    const haystack = `${message.name} ${message.email} ${message.message}`.toLowerCase();
    return (
      (filter === "active" || (filter === "unread" && !message.is_read) || (filter === "archived" && message.archived_at)) &&
      (filter === "archived" ? Boolean(message.archived_at) : !message.archived_at) &&
      haystack.includes(searchQuery.trim().toLowerCase())
    );
  });

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
          headers: { [CSRF_HEADER_NAME]: getCsrfToken() },
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
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: { [CSRF_HEADER_NAME]: getCsrfToken() },
      });
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

  const handleArchive = async (id: string, isArchived: boolean) => {
    const action = isArchived ? "restore" : "archive";
    setActionError(null);
    setArchivingId(id);
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          [CSRF_HEADER_NAME]: getCsrfToken(),
        },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) {
        throw new Error("Archive request failed.");
      }
      setMessages((prev) =>
        prev.map((message) =>
          message.id === id
            ? { ...message, archived_at: isArchived ? null : new Date().toISOString() }
            : message,
        ),
      );
      setExpandedId(null);
    } catch (err) {
      console.error("Failed to archive message:", err);
      setActionError("Could not archive the message. Please try again.");
    } finally {
      setArchivingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="font-mono text-2xl font-bold tracking-tighter uppercase text-cream">
                Admin Inbox
              </h1>
              <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-cream border border-white/10 font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                {unreadCount} unread
              </span>
            </div>
            <p className="font-mono text-[10px] text-slate uppercase tracking-widest font-medium">
              Logged contact form submissions from Supabase
            </p>
          </div>

          <div className="flex items-center gap-3 select-none">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoggingOut}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-slate hover:text-cream hover:bg-white/10 border border-white/5 rounded-lg font-mono text-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <VscRefresh className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
            {/* Removed redundant Logout button since it is now natively built into the global layout sidebar */}
          </div>
        </div>

        {actionError && (
          <div
            role="alert"
            className="mb-8 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 font-mono text-xs text-red-400"
          >
            <VscError className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <label className="relative flex-1">
            <VscSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
            <span className="sr-only">Search messages</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search messages..."
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 font-mono text-sm text-cream placeholder:text-slate outline-none transition-all duration-300 focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-white/20"
            />
          </label>
          <div className="flex bg-black/40 backdrop-blur-md rounded-xl p-1.5 border border-white/5 select-none w-full sm:w-auto h-fit">
            {(["active", "unread", "archived"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={`flex-1 sm:flex-none cursor-pointer rounded-lg px-4 py-2 font-mono text-xs capitalize transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.95] ${
                  filter === option
                    ? "bg-white/10 text-cream font-bold shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5"
                    : "text-slate hover:bg-white/5 hover:text-cream border border-transparent"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        {messages.length === 0 ? (
          <div className="p-16 text-center border border-white/5 border-dashed rounded-2xl bg-black/20 backdrop-blur-md shadow-2xl font-mono text-sm text-slate">
            <VscMail className="mx-auto mb-4 h-8 w-8 text-slate/50" />
            No contact messages received yet.
          </div>
        ) : visibleMessages.length === 0 ? (
          <div className="p-16 text-center border border-white/5 border-dashed rounded-2xl bg-black/20 backdrop-blur-md shadow-2xl font-mono text-sm text-slate">
            <VscSearch className="mx-auto mb-4 h-8 w-8 text-slate/50" />
            No messages match the current search.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {visibleMessages.map((msg) => {
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
                  className={`rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                    !msg.is_read
                      ? "border-white/10 bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.03)]"
                      : "border-white/5 bg-black/40 backdrop-blur-md hover:bg-white/5 hover:border-white/10"
                  }`}
                >
                  {/* Summary Bar */}
                  <button
                    type="button"
                    onClick={() => handleToggleExpand(msg.id, msg.is_read)}
                    aria-expanded={isExpanded}
                    aria-controls={`message-${msg.id}`}
                    className="w-full text-left p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                      {/* Unread indicator icon */}
                      <div className="pt-0.5 sm:pt-0 shrink-0">
                        {!msg.is_read ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-cream animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                        ) : (
                          <VscMailRead className="w-4 h-4 text-slate/40" />
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-1 min-w-0">
                        <span
                          className={`font-mono text-sm shrink-0 truncate max-w-[180px] ${
                            !msg.is_read ? "font-bold text-cream tracking-tight" : "text-slate"
                          }`}
                        >
                          {msg.name}
                        </span>

                        <span className="font-mono text-xs text-slate shrink-0 truncate max-w-[200px]">
                          {msg.email}
                        </span>

                        <span className="font-sans text-xs text-slate/60 truncate flex-1">
                          {msg.message}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 self-end sm:self-auto">
                      <span className="font-mono text-[10px] text-slate/50 whitespace-nowrap uppercase tracking-wider">
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
                      className="px-6 pb-6 pt-4 border-t border-white/5 bg-black/20 flex flex-col gap-6"
                    >
                      <div className="flex flex-col gap-1.5 text-xs font-mono">
                        <div className="text-slate">
                          <strong className="text-cream font-bold">From:</strong> {msg.name} &lt;
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-white underline hover:text-cream/80"
                          >
                            {msg.email}
                          </a>
                          &gt;
                        </div>
                        <div className="text-slate/60">
                          <strong className="text-cream font-bold">Date:</strong> {formattedDate}
                        </div>
                      </div>

                      <div className="p-5 rounded-xl bg-white/5 border border-white/5 text-sm text-cream font-sans whitespace-pre-wrap leading-relaxed shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                        {msg.message}
                      </div>

                      <div className="flex items-center gap-3 self-start">
                        <a
                          href={`mailto:${msg.email}?subject=${encodeURIComponent(
                            `Re: Portfolio Contact`
                          )}`}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-cream border border-white/5 font-mono text-xs hover:bg-white/15 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.95]"
                        >
                          <VscMail className="w-4 h-4" />
                          <span>Reply via Email</span>
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            setPendingArchive({
                              id: msg.id,
                              isArchived: Boolean(msg.archived_at),
                            })
                          }
                          disabled={archivingId === msg.id}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 bg-red-500/10 font-mono text-xs text-red-400 hover:bg-red-500/20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.95] disabled:opacity-50"
                        >
                          <VscArchive className="h-4 w-4" />
                          <span>
                            {archivingId === msg.id
                              ? msg.archived_at ? "Restoring..." : "Archiving..."
                              : msg.archived_at ? "Restore" : "Archive"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {pendingArchive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xl"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPendingArchive(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-dialog-title"
            aria-describedby="archive-dialog-description"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-ink/90 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md"
          >
            <div className="mb-6 flex items-start gap-4">
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-400">
                <VscArchive className="h-6 w-6" />
              </div>
              <div>
                <h2 id="archive-dialog-title" className="font-mono text-base font-bold uppercase tracking-widest text-cream">
                  {pendingArchive.isArchived ? "Restore message?" : "Archive message?"}
                </h2>
                <p id="archive-dialog-description" className="mt-2 text-sm leading-relaxed text-slate">
                  {pendingArchive.isArchived
                    ? "This message will return to your active inbox."
                    : "This message will be hidden from the active inbox. You can restore it later."}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                ref={cancelArchiveRef}
                type="button"
                onClick={() => setPendingArchive(null)}
                className="rounded-lg px-6 py-2.5 font-mono text-xs text-slate transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-cream hover:bg-white/5 active:scale-[0.95]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const { id, isArchived } = pendingArchive;
                  setPendingArchive(null);
                  void handleArchive(id, isArchived);
                }}
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-6 py-2.5 font-mono text-xs text-red-400 font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-red-500/20 active:scale-[0.95]"
              >
                {pendingArchive.isArchived ? "Restore message" : "Archive message"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
