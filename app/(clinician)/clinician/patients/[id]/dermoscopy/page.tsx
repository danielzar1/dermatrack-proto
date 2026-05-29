import { patients } from "@/lib/mock/patients";
import { DermoscopyClient } from "./Client";

// Only patients with a `suspicious` lesion need a dermoscopy page at
// build time. (Today: just Pieter van Wyk.)
export function generateStaticParams() {
  return patients
    .filter((p) => p.lesions.some((l) => l.status === "suspicious"))
    .map((p) => ({ id: p.id }));
}

type Params = { id: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  return <DermoscopyClient id={id} />;
}
