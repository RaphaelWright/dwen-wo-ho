"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { ProviderDetails } from "@/lib/types/entities/provider";
import { PartnerDetailsTab } from "@/lib/types/entities/partners";
import { PROVIDER_STATUS_CONFIG } from "@/lib/constants/components/curator/providers/provider-details-panel";

import { useProviderPanelData } from "./use-panel-data";
import { useProviderPanelSchools } from "./use-panel-schools";
import { useProviderPanelPartners } from "./use-panel-partners";
import { useProviderPanelState } from "./use-panel-state";

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

  const { provider, isQueryLoading, invalidateProvider } = useProviderPanelData(
    providerEmail,
    providerProp,
  );
  const schools = useProviderPanelSchools(isOpen, providerEmail, provider);
  const partners = useProviderPanelPartners(
    isOpen,
    providerEmail,
    provider,
    invalidateProvider,
  );
  const modals = useProviderPanelState(
    providerEmail,
    onShowApproveModal,
    onShowRejectModal,
  );

  const [activeTab, setActiveTab] = useState<PartnerDetailsTab>(
    pathname === ROUTES.curator.providers ? "overview" : "schools",
  );

  // Reset the active tab and searches while rendering when the modal opens or
  // the route changes, instead of mirroring those props into state via an
  // effect.
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (isOpen !== prevIsOpen || pathname !== prevPathname) {
    setPrevIsOpen(isOpen);
    setPrevPathname(pathname);
    if (isOpen) {
      setActiveTab(
        pathname === ROUTES.curator.providers ? "overview" : "schools",
      );
      schools.setSchoolSearchQuery("");
      partners.setPartnerSearchQuery("");
    }
  }

  const applicationStatusConfig = useMemo(() => {
    if (!provider?.applicationStatus) return null;
    return (
      PROVIDER_STATUS_CONFIG[
        provider.applicationStatus as keyof typeof PROVIDER_STATUS_CONFIG
      ] || PROVIDER_STATUS_CONFIG.PENDING
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
