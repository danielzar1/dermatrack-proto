"use client";

import { useState } from "react";
import { findIcd } from "@/lib/mock/icd";
import type { IcdCode } from "@/lib/mock/types";
import { Icon } from "@/components/Icons";

/**
 * Bottom-sheet ICD-10 picker. Same data as /clinician/coding; this is
 * the in-context picker invoked from the patient detail.
 */

type Props = {
  bucket: "differential" | "confirmed";
  onClose: () => void;
  onPick: (code: IcdCode) => void;
};

export function IcdSheet({ bucket, onClose, onPick }: Props) {
  const [q, setQ] = useState("");
  const results = findIcd(q);
  const favs = results.filter((c) => c.fav);
  const others = results.filter((c) => !c.fav);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-3 sm:items-center">
      <div className="flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-[22px] bg-card shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="eyebrow">
              {bucket === "confirmed" ? "Add to confirmed" : "Add to differential"}
            </p>
            <h2 className="font-serif text-[20px] text-navy-deep">ICD-10 lookup</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-ink-faint hover:bg-paper"
            aria-label="Close"
          >
            <Icon.X size={17} />
          </button>
        </div>

        <div className="px-5 pt-3">
          <div className="relative">
            <Icon.Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              autoFocus
              className="input !pl-10"
              placeholder="Type ‘L40’ or ‘psoriasis’…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3">
          <div className="card-flush overflow-hidden">
            {favs.length > 0 && (
              <>
                <div className="px-3 pb-1 pt-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  ★ Your favourites
                </div>
                {favs.map((c) => (
                  <button
                    type="button"
                    key={c.code}
                    onClick={() => onPick(c)}
                    className="icd-row fav w-full text-left"
                  >
                    <span className="icd-code">{c.code}</span>
                    <span className="icd-name">{c.name}</span>
                    <span className="icd-star">★</span>
                  </button>
                ))}
              </>
            )}
            {others.length > 0 && (
              <>
                <div className="border-t border-line px-3 pb-1 pt-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  {q ? "MATCHES" : "COMMON DERMATOLOGY CODES"}
                </div>
                {others.map((c) => (
                  <button
                    type="button"
                    key={c.code}
                    onClick={() => onPick(c)}
                    className="icd-row w-full text-left"
                  >
                    <span className="icd-code">{c.code}</span>
                    <span className="icd-name">{c.name}</span>
                  </button>
                ))}
              </>
            )}
            {results.length === 0 && (
              <p className="px-3 py-8 text-center text-[13px] text-ink-faint">
                No matches for “{q}”.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
