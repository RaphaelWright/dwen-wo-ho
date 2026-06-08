"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { toast } from "@/components/ui/sonner";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import { ROUTES } from "@/lib/constants/routes";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { calculateTimeAgo } from "@/lib/utils";
import { setUserType } from "@/lib/utils/getUserType";
import { validateProviderProfileStep } from "@/lib/utils/provider-profile-validation";
import { formatGhanaPhoneForApi } from "@/lib/utils/ghana-phone";
import {
  ProviderProfileData,
  ProviderProfileStep,
} from "@/lib/types/provider/auth";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";

export interface PendingUserInfo {
  name: string;
  title: string;
  specialty: string;
  timeAgo: string;
  profileImage?: string;
}

export const useProfileActions = ({
  email,
  password,
  profileData,
  currentStep,
  setCurrentStep,
  setUserInfo,
}: {
  email: string;
  password?: string;
  profileData: ProviderProfileData;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setUserInfo: React.Dispatch<React.SetStateAction<PendingUserInfo>>;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { addSpecialtyMutation, updateProfileMutation, loginMutation } = useAuthQuery();

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
        const data = await updateProfileMutation.mutateAsync({
          officePhoneNumber: formatGhanaPhoneForApi(profileData.phoneNumber),
          status: profileData.bio,
        });

        if (data) {
          setUserInfo((prev) => ({
            ...prev,
            name: `${data.title ? `${data.title} ` : ""}${
              data.name || prev.name
            }`,
            title: data.specialty || prev.title,
            specialty: data.specialty || prev.specialty,
            profileImage:
              typeof data.avatarUrl === "string"
                ? data.avatarUrl
                : prev.profileImage,
            timeAgo: data.memberSince
              ? calculateTimeAgo(data.memberSince as string)
              : prev.timeAgo,
          }));
        }

        toast.success(SIGN_UP_TEXTS.errors.profileUpdated);
        setCurrentStep(currentStep + 1);
      } catch (error: unknown) {
        toast.error(getCleanErrorMessage(error) || SIGN_UP_TEXTS.errors.updateProfileFailed);
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

        if (password) {
          try {
            const loginResponse = await loginMutation.mutateAsync({
              email,
              password,
            });

            if (loginResponse) {
              const { token, refreshToken: refreshTokenValue, userData } = loginResponse;

              if (refreshTokenValue) {
                localStorage.setItem("refreshToken", refreshTokenValue);
                localStorage.removeItem("token");
              } else if (token) {
                localStorage.setItem("token", token);
              }

              if (userData?.userRole === "ROLE_CURATOR") {
                localStorage.setItem("curatorToken", token || refreshTokenValue);
                setUserType("curator");
              } else {
                setUserType("provider");
              }

              router.push(ROUTES.provider.home);
            } else {
              toast.error(SIGN_UP_TEXTS.errors.autoLoginFailed);
              router.push(`${ROUTES.provider.auth}?step=sign-in&email=${encodeURIComponent(email)}` as Route);
            }
          } catch {
            toast.error(SIGN_UP_TEXTS.errors.autoLoginFailed);
            router.push(`${ROUTES.provider.auth}?step=sign-in&email=${encodeURIComponent(email)}` as Route);
          }
        } else {
          router.push(`${ROUTES.provider.auth}?step=sign-in&email=${encodeURIComponent(email)}` as Route);
        }
      } catch (error: unknown) {
        toast.error(getCleanErrorMessage(error) || SIGN_UP_TEXTS.errors.addSpecialtyFailed);
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
