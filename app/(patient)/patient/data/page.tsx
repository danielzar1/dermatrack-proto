"use client";

import Link from "next/link";
import { patients } from "@/lib/mock/patients";
import { Icon } from "@/components/Icons";
import { useToast } from "@/components/Toaster";

/**
 * "My data" — POPIA data-rights area for the patient.
 *  - access log (who looked at my record, when)
 *  - corrections (request a fix)
 *  - consent management
 *  - export / delete
 *  - information officer contact
 */
export default function PatientData() {
  const patient = patients[0]!;
  const { toast } = useToast();

  return (
    <div>
      <Link
        href="/patient"
        className="inline-flex items-center gap-1.5 pt-2 text-[13px] text-ink-soft"
      >
        <Icon.ChevronLeft size={15} />
        Home
      </Link>

      <p className="eyebrow mt-2">POPIA · your data, your rights</p>
      <h1 className="mt-1 font-serif text-[24px] leading-tight">My data</h1>
      <p className="mt-1 text-[13px] text-ink-soft">
        See who has accessed your record, request a correction, change your
        consent, or download a copy of your information.
      </p>

      <div className="card-flush mt-4">
        <SettingRow
          icon={<Icon.Audit size={16} />}
          title="Access log"
          desc="See every time your record has been viewed."
          rightChip={`${patient.audit.length} entries`}
          onClick={() => toast("Access log — full timeline")}
        />
        <SettingRow
          icon={<Icon.Code size={16} />}
          title="Request a correction"
          desc="Ask for an inaccuracy to be reviewed and fixed."
          onClick={() => toast("Correction form — coming soon")}
        />
        <SettingRow
          icon={<Icon.Lock size={16} />}
          title="Consent settings"
          desc="What you've shared, and what you can revoke."
          onClick={() => toast("Consent management")}
        />
        <SettingRow
          icon={<Icon.Pill size={16} />}
          title="My prescriptions"
          desc="Active and historical scripts."
          onClick={() => (window.location.href = "/patient/scripts")}
        />
        <SettingRow
          icon={<Icon.Send size={16} />}
          title="Export my data"
          desc="Download everything we hold about you."
          onClick={() => toast("Export prepared — link emailed")}
        />
        <SettingRow
          icon={<Icon.X size={16} />}
          title="Delete my account"
          desc="Permanent. Audit log retained as legally required."
          warn
          onClick={() => toast("Are you sure? Confirmation step would go here.")}
        />
      </div>

      <h2 className="mt-5 font-serif text-[16px]">Recent access</h2>
      <div className="card-flush mt-2">
        {patient.audit.slice(0, 4).map((a, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 px-3 py-2.5 text-[12px] ${
              i > 0 ? "border-t border-line" : ""
            }`}
          >
            <span className="mt-1 inline-block size-2 flex-shrink-0 rounded-full bg-sage-deep" />
            <div>
              <p className="leading-snug">
                <span className="font-semibold">{a.action}</span> · {a.what}
              </p>
              <p className="text-[10.5px] text-ink-faint">
                {a.when} · {a.who}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-5 font-serif text-[16px]">Information Officer</h2>
      <div className="card-flush mt-2 flex items-center gap-3 bg-paper p-3">
        <span
          className="grid size-12 flex-shrink-0 place-items-center rounded-full text-white"
          style={{ background: "linear-gradient(145deg,#4f6b4e,#3f5740)" }}
        >
          <span className="text-[13px] font-semibold">JD</span>
        </span>
        <div>
          <p className="text-[13px] font-semibold">Dr J Damelin</p>
          <p className="text-[11px] text-ink-faint">Information Officer · Demo Medical Centre</p>
          <p className="text-[11.5px] text-navy">io@demo.dermatrack.co.za</p>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  desc,
  rightChip,
  warn,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  rightChip?: string;
  warn?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-line px-3 py-3 text-left last:border-b-0 hover:bg-paper"
    >
      <span
        className={`grid size-9 flex-shrink-0 place-items-center rounded-[11px] ${
          warn ? "bg-clay-tint text-[#9a4a26]" : "bg-paper text-ink-soft"
        }`}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-semibold">{title}</p>
        <p className="text-[11.5px] text-ink-faint">{desc}</p>
      </div>
      {rightChip ? (
        <span className="chip">{rightChip}</span>
      ) : (
        <Icon.ChevronRight size={14} className="text-ink-faint" />
      )}
    </button>
  );
}
