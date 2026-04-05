"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import MainContent from "@/components/provider/new/main-content";
import UrgentPanel from "@/components/shared/urgent-panel";
import NotificationsSheet from "@/components/shared/notification-sheet";
import ProfileModal from "@/components/modals/new-provider/new-provider-modal";
import EditFieldDialog from "@/components/provider/new/edit-field-dialog";
import SchoolsSidebar from "@/components/provider/new/schools-side-bar";
import LiquidGlassNavbar from "@/components/ui/liquid-glass-navbar";
import LiquidGlass from "@/components/ui/liquid-glass";
import useProviderDashboard from "@/hooks/provider/use-provider-dashboard";
import { SearchDropdown } from "@/components/shared/search-dropdown";
import { PatientSuggestionCard } from "@/components/shared/patient-suggestion-card";
import {
  useProviderDashboardMobile,
  type MobilePanel,
} from "@/hooks/provider/use-provider-dashboard-mobile";
import { useProviderUrgentPatients } from "@/hooks/queries/use-provider-dashboard";
import useUserQuery from "@/hooks/queries/use-user-profile";
import { useProviderSearchConfig } from "@/hooks/provider/use-provider-search-config";
import type { UrgentPatient } from "@/components/shared/urgent-card";
import { cn } from "@/lib/utils";
import type { PatientCase } from "@/lib/types/api/patient-results";
import ProviderActivityLog from "@/components/provider/provider-activity-log";
import { DEFAULT_PROVIDER_USER_INFO } from "@/lib/constants/mock-data";
import { useNotificationWebSocket } from "@/hooks/use-notification-websocket";
import ProviderNavbar from "@/components/provider/new/nav-bar";
import { isProviderNotificationSheetOpenAtom } from "@/atoms/notification";

function ProviderNotificationsSheet({
  notifications,
  setNotifOpen,
  markAllRead,
  markOneRead,
  deleteNotification,
  clearAllNotifications,
  router,
}: {
  notifications: any[];
  setNotifOpen: (open: boolean) => void;
  markAllRead: () => void;
  markOneRead: (id: string | number) => void;
  deleteNotification: (id: string | number) => void;
  clearAllNotifications: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <NotificationsSheet
      notifications={notifications}
      openAtom={isProviderNotificationSheetOpenAtom}
      onOpenChange={setNotifOpen}
      markAllRead={markAllRead}
      markOneRead={markOneRead}
      deleteOne={deleteNotification}
      clearAllNotifications={clearAllNotifications}
      onNavigate={(link) => router.push(link as any)}
      variant="provider"
    />
  );
}

