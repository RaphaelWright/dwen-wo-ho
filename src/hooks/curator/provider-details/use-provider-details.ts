"use client";

import { useParams } from "next/navigation";
import { getStatusColor } from "@/lib/utils/provider/application-status";
import { useCuratorAuth } from "@/hooks/curator/auth/use-auth";
import { useCuratorProviderList } from "@/hooks/curator/provider-list/use-provider-list";
import { useCuratorProviderApproval } from "@/hooks/curator/provider-approval/use-provider-approval";

export function useCuratorProviderDetails() {
  const params = useParams();
  const email = decodeURIComponent(params.email as string);

  const { isAuthenticated, router } = useCuratorAuth();

  const { provider, isLoading } = useCuratorProviderList(
    email,
    isAuthenticated,
  );

  const { isActionLoading, successMessage, handleApprove, handleReject } =
    useCuratorProviderApproval(email);

  return {
    provider,
    isLoading,
    isActionLoading,
    successMessage,
    isAuthenticated,
    handleApprove,
    handleReject,
    getStatusColor,
    router,
  };
}
