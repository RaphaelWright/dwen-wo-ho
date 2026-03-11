"use client";

import { useState, useRef, useCallback } from "react";
import { SchoolIcon } from "@/lib/types/school";

export type CuratorSchoolTabType = "patients" | "icons" | "providers";

export function useSchoolUI() {
  const [activeTab, setActiveTab] = useState<CuratorSchoolTabType>("patients");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showAddIconModal, setShowAddIconModal] = useState(false);
  const [selectedProviderEmail, setSelectedProviderEmail] = useState("");
  const [editingIcon, setEditingIcon] = useState<SchoolIcon | null>(null);

  const handleTabChange = useCallback((tab: CuratorSchoolTabType) => {
    setActiveTab(tab);
    setSearchQuery("");
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
    isSearchOpen,
    setIsSearchOpen,
    searchInputRef,
    showEditModal,
    setShowEditModal,
    showDisableModal,
    setShowDisableModal,
    showProviderModal,
    setShowProviderModal,
    showAddIconModal,
    setShowAddIconModal,
    selectedProviderEmail,
    setSelectedProviderEmail,
    editingIcon,
    setEditingIcon,
    handleProviderClick,
  };
}
