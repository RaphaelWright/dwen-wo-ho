"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ROUTES } from "@/lib/constants/routes";
import { providersService } from "@/services/providers";
import { formatProviderName } from "@/lib/utils/formatProviderName";
import { ProviderDetails } from "@/lib/types/provider";

// ─── Fetcher ─────────────────────────────────────────────────────────────────

async function fetchProviderDetails(email: string): Promise<ProviderDetails> {
  const provider = await providersService.getProvider(email);
  if (provider) return provider;
  throw new Error("Failed to load provider details");
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCuratorProviderDetails() {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    if (typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("refreshToken");
      return !!refreshToken;
    }
    return null;
  });
  const params = useParams();
  const router = useRouter();
  const email = decodeURIComponent(params.email as string);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        router.replace(ROUTES.provider.auth);
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
    }
  }, [router]);

  const tryFallbackData = useCallback((): ProviderDetails | null => {
    if (typeof window !== "undefined") {
      const fallbackDataStr = sessionStorage.getItem(`provider_${email}`);
      if (fallbackDataStr) {
        try {
          const fallbackData = JSON.parse(fallbackDataStr);
          return {
            id: fallbackData.email || "",
            email: fallbackData.email || "",
            fullName: formatProviderName(
              fallbackData.providerName || "",
              fallbackData.providerTitle,
            ),
            providerTitle: fallbackData.providerTitle || undefined,
            professionalTitle: fallbackData.specialty || "",
            officePhoneNumber: fallbackData.officePhoneNumber || undefined,
            applicationStatus:
              (fallbackData.applicationStatus as
                | "PENDING"
                | "APPROVED"
                | "REJECTED") || "PENDING",
            status:
              (fallbackData.applicationStatus as
                | "PENDING"
                | "APPROVED"
                | "REJECTED") || "PENDING",
            profileImage: fallbackData.profilePhotoURL || undefined,
            createdAt: fallbackData.applicationDate || new Date().toISOString(),
            updatedAt: fallbackData.applicationDate || new Date().toISOString(),
          };
        } catch {
          // ignore
        }
      }
    }
    return null;
  }, [email]);

  const {
    data: providerData,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["curator-provider-details", email],
    queryFn: () => fetchProviderDetails(email),
    enabled: isAuthenticated === true && !!email,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  // Use fallback data if query failed
  const provider = providerData ?? tryFallbackData();

  // Set error message if query fails and no fallback
  useEffect(() => {
    if (queryError && !provider) {
      setErrorMessage("Failed to load provider details. Please try again.");
    }
  }, [queryError, provider]);

  // Clear session storage on successful fetch
  useEffect(() => {
    if (providerData && typeof window !== "undefined") {
      sessionStorage.removeItem(`provider_${email}`);
    }
  }, [providerData, email]);

  const handleApprove = async () => {
    setIsActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await providersService.approveProvider(email);

      if (response?.success) {
        setSuccessMessage("Provider approved successfully!");
        // Refresh the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setErrorMessage(response.message || "Failed to approve provider");
      }
    } catch (error: any) {
      const errorMsg =
        error?.message || "Failed to approve provider. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    setIsActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await providersService.rejectProvider(email);

      if (response?.success) {
        setSuccessMessage("Provider rejected successfully!");
        // Refresh the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setErrorMessage(response.message || "Failed to reject provider");
      }
    } catch (error: any) {
      const errorMsg =
        error?.message || "Failed to reject provider. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

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
