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

  const {
    provider,
    isLoading,
    errorMessage: dataError,
  } = useCuratorProviderList(email, isAuthenticated);

  const {
    isActionLoading,
    errorMessage: actionError,
    successMessage,
    handleApprove,
    handleReject,
  } = useCuratorProviderApproval(email);

  // Combine errors or prioritize one
  const errorMessage = dataError || actionError;

  return {
    provider,
    isLoading,
    isActionLoading,
    errorMessage,
    successMessage,
    isAuthenticated,
    handleApprove,
    handleReject,
    getStatusColor,
    router,
  };
}
