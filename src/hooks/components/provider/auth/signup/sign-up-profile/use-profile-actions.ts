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
  profileData: any;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { addSpecialtyMutation, updateProfileMutation, loginMutation } = useAuthQuery();

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!profileData.photo) return;
      setCurrentStep((prev) => prev + 1);
      return;
    }

    if (
      currentStep === 1 &&
      (!profileData.bio.trim() || !profileData.phoneNumber.trim())
    ) {
      toast.error(SIGN_UP_TEXTS.errors.fillAllFields);
      return;
    }

    if (currentStep === 2 && !profileData.specialty) {
      toast.error(SIGN_UP_TEXTS.errors.selectSpecialty);
      return;
    }

    if (currentStep === 1) {
      setIsSubmitting(true);
      try {
        const response = await updateProfileMutation.mutateAsync({
          officePhoneNumber: profileData.phoneNumber,
          status: profileData.bio,
        });

        if (response?.success && response?.data) {
          const data = response.data;
          setUserInfo((prev: any) => ({
            ...prev,
            name: `${(data as any).title ? `${(data as any).title} ` : ""}${
              data.providerName || prev.name
            }`,
            title: (data as any).professionalTitle || data.specialty || prev.title,
            specialty: data.specialty || prev.specialty,
            profileImage: data.profilePhotoURL || prev.profileImage,
            timeAgo: (data as any).applicationDate
              ? calculateTimeAgo((data as any).applicationDate)
              : prev.timeAgo,
          }));
        }

        toast.success(SIGN_UP_TEXTS.errors.profileUpdated);
        setCurrentStep(currentStep + 1);
      } catch (error) {
        toast.error((error as any)?.message || SIGN_UP_TEXTS.errors.updateProfileFailed);
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

            if (loginResponse.success) {
              const { token, refreshToken: refreshTokenValue, userData } = loginResponse.data;

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
      } catch (error) {
        toast.error((error as any)?.message || SIGN_UP_TEXTS.errors.addSpecialtyFailed);
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
