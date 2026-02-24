"use client";

import { useState, useEffect, useMemo } from "react";
import { useProvidersQuery } from "@/hooks/queries/useProvidersQuery";
import { useSchools } from "@/hooks/queries/useSchoolsQuery";
import { usePartnersList } from "@/hooks/queries/usePartnersQuery";
import {
  AssociatedSchool,
  AssociatedPartner,
  ProviderDetails,
} from "@/lib/types/provider";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { toast } from "@/components/ui/sonner";
import { School } from "@/lib/types/school";
import { useQueryClient } from "@tanstack/react-query";
import {
  formatProviderName,
  getProviderTitle,
} from "@/lib/utils/formatProviderName";
import { ProviderDetailsTab } from "@/lib/types/modals";

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
  const { useProvider, approveProvider, rejectProvider } = useProvidersQuery();
  const { data: providerData, isLoading: isQueryLoading } =
    useProvider(providerEmail);
  const { data: allSchools = [] } = useSchools();
  const { data: allPartnersData = [] } = usePartnersList();
  const queryClient = useQueryClient();

  const allPartners: AssociatedPartner[] = useMemo(
    () =>
      allPartnersData.map(
        (p: { id: string | number; name: string; logo?: string }) => ({
          id: String(p.id),
          name: p.name,
          logo: p.logo,
          isAssociated: false,
        }),
      ),
    [allPartnersData],
  );

  const [activeTab, setActiveTab] = useState<ProviderDetailsTab>("schools");
  const [associatedSchools, setAssociatedSchools] = useState<
    AssociatedSchool[]
  >([]);
  const [availableSchools, setAvailableSchools] = useState<AssociatedSchool[]>(
    [],
  );
  const [associatedPartners, setAssociatedPartners] = useState<
    AssociatedPartner[]
  >([]);
  const [availablePartners, setAvailablePartners] = useState<
    AssociatedPartner[]
  >([]);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [partnerSearchQuery, setPartnerSearchQuery] = useState("");
  const [schoolToAdd, setSchoolToAdd] = useState<AssociatedSchool | null>(null);
  const [schoolToRemove, setSchoolToRemove] = useState<AssociatedSchool | null>(
    null,
  );
  const [partnerToAdd, setPartnerToAdd] = useState<AssociatedPartner | null>(
    null,
  );
  const [partnerToRemove, setPartnerToRemove] =
    useState<AssociatedPartner | null>(null);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isLoadingPartners, setIsLoadingPartners] = useState(false);
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [isRemovingSchool, setIsRemovingSchool] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const provider: ProviderDetails | null = providerData
    ? {
        id: providerData.id || providerData.email,
        email: providerData.email,
        fullName: formatProviderName(
          providerData.providerName,
          providerData.providerTitle,
        ),
        providerTitle:
          getProviderTitle(
            providerData.providerName,
            providerData.providerTitle,
          ) || undefined,
        professionalTitle: providerData.specialty || "",
        profileImage: providerData.profilePhotoURL || undefined,
        status: providerData.status || providerData.bio || undefined,
        officePhoneNumber: providerData.officePhoneNumber || undefined,
        specialties: providerData.specialty
          ? [providerData.specialty]
          : undefined,
        createdAt: providerData.applicationDate,
        updatedAt: providerData.lastActive || providerData.applicationDate,
        applicationStatus: providerData.applicationStatus,
        applicationDate: providerData.applicationDate,
      }
    : (providerProp ?? null);

  const loadProviderSchools = async () => {
    setIsLoadingSchools(true);
    try {
      await queryClient.invalidateQueries({
        queryKey: ["providers", providerEmail],
      });
      await queryClient.refetchQueries({
        queryKey: ["providers", providerEmail],
      });

      const response = await api(
        `${ENDPOINTS.provider(providerEmail)}?_t=${Date.now()}`,
      );
      if (response?.success && response.data) {
        const providerSchools = response.data.schools || [];
        const associatedIds = new Set(
          providerSchools.map((s: School | { id: string | number }) =>
            String(s.id),
          ),
        );

        const associated: AssociatedSchool[] = providerSchools.map(
          (s: School) => ({
            id: String(s.id),
            name: s.name,
            logo: s.logo,
            isAssociated: true,
          }),
        );

        const available: AssociatedSchool[] = allSchools
          .filter((s) => {
            const schoolId = String(s.id);
            return !associatedIds.has(schoolId);
          })
          .map((s) => ({
            id: String(s.id),
            name: s.name,
            logo: s.logo,
            isAssociated: false,
          }));

        setAssociatedSchools(associated);
        setAvailableSchools(available);
      }
    } catch {
      // Background error
    } finally {
      setIsLoadingSchools(false);
    }
  };

  const loadProviderPartners = async (
    partnersList: AssociatedPartner[] = allPartners,
  ) => {
    setIsLoadingPartners(true);
    try {
      const response = await api(ENDPOINTS.provider(providerEmail));
      if (response?.success && response.data) {
        const providerPartners = response.data.partners || [];
        const associatedIds = new Set(
          providerPartners.map((p: { id: string | number }) => String(p.id)),
        );

        const associated: AssociatedPartner[] = providerPartners.map(
          (p: { id: string | number; name: string; logo?: string }) => ({
            id: String(p.id),
            name: p.name,
            logo: p.logo,
            isAssociated: true,
          }),
        );

        const available: AssociatedPartner[] =
          partnersList.length > 0
            ? partnersList.filter((p) => !associatedIds.has(p.id))
            : [];

        setAssociatedPartners(associated);
        setAvailablePartners(available);
      }
    } catch {
      // Background error
    } finally {
      setIsLoadingPartners(false);
    }
  };

  useEffect(() => {
    if (isOpen && providerEmail) {
      loadProviderSchools();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, providerEmail]);

  useEffect(() => {
    if (isOpen && providerEmail && allSchools.length > 0) {
      loadProviderSchools();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSchools.length, isOpen, providerEmail]);

  useEffect(() => {
    if (isOpen && providerEmail && allPartners.length > 0) {
      loadProviderPartners(allPartners);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPartners.length, isOpen, providerEmail]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("schools");
      setSchoolSearchQuery("");
      setPartnerSearchQuery("");
    }
  }, [isOpen]);

  const filteredAvailableSchools = useMemo(() => {
    if (!schoolSearchQuery.trim()) return availableSchools;
    const query = schoolSearchQuery.toLowerCase();
    return availableSchools.filter((school) =>
      school.name.toLowerCase().includes(query),
    );
  }, [availableSchools, schoolSearchQuery]);

  const filteredAvailablePartners = useMemo(() => {
    if (!partnerSearchQuery.trim()) return availablePartners;
    const query = partnerSearchQuery.toLowerCase();
    return availablePartners.filter((partner) =>
      partner.name.toLowerCase().includes(query),
    );
  }, [availablePartners, partnerSearchQuery]);

  const handleAddSchool = async (school: AssociatedSchool) => {
    if (provider?.applicationStatus === "REJECTED") {
      toast.error("Cannot add schools to rejected providers");
      setSchoolToAdd(null);
      return;
    }

    const providerId = provider?.id || providerEmail;
    setIsAddingSchool(true);
    try {
      const response = await api(ENDPOINTS.addSchoolToProvider(providerId), {
        method: "POST",
        body: JSON.stringify({ schoolId: school.id }),
      });

      if (response?.success) {
        toast.success(`School "${school.name}" added successfully`);
        await queryClient.invalidateQueries({
          queryKey: ["providers", providerEmail],
        });
        await loadProviderSchools();
        setSchoolToAdd(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      const errorMessage = err.message || "Failed to add school";
      if (
        errorMessage.includes("Provider is not active") ||
        errorMessage.includes("not active")
      ) {
        toast.error("Cannot add schools to rejected providers");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsAddingSchool(false);
    }
  };

  const handleRemoveSchool = async (school: AssociatedSchool) => {
    const providerId = provider?.id || providerEmail;
    setIsRemovingSchool(true);
    try {
      const response = await api(
        ENDPOINTS.removeSchoolFromProvider(providerId, school.id),
        {
          method: "DELETE",
        },
      );

      if (response?.success) {
        toast.success(`School "${school.name}" removed successfully`);
        await queryClient.invalidateQueries({
          queryKey: ["providers", providerEmail],
        });
        await loadProviderSchools();
        setSchoolToRemove(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to remove school");
    } finally {
      setIsRemovingSchool(false);
    }
  };

  const handleAddPartner = async (partner: AssociatedPartner) => {
    try {
      const providerId = provider?.id || providerEmail;
      const response = await api(
        ENDPOINTS.addPartnerToProvider(partner.id, providerId),
        {
          method: "POST",
        },
      );

      if (response?.success) {
        toast.success(`Partner "${partner.name}" added successfully`);
        await loadProviderPartners(allPartners);
        setPartnerToAdd(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to add partner");
    }
  };

  const handleRemovePartner = async (partner: AssociatedPartner) => {
    try {
      const providerId = provider?.id || providerEmail;
      const response = await api(
        ENDPOINTS.removePartnerFromProvider(partner.id, providerId),
        {
          method: "POST",
        },
      );

      if (response?.success) {
        toast.success(`Partner "${partner.name}" removed successfully`);
        await loadProviderPartners(allPartners);
        setPartnerToRemove(null);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to remove partner");
    }
  };

  const handleApproveClick = () => {
    if (onShowApproveModal) {
      onShowApproveModal(providerEmail);
    } else {
      setShowApproveModal(true);
    }
  };

  const handleRejectClick = () => {
    if (onShowRejectModal) {
      onShowRejectModal(providerEmail);
    } else {
      setShowRejectModal(true);
    }
  };

  const handleApproveConfirm = () => {
    setShowApproveModal(false);
    approveProvider(providerEmail, {
      onSettled: () => {
        if (providerData) {
          loadProviderSchools();
        }
      },
    });
  };

  const handleRejectConfirm = () => {
    setShowRejectModal(false);
    rejectProvider(providerEmail, {
      onSettled: () => {
        if (providerData) {
          loadProviderSchools();
        }
      },
    });
  };

  const applicationStatusConfig = useMemo(() => {
    if (!provider?.applicationStatus) return null;

    const statusConfig = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
      },
      APPROVED: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
      },
      REJECTED: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
      },
    };

    return (
      statusConfig[provider.applicationStatus as keyof typeof statusConfig] ||
      statusConfig.PENDING
    );
  }, [provider?.applicationStatus]);

  return {
    provider,
    isQueryLoading,
    activeTab,
    setActiveTab,
    associatedSchools,
    availableSchools,
    associatedPartners,
    availablePartners,
    allPartners,
    schoolSearchQuery,
    setSchoolSearchQuery,
    partnerSearchQuery,
    setPartnerSearchQuery,
    schoolToAdd,
    setSchoolToAdd,
    schoolToRemove,
    setSchoolToRemove,
    partnerToAdd,
    setPartnerToAdd,
    partnerToRemove,
    setPartnerToRemove,
    isLoadingSchools,
    isLoadingPartners,
    isAddingSchool,
    isRemovingSchool,
    showApproveModal,
    setShowApproveModal,
    showRejectModal,
    setShowRejectModal,
    filteredAvailableSchools,
    filteredAvailablePartners,
    handleAddSchool,
    handleRemoveSchool,
    handleAddPartner,
    handleRemovePartner,
    handleApproveClick,
    handleRejectClick,
    handleApproveConfirm,
    handleRejectConfirm,
    applicationStatusConfig,
  };
};
