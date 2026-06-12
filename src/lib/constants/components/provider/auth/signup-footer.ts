import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";

export const PROVIDER_SIGNUP_FOOTER_SLOTS = {
  backMinWidth: "min-w-[5.5rem]",
  actionMinWidth: "min-w-[9.5rem]",
  rowHeight: "h-10",
} as const;

export const PROVIDER_PROFILE_SUB_STEPS = [
  { label: SIGN_UP_TEXTS.profile.steps.photo, index: 0 },
  { label: SIGN_UP_TEXTS.profile.steps.bio, index: 1 },
  { label: SIGN_UP_TEXTS.profile.steps.specialty, index: 2 },
] as const;
