"use client";

import Link from "next/link";
import { useState } from "react";
import { icdCodes, findIcd } from "@/lib/mock/icd";
import { Icon } from "@/components/Icons";

/**
 * Standalone ICD-10 picker — the same component is opened as a sheet
 * from the patient detail screen ("+ Add code"). Standalone view lets a
 * clinician browse/favourite codes without an open patient context.
 */
export default function CodingPage() {
  const [q, setQ] = useState("");
  const results = findIcd(q);
  const favs = results.filter((c) => c.fav);
  const others = results.filter((c) => !c.fav);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-8 md:px-10">
        <Link href="/clinician" className="mb-3 inline-flex items-center gap-1.5 text-[13px] text-ink-soft hover:text-navy">
          <Icon.ChevronLeft size={15} />
          Dashboard
        </Link>
        <p className="eyebrow">Code a diagnosis</p>
        <h1 className="mt-1 font-serif text-[30px] text-navy-deep">ICD-10 lookup</h1>
        <p className="mt-2 text-[14px] text-ink-soft">
          South African coding for medical aid claims. Your favourites surface first.
        </p>

        <div className="relative mt-5">
          <Icon.Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            className="input !pl-10"
            placeholder="Type ‘L40’ or ‘psoriasis’…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="card-flush mt-3 overflow-hidden">
          {favs.length > 0 && (
            <>
              <div className="px-3 pb-1 pt-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                ★ Your favourites
              </div>
              {favs.map((c) => (
                <div key={c.code} className="icd-row fav">
                  <span className="icd-code">{c.code}</span>
                  <span className="icd-name">{c.name}</span>
                  <span className="icd-star">★</span>
                </div>
              ))}
            </>
          )}
          {others.length > 0 && (
            <>
              <div className="border-t border-line px-3 pb-1 pt-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                {q ? "MATCHES" : "COMMON DERMATOLOGY CODES"}
              </div>
              {others.map((c) => (
                <div key={c.code} className="icd-row">
                  <span className="icd-code">{c.code}</span>
                  <span className="icd-name">{c.name}</span>
                </div>
              ))}
            </>
          )}
          {results.length === 0 && (
            <p className="px-3 py-8 text-center text-[13px] text-ink-faint">
              No matches for “{q}”.
            </p>
          )}
        </div>

        <p className="mt-4 text-[11.5px] text-ink-faint">
          Showing {results.length} of {icdCodes.length} codes loaded in this prototype.
        </p>
      </div>
    </div>
  );
}
