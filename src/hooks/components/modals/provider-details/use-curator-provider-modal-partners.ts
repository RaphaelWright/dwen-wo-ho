"use client";

import { useState, useMemo } from "react";
import usePartnerQuery from "@/hooks/queries/use-partner";
import { AssociatedPartner } from "@/lib/types/partners";
import { ProviderDetails } from "@/lib/types/provider";

export const useCuratorProviderModalPartners = (
  isOpen: boolean,
  providerEmail: string,
  provider: ProviderDetails | null,
  invalidateProvider: (email: string) => Promise<void>,
) => {
  const { usePartnersList, addProvider, removeProvider } = usePartnerQuery();
  const { data: allPartnersData = [] } = usePartnersList({ enabled: isOpen });

  const [partnerSearchQuery, setPartnerSearchQuery] = useState("");
  const [partnerToAdd, setPartnerToAdd] = useState<AssociatedPartner | null>(null);
  const [partnerToRemove, setPartnerToRemove] = useState<AssociatedPartner | null>(null);

  const associatedPartners: AssociatedPartner[] = useMemo(() => {
    const providerPartners = provider?.partners || [];
    return providerPartners.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      logo: p.logo,
      isAssociated: true,
    }));
  }, [provider?.partners]);

  const availablePartners: AssociatedPartner[] = useMemo(() => {
    const associatedIds = new Set(associatedPartners.map((p) => p.id));
    return allPartnersData
      .filter((p: any) => !associatedIds.has(String(p.id)))
      .map((p: any) => ({
        id: String(p.id),
        name: p.name,
        logo: p.logo,
        isAssociated: false,
      }));
  }, [allPartnersData, associatedPartners]);

  const filteredAvailablePartners = useMemo(() => {
    if (!partnerSearchQuery.trim()) return availablePartners;
    const query = partnerSearchQuery.toLowerCase();
    return availablePartners.filter((partner) =>
      partner.name.toLowerCase().includes(query),
    );
  }, [availablePartners, partnerSearchQuery]);

  const handleAddPartner = async (partner: AssociatedPartner) => {
    const providerId = String(provider?.id || providerEmail);
    await addProvider({ partnerId: String(partner.id), providerId });
    await invalidateProvider(providerEmail);
    setPartnerToAdd(null);
  };

  const handleRemovePartner = async (partner: AssociatedPartner) => {
    const providerId = String(provider?.id || providerEmail);
    await removeProvider({ partnerId: String(partner.id), providerId });
    await invalidateProvider(providerEmail);
    setPartnerToRemove(null);
  };

  return {
    associatedPartners,
    availablePartners,
    filteredAvailablePartners,
    partnerSearchQuery,
    setPartnerSearchQuery,
    partnerToAdd,
    setPartnerToAdd,
    partnerToRemove,
    setPartnerToRemove,
    handleAddPartner,
    handleRemovePartner,
  };
};
