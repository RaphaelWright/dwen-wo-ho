"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { DEFAULT_PROVIDER_USER_INFO } from "@/lib/constants/mock-data";
import useUserQuery from "@/hooks/queries/useUserQuery";
import { calculateTimeAgo } from "@/lib/utils";

export interface ProviderUserInfo {
  name: string;
  title: string;
  specialty: string;
  profileImage?: string;
  timeAgo: string;
}

export function useProviderHome() {
  const router = useRouter();
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [userInfo, setUserInfo] = useState<ProviderUserInfo>({
    ...DEFAULT_PROVIDER_USER_INFO,
    profileImage: undefined,
  });

  // Reuse the user query logic to get status
  const { getProfileQuery } = useUserQuery({
    refetchInterval: showPendingModal ? 5000 : undefined,
    enabled: hasToken,
  });

  // Protect route and handle pending state from LocalStorage (Fallback)
  useEffect(() => {
    let isMounted = true;
    let hasChecked = false;

    const checkAuth = () => {
      if (hasChecked) return;
      hasChecked = true;

      const refreshToken = localStorage.getItem("refreshToken");
      const token = localStorage.getItem("token");
      const pendingUserStr = localStorage.getItem("pendingUser");

      // Check if we have any token (refreshToken or token)
      const hasAnyToken = refreshToken || token;

      if (!hasAnyToken && !pendingUserStr) {
        // No tokens and no pending user - redirect to auth
        if (isMounted) {
          router.replace(`${ROUTES.provider.auth}?step=sign-in`);
        }
        return;
      }

      // If we have any token, enable query (don't redirect even if API fails)
      if (hasAnyToken && isMounted) {
        setHasToken(true);
      }

      // If local storage has pending user data, use it to show modal immediately
      if (pendingUserStr) {
        try {
          const pendingData = JSON.parse(pendingUserStr);

          const isPending =
            pendingData.applicationStatus === "PENDING" ||
            pendingData.status === "PENDING" ||
            pendingData.applicationStatus === "REJECTED" ||
            pendingData.isVerified === false;

          if (isPending) {
            setUserInfo({
              name: `${pendingData.title ? `${pendingData.title} ` : ""}${
                pendingData.providerName || pendingData.fullName || "Provider"
              }`,
              title:
                pendingData.professionalTitle ||
                pendingData.specialty ||
                "Health Provider",
              specialty: pendingData.specialty || "",
              profileImage:
                pendingData.profilePhotoURL || pendingData.profileURL,
              timeAgo: pendingData.applicationTimestamp
                ? calculateTimeAgo(pendingData.applicationTimestamp)
                : "Recently",
            });
            setShowPendingModal(true);
          }
        } catch (e) {
          console.error("HOME PAGE: Failed to parse pending user data", e);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Update with real data from API if available
  useEffect(() => {
    if (getProfileQuery.data) {
      const data = getProfileQuery.data;

      const isPending =
        data.applicationStatus === "PENDING" ||
        data.status === "PENDING" ||
        data.applicationStatus === "REJECTED" ||
        (data as any).isVerified === false;

      if (isPending) {
        setUserInfo({
          name: `${(data as any).title ? `${(data as any).title} ` : ""}${
            data.providerName || "Provider"
          }`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          title:
            (data as any).professionalTitle ||
            data.specialty ||
            "Health Provider",
          specialty: data.specialty || "",
          profileImage: data.profilePhotoURL,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          timeAgo: (data as any).applicationDate
            ? calculateTimeAgo((data as any).applicationDate)
            : "Recently",
        });
        setShowPendingModal(true);
      } else {
        setShowPendingModal(false);
        // If verified/approved, clear the pending fallback
        localStorage.removeItem("pendingUser");

        // Check for incomplete profile logic (mirrors signin.tsx)
        const email = data.email || ""; // Ensure we have an email if possible
        const emailParams = email ? `email=${encodeURIComponent(email)}&` : "";

        if (!data.profilePhotoURL && !data.profileURL) {
          router.replace(`/provider/signup?${emailParams}step=photo`);
          return;
        }

        if (!data.officePhoneNumber && !data.phoneNumber) {
          router.replace(`/provider/signup?${emailParams}step=bio`);
          return;
        }

        if (
          (!data.specialty || !data.specialty.trim()) &&
          (!data.professionalTitle || !data.professionalTitle.trim())
        ) {
          router.replace(`/provider/signup?${emailParams}step=specialty`);
          return;
        }
      }
    }

    // Handle API errors - don't redirect on auth errors if we have pendingUser
    if (getProfileQuery.error) {
      const error = getProfileQuery.error as any;
      // If it's an auth error but we have pendingUser, show the modal
      const pendingUserStr = localStorage.getItem("pendingUser");
      if (
        pendingUserStr &&
        (error?.message?.includes("401") || error?.message?.includes("Invalid"))
      ) {
        try {
          const pendingData = JSON.parse(pendingUserStr);
          const isPending =
            pendingData.applicationStatus === "PENDING" ||
            pendingData.status === "PENDING" ||
            pendingData.applicationStatus === "REJECTED";
          if (isPending) {
            setUserInfo({
              name: `${pendingData.title ? `${pendingData.title} ` : ""}${
                pendingData.providerName || pendingData.fullName || "Provider"
              }`,
              title:
                pendingData.professionalTitle ||
                pendingData.specialty ||
                "Health Provider",
              specialty: pendingData.specialty || "",
              profileImage:
                pendingData.profilePhotoURL || pendingData.profileURL,
              timeAgo: pendingData.applicationTimestamp
                ? calculateTimeAgo(pendingData.applicationTimestamp)
                : "Recently",
            });
            setShowPendingModal(true);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, [getProfileQuery.data, getProfileQuery.error, router]);

  const isApproved = getProfileQuery.data?.applicationStatus === "APPROVED";
  const isLoading = getProfileQuery.isLoading;

  // Redirect approved providers to schools page immediately
  useEffect(() => {
    if (isApproved && !isLoading) {
      router.replace("/provider/schools");
    }
  }, [isApproved, isLoading, router]);

  return {
    userInfo,
    showPendingModal,
    isLoading,
    isApproved,
  };
}
