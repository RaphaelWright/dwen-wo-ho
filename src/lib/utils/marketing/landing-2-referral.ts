import type { Route } from "next";
import { LANDING_2_SEQUENCE_IDS } from "@/lib/constants/components/marketing/landing-2-sequence";
import { LANDING_2_CONTENT } from "@/lib/marketing/landing-2";
import { ROUTES } from "@/lib/constants/infra/routes";

const LOCK_IN_WITH_PREFIX = "Lock In with @";

export function parseReferralFromLockInLabel(
  text: string,
  defaultLabel: string = LANDING_2_CONTENT.intro.lockInDefault,
): string | null {
  if (text === defaultLabel) {
    return null;
  }

  if (text.startsWith(LOCK_IN_WITH_PREFIX)) {
    const handle = text.slice(LOCK_IN_WITH_PREFIX.length).trim();
    return handle || null;
  }

  return null;
}

export function syncLockInButtonReferral(
  lockInBtn: HTMLElement,
  labelText: string,
): void {
  const referral = parseReferralFromLockInLabel(labelText);

  if (referral) {
    lockInBtn.dataset.referral = referral;
    return;
  }

  delete lockInBtn.dataset.referral;
}

export function getLanding2LockInReferral(): string | null {
  const lockInBtn = document.getElementById(LANDING_2_SEQUENCE_IDS.lockInBtn);
  if (!lockInBtn) {
    return null;
  }

  const referral = lockInBtn.dataset.referral?.trim();
  return referral || null;
}

export function buildPatientJoinRoute(referralHandle?: string | null): Route {
  const trimmed = referralHandle?.trim();
  if (!trimmed) {
    return ROUTES.patient.join as Route;
  }

  return `${ROUTES.patient.join}?ref=${encodeURIComponent(trimmed)}` as Route;
}
