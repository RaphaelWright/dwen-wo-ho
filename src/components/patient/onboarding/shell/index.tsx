import { SocialProofPanel } from "@/components/patient/onboarding/social-proof-panel";
import {
  OnboardingShellContentProps,
  OnboardingShellProps,
} from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

export function OnboardingShell({ children, className }: OnboardingShellProps) {
  return (
    <main
      className={cn(
        "patient-onboarding app bg-[var(--ob-app-bg)] text-[var(--ob-text)]",
        className,
      )}
    >
      <SocialProofPanel />
      <section className="auth-side">{children}</section>
    </main>
  );
}

export function OnboardingShellContent({
  children,
}: OnboardingShellContentProps) {
  return <div className="relative h-full min-h-0 flex-1">{children}</div>;
}
