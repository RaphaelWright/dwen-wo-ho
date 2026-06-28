import { Logo } from "@/components/shared/logo";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { OnboardingHeaderProps } from "@/lib/types/components/patient/onboarding";

export function OnboardingReferralBadge({
  referralHandle,
}: OnboardingHeaderProps) {
  const hasReferral = Boolean(referralHandle);

  return (
    <div
      className="border-warm-sand/60 bg-warm-sand/10 text-foreground inline-flex max-w-full min-w-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-medium sm:px-4 sm:py-2 sm:text-sm"
      aria-label={
        hasReferral
          ? `${ONBOARDING_COPY.referralPrefix} @${referralHandle}`
          : ONBOARDING_COPY.referralOnly
      }
    >
      {hasReferral ? (
        <>
          <span className="text-muted-foreground shrink-0">
            {ONBOARDING_COPY.referralPrefix}
          </span>
          <span className="text-primary ml-1 min-w-0 truncate font-semibold">
            @{referralHandle}
          </span>
        </>
      ) : (
        <span className="text-foreground truncate font-medium">
          {ONBOARDING_COPY.referralOnly}
        </span>
      )}
    </div>
  );
}

export function OnboardingWorkspaceHeader({
  referralHandle,
}: OnboardingHeaderProps) {
  return (
    <header className="flex w-full shrink-0 items-center justify-between gap-2 px-4 pt-[max(1.5rem,env(safe-area-inset-top,0px))] pb-1 sm:gap-4 sm:px-6 sm:pt-6 lg:justify-end lg:px-12 lg:pt-12 lg:pb-0">
      <Logo
        variant="black"
        className="h-auto w-28 shrink-0 sm:w-32 lg:hidden"
      />
      <div className="flex min-w-0 flex-1 justify-end lg:flex-none">
        <OnboardingReferralBadge referralHandle={referralHandle} />
      </div>
    </header>
  );
}
