import { patients } from "@/lib/mock/patients";
import { PatientDetailClient } from "./Client";

// Static export needs a complete list of patient IDs at build time so
// Next can emit one HTML file per patient.
export function generateStaticParams() {
  return patients.map((p) => ({ id: p.id }));
}

type Params = { id: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  return <PatientDetailClient id={id} />;
}
