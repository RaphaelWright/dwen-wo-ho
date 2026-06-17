"use client";

import { useState, useRef, useCallback } from "react";
import { SchoolIcon } from "@/lib/types/entities/school";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";

import type { SchoolTab } from "@/lib/types/components/curator/school-details/school-details";

export function useSchoolUI() {
  const [activeTab, setActiveTab] = useState<SchoolTab>("patients");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showAddIconWizard, setShowAddIconWizard] = useState(false);
  const [selectedProviderEmail, setSelectedProviderEmail] = useState("");
  const [editingIcon, setEditingIcon] = useState<SchoolIcon | null>(null);

  const handleTabChange = useCallback((tab: SchoolTab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setAppliedSearchQuery("");
    setActiveFilter(null);
  }, []);

  const handleProviderClick = useCallback((provider: { email: string }) => {
    setSelectedProviderEmail(provider.email);
    setShowProviderModal(true);
  }, []);

  return {
    activeTab,
    handleTabChange,
    searchQuery,
    setSearchQuery,
    appliedSearchQuery,
    setAppliedSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    searchInputRef,
    showEditModal,
    setShowEditModal,
    showDisableModal,
    setShowDisableModal,
    showProviderModal,
    setShowProviderModal,
    showAddIconWizard,
    setShowAddIconWizard,
    selectedProviderEmail,
    setSelectedProviderEmail,
    editingIcon,
    setEditingIcon,
    handleProviderClick,
    activeFilter,
    setActiveFilter,
  };
}
