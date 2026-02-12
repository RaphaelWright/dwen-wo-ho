"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { useAtom } from "jotai";
import { curatorPartnersAtom, Partner } from "@/atoms/curator-partners";

export function useCuratorPartners() {
  const [partnerState, setPartnerState] = useAtom(curatorPartnersAtom);
  const { partners: cachedPartners, isLoading: atomLoading } = partnerState;

  const [searchQuery, setSearchQuery] = useState("");
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | number>(
    "",
  );
  const [selectedPartner, setSelectedPartner] = useState<Partner | undefined>();

  const loadPartners = useCallback(
    async (isBackground = false) => {
      if (!isBackground) {
        setPartnerState((prev) => ({ ...prev, isLoading: true }));
      }
      try {
        const response = await api(ENDPOINTS.partners);
        if (response?.success && response.data) {
          const partnersList = Array.isArray(response.data)
            ? response.data
            : [];
          setPartnerState((prev) => ({
            ...prev,
            partners: partnersList,
            lastUpdated: Date.now(),
          }));
        }
      } catch {
        // User will see empty state or cached state
      } finally {
        if (!isBackground) {
          setPartnerState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    },
    [setPartnerState],
  );

  // Initial load: if we have cached partners, show them and refresh in background
  useEffect(() => {
    const hasCache = cachedPartners.length > 0;
    loadPartners(hasCache);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPartners = useMemo(
    () =>
      cachedPartners.filter(
        (partner) =>
          partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          partner.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          partner.slogan?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [cachedPartners, searchQuery],
  );

  const handlePartnerClick = useCallback((partner: Partner) => {
    setSelectedPartnerId(partner.id);
    setSelectedPartner(partner);
    setShowPartnerModal(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowPartnerModal(false);
    setSelectedPartnerId("");
    setSelectedPartner(undefined);
    loadPartners(true); // Refresh cache in background after modal close
  }, [loadPartners]);

  return {
    // Data
    cachedPartners,
    filteredPartners,
    atomLoading,

    // Search
    searchQuery,
    setSearchQuery,

    // Modal state
    showPartnerModal,
    selectedPartnerId,
    selectedPartner,

    // Handlers
    handlePartnerClick,
    handleModalClose,
  };
}
