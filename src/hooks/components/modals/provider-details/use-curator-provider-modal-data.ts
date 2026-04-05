"use client";

import { useMemo } from "react";
import { useProvidersQuery } from "@/hooks/queries/use-provider";
import { Provider, ProviderDetails } from "@/lib/types/provider";
import {
  formatProviderName,
  getProviderTitle,
} from "@/lib/utils/formatProviderName";

export const useCuratorProviderModalData = (
  providerEmail: string,
  providerProp: ProviderDetails | undefined,
) => {
  const { useProvider, invalidateProvider } = useProvidersQuery({
    enabled: false,
  });

  const { data: providerData, isLoading: isQueryLoading } =
    useProvider(providerEmail);

  const provider: ProviderDetails | null = useMemo(() => {
    if (!providerData && !providerProp) return null;
    const data = providerData || providerProp!;

    return {
      id: data.id || data.email,
      email: data.email,
      fullName:
        (data as ProviderDetails).fullName ||
        formatProviderName(
          (data as Provider).providerName || data.email,
          data.providerTitle,
        ),
      providerTitle:
        getProviderTitle(
          (data as Provider).providerName || "",
          data.providerTitle,
        ) || undefined,
      professionalTitle: (data as Provider).specialty || "",
      profileImage: (data as Provider).profilePhotoURL || undefined,
      status: data.status || data.bio || undefined,
      officePhoneNumber: data.officePhoneNumber || undefined,
      specialties: (data as Provider).specialty
        ? [(data as Provider).specialty as string]
        : undefined,
      createdAt: (data as Provider).applicationDate,
      updatedAt:
        (data as Provider).lastActive || (data as Provider).applicationDate,
      applicationStatus: (data as Provider).applicationStatus,
      applicationDate: (data as Provider).applicationDate,
      schools: data.schools,
      partners: data.partners,
    };
  }, [providerData, providerProp]);

  return { provider, isQueryLoading, invalidateProvider };
};
