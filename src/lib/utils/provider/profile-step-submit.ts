import type { ProviderProfileBioStepData } from "@/lib/schemas/provider-auth-schema";
import { toSentenceCase } from "@/lib/utils/shared/string-case";

export async function submitProviderBioStep(
  updateProfile: (data: {
    officePhoneNumber: string;
    status: string;
  }) => Promise<unknown>,
  bioStepData: ProviderProfileBioStepData,
): Promise<void> {
  await updateProfile({
    officePhoneNumber: bioStepData.phoneNumber,
    status: toSentenceCase(bioStepData.bio),
  });
}

export async function submitProviderSpecialtyStep(
  addSpecialty: (data: { specialty: string }) => Promise<unknown>,
  specialty: string,
): Promise<void> {
  await addSpecialty({ specialty });
}
