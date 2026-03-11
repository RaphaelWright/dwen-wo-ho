"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { calculateTimeAgo } from "@/lib/utils";

export function useAuthValidation(
  router: ReturnType<typeof useRouter>,
  setHasToken: React.Dispatch<React.SetStateAction<boolean>>,
  setUserInfo: React.Dispatch<React.SetStateAction<{
    name: string;
    title: string;
    specialty: string;
    profileImage?: string;
    timeAgo: string;
  }>>,
  setShowPendingModal: React.Dispatch<React.SetStateAction<boolean>>,
) {
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
  }, [router, setHasToken, setUserInfo, setShowPendingModal]);
}