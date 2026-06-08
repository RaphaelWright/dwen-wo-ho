import {
  ProviderProfileBioStepSchema,
  ProviderProfilePhotoStepSchema,
  ProviderProfileSpecialtyStepSchema,
} from "@/lib/schemas/provider-auth-schema";
import {
  ProviderProfileData,
  ProviderProfileStep,
} from "@/lib/types/provider/auth";

const PROFILE_STEP_SCHEMAS = [
  ProviderProfilePhotoStepSchema,
  ProviderProfileBioStepSchema,
  ProviderProfileSpecialtyStepSchema,
] as const;

export const validateProviderProfileStep = (
  step: ProviderProfileStep,
  data: ProviderProfileData,
) => {
  const result = PROFILE_STEP_SCHEMAS[step].safeParse(data);

  return {
    isValid: result.success,
    error: result.success ? undefined : result.error.issues[0]?.message,
  };
};

export const isProviderProfileStepValid = (
  step: ProviderProfileStep,
  data: ProviderProfileData,
) => validateProviderProfileStep(step, data).isValid;
