import { OnboardingShell } from "@/components/patient/onboarding/shell";
import { inter, plusJakartaSans } from "@/lib/fonts/fonts";
import { PatientOnboardingLayoutProps } from "@/lib/types/components/patient/onboarding";
import "@/styles/patient-onboarding-mock.css";
import "@/styles/patient-onboarding-light.css";

export default function PatientOnboardingLayout({
  children,
}: PatientOnboardingLayoutProps) {
  return (
    <OnboardingShell
      className={`${plusJakartaSans.variable} ${inter.variable} ${plusJakartaSans.className}`}
    >
      {children}
    </OnboardingShell>
  );
}
