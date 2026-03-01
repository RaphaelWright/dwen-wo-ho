"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@/lib/constants/routes";
import { performLogout } from "@/lib/auth-utils";
import { hasValidToken } from "@/lib/utils/getUserType";

export function useCuratorLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      if (!hasValidToken()) {
        router.replace(ROUTES.provider.auth);
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
    }
  }, [router]);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showReachModal, setShowReachModal] = useState(false);

  const isSchoolDetailPage = pathname?.match(/\/curator\/schools\/\d+$/);
  const isPatientDetailPage = pathname?.match(
    /\/curator\/schools\/\d+\/patients\/\d+$/,
  );

  // Handlers
  const handleLogout = useCallback(() => {
    performLogout(queryClient, ROUTES.provider.auth);
  }, [queryClient]);

  // Modal open helpers (close create modal, open specific)
  const openSchoolModal = useCallback(() => {
    setShowCreateModal(false);
    setShowSchoolModal(true);
  }, []);

  const openMemberModal = useCallback(() => {
    setShowCreateModal(false);
    setShowMemberModal(true);
  }, []);

  const openPartnerModal = useCallback(() => {
    setShowCreateModal(false);
    setShowPartnerModal(true);
  }, []);

  const openReachModal = useCallback(() => {
    setShowCreateModal(false);
    setShowReachModal(true);
  }, []);

  // Modal close helpers (close specific, reopen create)
  const closeSchoolModal = useCallback(() => {
    setShowSchoolModal(false);
    setShowCreateModal(true);
  }, []);

  const closeMemberModal = useCallback(() => {
    setShowMemberModal(false);
    setShowCreateModal(true);
  }, []);

  const closePartnerModal = useCallback(() => {
    setShowPartnerModal(false);
    setShowCreateModal(true);
  }, []);

  const closeReachModal = useCallback(() => {
    setShowReachModal(false);
    setShowCreateModal(true);
  }, []);

  return {
    // Auth
    mounted,
    isAuthenticated,

    // Handlers
    handleLogout,

    // Create modal
    showCreateModal,
    setShowCreateModal,

    // Sub-modals
    showSchoolModal,
    showMemberModal,
    showPartnerModal,
    showReachModal,

    // Modal openers
    openSchoolModal,
    openMemberModal,
    openPartnerModal,
    openReachModal,

    // Modal closers
    closeSchoolModal,
    closeMemberModal,
    closePartnerModal,
    closeReachModal,
  };
}
