"use client";

import { useState } from "react";
import { curatorProvidersService } from "@/services/curator/providers";
import { getCleanErrorMessage } from "@/lib/utils/auth/error";
import { toast } from "sonner";

export function useCuratorProviderApproval(email: string) {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleApprove = async () => {
    setIsActionLoading(true);
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
        toast.error(response.message || "Failed to approve provider");
      }
    } catch (error: unknown) {
      toast.error(
        getCleanErrorMessage(error) ||
          "Failed to approve provider. Please try again.",
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    setIsActionLoading(true);
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
        toast.error(response.message || "Failed to reject provider");
      }
    } catch (error: unknown) {
      toast.error(
        getCleanErrorMessage(error) ||
          "Failed to reject provider. Please try again.",
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    isActionLoading,
    successMessage,
    handleApprove,
    handleReject,
  };
}
