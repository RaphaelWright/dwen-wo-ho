"use client";

import { useEffect, useState } from "react";
import useUserQuery from "../queries/use-user-profile";

export default function useProviderDashboardAuth() {
  const [hasAuth, setHasAuth] = useState(false);
  const [pollApproval, setPollApproval] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    setHasAuth(!!(token || refreshToken));
  }, []);

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
  };
};
