"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  VscMail,
  VscMailRead,
  VscChevronDown,
  VscChevronUp,
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
    <div className="p-6 sm:p-10 font-sans">
      <div className="w-full max-w-screen-xl">
        {/* Header — ultra minimal */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-baseline gap-3">
            <h1 className="font-mono text-xl font-bold tracking-tighter text-cream">
              Inbox
            </h1>
            {unreadCount > 0 && (
              <span className="font-mono text-xs text-slate">
                {unreadCount} unread
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoggingOut}
            aria-label="Refresh inbox"
            className="p-2 text-slate hover:text-cream transition-colors duration-300 active:scale-90 disabled:opacity-50"
          >
            <VscRefresh className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {actionError && (
          <div
            role="alert"
            className="mb-8 flex items-center gap-3 font-mono text-xs text-red-400"
          >
            <VscError className="h-4 w-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Search & Filters — borderless */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <VscSearch className="pointer-events-none absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate/50" />
            <span className="sr-only">Search messages</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent border-b border-cream/10 py-2.5 pl-6 pr-4 font-mono text-sm text-cream placeholder:text-slate/40 outline-none transition-all duration-300 focus:border-cream/30"
            />
          </label>
          <div className="flex gap-1 select-none">
            {(["active", "unread", "archived"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={`px-3 py-1.5 font-mono text-xs capitalize transition-all duration-300 rounded-md ${
                  filter === option
                    ? "text-cream"
                    : "text-slate/40 hover:text-slate"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Messages List — no boxes, just rows */}
        {messages.length === 0 ? (
          <div className="py-20 text-center font-mono text-sm text-slate/40">
            <VscMail className="mx-auto mb-4 h-6 w-6 text-slate/20" />
            No messages yet.
          </div>
        ) : visibleMessages.length === 0 ? (
          <div className="py-20 text-center font-mono text-sm text-slate/40">
            <VscSearch className="mx-auto mb-4 h-6 w-6 text-slate/20" />
            No results.
          </div>
        ) : (
          <div className="flex flex-col">
            {visibleMessages.map((msg, index) => {
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
                  className={`transition-colors duration-300 ${
                    index > 0 ? "border-t border-cream/5" : ""
                  }`}
                >
                  {/* Summary Row */}
                  <button
                    type="button"
                    onClick={() => handleToggleExpand(msg.id, msg.is_read)}
                    aria-expanded={isExpanded}
                    aria-controls={`message-${msg.id}`}
                    className="w-full text-left py-4 px-2 flex items-center gap-4 cursor-pointer select-none focus-visible:outline-none hover:bg-cream/[0.03] transition-colors duration-300 group"
                  >
                    {/* Unread dot */}
                    <div className="w-5 shrink-0 flex justify-center">
                      {!msg.is_read ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-cream" />
                      ) : (
                        <VscMailRead className="w-3.5 h-3.5 text-cream/15" />
                      )}
                    </div>

                    {/* Name */}
                    <span
                      className={`font-mono text-sm shrink-0 w-[140px] truncate ${
                        !msg.is_read ? "font-bold text-cream" : "text-cream/50"
                      }`}
                    >
                      {msg.name}
                    </span>

                    {/* Email */}
                    <span className="font-mono text-xs text-cream/20 shrink-0 w-[180px] truncate hidden md:block">
                      {msg.email}
                    </span>

                    {/* Message preview */}
                    <span className="text-xs text-cream/25 truncate flex-1 hidden sm:block">
                      {msg.message}
                    </span>

                    {/* Date */}
                    <span className="font-mono text-[11px] text-cream/20 whitespace-nowrap shrink-0">
                      {formattedDate}
                    </span>

                    {/* Chevron */}
                    <div className="shrink-0 text-cream/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {isExpanded ? (
                        <VscChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <VscChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div
                      id={`message-${msg.id}`}
                      className="pl-11 pr-2 pb-6 pt-2 flex flex-col gap-5"
                    >
                      <div className="flex flex-col gap-1 text-xs font-mono">
                        <div className="text-cream/30">
                          <span className="text-cream/50">From</span>{" "}
                          {msg.name} &lt;
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-cream/50 underline underline-offset-2 hover:text-cream transition-colors duration-300"
                          >
                            {msg.email}
                          </a>
                          &gt;
                        </div>
                        <div className="text-cream/20">
                          {formattedDate}
                        </div>
                      </div>

                      <div className="text-sm text-cream/80 font-sans whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <a
                          href={`mailto:${msg.email}?subject=${encodeURIComponent(
                            `Re: Portfolio Contact`
                          )}`}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs text-cream/40 hover:text-cream hover:bg-cream/5 transition-all duration-300 active:scale-[0.95]"
                        >
                          <VscMail className="w-3.5 h-3.5" />
                          Reply
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
                          className="flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs text-cream/40 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 active:scale-[0.95] disabled:opacity-50"
                        >
                          <VscArchive className="h-3.5 w-3.5" />
                          {archivingId === msg.id
                            ? msg.archived_at ? "Restoring..." : "Archiving..."
                            : msg.archived_at ? "Restore" : "Archive"}
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

      {/* Archive Confirmation Dialog */}
      {pendingArchive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-xl"
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
            className="w-full max-w-sm rounded-xl border border-cream/10 bg-ink p-6 shadow-2xl"
          >
            <h2 id="archive-dialog-title" className="font-mono text-sm font-bold text-cream mb-2">
              {pendingArchive.isArchived ? "Restore message?" : "Archive message?"}
            </h2>
            <p id="archive-dialog-description" className="text-xs leading-relaxed text-cream/40 mb-6">
              {pendingArchive.isArchived
                ? "This will return the message to your active inbox."
                : "This will hide the message from view. You can restore it later."}
            </p>
            <div className="flex justify-end gap-2">
              <button
                ref={cancelArchiveRef}
                type="button"
                onClick={() => setPendingArchive(null)}
                className="rounded-md px-4 py-2 font-mono text-xs text-cream/40 hover:text-cream transition-colors duration-300 active:scale-[0.95]"
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
                className="rounded-md px-4 py-2 font-mono text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 active:scale-[0.95]"
              >
                {pendingArchive.isArchived ? "Restore" : "Archive"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