export default function ProviderHomePage() {
  const router = useRouter();

  // Initialize WebSocket for real-time notifications
  useNotificationWebSocket();

  // Prevent hydration mismatch - only render after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Pending verification state ─────────────────────────
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    title: string;
    specialty: string;
    profileImage?: string;
    timeAgo: string;
  }>({
    ...DEFAULT_PROVIDER_USER_INFO,
    profileImage: undefined,
  });

  // Get user profile for approval status
  const { getProfileQuery } = useUserQuery({
    refetchInterval: showPendingModal ? 5000 : undefined,
    enabled: hasToken,
  });

  // Check for token and set up user info from pendingUser storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setHasToken(!!token);

      const pendingUser = localStorage.getItem("pendingUser");
      if (pendingUser) {
        try {
          const userData = JSON.parse(pendingUser);
          setUserInfo({
            name: `${userData.title ? `${userData.title} ` : ""}${userData.providerName || "Provider"}`,
            title:
              userData.professionalTitle ||
              userData.specialty ||
              "Health Provider",
            specialty: userData.specialty || "",
            profileImage:
              userData.profilePhotoURL || userData.profileURL || undefined,
            timeAgo: "Recently",
          });
          setShowPendingModal(true);
        } catch {
          setShowPendingModal(true);
        }
      }
    }
  }, []);

  // Update user info from profile query and determine approval status
  useEffect(() => {
    if (getProfileQuery.data) {
      const data = getProfileQuery.data;
      let timeAgo = "Recently";
      const createdDate =
        data.applicationTimestamp ||
        data.createdAt ||
        data.created_at ||
        data.joinedAt;

      if (createdDate && typeof createdDate === "string") {
        const date = new Date(createdDate);
        const now = new Date();
        const diffInSeconds = Math.floor(
          (now.getTime() - date.getTime()) / 1000,
        );

        if (diffInSeconds < 60) {
          timeAgo = "Just now";
        } else if (diffInSeconds < 3600) {
          const mins = Math.floor(diffInSeconds / 60);
          timeAgo = `${mins} minute${mins > 1 ? "s" : ""} ago`;
        } else if (diffInSeconds < 86400) {
          const hours = Math.floor(diffInSeconds / 3600);
          timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else {
          const days = Math.floor(diffInSeconds / 86400);
          timeAgo = `${days} day${days > 1 ? "s" : ""} ago`;
        }
      }

      setUserInfo({
        name: `${data.title ? `${String(data.title)} ` : ""}${String(data.providerName || data.name || "Provider")}`,
        title: String(
          data.professionalTitle || data.specialty || "Health Provider",
        ),
        specialty: String(data.specialty || ""),
        profileImage:
          (data.profilePhotoURL as string | undefined) ||
          (data.profileURL as string | undefined) ||
          (data.profileImage as string | undefined) ||
          undefined,
        timeAgo,
      });

      // Standardize on applicationStatus field per API JSON
      const isPending = data.applicationStatus === "PENDING";
      const isRejected = data.applicationStatus === "REJECTED";
      setShowPendingModal(isPending || isRejected);

      // Set provider ID for WebSocket subscription manager
      const providerId = data.id || data.providerId || data.email;
      if (providerId && typeof providerId === "string") {
        localStorage.setItem("providerId", providerId);
        // subscriptionManager.setProviderId is now handled by useNotificationWebSocket
        // Keeping localStorage set for backward compatibility
      }
    }
  }, [getProfileQuery.data]);

  const isApproved =
    getProfileQuery.data?.status === "APPROVED" ||
    getProfileQuery.data?.applicationStatus === "APPROVED";
  const isLoading = getProfileQuery.isLoading;

  // ── Dashboard hooks (MUST be called before any conditional returns) ──
  const dashboard = useProviderDashboard();
  const {
    searchQuery,
    setSearchQuery,
    setAppliedSearchQuery,
    setActiveSchool,
    setActiveStatus,
    topSuggestions,
    quickFilters,
    notifications,
    setNotifOpen,
    markAllRead,
    markOneRead,
    clearAllNotifications,
    deleteNotification,
    localActiveFilters,
    toggleFilter,
    removeFilter,
    clearFilters,
    // Additional props needed for child components
    activeSchool,
    handleSelectSchool,
    schools,
    filteredPatients,
    activeStatus,
    countForChip,
    profileOpen,
    setProfileOpen,
    profileData,
    openEdit,
    unreadCount,
    theme,
    editOpen,
    setEditOpen,
    editFieldKey,
    editFieldLabel,
    editValue,
    setEditValue,
    saveEdit,
    uploadAvatar,
    isUploadingAvatar,
    isInitLoading,
  } = dashboard;

  // Centralized search config
  const searchConfig = useProviderSearchConfig({
    searchQuery,
    setSearchQuery,
    appliedSearchQuery: "",
    setAppliedSearchQuery,
    localActiveFilters,
    toggleFilter,
    removeFilter,
    clearFilters,
    filteredPatients,
  });

  const {
    activePanel,
    setActivePanel,
    searchOpen,
    setSearchOpen,
    mobileTabs,
    panelVariants,
    panelTransition,
  } = useProviderDashboardMobile(setProfileOpen);

  // Live urgent patients from API
  const { data: urgentData } = useProviderUrgentPatients();
  const urgentPatients: UrgentPatient[] = (urgentData?.patients ?? []).map(
    (p) => ({
      id: p.patientId,
      patientResultId: String(p.patientId),
      patientName: p.patientName,
      schoolId: p.schoolId,
      schoolName: p.schoolName,
      time: p.time ? new Date(p.time).toLocaleDateString() : "Recently",
      lockinScore: p.score ?? 0,
      avatarUrl: p.avatarUrl as string | undefined,
    }),
  );

  // ── Early returns (AFTER all hooks are called) ──
  if (!isApproved && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Your provider account is pending approval. Please wait for an
          administrator to verify your credentials.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Prevent hydration mismatch - show loading until mounted
  if (!mounted) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden h-dvh min-[1065px]:h-screen min-[1065px]:overflow-hidden flex flex-col w-full px-0.5 min-[1065px]:px-0">
      <ProviderNavbar
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        profileData={profileData}
        unreadCount={unreadCount}
        setProfileOpen={setProfileOpen}
        setNotifOpen={setNotifOpen}
        theme={theme}
        searchConfig={searchConfig}
        quickFilters={quickFilters}
      />

      {/* ── Desktop: 3-column grid ── */}
      <div className="hidden min-[1065px]:grid grid-cols-[18%_60%_22%] h-full overflow-hidden w-full">
        <div className="h-full overflow-hidden">
          <SchoolsSidebar
            activeSchool={activeSchool}
            handleSelectSchool={handleSelectSchool}
            schools={schools}
            filteredPatients={filteredPatients}
            isLoading={isInitLoading}
          />
        </div>
        <div className="h-full overflow-hidden">
          <MainContent
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            filteredPatients={filteredPatients}
            countForChip={countForChip}
            isLoading={isInitLoading}
          />
        </div>
        <div className="h-full overflow-hidden">
          <UrgentPanel patients={urgentPatients} />
        </div>
      </div>

      {/* ── Mobile: single panel ── */}
      <div
        className={cn(
          "min-[1065px]:hidden flex-1 relative",
          searchOpen ? "overflow-visible" : "overflow-hidden",
        )}
      >
        {/* Search overlay & backdrop */}
        <AnimatePresence>
          {searchOpen && (
            <>
              {/* Click-outside backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-60 bg-background/20"
                onClick={() => setSearchOpen(false)}
              />

              {/* Search bar container */}
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-0 left-0 right-0 z-70 p-3 h-full"
                onClick={() => setSearchOpen(false)}
              >
                <div
                  className="max-w-sm mx-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LiquidGlass
                    cornerRadius={20}
                    blur={16}
                    padding="0px 0px"
                    style={{ overflow: "visible" }}
                  >
                    <SearchDropdown
                      searchQuery={searchConfig.searchQuery}
                      onSearchChange={searchConfig.setSearchQuery}
                      placeholders={["Search patients...", "Search schools…"]}
                      suggestions={searchConfig.topSuggestions}
                      quickFilters={quickFilters}
                      activeFilters={searchConfig.localActiveFilters}
                      autoFocus={true}
                      fullMobileHeight={true}
                      onSelectOption={(val) => {
                        searchConfig.setSearchQuery(val);
                        setSearchOpen(false);
                      }}
                      onFilterChange={searchConfig.onFilterChange}
                      onRemoveFilter={searchConfig.removeFilter}
                      getSuggestionValue={searchConfig.getSuggestionValue}
                      renderSuggestion={(p: PatientCase) => (
                        <PatientSuggestionCard
                          name={p.patientName}
                          score={p.score ?? 0}
                          status={p.status}
                          time={
                            p.time ? new Date(p.time).toLocaleDateString() : ""
                          }
                        />
                      )}
                      onSubmitSearch={searchConfig.onSubmitSearch}
                      onSuggestionAction={searchConfig.onSuggestionAction}
                      onResetSearch={() => {
                        searchConfig.onResetSearch();
                        setActiveSchool("all");
                        setActiveStatus("all");
                      }}
                    />
                  </LiquidGlass>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Panel content */}
        <AnimatePresence mode="wait">
          {activePanel === "schools" && (
            <motion.div
              key="schools"
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={panelTransition}
              className="absolute inset-0 h-screen overflow-y-auto"
            >
              <SchoolsSidebar
                activeSchool={activeSchool}
                handleSelectSchool={handleSelectSchool}
                schools={schools}
                filteredPatients={filteredPatients}
                isLoading={isInitLoading}
              />
            </motion.div>
          )}
          {activePanel === "patients" && (
            <motion.div
              key="patients"
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={panelTransition}
              className="absolute inset-0 overflow-hidden h-screen"
            >
              <MainContent
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
                filteredPatients={filteredPatients}
                countForChip={countForChip}
                isLoading={isInitLoading}
              />
            </motion.div>
          )}
          {activePanel === "urgent" && (
            <motion.div
              key="urgent"
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={panelTransition}
              className="absolute inset-0 h-screen overflow-y-auto"
            >
              <UrgentPanel
                patients={urgentPatients}
                isLoading={isInitLoading}
              />
            </motion.div>
          )}
          {activePanel === "activity" && (
            <motion.div
              key="activity"
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={panelTransition}
              className="absolute inset-0 h-screen overflow-y-auto bg-background"
            >
              <ProviderActivityLog />
            </motion.div>
          )}
        </AnimatePresence>

        <LiquidGlassNavbar
          tabs={mobileTabs}
          activeTab={activePanel}
          onTabChange={(id) => setActivePanel(id as MobilePanel)}
          layoutId="mobile-glass-pill"
          className="absolute!"
        />
      </div>
      <ProviderNotificationsSheet
        notifications={notifications}
        setNotifOpen={setNotifOpen}
        markAllRead={markAllRead}
        markOneRead={markOneRead}
        deleteNotification={deleteNotification}
        clearAllNotifications={clearAllNotifications}
        router={router}
      />
      <ProfileModal
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        profileData={profileData}
        openEdit={openEdit}
        schools={schools}
      />
      <EditFieldDialog
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        editFieldKey={editFieldKey}
        editFieldLabel={editFieldLabel}
        editValue={editValue}
        setEditValue={setEditValue}
        saveEdit={saveEdit}
        uploadAvatar={uploadAvatar}
        isUploadingAvatar={isUploadingAvatar}
        profileData={profileData}
      />
    </div>
  );
}
