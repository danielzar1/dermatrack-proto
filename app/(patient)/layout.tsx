import { Toaster } from "@/components/Toaster";
import { PatientShell } from "./patient/PatientShell";
import { RoleSwitcher } from "@/components/RoleSwitcher";

/**
 * Patient app shell. Mobile-first: on phone viewports it's full-screen.
 * On desktop, we frame it inside a phone mockup so the panel sees the
 * patient experience in its real form factor next to the clinician
 * dashboard — the side-by-side story is the whole point.
 */
export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Toaster>
      <PatientShell>{children}</PatientShell>
      <RoleSwitcher current="patient" />
    </Toaster>
  );
}
