"use client";

import { useRouter } from "next/navigation";
import useGetSearchParams from "@/hooks/use-get-search-params";
import { useProviderSignupGuard } from "@/hooks/provider/use-provider-signup-guard";
import {
  isProviderSignupProfileStepSlug,
  profileStepSlugToIndex,
  hasProviderAuthToken,
} from "@/lib/utils/provider-signup-resume";

export function useProviderSignup() {
  const router = useRouter();
  const name = useGetSearchParams("name");
  const title = useGetSearchParams("title");
  const specialty = useGetSearchParams("specialty");
  const photo = useGetSearchParams("photo");
  const email = useGetSearchParams("email");
  const step = useGetSearchParams("step");

  const guard = useProviderSignupGuard();

  const getProfileStepFromUrl = () => {
    if (!isProviderSignupProfileStepSlug(step)) {
      return null;
    }

    return profileStepSlugToIndex(step);
  };

  const urlProfileStep = getProfileStepFromUrl();
  const isResumeLocked =
    guard.isResumeLocked || (urlProfileStep !== null && hasProviderAuthToken());

  const profileStep = isResumeLocked
    ? (guard.profileStep ?? urlProfileStep)
    : urlProfileStep;

  const handleBack = () => {
    router.back();
  };

  return {
    email: email ?? undefined,
    fullName: name ?? undefined,
    title: title ?? undefined,
    specialty: specialty ?? undefined,
    profileImage: photo ?? undefined,
    profileStep,
    isResumeLocked,
    isCheckingGuard: guard.isChecking,
    handleBack,
  };
}
