"use client";

import { Bell, BellOff, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const unreadCount = 0;

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleMouseDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open notifications"
        className="relative grid size-10 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface-soft)] text-[var(--color-ink)] transition hover:bg-[var(--color-surface-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(44,82,130,0.28)]"
      >
        <Bell aria-hidden="true" size={18} strokeWidth={1.8} />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] font-bold leading-[18px] text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(380px,calc(100vw-32px))] overflow-hidden rounded-[4px] border border-[var(--color-line)] bg-white shadow-[0_24px_48px_rgba(15,39,68,0.16)]">
          <div className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-4">
            <h4 className="text-[15px] font-bold text-[var(--color-primary)]">
              Notifications
            </h4>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-8 place-items-center rounded-[8px] text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)]"
              aria-label="Close notifications"
            >
              <X aria-hidden="true" size={16} strokeWidth={1.8} />
            </button>
          </div>
          <div className="px-5 py-10 text-center">
            <BellOff
              aria-hidden="true"
              size={32}
              strokeWidth={1.6}
              className="mx-auto text-[var(--color-ink-muted)]"
            />
            <p className="mt-3 text-sm font-semibold text-[var(--color-ink)]">
              You&apos;re all caught up
            </p>
            <p className="mx-auto mt-2 max-w-[220px] text-xs leading-5 text-[var(--color-ink-soft)]">
              Skillset will let you know when something needs your attention.
            </p>
          </div>
          <div className="border-t border-[var(--color-line)] px-5 py-3 text-center">
            <Link
              href="/account/notifications"
              className="text-xs font-semibold text-[var(--color-primary)]"
            >
              View all
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
