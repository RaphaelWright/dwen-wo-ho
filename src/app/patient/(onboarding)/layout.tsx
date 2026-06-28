import { OnboardingShell } from "@/components/patient/onboarding/shell";
import { PatientOnboardingLayoutProps } from "@/lib/types/components/patient/onboarding";

export default function PatientOnboardingLayout({
  children,
}: PatientOnboardingLayoutProps) {
  return <OnboardingShell>{children}</OnboardingShell>;
}
