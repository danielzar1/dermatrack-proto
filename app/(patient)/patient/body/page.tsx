"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { patients } from "@/lib/mock/patients";
import { BodyMap } from "@/components/BodyMap";
import { Icon } from "@/components/Icons";
import { useToast } from "@/components/Toaster";

/**
 * Patient body map. Tap a numbered badge to open that lesion's timeline.
 */
export default function PatientBody() {
  const patient = patients[0]!;
  const router = useRouter();
  const { toast } = useToast();

  return (
    <div>
      <div className="flex items-baseline justify-between pt-2">
        <div>
          <p className="eyebrow">Navigate by location</p>
          <h1 className="mt-1 font-serif text-[24px]">Body map</h1>
        </div>
        <Link
          href="/patient"
          className="grid size-9 place-items-center rounded-full border border-line bg-card text-ink-soft"
          aria-label="Close"
        >
          <Icon.X size={15} />
        </Link>
      </div>

      <div className="card-flush mt-3 p-3">
        <BodyMap
          lesions={patient.lesions}
          scale={1.05}
          onLesionClick={(l) => router.push(`/patient/lesions/${l.num}` as const)}
          onRegionClick={(r) => toast(`Region: ${r}`)}
        />
      </div>

      <button
        type="button"
        onClick={() => toast("Tap any body region to start")}
        className="btn btn-outline mt-3 w-full"
      >
        + Track a new area
      </button>
    </div>
  );
}
