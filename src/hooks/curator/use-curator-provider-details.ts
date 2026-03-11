"use client";

import { useParams } from "next/navigation";
import { getStatusColor } from "@/lib/utils/provider-utils";
import { useCuratorAuth } from "@/hooks/curator/use-curator-auth";
import { useProviderData } from "@/hooks/curator/use-provider-data";
import { useProviderActions } from "@/hooks/curator/use-provider-actions";

export function useCuratorProviderDetails() {
  const params = useParams();
  const email = decodeURIComponent(params.email as string);

  const { isAuthenticated, router } = useCuratorAuth();

  const {
    provider,
    isLoading,
    errorMessage: dataError,
  } = useProviderData(email, isAuthenticated);

  const {
    isActionLoading,
    errorMessage: actionError,
    successMessage,
    handleApprove,
    handleReject,
  } = useProviderActions(email);

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
