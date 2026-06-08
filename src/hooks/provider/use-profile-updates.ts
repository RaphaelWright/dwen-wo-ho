"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UseQueryResult } from "@tanstack/react-query";
import { ROUTES } from "@/lib/constants/routes";
import { calculateTimeAgo } from "@/lib/utils";
import type { ProviderProfileResponse } from "@/lib/types/api/auth";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";

export function useProfileUpdates(
  getProfileQuery: UseQueryResult<ProviderProfileResponse, Error>,
  router: ReturnType<typeof useRouter>,
  setShowPendingModal: React.Dispatch<React.SetStateAction<boolean>>,
  setUserInfo: React.Dispatch<React.SetStateAction<{
    name: string;
    title: string;
    specialty: string;
    profileImage?: string;
    timeAgo: string;
  }>>,
  hasToken: boolean,
) {
  useEffect(() => {
    if (getProfileQuery.data) {
      const data = getProfileQuery.data;

      const isPending =
        data.applicationStatus === "PENDING" ||
        data.status === "PENDING" ||
        data.applicationStatus === "REJECTED" ||
        data.isVerified === false;

      if (isPending) {
        setUserInfo({
          name: `${data.title ? `${String(data.title)} ` : ""}${
            String(data.providerName ?? "Provider")
          }`,
          title: String(
            data.professionalTitle ?? data.specialty ?? "Health Provider",
          ),
          specialty: String(data.specialty ?? ""),
          profileImage: data.profilePhotoURL as string | undefined,
          timeAgo: data.applicationDate
            ? calculateTimeAgo(String(data.applicationDate))
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
          router.replace(`${ROUTES.provider.signUp}?${emailParams}step=photo`);
          return;
        }

        if (!data.officePhoneNumber && !data.phoneNumber) {
          router.replace(`${ROUTES.provider.signUp}?${emailParams}step=bio`);
          return;
        }

        if (
          (!data.specialty || !data.specialty.trim()) &&
          (!data.professionalTitle || !data.professionalTitle.trim())
        ) {
          router.replace(`${ROUTES.provider.signUp}?${emailParams}step=specialty`);
          return;
        }
      }
    }

    // Handle API errors - don't redirect on auth errors if we have pendingUser
    if (getProfileQuery.error) {
      const errorMessage = getCleanErrorMessage(getProfileQuery.error);
      const pendingUserStr = localStorage.getItem("pendingUser");
      if (
        pendingUserStr &&
        (errorMessage.includes("401") || errorMessage.includes("Invalid"))
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
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [getProfileQuery.data, getProfileQuery.error, router, setShowPendingModal, setUserInfo, hasToken]);
}