"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { curatorProvidersService } from "@/services/curator-providers";
import { formatProviderName } from "@/lib/utils/formatProviderName";
import { ProviderDetails } from "@/lib/types/provider";

async function fetchProviderDetails(email: string): Promise<ProviderDetails> {
  const result = await curatorProvidersService.getProvider(email);
  if (result) return result;
  throw new Error("Failed to load provider details");
}

export function useCuratorProviderList(
  email: string,
  isAuthenticated: boolean | null,
) {
  const [errorMessage, setErrorMessage] = useState("");

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
            profilePhotoURL: fallbackData.profilePhotoURL || undefined,
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

  return {
    provider,
    isLoading,
    errorMessage,
    setErrorMessage,
  };
}
