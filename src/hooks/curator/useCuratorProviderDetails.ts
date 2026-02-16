"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { formatProviderName } from "@/lib/utils/formatProviderName";
import { ProviderDetails } from "@/lib/types/provider";

export function useCuratorProviderDetails() {
  const [provider, setProvider] = useState<ProviderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const tryFallbackData = useCallback(() => {
    if (typeof window !== "undefined") {
      const fallbackDataStr = sessionStorage.getItem(`provider_${email}`);
      if (fallbackDataStr) {
        try {
          const fallbackData = JSON.parse(fallbackDataStr);
          setProvider({
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
          });
          setErrorMessage("");
          return;
        } catch {}
      }
    }
    setErrorMessage("Failed to load provider details. Please try again.");
  }, [email]);

  const loadProvider = useCallback(async () => {
    setIsLoading(true);
    try {
      const refreshToken = localStorage.getItem("refreshToken") || "";

      const response = await api(ENDPOINTS.provider(email), {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });

      if (response.success) {
        setProvider(response.data);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(`provider_${email}`);
        }
      } else {
        setErrorMessage("Failed to load provider details");
        tryFallbackData();
      }
    } catch (error: unknown) {
      tryFallbackData();
    } finally {
      setIsLoading(false);
    }
  }, [email, tryFallbackData]);

  useEffect(() => {
    if (isAuthenticated === true) {
      loadProvider();
    }
  }, [isAuthenticated, loadProvider]);

  const handleApprove = async () => {
    setIsActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const refreshToken = localStorage.getItem("refreshToken") || "";
      const response = await api(ENDPOINTS.approveProvider(email), {
        method: "PUT",
        headers: { Authorization: `Bearer ${refreshToken}` },
      });

      if (response.success) {
        setSuccessMessage("Provider approved successfully!");
        setProvider((prev) =>
          prev
            ? { ...prev, status: "APPROVED", applicationStatus: "APPROVED" }
            : null,
        );
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
      const refreshToken = localStorage.getItem("refreshToken") || "";
      const response = await api(ENDPOINTS.rejectProvider(email), {
        method: "PUT",
        headers: { Authorization: `Bearer ${refreshToken}` },
      });

      if (response.success) {
        setSuccessMessage("Provider rejected successfully!");
        setProvider((prev) =>
          prev
            ? { ...prev, status: "REJECTED", applicationStatus: "REJECTED" }
            : null,
        );
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
