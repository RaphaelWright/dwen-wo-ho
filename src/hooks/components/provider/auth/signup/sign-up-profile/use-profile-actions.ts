"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { toast } from "sonner";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { ROUTES } from "@/lib/constants/routes";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { setUserType } from "@/lib/utils/auth/get-user-type";
import { validateProviderProfileStep } from "@/lib/utils/provider/profile-validation";
import type { ProviderProfileBioStepData } from "@/lib/schemas/provider-auth-schema";
import {
  ProviderProfileData,
  ProviderProfileStep,
} from "@/lib/types/components/provider/auth";
import { getCleanErrorMessage } from "@/lib/utils/auth/error";
import { toSentenceCase } from "@/lib/utils/shared/string-case";
import { applyProviderAuthTokens } from "@/lib/utils/auth/provider-tokens";
import {
  clearProviderSignupPassword,
  getProviderSignupPassword,
} from "@/lib/utils/provider/signup-password";
import { hasProviderAuthToken } from "@/lib/utils/provider/signup-resume";

export const useProfileActions = ({
  email,
  password,
  profileData,
  currentStep,
  setCurrentStep,
}: {
  email: string;
  password?: string;
  profileData: ProviderProfileData;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { addSpecialtyMutation, updateProfileMutation, loginMutation } =
    useAuthQuery();

  const redirectToSignIn = () => {
    router.push(
      `${ROUTES.provider.auth}?step=sign-in&email=${encodeURIComponent(email)}` as Route,
    );
  };

  const finishSignup = async () => {
    const resolvedPassword =
      password?.trim() || getProviderSignupPassword(email) || undefined;

    if (hasProviderAuthToken()) {
      clearProviderSignupPassword(email);
      setUserType("provider");
      router.push(ROUTES.provider.home);
      return;
    }

    if (!resolvedPassword) {
      redirectToSignIn();
      return;
    }

    try {
      const loginResponse = await loginMutation.mutateAsync({
        email,
        password: resolvedPassword,
      });

      if (!loginResponse) {
        toast.error(SIGN_UP_TEXTS.errors.autoLoginFailed);
        redirectToSignIn();
        return;
      }

      clearProviderSignupPassword(email);
      applyProviderAuthTokens({
        token: loginResponse.token,
        refreshToken: loginResponse.refreshToken,
        userRole: loginResponse.userData?.userRole,
      });
      router.push(ROUTES.provider.home);
    } catch {
      toast.error(SIGN_UP_TEXTS.errors.autoLoginFailed);
      redirectToSignIn();
    }
  };

  const handleNext = async () => {
    const stepValidation = validateProviderProfileStep(
      currentStep as ProviderProfileStep,
      profileData,
    );

    if (!stepValidation.isValid) {
      toast.error(stepValidation.error ?? SIGN_UP_TEXTS.errors.fillAllFields);
      return;
    }

    if (currentStep === 0) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    if (currentStep === 1) {
      setIsSubmitting(true);
      try {
        const bioStepData = stepValidation.data as ProviderProfileBioStepData;
        await updateProfileMutation.mutateAsync({
          officePhoneNumber: bioStepData.phoneNumber,
          status: toSentenceCase(bioStepData.bio),
        });

        toast.success(SIGN_UP_TEXTS.errors.profileUpdated);
        setCurrentStep(currentStep + 1);
      } catch (error: unknown) {
        toast.error(
          getCleanErrorMessage(error) ||
            SIGN_UP_TEXTS.errors.updateProfileFailed,
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (currentStep === 2) {
      setIsSubmitting(true);
      try {
        await addSpecialtyMutation.mutateAsync({
          specialty: profileData.specialty,
        });

        toast.success(SIGN_UP_TEXTS.errors.specialtyAdded);
        await finishSignup();
      } catch (error: unknown) {
        toast.error(
          getCleanErrorMessage(error) ||
            SIGN_UP_TEXTS.errors.addSpecialtyFailed,
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  return {
    isSubmitting,
    handleNext,
  };
};
