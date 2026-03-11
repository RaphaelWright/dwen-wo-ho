"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_PROVIDER_USER_INFO } from "@/lib/constants/mock-data";
import useUserQuery from "@/hooks/queries/use-user-profile";
import { useAuthValidation } from "./use-auth-validation";
import { useProfileUpdates } from "./use-profile-updates";
import { useApprovedProviderRedirect } from "./use-approved-provider-redirect";

export function useProviderHome() {
  const router = useRouter();
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

  // Reuse the user query logic to get status
  const { getProfileQuery } = useUserQuery({
    refetchInterval: showPendingModal ? 5000 : undefined,
    enabled: hasToken,
  });

  // Handle authentication and token validation
  useAuthValidation(router, setHasToken, setUserInfo, setShowPendingModal);

  // Handle profile updates and incomplete profile checks
  useProfileUpdates(
    getProfileQuery,
    router,
    setShowPendingModal,
    setUserInfo,
    hasToken,
  );

  // Handle approved provider redirection
  useApprovedProviderRedirect(
    getProfileQuery.data?.applicationStatus,
    getProfileQuery.isLoading,
    router,
  );

  return {
    userInfo,
    showPendingModal,
    isLoading: getProfileQuery.isLoading,
    isApproved: getProfileQuery.data?.applicationStatus === "APPROVED",
  };
}
