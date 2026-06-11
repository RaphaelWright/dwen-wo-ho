"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import useUserQuery from "../queries/use-user-profile";

const emptySubscribe = () => () => {};

const readHasAuth = () =>
  !!(localStorage.getItem("token") || localStorage.getItem("refreshToken"));

export default function useProviderDashboardAuth() {
  // SSR-safe read of auth tokens without a mount effect (avoids hydration
  // mismatch: server renders false, client reads localStorage after hydration).
  const hasAuth = useSyncExternalStore(emptySubscribe, readHasAuth, () => false);
  const [pollApproval, setPollApproval] = useState(false);

  const { getProfileQuery } = useUserQuery({
    enabled: hasAuth,
    refetchInterval: pollApproval ? 5000 : undefined,
  });

  useEffect(() => {
    const status =
      getProfileQuery.data?.applicationStatus ?? getProfileQuery.data?.status;

    setPollApproval(Boolean(hasAuth && status && status !== "APPROVED"));

    if (!getProfileQuery.data) {
      return;
    }

    const providerId =
      getProfileQuery.data.id ||
      getProfileQuery.data.providerId ||
      getProfileQuery.data.email;

    if (providerId && typeof providerId === "string") {
      localStorage.setItem("providerId", providerId);
    }
  }, [getProfileQuery.data, hasAuth]);

  const applicationStatus =
    getProfileQuery.data?.applicationStatus ?? getProfileQuery.data?.status;

  return {
    isApproved: applicationStatus === "APPROVED",
    isLoading: hasAuth && getProfileQuery.isLoading,
    authProfile: getProfileQuery.data,
  };
}
