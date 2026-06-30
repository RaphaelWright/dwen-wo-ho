import { OnboardingBrandLogo } from "@/components/patient/onboarding/brand-logo";
import { OnboardingReferralPicker } from "@/components/patient/onboarding/workspace/referral-picker";
import type { OnboardingHeaderProps } from "@/lib/types/components/patient/onboarding";

export function OnboardingWorkspaceHeader({
  referralHandle,
  onReferralChange,
}: OnboardingHeaderProps) {
  return (
    <header className="auth-header">
      <div className="brand">
        <OnboardingBrandLogo placement="header" />
      </div>
      <OnboardingReferralPicker
        referralHandle={referralHandle}
        onReferralChange={onReferralChange}
      />
    </header>
  );
}
