import Link from "next/link";
import { patients } from "@/lib/mock/patients";
import { Icon } from "@/components/Icons";

/**
 * Protocols library — reusable treatment plans the clinician assigns to
 * patients. Each plan has steps, due dates, and an optional surveillance
 * note. In the prototype the library is populated from the protocols
 * already assigned across the patient roster; in production it's a
 * separate table the clinician maintains.
 */
export default function ProtocolsPage() {
  const seen = new Set<string>();
  const all = patients.flatMap((p) =>
    p.protocols.map((proto) => ({ ...proto, patient: p.name })),
  );
  const unique = all.filter((p) => {
    if (seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 pb-16 pt-8 md:px-10">
        <Link href="/clinician" className="mb-3 inline-flex items-center gap-1.5 text-[13px] text-ink-soft hover:text-navy">
          <Icon.ChevronLeft size={15} />
          Dashboard
        </Link>
        <p className="eyebrow">Protocols library</p>
        <h1 className="mt-1 font-serif text-[30px] text-navy-deep">Treatment plans</h1>
        <p className="mt-2 text-[14px] text-ink-soft">
          Reusable plans with steps and surveillance notes. Assign one to a
          patient from their detail page.
        </p>

        <div className="mt-6 space-y-3">
          {unique.map((p) => (
            <div key={p.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-[20px] text-navy-deep">{p.name}</h2>
                  <p className="mt-1 max-w-2xl text-[13.5px] text-ink-soft">{p.summary}</p>
                </div>
                <span className="chip chip-sage flex-shrink-0">
                  {p.steps.length} steps
                </span>
              </div>
              {p.surveillanceNote && (
                <p className="mt-3 rounded-[10px] border border-[#e6c3b0] bg-clay-tint/70 px-3 py-2 text-[12px] text-[#8a5238]">
                  <strong className="font-semibold">Surveillance.</strong>{" "}
                  {p.surveillanceNote}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
