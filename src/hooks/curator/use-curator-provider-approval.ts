"use client";

import { useState } from "react";
import { curatorProvidersService } from "@/services/curator-providers";
import { getCleanErrorMessage } from "@/lib/utils/auth-error";

export function useCuratorProviderApproval(email: string) {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleApprove = async () => {
    setIsActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await curatorProvidersService.approveProvider(email);

      if (response?.success) {
        setSuccessMessage("Provider approved successfully!");
        // Refresh the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setErrorMessage(response.message || "Failed to approve provider");
      }
    } catch (error: unknown) {
      setErrorMessage(
        getCleanErrorMessage(error) || "Failed to approve provider. Please try again.",
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    setIsActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await curatorProvidersService.rejectProvider(email);

      if (response?.success) {
        setSuccessMessage("Provider rejected successfully!");
        // Refresh the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setErrorMessage(response.message || "Failed to reject provider");
      }
    } catch (error: unknown) {
      setErrorMessage(
        getCleanErrorMessage(error) || "Failed to reject provider. Please try again.",
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    isActionLoading,
    errorMessage,
    successMessage,
    handleApprove,
    handleReject,
    setErrorMessage, // Export if needed for clearing
  };
}
