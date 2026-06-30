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

/** Live validity for controls; border errors only after blur unless already valid. */
export function resolveOnboardingFieldUiState(
  touchedState: FieldValidationState,
  draft: OnboardingDraft,
  field: FieldValidationKey,
): { canSubmit: boolean; validationState: FieldValidationState } {
  const live = getFieldValidationState(field, draft);
  const validationState =
    touchedState === "idle" && live !== "valid" ? "idle" : live;

  return {
    canSubmit: live === "valid",
    validationState,
  };
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
