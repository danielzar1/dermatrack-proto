import { patients } from "@/lib/mock/patients";
import { PatientLesionClient } from "./Client";

// Demo patient is patients[0] (Hadassah Friedman). Generate one page
// per tracked lesion number.
export function generateStaticParams() {
  const demo = patients[0];
  return demo ? demo.lesions.map((l) => ({ lno: String(l.num) })) : [];
}

type Params = { lno: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { lno } = await params;
  return <PatientLesionClient lno={lno} />;
}
