"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { ProviderDetails } from "@/lib/types/provider";
import { PartnerDetailsTab } from "@/lib/types/partners";
import { PROVIDER_STATUS_CONFIG } from "@/lib/constants/components/modals/provider-details";

import { useProviderData } from "./use-provider-data";
import { useProviderSchools } from "./use-provider-schools";
import { useProviderPartners } from "./use-provider-partners";
import { useProviderModals } from "./use-provider-modals";

export const useProviderDetails = ({
  isOpen,
  providerEmail,
  providerProp,
  onShowApproveModal,
  onShowRejectModal,
}: {
  isOpen: boolean;
  providerEmail: string;
  providerProp: ProviderDetails | undefined;
  onShowApproveModal?: (email: string) => void;
  onShowRejectModal?: (email: string) => void;
}) => {
  const pathname = usePathname();

  const { provider, isQueryLoading, invalidateProvider } = useProviderData(providerEmail, providerProp);
  const schools = useProviderSchools(isOpen, providerEmail, provider);
  const partners = useProviderPartners(isOpen, providerEmail, provider, invalidateProvider);
  const modals = useProviderModals(providerEmail, onShowApproveModal, onShowRejectModal);

  const [activeTab, setActiveTab] = useState<PartnerDetailsTab>(
    pathname === ROUTES.curator.providers ? "overview" : "schools",
  );

  useEffect(() => {
    if (isOpen) {
      setActiveTab(
        pathname === ROUTES.curator.providers ? "overview" : "schools",
      );
      schools.setSchoolSearchQuery("");
      partners.setPartnerSearchQuery("");
    }
  }, [isOpen, pathname, schools.setSchoolSearchQuery, partners.setPartnerSearchQuery]);

  const applicationStatusConfig = useMemo(() => {
    if (!provider?.applicationStatus) return null;
    return (
      PROVIDER_STATUS_CONFIG[provider.applicationStatus as keyof typeof PROVIDER_STATUS_CONFIG] ||
      PROVIDER_STATUS_CONFIG.PENDING
    );
  }, [provider?.applicationStatus]);

  return {
    provider,
    isQueryLoading,
    activeTab,
    setActiveTab,
    ...schools,
    ...partners,
    ...modals,
    isLoadingSchools: isQueryLoading,
    isLoadingPartners: isQueryLoading,
    applicationStatusConfig,
  };
};
