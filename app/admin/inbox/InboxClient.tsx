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

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <VscSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
            <span className="sr-only">Search messages</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search messages..."
              className="w-full rounded-md border border-slate/20 bg-surface/60 py-2 pl-9 pr-3 font-mono text-xs text-cream placeholder:text-slate/70 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
            />
          </label>
          <div className="flex rounded-md border border-slate/20 p-1 font-mono text-xs">
            {(["active", "unread", "archived"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={`rounded px-3 py-1.5 capitalize transition-colors ${
                  filter === option
                    ? "bg-teal/15 text-teal"
                    : "text-slate hover:text-cream"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        {messages.length === 0 ? (
          <div className="p-12 text-center border border-slate/15 rounded-xl bg-surface/30 font-mono text-sm text-slate">
            No contact messages received yet.
          </div>
        ) : visibleMessages.length === 0 ? (
          <div className="p-12 text-center border border-slate/15 rounded-xl bg-surface/30 font-mono text-sm text-slate">
            No messages match the current search.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
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
                        <button
                          type="button"
                          onClick={() =>
                            setPendingArchive({
                              id: msg.id,
                              isArchived: Boolean(msg.archived_at),
                            })
                          }
                          disabled={archivingId === msg.id}
                          className="flex items-center gap-2 rounded-md border border-amber/30 bg-amber/10 px-3 py-1.5 font-mono text-xs text-amber transition-colors hover:bg-amber/20 disabled:cursor-wait disabled:opacity-50"
                        >
                          <VscArchive className="h-3.5 w-3.5" />
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 p-4 backdrop-blur-sm"
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
            className="w-full max-w-md rounded-xl border border-slate/20 bg-surface p-6 shadow-2xl shadow-black/30"
          >
            <div className="mb-5 flex items-start gap-3">
              <div className="rounded-lg border border-amber/30 bg-amber/10 p-2 text-amber">
                <VscArchive className="h-5 w-5" />
              </div>
              <div>
                <h2 id="archive-dialog-title" className="font-mono text-sm font-bold uppercase tracking-wide text-cream">
                  {pendingArchive.isArchived ? "Restore message?" : "Archive message?"}
                </h2>
                <p id="archive-dialog-description" className="mt-2 text-sm leading-relaxed text-slate">
                  {pendingArchive.isArchived
                    ? "This message will return to your active inbox."
                    : "This message will be hidden from the active inbox. You can restore it later."}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                ref={cancelArchiveRef}
                type="button"
                onClick={() => setPendingArchive(null)}
                className="rounded-md border border-slate/20 px-3 py-2 font-mono text-xs text-slate transition-colors hover:border-slate/40 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/70"
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
                className="rounded-md border border-amber/40 bg-amber/15 px-3 py-2 font-mono text-xs text-amber transition-colors hover:bg-amber/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/70"
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
