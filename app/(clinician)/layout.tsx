import { Shell } from "./clinician/Shell";
import { Toaster } from "@/components/Toaster";
import { RoleSwitcher } from "@/components/RoleSwitcher";

/**
 * Clinician shell — left sidebar + top confidentiality strip + content.
 * Desktop-first (244px sidebar). On mobile, sidebar becomes a hamburger-
 * triggered drawer (see Shell.tsx).
 */
export default function ClinicianLayout({ children }: { children: React.ReactNode }) {
  return (
    <Toaster>
      <Shell>{children}</Shell>
      <RoleSwitcher current="clinician" />
    </Toaster>
  );
}
