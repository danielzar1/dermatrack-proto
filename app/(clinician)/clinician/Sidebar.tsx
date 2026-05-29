"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/Icons";
import { clearDemoRole } from "@/lib/demo/role";

const ITEMS = [
  { href: "/clinician" as const, label: "Dashboard", Icon: Icon.Home, exact: true },
  { href: "/clinician/patients" as const, label: "Patients", Icon: Icon.Patients, exact: false },
  { href: "/clinician/coding" as const, label: "Coding", Icon: Icon.Code, exact: false },
  { href: "/clinician/protocols" as const, label: "Protocols", Icon: Icon.Protocol, exact: false },
  { href: "/clinician/audit" as const, label: "Audit", Icon: Icon.Audit, exact: false },
];

type Props = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: Props = {}) {
  const path = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-dvh w-[244px] flex-shrink-0 flex-col border-r border-line bg-card backdrop-blur-sm">
      <div className="px-5 pb-4 pt-7">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-3">
          <span
            className="grid size-10 place-items-center rounded-[14px] text-white"
            style={{ background: "linear-gradient(145deg,#2c4d78,#15273f)" }}
            aria-hidden
          >
            <Icon.Heart size={20} />
          </span>
          <div>
            <p className="font-serif text-[20px] leading-none text-navy-deep">DermaTrack</p>
            <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.14em] text-sage-deep">
              Clinician
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {ITEMS.map((it) => {
          const active = it.exact ? path === it.href : path.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              onClick={onNavigate}
              className={`sidebar-item ${active ? "on" : ""}`}
            >
              <span className="sib-ico">
                <it.Icon size={19} />
              </span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-[14px] border border-line bg-paper/60 p-3">
        <div className="flex items-center gap-3">
          <span
            className="grid size-10 flex-shrink-0 place-items-center rounded-full text-white"
            style={{ background: "linear-gradient(145deg,#4f6b4e,#3f5740)" }}
          >
            <span className="text-[13px] font-semibold">JD</span>
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold">Dr J Damelin</p>
            <p className="truncate text-[11px] text-ink-faint">MP 123456 · Dermatology</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            clearDemoRole();
            router.push("/");
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[10px] border border-line bg-card px-3 py-2 text-[12px] font-medium text-ink-soft transition hover:bg-paper"
        >
          <Icon.Logout size={14} />
          End session
        </button>
      </div>
    </aside>
  );
}
