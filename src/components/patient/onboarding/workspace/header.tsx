import { Logo } from "@/components/shared/logo";
import { OnboardingReferralPicker } from "@/components/patient/onboarding/workspace/referral-picker";
import type { OnboardingHeaderProps } from "@/lib/types/components/patient/onboarding";

export function OnboardingWorkspaceHeader({
  referralHandle,
  onReferralChange,
}: OnboardingHeaderProps) {
  return (
    <header className="flex w-full shrink-0 items-center justify-between gap-2 px-4 pt-[max(1.5rem,env(safe-area-inset-top,0px))] pb-1 sm:gap-4 sm:px-6 sm:pt-6 lg:justify-end lg:px-12 lg:pt-12 lg:pb-0">
      <Logo variant="auto" className="h-auto w-28 shrink-0 sm:w-32 lg:hidden" />
      <div className="flex min-w-0 flex-1 justify-end lg:flex-none">
        <OnboardingReferralPicker
          referralHandle={referralHandle}
          onReferralChange={onReferralChange}
        />
      </div>
    </header>
  );
}
