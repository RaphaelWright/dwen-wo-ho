"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Route } from "next";
import { toast } from "sonner";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import useUserQuery from "@/hooks/queries/useUserQuery";
import { ROUTES } from "@/lib/constants/routes";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { calculateTimeAgo } from "@/lib/utils";
import { setUserType } from "@/lib/utils/getUserType";
import { SignUpProfileProps } from "@/lib/types/provider/auth";

export const useSignUpProfile = ({
  email,
  fullName,
  title,
  specialty,
  profileImage,
  isPending,
  onBack,
  startStep = 0,
  password,
}: SignUpProfileProps) => {
  const [currentStep, setCurrentStep] = useState(startStep);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addSpecialtyMutation, updateProfileMutation, loginMutation } =
    useAuthQuery();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Enable polling only when pending modal is shown
  const { getProfileQuery } = useUserQuery({
    refetchInterval: showPendingModal ? 5000 : undefined,
  });

  const [profileData, setProfileData] = useState({
    photo: null as string | null,
    phoneNumber: "",
    bio: "",
    specialty: "",
  });

  const [userInfo, setUserInfo] = useState({
    name: `${title} ${fullName}`,
    title: title,
    specialty: specialty || "",
    timeAgo: "Just now",
    profileImage: profileImage as string | undefined,
  });

  // Watch for approval
  useEffect(() => {
    if (
      getProfileQuery.data?.applicationStatus === "APPROVED" ||
      getProfileQuery.data?.applicationStatus === "ACTIVE"
    ) {
      router.push(ROUTES.provider.home);
    }
  }, [getProfileQuery.data, router]);

  useEffect(() => {
    const isPendingParam = searchParams.get("pending") === "true";
    if (isPendingParam || isPending) {
      setShowPendingModal(true);
    }
  }, [searchParams, isPending]);

  // Update modal with fetched profile data
  useEffect(() => {
    if (showPendingModal && getProfileQuery.data) {
      const data = getProfileQuery.data;
      setUserInfo((prev) => ({
        ...prev,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: `${(data as any).title ? `${(data as any).title} ` : ""}${
          data.providerName || prev.name
        }`,
        // If professionalTitle is available in response use it, else fallback
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        title: (data as any).professionalTitle || data.specialty || prev.title,
        specialty: data.specialty || prev.specialty,
        profileImage: data.profilePhotoURL,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timeAgo: (data as any).applicationDate
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            calculateTimeAgo((data as any).applicationDate)
          : prev.timeAgo,
      }));
    }
  }, [showPendingModal, getProfileQuery.data]);

  const handleChange = (
    property: keyof typeof profileData,
    value: string | null,
  ) => {
    setProfileData((prev) => ({ ...prev, [property]: value }));
  };

  const handleBack = () => {
    if (currentStep === 0) {
      onBack?.();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!profileData.photo) {
        return;
      }
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
          setUserInfo((prev) => ({
            ...prev,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            name: `${(data as any).title ? `${(data as any).title} ` : ""}${
              data.providerName || prev.name
            }`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            title:
              (data as any).professionalTitle || data.specialty || prev.title,
            specialty: data.specialty || prev.specialty,
            profileImage: data.profilePhotoURL || prev.profileImage,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            timeAgo: (data as any).applicationDate
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                calculateTimeAgo((data as any).applicationDate)
              : prev.timeAgo,
          }));
        }

        toast.success(SIGN_UP_TEXTS.errors.profileUpdated);
        setCurrentStep(currentStep + 1);
      } catch (error) {
        toast.error(
          (error as any)?.message || SIGN_UP_TEXTS.errors.updateProfileFailed,
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

        if (password) {
          try {
            const loginResponse = await loginMutation.mutateAsync({
              email: email,
              password: password,
            });

            if (loginResponse.success) {
              const {
                token,
                refreshToken: refreshTokenValue,
                userData,
              } = loginResponse.data;

              if (refreshTokenValue) {
                localStorage.setItem("refreshToken", refreshTokenValue);
                localStorage.removeItem("token");
              } else if (token) {
                localStorage.setItem("token", token);
              }

              if (userData?.userRole === "ROLE_CURATOR") {
                localStorage.setItem(
                  "curatorToken",
                  token || refreshTokenValue,
                );
                setUserType("curator");
              } else {
                setUserType("provider");
              }

              router.push(ROUTES.provider.home);
            } else {
              toast.error(SIGN_UP_TEXTS.errors.autoLoginFailed);
              router.push(
                `${ROUTES.provider.auth}?step=sign-in&email=${encodeURIComponent(
                  email,
                )}` as Route,
              );
            }
          } catch {
            toast.error(SIGN_UP_TEXTS.errors.autoLoginFailed);
            router.push(
              `${ROUTES.provider.auth}?step=sign-in&email=${encodeURIComponent(
                email,
              )}` as Route,
            );
          }
        } else {
          router.push(
            `${ROUTES.provider.auth}?step=sign-in&email=${encodeURIComponent(
              email,
            )}` as Route,
          );
        }
      } catch (error) {
        toast.error(
          (error as any)?.message || SIGN_UP_TEXTS.errors.addSpecialtyFailed,
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  return {
    currentStep,
    setCurrentStep,
    showPendingModal,
    setShowPendingModal,
    isSubmitting,
    profileData,
    userInfo,
    getProfileQuery,
    handleChange,
    handleBack,
    handleNext,
  };
};
