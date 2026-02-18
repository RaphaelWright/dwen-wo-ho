"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelectedValuesFromReactHookForm } from "@/hooks/forms/useSelectedValuesFromReactHookForm";
import {
  ProviderLoginSchema,
  ProviderLoginFormData,
} from "@/lib/schemas/provider.auth.schema";
import useAuthQuery from "@/hooks/queries/useAuthQuery";
import { setUserType } from "@/lib/utils/getUserType";
import { ROUTES } from "@/lib/constants/routes";
import { DEFAULT_PENDING_USER_INFO } from "@/lib/constants/mock-data";

export const useProviderSignIn = ({
  email,
  onForgotPassword,
}: {
  email: string;
  onBack: () => void;
  onForgotPassword?: () => void;
  onProfileIncomplete?: (step: number) => void;
}) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    ...DEFAULT_PENDING_USER_INFO,
    profileImage: undefined as string | undefined,
  });
  const { loginMutation, recoverAccountMutation } = useAuthQuery();
  const { register, handleSubmit, errors, watch } =
    useSelectedValuesFromReactHookForm(ProviderLoginSchema, {
      mode: "onChange",
      defaultValues: {
        email,
        password: "",
      },
    });

  const getCleanErrorMessage = (error: any): string => {
    let message = "An unexpected error occurred.";

    if (typeof error === "string") {
      message = error;
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    }

    if (typeof message === "string" && message.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(message);
        if (parsed.message) return parsed.message;
        if (parsed.error) return parsed.error;
      } catch {}
    }

    return message;
  };

  const onSubmit = async (values: ProviderLoginFormData) => {
    setErrorMessage("");
    localStorage.removeItem("token");
    localStorage.removeItem("curatorToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("pendingUser");

    try {
      const response = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      if (response.success) {
        if (response.data?.userData) {
          const { token, userData } = response.data;

          if (token) {
            localStorage.setItem("token", token);
            if (userData?.userRole === "ROLE_CURATOR") {
              localStorage.setItem("curatorToken", token);
              setUserType("curator");
            } else {
              setUserType("provider");
            }
          }

          const refreshTokenValue = response.data?.refreshToken;
          if (refreshTokenValue) {
            localStorage.setItem("refreshToken", refreshTokenValue);
          }

          const isPending =
            userData.applicationStatus === "PENDING" ||
            userData.status === "PENDING" ||
            (response as any).message === "ACCOUNT PENDING";

          if (isPending) {
            let timeAgo = "Recently";
            const createdDate =
              (userData as any).applicationTimestamp ||
              (userData as any).createdAt ||
              (userData as any).created_at ||
              (userData as any).joinedAt;

            if (createdDate) {
              const date = new Date(createdDate);
              const now = new Date();
              const diffInSeconds = Math.floor(
                (now.getTime() - date.getTime()) / 1000,
              );

              if (diffInSeconds < 60) {
                timeAgo = "Just now";
              } else if (diffInSeconds < 3600) {
                const mins = Math.floor(diffInSeconds / 60);
                timeAgo = `${mins} minute${mins > 1 ? "s" : ""} ago`;
              } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
              } else {
                const days = Math.floor(diffInSeconds / 86400);
                timeAgo = `${days} day${days > 1 ? "s" : ""} ago`;
              }
            }

            setUserInfo({
              name: `${(userData as any).title ? `${(userData as any).title} ` : ""}${userData.providerName || "Provider"}`,
              title:
                (userData as any).professionalTitle ||
                userData.specialty ||
                "Health Provider",
              timeAgo: timeAgo,
              profileImage:
                userData.profilePhotoURL || userData.profileURL || undefined,
            });

            localStorage.setItem("pendingUser", JSON.stringify(userData));
            setIsRedirecting(true);
            router.push(ROUTES.provider.home);
            return;
          }

          if (userData.applicationStatus === "APPROVED") {
            if (userData?.userRole === "ROLE_CURATOR") {
              if (token) localStorage.setItem("curatorToken", token);
              setIsRedirecting(true);
              router.push(ROUTES.curator.schools);
              return;
            }

            const emailParams = encodeURIComponent(values.email);
            if (!userData.profileURL) {
              router.push(`/provider/signup?email=${emailParams}&step=photo`);
              return;
            }
            if (!userData.officePhoneNumber) {
              router.push(`/provider/signup?email=${emailParams}&step=bio`);
              return;
            }
            if (!userData.specialty || !userData.specialty.trim()) {
              router.push(
                `/provider/signup?email=${emailParams}&step=specialty`,
              );
              return;
            }

            setIsRedirecting(true);
            router.push(ROUTES.provider.home);
            return;
          }

          if (userData.applicationStatus === "REJECTED") {
            localStorage.setItem("pendingUser", JSON.stringify(userData));
            setIsRedirecting(true);
            router.push(ROUTES.provider.home);
            return;
          }

          // Fallback Curator check
          if (userData?.userRole === "ROLE_CURATOR") {
            if (token) localStorage.setItem("curatorToken", token);
            setIsRedirecting(true);
            router.push(ROUTES.curator.schools);
            return;
          }

          // Fallback Profile Check
          const emailParams = encodeURIComponent(values.email);
          if (!userData.profileURL) {
            router.push(`/provider/signup?email=${emailParams}&step=photo`);
            return;
          }
          if (!userData.officePhoneNumber) {
            router.push(`/provider/signup?email=${emailParams}&step=bio`);
            return;
          }
          if (!userData.specialty || !userData.specialty.trim()) {
            router.push(`/provider/signup?email=${emailParams}&step=specialty`);
            return;
          }

          setIsRedirecting(true);
          localStorage.removeItem("pendingUser");
          router.push(ROUTES.provider.home);
        }

        if (response.data?.isVerified === false) {
          setUserInfo({
            name: `${(response.data as any)?.title ? `${(response.data as any).title} ` : ""}${response.data?.fullName || "Dr. Amanda Gorman"}`,
            title: response.data?.professionalTitle || "Clinical Psychologist",
            timeAgo: "2 hours ago",
            profileImage: undefined,
          });
          localStorage.setItem("pendingUser", JSON.stringify(response.data));
          setIsRedirecting(true);
          router.push(ROUTES.provider.home);
        } else {
          localStorage.removeItem("pendingUser");
          setIsRedirecting(true);
          router.push(ROUTES.provider.home);
        }
      } else {
        setErrorMessage(
          getCleanErrorMessage(response.message || "Sign in failed"),
        );
      }
    } catch (error: any) {
      const errorMessage = getCleanErrorMessage(error);
      let isPendingError = false;
      try {
        if (error?.message && error.message.includes("ACCOUNT PENDING"))
          isPendingError = true;
        else if (error?.response?.data?.message === "ACCOUNT PENDING")
          isPendingError = true;
      } catch {}

      if (isPendingError || errorMessage.includes("ACCOUNT PENDING")) {
        setUserInfo({
          name: "Provider",
          title: "Health Provider",
          timeAgo: "Recently",
          profileImage: undefined,
        });
        router.push(ROUTES.provider.home);
        return;
      }

      if (errorMessage.includes("Profile is not complete")) {
        if (errorMessage.includes("upload your profile photo")) {
          router.push(
            `/provider/signup?email=${encodeURIComponent(email)}&step=photo`,
          );
        } else if (errorMessage.includes("office phone number")) {
          router.push(
            `/provider/signup?email=${encodeURIComponent(email)}&step=bio`,
          );
        } else if (errorMessage.includes("add your specialty")) {
          router.push(
            `/provider/signup?email=${encodeURIComponent(email)}&step=specialty`,
          );
        } else {
          router.push(
            `/provider/signup?email=${encodeURIComponent(email)}&step=photo`,
          );
        }
      } else {
        setErrorMessage(errorMessage);
      }
    }
  };

  const handleRecoverAccount = async () => {
    setErrorMessage("");
    try {
      const response = await recoverAccountMutation.mutateAsync({ email });
      if (response.success) {
        if (onForgotPassword) onForgotPassword();
        else
          router.push(`${ROUTES.provider.verifyPasswordReset}?email=${email}`);
      } else {
        setErrorMessage(response.message || "Failed to send recovery email.");
      }
    } catch (error: any) {
      setErrorMessage(getCleanErrorMessage(error));
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit: handleSubmit(onSubmit),
    errorMessage,
    isLoading: loginMutation.isPending || isRedirecting,
    isRecovering: recoverAccountMutation.isPending,
    handleRecoverAccount,
    showPendingModal,
    setShowPendingModal,
    userInfo,
  };
};
