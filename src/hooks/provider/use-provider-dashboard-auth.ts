"use client";

import { useEffect, useState } from "react";
import useUserQuery from "../queries/use-user-profile";
import { DEFAULT_PROVIDER_USER_INFO } from "@/lib/constants/mock-data";

export default function useProviderDashboardAuth() {
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    title: string;
    specialty: string;
    profileImage?: string;
    timeAgo: string;
  }>({
    ...DEFAULT_PROVIDER_USER_INFO,
    profileImage: undefined,
  });

  // Get user profile for approval status
  const { getProfileQuery } = useUserQuery({
    refetchInterval: showPendingModal ? 5000 : undefined,
    enabled: hasToken,
  });

  // Check for token and set up user info from pendingUser storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setHasToken(!!token);

      const pendingUser = localStorage.getItem("pendingUser");
      if (pendingUser) {
        try {
          const userData = JSON.parse(pendingUser);
          setUserInfo({
            name: `${userData.title ? `${userData.title} ` : ""}${userData.providerName || "Provider"}`,
            title:
              userData.professionalTitle ||
              userData.specialty ||
              "Health Provider",
            specialty: userData.specialty || "",
            profileImage:
              userData.profilePhotoURL || userData.profileURL || undefined,
            timeAgo: "Recently",
          });
          setShowPendingModal(true);
        } catch {
          setShowPendingModal(true);
        }
      }
    }
  }, []);

  // Update user info from profile query and determine approval status
  useEffect(() => {
    if (getProfileQuery.data) {
      const data = getProfileQuery.data;
      let timeAgo = "Recently";
      const createdDate =
        data.applicationTimestamp ||
        data.createdAt ||
        data.created_at ||
        data.joinedAt;

      if (createdDate && typeof createdDate === "string") {
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
        name: `${data.title ? `${String(data.title)} ` : ""}${String(data.providerName || data.name || "Provider")}`,
        title: String(
          data.professionalTitle || data.specialty || "Health Provider",
        ),
        specialty: String(data.specialty || ""),
        profileImage:
          (data.profilePhotoURL as string | undefined) ||
          (data.profileURL as string | undefined) ||
          (data.profileImage as string | undefined) ||
          undefined,
        timeAgo,
      });

      // Standardize on applicationStatus field per API JSON
      const isPending = data.applicationStatus === "PENDING";
      const isRejected = data.applicationStatus === "REJECTED";
      setShowPendingModal(isPending || isRejected);

      // Set provider ID for WebSocket subscription manager
      const providerId = data.id || data.providerId || data.email;
      if (providerId && typeof providerId === "string") {
        localStorage.setItem("providerId", providerId);
        // subscriptionManager.setProviderId is now handled by useNotificationWebSocket
        // Keeping localStorage set for backward compatibility
      }
    }
  }, [getProfileQuery.data]);

  const isApproved =
    getProfileQuery.data?.status === "APPROVED" ||
    getProfileQuery.data?.applicationStatus === "APPROVED";
  const isLoading = getProfileQuery.isLoading;

  return {
    userInfo,
    isApproved,
    isLoading,
  };
}
