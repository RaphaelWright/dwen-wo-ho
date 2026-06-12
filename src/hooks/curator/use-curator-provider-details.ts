"use client";

import { useParams } from "next/navigation";
import { getStatusColor } from "@/lib/utils/provider-utils";
import { useCuratorAuth } from "@/hooks/curator/use-curator-auth";
import { useCuratorProviderList } from "@/hooks/curator/use-curator-provider-list";
import { useCuratorProviderApproval } from "@/hooks/curator/use-curator-provider-approval";

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
