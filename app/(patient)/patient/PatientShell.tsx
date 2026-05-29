"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/Icons";
import { clearDemoRole } from "@/lib/demo/role";

type NavItem = {
  href: Route | string;
  label: string;
  Icon: (props: { size?: number; className?: string }) => React.ReactElement;
  match: (p: string) => boolean;
};

/**
 * Patient shell: status bar, scrollable content area, bottom nav.
 * On wide viewports the whole thing is framed in a phone mockup; on
 * narrow viewports it's just full-screen.
 */
export function PatientShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/patient" as const, label: "Home", Icon: Icon.Home, match: (p: string) => p === "/patient" },
    { href: "/patient/body" as const, label: "Body", Icon: Icon.Body, match: (p: string) => p.startsWith("/patient/body") || p.startsWith("/patient/lesions") },
    { href: "/patient/treatment" as const, label: "Plan", Icon: Icon.Protocol, match: (p: string) => p.startsWith("/patient/treatment") },
    { href: "/patient/data" as const, label: "Privacy", Icon: Icon.Lock, match: (p: string) => p.startsWith("/patient/data") || p.startsWith("/patient/scripts") },
  ];

  return (
    <div className="min-h-dvh w-full">
      {/* Mobile / narrow: full-screen */}
      <div className="flex min-h-dvh w-full flex-col lg:hidden">
        <PhoneInner navItems={navItems} path={path} onExit={() => { clearDemoRole(); router.push("/"); }}>
          {children}
        </PhoneInner>
      </div>

      {/* Desktop: phone frame */}
      <div className="hidden min-h-dvh items-center justify-center px-6 py-8 lg:flex">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-12">
          <PhoneFrame>
            <PhoneInner navItems={navItems} path={path} onExit={() => { clearDemoRole(); router.push("/"); }}>
              {children}
            </PhoneInner>
          </PhoneFrame>
          <DesktopAside />
        </div>
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative h-[844px] w-[390px] overflow-hidden rounded-[46px] bg-card"
      style={{
        boxShadow:
          "var(--shadow-lg), 0 0 0 11px #11161d, 0 0 0 13px #283340",
      }}
    >
      <div
        className="absolute left-1/2 top-0 z-[50] h-[30px] w-[150px] -translate-x-1/2 rounded-b-[18px]"
        style={{ background: "#11161d" }}
        aria-hidden
      />
      {children}
    </div>
  );
}

function PhoneInner({
  children,
  navItems,
  path,
  onExit,
}: {
  children: React.ReactNode;
  navItems: NavItem[];
  path: string;
  onExit: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* iOS-style status bar */}
      <div className="flex flex-shrink-0 items-center justify-between px-7 pb-1 pt-3.5 text-[13px] font-semibold tracking-wide">
        <span>9:41</span>
        <span className="text-ink-soft">DermaTrack</span>
        <span className="text-[12px]">●●● 🔋</span>
      </div>
      <div className="relative flex-1 overflow-y-auto px-5 pb-24 pt-2">
        {children}
      </div>
      <nav className="absolute bottom-0 left-0 right-0 flex justify-around border-t border-line bg-card/93 px-1 pb-6 pt-2 backdrop-blur-md">
        {navItems.map((it) => {
          const on = it.match(path);
          return (
            <Link
              key={String(it.href)}
              href={it.href as Route}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium ${
                on ? "text-navy" : "text-ink-faint"
              }`}
            >
              <it.Icon size={20} />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        aria-label="End session"
        onClick={onExit}
        className="absolute right-3 top-3 z-40 grid size-7 place-items-center rounded-full bg-card/70 text-ink-faint backdrop-blur hover:bg-paper"
      >
        <Icon.X size={13} />
      </button>
    </div>
  );
}

function DesktopAside() {
  return (
    <div className="max-w-sm">
      <p className="eyebrow">Patient experience</p>
      <h2 className="mt-2 font-serif text-[36px] leading-tight text-navy-deep">
        Same record.
        <br />
        Two sides.
      </h2>
      <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
        The patient app is what Hadassah opens on her phone between visits.
        It’s the same data the clinician sees on the dashboard — POPIA-aware,
        installable as a PWA, no real-PHI gate until SA data residency is
        resolved.
      </p>
      <ul className="mt-5 space-y-2.5 text-[13.5px] text-ink-soft">
        <li className="flex items-start gap-3">
          <span className="mt-1 inline-block size-2 rounded-full bg-sage-deep" />
          POPIA consent gate on first launch
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-1 inline-block size-2 rounded-full bg-sage-deep" />
          Serial-photo capture with prior-shot ghost guide
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-1 inline-block size-2 rounded-full bg-sage-deep" />
          Data-rights area (access log, corrections, export, delete)
        </li>
      </ul>
      <Link
        href={"/clinician" as const}
        className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-sage-deep hover:underline"
      >
        Switch to clinician view
        <Icon.ChevronRight size={14} />
      </Link>
    </div>
  );
}
