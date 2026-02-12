"use client";

import { useState, useCallback, useMemo } from "react";
import { useProvidersQuery } from "@/hooks/queries/useProvidersQuery";
import { Provider, Provider as ApiProvider } from "@/types/provider";
import {
  formatProviderName,
  getProviderTitle,
} from "@/lib/utils/formatProviderName";

export function useCuratorProviders() {
  const [filter, setFilter] = useState("All");
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedProviderEmail, setSelectedProviderEmail] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [modalProviderEmail, setModalProviderEmail] = useState("");
  const [currentAction, setCurrentAction] = useState<
    "approving" | "rejecting" | null
  >(null);

  const {
    providers,
    isLoading,
    isError,
    error,
    approveProvider,
    rejectProvider,
  } = useProvidersQuery();

  const providersList: Provider[] = useMemo(
    () =>
      (providers?.data || []).map((provider: ApiProvider) => ({
        id: provider.email,
        email: provider.email,
        providerName: provider.providerName,
        providerTitle: provider.providerTitle || undefined,
        profilePhotoURL: provider.profilePhotoURL || undefined,
        specialty: provider.specialty || "",
        applicationStatus: provider.applicationStatus,
        applicationDate: provider.applicationDate,
      })),
    [providers],
  );

  const handleProviderSelect = useCallback((providerEmail: string) => {
    setSelectedProviderEmail(providerEmail);
    setShowProviderModal(true);
  }, []);

  const handleShowApproveModal = useCallback((email: string) => {
    setModalProviderEmail(email);
    setShowApproveModal(true);
  }, []);

  const handleShowRejectModal = useCallback((email: string) => {
    setModalProviderEmail(email);
    setShowRejectModal(true);
  }, []);

  const handleApproveConfirm = useCallback(() => {
    setShowApproveModal(false);
    setCurrentAction("approving");
    approveProvider(modalProviderEmail, {
      onSettled: () => {
        setCurrentAction(null);
        setModalProviderEmail("");
      },
    });
  }, [approveProvider, modalProviderEmail]);

  const handleRejectConfirm = useCallback(() => {
    setShowRejectModal(false);
    setCurrentAction("rejecting");
    rejectProvider(modalProviderEmail, {
      onSettled: () => {
        setCurrentAction(null);
        setModalProviderEmail("");
      },
    });
  }, [rejectProvider, modalProviderEmail]);

  const getProviderName = useCallback(
    (email: string) => {
      const provider = providersList.find((p) => p.email === email);
      if (!provider) return "";
      return formatProviderName(provider.providerName, provider.providerTitle);
    },
    [providersList],
  );

  const filteredProviders = useMemo(
    () =>
      providersList.filter((provider) => {
        if (filter === "All") return true;
        return (
          provider?.applicationStatus?.toLowerCase() === filter?.toLowerCase()
        );
      }),
    [providersList, filter],
  );

  const filterOptions = useMemo(
    () => [
      {
        id: "All",
        label: "All Providers",
        color: "bg-[#955aa4]",
        hoverColor: "hover:bg-gray-200",
        inactiveColor: "bg-gray-100 text-gray-700",
        count: providersList.length,
      },
      {
        id: "PENDING",
        label: "Pending",
        color: "bg-yellow-500",
        hoverColor: "hover:bg-gray-200",
        inactiveColor: "bg-gray-100 text-gray-700",
        count: providersList.filter((p) => p.applicationStatus === "PENDING")
          .length,
      },
      {
        id: "APPROVED",
        label: "Approved",
        color: "bg-green-600",
        hoverColor: "hover:bg-gray-200",
        inactiveColor: "bg-gray-100 text-gray-700",
        count: providersList.filter((p) => p.applicationStatus === "APPROVED")
          .length,
      },
      {
        id: "REJECTED",
        label: "Rejected",
        color: "bg-red-600",
        hoverColor: "hover:bg-gray-200",
        inactiveColor: "bg-gray-100 text-gray-700",
        count: providersList.filter((p) => p.applicationStatus === "REJECTED")
          .length,
      },
    ],
    [providersList],
  );

  const selectedProvider = useMemo(() => {
    const foundProvider = providersList.find(
      (p) => p.email === selectedProviderEmail,
    );
    if (!foundProvider) return undefined;
    return {
      id: foundProvider.email,
      email: foundProvider.email,
      fullName: formatProviderName(
        foundProvider.providerName,
        foundProvider.providerTitle,
      ),
      providerTitle:
        getProviderTitle(
          foundProvider.providerName,
          foundProvider.providerTitle,
        ) || undefined,
      professionalTitle: foundProvider.specialty || undefined,
      profileImage: foundProvider.profilePhotoURL || undefined,
      officePhoneNumber: foundProvider.officePhoneNumber || undefined,
      createdAt: foundProvider.applicationDate,
      updatedAt: foundProvider.lastActive || foundProvider.applicationDate,
      applicationStatus: foundProvider.applicationStatus,
    };
  }, [providersList, selectedProviderEmail]);

  return {
    // Query state
    isLoading,
    isError,
    error,

    // Data
    providersList,
    filteredProviders,
    filterOptions,
    selectedProvider,

    // Filter
    filter,
    setFilter,

    // Modal state
    showProviderModal,
    setShowProviderModal,
    selectedProviderEmail,
    showApproveModal,
    setShowApproveModal,
    showRejectModal,
    setShowRejectModal,
    modalProviderEmail,
    setModalProviderEmail,
    currentAction,

    // Handlers
    handleProviderSelect,
    handleShowApproveModal,
    handleShowRejectModal,
    handleApproveConfirm,
    handleRejectConfirm,
    getProviderName,
  };
}
