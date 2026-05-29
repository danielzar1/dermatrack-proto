import Link from "next/link";
import { patients } from "@/lib/mock/patients";
import { Icon } from "@/components/Icons";

/**
 * Audit log timeline. Every PHI read/write is recorded per
 * ARCHITECTURE.md §4. The demo aggregates the per-patient audit entries
 * into a global feed; in production this comes from `audit_log` joined
 * via SECURITY DEFINER RPCs to keep writes atomic with data ops.
 */
export default function AuditPage() {
  const entries = patients.flatMap((p) =>
    p.audit.map((e) => ({ ...e, patient: p.name, patientCode: p.code })),
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-8 md:px-10">
        <Link href="/clinician" className="mb-3 inline-flex items-center gap-1.5 text-[13px] text-ink-soft hover:text-navy">
          <Icon.ChevronLeft size={15} />
          Dashboard
        </Link>
        <p className="eyebrow">Audit · all PHI access</p>
        <h1 className="mt-1 font-serif text-[30px] text-navy-deep">Audit timeline</h1>
        <p className="mt-2 text-[14px] text-ink-soft">
          Every read, write and view of patient data. Tamper-evident at the
          database boundary; this view aggregates today’s entries.
        </p>

        <div className="card-flush mt-6 overflow-hidden">
          {entries.length === 0 && (
            <p className="px-5 py-8 text-center text-[13px] text-ink-faint">
              No audit entries yet.
            </p>
          )}
          {entries.map((e, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 px-5 py-3.5 ${i > 0 ? "border-t border-line" : ""}`}
            >
              <span className="mt-1 inline-block size-2.5 flex-shrink-0 rounded-full bg-sage-deep" />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold">
                  {e.action} · <span className="font-normal text-ink-soft">{e.what}</span>
                </p>
                <p className="text-[11.5px] text-ink-faint">
                  {e.when} · {e.who} · {e.patient} ({e.patientCode})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
