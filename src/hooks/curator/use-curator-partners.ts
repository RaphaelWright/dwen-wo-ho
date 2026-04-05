"use client";

import { useState, useCallback, useMemo } from "react";
import usePartnerQuery from "@/hooks/queries/use-partner";
import type { Partner } from "@/lib/types/partners";

export function useCuratorPartners() {
  const { usePartnersList } = usePartnerQuery();
  const { data: cachedPartners = [], isLoading: atomLoading } =
    usePartnersList();

  const [searchQuery, setSearchQuery] = useState("");
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | number>(
    "",
  );
  const [selectedPartner, setSelectedPartner] = useState<Partner | undefined>();

  const filteredPartners = useMemo(
    () =>
      cachedPartners.filter(
        (partner: Partner) =>
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
  }, []);

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
