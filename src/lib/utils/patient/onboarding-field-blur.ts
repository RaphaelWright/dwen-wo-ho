import type {
  FieldValidationKey,
  FieldValidationState,
  OnboardingDraft,
} from "@/lib/types/components/patient/onboarding";
import { getFieldValidationState } from "@/lib/utils/patient/onboarding-screen-validation";

export function resolveFieldBlurState(
  field: FieldValidationKey,
  draft: OnboardingDraft,
): FieldValidationState {
  return getFieldValidationState(field, draft);
}

export const INITIAL_FIELD_VALIDATION: Record<
  FieldValidationKey,
  FieldValidationState
> = {
  phone: "idle",
  email: "idle",
  password: "idle",
  confirmPassword: "idle",
};
