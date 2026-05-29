"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icons";

/**
 * Top strip above the clinician canvas: POPIA confidentiality banner +
 * notification popover. Lives in a client component so we can manage the
 * popover toggle without dragging the whole layout into "use client".
 */

type Notif = {
  tone: "urgent" | "review" | "info";
  head: string;
  body: string;
  when: string;
  href?: string;
};

const NOTIFS: Notif[] = [
  {
    tone: "urgent",
    head: "GP referral · Pieter van Wyk",
    body: "Changing pigmented lesion on upper back — flagged urgent",
    when: "2h ago",
    href: "/clinician/patients/pt-pvw",
  },
  {
    tone: "review",
    head: "Hadassah Friedman uploaded a photo",
    body: "L1 left upper back · awaits your review",
    when: "this morning",
    href: "/clinician/patients/pt-hf",
  },
  {
    tone: "review",
    head: "Annelize Botha logged 3 new spots",
    body: "Drug-eruption pattern · escalating",
    when: "5h ago",
    href: "/clinician/patients/pt-ab",
  },
  {
    tone: "info",
    head: "Methotrexate bloods filed",
    body: "Sipho Khumalo · LFTs normal · safe to continue",
    when: "yesterday",
    href: "/clinician/patients/pt-sk",
  },
];

type TopBarProps = {
  onMenuClick?: () => void;
};

export function TopBar({ onMenuClick }: TopBarProps = {}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const unread = NOTIFS.filter((n) => n.tone !== "info").length;

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-paper/85 px-4 py-3 backdrop-blur-md md:gap-4 md:px-10">
      {/* Mobile menu button (hidden on md+) */}
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="grid size-10 flex-shrink-0 place-items-center rounded-full border border-line bg-card text-ink-soft md:hidden"
        >
          <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 7h18M3 12h18M3 17h18" />
          </svg>
        </button>
      )}
      <div className="conf-banner flex-1 md:max-w-2xl">
        <Icon.Lock size={15} />
        <div className="hidden text-[12px] sm:block">
          <strong className="font-semibold">Special personal information.</strong>{" "}
          Access audit-logged · POPIA &amp; HPCSA confidentiality applies.
        </div>
        <div className="text-[11.5px] font-semibold sm:hidden">POPIA · audited</div>
      </div>
      <div className="relative flex items-center gap-2" ref={wrapRef}>
        <button
          type="button"
          aria-label={`${unread} notifications`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative grid size-9 place-items-center rounded-full border border-line bg-card text-ink-soft transition hover:bg-paper"
        >
          <Icon.Bell size={16} />
          {unread > 0 && (
            <span
              className="absolute right-1 top-1 grid size-[14px] place-items-center rounded-full bg-clay text-[9px] font-bold text-white ring-2 ring-paper"
              aria-hidden
            >
              {unread}
            </span>
          )}
        </button>
        {open && (
          <div
            className="absolute right-0 top-11 z-40 w-[340px] overflow-hidden rounded-[15px] border border-line bg-card shadow-[var(--shadow-lg)]"
            role="dialog"
            aria-label="Notifications"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="font-serif text-[16px] text-navy-deep">Notifications</p>
              <span className="text-[11px] text-ink-faint">{unread} new</span>
            </div>
            <ul>
              {NOTIFS.map((n, i) => {
                const inner = (
                  <div className="flex items-start gap-3 px-4 py-3 transition hover:bg-paper/60">
                    <span
                      className={`mt-1 size-2 flex-shrink-0 rounded-full ${
                        n.tone === "urgent"
                          ? "bg-clay"
                          : n.tone === "review"
                            ? "bg-navy"
                            : "bg-ink-faint"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold">{n.head}</p>
                      <p className="line-clamp-2 text-[11.5px] text-ink-soft">{n.body}</p>
                      <p className="mt-0.5 text-[10.5px] text-ink-faint">{n.when}</p>
                    </div>
                  </div>
                );
                return (
                  <li key={i} className={i > 0 ? "border-t border-line" : ""}>
                    {n.href ? (
                      <Link href={n.href} onClick={() => setOpen(false)}>
                        {inner}
                      </Link>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
            <Link
              href="/clinician/audit"
              onClick={() => setOpen(false)}
              className="block border-t border-line bg-paper/60 px-4 py-3 text-center text-[12.5px] font-semibold text-sage-deep hover:bg-paper"
            >
              View audit timeline
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
