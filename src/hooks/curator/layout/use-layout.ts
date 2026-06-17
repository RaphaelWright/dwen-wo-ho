"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { useAuthQuery } from "@/hooks/queries/use-auth";
import {
  hasValidToken,
  getStoredUserType,
} from "@/lib/utils/auth/get-user-type";
import { useCuratorSummary } from "@/hooks/queries/use-curator";

export function useCuratorLayout() {
  const router = useRouter();
  const { logout } = useAuthQuery();

  const { data: summary } = useCuratorSummary();

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  // Client-side guard kept intentionally: auth state lives in localStorage, which
  // is unavailable to Next.js middleware / server redirects, so this check must
  // run in the browser after mount.
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      if (!hasValidToken() || getStoredUserType() !== "curator") {
        router.replace(ROUTES.provider.auth);
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
    }
  }, [router]);

  // Modal state
  const [showCreateLauncher, setShowCreateLauncher] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showReachOverview, setShowReachOverviewModal] = useState(false);

  // Handlers
  const handleLogout = useCallback(() => {
    logout(ROUTES.provider.auth);
  }, [logout]);

  // Modal open helpers (close create modal, open specific)
  const openSchoolModal = useCallback(() => {
    setShowCreateLauncher(false);
    setShowSchoolModal(true);
  }, []);

  const openMemberModal = useCallback(() => {
    setShowCreateLauncher(false);
    setShowMemberModal(true);
  }, []);

  const openPartnerModal = useCallback(() => {
    setShowCreateLauncher(false);
    setShowPartnerModal(true);
  }, []);

  const openReachOverview = useCallback(() => {
    setShowCreateLauncher(false);
    setShowReachOverviewModal(true);
  }, []);

  // Modal close helpers (close specific, reopen create)
  const closeSchoolModal = useCallback(() => {
    setShowSchoolModal(false);
    setShowCreateLauncher(true);
  }, []);

  const closeMemberModal = useCallback(() => {
    setShowMemberModal(false);
    setShowCreateLauncher(true);
  }, []);

  const closePartnerModal = useCallback(() => {
    setShowPartnerModal(false);
    setShowCreateLauncher(true);
  }, []);

  const closeReachOverview = useCallback(() => {
    setShowReachOverviewModal(false);
    setShowCreateLauncher(true);
  }, []);

  return {
    // Auth
    mounted,
    isAuthenticated,

    // Summary counts
    schoolCount: summary?.schoolCount ?? 0,
    providerCount: summary?.providerCount ?? 0,
    partnerCount: summary?.partnerCount ?? 0,

    // Handlers
    handleLogout,

    // Create modal
    showCreateLauncher,
    setShowCreateLauncher,

    // Sub-modals
    showSchoolModal,
    showMemberModal,
    showPartnerModal,
    showReachOverview,

    // Modal openers
    openSchoolModal,
    openMemberModal,
    openPartnerModal,
    openReachOverview,

    // Modal closers
    closeSchoolModal,
    closeMemberModal,
    closePartnerModal,
    closeReachOverview,
  };
}
