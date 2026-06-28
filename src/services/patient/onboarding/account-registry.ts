import type {
  ContactMode,
  OnboardingDraft,
} from "@/lib/types/components/patient/onboarding";
import {
  composeFullName,
  normalizeContactKey,
} from "@/lib/utils/patient/onboarding-format";

export interface StoredPatientAccount {
  contactKey: string;
  contactMode: ContactMode;
  password: string;
  nickname: string;
  onboardingComplete: boolean;
  draft: Partial<OnboardingDraft>;
}

const accounts = new Map<string, StoredPatientAccount>();

function getContactKey(contactMode: ContactMode, value: string): string {
  return `${contactMode}:${normalizeContactKey(contactMode, value)}`;
}

function lookupAccount(
  contactMode: ContactMode,
  value: string,
): StoredPatientAccount | null {
  const key = getContactKey(contactMode, value);
  return accounts.get(key) ?? null;
}

function registerAccount(params: {
  contactMode: ContactMode;
  contactValue: string;
  password: string;
  draft: OnboardingDraft;
}): StoredPatientAccount {
  const contactKey = getContactKey(params.contactMode, params.contactValue);
  const account: StoredPatientAccount = {
    contactKey,
    contactMode: params.contactMode,
    password: params.password,
    nickname: params.draft.nickname,
    onboardingComplete: false,
    draft: { ...params.draft },
  };
  accounts.set(contactKey, account);
  return account;
}

function updatePassword(contactKey: string, password: string): boolean {
  const account = accounts.get(contactKey);
  if (!account) {
    return false;
  }
  account.password = password;
  accounts.set(contactKey, account);
  return true;
}

function markOnboardingComplete(
  contactMode: ContactMode,
  contactValue: string,
  draft: OnboardingDraft,
): StoredPatientAccount | null {
  const key = getContactKey(contactMode, contactValue);
  const existing = accounts.get(key);
  if (!existing) {
    return null;
  }

  const updated: StoredPatientAccount = {
    ...existing,
    nickname: draft.nickname || existing.nickname,
    onboardingComplete: true,
    draft: {
      ...draft,
      fullName: composeFullName(draft.firstName, draft.lastName),
    },
  };
  accounts.set(key, updated);
  return updated;
}

function verifyPassword(
  contactMode: ContactMode,
  contactValue: string,
  password: string,
): StoredPatientAccount | null {
  const account = lookupAccount(contactMode, contactValue);
  if (!account || account.password !== password) {
    return null;
  }
  return account;
}

export const patientOnboardingService = {
  lookupContact: lookupAccount,
  registerAccount,
  updatePassword,
  markOnboardingComplete,
  verifyPassword,
};
