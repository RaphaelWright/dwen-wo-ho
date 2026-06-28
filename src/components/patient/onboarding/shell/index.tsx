import { SocialProofPanel } from "@/components/patient/onboarding/social-proof-panel";
import {
  OnboardingShellContentProps,
  OnboardingShellProps,
} from "@/lib/types/components/patient/onboarding";

export function OnboardingShell({ children }: OnboardingShellProps) {
  return (
    <main className="bg-background flex h-dvh w-full flex-col overflow-hidden lg:flex-row">
      <SocialProofPanel />
      <section className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden lg:w-1/2">
        {children}
      </section>
    </main>
  );
}

export function OnboardingShellContent({
  children,
}: OnboardingShellContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {children}
    </div>
  );
}
